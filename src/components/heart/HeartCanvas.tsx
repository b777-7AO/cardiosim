"use client";

// The camera rig is a mutable ref that the render loop writes to every frame,
// outside React state by design (React Three Fiber's recommended pattern).
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from "react";
import * as THREE from "three";
import { MODEL_GRAIN, MODEL_PATH, MODEL_RECOLOR, MODEL_YAW_DEG, asset, sutureMarkers, type SutureMarker } from "@/config/site";

/**
 * Interactive viewer for the CardioSim heart.
 *
 * The model is any GLB at MODEL_PATH. It is centred and scaled to a fixed
 * size on load, and markers are placed by raycasting, so swapping the file
 * needs no changes here.
 */

export type ViewTarget = {
  yaw: number; // degrees
  pitch: number; // degrees
  zoom: number; // fraction of default distance
  focus: [number, number, number]; // bounding-box half-size units
};

export type HeartHandle = {
  zoomBy: (factor: number) => void;
  rotateBy: (deg: number) => void;
  goTo: (v: ViewTarget) => void;
  reset: () => void;
};

type Props = {
  handle?: Ref<HeartHandle>;
  showMarkers?: boolean;
  showBounds?: boolean;
  selectedMarker?: string | null;
  onSelectMarker?: (id: string | null) => void;
  autoRotate?: boolean;
  /** Fullscreen mode: wheel and pinch zoom are captured by the viewer. */
  captureZoom?: boolean;
  /** Extra yaw in radians driven from outside (hero scroll). */
  scrollYaw?: React.RefObject<number>;
  /** Play the entrance move once the model is ready. */
  intro?: boolean;
  /** Camera distance multiplier, for viewers with chrome overlapping the model. */
  distance?: number;
  /** Shifts the model up (+) or down (-) in the frame, in world units. */
  lift?: number;
  active?: boolean;
  onReady?: () => void;
  className?: string;
  label: string;
};

const SIZE = 2.1; // world size the model's largest dimension is normalised to
const BASE_DIST = 6.2;
const MIN_ZOOM = 0.42;
const MAX_ZOOM = 1.3;
const DEG = Math.PI / 180;
const IDLE_AFTER = 3.2; // seconds without input before auto-rotation resumes

type Rig = {
  yaw: number;
  pitch: number;
  zoom: number;
  focus: THREE.Vector3;
  tYaw: number;
  tPitch: number;
  tZoom: number;
  tFocus: THREE.Vector3;
  lastInput: number;
  dragging: boolean;
  intro: number; // 0..1
};

type Placed = SutureMarker & { position: THREE.Vector3; normal: THREE.Vector3 };

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Heart({
  rig,
  showMarkers,
  showBounds,
  selectedMarker,
  onSelectMarker,
  autoRotate,
  scrollYaw,
  onReady,
  distance,
  lift,
}: {
  rig: React.RefObject<Rig>;
  showMarkers: boolean;
  showBounds: boolean;
  selectedMarker: string | null;
  onSelectMarker?: (id: string | null) => void;
  autoRotate: boolean;
  scrollYaw?: React.RefObject<number>;
  onReady?: () => void;
  distance: number;
  lift: number;
}) {
  const { scene } = useGLTF(asset(MODEL_PATH));
  const group = useRef<THREE.Group>(null);
  const { camera, invalidate } = useThree();
  const reduced = useMemo(() => prefersReducedMotion(), []);

  // Normalise the model: centre it, scale to SIZE, give it a silicone finish.
  const { model, half, markers } = useMemo(() => {
    const root = scene.clone(true);
    // Turn the raw model so its anatomical front faces +Z before measuring it.
    const turned = new THREE.Group();
    turned.rotation.y = MODEL_YAW_DEG * DEG;
    turned.add(root);
    turned.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(turned);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const s = SIZE / Math.max(size.x, size.y, size.z);
    turned.position.copy(centre).multiplyScalar(-s);
    turned.scale.setScalar(s);

    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const src = mesh.material as THREE.MeshStandardMaterial;
      const mat = new THREE.MeshPhysicalMaterial({
        map: src.map ?? null,
        color: src.map ? 0xffffff : src.color,
        normalMap: src.normalMap ?? null,
        normalScale: new THREE.Vector2(1.6, 1.6),
        roughness: 0.56,
        metalness: 0,
        envMapIntensity: 0.55,
      });
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Two shader additions, both off when their config is null:
      //  - recolour: the product has exactly two colours. A generated texture
      //    drifts (washed red, pink-tinted white), so each texel is snapped to
      //    the real red or white by its saturation, keeping its shading.
      //  - grain: the fine moulded surface texture of the silicone, added as a
      //    procedural bump so close-ups stay sharp at any zoom.
      const recolor = MODEL_RECOLOR && src.map ? MODEL_RECOLOR : null;
      const grain = MODEL_GRAIN;
      if (recolor || grain) {
        const v3 = (hex: string) => {
          const c = new THREE.Color(hex);
          return `vec3(${c.r.toFixed(4)}, ${c.g.toFixed(4)}, ${c.b.toFixed(4)})`;
        };
        const grainFreq = grain ? (grain.density * s).toFixed(4) : "1.0";
        mat.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader
            .replace("#include <common>", "#include <common>\nvarying vec3 csObjPos;")
            .replace("#include <begin_vertex>", "#include <begin_vertex>\ncsObjPos = position;");
          shader.fragmentShader = shader.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
              varying vec3 csObjPos;
              float csIsRed = 1.0;
              vec3 csHash3(vec3 p) {
                p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
                return fract(sin(p) * 43758.5453123);
              }
              // Distance to the nearest cell point: reads as a pebbled grain.
              float csCells(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                float d = 1.0;
                for (int x = -1; x <= 1; x++)
                  for (int y = -1; y <= 1; y++)
                    for (int z = -1; z <= 1; z++) {
                      vec3 g = vec3(float(x), float(y), float(z));
                      vec3 r = g + csHash3(i + g) - f;
                      d = min(d, dot(r, r));
                    }
                return sqrt(d);
              }
              float csHeight(vec3 p) {
                float coarse = 1.0 - smoothstep(0.0, 0.85, csCells(p));
                float fine = 1.0 - smoothstep(0.0, 0.9, csCells(p * 2.3 + 7.1));
                return coarse * 0.65 + fine * 0.35;
              }`,
            )
            .replace(
              "#include <map_fragment>",
              recolor
                ? `#include <map_fragment>
                {
                  vec3 c = diffuseColor.rgb;
                  float mx = max(c.r, max(c.g, c.b));
                  float mn = min(c.r, min(c.g, c.b));
                  float sat = (mx - mn) / max(mx, 1e-4);
                  csIsRed = smoothstep(0.5, 0.63, sat);
                  vec3 asRed = ${v3(recolor.red)} * clamp(0.5 + 0.62 * mx, 0.62, 1.1);
                  vec3 asWhite = ${v3(recolor.white)} * clamp(0.35 + 0.7 * mn, 0.75, 1.0);
                  diffuseColor.rgb = mix(asWhite, asRed, csIsRed);
                }`
                : "#include <map_fragment>",
            )
            .replace(
              "#include <normal_fragment_maps>",
              grain
                ? `#include <normal_fragment_maps>
                {
                  vec3 q = csObjPos * ${grainFreq};
                  // Fade the grain out before it gets smaller than a pixel.
                  float fade = 1.0 - smoothstep(0.3, 0.8, length(fwidth(q)));
                  if (fade > 0.0) {
                    float h = csHeight(q);
                    vec3 sx = dFdx(-vViewPosition);
                    vec3 sy = dFdy(-vViewPosition);
                    vec3 r1 = cross(sy, normal);
                    vec3 r2 = cross(normal, sx);
                    float det = dot(sx, r1) * faceDirection;
                    float amount = ${grain.depth.toFixed(4)} * fade * mix(0.45, 1.0, csIsRed);
                    vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2) * amount;
                    normal = normalize(abs(det) * normal - grad);
                  }
                }`
                : "#include <normal_fragment_maps>",
            );
        };
      }
      mesh.material = mat;
    });

    const wrapper = new THREE.Group();
    wrapper.add(turned);
    wrapper.updateMatrixWorld(true);
    const half = size.clone().multiplyScalar(s / 2);

    // Place markers on the surface by raycasting from outside.
    const ray = new THREE.Raycaster();
    const reach = half.length() * 3;
    const markers: Placed[] = [];
    for (const m of sutureMarkers) {
      const az = m.from[0] * DEG;
      const el = m.from[1] * DEG;
      const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
      const aim = new THREE.Vector3(m.aim[0] * half.x, m.aim[1] * half.y, m.aim[2] * half.z);
      const origin = aim.clone().addScaledVector(dir, reach);
      ray.set(origin, dir.clone().negate());
      const hit = ray.intersectObject(wrapper, true)[0];
      if (!hit) continue;
      const normal = hit.face
        ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
        : dir.clone();
      // Blend the face normal with the ray direction so a marker never lies
      // edge-on to the viewer on a steep fold.
      normal.lerp(dir, 0.6).normalize();
      markers.push({ ...m, position: hit.point.clone().addScaledVector(normal, 0.026), normal });
    }
    return { model: wrapper, half, markers };
  }, [scene]);

  useEffect(() => {
    onReady?.();
    invalidate();
  }, [onReady, invalidate, model]);

  // Selecting a marker turns its surface normal toward the camera.
  useEffect(() => {
    const r = rig.current;
    if (!selectedMarker) return;
    const m = markers.find((x) => x.id === selectedMarker);
    if (!m) return;
    const n = m.normal;
    const yaw = -Math.atan2(n.x, n.z);
    const pitch = THREE.MathUtils.clamp(Math.atan2(n.y, Math.hypot(n.x, n.z)), -1.1, 1.1);
    // Take the short way round.
    const delta = Math.atan2(Math.sin(yaw - r.yaw), Math.cos(yaw - r.yaw));
    r.tYaw = r.yaw + delta;
    r.tPitch = pitch;
    r.tZoom = 0.62;
    r.tFocus.copy(m.position).multiplyScalar(0.8);
    r.lastInput = performance.now() / 1000;
    invalidate();
  }, [selectedMarker, markers, rig, invalidate]);

  const focusWorld = useMemo(() => new THREE.Vector3(), []);
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "XYZ"), []);

  useFrame((state, dt) => {
    const r = rig.current;
    const g = group.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const now = state.clock.elapsedTime;

    if (r.intro < 1) r.intro = Math.min(1, r.intro + d / (reduced ? 0.01 : 1.8));
    const ease = 1 - Math.pow(1 - r.intro, 3);

    const idle = performance.now() / 1000 - r.lastInput > IDLE_AFTER;
    if (autoRotate && !reduced && idle && !r.dragging && !selectedMarker) {
      r.tYaw += d * 0.22;
    }

    const k = 1 - Math.exp(-d * (r.dragging ? 18 : 5.5));
    r.yaw += (r.tYaw - r.yaw) * k;
    r.pitch += (r.tPitch - r.pitch) * k;
    r.zoom += (r.tZoom - r.zoom) * k;
    r.focus.lerp(r.tFocus, k);

    const extraYaw = scrollYaw?.current ?? 0;
    g.rotation.set(r.pitch, r.yaw + extraYaw - (1 - ease) * 0.9, 0, "XYZ");
    const float = reduced ? 0 : Math.sin(now * 0.7) * 0.018;
    g.position.y = float + (1 - ease) * -0.12;
    g.scale.setScalar(0.94 + ease * 0.06);

    // The focus point is given in model space; follow it through the rotation.
    euler.set(r.pitch, r.yaw + extraYaw, 0, "XYZ");
    focusWorld.copy(r.focus).applyEuler(euler);
    const dist = BASE_DIST * distance * r.zoom * (1 + (1 - ease) * 0.12);
    // The lift fades out as the camera moves in on a detail.
    const ty = focusWorld.y * 0.9 - lift * THREE.MathUtils.smoothstep(r.zoom, 0.5, 1);
    camera.position.set(focusWorld.x * 0.9, ty + 0.15 * r.zoom, dist);
    camera.lookAt(focusWorld.x * 0.9, ty, 0);

    const moving =
      r.intro < 1 ||
      r.dragging ||
      Math.abs(r.tYaw - r.yaw) > 1e-4 ||
      Math.abs(r.tPitch - r.pitch) > 1e-4 ||
      Math.abs(r.tZoom - r.zoom) > 1e-4;
    if (moving || !reduced) invalidate();
  });

  return (
    <group ref={group}>
      <primitive object={model} />
      {showMarkers &&
        markers.map((m, i) => (
          <Marker
            key={m.id}
            marker={m}
            index={i}
            selected={selectedMarker === m.id}
            onSelect={() => onSelectMarker?.(selectedMarker === m.id ? null : m.id)}
          />
        ))}
      {showBounds && <Bounds half={half} />}
    </group>
  );
}

const UP = new THREE.Vector3(0, 0, 1);

function Marker({
  marker,
  selected,
  onSelect,
}: {
  marker: Placed;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<THREE.Group>(null);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(UP, marker.normal), [marker.normal]);

  useEffect(() => {
    if (!hover) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hover]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const target = selected ? 1.35 : hover ? 1.18 : 1;
    const s = g.scale.x + (target - g.scale.x) * (1 - Math.exp(-dt * 14));
    g.scale.setScalar(s);
  });

  const stop = (e: ThreeEvent<PointerEvent | MouseEvent>) => e.stopPropagation();

  return (
    <group ref={ref} position={marker.position} quaternion={quat}>
      {/* generous invisible hit area */}
      <mesh
        onClick={(e) => {
          stop(e);
          onSelect();
        }}
        onPointerOver={(e) => {
          stop(e);
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
      >
        <circleGeometry args={[0.11, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <ringGeometry args={[0.052, 0.062, 48]} />
        <meshBasicMaterial color="#245A80" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <circleGeometry args={[0.052, 48]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={selected ? 1 : 0.9} />
      </mesh>
      <mesh position={[0, 0, 0.003]}>
        <circleGeometry args={[selected ? 0.036 : 0.024, 32]} />
        <meshBasicMaterial color="#245A80" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Thin envelope box with corner ticks, used by the "Proportions" view. */
function Bounds({ half }: { half: THREE.Vector3 }) {
  const geo = useMemo(() => {
    const box = new THREE.BoxGeometry(half.x * 2.04, half.y * 2.04, half.z * 2.04);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    return edges;
  }, [half]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#245A80" transparent opacity={0.55} toneMapped={false} />
    </lineSegments>
  );
}

function Studio() {
  return (
    <>
      <ambientLight intensity={0.08} />
      {/* Key light casts soft shadows so ridges, stubs and the open top read as depth. */}
      <directionalLight
        position={[-3.2, 4.6, 4.2]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.03}
        shadow-radius={6}
      >
        <orthographicCamera attach="shadow-camera" args={[-1.7, 1.7, 1.7, -1.7, 1, 14]} />
      </directionalLight>
      <directionalLight position={[4, 1.5, 2.5]} intensity={0.3} />
      <directionalLight position={[0, 3, -5]} intensity={0.55} />
      {/* Procedural softbox studio: no HDR download. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#f1f3f5"]} />
        <Lightformer form="rect" intensity={3.2} position={[-4, 4, 3]} scale={[6, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.4} position={[5, 1, 2]} scale={[3, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.8} position={[0, 6, -2]} scale={[8, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.3} position={[0, -5, 0]} scale={[10, 10, 1]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

export default function HeartCanvas({
  handle,
  showMarkers = false,
  showBounds = false,
  selectedMarker = null,
  onSelectMarker,
  autoRotate = true,
  captureZoom = false,
  scrollYaw,
  intro = true,
  distance = 1.1,
  lift = 0.06,
  active = true,
  onReady,
  className,
  label,
}: Props) {
  // Mutable camera/rotation state, read every frame. Created once.
  const [rigState] = useState<Rig>(() => ({
    yaw: -0.35,
    pitch: 0.06,
    zoom: 1,
    focus: new THREE.Vector3(),
    tYaw: -0.35,
    tPitch: 0.06,
    tZoom: 1,
    tFocus: new THREE.Vector3(),
    lastInput: -100,
    dragging: false,
    intro: intro ? 0 : 1,
  }));
  const rig = useRef(rigState);
  const wrap = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef(0);

  const touch = () => {
    rig.current.lastInput = performance.now() / 1000;
  };

  useImperativeHandle(handle, () => ({
    zoomBy(f) {
      const r = rig.current;
      r.tZoom = THREE.MathUtils.clamp(r.tZoom * f, MIN_ZOOM, MAX_ZOOM);
      touch();
    },
    rotateBy(deg) {
      rig.current.tYaw += deg * DEG;
      touch();
    },
    goTo(v) {
      const r = rig.current;
      const yaw = v.yaw * DEG;
      r.tYaw = r.yaw + Math.atan2(Math.sin(yaw - r.yaw), Math.cos(yaw - r.yaw));
      r.tPitch = v.pitch * DEG;
      r.tZoom = v.zoom;
      // focus arrives in half-size units; the model is SIZE tall
      r.tFocus.set(v.focus[0], v.focus[1], v.focus[2]).multiplyScalar(SIZE / 2);
      touch();
    },
    reset() {
      const r = rig.current;
      r.tYaw = r.yaw + Math.atan2(Math.sin(-0.35 - r.yaw), Math.cos(-0.35 - r.yaw));
      r.tPitch = 0.06;
      r.tZoom = 1;
      r.tFocus.set(0, 0, 0);
      touch();
    },
  }));

  // Wheel zoom only while the viewer owns the screen (fullscreen), so the
  // page keeps scrolling normally everywhere else.
  useEffect(() => {
    const el = wrap.current;
    if (!el || !captureZoom) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = rig.current;
      r.tZoom = THREE.MathUtils.clamp(r.tZoom * Math.exp(e.deltaY * 0.0012), MIN_ZOOM, MAX_ZOOM);
      touch();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [captureZoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    rig.current.dragging = true;
    touch();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const r = rig.current;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current) r.tZoom = THREE.MathUtils.clamp(r.tZoom * (pinch.current / dist), MIN_ZOOM, MAX_ZOOM);
      pinch.current = dist;
    } else {
      r.tYaw += dx * 0.0085;
      r.tPitch = THREE.MathUtils.clamp(r.tPitch + dy * 0.0085, -Math.PI / 2, Math.PI / 2);
    }
    touch();
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    pinch.current = 0;
    if (pointers.current.size === 0) rig.current.dragging = false;
    touch();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const r = rig.current;
    const step = 12 * DEG;
    if (e.key === "ArrowLeft") r.tYaw -= step;
    else if (e.key === "ArrowRight") r.tYaw += step;
    else if (e.key === "ArrowUp") r.tPitch = Math.max(-Math.PI / 2, r.tPitch - step);
    else if (e.key === "ArrowDown") r.tPitch = Math.min(Math.PI / 2, r.tPitch + step);
    else if (e.key === "+" || e.key === "=") r.tZoom = Math.max(MIN_ZOOM, r.tZoom * 0.88);
    else if (e.key === "-") r.tZoom = Math.min(MAX_ZOOM, r.tZoom / 0.88);
    else return;
    e.preventDefault();
    touch();
  };

  return (
    <div
      ref={wrap}
      className={className}
      role="application"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
      // Horizontal drags turn the model; vertical swipes still scroll the
      // page on touch screens unless the viewer is fullscreen.
      style={{ touchAction: captureZoom ? "none" : "pan-y", cursor: "grab" }}
    >
      <Canvas
        dpr={[1, 2]}
        shadows
        frameloop={active ? "demand" : "never"}
        camera={{ fov: 24, near: 0.1, far: 50, position: [0, 0.15, BASE_DIST] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          // Neutral tone mapping keeps the red saturated under bright studio light.
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1;
        }}
        onPointerMissed={() => onSelectMarker?.(null)}
      >
        <Suspense fallback={null}>
          <Studio />
          <Heart
            rig={rig}
            showMarkers={showMarkers}
            showBounds={showBounds}
            selectedMarker={selectedMarker}
            onSelectMarker={onSelectMarker}
            autoRotate={autoRotate}
            scrollYaw={scrollYaw}
            onReady={onReady}
            distance={distance}
            lift={lift}
          />
          <ContactShadows position={[0, -1.12, 0]} opacity={0.26} scale={5.2} blur={2.8} far={3} resolution={512} color="#3a2024" frames={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(asset(MODEL_PATH));

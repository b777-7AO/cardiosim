"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import type HeartCanvasType from "./HeartCanvas";

const HeartCanvas = dynamic(() => import("./HeartCanvas"), { ssr: false });

type Props = Omit<ComponentProps<typeof HeartCanvasType>, "active" | "onReady"> & {
  /** `className` must position the box (relative or absolute): the canvas fills it. */
  /** Static picture shown until the 3D model has loaded, and kept if WebGL is unavailable. */
  poster?: React.ReactNode;
  /** Mount the canvas straight away instead of waiting for it to approach the viewport. */
  eager?: boolean;
};

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Mounts the WebGL viewer only when it is near the viewport and stops its
 * render loop while it is off screen, so the hero and the explorer never
 * render at the same time.
 */
export function LazyHeart({ poster, eager = false, className, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!hasWebGL()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    if (eager) setMount(true);
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setMount(true), { rootMargin: "600px 0px" });
    const inView = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.02 });
    near.observe(el);
    inView.observe(el);
    return () => {
      near.disconnect();
      inView.disconnect();
    };
  }, [eager]);

  return (
    <div ref={ref} className={className}>
      {poster && (
        <div
          aria-hidden={ready}
          className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-700 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        >
          {poster}
        </div>
      )}
      {supported && mount && (
        <HeartCanvas
          {...rest}
          active={visible}
          onReady={() => setReady(true)}
          className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {!supported && !poster && (
        <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-mute">
          The 3D viewer needs WebGL, which is not available in this browser.
        </p>
      )}
    </div>
  );
}

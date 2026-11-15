"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { detailViews, sutureMarkers, type DetailView } from "@/config/site";
import type { HeartHandle } from "./heart/HeartCanvas";
import { LazyHeart } from "./heart/LazyHeart";
import { IconClose, IconCollapse, IconExpand, IconMinus, IconPlus, IconPoint, IconReset, IconRotateLeft, IconRotateRight } from "./Icons";

function ToolButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors ${
        pressed ? "bg-blue text-white" : "text-ink hover:bg-paper"
      }`}
    >
      {children}
    </button>
  );
}

export function Explorer() {
  const heart = useRef<HeartHandle>(null);
  const [view, setView] = useState<DetailView>(detailViews[0]);
  const [markersOn, setMarkersOn] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [full, setFull] = useState(false);

  const marker = sutureMarkers.find((m) => m.id === selected) ?? null;

  const choose = useCallback((v: DetailView) => {
    setView(v);
    setSelected(null);
    setMarkersOn(!!v.showMarkers);
    heart.current?.goTo(v);
  }, []);

  const backToFull = useCallback(() => {
    setSelected(null);
    setView(detailViews[0]);
    heart.current?.reset();
  }, []);

  const toggleMarkers = () => {
    setMarkersOn((on) => {
      if (on) setSelected(null);
      return !on;
    });
  };

  // The practice-areas section below can ask the viewer to show one area.
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const onArea = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setView(detailViews.find((v) => v.showMarkers) ?? detailViews[0]);
      setMarkersOn(true);
      setSelected(id);
      section.current?.scrollIntoView({ block: "start" });
    };
    window.addEventListener("cardiosim:area", onArea);
    return () => window.removeEventListener("cardiosim:area", onArea);
  }, []);

  // Fullscreen is a fixed overlay: it works on phones where the Fullscreen
  // API does not, and Escape closes it.
  useEffect(() => {
    if (!full) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);

  return (
    <section id="explorer" ref={section} className="border-y border-line bg-paper py-20 lg:py-28">
      <div className="frame">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <h2 className="h-section lg:col-span-6">See it from every side.</h2>
          <p className="lede lg:col-span-5 lg:col-start-8">
            Turn the model to see the front, the back and the open top, move in close on the surface and switch on the practice areas.
          </p>
        </div>

        <div
          className={
            full
              ? "fixed inset-0 z-50 flex flex-col bg-white"
              : "relative mt-10 flex flex-col overflow-hidden rounded-2xl border border-line bg-white lg:mt-14"
          }
        >
          <div className={`relative grid lg:grid-cols-[15.5rem_1fr] ${full ? "min-h-0 flex-1 grid-rows-[1fr_auto] lg:grid-rows-1" : "lg:h-[min(84svh,50rem)]"}`}>
            {/* Detail views */}
            <div className="order-2 border-t border-line lg:order-1 lg:border-r lg:border-t-0">
              <p className="hidden px-5 pb-3 pt-5 text-sm font-medium lg:block">Views</p>
              <ul className="no-scrollbar flex overflow-x-auto px-3 py-3 lg:block lg:px-0 lg:py-0" role="list">
                {detailViews.map((v) => {
                  const on = v.id === view.id && !selected;
                  return (
                    <li key={v.id} className="shrink-0 lg:border-t lg:border-line">
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => choose(v)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2 text-left text-sm transition-colors lg:rounded-none lg:px-5 lg:py-3.5 ${
                          on ? "bg-paper text-ink lg:bg-transparent" : "text-mute hover:text-ink"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`hidden h-px transition-all duration-300 lg:block ${on ? "w-5 bg-blue" : "w-2 bg-line"}`}
                        />
                        <span className={on ? "font-medium" : ""}>{v.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="hidden border-t border-line px-5 py-4 text-[0.8125rem] leading-relaxed text-mute lg:block" aria-live="polite">
                {view.caption}
              </p>
            </div>

            {/* Viewer */}
            <div className={`relative order-1 lg:order-2 ${full ? "min-h-0" : "h-[62svh] min-h-[22rem] lg:h-auto"}`}>
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_50%,#f3f5f8_0%,#ffffff_75%)]"
              />
              <LazyHeart
                handle={heart}
                intro={false}
                distance={1.34}
                lift={0.16}
                autoRotate={view.id === "full" && !markersOn}
                showMarkers={markersOn}
                showBounds={!!view.showBounds && !selected}
                selectedMarker={selected}
                onSelectMarker={setSelected}
                captureZoom={full}
                label="3D view of the CardioSim practice model. Drag or use the arrow keys to rotate, plus and minus to zoom."
                className="absolute inset-0"
              />

              <p className="pointer-events-none absolute left-4 top-4 max-w-[60%] text-[0.8125rem] leading-snug text-mute lg:hidden" aria-live="polite">
                {view.caption}
              </p>

              {full && (
                <button type="button" onClick={() => setFull(false)} className="btn btn-line btn-sm absolute right-4 top-4">
                  <IconCollapse /> Exit fullscreen
                </button>
              )}

              {marker && (
                <aside
                  key={marker.id}
                  aria-live="polite"
                  className={`panel-in absolute inset-x-3 bottom-[4.5rem] rounded-xl border border-line bg-white/95 p-4 backdrop-blur-sm sm:inset-x-auto sm:right-4 sm:w-[19rem] ${
                    full ? "sm:top-20 sm:bottom-auto" : "sm:top-4 sm:bottom-auto"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="tag mb-2.5">{marker.validated ? marker.kind : "Illustrative practice area"}</span>
                      <h3 className="text-base font-medium tracking-[-0.01em]">{marker.name}</h3>
                    </div>
                    <button
                      type="button"
                      aria-label="Close area information"
                      onClick={() => setSelected(null)}
                      className="-mr-1.5 -mt-1.5 grid size-8 place-items-center rounded-md text-mute hover:bg-paper hover:text-ink"
                    >
                      <IconClose width={16} height={16} />
                    </button>
                  </div>
                  <dl className="mt-3 space-y-2.5 text-[0.8125rem] leading-relaxed">
                    <div>
                      <dt className="text-mute">Type</dt>
                      <dd>{marker.kind}</dd>
                    </div>
                    <div>
                      <dt className="text-mute">Area</dt>
                      <dd>{marker.description}</dd>
                    </div>
                  </dl>
                  <button type="button" onClick={backToFull} className="mt-3.5 text-[0.8125rem] font-medium text-blue underline-offset-4 hover:underline">
                    Back to full model
                  </button>
                </aside>
              )}

              {/* Controls */}
              <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
                <div
                  role="toolbar"
                  aria-label="3D viewer controls"
                  className="no-scrollbar flex max-w-full items-center gap-0.5 overflow-x-auto rounded-xl border border-line bg-white/90 p-1 backdrop-blur-sm"
                >
                  <ToolButton label="Rotate left" onClick={() => heart.current?.rotateBy(-45)}>
                    <IconRotateLeft />
                  </ToolButton>
                  <ToolButton label="Rotate right" onClick={() => heart.current?.rotateBy(45)}>
                    <IconRotateRight />
                  </ToolButton>
                  <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line" />
                  <ToolButton label="Zoom in" onClick={() => heart.current?.zoomBy(0.8)}>
                    <IconPlus />
                  </ToolButton>
                  <ToolButton label="Zoom out" onClick={() => heart.current?.zoomBy(1.25)}>
                    <IconMinus />
                  </ToolButton>
                  <ToolButton label="Reset orientation" onClick={backToFull}>
                    <IconReset />
                  </ToolButton>
                  <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line" />
                  <button
                    type="button"
                    aria-pressed={markersOn}
                    onClick={toggleMarkers}
                    className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${
                      markersOn ? "bg-blue text-white" : "text-ink hover:bg-paper"
                    }`}
                  >
                    <IconPoint />
                    {markersOn ? "Hide Practice Areas" : "Show Practice Areas"}
                  </button>
                  {!full && (
                    <>
                      <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line" />
                      <ToolButton label="Fullscreen view" onClick={() => setFull(true)}>
                        <IconExpand />
                      </ToolButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[0.8125rem] text-mute">
          Drag to rotate. Use the buttons to zoom, or scroll and pinch in fullscreen. The 3D model is a visualisation
          built from photographs of the actual product.
        </p>
      </div>
    </section>
  );
}

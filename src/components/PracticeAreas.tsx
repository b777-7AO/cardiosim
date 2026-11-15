"use client";

import { sutureMarkers } from "@/config/site";
import { Picture } from "./Picture";

/**
 * Where each area sits on the front picture, in percent of the image.
 * Update these when the picture (public/images/heart-hero) is replaced.
 */
const dots: Record<string, [number, number]> = {
  "central-vessel": [46, 17],
  "front-line": [67, 62],
  "front-surface": [41, 66],
  "top-vessel": [25, 14],
};

export function PracticeAreas() {
  const show = (id: string) => window.dispatchEvent(new CustomEvent("cardiosim:area", { detail: id }));

  return (
    <section id="practice-areas" className="py-20 lg:py-32">
      <div className="frame grid items-center gap-x-8 gap-y-12 lg:grid-cols-12">
        <figure className="relative mx-auto w-full max-w-[34rem] lg:col-span-6">
          <Picture
            name="heart-hero"
            alt="Front of the CardioSim model with four numbered practice areas"
            width={1024}
            height={1024}
            className="h-auto w-full"
          />
          {sutureMarkers.map((m, i) => {
            const at = dots[m.id];
            if (!at) return null;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => show(m.id)}
                aria-label={`Show ${m.name} in the 3D view`}
                style={{ left: `${at[0]}%`, top: `${at[1]}%` }}
                className="absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-blue bg-white text-[0.75rem] font-semibold tabular-nums text-blue transition-colors hover:bg-blue hover:text-white"
              >
                {i + 1}
              </button>
            );
          })}
        </figure>

        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="h-section">Where stitches can be practised.</h2>
          <p className="lede mt-6">
            These areas are illustrative. They show the surfaces and openings of the model, not confirmed clinical
            procedures.
          </p>
          <ol className="mt-10">
            {sutureMarkers.map((m, i) => (
              <li key={m.id} className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-line py-5 last:border-b">
                <span className="mt-0.5 grid size-6 place-items-center rounded-full border border-blue text-[0.6875rem] font-semibold tabular-nums text-blue">
                  {i + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-medium tracking-[-0.01em]">{m.name}</h3>
                    <span className="text-[0.8125rem] text-mute">{m.kind}</span>
                  </div>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-mute">{m.description}</p>
                  <button
                    type="button"
                    onClick={() => show(m.id)}
                    className="mt-2 text-[0.8125rem] font-medium text-blue underline-offset-4 hover:underline"
                  >
                    View in 3D
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

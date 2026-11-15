"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LazyHeart } from "./heart/LazyHeart";
import { Picture } from "./Picture";

export function Hero() {
  // The heart turns a little further as the visitor scrolls away from it.
  const scrollYaw = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / window.innerHeight);
      scrollYaw.current = p * 0.9;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* studio floor: a single soft tone behind the model, nothing else */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 -z-10 w-full bg-[radial-gradient(60%_55%_at_70%_52%,#f1f4f7_0%,#ffffff_70%)] lg:w-[68%]"
      />
      <div className="frame grid min-h-[100svh] items-center gap-x-8 pb-10 pt-28 lg:grid-cols-12 lg:pb-16 lg:pt-24">
        <div className="lg:col-span-5">
          <p className="rise text-[0.75rem] font-medium uppercase tracking-[0.18em] text-blue" style={{ "--i": 0 } as React.CSSProperties}>
            Cardiovascular surgical training
          </p>
          <h1 className="h-display rise mt-5" style={{ "--i": 1 } as React.CSSProperties}>
            Practice with precision.
          </h1>
          <p className="rise mt-6 max-w-[26rem] text-xl leading-snug tracking-[-0.015em] text-ink" style={{ "--i": 2 } as React.CSSProperties}>
            Anatomical silicone heart for surgical suturing practice.
          </p>
          <p className="lede rise mt-4 max-w-[27rem]" style={{ "--i": 3 } as React.CSSProperties}>
            A physical, three-dimensional heart model for rehearsing stitching technique at home, in the university
            laboratory or in a training facility.
          </p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={{ "--i": 4 } as React.CSSProperties}>
            <Link href="#explorer" className="btn btn-ink">
              Explore the Heart
            </Link>
            <Link href="#order" className="btn btn-line">
              Order CardioSim
            </Link>
          </div>
        </div>

        <div className="relative mt-6 lg:col-span-7 lg:mt-0">
          <LazyHeart
            eager
            label="Interactive 3D model of the CardioSim silicone heart. Drag or use the arrow keys to rotate."
            scrollYaw={scrollYaw}
            className="relative aspect-square max-h-[78svh] w-full lg:aspect-auto lg:h-[min(78svh,46rem)]"
            poster={
              <Picture
                name="heart-hero"
                alt="CardioSim silicone heart: deep red body with one white central vessel"
                width={1024}
                height={1024}
                eager
                className="h-[86%] w-auto object-contain mix-blend-multiply"
              />
            }
          />
          <p className="mt-1 text-center text-[0.8125rem] text-mute">Drag to rotate. Zoom in the 3D explorer below.</p>
        </div>
      </div>
    </section>
  );
}

/**
 * CardioSim mark, drawn from the product itself: a red heart form, the white
 * vessel opening as a ring, and a row of blue stitch points.
 * The same geometry lives in /public/brand as standalone SVG files.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path fill="#C61F32" d="M21 4C12.5 4 5 10 5 19c0 9 6.5 15 13.5 18C27.5 34 35 28 35 19 35 10 29.5 4 21 4z" />
      <circle cx="17" cy="15.5" r="5.2" fill="none" stroke="#fff" strokeWidth="3" />
      <g fill="#245A80" stroke="#fff" strokeWidth="1">
        <circle cx="28" cy="14.5" r="2.2" />
        <circle cx="28" cy="20.5" r="2.2" />
        <circle cx="28" cy="26.5" r="2.2" />
      </g>
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="text-[0.9375rem] font-semibold tracking-[0.16em] text-ink">CARDIOSIM</span>
    </span>
  );
}

/**
 * CardioSim mark: a red heart body without the greeting-card cleft, the white
 * central vessel cut through it as an arch, and one blue suture point.
 * The same geometry lives in /public/brand as standalone SVG files.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path
        fill="#BC2435"
        d="M21 3.5C12 3.5 5 9.5 5 18.5c0 9 6.5 15 13.5 18C27.500 33.5 35 27.5 35 18.5 35 9.5 29.5 3.5 21 3.5z"
      />
      <path d="M14.5 25v-9.5a5.500 5.500 0 0 1 11 0v2.5" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="25.5" cy="24.5" r="3.3" fill="#fff" />
      <circle cx="25.5" cy="24.5" r="1.9" fill="#245A80" />
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

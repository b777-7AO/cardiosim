import { asset } from "@/config/site";

/** AVIF with WebP fallback. `name` is the file stem inside /public/images. */
export function Picture({
  name,
  alt,
  width,
  height,
  eager = false,
  className,
}: {
  name: string;
  alt: string;
  width: number;
  height: number;
  eager?: boolean;
  className?: string;
}) {
  return (
    <picture>
      <source srcSet={asset(`/images/${name}.avif`)} type="image/avif" />
      <img
        src={asset(`/images/${name}.webp`)}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    </picture>
  );
}

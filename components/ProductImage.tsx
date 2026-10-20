"use client";
import { useEffect, useRef, useState } from "react";

// Shimmer placeholder shows until the photo has loaded, then the photo fades in.
export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true); }, [src]);
  return (
    <>
      {!loaded && <span className="sk sk-fill" aria-hidden="true" />}
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={300}
        height={400}
        loading="lazy"
        decoding="async"
        className={loaded ? "ready" : ""}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  );
}

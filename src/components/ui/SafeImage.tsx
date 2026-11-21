"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { GraduationCap } from "lucide-react";

type Props = { src?: string | null; alt: string; className?: string };

// Image with a nice gradient fallback when the link is broken
export default function SafeImage({ src, alt, className = "" }: Props) {
  const [failed, setFailed] = useState<string | null>(null);

  if (!src || failed === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid place-items-center bg-gradient-to-br from-primary/25 via-accent/25 to-secondary/25 text-primary ${className}`}
      >
        <GraduationCap size={34} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(src)}
      className={className}
    />
  );
}

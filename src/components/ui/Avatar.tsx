"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { initials } from "@/lib/utils";

type Props = {
  src?: string | null;
  name?: string | null;
  className?: string;
};

// Shows the photo, or the initials if there is no photo / it fails to load
export default function Avatar({ src, name, className = "size-9 text-sm" }: Props) {
  const [failed, setFailed] = useState<string | null>(null);

  if (!src || failed === src) {
    return (
      <span
        className={`gradient-brand grid shrink-0 place-items-center rounded-full font-bold text-white ${className}`}
      >
        {initials(name)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name ? `${name} avatar` : "User avatar"}
      referrerPolicy="no-referrer"
      onError={() => setFailed(src)}
      className={`shrink-0 rounded-full object-cover ${className}`}
    />
  );
}

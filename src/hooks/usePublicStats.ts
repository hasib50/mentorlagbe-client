"use client";

import { useEffect, useState } from "react";
import { publicApi } from "@/lib/api";
import type { PublicStats } from "@/types";

let pending: Promise<PublicStats> | null = null;

// One shared request for every component that needs the platform numbers
export function usePublicStats() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    pending ??= publicApi.get<PublicStats>("/public/stats").then((res) => res.data);
    pending.then(setStats).catch(() => {
      pending = null;
    });
  }, []);

  return stats;
}

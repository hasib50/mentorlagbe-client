"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { errMsg } from "@/lib/utils";

// Small data loading hook: { data, loading, error, reload, setData }
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    loaderRef
      .current()
      .then((result) => alive && setData(result))
      .catch((err) => alive && setError(errMsg(err)))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((value) => value + 1), []);

  return { data, setData, loading, error, reload };
}

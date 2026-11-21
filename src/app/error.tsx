"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-base-200 p-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center"><Logo /></div>
        <span className="mx-auto mt-10 grid size-20 place-items-center rounded-3xl bg-error/15 text-error">
          <AlertTriangle size={38} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-base-content/65">
          An unexpected error happened. You can try again or go back to the home page.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={reset} className="btn btn-outline"><RotateCcw size={16} /> Try again</button>
          <Link href="/" className="btn btn-primary"><Home size={16} /> Back to Home</Link>
        </div>
      </div>
    </main>
  );
}

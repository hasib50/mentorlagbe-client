import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-base-200 p-6">
      <div className="max-w-md text-center">
        <div className="flex justify-center"><Logo /></div>
        <span className="mx-auto mt-10 grid size-20 place-items-center rounded-3xl bg-primary/10 text-primary">
          <SearchX size={38} />
        </span>
        <p className="mt-6 font-display text-7xl font-extrabold text-gradient">404</p>
        <h1 className="mt-2 text-2xl font-extrabold">This page does not exist</h1>
        <p className="mt-3 text-sm leading-6 text-base-content/65">
          The page you are looking for may have moved or never existed. Let us take you back home.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          <Home size={17} /> Back to Home
        </Link>
      </div>
    </main>
  );
}

import { GraduationCap } from "lucide-react";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-sm font-semibold text-base-content/60">{label}</p>
      </div>
    </div>
  );
}

export function FullPageLoader({ label = "Loading your workspace..." }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-base-200">
      <div className="flex flex-col items-center gap-4">
        <span className="gradient-brand shadow-soft grid size-14 animate-pulse place-items-center rounded-2xl text-white">
          <GraduationCap size={28} />
        </span>
        <span className="loading loading-dots loading-md text-primary" />
        <p className="text-sm font-semibold text-base-content/60">{label}</p>
      </div>
    </div>
  );
}

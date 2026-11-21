import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-base-content/65">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

type Tone = "primary" | "success" | "warning" | "secondary" | "info";

const TONES: Record<Tone, string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
  secondary: "bg-secondary/15 text-secondary",
  info: "bg-info/15 text-info",
};

// Reusable stats card used by all three dashboards
export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = "primary",
  loading,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: Tone;
  loading?: boolean;
}) {
  return (
    <div className="surface flex items-center gap-4 p-5">
      <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${TONES[tone]}`}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold uppercase tracking-wider text-base-content/55">{label}</p>
        {loading ? (
          <span className="skeleton mt-1 block h-8 w-16" />
        ) : (
          <p className="font-display text-3xl font-extrabold leading-tight">{value}</p>
        )}
        {hint && <p className="truncate text-xs text-base-content/55">{hint}</p>}
      </div>
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`surface p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-lg font-extrabold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton h-14 w-full" />
      ))}
    </div>
  );
}

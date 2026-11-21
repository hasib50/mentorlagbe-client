import type { Plan, Role } from "@/types";

const STATUS: Record<string, { cls: string; label: string }> = {
  pending: { cls: "badge-warning", label: "Pending" },
  approved: { cls: "badge-success", label: "Approved" },
  accepted: { cls: "badge-success", label: "Accepted" },
  rejected: { cls: "badge-error", label: "Rejected" },
  active: { cls: "badge-success", label: "Active" },
  closed: { cls: "badge-neutral", label: "Closed" },
};

export function StatusBadge({ status }: { status: string }) {
  const item = STATUS[status] ?? { cls: "badge-ghost", label: status };
  return (
    <span className={`badge badge-soft ${item.cls} gap-1.5 whitespace-nowrap font-semibold`}>
      <span className="size-1.5 rounded-full bg-current" />
      {item.label}
    </span>
  );
}

const ROLES: Record<Role, string> = {
  student: "badge-info",
  tutor: "badge-primary",
  admin: "badge-secondary",
};

export function RoleBadge({ role }: { role?: Role | string }) {
  const cls = ROLES[(role as Role) ?? "student"] ?? "badge-ghost";
  return (
    <span className={`badge badge-soft badge-sm font-bold capitalize ${cls}`}>
      {role ?? "student"}
    </span>
  );
}

export function PlanBadge({ plan }: { plan?: Plan | string }) {
  return plan === "pro" ? (
    <span className="badge badge-sm border-0 bg-accent font-extrabold text-accent-content">PRO</span>
  ) : (
    <span className="badge badge-soft badge-sm badge-neutral font-bold">FREE</span>
  );
}

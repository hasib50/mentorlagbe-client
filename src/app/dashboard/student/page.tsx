"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Clock, Crown, Search, Sparkles } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, Panel, StatCard, TableSkeleton } from "@/components/dashboard/ui";
import { StatusBadge } from "@/components/ui/Badges";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { fmtDate, money } from "@/lib/utils";
import type { Application } from "@/types";

type Stats = { total: number; accepted: number; pending: number; rejected: number; plan: "free" | "pro" };

export default function StudentOverview() {
  const { user, plan } = useCurrentUser();
  const { data: stats, loading } = useAsync(async () => (await api.get<Stats>("/student/stats")).data);
  const { data: apps, loading: loadingApps } = useAsync(async () => (await api.get<Application[]>("/student/applications")).data);

  return (
    <>
      <PageTitle title="Student Dashboard" />
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "student"}!`}
        subtitle="Here is a quick look at your tuition applications."
        actions={<Link href="/tuitions" className="btn btn-primary btn-sm"><Search size={16} /> Browse tuitions</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={loading} icon={<ClipboardList size={26} />} label="Total applied" value={stats?.total ?? 0} hint="All applications" />
        <StatCard loading={loading} tone="success" icon={<CheckCircle2 size={26} />} label="Accepted" value={stats?.accepted ?? 0} hint="Tutors said yes" />
        <StatCard loading={loading} tone="warning" icon={<Clock size={26} />} label="Pending" value={stats?.pending ?? 0} hint="Waiting for a reply" />
        <StatCard loading={loading} tone="secondary" icon={<Crown size={26} />} label="Current plan" value={plan === "pro" ? "Pro" : "Free"} hint={plan === "pro" ? "Priority booking on" : "Upgrade for priority"} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="Recent applications"
          className="xl:col-span-2"
          action={<Link href="/dashboard/student/my-applications" className="btn btn-ghost btn-sm">View all <ArrowRight size={15} /></Link>}
        >
          {loadingApps ? (
            <TableSkeleton rows={3} />
          ) : apps && apps.length > 0 ? (
            <ul className="divide-y divide-base-300">
              {apps.slice(0, 5).map((app) => (
                <li key={app._id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{app.tuitionTitle}</p>
                    <p className="text-xs text-base-content/60">{app.tutorName ?? app.tutorEmail} · {money(app.monthlyFee)}/month · {fmtDate(app.appliedAt)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={<ClipboardList size={28} />} title="No applications yet" text="Find a tuition you like and send your first application." action={<Link href="/tuitions" className="btn btn-primary btn-sm">Browse tuitions</Link>} />
          )}
        </Panel>

        {plan !== "pro" ? (
          <div className="gradient-brand shadow-soft flex flex-col rounded-[1.25rem] p-6 text-white">
            <Sparkles size={30} className="text-accent" />
            <h2 className="mt-4 text-xl font-extrabold">Go Pro for $10</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-white/80">
              Get a Pro badge on every application and appear first for tutors. One-time payment with Stripe.
            </p>
            <Link href="/pricing" className="btn btn-accent mt-6">See Pro plan</Link>
          </div>
        ) : (
          <Panel title="You are on Pro">
            <p className="text-sm leading-6 text-base-content/70">
              Thank you for upgrading! Your applications carry a Pro badge, so tutors see them first.
            </p>
          </Panel>
        )}
      </div>
    </>
  );
}

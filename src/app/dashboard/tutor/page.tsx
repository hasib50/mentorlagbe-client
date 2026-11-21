"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Crown, PlusCircle, Sparkles, Users } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, Panel, StatCard, TableSkeleton } from "@/components/dashboard/ui";
import { StatusBadge } from "@/components/ui/Badges";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FREE_TUITION_LIMIT } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import type { Application } from "@/types";

type Stats = {
  totalTuitions: number;
  approved: number;
  pending: number;
  totalApplicants: number;
  pendingApplicants: number;
  plan: "free" | "pro";
};

export default function TutorOverview() {
  const { user, plan } = useCurrentUser();
  const { data: stats, loading } = useAsync(async () => (await api.get<Stats>("/tutor/stats")).data);
  const { data: apps, loading: loadingApps } = useAsync(async () => (await api.get<Application[]>("/tutor/applications")).data);

  const used = stats?.totalTuitions ?? 0;
  const percent = Math.min(100, Math.round((used / FREE_TUITION_LIMIT) * 100));

  return (
    <>
      <PageTitle title="Tutor Dashboard" />
      <PageHeader
        title={`Hello, ${user?.name?.split(" ")[0] ?? "tutor"}!`}
        subtitle="Manage your batches and student applications."
        actions={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary btn-sm"><PlusCircle size={16} /> Post a tuition</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={loading} icon={<BookOpen size={26} />} label="Tuitions posted" value={stats?.totalTuitions ?? 0} hint={`${stats?.pending ?? 0} waiting for approval`} />
        <StatCard loading={loading} tone="success" icon={<CheckCircle2 size={26} />} label="Active / approved" value={stats?.approved ?? 0} hint="Visible to students" />
        <StatCard loading={loading} tone="info" icon={<Users size={26} />} label="Applicants" value={stats?.totalApplicants ?? 0} hint={`${stats?.pendingApplicants ?? 0} need a reply`} />
        <StatCard loading={loading} tone="secondary" icon={<Crown size={26} />} label="Current plan" value={plan === "pro" ? "Pro" : "Free"} hint={plan === "pro" ? "Unlimited posts" : `${FREE_TUITION_LIMIT} posts included`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel
          title="Latest applicants"
          className="xl:col-span-2"
          action={<Link href="/dashboard/tutor/applicants" className="btn btn-ghost btn-sm">Manage <ArrowRight size={15} /></Link>}
        >
          {loadingApps ? (
            <TableSkeleton rows={3} />
          ) : apps && apps.length > 0 ? (
            <ul className="divide-y divide-base-300">
              {apps.slice(0, 5).map((app) => (
                <li key={app._id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">{app.studentName}</p>
                    <p className="truncate text-xs text-base-content/60">{app.tuitionTitle} · {fmtDate(app.appliedAt)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={<Users size={28} />} title="No applicants yet" text="Once students apply to your batches they will show up here." />
          )}
        </Panel>

        {plan === "pro" ? (
          <Panel title="Pro Tutor">
            <p className="text-sm leading-6 text-base-content/70">
              You can post unlimited tuitions and your profile shows a verified badge. Thank you for supporting MentorLagbe!
            </p>
          </Panel>
        ) : (
          <div className="gradient-brand shadow-soft flex flex-col rounded-[1.25rem] p-6 text-white">
            <Sparkles size={30} className="text-accent" />
            <h2 className="mt-4 text-xl font-extrabold">Free plan usage</h2>
            <p className="mt-2 text-sm text-white/80">{used} of {FREE_TUITION_LIMIT} tuition posts used</p>
            <progress className="progress progress-accent mt-3 w-full" value={percent} max={100} />
            <p className="mt-4 flex-1 text-sm leading-6 text-white/80">Go Pro for $15 to post unlimited tuitions and get a verified badge.</p>
            <Link href="/pricing" className="btn btn-accent mt-5">Upgrade to Pro</Link>
          </div>
        )}
      </div>
    </>
  );
}

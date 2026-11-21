"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CalendarDays, ClipboardList, Mail, Trash2, User } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, TableSkeleton } from "@/components/dashboard/ui";
import { StatusBadge } from "@/components/ui/Badges";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { errMsg, fmtDate, money } from "@/lib/utils";
import type { Application } from "@/types";

export default function MyApplicationsPage() {
  const { data, setData, loading, error } = useAsync(async () => (await api.get<Application[]>("/student/applications")).data);
  const [target, setTarget] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);

  async function cancel() {
    if (!target) return;
    setBusy(true);
    try {
      await api.delete(`/applications/${target._id}`);
      setData((old) => (old ?? []).filter((item) => item._id !== target._id));
      toast.success("Application cancelled.");
      setTarget(null);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle title="My Applications" />
      <PageHeader title="My Applications" subtitle="Track every tuition you applied for. You can cancel while it is still pending." />

      {loading && <TableSkeleton rows={4} />}
      {error && <div role="alert" className="alert alert-error alert-soft">{error}</div>}

      {!loading && !error && data && data.length === 0 && (
        <EmptyState icon={<ClipboardList size={28} />} title="You have not applied yet" text="Browse approved tuitions and apply with your preferred schedule." action={<Link href="/tuitions" className="btn btn-primary">Browse tuitions</Link>} />
      )}

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {data?.map((app) => (
          <article key={app._id} className="surface flex h-full flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="line-clamp-2 text-base font-extrabold leading-snug">{app.tuitionTitle}</h3>
              <StatusBadge status={app.status} />
            </div>

            <dl className="mt-4 space-y-2.5 text-sm text-base-content/75">
              <div className="flex items-center gap-2.5"><User size={16} className="text-primary" /> {app.tutorName ?? "Tutor"}</div>
              <div className="flex items-center gap-2.5"><Mail size={16} className="text-primary" /> <span className="truncate">{app.tutorEmail}</span></div>
              <div className="flex items-center gap-2.5"><CalendarDays size={16} className="text-primary" /> Applied on {fmtDate(app.appliedAt)}</div>
            </dl>

            <div className="mt-auto flex items-center justify-between border-t border-base-300 pt-4">
              <p className="font-extrabold text-primary">{money(app.monthlyFee)}<span className="text-xs font-semibold text-base-content/55"> /month</span></p>
              <div className="flex gap-2">
                <Link href={`/tuitions/${app.tuitionId}`} className="btn btn-ghost btn-sm">View</Link>
                {app.status === "pending" && (
                  <button className="btn btn-outline btn-error btn-sm" onClick={() => setTarget(app)}>
                    <Trash2 size={15} /> Cancel
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(target)}
        title="Cancel this application?"
        message={`Your application for "${target?.tuitionTitle ?? ""}" will be removed. You can apply again later.`}
        confirmLabel="Yes, cancel it"
        loading={busy}
        onConfirm={cancel}
        onClose={() => setTarget(null)}
      />
    </>
  );
}

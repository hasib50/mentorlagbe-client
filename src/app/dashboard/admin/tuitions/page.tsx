"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { BookOpenCheck, Check, ExternalLink, X } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, TableSkeleton } from "@/components/dashboard/ui";
import { StatusBadge } from "@/components/ui/Badges";
import SafeImage from "@/components/ui/SafeImage";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { errMsg, fmtDate, money } from "@/lib/utils";
import type { ApprovalStatus, Tuition } from "@/types";

const tabs = ["pending", "approved", "rejected", "all"] as const;

export default function AdminTuitionsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, setData, loading, error } = useAsync(
    async () => (await api.get<Tuition[]>("/admin/tuitions", { params: { status: tab === "all" ? "" : tab } })).data,
    [tab]
  );

  async function review(tuition: Tuition, approvalStatus: ApprovalStatus) {
    setBusyId(tuition._id);
    try {
      await api.patch(`/admin/tuitions/${tuition._id}/status`, { approvalStatus });
      // Remove it from the list if it no longer matches the current tab
      setData((old) =>
        (old ?? [])
          .map((item) => (item._id === tuition._id ? { ...item, approvalStatus } : item))
          .filter((item) => tab === "all" || item.approvalStatus === tab)
      );
      toast.success(approvalStatus === "approved" ? "Tuition approved and now public." : "Tuition rejected.");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageTitle title="Tuition Approval" />
      <PageHeader title="Tuition Approval" subtitle="Approve or reject tuition posts submitted by tutors." />

      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`btn btn-sm capitalize ${tab === item ? "btn-primary" : "btn-outline"}`}>
            {item}
          </button>
        ))}
      </div>

      {loading && <TableSkeleton rows={5} />}
      {error && <div role="alert" className="alert alert-error alert-soft">{error}</div>}
      {!loading && !error && data?.length === 0 && <EmptyState icon={<BookOpenCheck size={28} />} title={`No ${tab === "all" ? "" : tab} tuitions`} text="Nothing to review in this tab right now." />}

      {data && data.length > 0 && (
        <div className="surface overflow-x-auto">
          <table className="table">
            <thead><tr><th>Tuition</th><th>Tutor</th><th>Fee</th><th>Status</th><th>Posted</th><th className="text-right">Decision</th></tr></thead>
            <tbody>
              {data.map((tuition) => (
                <tr key={tuition._id} className="hover:bg-base-200/60">
                  <td>
                    <div className="flex min-w-[260px] items-center gap-3">
                      <SafeImage src={tuition.bannerImage} alt={tuition.title} className="size-14 shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-extrabold">{tuition.title}</p>
                        <p className="text-xs text-base-content/60">{tuition.subject} · {tuition.classLevel} · {tuition.mode}</p>
                        <Link href={`/tuitions/${tuition._id}`} target="_blank" className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                          Preview <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td><p className="text-sm font-bold">{tuition.tutorName}</p><p className="text-xs text-base-content/60">{tuition.tutorEmail}</p></td>
                  <td className="whitespace-nowrap font-bold">{money(tuition.monthlyFee)}</td>
                  <td><StatusBadge status={tuition.approvalStatus} /></td>
                  <td className="whitespace-nowrap text-sm">{fmtDate(tuition.createdAt)}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button className="btn btn-success btn-sm" disabled={busyId === tuition._id || tuition.approvalStatus === "approved"} onClick={() => review(tuition, "approved")}>
                        <Check size={15} /> Approve
                      </button>
                      <button className="btn btn-outline btn-error btn-sm" disabled={busyId === tuition._id || tuition.approvalStatus === "rejected"} onClick={() => review(tuition, "rejected")}>
                        <X size={15} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

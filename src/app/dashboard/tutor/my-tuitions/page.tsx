"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { BookOpen, Pencil, PlusCircle, Trash2 } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, TableSkeleton } from "@/components/dashboard/ui";
import { StatusBadge } from "@/components/ui/Badges";
import SafeImage from "@/components/ui/SafeImage";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { errMsg, fmtDate, money } from "@/lib/utils";
import type { Tuition } from "@/types";

export default function MyTuitionsPage() {
  const { data, setData, loading, error } = useAsync(async () => (await api.get<Tuition[]>("/tutor/tuitions")).data);
  const [target, setTarget] = useState<Tuition | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggleActive(tuition: Tuition) {
    const next = !tuition.isActive;
    // Optimistic update, rolled back if the server says no
    setData((old) => (old ?? []).map((item) => (item._id === tuition._id ? { ...item, isActive: next } : item)));
    try {
      await api.patch(`/tuitions/${tuition._id}/active`, { isActive: next });
      toast.success(next ? "Tuition is active again." : "Tuition closed.");
    } catch (err) {
      setData((old) => (old ?? []).map((item) => (item._id === tuition._id ? { ...item, isActive: !next } : item)));
      toast.error(errMsg(err));
    }
  }

  async function remove() {
    if (!target) return;
    setBusy(true);
    try {
      await api.delete(`/tuitions/${target._id}`);
      setData((old) => (old ?? []).filter((item) => item._id !== target._id));
      toast.success("Tuition deleted.");
      setTarget(null);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle title="My Tuitions" />
      <PageHeader
        title="My Tuitions"
        subtitle="Edit, close or delete your posts and see the admin approval status."
        actions={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary btn-sm"><PlusCircle size={16} /> New tuition</Link>}
      />

      {loading && <TableSkeleton rows={4} />}
      {error && <div role="alert" className="alert alert-error alert-soft">{error}</div>}

      {!loading && !error && data?.length === 0 && (
        <EmptyState icon={<BookOpen size={28} />} title="No tuitions posted" text="Create your first batch and students can start applying after approval." action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary">Post a tuition</Link>} />
      )}

      {data && data.length > 0 && (
        <div className="surface overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Tuition</th>
                <th>Fee</th>
                <th>Approval</th>
                <th>Open for students</th>
                <th>Posted</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tuition) => (
                <tr key={tuition._id} className="hover:bg-base-200/60">
                  <td>
                    <div className="flex min-w-[240px] items-center gap-3">
                      <SafeImage src={tuition.bannerImage} alt={tuition.title} className="size-14 shrink-0 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-extrabold">{tuition.title}</p>
                        <p className="text-xs text-base-content/60">{tuition.subject} · {tuition.classLevel} · {tuition.mode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap font-bold">{money(tuition.monthlyFee)}</td>
                  <td><StatusBadge status={tuition.approvalStatus} /></td>
                  <td>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="toggle toggle-success toggle-sm"
                        checked={tuition.isActive}
                        onChange={() => toggleActive(tuition)}
                        aria-label={`Toggle ${tuition.title}`}
                      />
                      <span className="text-xs font-bold">{tuition.isActive ? "Active" : "Closed"}</span>
                    </label>
                  </td>
                  <td className="whitespace-nowrap text-sm">{fmtDate(tuition.createdAt)}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/tutor/my-tuitions/${tuition._id}/edit`} className="btn btn-outline btn-sm"><Pencil size={14} /> Edit</Link>
                      <button className="btn btn-outline btn-error btn-sm" onClick={() => setTarget(tuition)}><Trash2 size={14} /> Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={Boolean(target)}
        title="Delete this tuition?"
        message={`"${target?.title ?? ""}" and all of its applications will be permanently removed.`}
        confirmLabel="Delete tuition"
        loading={busy}
        onConfirm={remove}
        onClose={() => setTarget(null)}
      />
    </>
  );
}

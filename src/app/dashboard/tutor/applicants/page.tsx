"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Check, Users, X } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, TableSkeleton } from "@/components/dashboard/ui";
import { StatusBadge } from "@/components/ui/Badges";
import EmptyState from "@/components/ui/EmptyState";
import Avatar from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { errMsg, fmtDate } from "@/lib/utils";
import type { Application } from "@/types";

const tabs = ["all", "pending", "accepted", "rejected"] as const;

export default function ApplicantsPage() {
  const { data, setData, loading, error } = useAsync(async () => (await api.get<Application[]>("/tutor/applications")).data);
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const list = (data ?? []).filter((item) => tab === "all" || item.status === tab);
    // Pro students get priority: they appear first
    return [...list].sort((a, b) => Number(b.studentPlan === "pro") - Number(a.studentPlan === "pro"));
  }, [data, tab]);

  async function setStatus(app: Application, status: "accepted" | "rejected") {
    setBusyId(app._id);
    try {
      await api.patch(`/applications/${app._id}/status`, { status });
      setData((old) => (old ?? []).map((item) => (item._id === app._id ? { ...item, status } : item)));
      toast.success(`Application ${status}.`);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageTitle title="Applicants" />
      <PageHeader title="Applicants" subtitle="Students who applied to your tuition posts. Pro students are listed first." />

      <div role="tablist" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={`btn btn-sm capitalize ${tab === item ? "btn-primary" : "btn-outline"}`}
          >
            {item}
            <span className="badge badge-sm">{item === "all" ? data?.length ?? 0 : data?.filter((a) => a.status === item).length ?? 0}</span>
          </button>
        ))}
      </div>

      {loading && <TableSkeleton rows={5} />}
      {error && <div role="alert" className="alert alert-error alert-soft">{error}</div>}
      {!loading && !error && rows.length === 0 && (
        <EmptyState icon={<Users size={28} />} title="No applicants here" text="Applications for your tuitions will appear in this list." />
      )}

      {rows.length > 0 && (
        <div className="surface overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Tuition</th>
                <th>Phone</th>
                <th>Schedule</th>
                <th>Note</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((app) => (
                <tr key={app._id} className="hover:bg-base-200/60">
                  <td>
                    <div className="flex min-w-[200px] items-center gap-3">
                      <Avatar name={app.studentName} className="size-10 text-sm" />
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 font-extrabold">
                          <span className="truncate">{app.studentName}</span>
                          {app.studentPlan === "pro" && <span className="badge badge-xs border-0 bg-accent font-extrabold text-accent-content">PRO</span>}
                        </p>
                        <p className="truncate text-xs text-base-content/60">{app.studentEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td><p className="line-clamp-2 min-w-[160px] text-sm font-semibold">{app.tuitionTitle}</p></td>
                  <td className="whitespace-nowrap text-sm">{app.studentPhone}</td>
                  <td><p className="min-w-[140px] text-sm">{app.preferredSchedule}</p></td>
                  <td><p className="line-clamp-2 min-w-[180px] max-w-xs text-sm text-base-content/70" title={app.studentNote}>{app.studentNote}</p></td>
                  <td>
                    <div className="space-y-1">
                      <StatusBadge status={app.status} />
                      <p className="text-[11px] text-base-content/55">{fmtDate(app.appliedAt)}</p>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        disabled={busyId === app._id || app.status === "accepted"}
                        onClick={() => setStatus(app, "accepted")}
                      >
                        <Check size={15} /> Accept
                      </button>
                      <button
                        className="btn btn-outline btn-error btn-sm"
                        disabled={busyId === app._id || app.status === "rejected"}
                        onClick={() => setStatus(app, "rejected")}
                      >
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

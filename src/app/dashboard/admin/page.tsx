"use client";

import Link from "next/link";
import { BookOpenCheck, CircleDollarSign, GraduationCap, Users, UserSquare2 } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, Panel, StatCard, TableSkeleton } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { fmtDate, usd } from "@/lib/utils";
import type { Payment } from "@/types";

type Stats = {
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  proUsers: number;
  pendingTuitions: number;
  approvedTuitions: number;
  rejectedTuitions: number;
  revenue: number;
  paymentCount: number;
  revenueByMonth: { month: string; total: number }[];
  recentPayments: Payment[];
};

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-base-200">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const { data, loading } = useAsync(async () => (await api.get<Stats>("/admin/stats")).data);
  const tuitionMax = Math.max(data?.pendingTuitions ?? 0, data?.approvedTuitions ?? 0, data?.rejectedTuitions ?? 0, 1);
  const monthMax = Math.max(...(data?.revenueByMonth.map((m) => m.total) ?? [0]), 1);

  return (
    <>
      <PageTitle title="Admin Dashboard" />
      <PageHeader title="Platform overview" subtitle="Live numbers across users, tuitions and Stripe revenue." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard loading={loading} icon={<Users size={26} />} label="Total users" value={data?.totalUsers ?? 0} hint={`${data?.proUsers ?? 0} on Pro`} />
        <StatCard loading={loading} tone="info" icon={<UserSquare2 size={26} />} label="Total tutors" value={data?.totalTutors ?? 0} hint={`${data?.totalStudents ?? 0} students`} />
        <StatCard loading={loading} tone="warning" icon={<BookOpenCheck size={26} />} label="Pending vs approved" value={`${data?.pendingTuitions ?? 0} / ${data?.approvedTuitions ?? 0}`} hint="Tuition posts" />
        <StatCard loading={loading} tone="success" icon={<CircleDollarSign size={26} />} label="Stripe revenue" value={usd(data?.revenue ?? 0)} hint={`${data?.paymentCount ?? 0} payments`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Tuition posts by status" action={<Link href="/dashboard/admin/tuitions" className="btn btn-ghost btn-sm">Review</Link>}>
          {loading ? <TableSkeleton rows={3} /> : (
            <div className="space-y-5">
              <Bar label="Pending review" value={data?.pendingTuitions ?? 0} max={tuitionMax} color="bg-warning" />
              <Bar label="Approved" value={data?.approvedTuitions ?? 0} max={tuitionMax} color="bg-success" />
              <Bar label="Rejected" value={data?.rejectedTuitions ?? 0} max={tuitionMax} color="bg-error" />
            </div>
          )}
        </Panel>

        <Panel title="Revenue by month">
          {loading ? <TableSkeleton rows={3} /> : data && data.revenueByMonth.length > 0 ? (
            <div className="flex h-44 items-end gap-3">
              {data.revenueByMonth.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-bold">{usd(item.total)}</span>
                  <div className="gradient-brand w-full rounded-t-xl" style={{ height: `${Math.max(8, (item.total / monthMax) * 100)}px` }} />
                  <span className="text-[11px] font-semibold text-base-content/60">{item.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-base-content/60">No payments yet.</p>
          )}
        </Panel>
      </div>

      <Panel title="Recent transactions" className="mt-6" action={<Link href="/dashboard/admin/transactions" className="btn btn-ghost btn-sm">All transactions</Link>}>
        {loading ? <TableSkeleton rows={3} /> : data && data.recentPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Amount</th><th>Date</th></tr></thead>
              <tbody>
                {data.recentPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td><p className="font-bold">{payment.userName}</p><p className="text-xs text-base-content/60">{payment.userEmail}</p></td>
                    <td className="capitalize">{payment.userRole}</td>
                    <td>{payment.planName}</td>
                    <td className="font-extrabold text-success">{usd(payment.amount)}</td>
                    <td className="whitespace-nowrap">{fmtDate(payment.paidAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-base-content/60">No transactions yet.</p>
        )}
      </Panel>

      <p className="mt-6 flex items-center gap-2 text-xs text-base-content/55"><GraduationCap size={14} /> Revenue counts only Stripe payments saved in the payments collection.</p>
    </>
  );
}

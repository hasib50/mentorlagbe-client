"use client";

import { CreditCard } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, StatCard, TableSkeleton } from "@/components/dashboard/ui";
import EmptyState from "@/components/ui/EmptyState";
import { PlanBadge } from "@/components/ui/Badges";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { fmtDate, usd } from "@/lib/utils";
import type { Payment } from "@/types";

export default function TransactionsPage() {
  const { data, loading, error } = useAsync(async () => (await api.get<Payment[]>("/admin/payments")).data);
  const total = (data ?? []).reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      <PageTitle title="Transactions" />
      <PageHeader title="Transactions" subtitle="Every Pro plan payment received through Stripe." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:max-w-2xl">
        <StatCard loading={loading} tone="success" icon={<CreditCard size={26} />} label="Total revenue" value={usd(total)} />
        <StatCard loading={loading} tone="info" icon={<CreditCard size={26} />} label="Payments" value={data?.length ?? 0} />
      </div>

      {loading && <TableSkeleton rows={5} />}
      {error && <div role="alert" className="alert alert-error alert-soft">{error}</div>}
      {!loading && !error && data?.length === 0 && <EmptyState icon={<CreditCard size={28} />} title="No transactions yet" text="Payments appear here after users upgrade to Pro." />}

      {data && data.length > 0 && (
        <div className="surface overflow-x-auto">
          <table className="table">
            <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Amount</th><th>Transaction ID</th><th>Payment date</th></tr></thead>
            <tbody>
              {data.map((payment) => (
                <tr key={payment._id} className="hover:bg-base-200/60">
                  <td><p className="font-extrabold">{payment.userName}</p><p className="text-xs text-base-content/60">{payment.userEmail}</p></td>
                  <td className="capitalize">{payment.userRole}</td>
                  <td><div className="flex items-center gap-2"><PlanBadge plan="pro" /> <span className="text-sm">{payment.planName}</span></div></td>
                  <td className="font-extrabold text-success">{usd(payment.amount)}</td>
                  <td><code className="rounded bg-base-200 px-2 py-1 text-xs">{payment.transactionId}</code></td>
                  <td className="whitespace-nowrap text-sm">{fmtDate(payment.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

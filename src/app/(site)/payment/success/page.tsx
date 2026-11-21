"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { api } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { errMsg, fmtDate, usd } from "@/lib/utils";
import type { Payment } from "@/types";

function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const { user, isPending, refetch } = useCurrentUser();
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (isPending || started.current) return;
    started.current = true;

    if (!sessionId) {
      setState("error");
      setMessage("No payment session was found.");
      return;
    }
    if (!user) {
      setState("error");
      setMessage("Please sign in again to confirm your payment.");
      return;
    }

    api
      .post<{ payment: Payment }>("/payments/verify", { sessionId })
      .then(async (res) => {
        setPayment(res.data.payment);
        await refetch();
        setState("done");
      })
      .catch((error) => {
        setMessage(errMsg(error));
        setState("error");
      });
  }, [isPending, sessionId, user, refetch]);

  if (state === "loading") {
    return (
      <div className="text-center">
        <Loader2 className="mx-auto animate-spin text-primary" size={44} />
        <h1 className="mt-5 text-2xl font-extrabold">Confirming your payment...</h1>
        <p className="mt-2 text-sm text-base-content/65">Please wait a moment. Do not close this page.</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-error/15 text-error">
          <AlertTriangle size={32} />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold">We could not confirm the payment</h1>
        <p className="mt-2 text-sm text-base-content/65">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/pricing" className="btn btn-primary">Back to pricing</Link>
          <Link href="/dashboard" className="btn btn-outline">Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/15 text-success">
        <CheckCircle2 size={34} />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold">Payment successful!</h1>
      <p className="mt-2 text-sm text-base-content/65">Your account is now on the Pro plan. Enjoy the new features.</p>

      {payment && (
        <dl className="mx-auto mt-8 max-w-sm divide-y divide-base-300 rounded-2xl border border-base-300 text-left text-sm">
          {[
            ["Plan", payment.planName],
            ["Amount", usd(payment.amount)],
            ["Date", fmtDate(payment.paidAt)],
            ["Transaction ID", payment.transactionId],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-base-content/60">{label}</dt>
              <dd className="truncate font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <Link href="/dashboard" className="btn btn-primary mt-8">Go to dashboard</Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <PageTitle title="Payment Successful" />
      <section className="container-x grid min-h-[60vh] place-items-center py-16">
        <Suspense fallback={<span className="loading loading-spinner loading-lg text-primary" />}>
          <SuccessContent />
        </Suspense>
      </section>
    </>
  );
}

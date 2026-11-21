import Link from "next/link";
import { XCircle } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";

export default function PaymentCancelPage() {
  return (
    <>
      <PageTitle title="Payment Cancelled" />
      <section className="container-x grid min-h-[60vh] place-items-center py-16 text-center">
        <div>
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-warning/20 text-warning">
            <XCircle size={34} />
          </span>
          <h1 className="mt-5 text-3xl font-extrabold">Payment cancelled</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/65">
            No money was taken from your account. You can try again whenever you are ready.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/pricing" className="btn btn-primary">Back to pricing</Link>
            <Link href="/" className="btn btn-outline">Home</Link>
          </div>
        </div>
      </section>
    </>
  );
}

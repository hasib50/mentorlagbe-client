import PageTitle from "@/components/ui/PageTitle";
import PricingSection from "@/components/home/PricingSection";
import { CreditCard } from "lucide-react";

export default function PricingPage() {
  return (
    <>
      <PageTitle title="Pricing & Pro Plans" />
      <div className="bg-base-200">
        <PricingSection />
      </div>

      <section className="container-x py-16">
        <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-dashed border-base-300 p-6">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <CreditCard size={22} />
          </span>
          <div>
            <h2 className="text-lg font-extrabold">Secure checkout with Stripe</h2>
            <p className="mt-1 text-sm leading-7 text-base-content/70">
              Payments are handled by Stripe Checkout, so we never see your card details. After a
              successful payment your account is upgraded to Pro instantly. In test mode you can pay
              with the card number <strong>4242 4242 4242 4242</strong>, any future expiry date and any CVC.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

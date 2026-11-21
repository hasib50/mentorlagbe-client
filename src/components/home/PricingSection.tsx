"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Check, Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { errMsg } from "@/lib/utils";
import { PRICING } from "@/lib/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Audience = "student" | "tutor";

export default function PricingSection({ id }: { id?: string }) {
  const { user, role, plan, isPending } = useCurrentUser();
  const [audience, setAudience] = useState<Audience>(role === "tutor" ? "tutor" : "student");
  const [busy, setBusy] = useState(false);

  async function subscribe() {
    setBusy(true);
    try {
      const { data } = await api.post<{ url: string }>("/payments/checkout");
      window.location.href = data.url;
    } catch (error) {
      toast.error(errMsg(error));
      setBusy(false);
    }
  }

  function proAction() {
    const label = "Subscribe with Stripe";

    if (isPending) return <button className="btn btn-accent w-full" disabled>Loading...</button>;
    if (!user) {
      return (
        <Link href={`/sign-up?role=${audience}`} className="btn btn-accent w-full">
          {label}
        </Link>
      );
    }
    if (role === "admin") return <button className="btn w-full" disabled>Admins do not need a plan</button>;
    if (role !== audience) return <button className="btn w-full" disabled>For {audience} accounts</button>;
    if (plan === "pro") return <button className="btn w-full" disabled><Check size={16} /> Your current plan</button>;

    return (
      <button className="btn btn-accent w-full" onClick={subscribe} disabled={busy}>
        {busy && <Loader2 size={16} className="animate-spin" />}
        {label}
      </button>
    );
  }

  const plans = PRICING[audience];

  return (
    <section id={id} className="container-x py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">Pricing</p>
        <h2 className="section-title mt-3">Simple plans for everyone</h2>
        <p className="section-lead mx-auto">Start free. Upgrade to Pro with a one-time secure Stripe payment.</p>

        <div role="tablist" className="mx-auto mt-8 inline-flex rounded-full border border-base-300 bg-base-200 p-1">
          {(["student", "tutor"] as const).map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={audience === item}
              onClick={() => setAudience(item)}
              className={`rounded-full px-6 py-2 text-sm font-bold capitalize transition ${
                audience === item ? "bg-primary text-primary-content shadow" : "text-base-content/70"
              }`}
            >
              {item}s
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Free */}
        <div className="surface flex flex-col p-7">
          <h3 className="text-xl font-extrabold">{plans.free.name}</h3>
          <p className="mt-1 text-sm text-base-content/60">{plans.free.tagline}</p>
          <p className="mt-6 font-display text-5xl font-extrabold">
            $0<span className="text-base font-semibold text-base-content/50"> / forever</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {plans.free.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check size={17} className="mt-0.5 shrink-0 text-success" /> {feature}
              </li>
            ))}
          </ul>
          <Link href={user ? "/dashboard" : `/sign-up?role=${audience}`} className="btn btn-outline mt-8 w-full">
            {user ? "Go to dashboard" : "Get started free"}
          </Link>
        </div>

        {/* Pro */}
        <div className="gradient-brand shadow-soft relative flex flex-col rounded-[1.25rem] p-7 text-white">
          <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-accent-content">
            <Sparkles size={13} /> MOST POPULAR
          </span>
          <h3 className="text-xl font-extrabold">{plans.pro.name}</h3>
          <p className="mt-1 text-sm text-white/75">{plans.pro.tagline}</p>
          <p className="mt-6 font-display text-5xl font-extrabold">
            ${plans.pro.price}<span className="text-base font-semibold text-white/65"> / one-time</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {plans.pro.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check size={17} className="mt-0.5 shrink-0 text-accent" /> {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8">{proAction()}</div>
        </div>
      </div>
    </section>
  );
}

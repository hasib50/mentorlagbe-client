import PageTitle from "@/components/ui/PageTitle";
import HowItWorks from "@/components/home/HowItWorks";
import CtaBanner from "@/components/home/CtaBanner";
import { BadgeCheck, HeartHandshake, Wallet } from "lucide-react";

const values = [
  { icon: BadgeCheck, title: "Verified and reviewed", text: "Every tuition post is checked by an admin before students can see it." },
  { icon: Wallet, title: "Clear, honest fees", text: "Monthly fees are shown up front, so families can plan their budget." },
  { icon: HeartHandshake, title: "Built for both sides", text: "Students get choice. Tutors get a simple way to manage their batches." },
];

const faqs = [
  { q: "Is MentorLagbe free to use?", a: "Yes. Students can browse and apply for free. Tutors can post up to 2 tuitions on the free plan." },
  { q: "How are tutors verified?", a: "Admins approve every tuition post. Pro tutors also get a verified badge on their profile." },
  { q: "Can I study online?", a: "Yes. Each batch is marked Online or Offline, and you can filter by mode on the Browse page." },
  { q: "How do I upgrade to Pro?", a: "Open the Pricing page and pay once with Stripe Checkout. Your plan updates automatically." },
];

export default function AboutPage() {
  return (
    <>
      <PageTitle title="How It Works" />
      <section className="bg-base-200">
        <div className="container-x py-14">
          <p className="section-eyebrow">About MentorLagbe</p>
          <h1 className="section-title mt-3 max-w-2xl">Making good tuition easy to find and easy to run</h1>
          <p className="section-lead">
            Students and parents struggle to find verified tutors by subject, class and budget, while
            skilled tutors lack a simple place to show their batches. MentorLagbe solves both in one platform.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((item) => (
              <div key={item.title} className="surface p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon size={24} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-base-content/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="container-x pb-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="section-title text-center">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="collapse collapse-arrow surface">
                <input type="radio" name="faq" defaultChecked={index === 0} aria-label={faq.q} />
                <div className="collapse-title font-extrabold">{faq.q}</div>
                <div className="collapse-content text-sm leading-7 text-base-content/70">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

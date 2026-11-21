import type { ReactNode } from "react";
import { BadgeCheck, CalendarCheck2, ShieldCheck } from "lucide-react";

const points = [
  { icon: BadgeCheck, text: "Verified tutors reviewed by our admins" },
  { icon: CalendarCheck2, text: "Apply in a minute and track every response" },
  { icon: ShieldCheck, text: "Secure payments powered by Stripe" },
];

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="container-x grid min-h-[calc(100vh-72px)] items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
      <aside className="gradient-brand relative hidden overflow-hidden rounded-[2rem] p-10 text-white lg:block">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/70">MentorLagbe</p>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight">
            Learn better with a mentor who fits you.
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Students find verified tutors. Tutors grow their batches. Everything happens in one place.
          </p>
          <ul className="mt-10 space-y-5">
            {points.map((point) => (
              <li key={point.text} className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15">
                  <point.icon size={22} />
                </span>
                <span className="text-sm font-semibold">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="mt-2 text-sm text-base-content/65">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

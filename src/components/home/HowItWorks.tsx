"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, GraduationCap, PlusSquare, Search, Send, ShieldCheck, UserPlus, Users } from "lucide-react";

const flows = {
  students: [
    { icon: UserPlus, title: "Create a free account", text: "Sign up as a student in under a minute. No credit card needed." },
    { icon: Search, title: "Search and filter", text: "Find approved tuitions by subject, class level, mode and fee." },
    { icon: Send, title: "Apply with your schedule", text: "Send your phone, preferred time and a short learning note." },
    { icon: GraduationCap, title: "Learn and track", text: "Follow every application status from your dashboard." },
  ],
  tutors: [
    { icon: UserPlus, title: "Sign up as a tutor", text: "Create your tutor account and complete your profile." },
    { icon: PlusSquare, title: "Post your batch", text: "Add subject, fee, schedule and a banner image in a few clicks." },
    { icon: ShieldCheck, title: "Get approved", text: "Our admins review every post so students can trust it." },
    { icon: Users, title: "Manage applicants", text: "Accept or reject students and grow your batch." },
  ],
};

export default function HowItWorks() {
  const [tab, setTab] = useState<"students" | "tutors">("students");

  return (
    <section id="how-it-works" className="container-x py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">Simple process</p>
        <h2 className="section-title mt-3">How MentorLagbe works</h2>
        <p className="section-lead mx-auto">Four easy steps, whether you want to learn or to teach.</p>

        <div role="tablist" className="mx-auto mt-8 inline-flex rounded-full border border-base-300 bg-base-200 p-1">
          {(["students", "tutors"] as const).map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={`rounded-full px-6 py-2 text-sm font-bold capitalize transition ${
                tab === item ? "bg-primary text-primary-content shadow" : "text-base-content/70"
              }`}
            >
              For {item}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.ol
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <span className="pointer-events-none absolute left-[12%] right-[12%] top-11 hidden border-t-2 border-dashed border-base-300 lg:block" />
          {flows[tab].map((step, index) => (
            <li key={step.title} className="relative text-center">
              <span className="relative z-10 mx-auto grid size-[88px] place-items-center rounded-3xl border border-base-300 bg-base-100 text-primary shadow-soft">
                <step.icon size={34} />
                <span className="absolute -right-2 -top-2 grid size-8 place-items-center rounded-full bg-accent text-sm font-extrabold text-accent-content">
                  {index + 1}
                </span>
              </span>
              <h3 className="mt-6 text-lg font-extrabold">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-6 text-base-content/65">{step.text}</p>
            </li>
          ))}
        </motion.ol>
      </AnimatePresence>

      <p className="mt-12 flex items-center justify-center gap-2 text-sm font-semibold text-base-content/60">
        <CheckCircle2 size={17} className="text-success" /> Every tuition post is reviewed by an admin before it goes live.
      </p>
    </section>
  );
}

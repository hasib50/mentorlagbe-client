"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarCheck2, Search, Star } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { usePublicStats } from "@/hooks/usePublicStats";

const quick = ["Mathematics", "Physics", "Programming", "IELTS", "Chemistry"];

const float = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay },
});

export default function Hero() {
  const router = useRouter();
  const stats = usePublicStats();
  const [query, setQuery] = useState("");

  function search(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/tuitions?search=${encodeURIComponent(q)}` : "/tuitions");
  }

  return (
    <section className="relative overflow-hidden bg-base-200">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="pointer-events-none absolute -left-32 top-10 size-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-96 rounded-full bg-accent/25 blur-3xl" />

      <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2 text-xs font-bold shadow-sm"
          >
            <span className="size-2 animate-pulse rounded-full bg-success" />
            {stats ? `${stats.tuitions} live batches by ${stats.tutors} tutors` : "Smart tuition & mentorship platform"}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.6rem]"
          >
            Find Your <span className="marker">Ideal Tutor</span> or Mentorship Batch Today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="section-lead"
          >
            Search verified tutors by subject, class level, mode and monthly budget. Learn online or at
            home, apply in a minute and track every response in one place.
          </motion.p>

          <motion.form
            onSubmit={search}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-base-300 bg-base-100 p-2 shadow-soft"
          >
            <Search size={20} className="ml-3 shrink-0 text-base-content/50" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a subject or tuition title"
              aria-label="Search tuitions"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm font-semibold outline-none placeholder:font-medium"
            />
            <button type="submit" className="btn btn-primary">
              Browse <ArrowRight size={16} />
            </button>
          </motion.form>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-base-content/60">Popular:</span>
            {quick.map((subject) => (
              <button
                key={subject}
                onClick={() => router.push(`/tuitions?subject=${encodeURIComponent(subject)}`)}
                className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-bold transition hover:border-primary hover:text-primary"
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-[500px]"
        >
          <div className="gradient-brand absolute inset-4 rotate-3 rounded-[2.2rem] opacity-90" />
          <div className="relative overflow-hidden rounded-[2.2rem] border-4 border-base-100 shadow-2xl">
            <SafeImage
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
              alt="Students learning together"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <motion.div {...float(0)} className="surface absolute -left-4 top-10 flex items-center gap-3 p-3 pr-5 shadow-xl sm:-left-10">
            <span className="grid size-11 place-items-center rounded-xl bg-success/15 text-success">
              <BadgeCheck size={24} />
            </span>
            <div>
              <p className="text-sm font-extrabold">Verified Tutors</p>
              <p className="text-xs text-base-content/60">{stats ? `${stats.tutors}+ mentors` : "Hand-picked mentors"}</p>
            </div>
          </motion.div>

          <motion.div {...float(1.2)} className="surface absolute -right-3 top-[44%] flex items-center gap-3 p-3 pr-5 shadow-xl sm:-right-8">
            <span className="grid size-11 place-items-center rounded-xl bg-accent/30 text-accent-content">
              <Star size={22} className="fill-current" />
            </span>
            <div>
              <p className="text-sm font-extrabold">Top rated</p>
              <p className="text-xs text-base-content/60">Loved by learners</p>
            </div>
          </motion.div>

          <motion.div {...float(2.1)} className="surface absolute -bottom-5 left-4 flex items-center gap-3 p-3 pr-5 shadow-xl sm:left-6">
            <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <CalendarCheck2 size={22} />
            </span>
            <div>
              <p className="text-sm font-extrabold">Class booked</p>
              <p className="text-xs text-base-content/60">Math · Class 9-10 · 3 days/week</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

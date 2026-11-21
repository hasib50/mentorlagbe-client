"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Atom, BookOpenText, Calculator, Code2, Dna, FlaskConical, Languages, Landmark } from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import { usePublicStats } from "@/hooks/usePublicStats";

const subjects = [
  { name: "Mathematics", icon: Calculator, tone: "bg-primary/12 text-primary" },
  { name: "Physics", icon: Atom, tone: "bg-secondary/15 text-secondary" },
  { name: "Chemistry", icon: FlaskConical, tone: "bg-success/15 text-success" },
  { name: "Biology", icon: Dna, tone: "bg-info/15 text-info" },
  { name: "Programming", icon: Code2, tone: "bg-primary/12 text-primary" },
  { name: "IELTS", icon: Languages, tone: "bg-accent/30 text-accent-content" },
  { name: "English", icon: BookOpenText, tone: "bg-secondary/15 text-secondary" },
  { name: "Accounting", icon: Landmark, tone: "bg-success/15 text-success" },
];

export default function SubjectsStats() {
  const stats = usePublicStats();
  const countFor = (name: string) =>
    stats?.subjects.find((item) => item.subject.toLowerCase() === name.toLowerCase())?.count ?? 0;

  const numbers = [
    { label: "Verified tutors", value: stats?.tutors ?? 0, suffix: "+" },
    { label: "Active students", value: stats?.students ?? 0, suffix: "+" },
    { label: "Live tuition batches", value: stats?.tuitions ?? 0, suffix: "" },
    { label: "Subjects covered", value: stats?.subjects.length ?? 0, suffix: "+" },
  ];

  return (
    <section className="bg-base-200 py-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Top subjects</p>
          <h2 className="section-title mt-3">Learn what matters most</h2>
          <p className="section-lead mx-auto">
            From school mathematics to programming and IELTS, pick a subject and meet the right mentor.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
                className="surface card-lift flex h-full flex-col items-start gap-4 p-5"
              >
                <span className={`grid size-12 place-items-center rounded-2xl ${subject.tone}`}>
                  <subject.icon size={24} />
                </span>
                <div>
                  <h3 className="text-base font-extrabold">{subject.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-base-content/60">
                    {countFor(subject.name)} {countFor(subject.name) === 1 ? "batch" : "batches"}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Platform statistics */}
        <div className="gradient-brand shadow-soft mt-14 grid grid-cols-2 gap-y-8 rounded-[1.75rem] px-6 py-10 text-white lg:grid-cols-4">
          {numbers.map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-display text-4xl font-extrabold sm:text-5xl">
                <CountUp value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-2 text-sm font-semibold text-white/80">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

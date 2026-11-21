import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="container-x pb-20">
      <div className="gradient-brand shadow-soft relative overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white sm:px-12">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Ready to learn something new or share what you know?
          </h2>
          <p className="mt-4 text-white/80">
            Join MentorLagbe today. It is free to start, and your next great tutor or student is one click away.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tuitions" className="btn btn-accent">
              Browse Tuitions <ArrowRight size={16} />
            </Link>
            <Link href="/sign-up?role=tutor" className="btn border-white/40 bg-white/10 text-white hover:bg-white/20">
              Become a Tutor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

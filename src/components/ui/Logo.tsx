import Link from "next/link";
import { GraduationCap } from "lucide-react";

// Same logo size and style on the navbar, footer and dashboard
export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group inline-flex shrink-0 items-center gap-2.5" aria-label="MentorLagbe home">
      <span className="gradient-brand shadow-soft grid size-10 place-items-center rounded-xl text-white transition-transform group-hover:-rotate-6">
        <GraduationCap size={22} />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        Mentor<span className="text-primary">Lagbe</span>
      </span>
    </Link>
  );
}

import Link from "next/link";
import { CalendarDays, GraduationCap, Heart, MapPin } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import Avatar from "@/components/ui/Avatar";
import { money } from "@/lib/utils";
import type { Tuition } from "@/types";

type Props = {
  tuition: Tuition;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
};

// Every card has the same height: the price row is pinned to the bottom
export default function TuitionCard({ tuition, saved, onToggleSave }: Props) {
  return (
    <article className="surface card-lift group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <SafeImage
          src={tuition.bannerImage}
          alt={tuition.title}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="badge absolute left-3 top-3 border-0 bg-base-100/95 font-bold text-primary shadow">
          {tuition.subject}
        </span>
        <span
          className={`badge absolute right-3 top-3 border-0 font-bold shadow ${
            tuition.mode === "Online" ? "bg-success text-success-content" : "bg-accent text-accent-content"
          }`}
        >
          {tuition.mode}
        </span>
        {onToggleSave && (
          <button
            onClick={() => onToggleSave(tuition._id)}
            aria-label={saved ? "Remove from saved" : "Save tuition"}
            className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-base-100/95 shadow transition hover:scale-110"
          >
            <Heart size={17} className={saved ? "fill-secondary text-secondary" : "text-base-content/70"} />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.1rem] text-lg font-extrabold leading-snug">{tuition.title}</h3>

        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-base-content/70">
          <Avatar name={tuition.tutorName} className="size-6 text-[10px]" />
          <span className="truncate">{tuition.tutorName}</span>
        </p>

        <div className="mb-5 mt-4 flex flex-wrap gap-2 text-xs font-semibold text-base-content/70">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
            <GraduationCap size={14} className="text-primary" /> {tuition.classLevel}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
            <CalendarDays size={14} className="text-primary" /> {tuition.daysPerWeek} days/week
          </span>
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
            <MapPin size={14} className="shrink-0 text-primary" />
            <span className="truncate">{tuition.location}</span>
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-base-300 pt-4">
          <p>
            <span className="text-xl font-extrabold text-primary">{money(tuition.monthlyFee)}</span>
            <span className="text-xs font-semibold text-base-content/60"> /month</span>
          </p>
          <Link href={`/tuitions/${tuition._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function TuitionCardSkeleton() {
  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <div className="skeleton aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-5 w-3/5" />
        <div className="skeleton h-4 w-2/5" />
        <div className="flex gap-2 pt-2">
          <div className="skeleton h-7 w-24 rounded-full" />
          <div className="skeleton h-7 w-24 rounded-full" />
        </div>
        <div className="skeleton mt-4 h-9 w-full" />
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft, BadgeCheck, CalendarDays, CheckCircle2, Clock, GraduationCap, Heart, Info, MapPin, MonitorSmartphone, SearchX, Wallet,
} from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import SafeImage from "@/components/ui/SafeImage";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/Badges";
import ApplyModal from "@/components/tuition/ApplyModal";
import { api, publicApi } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { errMsg, fmtDate, money } from "@/lib/utils";
import type { Application, Tuition } from "@/types";

type Check = { applied: boolean; status: Application["status"] | null };

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-base-200 p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-base-100 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-base-content/55">{label}</p>
        <p className="mt-0.5 truncate text-sm font-extrabold">{value}</p>
      </div>
    </div>
  );
}

export default function TuitionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, role, isPending } = useCurrentUser();

  const { data: tuition, loading, error } = useAsync<Tuition | null>(async () => {
    if (isPending) return null;
    // Logged in users send their token too, so owners/admins can preview their own posts
    const client = user ? api : publicApi;
    return (await client.get<Tuition>(`/tuitions/${id}`)).data;
  }, [id, isPending, user?.email]);

  const [applyOpen, setApplyOpen] = useState(false);
  const [check, setCheck] = useState<Check>({ applied: false, status: null });
  const [saved, setSaved] = useState(false);

  const isStudent = role === "student";

  const loadStudentState = useCallback(async () => {
    if (!isStudent) return;
    try {
      const [applied, savedList] = await Promise.all([
        api.get<Check>(`/applications/check/${id}`),
        api.get<Tuition[]>("/users/me/saved"),
      ]);
      setCheck(applied.data);
      setSaved(savedList.data.some((item) => item._id === id));
    } catch {
      /* the page still works without this extra info */
    }
  }, [isStudent, id]);

  useEffect(() => {
    loadStudentState();
  }, [loadStudentState]);

  async function toggleSave() {
    try {
      const { data } = await api.post<{ saved: boolean }>(`/users/me/saved/${id}`);
      setSaved(data.saved);
      toast.success(data.saved ? "Saved to your list." : "Removed from saved.");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  if (loading || isPending) {
    return (
      <div className="container-x py-10">
        <div className="skeleton h-8 w-40" />
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="skeleton aspect-[16/8] w-full rounded-3xl" />
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-32 w-full" />
          </div>
          <div className="skeleton h-72 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !tuition) {
    return (
      <div className="container-x py-16">
        <PageTitle title="Tuition not found" />
        <EmptyState
          icon={<SearchX size={30} />}
          title="This tuition is not available"
          text={error ?? "It may have been closed, removed or is still waiting for approval."}
          action={<Link href="/tuitions" className="btn btn-primary">Browse tuitions</Link>}
        />
      </div>
    );
  }

  const live = tuition.approvalStatus === "approved" && tuition.isActive;
  const tutor = tuition.tutor;

  function sidebarAction(tuition: Tuition) {
    if (!live) {
      return (
        <div role="alert" className="alert alert-warning alert-soft text-sm">
          <Info size={18} /> This post is not public yet (status: {tuition.approvalStatus}
          {tuition.approvalStatus === "approved" && !tuition.isActive ? ", closed" : ""}).
        </div>
      );
    }
    if (!user) {
      return (
        <Link href={`/sign-in?callbackURL=${encodeURIComponent(`/tuitions/${id}`)}`} className="btn btn-primary w-full">
          Sign in to apply
        </Link>
      );
    }
    if (!isStudent) {
      return (
        <>
          <button className="btn w-full" disabled>Apply Now</button>
          <p role="note" className="mt-3 flex items-start gap-2 text-xs leading-5 text-base-content/65">
            <Info size={15} className="mt-0.5 shrink-0 text-info" />
            Only student accounts can apply for tuitions. You are signed in as a {role}.
          </p>
        </>
      );
    }
    if (check.applied) {
      return (
        <div className="rounded-2xl bg-success/10 p-4 text-center">
          <CheckCircle2 className="mx-auto text-success" />
          <p className="mt-2 text-sm font-extrabold">You have applied</p>
          <div className="mt-2 flex justify-center">
            {check.status && <StatusBadge status={check.status} />}
          </div>
          <Link href="/dashboard/student/my-applications" className="mt-3 inline-block text-xs font-bold text-primary hover:underline">
            View my applications
          </Link>
        </div>
      );
    }
    return (
      <button className="btn btn-primary w-full" onClick={() => setApplyOpen(true)}>
        Apply for Tuition
      </button>
    );
  }

  return (
    <div className="container-x py-8 sm:py-10">
      <PageTitle title={tuition.title} />

      <Link href="/tuitions" className="inline-flex items-center gap-2 text-sm font-bold text-base-content/70 hover:text-primary">
        <ArrowLeft size={16} /> Back to all tuitions
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SafeImage
            src={tuition.bannerImage}
            alt={tuition.title}
            className="aspect-[16/8] w-full rounded-3xl border border-base-300 object-cover"
          />

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="badge badge-primary badge-soft font-bold">{tuition.subject}</span>
            <span className={`badge font-bold ${tuition.mode === "Online" ? "badge-success" : "badge-warning"} badge-soft`}>
              {tuition.mode}
            </span>
            <span className="badge badge-ghost font-semibold">{tuition.classLevel}</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{tuition.title}</h1>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Fact icon={<GraduationCap size={20} />} label="Class level" value={tuition.classLevel} />
            <Fact icon={<CalendarDays size={20} />} label="Schedule" value={`${tuition.daysPerWeek} days / week`} />
            <Fact icon={<MonitorSmartphone size={20} />} label="Mode" value={tuition.mode} />
            <Fact icon={<MapPin size={20} />} label="Location" value={tuition.location} />
            <Fact icon={<Wallet size={20} />} label="Monthly fee" value={money(tuition.monthlyFee)} />
            <Fact icon={<Clock size={20} />} label="Posted on" value={fmtDate(tuition.createdAt)} />
          </div>

          <h2 className="mt-10 text-xl font-extrabold">About this tuition</h2>
          <p className="mt-3 whitespace-pre-line text-[15px] leading-8 text-base-content/80">{tuition.description}</p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="surface p-6 shadow-soft">
            <p className="text-sm font-semibold text-base-content/60">Monthly fee</p>
            <p className="font-display text-4xl font-extrabold text-primary">
              {money(tuition.monthlyFee)}
              <span className="text-base font-semibold text-base-content/50"> /month</span>
            </p>
            <div className="mt-5">{sidebarAction(tuition)}</div>

            {isStudent && live && (
              <button onClick={toggleSave} className="btn btn-ghost btn-sm mt-3 w-full">
                <Heart size={16} className={saved ? "fill-secondary text-secondary" : ""} />
                {saved ? "Saved to your list" : "Save for later"}
              </button>
            )}
          </div>

          <div className="surface p-6">
            <p className="text-xs font-extrabold uppercase tracking-wider text-base-content/55">Your tutor</p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar src={tutor?.image} name={tutor?.name ?? tuition.tutorName} className="size-14 text-lg" />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate font-extrabold">
                  {tutor?.name ?? tuition.tutorName}
                  {tutor?.isPro && <BadgeCheck size={18} className="shrink-0 text-primary" aria-label="Verified tutor" />}
                </p>
                <p className="text-xs text-base-content/60">
                  {tutor?.tuitionCount ?? 1} active {tutor?.tuitionCount === 1 ? "batch" : "batches"}
                  {tutor?.joinedAt ? ` · since ${fmtDate(tutor.joinedAt)}` : ""}
                </p>
              </div>
            </div>
            {tutor?.bio && <p className="mt-4 text-sm leading-6 text-base-content/70">{tutor.bio}</p>}
          </div>
        </aside>
      </div>

      <ApplyModal
        open={applyOpen}
        tuition={tuition}
        onClose={() => setApplyOpen(false)}
        onApplied={() => setCheck({ applied: true, status: "pending" })}
      />
    </div>
  );
}

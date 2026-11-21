"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader } from "@/components/dashboard/ui";
import TuitionForm from "@/components/tuition/TuitionForm";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FREE_TUITION_LIMIT } from "@/lib/constants";
import { errMsg } from "@/lib/utils";
import type { TuitionInput } from "@/types";

export default function PostTuitionPage() {
  const router = useRouter();
  const { plan } = useCurrentUser();
  const { data: stats, loading } = useAsync(async () => (await api.get<{ totalTuitions: number }>("/tutor/stats")).data);

  const limitReached = plan !== "pro" && (stats?.totalTuitions ?? 0) >= FREE_TUITION_LIMIT;

  async function create(data: TuitionInput) {
    try {
      await api.post("/tuitions", data);
      toast.success("Tuition posted! It will go live after admin approval.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (error) {
      toast.error(errMsg(error));
    }
  }

  return (
    <>
      <PageTitle title="Post a Tuition" />
      <PageHeader
        title="Post a Tuition"
        subtitle={plan === "pro" ? "Pro plan: unlimited posts." : `Free plan: up to ${FREE_TUITION_LIMIT} posts (${stats?.totalTuitions ?? 0} used).`}
      />

      {loading ? (
        <div className="skeleton h-96 w-full rounded-3xl" />
      ) : limitReached ? (
        <div className="surface mx-auto grid max-w-xl place-items-center p-10 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-warning/20 text-warning"><Lock size={30} /></span>
          <h2 className="mt-5 text-2xl font-extrabold">You reached the free limit</h2>
          <p className="mt-2 text-sm leading-6 text-base-content/65">
            Free tutors can post up to {FREE_TUITION_LIMIT} tuitions. Upgrade to Pro for unlimited posts, or delete an old post from My Tuitions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className="btn btn-primary">Upgrade to Pro</Link>
            <Link href="/dashboard/tutor/my-tuitions" className="btn btn-outline">My tuitions</Link>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl">
          <TuitionForm submitLabel="Post Tuition" onSubmit={create} />
        </div>
      )}
    </>
  );
}

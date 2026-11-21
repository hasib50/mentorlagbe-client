"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { Bookmark } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader } from "@/components/dashboard/ui";
import TuitionCard, { TuitionCardSkeleton } from "@/components/tuition/TuitionCard";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { errMsg } from "@/lib/utils";
import type { Tuition } from "@/types";

export default function SavedTuitionsPage() {
  const { data, setData, loading, error } = useAsync(async () => (await api.get<Tuition[]>("/users/me/saved")).data);

  async function unsave(id: string) {
    try {
      await api.post(`/users/me/saved/${id}`);
      setData((old) => (old ?? []).filter((item) => item._id !== id));
      toast.success("Removed from saved.");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <>
      <PageTitle title="Saved Tuitions" />
      <PageHeader title="Saved Tuitions" subtitle="Your bookmarked batches, all in one place." />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, index) => <TuitionCardSkeleton key={index} />)}
        {data?.map((tuition) => <TuitionCard key={tuition._id} tuition={tuition} saved onToggleSave={unsave} />)}
      </div>

      {error && <div role="alert" className="alert alert-error alert-soft">{error}</div>}
      {!loading && !error && data?.length === 0 && (
        <EmptyState icon={<Bookmark size={28} />} title="Nothing saved yet" text="Tap the heart on any tuition card to save it for later." action={<Link href="/tuitions" className="btn btn-primary">Browse tuitions</Link>} />
      )}
    </>
  );
}

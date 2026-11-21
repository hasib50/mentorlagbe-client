"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader } from "@/components/dashboard/ui";
import TuitionForm from "@/components/tuition/TuitionForm";
import { StatusBadge } from "@/components/ui/Badges";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { errMsg } from "@/lib/utils";
import type { Tuition, TuitionInput } from "@/types";

export default function EditTuitionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: tuition, loading, error } = useAsync(async () => (await api.get<Tuition>(`/tuitions/${id}`)).data, [id]);

  async function save(data: TuitionInput) {
    try {
      await api.patch(`/tuitions/${id}`, data);
      toast.success("Tuition updated successfully.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  return (
    <>
      <PageTitle title="Edit Tuition" />
      <Link href="/dashboard/tutor/my-tuitions" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-base-content/70 hover:text-primary">
        <ArrowLeft size={16} /> Back to my tuitions
      </Link>
      <PageHeader title="Edit Tuition" subtitle="Update your batch details. A rejected post goes back for review after you save." actions={tuition && <StatusBadge status={tuition.approvalStatus} />} />

      {loading && <div className="skeleton h-96 w-full rounded-3xl" />}
      {error && <div role="alert" className="alert alert-error alert-soft">{error}</div>}
      {tuition && (
        <div className="max-w-4xl">
          <TuitionForm initial={tuition} submitLabel="Save Changes" onSubmit={save} />
        </div>
      )}
    </>
  );
}

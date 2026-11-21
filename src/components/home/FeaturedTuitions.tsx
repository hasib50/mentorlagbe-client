"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookX } from "lucide-react";
import { publicApi } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import TuitionCard, { TuitionCardSkeleton } from "@/components/tuition/TuitionCard";
import EmptyState from "@/components/ui/EmptyState";
import type { Paged, Tuition } from "@/types";

export default function FeaturedTuitions() {
  const { data, loading, error } = useAsync(
    async () => (await publicApi.get<Paged<Tuition>>("/tuitions", { params: { limit: 6, sort: "latest" } })).data
  );

  return (
    <section className="container-x py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="section-eyebrow">Fresh batches</p>
          <h2 className="section-title mt-3">Featured Tuitions</h2>
          <p className="section-lead">The six latest approved batches from our verified tutors.</p>
        </div>
        <Link href="/tuitions" className="btn btn-outline">
          View all tuitions <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, index) => <TuitionCardSkeleton key={index} />)}

        {!loading &&
          data?.items.map((tuition, index) => (
            <motion.div
              key={tuition._id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
              className="h-full"
            >
              <TuitionCard tuition={tuition} />
            </motion.div>
          ))}
      </div>

      {!loading && (error || !data?.items.length) && (
        <EmptyState
          icon={<BookX size={30} />}
          title={error ? "We could not load tuitions" : "No tuitions yet"}
          text={error ?? "Approved tuition batches will appear here as soon as tutors post them."}
        />
      )}
    </section>
  );
}

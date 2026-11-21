"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { api, publicApi } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CLASS_LEVELS, SUBJECT_SUGGESTIONS } from "@/lib/constants";
import { errMsg } from "@/lib/utils";
import TuitionCard, { TuitionCardSkeleton } from "@/components/tuition/TuitionCard";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import type { Paged, Tuition } from "@/types";

export default function TuitionsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { role } = useCurrentUser();

  const search = params.get("search") ?? "";
  const subject = params.get("subject") ?? "";
  const classLevel = params.get("classLevel") ?? "";
  const mode = params.get("mode") ?? "";
  const sort = params.get("sort") ?? "latest";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(search);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  // Write filters to the URL (so a reload or a shared link keeps them)
  function update(patch: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (!("page" in patch)) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Debounced search box
  useEffect(() => {
    if (searchInput === search) return;
    const timer = setTimeout(() => update({ search: searchInput.trim() }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  useEffect(() => setSearchInput(search), [search]);

  const { data, loading, error } = useAsync(
    async () =>
      (
        await publicApi.get<Paged<Tuition>>("/tuitions", {
          params: { search, subject, classLevel, mode, sort, page, limit: 9 },
        })
      ).data,
    [search, subject, classLevel, mode, sort, page]
  );

  const { data: meta } = useAsync(
    async () => (await publicApi.get<{ subjects: string[]; classLevels: string[] }>("/tuitions/meta/filters")).data
  );

  const subjects = useMemo(
    () => Array.from(new Set([...SUBJECT_SUGGESTIONS, ...(meta?.subjects ?? [])])).sort(),
    [meta]
  );
  const levels = useMemo(
    () => CLASS_LEVELS.filter((level) => !meta || meta.classLevels.includes(level) || level === classLevel),
    [meta, classLevel]
  );

  // Bookmarks are for students
  useEffect(() => {
    if (role !== "student") return;
    api
      .get<Tuition[]>("/users/me/saved")
      .then((res) => setSaved(new Set(res.data.map((item) => item._id))))
      .catch(() => undefined);
  }, [role]);

  async function toggleSave(id: string) {
    try {
      const { data: result } = await api.post<{ saved: boolean }>(`/users/me/saved/${id}`);
      setSaved((old) => {
        const next = new Set(old);
        if (result.saved) next.add(id);
        else next.delete(id);
        return next;
      });
      toast.success(result.saved ? "Saved to your list." : "Removed from saved.");
    } catch (err) {
      toast.error(errMsg(err));
    }
  }

  const hasFilters = Boolean(search || subject || classLevel || mode || sort !== "latest");

  return (
    <>
      <div className="surface p-4 shadow-sm sm:p-5">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <SlidersHorizontal size={17} className="text-primary" /> Find your tutor
        </div>

        <div className="relative mt-4">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by title or subject..."
            aria-label="Search tuitions"
            className="input pl-11"
          />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select className="select" aria-label="Subject" value={subject} onChange={(e) => update({ subject: e.target.value })}>
            <option value="">All subjects</option>
            {subjects.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="select" aria-label="Class level" value={classLevel} onChange={(e) => update({ classLevel: e.target.value })}>
            <option value="">All class levels</option>
            {levels.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="select" aria-label="Mode" value={mode} onChange={(e) => update({ mode: e.target.value })}>
            <option value="">Online &amp; Offline</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
          <select className="select" aria-label="Sort" value={sort} onChange={(e) => update({ sort: e.target.value === "latest" ? "" : e.target.value })}>
            <option value="latest">Newest first</option>
            <option value="fee_low">Fee: low to high</option>
            <option value="fee_high">Fee: high to low</option>
          </select>
          <button className="btn btn-ghost" disabled={!hasFilters} onClick={() => router.replace(pathname, { scroll: false })}>
            <X size={16} /> Clear filters
          </button>
        </div>
      </div>

      <p className="mb-5 mt-8 text-sm font-semibold text-base-content/65" aria-live="polite">
        {loading ? "Searching..." : data ? `Showing ${data.items.length} of ${data.total} tuitions` : ""}
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 6 }).map((_, index) => <TuitionCardSkeleton key={index} />)}
        {!loading &&
          data?.items.map((tuition) => (
            <TuitionCard
              key={tuition._id}
              tuition={tuition}
              saved={saved.has(tuition._id)}
              onToggleSave={role === "student" ? toggleSave : undefined}
            />
          ))}
      </div>

      {!loading && (error || data?.items.length === 0) && (
        <EmptyState
          icon={<SearchX size={30} />}
          title={error ? "Something went wrong" : "No tuitions match your search"}
          text={error ?? "Try a different keyword or clear some filters."}
          action={hasFilters ? <button className="btn btn-primary" onClick={() => router.replace(pathname)}>Clear filters</button> : undefined}
        />
      )}

      {data && (
        <Pagination
          page={data.page}
          pages={data.pages}
          onChange={(next) => {
            update({ page: next === 1 ? "" : String(next) });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </>
  );
}

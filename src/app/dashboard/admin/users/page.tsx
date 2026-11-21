"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, Users } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, TableSkeleton } from "@/components/dashboard/ui";
import { PlanBadge, RoleBadge } from "@/components/ui/Badges";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { errMsg, fmtDate } from "@/lib/utils";
import type { AppUser, Role } from "@/types";

export default function AdminUsersPage() {
  const { user: me } = useCurrentUser();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, setData, loading, error } = useAsync(
    async () => (await api.get<AppUser[]>("/admin/users", { params: { search: query, role } })).data,
    [query, role]
  );

  async function changeRole(target: AppUser, next: Role) {
    if (next === target.role) return;
    setBusyId(target._id);
    try {
      await api.patch(`/admin/users/${target._id}/role`, { role: next });
      setData((old) => (old ?? []).map((item) => (item._id === target._id ? { ...item, role: next } : item)));
      toast.success(`${target.name} is now a ${next}.`);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageTitle title="User Management" />
      <PageHeader title="User Management" subtitle="Search users and manage their roles." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" />
          <input className="input pl-11" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search users" />
        </div>
        <select className="select sm:max-w-48" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role">
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="tutor">Tutors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading && <TableSkeleton rows={6} />}
      {error && <div role="alert" className="alert alert-error alert-soft">{error}</div>}
      {!loading && !error && data?.length === 0 && <EmptyState icon={<Users size={28} />} title="No users found" text="Try a different search or role filter." />}

      {data && data.length > 0 && (
        <div className="surface overflow-x-auto">
          <table className="table">
            <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Joined</th><th>Change role</th></tr></thead>
            <tbody>
              {data.map((item) => {
                const isMe = item.email === me?.email;
                return (
                  <tr key={item._id} className="hover:bg-base-200/60">
                    <td>
                      <div className="flex min-w-[220px] items-center gap-3">
                        <Avatar src={item.image} name={item.name} className="size-10 text-sm" />
                        <div className="min-w-0">
                          <p className="truncate font-extrabold">{item.name} {isMe && <span className="text-xs font-semibold text-base-content/50">(you)</span>}</p>
                          <p className="truncate text-xs text-base-content/60">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><RoleBadge role={item.role} /></td>
                    <td><PlanBadge plan={item.plan} /></td>
                    <td className="whitespace-nowrap text-sm">{fmtDate(item.createdAt)}</td>
                    <td>
                      <select
                        className="select select-sm w-36"
                        value={item.role}
                        disabled={isMe || busyId === item._id}
                        onChange={(e) => changeRole(item, e.target.value as Role)}
                        aria-label={`Role for ${item.name}`}
                        title={isMe ? "You cannot change your own role" : undefined}
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

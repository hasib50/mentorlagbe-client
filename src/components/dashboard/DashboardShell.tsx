"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark, BookOpen, BookOpenCheck, ClipboardList, CreditCard, Globe, LayoutDashboard, LogOut,
  Menu, PanelLeftClose, PanelLeftOpen, PlusCircle, Sparkles, UserCog, Users, X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";
import { PlanBadge, RoleBadge } from "@/components/ui/Badges";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSignOut } from "@/hooks/useSignOut";
import type { Role } from "@/types";

type Item = { label: string; href: string; icon: LucideIcon; exact?: boolean };

const NAV: Record<Role, Item[]> = {
  student: [
    { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard, exact: true },
    { label: "My Applications", href: "/dashboard/student/my-applications", icon: ClipboardList },
    { label: "Saved Tuitions", href: "/dashboard/student/saved", icon: Bookmark },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
  tutor: [
    { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard, exact: true },
    { label: "Post a Tuition", href: "/dashboard/tutor/post-tuition", icon: PlusCircle },
    { label: "My Tuitions", href: "/dashboard/tutor/my-tuitions", icon: BookOpen },
    { label: "Applicants", href: "/dashboard/tutor/applicants", icon: Users },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Tuition Approval", href: "/dashboard/admin/tuitions", icon: BookOpenCheck },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { label: "Update Profile", href: "/dashboard/profile", icon: UserCog },
  ],
};

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, role = "student", plan } = useCurrentUser();
  const signOut = useSignOut();

  const items = NAV[role];
  const active = (item: Item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <div className="flex h-full flex-col">
      <div className={`flex h-16 shrink-0 items-center border-b border-base-300 ${collapsed ? "justify-center" : "px-5"}`}>
        {collapsed ? (
          <Link href="/" aria-label="MentorLagbe home" className="gradient-brand grid size-10 place-items-center rounded-xl text-white">
            <span className="font-display text-lg font-extrabold">M</span>
          </Link>
        ) : (
          <Logo />
        )}
      </div>

      {/* User profile summary */}
      <div className={`border-b border-base-300 ${collapsed ? "flex justify-center py-4" : "p-4"}`}>
        {collapsed ? (
          <Avatar src={user?.image} name={user?.name} className="size-10 text-sm" />
        ) : (
          <div className="rounded-2xl bg-base-200 p-4">
            <div className="flex items-center gap-3">
              <Avatar src={user?.image} name={user?.name} className="size-12" />
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">{user?.name}</p>
                <p className="truncate text-xs text-base-content/60">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <RoleBadge role={role} />
              <PlanBadge plan={plan} />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${
              collapsed ? "justify-center" : ""
            } ${active(item) ? "bg-primary text-primary-content shadow-soft" : "text-base-content/70 hover:bg-base-200 hover:text-base-content"}`}
          >
            <item.icon size={19} className="shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-base-300 p-3">
        <Link
          href="/"
          title={collapsed ? "Back to website" : undefined}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-base-content/70 hover:bg-base-200 ${collapsed ? "justify-center" : ""}`}
        >
          <Globe size={19} className="shrink-0" />
          {!collapsed && "Back to website"}
        </Link>
        <button
          onClick={signOut}
          title={collapsed ? "Sign Out" : undefined}
          className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold text-error hover:bg-error/10 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={19} className="shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role = "student", plan } = useCurrentUser();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setDrawer(false), [pathname]);

  const current = NAV[role].find((item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href)));

  return (
    <div className="min-h-screen bg-base-200">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-base-300 bg-base-100 transition-[width] duration-300 lg:block ${
          collapsed ? "w-[84px]" : "w-72"
        }`}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-neutral/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-base-300 bg-base-100 lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <button className="btn btn-ghost btn-circle btn-sm absolute right-3 top-3.5" onClick={() => setDrawer(false)} aria-label="Close menu">
                <X size={18} />
              </button>
              <SidebarContent collapsed={false} onNavigate={() => setDrawer(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={`transition-[padding] duration-300 ${collapsed ? "lg:pl-[84px]" : "lg:pl-72"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button className="btn btn-ghost btn-circle lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu">
              <Menu size={21} />
            </button>
            <button
              className="btn btn-ghost btn-circle hidden lg:inline-flex"
              onClick={() => setCollapsed((value) => !value)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={21} /> : <PanelLeftClose size={21} />}
            </button>
            <p className="truncate text-sm font-extrabold sm:text-base">{current?.label ?? "Dashboard"}</p>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {role !== "admin" && plan !== "pro" && (
              <Link href="/pricing" className="btn btn-accent btn-sm hidden sm:inline-flex">
                <Sparkles size={15} /> Upgrade to Pro
              </Link>
            )}
            <ThemeToggle />
            <Link href="/dashboard/profile" aria-label="Update profile" className="ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-1 sm:pr-3 hover:bg-base-200">
              <Avatar src={user?.image} name={user?.name} className="size-9 text-sm" />
              <span className="hidden max-w-[120px] truncate text-sm font-bold sm:block">{user?.name}</span>
            </Link>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

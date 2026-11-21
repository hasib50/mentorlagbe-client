"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, Menu, UserCog, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";
import { RoleBadge } from "@/components/ui/Badges";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useSignOut } from "@/hooks/useSignOut";

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, isPending } = useCurrentUser();
  const signOut = useSignOut();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // Close the dropdown on outside click or Escape
  useEffect(() => {
    if (!profileOpen) return;

    const onDown = (event: MouseEvent | TouchEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setProfileOpen(false);

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  // Close menus after every navigation
  useEffect(() => {
    setProfileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/85 backdrop-blur-xl">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />

          {isPending ? (
            <span className="skeleton h-10 w-40 rounded-full" />
          ) : user ? (
            <>
              <Link href="/dashboard" className="btn btn-ghost btn-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2.5 rounded-full border border-base-300 py-1 pl-1 pr-3 transition hover:border-primary/50"
                >
                  <Avatar src={user.image} name={user.name} className="size-9 text-sm" />
                  <span className="max-w-[110px] truncate text-sm font-bold">{user.name}</span>
                  <RoleBadge role={role} />
                  <ChevronDown size={15} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="surface absolute right-0 top-14 w-64 p-2 shadow-2xl"
                    >
                      <div className="border-b border-base-300 px-3 pb-3 pt-2">
                        <p className="truncate text-sm font-extrabold">{user.name}</p>
                        <p className="truncate text-xs text-base-content/60">{user.email}</p>
                      </div>
                      <Link href="/dashboard" role="menuitem" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-base-200">
                        <LayoutDashboard size={17} /> Dashboard
                      </Link>
                      <Link href="/dashboard/profile" role="menuitem" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-base-200">
                        <UserCog size={17} /> Update Profile
                      </Link>
                      <button role="menuitem" onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-error hover:bg-error/10">
                        <LogOut size={17} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-base-300 bg-base-100 lg:hidden"
          >
            <div className="container-x space-y-1 py-4">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-bold ${
                    isActive(item.href) ? "bg-primary/10 text-primary" : "hover:bg-base-200"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 border-t border-base-300 pt-4">
                {isPending ? (
                  <span className="skeleton block h-12 w-full rounded-xl" />
                ) : user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-xl bg-base-200 p-3">
                      <Avatar src={user.image} name={user.name} className="size-11" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold">{user.name}</p>
                        <RoleBadge role={role} />
                      </div>
                    </div>
                    <Link href="/dashboard" className="btn btn-primary w-full">
                      <LayoutDashboard size={17} /> Dashboard
                    </Link>
                    <Link href="/dashboard/profile" className="btn btn-outline w-full">
                      <UserCog size={17} /> Update Profile
                    </Link>
                    <button onClick={signOut} className="btn btn-ghost w-full text-error">
                      <LogOut size={17} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/sign-in" className="btn btn-outline">Sign In</Link>
                    <Link href="/sign-up" className="btn btn-primary">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

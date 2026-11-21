"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { FullPageLoader } from "@/components/ui/Loader";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const AREAS = ["student", "tutor", "admin"];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isPending } = useCurrentUser();

  const area = pathname.split("/")[2]; // student | tutor | admin | profile | undefined
  const wrongArea = Boolean(area && AREAS.includes(area) && area !== role);

  useEffect(() => {
    // While the session is loading we do nothing, so a page reload
    // on a private route never bounces the user to the sign in page.
    if (isPending) return;

    if (!user) {
      router.replace(`/sign-in?callbackURL=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!area || wrongArea) router.replace(`/dashboard/${role ?? "student"}`);
  }, [isPending, user, area, wrongArea, role, pathname, router]);

  if (isPending || !user || !area || wrongArea) return <FullPageLoader />;

  return <DashboardShell>{children}</DashboardShell>;
}

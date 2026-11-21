"use client";

import { authClient } from "@/lib/auth-client";
import type { Plan, Role } from "@/types";

export function useCurrentUser() {
  const { data, isPending, refetch } = authClient.useSession();
  const user = data?.user;

  return {
    user,
    role: user?.role as Role | undefined,
    plan: ((user?.plan as Plan | undefined) ?? "free") as Plan,
    isPending,
    refetch,
  };
}

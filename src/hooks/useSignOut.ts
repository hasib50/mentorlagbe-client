"use client";

import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { resetToken } from "@/lib/api";

export function useSignOut() {
  return async function signOut() {
    try {
      await authClient.signOut();
      resetToken();
      toast.success("Signed out successfully.");
      // Full reload clears every piece of cached user state
      window.location.href = "/";
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  };
}

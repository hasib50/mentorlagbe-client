"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import AuthShell from "@/components/ui/AuthShell";
import PasswordInput from "@/components/ui/PasswordInput";
import GoogleButton from "@/components/ui/GoogleButton";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { safeRedirect } from "@/lib/utils";

const demos = [
  { label: "Admin", email: "admin@mentorlagbe.com", password: "Admin@123" },
  { label: "Tutor", email: "tutor@mentorlagbe.com", password: "Tutor@123" },
  { label: "Student", email: "student@mentorlagbe.com", password: "Student@123" },
];

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = safeRedirect(params.get("callbackURL"));
  const { user, isPending } = useCurrentUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  // Already signed in? Go straight to the dashboard
  useEffect(() => {
    if (!isPending && user && !busy) router.replace(callback);
  }, [isPending, user, busy, router, callback]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const found: typeof errors = {};
    if (!emailRx.test(email.trim())) found.email = "Please enter a valid email address.";
    if (password.length < 6) found.password = "Password must be at least 6 characters.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const result = await authClient.signIn.email({ email: email.trim(), password });

    if (result.error) {
      toast.error(result.error.message || "Invalid email or password.");
      setBusy(false);
      return;
    }

    toast.success("Welcome back!");
    router.push(callback);
    router.refresh();
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to your MentorLagbe dashboard.">
      <GoogleButton callbackURL={callback} />
      <form onSubmit={submit} noValidate className="space-y-5">
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <PasswordInput id="password" value={password} onChange={setPassword} placeholder="Your password" autoComplete="current-password" />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy && <Loader2 size={17} className="animate-spin" />}
          {busy ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-base-content/70">
        New to MentorLagbe?{" "}
        <Link href="/sign-up" className="font-extrabold text-primary hover:underline">Create an account</Link>
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-base-300 bg-base-200 p-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">Demo accounts</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {demos.map((demo) => (
            <button
              key={demo.label}
              type="button"
              onClick={() => {
                setEmail(demo.email);
                setPassword(demo.password);
                setErrors({});
              }}
              className="btn btn-sm btn-outline"
            >
              Fill {demo.label}
            </button>
          ))}
        </div>
      </div>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <>
      <PageTitle title="Sign In" />
      <Suspense>
        <SignInForm />
      </Suspense>
    </>
  );
}

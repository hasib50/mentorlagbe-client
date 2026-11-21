"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { GraduationCap, Loader2, Presentation } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import AuthShell from "@/components/ui/AuthShell";
import PasswordInput from "@/components/ui/PasswordInput";
import GoogleButton from "@/components/ui/GoogleButton";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { safeRedirect } from "@/lib/utils";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Errors = { name?: string; email?: string; password?: string };

function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = safeRedirect(params.get("callbackURL"));
  const { user, isPending } = useCurrentUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "tutor">(params.get("role") === "tutor" ? "tutor" : "student");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && user && !busy) router.replace(callback);
  }, [isPending, user, busy, router, callback]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const found: Errors = {};
    if (name.trim().length < 2) found.name = "Please enter your full name.";
    if (!emailRx.test(email.trim())) found.email = "Please enter a valid email address.";
    if (password.length < 6) found.password = "Password must be at least 6 characters.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    const result = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    });

    if (result.error) {
      toast.error(result.error.message || "Could not create your account.");
      setBusy(false);
      return;
    }

    toast.success("Account created. Welcome to MentorLagbe!");
    router.push(callback);
    router.refresh();
  }

  const roles = [
    { value: "student" as const, label: "Student", hint: "Find tutors and apply", icon: GraduationCap },
    { value: "tutor" as const, label: "Tutor", hint: "Post batches and teach", icon: Presentation },
  ];

  return (
    <AuthShell title="Create your account" subtitle="Join MentorLagbe for free. It only takes a minute.">
      <GoogleButton callbackURL={callback} />
      <form onSubmit={submit} noValidate className="space-y-5">
        <div>
          <span className="field-label">I want to join as</span>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => setRole(item.value)}
                aria-pressed={role === item.value}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  role === item.value ? "border-primary bg-primary/8" : "border-base-300 hover:border-primary/40"
                }`}
              >
                <item.icon size={22} className={role === item.value ? "text-primary" : "text-base-content/50"} />
                <p className="mt-2 text-sm font-extrabold">{item.label}</p>
                <p className="text-xs text-base-content/60">{item.hint}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="name">Full name</label>
          <input id="name" autoComplete="name" className="input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <PasswordInput id="password" value={password} onChange={setPassword} placeholder="At least 6 characters" autoComplete="new-password" />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy && <Loader2 size={17} className="animate-spin" />}
          {busy ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-extrabold text-primary hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}

export default function SignUpPage() {
  return (
    <>
      <PageTitle title="Sign Up" />
      <Suspense>
        <SignUpForm />
      </Suspense>
    </>
  );
}

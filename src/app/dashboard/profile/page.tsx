"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import PageTitle from "@/components/ui/PageTitle";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import ImageUploader from "@/components/ui/ImageUploader";
import { PlanBadge, RoleBadge } from "@/components/ui/Badges";
import { api } from "@/lib/api";
import { useAsync } from "@/hooks/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { errMsg } from "@/lib/utils";
import type { AppUser } from "@/types";

export default function ProfilePage() {
  const { refetch } = useCurrentUser();
  const { data: profile, loading } = useAsync(async () => (await api.get<AppUser>("/users/me")).data);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setPhone(profile.phone ?? "");
    setBio(profile.bio ?? "");
    setImage(profile.image ?? "");
  }, [profile]);

  async function save(event: React.FormEvent) {
    event.preventDefault();

    const found: Record<string, string> = {};
    if (name.trim().length < 2) found.name = "Name must be at least 2 characters.";
    if (phone.trim() && !/^[+\d][\d\s-]{6,17}$/.test(phone.trim())) found.phone = "Please enter a valid phone number.";
    if (bio.length > 400) found.bio = "Bio must be 400 characters or fewer.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      await api.patch("/users/me", { name: name.trim(), phone: phone.trim(), bio: bio.trim(), image });
      await refetch(); // refresh the name and photo everywhere
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle title="Update Profile" />
      <PageHeader title="Update Profile" subtitle="Keep your details fresh so tutors and students can trust you." />

      {loading ? (
        <div className="skeleton h-96 w-full max-w-3xl rounded-3xl" />
      ) : (
        <form onSubmit={save} noValidate className="max-w-3xl">
          <Panel>
            <div className="mb-6">
              <span className="field-label">Profile picture</span>
              <ImageUploader variant="avatar" value={image} onChange={setImage} name={name} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="name">Full name</label>
                <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div>
                <label className="field-label" htmlFor="phone">Phone</label>
                <input id="phone" className="input" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>

              <div>
                <label className="field-label" htmlFor="email">Email</label>
                <input id="email" className="input" value={profile?.email ?? ""} readOnly disabled />
              </div>

              <div>
                <span className="field-label">Account</span>
                <div className="flex h-12 items-center gap-2">
                  <RoleBadge role={profile?.role} />
                  <PlanBadge plan={profile?.plan} />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="bio">Bio</label>
                <textarea id="bio" rows={4} className="textarea" placeholder="Tell others a little about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
                <div className="mt-1 flex justify-between text-xs">
                  <span className="field-error mt-0">{errors.bio}</span>
                  <span className="text-base-content/50">{bio.length}/400</span>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-6" disabled={busy}>
              {busy && <Loader2 size={16} className="animate-spin" />}
              {busy ? "Saving..." : "Save Changes"}
            </button>
          </Panel>
        </form>
      )}
    </>
  );
}

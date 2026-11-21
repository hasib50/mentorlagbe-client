"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { CLASS_LEVELS, SUBJECT_SUGGESTIONS } from "@/lib/constants";
import type { Mode, TuitionInput } from "@/types";

type Values = {
  title: string;
  subject: string;
  classLevel: string;
  mode: Mode;
  location: string;
  monthlyFee: string;
  daysPerWeek: string;
  bannerImage: string;
  description: string;
};
type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.title.trim().length < 5) e.title = "Title must be at least 5 characters.";
  if (v.title.trim().length > 120) e.title = "Title must be 120 characters or fewer.";
  if (v.subject.trim().length < 2) e.subject = "Please enter a subject.";
  if (!v.classLevel) e.classLevel = "Please choose a class level.";
  if (v.mode === "Offline" && v.location.trim().length < 3) e.location = "Please enter the location.";
  const fee = Number(v.monthlyFee);
  if (!Number.isFinite(fee) || fee < 100 || fee > 500000) e.monthlyFee = "Fee must be between 100 and 500,000.";
  const days = Number(v.daysPerWeek);
  if (!Number.isInteger(days) || days < 1 || days > 7) e.daysPerWeek = "Choose between 1 and 7 days.";
  if (!v.bannerImage) e.bannerImage = "Please upload a banner image.";
  if (v.description.trim().length < 20) e.description = "Description must be at least 20 characters.";
  if (v.description.trim().length > 2000) e.description = "Description must be 2000 characters or fewer.";
  return e;
}

type Props = {
  initial?: Partial<TuitionInput>;
  submitLabel: string;
  onSubmit: (data: TuitionInput) => Promise<void>;
};

export default function TuitionForm({ initial, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<Values>({
    title: initial?.title ?? "",
    subject: initial?.subject ?? "",
    classLevel: initial?.classLevel ?? "",
    mode: initial?.mode ?? "Online",
    location: initial?.location === "Online" ? "" : initial?.location ?? "",
    monthlyFee: initial?.monthlyFee ? String(initial.monthlyFee) : "",
    daysPerWeek: initial?.daysPerWeek ? String(initial.daysPerWeek) : "3",
    bannerImage: initial?.bannerImage ?? "",
    description: initial?.description ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        subject: values.subject.trim(),
        classLevel: values.classLevel,
        mode: values.mode,
        location: values.mode === "Online" ? values.location.trim() || "Online" : values.location.trim(),
        monthlyFee: Number(values.monthlyFee),
        daysPerWeek: Number(values.daysPerWeek),
        bannerImage: values.bannerImage,
        description: values.description.trim(),
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface space-y-6 p-5 sm:p-8" noValidate>
      <div>
        <label className="field-label" htmlFor="title">Title</label>
        <input id="title" className="input" placeholder="e.g. SSC Mathematics Mastery Batch" value={values.title} onChange={(e) => set("title", e.target.value)} />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="subject">Subject</label>
          <input id="subject" list="subject-list" className="input" placeholder="e.g. Physics" value={values.subject} onChange={(e) => set("subject", e.target.value)} />
          <datalist id="subject-list">
            {SUBJECT_SUGGESTIONS.map((item) => <option key={item} value={item} />)}
          </datalist>
          {errors.subject && <p className="field-error">{errors.subject}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="classLevel">Class level</label>
          <select id="classLevel" className="select" value={values.classLevel} onChange={(e) => set("classLevel", e.target.value)}>
            <option value="">Choose class level</option>
            {CLASS_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
          {errors.classLevel && <p className="field-error">{errors.classLevel}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <span className="field-label">Mode</span>
          <div className="grid grid-cols-2 gap-2">
            {(["Online", "Offline"] as Mode[]).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => set("mode", mode)}
                className={`btn ${values.mode === mode ? "btn-primary" : "btn-outline"}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="location">
            Location {values.mode === "Online" && <span className="font-medium text-base-content/50">(optional)</span>}
          </label>
          <input
            id="location"
            className="input"
            placeholder={values.mode === "Online" ? "e.g. Google Meet / Zoom" : "e.g. Dhanmondi, Dhaka"}
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
          />
          {errors.location && <p className="field-error">{errors.location}</p>}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="fee">Monthly fee (৳)</label>
          <input id="fee" type="number" min={100} className="input" placeholder="e.g. 4500" value={values.monthlyFee} onChange={(e) => set("monthlyFee", e.target.value)} />
          {errors.monthlyFee && <p className="field-error">{errors.monthlyFee}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="days">Days per week</label>
          <select id="days" className="select" value={values.daysPerWeek} onChange={(e) => set("daysPerWeek", e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => <option key={day} value={day}>{day} {day === 1 ? "day" : "days"}</option>)}
          </select>
          {errors.daysPerWeek && <p className="field-error">{errors.daysPerWeek}</p>}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="description">Description</label>
        <textarea id="description" rows={5} className="textarea" placeholder="What will students learn? Describe the syllabus, class style and schedule." value={values.description} onChange={(e) => set("description", e.target.value)} />
        <div className="mt-1 flex justify-between text-xs">
          <span className="field-error mt-0">{errors.description}</span>
          <span className="text-base-content/50">{values.description.length}/2000</span>
        </div>
      </div>

      <div>
        <span className="field-label">Banner image</span>
        <ImageUploader value={values.bannerImage} onChange={(url) => set("bannerImage", url)} error={errors.bannerImage} />
        {errors.bannerImage && <p className="field-error">{errors.bannerImage}</p>}
      </div>

      <button type="submit" className="btn btn-primary w-full sm:w-auto sm:min-w-52" disabled={busy}>
        {busy && <Loader2 size={17} className="animate-spin" />}
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

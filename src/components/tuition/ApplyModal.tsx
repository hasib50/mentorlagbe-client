"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Loader2, X } from "lucide-react";
import { api } from "@/lib/api";
import { errMsg } from "@/lib/utils";
import type { Tuition } from "@/types";

type Props = {
  open: boolean;
  tuition: Tuition;
  onClose: () => void;
  onApplied: () => void;
};

export default function ApplyModal({ open, tuition, onClose, onApplied }: Props) {
  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const found: Record<string, string> = {};
    if (!/^[+\d][\d\s-]{6,17}$/.test(phone.trim())) found.phone = "Please enter a valid phone number.";
    if (schedule.trim().length < 3) found.schedule = "Tell the tutor your preferred schedule.";
    if (note.trim().length < 5) found.note = "Please write a short learning note (5+ characters).";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setBusy(true);
    try {
      await api.post("/applications", {
        tuitionId: tuition._id,
        studentPhone: phone.trim(),
        preferredSchedule: schedule.trim(),
        studentNote: note.trim(),
      });
      toast.success("Application sent! The tutor will review it soon.");
      onApplied();
      onClose();
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-neutral/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => !busy && onClose()}
        >
          <motion.form
            onSubmit={submit}
            noValidate
            role="dialog"
            aria-modal="true"
            aria-label="Apply for tuition"
            className="surface w-full max-w-lg p-6 shadow-2xl"
            initial={{ y: 24, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-eyebrow">Apply now</p>
                <h3 className="mt-2 text-xl font-extrabold leading-snug">{tuition.title}</h3>
                <p className="mt-1 text-sm text-base-content/60">with {tuition.tutorName}</p>
              </div>
              <button type="button" onClick={onClose} disabled={busy} className="btn btn-ghost btn-circle btn-sm" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="field-label" htmlFor="phone">Phone number</label>
                <input id="phone" className="input" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>
              <div>
                <label className="field-label" htmlFor="schedule">Preferred schedule</label>
                <input id="schedule" className="input" placeholder="e.g. Sat, Mon, Wed after 6 PM" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
                {errors.schedule && <p className="field-error">{errors.schedule}</p>}
              </div>
              <div>
                <label className="field-label" htmlFor="note">Learning note</label>
                <textarea id="note" rows={4} className="textarea" placeholder="What do you want to improve? Anything the tutor should know?" value={note} onChange={(e) => setNote(e.target.value)} />
                {errors.note && <p className="field-error">{errors.note}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy && <Loader2 size={16} className="animate-spin" />}
                Submit Application
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && !loading && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-neutral/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => !loading && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="surface w-full max-w-md p-6 shadow-2xl"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.97, opacity: 0 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-error/15 text-error">
              <AlertTriangle size={24} />
            </span>
            <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-base-content/70">{message}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={onConfirm} disabled={loading}>
                {loading && <span className="loading loading-spinner loading-sm" />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

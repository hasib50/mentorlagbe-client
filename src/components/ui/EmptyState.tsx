import type { ReactNode } from "react";

type Props = { icon: ReactNode; title: string; text?: string; action?: ReactNode };

export default function EmptyState({ icon, title, text, action }: Props) {
  return (
    <div className="surface grid place-items-center border-dashed px-6 py-16 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">{icon}</span>
      <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
      {text && <p className="mt-2 max-w-md text-sm leading-6 text-base-content/65">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

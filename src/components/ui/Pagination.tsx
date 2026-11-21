import { ChevronLeft, ChevronRight } from "lucide-react";

function pageList(page: number, pages: number): (number | "…")[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);

  const list: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);

  if (start > 2) list.push("…");
  for (let p = start; p <= end; p++) list.push(p);
  if (end < pages - 1) list.push("…");
  list.push(pages);
  return list;
}

type Props = { page: number; pages: number; onChange: (page: number) => void };

export default function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        className="btn btn-sm btn-outline"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={16} /> Previous
      </button>

      {pageList(page, pages).map((item, index) =>
        item === "…" ? (
          <span key={`gap-${index}`} className="px-1 text-base-content/50">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`btn btn-sm btn-square ${item === page ? "btn-primary" : "btn-ghost"}`}
          >
            {item}
          </button>
        )
      )}

      <button
        className="btn btn-sm btn-outline"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next <ChevronRight size={16} />
      </button>
    </nav>
  );
}

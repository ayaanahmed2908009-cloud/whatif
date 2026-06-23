import { CascadeNode } from "@/lib/types";

export interface BreadcrumbEntry {
  label: string;
  node: CascadeNode | null; // null represents the root premise
}

export default function Breadcrumb({
  entries,
  onJump,
}: {
  entries: BreadcrumbEntry[];
  onJump: (index: number) => void;
}) {
  return (
    <nav className="flex w-full max-w-container flex-wrap items-center gap-2 px-6 text-[14px] text-on-surface-variant">
      {entries.map((entry, i) => (
        <span key={i} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onJump(i)}
            disabled={i === entries.length - 1}
            className={
              i === entries.length - 1
                ? "font-semibold text-on-surface"
                : "transition-colors hover:text-secondary"
            }
          >
            {entry.label}
          </button>
          {i < entries.length - 1 && <span className="text-outline-variant">/</span>}
        </span>
      ))}
    </nav>
  );
}

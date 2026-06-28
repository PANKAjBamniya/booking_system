import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function TopBar({
  title,
  back = true,
  right,
  to,
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md px-5 pt-12 pb-4 flex items-center gap-3">
      {back ? (
        to ? (
          <Link
            to={to}
            className="h-10 w-10 grid place-items-center rounded-full bg-surface border border-border shadow-[var(--shadow-card)]"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Link>
        ) : (
          <button
            onClick={() => window.history.back()}
            className="h-10 w-10 grid place-items-center rounded-full bg-surface border border-border shadow-[var(--shadow-card)]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
        )
      ) : (
        <div className="w-10" />
      )}
      <h1 className="flex-1 text-center text-base font-semibold text-foreground truncate">
        {title}
      </h1>
      <div className="w-10 flex justify-end">{right}</div>
    </header>
  );
}

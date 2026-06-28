import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { TopBar } from "@/components/mobile/TopBar";
import { PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/booking/date")({
  component: SelectDate,
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function SelectDate() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState<number | null>(today.getDate() + 2);

  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const isToday = (d: number) =>
    view.y === today.getFullYear() &&
    view.m === today.getMonth() &&
    d === today.getDate();
  const disabled = (d: number) => {
    const date = new Date(view.y, view.m, d);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < t || date.getDay() === 0;
  };

  return (
    <MobileFrame>
      <TopBar title="Select Date" />
      <div className="px-5 pb-32 space-y-6">
        <div className="rounded-3xl bg-surface border border-border p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }))
              }
              className="h-9 w-9 grid place-items-center rounded-full bg-secondary"
            >
              <ChevronLeft className="h-4 w-4 text-accent" />
            </button>
            <span className="text-sm font-semibold">
              {MONTHS[view.m]} {view.y}
            </span>
            <button
              onClick={() =>
                setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }))
              }
              className="h-9 w-9 grid place-items-center rounded-full bg-secondary"
            >
              <ChevronRight className="h-4 w-4 text-accent" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d, i) => (
              <span
                key={i}
                className="h-8 grid place-items-center text-[11px] font-medium text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <span key={i} className="h-10" />;
              const isDisabled = disabled(d);
              const isSelected = selected === d;
              return (
                <button
                  key={i}
                  disabled={isDisabled}
                  onClick={() => setSelected(d)}
                  className={`h-10 rounded-full text-sm font-medium grid place-items-center transition-colors ${isSelected
                      ? "bg-accent text-accent-foreground"
                      : isDisabled
                        ? "text-muted-foreground/40 line-through"
                        : isToday(d)
                          ? "bg-secondary text-accent"
                          : "text-foreground hover:bg-secondary"
                    }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground px-2">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-accent" /> Selected
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-secondary" /> Available
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-border" /> Disabled
          </span>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border">
        <Link to="/booking/time">
          <PrimaryButton>Continue</PrimaryButton>
        </Link>
      </div>
    </MobileFrame>
  );
}

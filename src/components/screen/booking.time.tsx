import { Link } from "react-router-dom";
import { useState } from "react";
import { Sun, Sunset, Moon } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { TopBar } from "@/components/mobile/TopBar";
import { PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/booking/time")({
  component: SelectTime,
});

const slots = {
  Morning: { icon: Sun, times: ["08:00", "09:00", "10:00", "10:30", "11:00"] },
  Afternoon: { icon: Sunset, times: ["12:00", "13:00", "14:00", "15:30"] },
  Evening: { icon: Moon, times: ["17:00", "18:30", "19:00", "20:00"] },
};

function SelectTime() {
  const [selected, setSelected] = useState<string>("10:30");

  return (
    <MobileFrame>
      <TopBar title="Select Time" />
      <div className="px-5 pb-32 space-y-6">
        <div className="rounded-2xl bg-secondary p-4 text-center">
          <p className="text-xs text-muted-foreground">Selected date</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">
            Saturday, 28 June 2026
          </p>
        </div>

        {Object.entries(slots).map(([label, { icon: Icon, times }]) => (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold">{label}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {times.map((t) => {
                const active = selected === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelected(t)}
                    className={`h-12 rounded-2xl text-sm font-medium border transition-colors ${active
                        ? "bg-accent text-accent-foreground border-accent shadow-[var(--shadow-soft)]"
                        : "bg-surface text-foreground border-border"
                      }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border">
        <Link to="/booking/details">
          <PrimaryButton>Continue</PrimaryButton>
        </Link>
      </div>
    </MobileFrame>
  );
}

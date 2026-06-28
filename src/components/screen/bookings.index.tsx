import { Link } from "react-router-dom";
import { useState } from "react";
import { Clock, MapPin, ChevronRight } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { BottomNav } from "@/components/mobile/BottomNav";
import { TopBar } from "@/components/mobile/TopBar";
import { StatusBadge } from "@/components/mobile/ui";

export const Route = createFileRoute("/bookings/")({
  component: Bookings,
});

type Status = "Upcoming" | "Pending" | "Completed" | "Cancelled";

const all: { id: string; service: string; date: string; time: string; status: Status; hue: string }[] = [
  { id: "BK-2049", service: "Bridal Glam", date: "Sat, 28 Jun", time: "10:30 AM", status: "Upcoming", hue: "from-[#F8D7DA] to-[#E8B4BC]" },
  { id: "BK-2050", service: "Glow Facial", date: "Mon, 30 Jun", time: "14:00", status: "Pending", hue: "from-[#F4E1DC] to-[#E2B4A8]" },
  { id: "BK-2031", service: "Evening Glam", date: "10 Jun", time: "18:30", status: "Completed", hue: "from-[#FCEEEF] to-[#E8B4BC]" },
  { id: "BK-2022", service: "Hair Styling", date: "02 Jun", time: "11:00", status: "Cancelled", hue: "from-[#F1DADA] to-[#C97C8A]" },
  { id: "BK-2015", service: "Natural Glow", date: "28 May", time: "09:00", status: "Completed", hue: "from-[#FFF1E6] to-[#F8C8C0]" },
];

const tabs: Status[] = ["Upcoming", "Pending", "Completed", "Cancelled"];

function Bookings() {
  const [tab, setTab] = useState<Status>("Upcoming");
  const list = all.filter((b) => b.status === tab);

  return (
    <MobileFrame>
      <TopBar title="My Bookings" back={false} />
      <div className="px-5 pb-32">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1 mb-4">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 h-9 rounded-full text-xs font-medium border transition-colors ${tab === t
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-surface text-muted-foreground border-border"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-20 text-center px-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-secondary grid place-items-center mb-4">
              <span className="text-3xl">🌸</span>
            </div>
            <h3 className="text-base font-semibold">No {tab.toLowerCase()} bookings</h3>
            <p className="text-sm text-muted-foreground mt-1">
              When you book a session it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((b) => (
              <Link
                key={b.id}
                to="/bookings/$id"
                params={{ id: b.id }}
                className="block rounded-3xl bg-surface border border-border p-4 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${b.hue} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold truncate">{b.service}</h3>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {b.date} · {b.time}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> Home service
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">#{b.id}</span>
                  <span className="text-xs font-medium text-accent flex items-center gap-1">
                    View details <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

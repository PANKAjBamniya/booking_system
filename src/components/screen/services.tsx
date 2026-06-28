import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, Clock, Star } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { BottomNav } from "@/components/mobile/BottomNav";
import { TopBar } from "@/components/mobile/TopBar";
import { InputField } from "@/components/mobile/ui";
import { services, categories } from "@/lib/services-data";

export const Route = createFileRoute("/services")({
  component: Services,
});

function Services() {
  const [active, setActive] = useState<string>("All");
  const filtered =
    active === "All" ? services : services.filter((s) => s.category === active);

  return (
    <MobileFrame>
      <TopBar title="Services" back={false} />
      <div className="px-5 pb-32 space-y-5">
        <InputField icon={<Search className="h-4 w-4" />} placeholder="Search services" />

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          {["All", ...categories.map((c) => c.name)].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`shrink-0 px-4 h-9 rounded-full text-xs font-medium border transition-colors ${active === c
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-surface text-muted-foreground border-border"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-3xl bg-surface border border-border overflow-hidden shadow-[var(--shadow-card)]"
            >
              <div className={`h-36 bg-gradient-to-br ${s.hue} relative`}>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/85 text-[10px] font-medium text-accent">
                  {s.category}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/85 text-[10px] font-medium flex items-center gap-1">
                  <Star className="h-3 w-3 fill-accent text-accent" /> {s.rating}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold truncate">{s.name}</h3>
                  <span className="text-base font-semibold text-accent shrink-0">
                    ${s.price}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.short}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {s.duration}
                  </span>
                  <Link
                    to="/services/$id"
                    params={{ id: s.id }}
                    className="px-4 h-9 rounded-full bg-accent text-accent-foreground text-xs font-medium grid place-items-center"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

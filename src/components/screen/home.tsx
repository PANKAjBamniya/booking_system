import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  Clock,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { BottomNav } from "@/components/mobile/BottomNav";
import { InputField, SectionTitle } from "@/components/mobile/ui";
import { services, categories } from "@/lib/services-data";

export const Route = createFileRoute("/home")({
  component: Home,
});

function Home() {
  const popular = services.slice(0, 4);
  const available = services.slice(2, 5);

  return (
    <MobileFrame>
      <div className="pb-32">
        {/* Greeting */}
        <header className="px-5 pt-14 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center text-accent-foreground font-semibold shrink-0">
              S
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Good morning</p>
              <h1 className="text-base font-semibold text-foreground truncate">
                Sophia Laurent ✨
              </h1>
            </div>
          </div>
          <Link
            to="/notifications"
            className="relative h-11 w-11 grid place-items-center rounded-2xl bg-surface border border-border"
          >
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent" />
          </Link>
        </header>

        {/* Search */}
        <div className="px-5 mb-5">
          <InputField icon={<Search className="h-4 w-4" />} placeholder="Search services, artists..." />
        </div>

        {/* Featured Banner */}
        <div className="px-5 mb-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-primary p-6 text-accent-foreground shadow-[var(--shadow-soft)]">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15" />
            <div className="absolute right-6 bottom-4 opacity-30">
              <Sparkles className="h-20 w-20" strokeWidth={1} />
            </div>
            <p className="text-[11px] tracking-[0.3em] uppercase opacity-90">Spring offer</p>
            <h2 className="mt-2 text-xl font-semibold leading-snug max-w-[200px]">
              20% off your first bridal session
            </h2>
            <button className="mt-4 inline-flex items-center gap-1 text-xs font-medium bg-white/95 text-accent px-4 py-2 rounded-full">
              Claim now <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Upcoming Appointment */}
        <div className="px-5 mb-6">
          <div className="rounded-3xl bg-surface border border-border p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-accent uppercase tracking-wider">
                Upcoming
              </span>
              <Link to="/bookings" className="text-xs text-muted-foreground">
                View all
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">Bridal Glam Session</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> Tomorrow · 10:30 AM
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" /> At your address
                </p>
              </div>
              <Link
                to="/bookings/$id"
                params={{ id: "BK-2049" }}
                className="h-9 w-9 grid place-items-center rounded-full bg-secondary"
              >
                <ChevronRight className="h-4 w-4 text-accent" />
              </Link>
            </div>
          </div>
        </div>

        {/* Categories */}
        <SectionTitle title="Categories" action={<Link to="/services">See all</Link>} />
        <div className="px-5 mb-6 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
          {categories.map((c) => (
            <button
              key={c.name}
              className="shrink-0 flex flex-col items-center gap-2 w-20"
            >
              <span className="h-16 w-16 grid place-items-center rounded-2xl bg-surface border border-border text-2xl shadow-[var(--shadow-card)]">
                {c.emoji}
              </span>
              <span className="text-[11px] font-medium text-foreground">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Popular */}
        <SectionTitle title="Popular services" action={<Link to="/services">See all</Link>} />
        <div className="px-5 mb-6 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
          {popular.map((s) => (
            <Link
              key={s.id}
              to="/services/$id"
              params={{ id: s.id }}
              className="shrink-0 w-44 rounded-3xl bg-surface border border-border overflow-hidden shadow-[var(--shadow-card)]"
            >
              <div className={`h-28 bg-gradient-to-br ${s.hue} grid place-items-center`}>
                <Sparkles className="h-8 w-8 text-white/80" strokeWidth={1.2} />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold truncate">{s.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 fill-accent text-accent" /> {s.rating} · {s.duration}
                </p>
                <p className="text-sm font-semibold text-accent">${s.price}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Available Today */}
        <SectionTitle title="Available today" />
        <div className="px-5 space-y-3">
          {available.map((s) => (
            <Link
              key={s.id}
              to="/services/$id"
              params={{ id: s.id }}
              className="flex items-center gap-3 rounded-3xl bg-surface border border-border p-3 shadow-[var(--shadow-card)]"
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${s.hue} shrink-0`} />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{s.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{s.short}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {s.duration}
                </p>
              </div>
              <span className="text-sm font-semibold text-accent">${s.price}</span>
            </Link>
          ))}
        </div>
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

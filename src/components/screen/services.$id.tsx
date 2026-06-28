import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Star, Check, Heart } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { TopBar } from "@/components/mobile/TopBar";
import { PrimaryButton } from "@/components/mobile/ui";
import { services } from "@/lib/services-data";

export const Route = createFileRoute("/services/$id")({
  component: ServiceDetails,
  notFoundComponent: () => (
    <MobileFrame>
      <TopBar title="Not found" />
      <div className="p-10 text-center text-muted-foreground">Service not found.</div>
    </MobileFrame>
  ),
  loader: ({ params }) => {
    const s = services.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return s;
  },
});

function ServiceDetails() {
  const s = Route.useLoaderData();

  return (
    <MobileFrame>
      <div className="pb-32">
        <div className={`relative h-72 bg-gradient-to-br ${s.hue}`}>
          <div className="absolute inset-0">
            <TopBar
              title=""
              right={
                <button className="h-10 w-10 grid place-items-center rounded-full bg-white/85">
                  <Heart className="h-4 w-4 text-accent" />
                </button>
              }
            />
          </div>
          <div className="absolute bottom-6 left-6">
            <span className="px-3 py-1 rounded-full bg-white/85 text-[10px] font-medium text-accent">
              {s.category}
            </span>
          </div>
        </div>

        <div className="-mt-6 relative bg-background rounded-t-[28px] px-6 pt-6 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{s.name}</h1>
              <span className="text-2xl font-semibold text-accent">${s.price}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {s.rating} ({s.reviews})
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {s.duration}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-3">What's included</h2>
            <ul className="space-y-2">
              {s.includes.map((i: string) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="h-6 w-6 rounded-full bg-secondary grid place-items-center">
                    <Check className="h-3.5 w-3.5 text-accent" />
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Reviews</h2>
              <span className="text-xs text-accent font-medium">See all</span>
            </div>
            <div className="space-y-3">
              {[
                { n: "Amelia R.", t: "Absolutely flawless. Lasted the entire wedding day." },
                { n: "Zara K.", t: "Soft, romantic, and exactly what I asked for. Will rebook!" },
              ].map((r) => (
                <div
                  key={r.n}
                  className="rounded-2xl bg-surface border border-border p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{r.n}</span>
                    <span className="flex items-center gap-0.5 text-accent text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border">
        <Link to="/booking/date">
          <PrimaryButton>Book Appointment</PrimaryButton>
        </Link>
      </div>
    </MobileFrame>
  );
}

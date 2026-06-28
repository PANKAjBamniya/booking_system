import { createFileRoute } from "@tanstack/react-router";
import { Check, Calendar, MapPin, CreditCard, Sparkles } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { TopBar } from "@/components/mobile/TopBar";
import { PrimaryButton, SecondaryButton, StatusBadge } from "@/components/mobile/ui";

export const Route = createFileRoute("/bookings/$id")({
  component: BookingDetails,
});

const timeline = [
  { label: "Booking confirmed", time: "Today, 09:14", done: true },
  { label: "Artist assigned", time: "Today, 09:20", done: true },
  { label: "Artist on the way", time: "Sat, 09:50", done: false },
  { label: "Session completed", time: "Sat, 12:30", done: false },
];

function BookingDetails() {
  const { id } = Route.useParams();
  return (
    <MobileFrame>
      <TopBar title="Booking Details" />
      <div className="px-5 pb-32 space-y-5">
        <div className="rounded-3xl bg-surface border border-border p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-muted-foreground">#{id}</span>
            <StatusBadge status="Upcoming" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Sparkles className="h-6 w-6 text-white/90" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Bridal Glam</h2>
              <p className="text-xs text-muted-foreground">120 min · with Léa M.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-surface border border-border p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold mb-4">Timeline</h3>
          <ol className="space-y-4">
            {timeline.map((t, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`h-6 w-6 rounded-full grid place-items-center ${
                      t.done ? "bg-accent text-white" : "bg-secondary text-muted-foreground border border-border"
                    }`}
                  >
                    {t.done ? <Check className="h-3 w-3" /> : <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />}
                  </span>
                  {i < timeline.length - 1 && (
                    <span className={`w-px flex-1 mt-1 ${t.done ? "bg-accent/40" : "bg-border"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className={`text-sm ${t.done ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {t.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{t.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-3xl bg-surface border border-border p-5 shadow-[var(--shadow-card)] space-y-4">
          <Row icon={<Calendar className="h-4 w-4" />} label="Date & time" value="Sat, 28 Jun · 10:30 AM" />
          <Row icon={<MapPin className="h-4 w-4" />} label="Address" value="221 Rose Ave, Apt 4B" />
          <Row icon={<CreditCard className="h-4 w-4" />} label="Payment" value="Visa •••• 4821 · $210.00" />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border space-y-3">
        <PrimaryButton>Contact Artist</PrimaryButton>
        <SecondaryButton className="text-destructive">Cancel Booking</SecondaryButton>
      </div>
    </MobileFrame>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-9 w-9 grid place-items-center rounded-xl bg-secondary text-accent shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

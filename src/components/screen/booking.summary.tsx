import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { TopBar } from "@/components/mobile/TopBar";
import { PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/booking/summary")({
  component: Summary,
});

function Summary() {
  return (
    <MobileFrame>
      <TopBar title="Booking Summary" />
      <div className="px-5 pb-32 space-y-5">
        <div className="rounded-3xl bg-surface border border-border p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">Bridal Glam</h3>
            <p className="text-xs text-muted-foreground">Premium · 120 min</p>
          </div>
          <span className="text-base font-semibold text-accent">$220</span>
        </div>

        <div className="rounded-3xl bg-surface border border-border p-5 shadow-[var(--shadow-card)] space-y-4">
          <Row icon={<Calendar className="h-4 w-4" />} label="Date" value="Sat, 28 Jun 2026" />
          <Row icon={<Clock className="h-4 w-4" />} label="Time" value="10:30 AM" />
          <Row
            icon={<MapPin className="h-4 w-4" />}
            label="Address"
            value="221 Rose Ave, Apt 4B"
          />
          <Row
            icon={<CreditCard className="h-4 w-4" />}
            label="Payment"
            value="Visa •••• 4821"
            arrow
          />
        </div>

        <div className="rounded-3xl bg-secondary p-5 space-y-2">
          <Line label="Service" value="$220.00" />
          <Line label="Travel fee" value="$10.00" />
          <Line label="Discount" value="-$20.00" accent />
          <div className="border-t border-border my-2" />
          <Line label="Total" value="$210.00" bold />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border">
        <Link to="/booking/success">
          <PrimaryButton>Confirm Booking</PrimaryButton>
        </Link>
      </div>
    </MobileFrame>
  );
}

function Row({
  icon, label, value, arrow,
}: { icon: React.ReactNode; label: string; value: string; arrow?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-9 w-9 grid place-items-center rounded-xl bg-secondary text-accent shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
      {arrow ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : null}
    </div>
  );
}

function Line({
  label, value, bold, accent,
}: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span
        className={`${bold ? "text-base font-semibold text-foreground" : ""} ${accent ? "text-accent font-medium" : ""
          }`}
      >
        {value}
      </span>
    </div>
  );
}

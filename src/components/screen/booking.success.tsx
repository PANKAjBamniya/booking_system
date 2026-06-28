import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { PrimaryButton, SecondaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/booking/success")({
  component: Success,
});

function Success() {
  return (
    <MobileFrame>
      <div className="min-h-screen flex flex-col items-center justify-between px-8 pt-24 pb-10 text-center bg-gradient-to-b from-secondary via-background to-background">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/40 blur-2xl" />
            <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center shadow-[var(--shadow-soft)]">
              <Check className="h-14 w-14 text-white" strokeWidth={2.4} />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent" />
            <Sparkles className="absolute -bottom-1 -left-3 h-5 w-5 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Booking confirmed!</h1>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              Your artist will arrive on time and beautifully prepared.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl px-5 py-3 shadow-[var(--shadow-card)]">
            <p className="text-[11px] text-muted-foreground">Booking ID</p>
            <p className="text-sm font-semibold tracking-wider">#BK-2049-LM</p>
          </div>
        </div>

        <div className="w-full space-y-3">
          <Link to="/bookings">
            <PrimaryButton>Go to My Bookings</PrimaryButton>
          </Link>
          <Link to="/home">
            <SecondaryButton>Back to Home</SecondaryButton>
          </Link>
        </div>
      </div>
    </MobileFrame>
  );
}

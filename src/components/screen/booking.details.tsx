import { Link } from "react-router-dom";
import { User, MapPin, FileText } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { TopBar } from "@/components/mobile/TopBar";
import { InputField, PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/booking/details")({
  component: Details,
});

function Details() {
  return (
    <MobileFrame>
      <TopBar title="Your Details" />
      <div className="px-5 pb-32 space-y-5">
        <p className="text-sm text-muted-foreground">
          A few last details so your artist arrives prepared.
        </p>

        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground px-1">Full name</label>
          <InputField icon={<User className="h-4 w-4" />} defaultValue="Sophia Laurent" />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground px-1">Address</label>
          <InputField
            icon={<MapPin className="h-4 w-4" />}
            defaultValue="221 Rose Avenue, Apt 4B, NYC"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-medium text-muted-foreground px-1">
            Notes (optional)
          </label>
          <div className="flex gap-3 p-4 rounded-2xl bg-input border border-border min-h-32">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <textarea
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground resize-none"
              placeholder="Any allergies, inspiration photos, or preferences..."
              rows={5}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border">
        <Link to="/booking/summary">
          <PrimaryButton>Continue</PrimaryButton>
        </Link>
      </div>
    </MobileFrame>
  );
}

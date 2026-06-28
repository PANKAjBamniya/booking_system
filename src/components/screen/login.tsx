import { Link } from "react-router-dom";
import { Phone, ChevronDown } from "lucide-react";
import { MobileFrame } from "../mobile/MobileFrame";
import { InputField, PrimaryButton } from "../mobile/ui";

export function Login() {
  return (
    <MobileFrame>
      <TopBar back={false} title="" />
      <div className="px-6 pt-2 pb-10 flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your phone number to continue booking your beauty rituals.
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-medium text-muted-foreground px-1">
            Phone Number
          </label>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 h-14 px-4 rounded-2xl bg-input border border-border">
              <span className="text-xl">🇮🇳</span>
              <span className="text-sm font-medium">+91</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex-1">
              <InputField
                icon={<Phone className="h-4 w-4" />}
                placeholder="555 123 4567"
                inputMode="tel"
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground px-1">
            We'll send a 4-digit verification code to confirm it's you.
          </p>
        </div>

        <Link to="/otp">
          <PrimaryButton>Send OTP</PrimaryButton>
        </Link>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our{" "}
          <span className="text-accent font-medium">Terms</span> &{" "}
          <span className="text-accent font-medium">Privacy</span>.
        </p>
      </div>
    </MobileFrame>
  );
}

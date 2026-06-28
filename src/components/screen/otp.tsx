import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { TopBar } from "@/components/mobile/TopBar";
import { PrimaryButton } from "@/components/mobile/ui";

export const Route = createFileRoute("/otp")({
  component: Otp,
});

function Otp() {
  const [code, setCode] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(45);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 3) inputs.current[i + 1]?.focus();
  };

  return (
    <MobileFrame>
      <TopBar title="Verification" to="/login" />
      <div className="px-6 pt-2 pb-10 flex flex-col gap-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">
            Verify OTP
          </h1>

          <p className="text-muted-foreground text-sm leading-6">
            Enter the 4-digit verification code sent to
          </p>

          <p className="font-semibold text-lg">
            +1 555 123 4567
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-2">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              value={d}
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              onFocus={(e) => e.target.select()}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) {
                  inputs.current[i - 1]?.focus();
                }
              }}
              className={`
        w-16
        h-16
        rounded-2xl
        border-2
        text-center
        text-2xl
        font-bold
        bg-card
        shadow-sm
        transition-all
        duration-200
        outline-none
        ${d
                  ? "border-primary text-foreground"
                  : "border-border text-foreground"
                }
        focus:border-primary
        focus:ring-4
        focus:ring-primary/20
      `}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 text-sm mt-2">
          <span className="text-muted-foreground">
            Didn't receive the code?
          </span>

          <button
            disabled={seconds > 0}
            onClick={() => setSeconds(45)}
            className="font-semibold text-primary disabled:text-muted-foreground"
          >
            {seconds > 0
              ? `Resend in 00:${seconds.toString().padStart(2, "0")}`
              : "Resend OTP"}
          </button>
        </div>

        <Link to="/home" className="mt-4">
          <PrimaryButton className="h-14 rounded-2xl text-base font-semibold">
            Verify OTP
          </PrimaryButton>
        </Link>
      </div>
    </MobileFrame>
  );
}

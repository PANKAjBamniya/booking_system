import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { MobileFrame } from "../components/mobile/MobileFrame";
import { PrimaryButton } from "../components/mobile/ui";

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <MobileFrame>
      <div className="min-h-screen flex flex-col items-center justify-between px-8 pt-20 pb-10 bg-gradient-to-b from-secondary via-background to-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-3xl bg-accent grid place-items-center shadow-[var(--shadow-soft)]">
            <Sparkles className="h-8 w-8 text-accent-foreground" />
          </div>
          <p className="text-xs tracking-[0.4em] text-accent font-medium">LUMIÈRE</p>
        </div>

        <div className="relative w-full aspect-square max-w-[280px]">
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-2xl" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-soft)]" />
          <div className="absolute inset-14 rounded-full bg-surface grid place-items-center">
            <Sparkles className="h-14 w-14 text-accent" strokeWidth={1.2} />
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground leading-tight">
              Beauty, beautifully<br />booked.
            </h1>
            <p className="text-sm text-muted-foreground">
              Premium makeup artists, on your schedule.
            </p>
          </div>
          <Link to="/login" className="w-full">
            <PrimaryButton>Get Started</PrimaryButton>
          </Link>
        </div>
      </div>
    </MobileFrame>
  );
}

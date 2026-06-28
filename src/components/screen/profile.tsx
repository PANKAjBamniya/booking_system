import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  MapPin,
  Heart,
  CreditCard,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { MobileFrame } from "../mobile/MobileFrame";
import { TopBar } from "../mobile/TopBar";
import { BottomNav } from "../mobile/BottomNav";


const items = [
  { icon: Heart, label: "Favorites", value: "12 saved" },
  { icon: CreditCard, label: "Payment methods", value: "Visa •••• 4821" },
  { icon: MapPin, label: "Addresses", value: "2 saved" },
  { icon: Settings, label: "Preferences", value: "" },
  { icon: Shield, label: "Privacy & security", value: "" },
  { icon: HelpCircle, label: "Help & support", value: "" },
];

const Profile = () => {

  useEffect(() => {
    console.log("hello")
  }, [])
  return (
    <MobileFrame>
      <TopBar title="Profile" back={false} />

      <div className="px-5 pb-32 space-y-6">
        {/* Profile Card */}
        <div className="rounded-3xl bg-gradient-to-br from-secondary to-primary/60 p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-semibold text-accent-foreground">
                S
              </div>

              <button className="absolute -bottom-1 -right-1 h-8 w-8 grid place-items-center rounded-full bg-surface border border-border shadow-[var(--shadow-card)]">
                <Pencil className="h-3.5 w-3.5 text-accent" />
              </button>
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold truncate">
                Sophia Laurent
              </h2>

              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Phone className="h-3 w-3" />
                +1 555 123 4567
              </p>

              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                221 Rose Avenue, NYC
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { l: "Bookings", v: "14" },
              { l: "Favorites", v: "12" },
              { l: "Reviews", v: "8" },
            ].map((item) => (
              <div
                key={item.l}
                className="bg-surface/80 rounded-2xl py-2.5 text-center"
              >
                <p className="text-base font-semibold">{item.v}</p>
                <p className="text-[10px] text-muted-foreground">
                  {item.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="rounded-3xl bg-surface border border-border shadow-[var(--shadow-card)] overflow-hidden">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left ${index !== items.length - 1
                  ? "border-b border-border"
                  : ""
                  }`}
              >
                <span className="h-10 w-10 grid place-items-center rounded-2xl bg-secondary text-accent shrink-0">
                  <Icon className="h-4 w-4" />
                </span>

                <span className="flex-1 text-sm font-medium">
                  {item.label}
                </span>

                {item.value && (
                  <span className="text-xs text-muted-foreground">
                    {item.value}
                  </span>
                )}

                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-surface border border-border text-destructive font-medium text-sm"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Link>

        <p className="text-center text-[11px] text-muted-foreground">
          Lumière · v1.0.0
        </p>
      </div>

      <BottomNav />
    </MobileFrame>
  );
};

export default Profile;
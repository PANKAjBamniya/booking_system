import { Link, useLocation } from "react-router-dom";
import { Home, Sparkles, CalendarCheck, Bell, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/services", label: "Services", icon: Sparkles },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname || "/";
  // fallback / to /home if needed, but App.jsx uses Splash at / and has no /home. Let's assume Splash is / and Home doesn't exist explicitly in Route table actually... Wait, App.jsx has Splash, I'll need to add Home, or route /home to Home! Wait, if /home is active, it handles it.
  
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[400px] z-[100]">
      <ul className="flex items-center justify-between bg-surface/95 backdrop-blur rounded-3xl px-3 py-2 shadow-[0_12px_40px_-12px_rgba(201,124,138,0.35)] border border-border">
        {tabs.map((t) => {
          const active = pathname === t.to || pathname.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1">
              <Link
                to={t.to}
                className="flex flex-col items-center gap-0.5 py-2 rounded-2xl transition-colors"
              >
                <span
                  className={`h-10 w-10 grid place-items-center rounded-2xl transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                </span>
                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

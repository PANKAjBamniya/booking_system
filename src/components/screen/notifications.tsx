import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Sparkles, Gift, Bell as BellIcon } from "lucide-react";
import { MobileFrame } from "@/components/mobile/MobileFrame";
import { BottomNav } from "@/components/mobile/BottomNav";
import { TopBar } from "@/components/mobile/TopBar";

export const Route = createFileRoute("/notifications")({
  component: Notifications,
});

const groups = [
  {
    label: "Today",
    items: [
      { icon: Calendar, title: "Booking confirmed", text: "Bridal Glam on Sat 28 Jun at 10:30 AM.", time: "9:14 AM", unread: true, tint: "bg-secondary text-accent" },
      { icon: Gift, title: "20% off your next booking", text: "Use code BLOOM20 at checkout.", time: "8:02 AM", unread: true, tint: "bg-[#FFF3D6] text-[#9A6B00]" },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { icon: Sparkles, title: "Léa added new looks", text: "Check out 3 new evening glam looks.", time: "Yesterday", unread: false, tint: "bg-[#E3F5E6] text-[#2F7A3A]" },
      { icon: BellIcon, title: "Reminder", text: "Don't forget to leave a review for Glow Facial.", time: "Yesterday", unread: false, tint: "bg-secondary text-accent" },
    ],
  },
  {
    label: "This week",
    items: [
      { icon: Calendar, title: "Booking completed", text: "Hope you loved your Natural Glow look ✨", time: "Mon", unread: false, tint: "bg-[#E3F5E6] text-[#2F7A3A]" },
    ],
  },
];

function Notifications() {
  return (
    <MobileFrame>
      <TopBar
        title="Notifications"
        back={false}
        right={<span className="text-xs font-medium text-accent">Mark all</span>}
      />
      <div className="px-5 pb-32 space-y-6">
        {groups.map((g) => (
          <div key={g.label}>
            <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3 px-1">
              {g.label}
            </h3>
            <div className="space-y-3">
              {g.items.map((n, i) => {
                const Icon = n.icon;
                return (
                  <div
                    key={i}
                    className={`rounded-3xl bg-surface border border-border p-4 shadow-[var(--shadow-card)] flex gap-3 ${
                      n.unread ? "ring-1 ring-primary/40" : ""
                    }`}
                  >
                    <span className={`h-11 w-11 grid place-items-center rounded-2xl shrink-0 ${n.tint}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold truncate">{n.title}</h4>
                        <span className="text-[11px] text-muted-foreground shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.text}</p>
                    </div>
                    {n.unread && (
                      <span className="h-2 w-2 rounded-full bg-accent mt-1 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </MobileFrame>
  );
}

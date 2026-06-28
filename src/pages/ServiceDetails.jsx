import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Clock, Star, Check, Heart, ArrowLeft } from "lucide-react";
import { setWizardService } from "../redux/slices/bookingsSlice";
import { MobileFrame } from "../components/mobile/MobileFrame";
import { TopBar } from "../components/mobile/TopBar";
import { PrimaryButton } from "../components/mobile/ui";

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { services } = useSelector((state) => state.services);
  const service = services.find((s) => (s._id || s.id) === id);

  if (!service) {
    return (
      <MobileFrame>
        <TopBar title="Not found" />
        <div className="p-10 text-center text-muted-foreground">Service not found.</div>
      </MobileFrame>
    );
  }

  const handleBook = () => {
    dispatch(setWizardService(service));
    navigate("/book");
  };

  // Mock list of reviews to keep layout identical to grace-salon-app-main
  const reviews = [
    { n: "Amelia R.", t: "Absolutely flawless. Lasted the entire wedding day." },
    { n: "Zara K.", t: "Soft, romantic, and exactly what I asked for. Will rebook!" },
  ];

  // Default includes elements if not provided by backend contract
  const includesList = service.includes || [
    "Skin prep & prime",
    "Long-wear finish check",
    "Tailored contour list",
    "Lash application optional",
  ];

  return (
    <MobileFrame>
      <div className="pb-32">
        <div className={`relative h-72 bg-gradient-to-br ${service.hue || "from-primary to-accent"}`}>
          <div className="absolute inset-0">
            <TopBar
              title=""
              right={
                <button className="h-10 w-10 grid place-items-center rounded-full bg-white/85">
                  <Heart className="h-4 w-4 text-accent" />
                </button>
              }
            />
          </div>
          <div className="absolute bottom-6 left-6">
            <span className="px-3 py-1 rounded-full bg-white/85 text-[10px] font-medium text-accent">
              {service.category}
            </span>
          </div>
        </div>

        <div className="-mt-6 relative bg-background rounded-t-[28px] px-6 pt-6 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{service.name}</h1>
              <span className="text-2xl font-semibold text-accent">${service.price}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {service.rating || 4.8} ({service.reviews || 120})
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {service.duration} min
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {service.description || service.short || "Experience premium custom beauty styling tailored to your skin type, style, and requirements for look perfection."}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-3">What's included</h2>
            <ul className="space-y-2">
              {includesList.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="h-6 w-6 rounded-full bg-secondary grid place-items-center">
                    <Check className="h-3.5 w-3.5 text-accent" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Reviews</h2>
              <span className="text-xs text-accent font-medium">See all</span>
            </div>
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-surface border border-border p-4 shadow-[var(--shadow-card)] text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">{r.n}</span>
                    <span className="flex items-center gap-0.5 text-accent text-xs">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border z-50">
        <PrimaryButton onClick={handleBook}>Book Appointment</PrimaryButton>
      </div>
    </MobileFrame>
  );
}

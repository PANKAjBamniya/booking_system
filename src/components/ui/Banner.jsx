import { ChevronRight, Sparkles } from "lucide-react";

const Banner = () => {
  return (
    <div className="px-5 mb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-primary p-6 text-accent-foreground shadow-[var(--shadow-soft)]">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15" />
        <div className="absolute right-6 bottom-4 opacity-30">
          <Sparkles className="h-20 w-20" strokeWidth={1} />
        </div>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-90">
          Spring offer
        </p>
        <h2 className="mt-2 text-xl font-semibold leading-snug max-w-[200px]">
          20% off your first bridal session
        </h2>
        <button className="mt-4 inline-flex items-center gap-1 text-xs font-medium bg-white/95 text-accent px-4 py-2 rounded-full">
          Claim now <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Banner;

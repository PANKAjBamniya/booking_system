import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../redux/slices/servicesSlice";
import {
  setWizardService,
  setWizardDateTime,
} from "../redux/slices/bookingsSlice";
import { Search, Clock, Star } from "lucide-react";
import { TopBar } from "../components/mobile/TopBar";
import { InputField } from "../components/mobile/ui";
import { categories } from "../lib/services-data";

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { services, loading, error } = useSelector((state) => state.services);

  const [active, setActive] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description &&
        s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = active === "All" || s.category === active;
    return matchesSearch && matchesCategory;
  });

  const handleBook = (service) => {
    dispatch(setWizardService(service));
    navigate("/book");
  };

  return (
    <>
      <TopBar title="Services" back={false} />
      <div className="px-5 pb-8 space-y-5">
        <InputField
          icon={<Search className="h-4 w-4" />}
          placeholder="Search services"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
          {["All", ...categories.map((c) => c.name)].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`shrink-0 px-4 h-9 rounded-full text-xs font-medium border transition-colors ${
                active === c
                  ? "bg-accent/15 text-accent border-accent/20"
                  : "bg-surface text-muted-foreground border-border"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            // Skeleton loader
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-surface border border-border overflow-hidden shadow-[var(--shadow-card)] animate-pulse"
              >
                <div className="h-36 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-8 w-full bg-gray-200 rounded-full mt-2"></div>
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-sm">
                No services found matching your filters.
              </p>
            </div>
          ) : (
            filtered.map((s) => (
              <div
                key={s._id || s.id}
                className="rounded-3xl bg-surface border border-border overflow-hidden shadow-[var(--shadow-card)]"
              >
                <Link to={`/services/${s._id || s.id}`} className="block">
                  <div
                    className={`h-36 bg-gradient-to-br ${s.hue || "from-primary to-accent"} relative`}
                  >
                    {s.image && (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="h-full w-full object-cover opacity-80"
                      />
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/85 text-[10px] font-medium text-accent">
                      {s.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/85 text-[10px] font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />{" "}
                      {s.rating || "4.8"}
                    </span>
                  </div>
                  <div className="p-4 pb-2 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold truncate text-foreground">
                        {s.name}
                      </h3>
                      <span className="text-base font-semibold text-accent shrink-0">
                        ₹{s.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {s.short || s.description}
                    </p>
                  </div>
                </Link>
                <div className="px-4 pb-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {s.duration || "60 min"}
                  </span>
                  <button
                    onClick={() => handleBook(s)}
                    className="px-4 h-9 rounded-full bg-accent text-accent-foreground text-xs font-medium grid place-items-center"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Services;

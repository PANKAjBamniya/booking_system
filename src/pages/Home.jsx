import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchServices } from "../redux/slices/servicesSlice";
import { fetchSlots } from "../redux/slices/slotsSlice";
import { fetchBookings } from "../redux/slices/bookingsSlice";
import {
  Search,
  Bell,
  Clock,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { InputField, SectionTitle } from "../components/mobile/ui";
import { categories } from "../lib/services-data";
import { servicesData } from "../utils/servicesData";
import Header from "../components/Header";
import HomeSearch from "../components/ui/HomeSearch";
import Banner from "../components/ui/Banner";
import FeatureServices from "../components/ui/FeatureServices";

const Home = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const featuredServices = servicesData.slice(0, 6);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { services, loading: servicesLoading } = useSelector(
    (state) => state.services,
  );
  const { bookings } = useSelector((state) => state.bookings);

  // Format today's date string
  const pad = (n) => String(n).padStart(2, "0");
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchSlots(todayStr));
    if (isAuthenticated) {
      dispatch(fetchBookings());
    }
  }, [dispatch, isAuthenticated, todayStr]);

  // Find nearest upcoming booking (pending or confirmed)
  const upcomingBooking = bookings.find(
    (b) => b.status === "confirmed" || b.status === "pending",
  );

  // Popular and Available from API services (mocking slice for UI if small list)
  const popular = services.slice(0, 4);
  const available = services.slice(0, 3); // using first few as available placeholder if no specific flag

  useEffect(() => {
    if (!user) {
      navigation("/login");
    }
  }, []);

  return (
    <>
      {/* Greeting */}
      <Header user={user} />

      {/* Search */}
      <HomeSearch />

      {/* Featured Banner */}
      <Banner />

      <FeatureServices featuredServices={featuredServices} />

      {/* Upcoming Appointment */}
      {upcomingBooking ? (
        <div className="px-5 mb-6">
          <div className="rounded-3xl bg-surface border border-border p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-accent uppercase tracking-wider">
                Upcoming
              </span>
              <Link to="/bookings" className="text-xs text-muted-foreground">
                View all
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent shrink-0 overflow-hidden">
                {upcomingBooking.service?.image ? (
                  <img
                    src={upcomingBooking.service.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary to-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">
                  {upcomingBooking.service?.name || "Glam Session"}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> {upcomingBooking.date} ·{" "}
                  {upcomingBooking.time}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" /> At your address
                </p>
              </div>
              <Link
                to={`/bookings/${upcomingBooking._id}`}
                className="h-9 w-9 flex flex-col items-center justify-center rounded-full bg-secondary"
              >
                <ChevronRight className="h-4 w-4 text-accent" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Categories */}
      <SectionTitle
        title="Categories"
        action={<Link to="/services">See all</Link>}
      />
      <div className="px-5 mb-6 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
        {categories.map((c) => (
          <button
            key={c.name}
            className="shrink-0 flex flex-col items-center gap-2 w-20"
          >
            <span className="h-16 w-16 flex items-center justify-center rounded-2xl bg-surface border border-border text-2xl shadow-[var(--shadow-card)]">
              {c.emoji}
            </span>
            <span className="text-[11px] font-medium text-foreground">
              {c.name}
            </span>
          </button>
        ))}
      </div>

      {/* Popular */}
      <SectionTitle
        title="Popular services"
        action={<Link to="/services">See all</Link>}
      />
      <div className="px-5 mb-6 flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
        {popular.map((s) => (
          <Link
            key={s._id || s.id}
            to={`/services/${s._id || s.id}`}
            className="shrink-0 w-44 rounded-3xl bg-surface border border-border overflow-hidden shadow-[var(--shadow-card)]"
          >
            <div
              className={`h-28 bg-gradient-to-br ${s.hue || "from-primary to-accent"} flex items-center justify-center`}
            >
              <Sparkles className="h-8 w-8 text-white/80" strokeWidth={1.2} />
            </div>
            <div className="p-3 space-y-1">
              <h3 className="text-sm font-semibold truncate">{s.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />{" "}
                {s.rating || "4.9"} · {s.duration || "60 min"}
              </p>
              <p className="text-sm font-semibold text-accent">${s.price}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Available Today */}
      <SectionTitle title="Available today" />
      <div className="px-5 space-y-3 pb-8">
        {available.map((s) => (
          <Link
            key={s._id || s.id}
            to={`/services/${s._id || s.id}`}
            className="flex items-center gap-3 rounded-3xl bg-surface border border-border p-3 shadow-[var(--shadow-card)]"
          >
            <div
              className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${s.hue || "from-primary to-accent"} shrink-0`}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold truncate">{s.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {s.short || s.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                <Clock className="h-3 w-3" /> {s.duration || "60 min"}
              </p>
            </div>
            <span className="text-sm font-semibold text-accent">
              ${s.price}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;

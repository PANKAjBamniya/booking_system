import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../redux/slices/servicesSlice";
import { fetchSlots } from "../redux/slices/slotsSlice";
import {
  createBooking,
  setWizardService,
  setWizardDateTime,
  setWizardCustomerDetails,
  clearBookingWizard,
  clearBookingError,
} from "../redux/slices/bookingsSlice";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  CheckCircle2,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "../components/mobile/TopBar";
import { PrimaryButton, SecondaryButton } from "../components/mobile/ui";
import { MobileFrame } from "../components/mobile/MobileFrame";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function Row({ icon, label, value, arrow }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-9 w-9 grid place-items-center rounded-xl bg-secondary text-accent shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
      {arrow && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
}

function Line({ label, value, bold, accent }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span
        className={`${bold ? "text-base font-semibold text-foreground" : ""} ${
          accent ? "text-accent font-medium" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

const Book = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { services, loading: servicesLoading } = useSelector(
    (state) => state.services,
  );
  const { slots, loading: slotsLoading } = useSelector((state) => state.slots);
  const {
    bookingWizard,
    loading: bookingLoading,
    error: bookingError,
  } = useSelector((state) => state.bookings);

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(
    bookingWizard.selectedService?._id || "",
  );

  // Date picker state
  const pad = (n) => String(n).padStart(2, "0");
  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const [date, setDate] = useState(
    bookingWizard.selectedDate || getTodayString(),
  );
  const [time, setTime] = useState(bookingWizard.selectedTime || "");

  // Calendar View month/year state
  const today = new Date();
  const [calendarView, setCalendarView] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });

  // Form states
  const [customerName, setCustomerName] = useState(
    bookingWizard.customerName || user?.name || "",
  );
  const [address, setAddress] = useState(
    bookingWizard.address || user?.address || "",
  );
  const [notes, setNotes] = useState(bookingWizard.notes || "");

  const [createdBookingResult, setCreatedBookingResult] = useState(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useEffect(() => {
    if (date) {
      dispatch(fetchSlots(date));
    }
  }, [date, dispatch]);

  useEffect(() => {
    if (bookingError) {
      toast.error(bookingError);
      dispatch(clearBookingError());
    }
  }, [bookingError, dispatch]);

  useEffect(() => {
    if (bookingWizard.selectedService) {
      setSelectedServiceId(bookingWizard.selectedService._id);
      if (step === 1) {
        setStep(2);
      }
    }
  }, [bookingWizard.selectedService, step]);

  const handleServiceSelect = (service) => {
    setSelectedServiceId(service._id);
    dispatch(setWizardService(service));
    setStep(2);
  };

  const handleSlotSelect = (slotTime) => {
    setTime(slotTime);
  };

  const handleStep2Submit = () => {
    if (!date || !time) {
      toast.error("Please select both a date and an available slot.");
      return;
    }
    dispatch(setWizardDateTime({ date, time }));
    setStep(3);
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    if (!customerName || !address) {
      toast.error("Name and address are required fields.");
      return;
    }
    dispatch(setWizardCustomerDetails({ name: customerName, address, notes }));
    setStep(4);
  };

  const handleConfirmBooking = async () => {
    const bookingData = {
      serviceId: selectedServiceId,
      date,
      time,
      name: customerName,
      address,
      notes,
    };

    const action = await dispatch(createBooking(bookingData));
    if (createBooking.fulfilled.match(action)) {
      setCreatedBookingResult(action.payload.data);
      dispatch(clearBookingWizard());
      toast.success("Appointment booked successfully!");
      setStep(5); // Success step
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Select Service";
      case 2:
        return "Schedule Time";
      case 3:
        return "Your Details";
      case 4:
        return "Booking Summary";
      case 5:
        return "Success";
      default:
        return "";
    }
  };

  // Custom Calendar Helpers
  const firstDay = new Date(calendarView.y, calendarView.m, 1).getDay();
  const daysInMonth = new Date(calendarView.y, calendarView.m + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const checkIsToday = (d) => {
    const now = new Date();
    return (
      calendarView.y === now.getFullYear() &&
      calendarView.m === now.getMonth() &&
      d === now.getDate()
    );
  };

  const checkIsSelected = (d) => {
    if (!date) return false;
    const [sy, sm, sd] = date.split("-").map(Number);
    return calendarView.y === sy && calendarView.m + 1 === sm && d === sd;
  };

  const isDayDisabled = (d) => {
    const cellDate = new Date(calendarView.y, calendarView.m, d);
    const todayZero = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    // Disable past dates or Sundays
    return cellDate < todayZero || cellDate.getDay() === 0;
  };

  const handleSelectDay = (d) => {
    const selectedDateStr = `${calendarView.y}-${pad(calendarView.m + 1)}-${pad(d)}`;
    setDate(selectedDateStr);
    setTime(""); // Reset selected slot
  };

  // Partition Slots by Period
  const getSlotPeriod = (timeStr) => {
    const hour = parseInt(timeStr.split(":")[0], 10);
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  const morningSlots = slots.filter(
    (slot) => getSlotPeriod(slot.time) === "Morning",
  );
  const afternoonSlots = slots.filter(
    (slot) => getSlotPeriod(slot.time) === "Afternoon",
  );
  const eveningSlots = slots.filter(
    (slot) => getSlotPeriod(slot.time) === "Evening",
  );

  return (
    <MobileFrame>
      <>
        {step < 5 && (
          <TopBar
            title={getStepTitle()}
            back={true}
            right={
              <span className="text-xs font-semibold text-accent">
                {step}/4
              </span>
            }
          />
        )}

        <div
          className={
            step < 5
              ? "px-5 pb-32 space-y-6 pt-4"
              : "min-h-screen flex flex-col justify-between"
          }
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: SELECT SERVICE */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {servicesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-28 rounded-3xl bg-surface border border-border animate-pulse shadow-[var(--shadow-card)]"
                      ></div>
                    ))}
                  </div>
                ) : (
                  services.map((service) => (
                    <div
                      key={service._id}
                      onClick={() => handleServiceSelect(service)}
                      className={`rounded-3xl bg-surface border overflow-hidden p-3 shadow-[var(--shadow-card)] flex items-center gap-3 cursor-pointer transition-all ${
                        selectedServiceId === service._id
                          ? "border-accent ring-1 ring-accent/20"
                          : "border-border"
                      }`}
                    >
                      <div className="h-16 w-16 rounded-2xl shrink-0 overflow-hidden relative">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className={`h-full w-full bg-gradient-to-br ${service.hue || "from-primary to-accent"}`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left py-1">
                        <h3 className="text-sm font-semibold truncate text-foreground">
                          {service.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {service.category}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-semibold text-accent">
                            ₹{service.price}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Clock className="h-3 w-3" /> {service.duration} Min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* STEP 2: SELECT DATE & TIME SLOT */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Custom Datepicker Calendar */}
                <div className="rounded-3xl bg-surface border border-border p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarView((v) =>
                          v.m === 0
                            ? { y: v.y - 1, m: 11 }
                            : { ...v, m: v.m - 1 },
                        )
                      }
                      className="h-9 w-9 grid place-items-center rounded-full bg-secondary transition-colors hover:bg-secondary/80"
                    >
                      <ChevronLeft className="h-4 w-4 text-accent" />
                    </button>
                    <span className="text-sm font-semibold text-foreground">
                      {MONTHS[calendarView.m]} {calendarView.y}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarView((v) =>
                          v.m === 11
                            ? { y: v.y + 1, m: 0 }
                            : { ...v, m: v.m + 1 },
                        )
                      }
                      className="h-9 w-9 grid place-items-center rounded-full bg-secondary transition-colors hover:bg-secondary/80"
                    >
                      <ChevronRight className="h-4 w-4 text-accent" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {DAYS.map((d, i) => (
                      <span
                        key={i}
                        className="h-8 grid place-items-center text-[11px] font-medium text-muted-foreground"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((d, i) => {
                      if (!d) return <span key={i} className="h-10" />;
                      const isDisabled = isDayDisabled(d);
                      const isSelected = checkIsSelected(d);
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleSelectDay(d)}
                          className={`h-10 rounded-full text-sm font-medium grid place-items-center transition-colors ${
                            isSelected
                              ? "bg-accent text-accent-foreground shadow-[var(--shadow-soft)]"
                              : isDisabled
                                ? "text-muted-foreground/45 line-through cursor-not-allowed"
                                : checkIsToday(d)
                                  ? "bg-secondary text-accent font-semibold"
                                  : "text-foreground hover:bg-secondary"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Informative Color indicators */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground px-2">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-accent" /> Selected
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-secondary" />{" "}
                    Available
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-border" /> Disabled
                  </span>
                </div>

                {/* Time Slots partitioned by period */}
                <div className="space-y-5">
                  {slotsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((g) => (
                        <div key={g} className="space-y-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                          <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map((n) => (
                              <div
                                key={n}
                                className="h-12 bg-surface rounded-2xl border border-border animate-pulse"
                              ></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No slots available for {date}.
                    </div>
                  ) : (
                    <>
                      {[
                        { name: "Morning", icon: Sun, list: morningSlots },
                        {
                          name: "Afternoon",
                          icon: Sunset,
                          list: afternoonSlots,
                        },
                        { name: "Evening", icon: Moon, list: eveningSlots },
                      ].map((group) => {
                        if (group.list.length === 0) return null;
                        const Icon = group.icon;
                        return (
                          <div key={group.name} className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                              <Icon className="h-4 w-4 text-accent" />
                              <h3 className="text-sm font-semibold text-foreground">
                                {group.name}
                              </h3>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {group.list.map((slot) => {
                                const isAvailable =
                                  !slot.isBlocked &&
                                  !slot.isHoliday &&
                                  !slot.isLunchBreak &&
                                  slot.currentBookings < slot.maxBookings;
                                if (!isAvailable) return null;
                                const active = time === slot.time;
                                return (
                                  <button
                                    key={slot._id}
                                    type="button"
                                    onClick={() => handleSlotSelect(slot.time)}
                                    className={`h-12 rounded-2xl text-sm font-medium border transition-colors ${
                                      active
                                        ? "bg-accent text-accent-foreground border-accent shadow-[var(--shadow-soft)]"
                                        : "bg-surface text-foreground border-border hover:border-accent/40"
                                    }`}
                                  >
                                    {slot.time}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border z-40">
                  <button
                    onClick={handleStep2Submit}
                    disabled={!time}
                    className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-accent text-accent-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[var(--shadow-soft)] hover:bg-accent-hover transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CUSTOMER DETAILS */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form onSubmit={handleStep3Submit} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full h-14 px-4 rounded-2xl bg-input border border-border text-sm outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
                        Service Address
                      </label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address, building, city"
                        rows={3}
                        className="w-full p-4 rounded-2xl bg-input border border-border text-sm outline-none focus:border-accent resize-none placeholder:text-muted-foreground/60 focus:ring-4 focus:ring-accent/15 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 px-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Skin allergies, specific style preferences..."
                        rows={2}
                        className="w-full p-4 rounded-2xl bg-input border border-border text-sm outline-none focus:border-accent resize-none placeholder:text-muted-foreground/60 focus:ring-4 focus:ring-accent/15 transition-all"
                      />
                    </div>
                  </div>

                  <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border z-40">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-accent text-accent-foreground font-semibold text-sm shadow-[var(--shadow-soft)] hover:bg-accent-hover transition-colors"
                    >
                      Review Details
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUMMARY */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="rounded-3xl bg-surface border border-border p-4 shadow-[var(--shadow-card)] flex items-center gap-3">
                  <div className="h-16 w-16 rounded-2xl bg-secondary shrink-0 overflow-hidden relative">
                    {bookingWizard.selectedService?.image ? (
                      <img
                        src={bookingWizard.selectedService.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full bg-gradient-to-br ${bookingWizard.selectedService?.hue || "from-primary to-accent"}`}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-sm font-semibold truncate text-foreground">
                      {bookingWizard.selectedService?.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {bookingWizard.selectedService?.category} ·{" "}
                      {bookingWizard.selectedService?.duration} min
                    </p>
                  </div>
                  <span className="text-base font-semibold text-accent">
                    ₹{bookingWizard.selectedService?.price}
                  </span>
                </div>

                <div className="rounded-3xl bg-surface border border-border p-5 shadow-[var(--shadow-card)] space-y-4">
                  <Row
                    icon={<CalendarIcon className="h-4 w-4" />}
                    label="Date"
                    value={date}
                  />
                  <Row
                    icon={<Clock className="h-4 w-4" />}
                    label="Time slot"
                    value={time}
                  />
                  <Row
                    icon={<MapPin className="h-4 w-4" />}
                    label="Address"
                    value={address}
                  />
                  <Row
                    icon={<CreditCard className="h-4 w-4" />}
                    label="Payment"
                    value="Pay at location"
                    arrow={false}
                  />
                </div>

                <div className="rounded-3xl bg-secondary p-5 space-y-2 border border-border">
                  <Line
                    label="Service"
                    value={`₹${bookingWizard.selectedService?.price || 0}`}
                  />
                  <Line label="Convenience Note" value="Cash / Card on site" />
                  <div className="border-t border-border/50 my-2" />
                  <Line
                    label="Total Estimate"
                    value={`₹${bookingWizard.selectedService?.price || 0}`}
                    bold
                  />
                </div>

                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/95 backdrop-blur px-6 pt-3 pb-6 border-t border-border z-40">
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-accent text-accent-foreground font-semibold text-sm disabled:opacity-75 shadow-[var(--shadow-soft)] hover:bg-accent-hover transition-colors"
                  >
                    {bookingLoading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS (Full page match) */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex flex-col justify-between px-8 pt-24 pb-10 text-center bg-gradient-to-b from-secondary via-background to-background"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/40 blur-2xl" />
                    <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center shadow-[var(--shadow-soft)]">
                      <Check
                        className="h-14 w-14 text-white"
                        strokeWidth={2.4}
                      />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent" />
                    <Sparkles className="absolute -bottom-1 -left-3 h-5 w-5 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      Booking confirmed!
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-[280px]">
                      Your artist will arrive on time and beautifully prepared.
                    </p>
                  </div>

                  {createdBookingResult && (
                    <div className="bg-surface border border-border rounded-2xl px-6 py-3 shadow-[var(--shadow-card)]">
                      <p className="text-[11px] text-muted-foreground">
                        Booking ID
                      </p>
                      <p className="text-sm font-semibold tracking-wider text-accent font-mono select-all">
                        #
                        {createdBookingResult.bookingId ||
                          createdBookingResult._id?.slice(-8)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => navigate("/bookings")}
                    className="w-full h-14 rounded-2xl bg-accent text-accent-foreground font-semibold text-sm shadow-[var(--shadow-soft)] hover:bg-accent-hover transition-colors"
                  >
                    Go to My Bookings
                  </button>
                  <button
                    onClick={() => navigate("/home")}
                    className="w-full h-14 rounded-2xl bg-surface border border-border font-semibold text-sm hover:bg-secondary transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    </MobileFrame>
  );
};

export default Book;

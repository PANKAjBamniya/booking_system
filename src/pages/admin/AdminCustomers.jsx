import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "../../redux/slices/adminSlice";
import { fetchBookings } from "../../redux/slices/bookingsSlice";
import {
  Search,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  X,
  CalendarCheck,
  Loader2,
} from "lucide-react";

const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-green-50 text-green-700 border-green-250";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-250";
    case "completed":
      return "bg-blue-50 text-blue-700 border-blue-250";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-250";
    default:
      return "bg-gray-50 text-gray-700 border-gray-250";
  }
};

const AdminCustomers = () => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.admin);
  const { bookings } = useSelector((state) => state.bookings);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchBookings());
  }, [dispatch]);

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return !q || c.name?.toLowerCase().includes(q) || c.phone?.includes(q);
  });

  // Get active history for drawer
  const customerBookings = selectedCustomer
    ? bookings.filter((b) => {
        const id = b.customer?._id || b.customer;
        return id === selectedCustomer._id;
      })
    : [];

  return (
    <div className="space-y-6 relative min-h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="font-serif text-2xl font-bold text-textColor">
            Customers
          </h1>
          <p className="text-xs text-textColor/55 mt-1">
            Browse registered customers, view their profile and historical
            booking patterns.
          </p>
        </div>
        <div className="relative max-w-xs w-full ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textColor/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="luxury-input pl-9 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="luxury-card bg-white text-center py-12">
          <p className="text-sm text-textColor/50">No customers found.</p>
        </div>
      ) : (
        <div className="luxury-card bg-white p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-bgColor border-b border-borderColor/40">
                <tr className="text-left text-textColor/50 uppercase tracking-wider">
                  {[
                    "Customer",
                    "Phone",
                    "Total Bookings",
                    "Total Spent",
                    "Member Since",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/20">
                {filtered.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-bgColor/60 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-accent" />
                        </div>
                        <span className="font-semibold text-textColor">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-textColor/70">{c.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <CalendarCheck className="h-3.5 w-3.5 text-accent" />
                        <span className="font-semibold text-textColor">
                          {c.bookingCount ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-accent">
                      ₹{(c.totalSpending ?? 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-textColor/50">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-borderColor/40 px-4 py-3 text-xs text-textColor/40 text-right">
            Showing {filtered.length} of {customers.length} customers
          </div>
        </div>
      )}

      {/* Customer Details Drawer / Sidebar Panel */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-textColor/35 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedCustomer(null)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col p-6 overflow-hidden z-10 animate-slideRight">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-borderColor/40 pb-4 shrink-0">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-accent bg-secondary px-2.5 py-1 rounded">
                  Customer Details
                </span>
                <h2 className="text-lg font-serif font-bold text-textColor mt-2">
                  {selectedCustomer.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 hover:bg-bgColor rounded-lg transition-colors border border-borderColor/40"
              >
                <X className="h-4 w-4 text-textColor" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pt-6 space-y-6 text-left select-text">
              {/* Profile Card */}
              <div className="luxury-card bg-bgColor/40 p-4 border border-borderColor/30 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-textColor/40">
                  Profile Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-textColor/45">
                      Phone Number
                    </p>
                    <p className="text-xs font-semibold text-textColor flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-accent" />{" "}
                      {selectedCustomer.phone}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-textColor/45">
                      Member Since
                    </p>
                    <p className="text-xs font-semibold text-textColor flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-accent" />{" "}
                      {new Date(selectedCustomer.createdAt).toLocaleDateString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                </div>
                <div className="border-t border-borderColor/20 my-2 pt-2 space-y-0.5">
                  <p className="text-[10px] text-textColor/45">
                    Default Address
                  </p>
                  <p className="text-xs text-textColor/75 leading-relaxed flex items-start gap-1.5">
                    <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {selectedCustomer.address || "No address specified."}
                  </p>
                </div>
              </div>

              {/* Booking History Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-textColor/45 border-b border-borderColor/20 pb-2">
                  Booking History ({customerBookings.length})
                </h3>
                {customerBookings.length === 0 ? (
                  <div className="text-center py-8 bg-bgColor/20 rounded-2xl border border-borderColor/20">
                    <p className="text-xs text-textColor/40">
                      No historical appointments found for this customer.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customerBookings.map((b) => (
                      <div
                        key={b._id}
                        className="p-3.5 border border-borderColor/40 rounded-2xl space-y-2 hover:border-accent/40 bg-white shadow-soft transition-all"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs font-bold text-textColor truncate">
                            {b.service?.name || "Service Session"}
                          </p>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${getStatusColor(b.status)}`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-textColor/55 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-accent" />{" "}
                            {b.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-accent" />{" "}
                            {b.time}
                          </span>
                          <span className="text-xs font-bold text-accent ml-auto">
                            ₹{b.amount}
                          </span>
                        </div>
                        {b.notes && (
                          <div className="bg-bgColor/50 p-2 rounded-xl text-[10px] text-textColor/60 italic leading-relaxed">
                            "{b.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;

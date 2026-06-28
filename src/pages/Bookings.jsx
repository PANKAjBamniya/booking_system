import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, updateBookingStatus } from '../redux/slices/bookingsSlice';
import { Clock, MapPin, ChevronRight, XCircle, ShieldClose, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '../components/mobile/TopBar';

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null); 
  const [cancelConfirmId, setCancelConfirmId] = useState(null); 

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const tabs = [
    { id: 'upcoming', name: 'Upcoming' },
    { id: 'pending', name: 'Pending' },
    { id: 'confirmed', name: 'Confirmed' },
    { id: 'completed', name: 'Completed' },
    { id: 'cancelled', name: 'Cancelled' },
  ];

  const isFutureBooking = (dateStr, timeStr) => {
    const bDate = new Date(`${dateStr}T${timeStr}`);
    return bDate > new Date();
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return (b.status === 'pending' || b.status === 'confirmed') && isFutureBooking(b.date, b.time);
    }
    return b.status === activeTab;
  });

  const handleCancelBooking = async (id) => {
    const action = await dispatch(updateBookingStatus({ id, status: 'cancelled', notes: 'Cancelled by Client' }));
    if (updateBookingStatus.fulfilled.match(action)) {
      toast.success('Appointment cancelled successfully.');
      setCancelConfirmId(null);
      setSelectedBooking(null);
      dispatch(fetchBookings());
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#E3F5E6] text-[#2F7A3A] border-[#2F7A3A]/20';
      case 'pending': return 'bg-[#FFF3D6] text-[#9A6B00] border-[#9A6B00]/20';
      case 'completed': return 'bg-[#E6F0FF] text-[#1E5B99] border-[#1E5B99]/20';
      case 'cancelled': return 'bg-[#FCE3E3] text-[#B33A3A] border-[#B33A3A]/20';
      default: return 'bg-secondary border-border text-foreground';
    }
  };

  return (
    <>
      <TopBar title="My Bookings" back={false} />
      <div className="px-5 pb-8 space-y-4">
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 h-9 rounded-full text-xs font-medium border transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent/15 text-accent border-accent/20'
                  : 'bg-surface text-muted-foreground border-border'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(n => <div key={n} className="h-32 rounded-3xl bg-surface border border-border animate-pulse shadow-[var(--shadow-card)]"></div>)}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="mt-20 text-center px-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-secondary grid place-items-center mb-4">
              <span className="text-3xl">🌸</span>
            </div>
            <h3 className="text-base font-semibold">No {activeTab} bookings</h3>
            <p className="text-sm text-muted-foreground mt-1">
              When you book a session it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredBookings.map((b) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={b._id}
                  onClick={() => setSelectedBooking(b)}
                  className="block rounded-3xl bg-surface border border-border p-4 shadow-[var(--shadow-card)] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${b.service?.hue || 'from-primary/20 to-primary/40'} shrink-0`} >
                      {b.service?.image && <img src={b.service.image} alt="Service" className="h-full w-full object-cover rounded-2xl opacity-60" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold truncate">{b.service?.name}</h3>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {b.date} · {b.time}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> Home service
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground font-mono">#{b.bookingId}</span>
                    <span className="text-xs font-medium text-accent flex items-center gap-1">
                      View details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-3xl p-6 w-full max-w-sm text-left space-y-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex justify-between items-start border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">Booking Details</h3>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">ID: {selectedBooking.bookingId}</p>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(selectedBooking.status)}`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Service</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm font-semibold text-foreground">{selectedBooking.service?.name}</p>
                  <p className="text-sm font-bold text-accent">₹{selectedBooking.amount}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedBooking.service?.duration} Mins</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Date</p>
                  <p className="text-xs font-semibold text-foreground mt-1 flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-accent"/> {selectedBooking.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Time Slot</p>
                  <p className="text-xs font-semibold text-foreground mt-1 flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-accent"/> {selectedBooking.time}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Location</p>
                <p className="text-xs text-foreground leading-relaxed mt-1">{selectedBooking.address}</p>
              </div>

              {selectedBooking.notes && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">Special Request Notes</p>
                  <p className="text-xs text-muted-foreground italic leading-relaxed mt-1">"{selectedBooking.notes}"</p>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-3 pt-4 border-t border-border">
               {(selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed') && isFutureBooking(selectedBooking.date, selectedBooking.time) ? (
                  <button
                    onClick={() => setCancelConfirmId(selectedBooking._id)}
                    className="flex-1 py-2.5 rounded-2xl border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-colors"
                  >
                    Cancel Slot
                  </button>
               ) : <div className="flex-1" />}
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-2.5 rounded-2xl bg-accent text-accent-foreground text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {cancelConfirmId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-xs text-center space-y-4 shadow-[var(--shadow-card)] animate-in fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-2">
              <ShieldClose className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-base">Cancel Appointment?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This will cancel your booking and restore the slot for other clients.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <button
                onClick={() => handleCancelBooking(cancelConfirmId)}
                className="w-full bg-destructive text-destructive-foreground py-3 rounded-2xl text-xs font-semibold"
              >
                Yes, Cancel Booking
              </button>
              <button
                onClick={() => setCancelConfirmId(null)}
                className="w-full py-3 text-xs font-semibold text-muted-foreground"
              >
                Keep Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bookings;

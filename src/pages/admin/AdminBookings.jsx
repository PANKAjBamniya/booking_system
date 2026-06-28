import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, updateBookingStatus, rescheduleBooking } from '../../redux/slices/bookingsSlice';
import { fetchSlots } from '../../redux/slices/slotsSlice';
import { CheckCircle2, XCircle, Eye, X, Loader2, Search, Filter, CalendarRange, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const getStatusColor = (s) => {
  switch (s) {
    case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
    case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const { slots, loading: slotsLoading } = useSelector((state) => state.slots);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Rescheduling states
  const [rescheduleBookingId, setRescheduleBookingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => { dispatch(fetchBookings()); }, [dispatch]);

  // Fetch slots whenever the rescheduling date changes
  useEffect(() => {
    if (newDate) {
      dispatch(fetchSlots(newDate));
    }
  }, [newDate, dispatch]);

  const handleStatusUpdate = async (id, status) => {
    const action = await dispatch(updateBookingStatus({ id, status }));
    if (updateBookingStatus.fulfilled.match(action)) {
      toast.success(`Booking marked as ${status}`);
      dispatch(fetchBookings());
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      toast.error('Please select both a date and an available slot.');
      return;
    }
    const action = await dispatch(rescheduleBooking({ id: rescheduleBookingId, date: newDate, time: newTime }));
    if (rescheduleBooking.fulfilled.match(action)) {
      toast.success('Booking rescheduled successfully!');
      setRescheduleBookingId(null);
      dispatch(fetchBookings());
    } else {
      toast.error(action.payload || 'Failed to reschedule booking.');
    }
  };

  const filtered = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (b.bookingId?.toLowerCase().includes(q)) ||
      (b.customerName || b.name || '').toLowerCase().includes(q) ||
      (b.service?.name || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const activeRescheduleBooking = bookings.find(b => b._id === rescheduleBookingId);

  // Available slots logic
  const availableSlots = slots.filter(s => !s.isBlocked && !s.isHoliday && !s.isLunchBreak && s.currentBookings < s.maxBookings);

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="font-serif text-2xl font-bold text-textColor">All Appointments</h1>
        <p className="text-xs text-textColor/55 mt-1">Review, confirm, complete, cancel, or reschedule customer bookings.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textColor/30 pointer-events-none" />
          <input type="text" placeholder="Search by ID, name, or service..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="luxury-input pl-9 text-xs" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-colors ${statusFilter === s ? 'bg-accent text-white border-accent' : 'bg-white border-borderColor text-textColor/70 hover:bg-bgColor'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : (
        <div className="luxury-card bg-white p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-bgColor border-b border-borderColor/40">
                <tr className="text-left text-textColor/50 uppercase tracking-wider">
                  {['Booking ID', 'Customer', 'Service', 'Date & Time', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/20">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-textColor/40">No bookings found.</td></tr>
                ) : filtered.map(b => (
                  <tr key={b._id} className="hover:bg-bgColor/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-textColor/50">{b.bookingId}</td>
                    <td className="px-4 py-3 font-medium text-textColor">{b.customerName || b.name || '—'}</td>
                    <td className="px-4 py-3 text-textColor/70">{b.service?.name}</td>
                    <td className="px-4 py-3 text-textColor/70 whitespace-nowrap">{b.date} · {b.time}</td>
                    <td className="px-4 py-3 font-bold text-accent">₹{b.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setSelectedBooking(b)} className="p-1.5 rounded-lg border border-borderColor bg-bgColor hover:bg-secondary hover:text-accent transition-colors" title="View"><Eye className="h-3.5 w-3.5" /></button>
                        {(b.status === 'pending' || b.status === 'confirmed') && (
                          <button onClick={() => {
                            setRescheduleBookingId(b._id);
                            setNewDate(b.date);
                            setNewTime(b.time);
                          }} className="p-1.5 rounded-lg border border-borderColor bg-bgColor hover:bg-secondary hover:text-accent transition-colors" title="Reschedule"><CalendarRange className="h-3.5 w-3.5" /></button>
                        )}
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(b._id, 'confirmed')} className="p-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors" title="Confirm"><CheckCircle2 className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleStatusUpdate(b._id, 'cancelled')} className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors" title="Cancel"><XCircle className="h-3.5 w-3.5" /></button>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <button onClick={() => handleStatusUpdate(b._id, 'completed')} className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors" title="Mark completed"><CheckCircle2 className="h-3.5 w-3.5" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textColor/35 backdrop-blur-sm">
          <div className="bg-white border border-borderColor rounded-3xl p-6 w-full max-w-md text-left space-y-4 shadow-premium animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-borderColor/40 pb-3">
              <h3 className="font-serif text-lg font-bold text-textColor">Booking Details</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-1.5 rounded-xl hover:bg-bgColor text-textColor/50"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-3 text-xs select-text">
              {[
                ['Booking ID', selectedBooking.bookingId],
                ['Status', selectedBooking.status],
                ['Customer', selectedBooking.customerName || selectedBooking.name],
                ['Service', selectedBooking.service?.name],
                ['Date', selectedBooking.date],
                ['Time', selectedBooking.time],
                ['Amount', `₹${selectedBooking.amount}`],
                ['Address', selectedBooking.address],
                ['Notes', selectedBooking.notes || '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-textColor/50 text-[10px] font-semibold uppercase tracking-wider shrink-0">{label}</span>
                  <span className="text-textColor font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleBookingId && activeRescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textColor/35 backdrop-blur-sm">
          <div className="bg-white border border-borderColor rounded-3xl p-6 w-full max-w-md text-left space-y-5 shadow-premium animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-borderColor/40 pb-3">
              <div className="text-left">
                <h3 className="font-serif text-lg font-bold text-textColor">Reschedule Appointment</h3>
                <p className="text-[10px] font-mono text-textColor/50 mt-0.5">Booking #{activeRescheduleBooking.bookingId}</p>
              </div>
              <button onClick={() => setRescheduleBookingId(null)} className="p-1.5 rounded-xl hover:bg-bgColor text-textColor/50"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-left">
              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-textColor/50 uppercase tracking-wider">Select Date</label>
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => {
                    setNewDate(e.target.value);
                    setNewTime(''); // Reset selected time
                  }}
                  className="luxury-input text-xs"
                  required
                />
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-textColor/50 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-accent" /> Available Slots
                </label>
                {slotsLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
                ) : !newDate ? (
                  <p className="text-xs text-textColor/40 italic">Please pick a date first to view slots.</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-xs text-textColor/40 italic">No available slots on this date.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((s) => (
                      <button
                        key={s._id}
                        type="button"
                        onClick={() => setNewTime(s.time)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-colors text-center ${newTime === s.time
                            ? 'bg-accent text-white border-accent shadow-soft'
                            : 'bg-white border-borderColor text-textColor/75 hover:bg-bgColor'
                          }`}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3 border-t border-borderColor/40">
                <button
                  type="button"
                  onClick={() => setRescheduleBookingId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-borderColor text-textColor/75 font-semibold text-xs hover:bg-bgColor transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newDate || !newTime || slotsLoading}
                  className="flex-1 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs hover:bg-accent-hover transition-all disabled:opacity-50"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSlots, createBulkSlots, updateSlot, setSelectedDate } from '../../redux/slices/slotsSlice';
import { CalendarRange, Lock, Unlock, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const pad = (n) => String(n).padStart(2, '0');
const getTodayStr = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };

const AdminSlots = () => {
  const dispatch = useDispatch();
  const { slots, selectedDate, loading } = useSelector((state) => state.slots);

  const [date, setDate] = useState(selectedDate || getTodayStr());
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    dispatch(fetchSlots(date));
    dispatch(setSelectedDate(date));
  }, [date, dispatch]);

  const handleGenerate = async () => {
    setGenerating(true);
    // Generate slots for the next 7 days from selected date
    const action = await dispatch(createBulkSlots({ startDate: date, days: 7, startTime: '09:00', endTime: '19:00', intervalMinutes: 60, maxBookings: 2 }));
    setGenerating(false);
    if (createBulkSlots.fulfilled.match(action)) {
      toast.success('Slots generated for 7 days!');
      dispatch(fetchSlots(date));
    } else {
      toast.error('Failed to generate slots.');
    }
  };

  const handleToggleBlock = async (slot) => {
    const action = await dispatch(updateSlot({ id: slot._id, slotData: { isBlocked: !slot.isBlocked } }));
    if (updateSlot.fulfilled.match(action)) {
      toast.success(slot.isBlocked ? 'Slot unblocked.' : 'Slot blocked.');
    }
  };

  const getSlotStyle = (slot) => {
    if (slot.isHoliday || slot.isBlocked) return 'bg-red-50 border-red-200 text-red-700';
    if (slot.isLunchBreak) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    if (slot.currentBookings >= slot.maxBookings) return 'bg-gray-100 border-gray-200 text-gray-500';
    return 'bg-green-50 border-green-200 text-green-700';
  };

  const getSlotLabel = (slot) => {
    if (slot.isHoliday) return 'Holiday';
    if (slot.isBlocked) return 'Blocked';
    if (slot.isLunchBreak) return 'Break';
    if (slot.currentBookings >= slot.maxBookings) return 'Full';
    return `${slot.currentBookings}/${slot.maxBookings}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-textColor">Slots & Calendar</h1>
          <p className="text-xs text-textColor/55 mt-1">Manage daily appointment slot availability and blocks.</p>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="luxury-btn-accent flex items-center gap-2 text-sm">
          {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Generate 7-Day Slots
        </button>
      </div>

      {/* Date Selector */}
      <div className="luxury-card bg-white p-4 flex items-center gap-4">
        <CalendarRange className="h-5 w-5 text-accent shrink-0" />
        <div className="flex-1">
          <label htmlFor="slot-date" className="block text-xs font-semibold text-textColor/60 uppercase tracking-wider mb-1">Select Date</label>
          <input id="slot-date" type="date" value={date} onChange={e => setDate(e.target.value)} className="luxury-input max-w-xs" />
        </div>
        <div className="text-right text-xs text-textColor/50">
          <p className="font-semibold">{slots.length} slots</p>
          <p>{slots.filter(s => !s.isBlocked && !s.isHoliday && s.currentBookings < s.maxBookings).length} available</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { color: 'bg-green-50 border-green-200 text-green-700', label: 'Available' },
          { color: 'bg-gray-100 border-gray-200 text-gray-500', label: 'Fully Booked' },
          { color: 'bg-red-50 border-red-200 text-red-700', label: 'Blocked / Holiday' },
          { color: 'bg-yellow-50 border-yellow-200 text-yellow-700', label: 'Lunch Break' },
        ].map(l => (
          <div key={l.label} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-semibold ${l.color}`}>
            <span className="h-2 w-2 rounded-full bg-current opacity-60"></span> {l.label}
          </div>
        ))}
      </div>

      {/* Slots Grid */}
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[...Array(12)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white border border-borderColor animate-pulse" />)}
        </div>
      ) : slots.length === 0 ? (
        <div className="luxury-card bg-white text-center py-12">
          <p className="text-sm text-textColor/50">No slots found for this date. Generate slots using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {slots.map(slot => (
            <div key={slot._id} className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border text-center ${getSlotStyle(slot)}`}>
              <span className="text-sm font-bold">{slot.time}</span>
              <span className="text-[10px] font-semibold mt-1">{getSlotLabel(slot)}</span>
              {!slot.isHoliday && !slot.isLunchBreak && (
                <button
                  onClick={() => handleToggleBlock(slot)}
                  title={slot.isBlocked ? 'Unblock slot' : 'Block slot'}
                  className="mt-2 p-1 rounded-lg hover:bg-white/60 transition-colors"
                >
                  {slot.isBlocked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5 opacity-50 hover:opacity-100" />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSlots;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';
import { fetchBookings, updateBookingStatus } from '../../redux/slices/bookingsSlice';
import { 
  Users, CalendarCheck, TrendingUp, Clock, 
  CheckCircle2, XCircle, Loader2, IndianRupee
} from 'lucide-react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const StatCard = ({ title, value, icon: Icon, color, suffix }) => (
  <div className="luxury-card bg-white p-5 flex items-center gap-4">
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div className="text-left">
      <p className="text-xs font-semibold text-textColor/50 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-textColor mt-0.5">
        {suffix && <span className="text-base font-normal text-textColor/60 mr-0.5">{suffix}</span>}
        {value ?? '—'}
      </p>
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
    case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { kpi, recentBookings, loading } = useSelector((state) => state.admin);
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleStatusUpdate = async (id, status) => {
    const action = await dispatch(updateBookingStatus({ id, status }));
    if (updateBookingStatus.fulfilled.match(action)) {
      toast.success(`Booking marked as ${status}`);
      dispatch(fetchDashboardStats());
      dispatch(fetchBookings());
    }
  };

  const todayBookings = bookings.filter(b => b.date === dayjs().format('YYYY-MM-DD'));

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="text-left">
        <h1 className="font-serif text-2xl font-bold text-textColor">Dashboard Overview</h1>
        <p className="text-xs text-textColor/55 mt-1">
          {dayjs().format('dddd, MMMM D, YYYY')} — Good {dayjs().hour() < 12 ? 'Morning' : dayjs().hour() < 17 ? 'Afternoon' : 'Evening'}!
        </p>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(n => <div key={n} className="h-24 rounded-3xl bg-white border border-borderColor animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <StatCard title="Total Customers" value={kpi.totalCustomers} icon={Users} color="bg-orange-50 text-orange-600" />
          <StatCard title="Total Bookings" value={kpi.totalBookings} icon={CalendarCheck} color="bg-blue-50 text-blue-600" />
          <StatCard title="Today's Bookings" value={kpi.todayAppointments} icon={Clock} color="bg-emerald-50 text-emerald-600" />
          <StatCard title="Upcoming Bookings" value={kpi.upcomingAppointments} icon={CalendarCheck} color="bg-sky-50 text-sky-600" />
          <StatCard title="Pending" value={kpi.pendingBookings} icon={Clock} color="bg-amber-50 text-amber-600" />
          <StatCard title="Completed" value={kpi.completedBookings} icon={CheckCircle2} color="bg-green-50 text-green-700" />
          <StatCard title="Cancelled" value={kpi.cancelledBookings} icon={XCircle} color="bg-red-50 text-red-650" />
          <StatCard title="Today's Revenue" value={kpi.todayRevenue?.toLocaleString('en-IN')} icon={IndianRupee} color="bg-indigo-50 text-indigo-600" suffix="₹" />
          <StatCard title="Monthly Revenue" value={kpi.monthlyRevenue?.toLocaleString('en-IN')} icon={TrendingUp} color="bg-purple-50 text-purple-600" suffix="₹" />
        </div>
      )}

      {/* Today's Appointments */}
      <div className="luxury-card bg-white p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-borderColor/40 pb-3">
          <h2 className="font-semibold text-textColor">Today's Appointments</h2>
          <span className="text-xs font-bold text-accent bg-secondary border border-accent/20 px-2.5 py-1 rounded-full">
            {todayBookings.length} total
          </span>
        </div>

        {bookingsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : todayBookings.length === 0 ? (
          <p className="text-sm text-textColor/50 text-center py-8">No appointments scheduled for today.</p>
        ) : (
          <div className="space-y-3">
            {todayBookings.map((b) => (
              <div key={b._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-bgColor border border-borderColor/40">
                <div className="text-left space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-textColor">{b.customerName || b.name}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-textColor/60">{b.service?.name}</p>
                  <div className="flex items-center gap-1 text-xs text-accent font-medium">
                    <Clock className="h-3 w-3" />{b.time}
                  </div>
                </div>
                {b.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(b._id, 'confirmed')}
                      className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Confirm
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                      className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </div>
                )}
                {b.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(b._id, 'completed')}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings Table */}
      <div className="luxury-card bg-white p-6 space-y-4">
        <h2 className="font-semibold text-textColor border-b border-borderColor/40 pb-3">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-textColor/50 uppercase tracking-wider border-b border-borderColor/40">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Service</th>
                <th className="pb-3 pr-4">Date & Time</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderColor/20">
              {bookings.slice(0, 10).map((b) => (
                <tr key={b._id} className="hover:bg-bgColor/60 transition-colors">
                  <td className="py-3 pr-4 font-mono text-textColor/50">{b.bookingId}</td>
                  <td className="py-3 pr-4 font-medium text-textColor">{b.customerName || b.name || '—'}</td>
                  <td className="py-3 pr-4 text-textColor/70">{b.service?.name}</td>
                  <td className="py-3 pr-4 text-textColor/70">{b.date} {b.time}</td>
                  <td className="py-3 pr-4 font-bold text-accent">₹{b.amount}</td>
                  <td className="py-3">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <p className="text-sm text-textColor/50 text-center py-6">No bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';
import { Download, TrendingUp, IndianRupee, CalendarCheck, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../services/api';

const AdminReports = () => {
  const dispatch = useDispatch();
  const { kpi, charts, loading } = useSelector((state) => state.admin);

  useEffect(() => { dispatch(fetchDashboardStats()); }, [dispatch]);

  const handleExport = async () => {
    try {
      const response = await apiClient.get('/admin/reports/export');
      // In mock mode the backend returns JSON; trigger download
      const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elena-beauty-report-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Report exported successfully!');
    } catch (err) {
      toast.error('Export failed.');
    }
  };

  const summaryCards = [
    { label: 'Total Revenue (Month)', value: `₹${(kpi.monthlyRevenue ?? 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-green-50 text-green-600' },
    { label: "Today's Revenue", value: `₹${(kpi.todayRevenue ?? 0).toLocaleString('en-IN')}`, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Bookings', value: kpi.totalBookings ?? '—', icon: CalendarCheck, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Customers', value: kpi.totalCustomers ?? '—', icon: Users, color: 'bg-secondary text-accent' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-textColor">Reports</h1>
          <p className="text-xs text-textColor/55 mt-1">Summary of your business performance and booking analytics.</p>
        </div>
        <button onClick={handleExport} className="luxury-btn-accent flex items-center gap-2 text-sm">
          <Download className="h-4 w-4" /> Export Report
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : (
        <>
          {/* Summary KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="luxury-card bg-white p-5 flex items-center gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-semibold text-textColor/50 uppercase tracking-wider">{label}</p>
                  <p className="text-xl font-bold text-textColor mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Bookings Chart (simple bar chart using divs) */}
          {charts?.dailyBookings?.length > 0 && (
            <div className="luxury-card bg-white p-6 space-y-4">
              <h2 className="font-semibold text-textColor text-base">Daily Bookings (Last 7 Days)</h2>
              <div className="flex items-end gap-2 h-40">
                {charts.dailyBookings.map((d, i) => {
                  const max = Math.max(...charts.dailyBookings.map(x => x.bookings), 1);
                  const heightPct = Math.max((d.bookings / max) * 100, 4);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-accent">{d.bookings}</span>
                      <div
                        className="w-full rounded-t-xl bg-primary hover:bg-accent transition-colors cursor-default"
                        style={{ height: `${heightPct}%` }}
                        title={`${d.date || d.label}: ${d.bookings} bookings`}
                      />
                      <span className="text-[9px] text-textColor/40 truncate w-full text-center">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly Revenue table placeholder */}
          <div className="luxury-card bg-white p-6 space-y-4">
            <h2 className="font-semibold text-textColor text-base">Revenue Summary</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-textColor/50 uppercase tracking-wider border-b border-borderColor/40">
                  <th className="pb-3">Period</th>
                  <th className="pb-3">Bookings</th>
                  <th className="pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderColor/20">
                {(charts?.monthlyRevenue ?? []).map((row, i) => (
                  <tr key={i} className="hover:bg-bgColor/50">
                    <td className="py-3 font-medium text-textColor">{row.label}</td>
                    <td className="py-3 text-textColor/70">{row.bookings}</td>
                    <td className="py-3 font-bold text-accent">₹{(row.revenue ?? 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {(!charts?.monthlyRevenue || charts.monthlyRevenue.length === 0) && (
                  <tr><td colSpan={3} className="py-6 text-center text-textColor/40">No monthly data yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReports;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { 
  LayoutDashboard, 
  Scissors, 
  CalendarRange, 
  CheckSquare, 
  Users, 
  FileBarChart, 
  Home, 
  LogOut,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Scissors },
    { name: 'Slots & Calendar', path: '/admin/slots', icon: CalendarRange },
    { name: 'Appointments', path: '/admin/bookings', icon: CheckSquare },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-borderColor bg-white px-4 py-6 text-textColor shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-accent">
          <Sparkles className="h-4 w-4 fill-current" />
        </div>
        <span className="font-serif text-lg font-semibold tracking-wide text-textColor">
          Elena <span className="text-accent font-sans font-light font-medium text-xs border border-accent/20 bg-secondary px-1.5 py-0.5 rounded">Admin</span>
        </span>
      </div>

      {/* Admin details */}
      <div className="px-3 py-2.5 mb-6 rounded-2xl bg-bgColor/50 border border-borderColor/30">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider">Logged In</p>
        <p className="text-sm font-semibold truncate text-textColor">{user?.name || 'Elena Vance'}</p>
        <p className="text-xs text-textColor/60 truncate">{user?.phone}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-secondary text-accent font-semibold shadow-soft' 
                    : 'text-textColor/75 hover:bg-bgColor hover:text-accent'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Action shortcuts */}
      <div className="border-t border-borderColor pt-4 space-y-1.5">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-textColor/75 hover:bg-bgColor hover:text-accent transition-colors"
        >
          <Home className="h-4 w-4 shrink-0" />
          Customer Panel
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-errorColor hover:bg-red-50 transition-colors text-left"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

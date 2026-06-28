import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Sparkles, Calendar, User, Bell, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Book Now', path: '/book', icon: true },
    { name: 'My Bookings', path: '/bookings' },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="sticky top-0 z-50 border-b border-borderColor bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-accent group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-5 w-5 fill-current" />
            </div>
            <span className="font-serif text-xl font-semibold tracking-wide text-textColor">
              Elena <span className="text-accent font-sans font-light">Beauty</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              if (link.icon) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-1.5 bg-primary text-textColor px-5 py-2.5 rounded-full font-medium hover:bg-primary-hover shadow-soft transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Calendar className="h-4 w-4" />
                    {link.name}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-textColor/75 hover:text-accent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Admin quick link if role is admin */}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-xs font-semibold uppercase tracking-wider text-accent border border-accent/20 px-3 py-1 rounded bg-secondary hover:bg-secondary-hover transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* Notifications */}
                <Link to="/notifications" className="relative p-2 text-textColor/75 hover:text-accent transition-colors">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Link */}
                <Link to="/profile" className="p-2 text-textColor/75 hover:text-accent transition-colors">
                  <User className="h-5 w-5" />
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-textColor/75 hover:text-errorColor transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-accent hover:text-accent-hover">
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            {isAuthenticated && (
              <Link to="/notifications" className="relative p-2 text-textColor/75 hover:text-accent">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-textColor/75 hover:text-accent outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-borderColor bg-white px-4 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                  isActive ? 'bg-secondary text-accent font-semibold' : 'text-textColor/80 hover:bg-bgColor'
                }`}
              >
                {link.icon && <Calendar className="h-5 w-5 text-accent" />}
                {link.name}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <div className="border-t border-borderColor pt-3 mt-3 space-y-2">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-accent font-medium rounded-2xl hover:bg-bgColor"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-textColor/80 rounded-2xl hover:bg-bgColor"
              >
                <User className="h-5 w-5 text-accent/50" />
                My Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-errorColor text-left rounded-2xl hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center bg-primary text-textColor py-3 rounded-2xl font-medium"
            >
              Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

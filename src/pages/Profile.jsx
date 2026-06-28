import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, logout } from '../redux/slices/authSlice';
import apiClient from '../services/api';
import { Phone, MapPin, Heart, CreditCard, Settings, HelpCircle, Shield, LogOut, ChevronRight, Pencil, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { TopBar } from '../components/mobile/TopBar';

const items = [
  { icon: Heart, label: "Favorites", value: "0 saved" },
  { icon: CreditCard, label: "Payment methods", value: "None" },
  { icon: MapPin, label: "Addresses", value: "1 added" },
  { icon: Settings, label: "Preferences", value: "" },
  { icon: Shield, label: "Privacy & security", value: "" },
  { icon: HelpCircle, label: "Help & support", value: "" },
];

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      await apiClient.put('/auth/profile', { name, address });
      await dispatch(fetchProfile());
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <TopBar title="Profile" back={false} />
      <div className="px-5 pb-8 space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-secondary to-primary/60 p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-semibold text-accent-foreground uppercase">
                {user?.name ? user.name.charAt(0) : 'G'}
              </div>
              <button 
                onClick={() => setEditMode(!editMode)}
                className="absolute -bottom-1 -right-1 h-8 w-8 grid place-items-center rounded-full bg-surface border border-border shadow-[var(--shadow-card)]"
              >
                <Pencil className="h-3.5 w-3.5 text-accent" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold truncate">{user?.name || 'Guest User'}</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Phone className="h-3 w-3 shrink-0" /> {user?.phone || 'No phone'}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="h-3 w-3 shrink-0" /> {user?.address || 'No address added'}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { l: "Bookings", v: user?.bookingsCount || "0" },
              { l: "Favorites", v: "0" },
              { l: "Reviews", v: "0" },
            ].map((s) => (
              <div key={s.l} className="bg-surface/80 rounded-2xl py-2.5 text-center">
                <p className="text-base font-semibold text-foreground">{s.v}</p>
                <p className="text-[10px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {editMode ? (
           <form onSubmit={handleSubmit} className="rounded-3xl bg-surface border border-border shadow-[var(--shadow-card)] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Edit Information</h3>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full h-12 px-4 rounded-2xl bg-input border border-border text-sm outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Building, City, PIN"
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl bg-input border border-border text-sm outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-medium flex items-center gap-1"
                >
                  {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  Save
                </button>
              </div>
           </form>
        ) : (
          <div className="rounded-3xl bg-surface border border-border shadow-[var(--shadow-card)] overflow-hidden">
            {items.map((it, i) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.label}
                  className={`w-full flex items-center gap-3 px-4 py-4 text-left ${
                    i < items.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className="h-10 w-10 grid place-items-center rounded-2xl bg-secondary text-accent shrink-0">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{it.label}</span>
                  {it.value && (
                    <span className="text-xs text-muted-foreground">{it.value}</span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-surface border border-border text-destructive font-medium text-sm shadow-[var(--shadow-card)]"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>

        <p className="text-center text-[11px] text-muted-foreground pb-4">Lumière Application</p>
      </div>
    </>
  );
};

export default Profile;

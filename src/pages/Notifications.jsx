import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead } from '../redux/slices/notificationsSlice';
import { Bell as BellIcon, Loader2, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TopBar } from '../components/mobile/TopBar';

dayjs.extend(relativeTime);

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markRead(id));
  };

  const handleMarkAllRead = () => {
    notifications
      .filter((n) => !n.isRead)
      .forEach((n) => dispatch(markRead(n._id)));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeStyle = (type) => {
    switch (type) {
      case 'booking_confirmed': return { icon: Calendar, tint: "bg-[#E3F5E6] text-[#2F7A3A]" };
      case 'booking_cancelled': return { icon: AlertCircle, tint: "bg-[#FCE3E3] text-[#B33A3A]" };
      case 'booking_reminder': return { icon: BellIcon, tint: "bg-secondary text-accent" };
      default: return { icon: Sparkles, tint: "bg-surface border text-muted-foreground" };
    }
  };

  const today = notifications.filter(n => dayjs(n.createdAt).isSame(dayjs(), 'day'));
  const yesterday = notifications.filter(n => dayjs(n.createdAt).isSame(dayjs().subtract(1, 'day'), 'day'));
  const earlier = notifications.filter(n => !dayjs(n.createdAt).isSame(dayjs(), 'day') && !dayjs(n.createdAt).isSame(dayjs().subtract(1, 'day'), 'day'));

  const renderGroup = (title, items) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1">
          {title}
        </h3>
        {items.map((n) => {
          const { icon: Icon, tint } = getTypeStyle(n.type);
          return (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              className={`rounded-3xl bg-surface border border-border p-4 shadow-[var(--shadow-card)] flex gap-3 transition-colors ${
                !n.isRead ? "ring-1 ring-primary/40 cursor-pointer" : "opacity-80"
              }`}
            >
              <span className={`h-11 w-11 flex items-center justify-center rounded-2xl shrink-0 ${tint}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold truncate text-foreground">{n.title}</h4>
                  <span className="text-[10px] text-muted-foreground shrink-0">{dayjs(n.createdAt).fromNow()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
              </div>
              {!n.isRead && (
                <span className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <TopBar
        title="Notifications"
        back={false}
        right={
          unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              Mark all
            </button>
          )
        }
      />
      <div className="px-5 pb-8 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl bg-surface border border-border p-6 text-center shadow-[var(--shadow-card)] space-y-3">
            <BellIcon className="h-10 w-10 text-muted-foreground/30 mx-auto animate-pulse" />
            <p className="text-sm text-muted-foreground font-medium">No notifications yet. Check back later!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {renderGroup("Today", today)}
            {renderGroup("Yesterday", yesterday)}
            {renderGroup("Earlier", earlier)}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;

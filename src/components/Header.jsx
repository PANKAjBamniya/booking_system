import { Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ user }) => {
  return (
    <header className="px-5 pt-14 pb-5 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-accent-foreground font-semibold shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Good morning</p>
          <h1 className="text-base font-semibold text-foreground truncate">
            {user?.name || "Guest"} ✨
          </h1>
        </div>
      </div>
      <Link
        to="/notifications"
        className="relative h-11 w-11 flex items-center justify-center rounded-2xl bg-surface border border-border"
      >
        <Bell className="h-5 w-5 text-foreground" />
        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent" />
      </Link>
    </header>
  );
};

export default Header;

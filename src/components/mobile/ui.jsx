export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`w-full h-14 rounded-2xl bg-accent text-accent-foreground font-medium text-[15px] shadow-[var(--shadow-soft)] active:scale-[0.99] transition-transform disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`w-full h-14 rounded-2xl bg-secondary text-foreground font-medium text-[15px] border border-border active:scale-[0.99] transition-transform ${className}`}
    >
      {children}
    </button>
  );
}

export function InputField({ icon, className = "", ...props }) {
  return (
    <div
      className={`flex items-center gap-3 h-14 px-4 rounded-2xl bg-input border border-border focus-within:border-accent transition-colors ${className}`}
    >
      {icon ? (
        <span className="text-muted-foreground shrink-0">{icon}</span>
      ) : null}
      <input
        {...props}
        className="flex-1 bg-transparent outline-none text-[15px] text-foreground placeholder:text-muted-foreground min-w-0"
      />
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Upcoming: "bg-secondary text-accent",
    Pending: "bg-[#FFF3D6] text-[#9A6B00]",
    Completed: "bg-[#E3F5E6] text-[#2F7A3A]",
    Cancelled: "bg-[#FCE3E3] text-[#B33A3A]",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

export function SectionTitle({ title, action }) {
  return (
    <div className="flex items-center justify-between px-5 my-3">
      <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      {action ? (
        <span className="text-xs font-medium text-accent">{action}</span>
      ) : null}
    </div>
  );
}

export function MobileFrame({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#f5ecec] flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen bg-background overflow-hidden shadow-2xl">
        {children}
      </div>
    </div>
  );
}

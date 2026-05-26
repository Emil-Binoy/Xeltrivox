// A reusable component that displays shimmering placeholder boxes
export const SidebarSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="p-3.5 flex items-center gap-3">
          {/* Avatar Box Placeholder */}
          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
          {/* Text Lines Placeholders */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-sm w-1/2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-sm w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChatSkeleton = () => {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {[...Array(4)].map((_, idx) => {
        const isLeft = idx % 2 === 0; // Alternates left/right alignment for realistic chat simulation
        return (
          <div key={idx} className={`flex flex-col ${isLeft ? "items-start" : "items-end"} w-full`}>
            {/* Sender Label Placeholder */}
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-sm w-16 mb-1.5" />
            {/* Bubble Box Placeholder */}
            <div className={`h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl w-2/3 md:w-80 ${isLeft ? "rounded-tl-none" : "rounded-tr-none"}`} />
          </div>
        );
      })}
    </div>
  );
};
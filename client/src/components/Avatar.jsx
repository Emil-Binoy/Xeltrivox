import React from "react";

// Pre-defined modern gradient presets for premium look
export const AVATAR_PRESETS = {
  "gradient-1": {
    name: "Ocean Breeze",
    style: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    bgClass: "from-cyan-400 to-blue-500"
  },
  "gradient-2": {
    name: "Sunset Glow",
    style: "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
    bgClass: "from-orange-400 to-pink-500"
  },
  "gradient-3": {
    name: "Royal Orchid",
    style: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
    bgClass: "from-violet-500 to-fuchsia-500"
  },
  "gradient-4": {
    name: "Emerald Forest",
    style: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    bgClass: "from-emerald-400 to-teal-500"
  },
  "gradient-5": {
    name: "Neon Cyber",
    style: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    bgClass: "from-indigo-500 to-purple-600"
  },
  "gradient-6": {
    name: "Golden Hour",
    style: "linear-gradient(135deg, #eab308 0%, #ef4444 100%)",
    bgClass: "from-yellow-400 to-rose-500"
  },
  "gradient-7": {
    name: "Midnight Sky",
    style: "linear-gradient(135deg, #475569 0%, #7c3aed 100%)",
    bgClass: "from-slate-600 to-violet-600"
  },
  "gradient-8": {
    name: "Electric Coral",
    style: "linear-gradient(135deg, #f43f5e 0%, #f97316 100%)",
    bgClass: "from-rose-500 to-orange-400"
  }
};

// 🔵 The one and only founder of Xeltrivox
const FOUNDER_USERNAME = "emil_binoy";

const Avatar = ({ 
  user, 
  size = "md", 
  isOnline = false, 
  showOnlineStatus = false, 
  onClick,
  className = "" 
}) => {
  const profilePic = user?.profilePic;
  const name = user?.name || "?";
  const initials = name.charAt(0).toUpperCase();
  const isFounder = user?.username === FOUNDER_USERNAME;

  // Determine size classes
  const sizeClasses = {
    sm: "w-8 h-8 text-xs rounded-lg",
    md: "w-10 h-10 text-sm rounded-xl border border-slate-200 dark:border-slate-800",
    lg: "w-16 h-16 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-800",
    xl: "w-24 h-24 text-3xl rounded-3xl border-2 border-slate-200/80 dark:border-slate-700/80"
  }[size] || "w-10 h-10 text-sm rounded-xl";

  const dotSizeClasses = {
    sm: "w-2.5 h-2.5 -bottom-0.5 -right-0.5 border-1.5",
    md: "w-3 h-3 -bottom-0.5 -right-0.5 border-2",
    lg: "w-4 h-4 -bottom-0.5 -right-0.5 border-2.5",
    xl: "w-5 h-5 bottom-0 right-0 border-3"
  }[size] || "w-3 h-3 -bottom-0.5 -right-0.5 border-2";

  // Founder badge sizing per avatar size
  const founderBadgeClasses = {
    sm: "w-3.5 h-3.5 -bottom-0.5 -left-0.5",
    md: "w-4 h-4 -bottom-0.5 -left-0.5",
    lg: "w-5 h-5 -bottom-0.5 -left-0.5",
    xl: "w-7 h-7 bottom-0 left-0"
  }[size] || "w-4 h-4 -bottom-0.5 -left-0.5";

  // Check if profilePic is a preset gradient or custom URL
  const isGradient = profilePic && profilePic.startsWith("gradient-");
  const preset = isGradient ? AVATAR_PRESETS[profilePic] : null;

  const renderContent = () => {
    if (preset) {
      return (
        <div
          style={{ background: preset.style }}
          className={`w-full h-full flex items-center justify-center font-bold text-white shadow-inner select-none ${className}`}
        >
          {initials}
        </div>
      );
    }

    if (profilePic) {
      return (
        <img
          src={profilePic}
          alt={`${name}'s avatar`}
          className={`w-full h-full object-cover select-none ${className}`}
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      );
    }

    // Default fallback gradient if no profilePic set
    return (
      <div
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
        className={`w-full h-full flex items-center justify-center font-bold text-white shadow-inner select-none ${className}`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div 
      onClick={onClick}
      className={`relative shrink-0 flex items-center justify-center overflow-visible cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ${sizeClasses} ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Clip the avatar content to its rounded shape */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {renderContent()}

        {/* Hidden fallback div in case image fails to load */}
        {profilePic && !isGradient && (
          <div
            style={{ 
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              display: "none"
            }}
            className={`w-full h-full absolute inset-0 items-center justify-center font-bold text-white shadow-inner select-none ${className}`}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Online/Offline Badge Indicator Overlay */}
      {showOnlineStatus && (
        <span 
          className={`
            absolute rounded-full border-white dark:border-[#0d1321] shadow-md transition-all duration-300
            ${dotSizeClasses}
            ${isOnline 
              ? "bg-emerald-500 dark:bg-cyan-400 animate-pulse" 
              : "bg-slate-400 dark:bg-slate-600"
            }
          `}
        />
      )}

      {/* 🔵 Founder Verified Badge — Emil Binoy Only */}
      {isFounder && (
        <div
          className={`absolute ${founderBadgeClasses} z-20`}
          title="Xeltrivox Founder"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]"
          >
            {/* Outer badge circle */}
            <circle cx="10" cy="10" r="10" fill="url(#founderGrad)" />
            {/* Inner ring */}
            <circle cx="10" cy="10" r="8.5" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Check mark */}
            <path
              d="M6.5 10.2L8.8 12.5L13.5 7.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="founderGrad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </div>
  );
};

export default Avatar;

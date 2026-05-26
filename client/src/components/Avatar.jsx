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
      className={`relative shrink-0 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ${sizeClasses} ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
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
    </div>
  );
};

export default Avatar;

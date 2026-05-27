import React from "react";
import { FiImage, FiCheck } from "react-icons/fi";
import { AVATAR_PRESETS } from "../Avatar";

const ProfileAvatarEditor = ({ isUrlMode, setIsUrlMode, profilePic, setProfilePic, loading }) => {
  const handleSelectGradient = (presetKey) => {
    setProfilePic(presetKey);
    setIsUrlMode(false);
  };

  const handleCustomUrlChange = (e) => {
    setProfilePic(e.target.value);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          Avatar Style
        </label>
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setIsUrlMode(false);
              setProfilePic("gradient-1");
            }}
            className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${!isUrlMode ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-cyan-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
          >
            Gradients
          </button>
          <button
            type="button"
            onClick={() => {
              setIsUrlMode(true);
              setProfilePic("");
            }}
            className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${isUrlMode ? "bg-white dark:bg-slate-800 shadow-sm text-indigo-600 dark:text-cyan-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
          >
            Custom URL
          </button>
        </div>
      </div>

      {!isUrlMode ? (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 p-1">
          {Object.keys(AVATAR_PRESETS).map((key) => {
            const preset = AVATAR_PRESETS[key];
            const isSelected = profilePic === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectGradient(key)}
                style={{ background: preset.style }}
                className={`w-full aspect-square rounded-xl cursor-pointer relative hover:scale-110 active:scale-95 transition-all shadow-md group ${isSelected ? "ring-2 ring-indigo-500 dark:ring-cyan-400 ring-offset-2 dark:ring-offset-[#0d1321]" : ""}`}
                title={preset.name}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                    <FiCheck className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-cyan-500/50 dark:focus-within:border-cyan-400/50 transition-all duration-300">
            <span className="pl-4 text-slate-500">
              <FiImage className="w-4 h-4" />
            </span>
            <input
              type="url"
              value={profilePic.startsWith("gradient-") ? "" : profilePic}
              onChange={handleCustomUrlChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm py-3 px-3 focus:outline-none"
              disabled={loading}
            />
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 block px-1">
            💡 Paste any direct image URL (Unsplash, Imgur, etc.) to set custom picture.
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfileAvatarEditor;

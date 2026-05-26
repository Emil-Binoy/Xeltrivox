import React, { useState, useEffect } from "react";
import { FiX, FiUser, FiInfo, FiImage, FiSettings, FiCheck } from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";
import Avatar, { AVATAR_PRESETS } from "./Avatar";

const ProfileModal = ({ isOpen, onClose, currentUser, onProfileUpdated }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [status, setStatus] = useState("Available");
  const [customStatus, setCustomStatus] = useState("");
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusPresets = [
    { label: "Available", color: "bg-emerald-500", text: "Available" },
    { label: "Busy", color: "bg-red-500", text: "Busy" },
    { label: "Away", color: "bg-amber-500", text: "Away" },
    { label: "Do Not Disturb", color: "bg-purple-500", text: "Do Not Disturb" }
  ];

  // Set fields when currentUser is loaded/changed
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setUsername(currentUser.username || "");
      setProfilePic(currentUser.profilePic || "gradient-1");
      
      const currentStatus = currentUser.status || "Available";
      const matchedPreset = statusPresets.find(p => p.label === currentStatus);
      if (matchedPreset) {
        setStatus(currentStatus);
        setCustomStatus("");
      } else {
        setStatus("Custom");
        setCustomStatus(currentStatus);
      }

      // Detect mode of avatar picture
      if (currentUser.profilePic && !currentUser.profilePic.startsWith("gradient-")) {
        setIsUrlMode(true);
      } else {
        setIsUrlMode(false);
      }
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, "");
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return;
    }

    const finalStatus = status === "Custom" ? customStatus.trim() || "Available" : status;
    const finalProfilePic = profilePic;

    setLoading(true);
    const savePromise = api.put("/users/profile", {
      name: name.trim(),
      username: cleanUsername,
      profilePic: finalProfilePic,
      status: finalStatus
    });

    toast.promise(
      savePromise,
      {
        loading: "Updating profile data...",
        success: (response) => {
          setLoading(false);
          if (onProfileUpdated) {
            onProfileUpdated(response.data);
          }
          onClose();
          return "Profile updated successfully!";
        },
        error: (err) => {
          setLoading(false);
          return err.response?.data?.message || "Failed to update profile";
        }
      },
      {
        style: {
          background: "#0d1321",
          color: "#cbd5e1",
          border: "1px solid #1e293b",
        },
        success: { iconTheme: { primary: "#06b6d4", secondary: "#0d1321" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#0d1321" } },
      }
    );
  };

  const handleSelectGradient = (presetKey) => {
    setProfilePic(presetKey);
    setIsUrlMode(false);
  };

  const handleCustomUrlChange = (e) => {
    setProfilePic(e.target.value);
  };

  // Helper object for preview rendering
  const previewUser = {
    name: name || "User",
    profilePic: profilePic,
    status: status === "Custom" ? customStatus || "Available" : status
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-white dark:bg-[#0d1321] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <FiSettings className="w-5 h-5 text-indigo-500 dark:text-cyan-400" />
            <h2 className="text-base font-semibold text-slate-800 dark:text-white tracking-wide">
              Customize Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Live Preview Header Card */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/60 dark:to-slate-900/20 border border-slate-100 dark:border-slate-800/30 flex items-center gap-4">
            <Avatar user={previewUser} size="lg" />
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-cyan-400 uppercase">
                LIVE INTERACTIVE PREVIEW
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">
                {name || "Your Name"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                @{cleanUsername(username) || "username"}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">
                <span className={`w-2 h-2 rounded-full ${
                  previewUser.status === "Busy" ? "bg-red-500" :
                  previewUser.status === "Away" ? "bg-amber-500" :
                  previewUser.status === "Do Not Disturb" ? "bg-purple-500" :
                  "bg-emerald-500"
                }`} />
                <span>{previewUser.status}</span>
              </div>
            </div>
          </div>

          {/* Form Fields: Name & Username */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-1">
                Full Name
              </label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-cyan-500/50 dark:focus-within:border-cyan-400/50 transition-all duration-300">
                <span className="pl-4 text-slate-500">
                  <FiUser className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., John Doe"
                  maxLength={40}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm py-3 px-3 focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-1">
                Username
              </label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-cyan-500/50 dark:focus-within:border-cyan-400/50 transition-all duration-300">
                <span className="pl-4 text-slate-500 text-sm font-semibold">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                  placeholder="username"
                  maxLength={25}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm py-3 px-2 focus:outline-none"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          {/* Profile Picture / Avatar Editor */}
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

            {/* Gradient Selector Matrix */}
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
              /* Custom Avatar Image URL Input */
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

          {/* Status Selection / Bio Editor */}
          <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800/30 pt-5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-1">
              Active Status & Bio
            </label>

            {/* Status Presets Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {statusPresets.map((preset) => {
                const isSelected = status === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setStatus(preset.label);
                      setCustomStatus("");
                    }}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-medium text-xs transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-slate-50 dark:bg-slate-900 border-indigo-500/40 dark:border-cyan-500/40 text-slate-800 dark:text-white"
                        : "bg-transparent border-slate-200 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${preset.color} shrink-0`} />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Status Input toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                <FiInfo className="w-3.5 h-3.5" />
                <span>Custom Status Text (Bio)</span>
              </div>
              
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus-within:border-cyan-500/50 dark:focus-within:border-cyan-400/50 transition-all duration-300">
                <input
                  type="text"
                  value={status === "Custom" ? customStatus : customStatus}
                  onChange={(e) => {
                    setStatus("Custom");
                    setCustomStatus(e.target.value);
                  }}
                  placeholder="Set custom status bio (e.g. In a meeting, Busy coding)"
                  maxLength={50}
                  className="w-full bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm py-3 px-4 focus:outline-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

        </form>

        {/* Modal Footer Buttons */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xs flex items-center justify-end gap-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium text-xs shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// Simple utility function helper to clean up display username
const cleanUsername = (str) => {
  return str.toLowerCase().trim().replace(/\s+/g, "");
};

export default ProfileModal;

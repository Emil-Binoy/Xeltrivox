import React from "react";
import { FiX, FiSettings } from "react-icons/fi";
import { useProfileForm } from "../hooks/useProfileForm";
import ProfilePreview from "./ProfileModal/ProfilePreview";
import ProfileFormFields from "./ProfileModal/ProfileFormFields";
import ProfileAvatarEditor from "./ProfileModal/ProfileAvatarEditor";
import ProfileStatusEditor from "./ProfileModal/ProfileStatusEditor";

const ProfileModal = ({ isOpen, onClose, currentUser, onProfileUpdated }) => {
  const {
    name, setName,
    username, setUsername,
    profilePic, setProfilePic,
    status, setStatus,
    customStatus, setCustomStatus,
    isUrlMode, setIsUrlMode,
    loading,
    handleSubmit,
    previewUser
  } = useProfileForm(currentUser, isOpen, onProfileUpdated, onClose);

  if (!isOpen) return null;

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
          
          <ProfilePreview 
            previewUser={previewUser} 
            name={name} 
            username={username} 
          />

          <ProfileFormFields 
            name={name} 
            setName={setName} 
            username={username} 
            setUsername={setUsername} 
            loading={loading} 
          />

          <ProfileAvatarEditor 
            isUrlMode={isUrlMode} 
            setIsUrlMode={setIsUrlMode} 
            profilePic={profilePic} 
            setProfilePic={setProfilePic} 
            loading={loading} 
          />

          <ProfileStatusEditor 
            status={status} 
            setStatus={setStatus} 
            customStatus={customStatus} 
            setCustomStatus={setCustomStatus} 
            loading={loading} 
          />

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

export default ProfileModal;

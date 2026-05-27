import React from "react";
import { FiSettings, FiLogOut } from "react-icons/fi";
import Avatar from "../Avatar";

const SidebarFooter = ({ currentUser, setIsProfileModalOpen, handleLogout }) => {
  return (
    <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <Avatar user={currentUser} size="md" />
        <div className="min-w-0">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
            {currentUser?.name || "Loading..."}
          </h3>
          <div className="flex items-center gap-1 min-w-0">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              currentUser?.status === "Busy" ? "bg-red-500" :
              currentUser?.status === "Away" ? "bg-amber-500" :
              currentUser?.status === "Do Not Disturb" ? "bg-purple-500" :
              "bg-emerald-500"
            }`} />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate leading-none pt-0.5">
              {currentUser?.status || "Available"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 cursor-pointer focus:outline-none transition-all"
          title="Edit Profile"
        >
          <FiSettings className="w-3.5 h-3.5" />
        </button>
        
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer focus:outline-none transition-all"
          title="Log Out"
        >
          <FiLogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SidebarFooter;

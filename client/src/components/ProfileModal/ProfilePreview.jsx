import React from "react";
import Avatar from "../Avatar";
import { cleanUsername } from "../../constants/profileConstants";

const ProfilePreview = ({ previewUser, name, username }) => {
  return (
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
  );
};

export default ProfilePreview;

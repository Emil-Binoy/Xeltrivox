import React from "react";
import { FiUser } from "react-icons/fi";

const ProfileFormFields = ({ name, setName, username, setUsername, loading }) => {
  return (
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
  );
};

export default ProfileFormFields;

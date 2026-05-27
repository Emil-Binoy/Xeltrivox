import React from "react";
import { FiInfo } from "react-icons/fi";
import { statusPresets } from "../../constants/profileConstants";

const ProfileStatusEditor = ({ status, setStatus, customStatus, setCustomStatus, loading }) => {
  return (
    <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800/30 pt-5">
      <label className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase px-1">
        Active Status & Bio
      </label>

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
  );
};

export default ProfileStatusEditor;

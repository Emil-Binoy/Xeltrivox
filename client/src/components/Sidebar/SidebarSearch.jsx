import React from "react";
import { FiUsers, FiSearch } from "react-icons/fi";

const SidebarSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <>
      <div className="px-6 pt-6 pb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
        <FiUsers className="text-indigo-500 dark:text-cyan-400" />
        <span>Active Channels</span>
      </div>

      <div className="px-4 pb-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl py-2 pl-10 pr-3 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-500 transition-colors text-sm shadow-sm"
          />
        </div>
      </div>
    </>
  );
};

export default SidebarSearch;

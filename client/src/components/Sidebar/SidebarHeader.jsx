import React from "react";
import { FiSun, FiMoon, FiX } from "react-icons/fi";
import xeltrivox from "../../assets/Xeltrivox.png"

const SidebarHeader = ({ theme, setTheme, setIsMobileOpen }) => {
  return (
    <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-3">
      <div className="flex items-center ">
        <div className="">
          <img 
            src={xeltrivox} 
            alt="XELTRIVOX Mini Logo" 
            className="w-full h-8 object-contain"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-cyan-400 cursor-pointer focus:outline-none hover:scale-105 transition-transform"
          title="Toggle Theme"
        >
          {theme === "dark" ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-cyan-400 focus:outline-none cursor-pointer shrink-0 hover:scale-105 transition-transform"
          title="Close Sidebar"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;

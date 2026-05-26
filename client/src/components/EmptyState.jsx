import React from "react";
import { FiMenu } from "react-icons/fi";
import logo from "../assets/logo.png";

const EmptyState = ({ setIsMobileOpen }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8 text-center">
      <div className="md:hidden absolute top-0 inset-x-0 p-5 bg-white dark:bg-[#0d1321]/40 border-b border-slate-200 dark:border-slate-800/60 flex items-center">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-cyan-400 cursor-pointer"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold ml-3 text-slate-700 dark:text-slate-300 tracking-wider">
          XELTRIVOX CORE
        </span>
      </div>

      <div className="relative flex flex-col items-center max-w-sm">
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/20 to-transparent blur-xl rounded-full opacity-70 group-hover:opacity-100 transition-opacity" />
          <img
            src={logo}
            alt="XELTRIVOX Secure Terminal Emblem"
            className="w-70 h-auto object-contain relative z-10 select-none animate-bounce-slow"
            style={{ animationDuration: "6s" }}
          />
        </div>

        <p className="text-md text-slate-500 dark:text-slate-400/80 mt-3 leading-relaxed">
          Say hello! 👋 Start a new chat today.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
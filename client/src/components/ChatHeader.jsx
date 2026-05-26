import React from "react";
import { FiMenu } from "react-icons/fi";

const ChatHeader = ({ selectedConversation, isSelectedUserOnline, setIsMobileOpen }) => {
  return (
    <div className="p-5 bg-white dark:bg-[#0d1321]/40 border-b border-slate-200 dark:border-slate-800/60 backdrop-blur-md flex items-center gap-3 relative z-10">
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-cyan-400 focus:outline-none cursor-pointer shrink-0"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      <div
        className={`w-2 h-2 rounded-full shadow-lg transition-all duration-300 shrink-0 ${
          isSelectedUserOnline
            ? "bg-emerald-500 dark:bg-cyan-400 shadow-emerald-400/50 dark:shadow-cyan-400/50 animate-ping"
            : "bg-slate-400 dark:bg-slate-600 shadow-transparent"
        }`}
      />
      <div>
        <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block">
          {isSelectedUserOnline ? "Active Stream // Online" : "Disconnected // Offline"}
        </span>
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white tracking-wide">
          {selectedConversation.selectedUser?.name || "User"}
        </h2>
      </div>
    </div>
  );
};

export default ChatHeader;
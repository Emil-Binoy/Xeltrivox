import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FiMenu, FiX, FiInfo } from "react-icons/fi";
import Avatar from "./Avatar";

const ChatHeader = ({ selectedConversation, isSelectedUserOnline, setIsMobileOpen, typingUsers = [] }) => {
  const user = selectedConversation?.selectedUser;
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  let typingText = "";
  if (typingUsers.length === 1) {
    typingText = `${typingUsers[0]} is typing...`;
  } else if (typingUsers.length === 2) {
    typingText = `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
  } else if (typingUsers.length > 2) {
    typingText = `${typingUsers[0]}, ${typingUsers[1]} and ${typingUsers.length - 2} other(s) are typing...`;
  }

  return (
    <div className="p-5 bg-white dark:bg-[#0d1321]/40 border-b border-slate-200 dark:border-slate-800/60 backdrop-blur-md flex items-center justify-between relative z-10">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-cyan-400 focus:outline-none cursor-pointer shrink-0"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <Avatar 
          user={user} 
          size="md" 
          isOnline={isSelectedUserOnline} 
          showOnlineStatus={true} 
          onClick={() => setIsDetailOpen(true)}
        />

        <div className="min-w-0 cursor-pointer" onClick={() => setIsDetailOpen(true)}>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block leading-none mb-1">
            {isSelectedUserOnline ? "Active Stream // Online" : "Disconnected // Offline"}
          </span>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white tracking-wide truncate">
            {user?.name || "User"}
          </h2>
          {typingText ? (
            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold truncate leading-none mt-0.5 animate-pulse">
              {typingText}
            </p>
          ) : user?.status ? (
            <p className="text-[10px] text-indigo-500 dark:text-cyan-400/80 font-medium truncate leading-none mt-0.5">
              {user.status}
            </p>
          ) : null}
        </div>
      </div>

      {/* Read-Only Details Trigger Button */}
      <button
        onClick={() => setIsDetailOpen(true)}
        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-cyan-400 cursor-pointer focus:outline-none transition-all shrink-0"
        title="View User Details"
      >
        <FiInfo className="w-4 h-4" />
      </button>

      {/* Beautiful read-only details modal/drawer overlay */}
      {isDetailOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#0d1321] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scaleIn relative">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/40">
              <span className="text-[10px] font-bold tracking-widest text-indigo-500 dark:text-cyan-400 uppercase">
                User Details
              </span>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 transition-all cursor-pointer z-10 relative"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center text-center space-y-4 relative z-10">
              <Avatar user={user} size="xl" isOnline={isSelectedUserOnline} showOnlineStatus={true} />
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {user?.name}
                </h3>
                <p className="text-sm text-indigo-500 dark:text-cyan-400 font-semibold">
                  @{user?.username}
                </p>
              </div>

              <div className="w-full border-t border-slate-100 dark:border-slate-800/60 pt-4 flex flex-col items-center space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className={`w-2 h-2 rounded-full ${isSelectedUserOnline ? "bg-emerald-500 dark:bg-cyan-400 animate-pulse" : "bg-slate-400"}`} />
                  <span className="font-semibold">{isSelectedUserOnline ? "Online Now" : "Offline"}</span>
                </div>

                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/30 rounded-xl max-w-full">
                  <span className="text-[9px] font-bold tracking-widest text-slate-400 block mb-0.5 uppercase">
                    Bio / Status
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 italic font-medium break-words">
                    "{user?.status || "Available"}"
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-850 flex justify-center relative z-10">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all cursor-pointer relative z-20"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ChatHeader;
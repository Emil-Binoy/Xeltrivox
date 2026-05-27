import React from "react";
import Avatar from "../Avatar";
import { SidebarSkeleton } from "../Skeleton";

const SidebarUserList = ({ 
  users, 
  isLoading, 
  onlineUsers, 
  unreadCounts, 
  activeUserId, 
  handleUserClick 
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
      {isLoading ? (
        <SidebarSkeleton />
      ) : (
        users.map((user) => {
          const isUserOnline = onlineUsers.includes(user.id);
          const unreadCount = unreadCounts[user.id] || 0;

          return (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`group relative p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-3 overflow-hidden ${
                activeUserId === user.id
                  ? "border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40"
                  : "border-transparent bg-transparent hover:bg-slate-50/60 dark:hover:bg-slate-900/20"
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-cyan-400 to-indigo-500 transition-all duration-300 ${
                  activeUserId === user.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              />

              <Avatar user={user} size="md" isOnline={isUserOnline} showOnlineStatus={true} />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                  @{user.username}
                </h3>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-semibold text-indigo-500/80 dark:text-cyan-400/70 lowercase truncate max-w-[80px] shrink-0">
                    {user.name}
                  </span>
                  {isUserOnline ? (
                    <span className="text-[9px] text-emerald-500 dark:text-emerald-400 font-medium truncate flex items-center gap-1 min-w-0">
                      <span className="truncate">Online</span>
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium truncate flex items-center gap-1 min-w-0">
                      <span className="truncate">
                        {user.lastSeen 
                          ? `Last seen ${new Date(user.lastSeen).toLocaleDateString() === new Date().toLocaleDateString() ? 'today' : new Date(user.lastSeen).toLocaleDateString()} at ${new Date(user.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : (user.status && user.status !== "Available" ? user.status : "Offline")}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {unreadCount > 0 && (
                <div className="shrink-0 min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white bg-indigo-600 dark:bg-cyan-500 shadow-sm shadow-indigo-500/20 dark:shadow-cyan-400/20 animate-bounce">
                  {unreadCount}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SidebarUserList;

import { useEffect, useState } from "react";
import api from "../services/api";
import { FiUsers, FiLayers, FiSun, FiMoon } from "react-icons/fi";
import socket from "../socket";

function Sidebar({ setSelectedConversation, isMobileOpen, setIsMobileOpen }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Manage Dark/Light theme state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const handleUserClick = async (user) => {
    try {
      const { data } = await api.post("/chat", {
        userId: user.id,
      });
      setSelectedConversation({ ...data, selectedUser: user });
      if (setIsMobileOpen) setIsMobileOpen(false); // Auto-close sidebar panel drawer on mobile selection
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`
        w-full md:w-80 h-full fixed md:static inset-y-0 left-0 z-40
        bg-white dark:bg-[#0d1321]/60 border-r border-slate-200 dark:border-slate-800/60 
        backdrop-blur-xl flex flex-col transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-tr from-cyan-500 to-indigo-600 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
            <FiLayers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide text-slate-800 dark:text-transparent dark:bg-linear-to-r dark:from-white dark:via-slate-200 dark:to-slate-400 dark:bg-clip-text">
              CORE_CHAT
            </h1>
            <p className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-cyan-400/80">
              v2.0 // DEPLOYED
            </p>
          </div>
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-cyan-400 cursor-pointer focus:outline-none hover:scale-105 transition-transform"
        >
          {theme === "dark" ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>
      </div>

      {/* Title */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
        <FiUsers className="text-indigo-500 dark:text-cyan-400" />
        <span>Active Channels</span>
      </div>

      {/* User Directory */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
        {users.map((user) => {
          // 🔥 FIXED: Check if this specific mapping user loop exists in the active state array
          const isUserOnline = onlineUsers.includes(user.id);

          return (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="group relative p-3.5 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800/80 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all duration-300 cursor-pointer flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-cyan-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />

              {/* Avatar Frame Container */}
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-linear-to-br dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 group-hover:border-cyan-500/30 transition-all">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                
                {/* 🔥 FIXED STATUS INDICATOR PIN: Renders green/cyan pulse glow badge if user evaluates online */}
                {isUserOnline && (
                  <span className="animate-pulse absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 dark:bg-cyan-400 border-2 border-white dark:border-[#0d1321] shadow-xs" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-slate-700 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400/70 truncate group-hover:text-slate-600 transition-colors">
                  {user.email}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
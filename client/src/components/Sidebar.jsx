import { useEffect, useState } from "react";
import api from "../services/api";
import { FiUsers, FiSun, FiMoon, FiSettings, FiLogOut } from "react-icons/fi";
import socket from "../socket";
import { SidebarSkeleton } from "./Skeleton";
import xeltrivox from "../assets/Xeltrivox.png";
import Avatar from "./Avatar";
import ProfileModal from "./ProfileModal";
import toast from "react-hot-toast";

function Sidebar({ setSelectedConversation, isMobileOpen, setIsMobileOpen }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeUserId, setActiveUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  // Load owns profile data
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setCurrentUser(data);
      } catch (error) {
        console.log("Error loading profile:", error);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    const handleProfileUpdate = (updatedUser) => {
      // Sync own profile changes
      if (updatedUser.id === localStorage.getItem("userId")) {
        setCurrentUser(updatedUser);
      }
      // Sync other users profile changes
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
      );
      // Sync currently selected partner
      if (activeUserId === updatedUser.id) {
        setSelectedConversation((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            selectedUser: {
              ...prev.selectedUser,
              ...updatedUser
            }
          };
        });
      }
    };

    socket.on("userProfileUpdated", handleProfileUpdate);

    const handleLiveMessage = (message) => {
      const senderId = message.senderId;

      if (senderId !== activeUserId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }

      setUsers((prevUsers) => {
        const targetUser = prevUsers.find((u) => u.id === senderId);
        if (!targetUser) return prevUsers;

        const remainingUsers = prevUsers.filter((u) => u.id !== senderId);
        return [targetUser, ...remainingUsers];
      });
    };

    socket.on("receiveMessage", handleLiveMessage);

    return () => {
      socket.off("onlineUsers");
      socket.off("userProfileUpdated", handleProfileUpdate);
      socket.off("receiveMessage", handleLiveMessage);
    };
  }, [activeUserId]);

  const handleUserClick = async (user) => {
    try {
      const { data } = await api.post("/chat", {
        userId: user.id,
      });

      setSelectedConversation({ ...data, selectedUser: user });
      setActiveUserId(user.id);

      setUnreadCounts((prev) => ({
        ...prev,
        [user.id]: 0,
      }));

      setUsers((prevUsers) => {
        const targetUser = prevUsers.find((u) => u.id === user.id);
        if (!targetUser) return prevUsers;
        const remainingUsers = prevUsers.filter((u) => u.id !== user.id);
        return [targetUser, ...remainingUsers];
      });

      if (setIsMobileOpen) setIsMobileOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to establish chat stream");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out of Xeltrivox?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
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
        <div className="flex items-center ">
          {/* 🔥 BRANDED BRAND ICON CHANGE */}
          <div className="">
            <img 
              src={xeltrivox} 
              alt="XELTRIVOX Mini Logo" 
              className="w-full h-8 object-contain"
            />
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
                    {user.status && user.status !== "Available" && (
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium truncate flex items-center gap-1 min-w-0">
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                        <span className="truncate">{user.status}</span>
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

      {/* Current User Footnote Section */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar user={currentUser} size="md" />
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
              {currentUser?.name || "Loading..."}
            </h3>
            <div className="flex items-center gap-1 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                currentUser?.status === "Busy" ? "bg-red-500" :
                currentUser?.status === "Away" ? "bg-amber-500" :
                currentUser?.status === "Do Not Disturb" ? "bg-purple-500" :
                "bg-emerald-500"
              }`} />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate leading-none pt-0.5">
                {currentUser?.status || "Available"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 cursor-pointer focus:outline-none transition-all"
            title="Edit Profile"
          >
            <FiSettings className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 dark:bg-slate-900 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer focus:outline-none transition-all"
            title="Log Out"
          >
            <FiLogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render the profile editing modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(updated) => {
          setCurrentUser(updated);
          // Auto update in sidebar channels list too
          setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u));
        }}
      />
    </div>
  );
}

export default Sidebar;
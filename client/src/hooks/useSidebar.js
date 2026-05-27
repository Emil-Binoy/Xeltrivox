import { useState, useEffect } from "react";
import api from "../services/api";
import socket from "../socket";
import toast from "react-hot-toast";

export const useSidebar = (setSelectedConversation, setIsMobileOpen) => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [activeUserId, setActiveUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    const getCurrentUser = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setCurrentUser(data);
        localStorage.setItem("currentUserName", data.name);
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
        const { data } = await api.get(searchQuery.trim() ? `/users?search=${encodeURIComponent(searchQuery)}` : "/users");
        setUsers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const delayDebounceFn = setTimeout(() => {
      getUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    const handleProfileUpdate = (updatedUser) => {
      if (updatedUser.id === localStorage.getItem("userId")) {
        setCurrentUser(updatedUser);
      }
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
      );
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
  }, [activeUserId, setSelectedConversation]);

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

  return {
    users, setUsers,
    onlineUsers,
    unreadCounts,
    activeUserId,
    isLoading,
    currentUser, setCurrentUser,
    isProfileModalOpen, setIsProfileModalOpen,
    searchQuery, setSearchQuery,
    theme, setTheme,
    handleUserClick,
    handleLogout
  };
};

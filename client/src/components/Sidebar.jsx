import React from "react";
import ProfileModal from "./ProfileModal";
import { useSidebar } from "../hooks/useSidebar";
import SidebarHeader from "./Sidebar/SidebarHeader";
import SidebarSearch from "./Sidebar/SidebarSearch";
import SidebarUserList from "./Sidebar/SidebarUserList";
import SidebarFooter from "./Sidebar/SidebarFooter";

function Sidebar({ setSelectedConversation, isMobileOpen, setIsMobileOpen }) {
  const {
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
  } = useSidebar(setSelectedConversation, setIsMobileOpen);

  return (
    <div
      className={`
        w-full md:w-80 h-full fixed md:static inset-y-0 left-0 z-40
        bg-white dark:bg-[#0d1321]/60 border-r border-slate-200 dark:border-slate-800/60 
        backdrop-blur-xl flex flex-col transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <SidebarHeader theme={theme} setTheme={setTheme} />

      <SidebarSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <SidebarUserList 
        users={users} 
        isLoading={isLoading} 
        onlineUsers={onlineUsers} 
        unreadCounts={unreadCounts} 
        activeUserId={activeUserId} 
        handleUserClick={handleUserClick} 
      />

      <SidebarFooter 
        currentUser={currentUser} 
        setIsProfileModalOpen={setIsProfileModalOpen} 
        handleLogout={handleLogout} 
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(updated) => {
          setCurrentUser(updated);
          setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u));
        }}
      />
    </div>
  );
}

export default Sidebar;
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import socket from "../socket";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Prioritize sidebar list directory display index layout on initial phone load-in
  const [isMobileOpen, setIsMobileOpen] = useState(true);

  // Core socket registration tracking link handshake stream
  useEffect(() => {
    const currentUserId = localStorage.getItem("userId");
    
    if (currentUserId) {
      socket.emit("join", currentUserId);
      console.log("Transmitted terminal authentication join signal for:", currentUserId);
    }
  }, []);

  return (
    <div className="w-screen h-screen flex bg-slate-100 dark:bg-[#070a12] text-slate-900 dark:text-white overflow-hidden relative">
      
      {/* 1. Sidebar Panel Grid Section */}
      <Sidebar 
        setSelectedConversation={setSelectedConversation} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Mobile backdrop shade overlay mask layer — closes drawer layout cleanly on tap click */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity duration-300"
        />
      )}

      {/* 2. Main Window Target Text Box Viewport */}
      {/* 🔥 FIXED: Explicitly passing down both parameters so the menu button tracks cleanly */}
      <ChatBox 
        selectedConversation={selectedConversation} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
    </div>
  );
};

export default Chat;
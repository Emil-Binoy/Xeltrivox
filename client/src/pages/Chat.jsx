import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Responsive sidebar display toggle state tracker variable
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="w-screen h-screen flex bg-slate-100 dark:bg-[#070a12] text-slate-900 dark:text-white overflow-hidden relative">
      
      {/* 1. Sidebar Panel Grid Section with Mobile Overlay Drawer attributes */}
      <Sidebar 
        setSelectedConversation={setSelectedConversation} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Mobile backdrop drawer dark shade layout layer mask block click closer anchor */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-30 transition-opacity duration-300"
        />
      )}

      {/* 2. Main Window Target Text Box Logger viewport frame */}
      <ChatBox 
        selectedConversation={selectedConversation} 
        setIsMobileOpen={setIsMobileOpen}
      />
    </div>
  );
};

export default Chat;
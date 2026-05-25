import React from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import socket from "../socket";

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      socket.emit("join", userId);
    }

    socket.on("receiveMessage", (message) => {
      console.log("new message:", message);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-linear-to-br from-[#0b0f19] via-[#111827] to-[#070a12] text-slate-100 font-sans antialiased selection:bg-cyan-500/30">
      <Sidebar setSelectedConversation={setSelectedConversation} />
      <ChatBox selectedConversation={selectedConversation} />
    </div>
  );
};

export default Chat;

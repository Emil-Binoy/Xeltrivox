import { useEffect, useState, useRef } from "react"; // Added useRef here
import socket from "../socket";
import api from "../services/api";
import MessageInput from "./MessageInput";
import { FiCpu } from "react-icons/fi";

const ChatBox = ({ selectedConversation }) => {
  const [messages, setMessages] = useState([]);
  
  // Create a reference pointer for the bottom of the chat container
  const messagesEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  // Helper function to handle the smooth scrolling movement
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Fetch old messages when active conversation shifts
  useEffect(() => {
    if (!selectedConversation) return;

    setMessages([]);

    const getMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${selectedConversation.id}`);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [selectedConversation]);

  // 2. Real-time live synchronization stream listener
  useEffect(() => {
    if (!selectedConversation) return;

    const handleIncomingMessage = (message) => {
      if (message.conversationId === selectedConversation.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receiveMessage", handleIncomingMessage);

    return () => {
      socket.off("receiveMessage", handleIncomingMessage);
    };
  }, [selectedConversation]);

  // 3. Trigger scroll anchor every single time the messages array values change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 h-full flex flex-col bg-[#070a12]/30 relative">
      {/* Futuristic Grid Accent overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

      {!selectedConversation ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8 text-center animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-4 text-cyan-400 shadow-xl shadow-cyan-500/5">
            <FiCpu className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-slate-300 tracking-wide">
            Awaiting Terminal Link
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            Select a user from the terminal matrix sidebar to open up a messaging stream channel.
          </p>
        </div>
      ) : (
        <>
          {/* Top Panel Bar */}
          <div className="p-5 bg-[#0d1321]/40 border-b border-slate-800/60 backdrop-blur-md flex items-center gap-3 relative z-10">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-ping" />
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block">
                Active Stream
              </span>
              <h2 className="text-sm font-semibold text-white tracking-wide">
                {selectedConversation.selectedUser?.name || "User"}
              </h2>
              <p className="text-xs text-slate-500">
                {selectedConversation.selectedUser?.email || ""}
              </p>
            </div>
          </div>

          {/* Chat log feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3 relative z-10 custom-scrollbar">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId || msg.sender?.id === currentUserId;

              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full`}
                >
                  {/* Message Header Name block */}
                  <span className="text-[10px] font-bold tracking-wider text-slate-500 mb-1 px-1.5 uppercase">
                    {isMe ? "You" : msg.sender?.name || "User"}
                  </span>
                  
                  {/* Dynamic Message Bubble Container styles */}
                  <div 
                    className={`max-w-md p-3.5 rounded-2xl text-slate-200 text-sm leading-relaxed shadow-md shadow-black/40 border transition-all duration-300 ${
                      isMe 
                        ? "bg-linear-to-br from-cyan-600 to-indigo-600 border-cyan-500/30 rounded-tr-none ml-auto" 
                        : "bg-slate-900/80 border-slate-800 rounded-tl-none mr-auto"
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.createdAt && (
                      <p className={`text-[10px] mt-1 ${isMe ? "text-cyan-200/60" : "text-slate-500"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Invisible anchor div at the very bottom of the list array map loop */}
            <div ref={messagesEndRef} />
          </div>
        </>
      )}

      <div className="relative z-10">
        <MessageInput selectedConversation={selectedConversation} />
      </div>
    </div>
  );
};

export default ChatBox;
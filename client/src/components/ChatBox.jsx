import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import api from "../services/api";
import MessageInput from "./MessageInput";
import { FiCpu, FiTrash2, FiMoreVertical, FiMenu } from "react-icons/fi"; // 🔥 FIXED: Re-imported FiMenu icon
import toast from "react-hot-toast";

const ChatBox = ({ selectedConversation, setIsMobileOpen }) => { // 🔥 FIXED: Accepts state properties safely
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");
  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedConversation) return;

    setMessages([]);
    setActiveMenuMessageId(null);

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

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    const handleIncomingMessage = (message) => {
      if (
        selectedConversation &&
        message.conversationId === selectedConversation.id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleDeletedMessage = (data) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
    };

    socket.on("receiveMessage", handleIncomingMessage);
    socket.on("messageDeleted", handleDeletedMessage);

    return () => {
      socket.off("onlineUsers");
      socket.off("receiveMessage", handleIncomingMessage);
      socket.off("messageDeleted", handleDeletedMessage);
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    const confirmUnsend = window.confirm("Are you sure you want to unsend this message?");
    if (!confirmUnsend) return;

    try {
      await api.delete(`/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      socket.emit("deleteMessage", {
        messageId,
        receiverId: selectedConversation.selectedUser.id,
      });

      toast.success("Message unsent");
      setActiveMenuMessageId(null);
    } catch (error) {
      console.log(error);
      toast.error("Could not unsend message");
    }
  };

  const isSelectedUserOnline = selectedConversation?.selectedUser?.id
    ? onlineUsers.includes(selectedConversation.selectedUser.id)
    : false;

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50 dark:bg-[#070a12]/30 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

      {!selectedConversation ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8 text-center animate-pulse">
          
          {/* 🔥 FIXED: Restored mobile top-bar header wrapper for onboarding/landing states */}
          <div className="md:hidden absolute top-0 inset-x-0 p-5 bg-white dark:bg-[#0d1321]/40 border-b border-slate-200 dark:border-slate-800/60 flex items-center">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-cyan-400 cursor-pointer"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold ml-3 text-slate-700 dark:text-slate-300">Open Channels</span>
          </div>
          
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-4 text-indigo-600 dark:text-cyan-400 shadow-xl">
            <FiCpu className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 tracking-wide">
            Awaiting Terminal Link
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            Open the sidebar channel directory panel array to map an active live messaging sync channel.
          </p>
        </div>
      ) : (
        <>
          {/* Top Panel Bar */}
          <div className="p-5 bg-white dark:bg-[#0d1321]/40 border-b border-slate-200 dark:border-slate-800/60 backdrop-blur-md flex items-center gap-3 relative z-10">
            
            {/* 🔥 FIXED: Restored the responsive hamburger menu trigger button right here */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-cyan-400 focus:outline-none cursor-pointer shrink-0"
            >
              <FiMenu className="w-5 h-5" />
            </button>

            <div
              className={`w-2 h-2 rounded-full shadow-lg transition-all duration-300 shrink-0 ${
                isSelectedUserOnline
                  ? "bg-emerald-500 dark:bg-cyan-400 shadow-emerald-400/50 dark:shadow-cyan-400/50 animate-ping"
                  : "bg-slate-400 dark:bg-slate-600 shadow-transparent"
              }`}
            />
            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block">
                {isSelectedUserOnline ? "Active Stream // Online" : "Disconnected // Offline"}
              </span>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white tracking-wide">
                {selectedConversation.selectedUser?.name || "User"}
              </h2>
            </div>
          </div>

          {/* Chat log feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 relative z-10 custom-scrollbar">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId || msg.sender?.id === currentUserId;
              const isMenuOpen = activeMenuMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full group/msg`}
                >
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1.5 uppercase">
                    {isMe ? "You" : msg.sender?.name || "User"}
                  </span>

                  <div className={`flex items-center gap-1.5 max-w-[85%] md:max-w-md ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs border transition-all duration-300 select-none ${
                        isMe
                          ? "bg-linear-to-br from-indigo-600 to-indigo-700 dark:from-cyan-600 dark:to-indigo-600 border-indigo-500/20 dark:border-cyan-500/30 text-white rounded-tr-none"
                          : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.createdAt && (
                        <p className={`text-[10px] mt-1 ${isMe ? "text-indigo-200/60 dark:text-cyan-200/60" : "text-slate-400 dark:text-slate-500"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>

                    {isMe && (
                      <div className="flex items-center gap-1 relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveMenuMessageId(isMenuOpen ? null : msg.id)}
                          className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 transition-all cursor-pointer focus:outline-none ${
                            isMenuOpen ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover/msg:opacity-100"
                          }`}
                        >
                          <FiMoreVertical className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          className={`p-2 text-red-500 dark:text-red-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm transition-all duration-200 cursor-pointer focus:outline-none shrink-0 ${
                            isMenuOpen 
                              ? "flex scale-100 opacity-100" 
                              : "hidden md:flex md:scale-90 md:opacity-0 md:group-hover/msg:scale-100 md:group-hover/msg:opacity-100"
                          }`}
                          title="Unsend Message"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white dark:bg-transparent border-t border-slate-200 dark:border-transparent relative z-10">
            <MessageInput selectedConversation={selectedConversation} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import api from "../services/api";
import MessageInput from "./MessageInput";
import { ChatSkeleton } from "./Skeleton";
import { FiMoreVertical, FiMenu, FiCheck, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";

const ChatBox = ({ selectedConversation, setIsMobileOpen }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");
  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedConversation) return;

    setMessages([]);
    setActiveMenuMessageId(null);

    const getMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const { data } = await api.get(`/messages/${selectedConversation.id}`);
        setMessages(data);
        socket.emit("markAsRead", {
          conversationId: selectedConversation.id,
          senderId: selectedConversation.selectedUser.id,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingMessages(false);
      }
    };
    getMessages();
  }, [selectedConversation]);

  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    const handleMessagesRead = (data) => {
      if (
        selectedConversation &&
        data.conversationId === selectedConversation.id
      ) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.status !== "READ" ? { ...msg, status: "READ" } : msg,
          ),
        );
      }
    };
    socket.on("messagesRead", handleMessagesRead);

    const handleIncomingMessage = (message) => {
      if (
        selectedConversation &&
        message.conversationId === selectedConversation.id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("receiveMessage", handleIncomingMessage);

    const handleDeletedMessage = (data) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
    };
    socket.on("messageDeleted", handleDeletedMessage);

    return () => {
      socket.off("onlineUsers");
      socket.off("messagesRead", handleMessagesRead);
      socket.off("receiveMessage", handleIncomingMessage);
      socket.off("messageDeleted", handleDeletedMessage);
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    const confirmUnsend = window.confirm(
      "Are you sure you want to unsend this message?",
    );
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
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-8 text-center">
          <div className="md:hidden absolute top-0 inset-x-0 p-5 bg-white dark:bg-[#0d1321]/40 border-b border-slate-200 dark:border-slate-800/60 flex items-center">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-cyan-400 cursor-pointer"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            {/* 🔥 HEADER BRAND NAME */}
            <span className="text-sm font-semibold ml-3 text-slate-700 dark:text-slate-300 tracking-wider">
              XELTRIVOX CORE
            </span>
          </div>

          {/* 🔥 PREMIUM BRANDED EMPTY STATE LANDING VIEW */}
          <div className="relative flex flex-col items-center max-w-sm">
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-radial-gradient from-cyan-500/20 to-transparent blur-xl rounded-full opacity-70 group-hover:opacity-100 transition-opacity" />
              <img
                src={logo}
                alt="XELTRIVOX Secure Terminal Emblem"
                className="w-70 h-auto object-contain relative z-10 select-none animate-bounce-slow"
                style={{ animationDuration: "6s" }}
              />
            </div>

            <p className="text-md text-slate-500 dark:text-slate-400/80 mt-3 leading-relaxed">
              Say hello! 👋 Start a new chat today.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Top Panel Bar */}
          <div className="p-5 bg-white dark:bg-[#0d1321]/40 border-b border-slate-200 dark:border-slate-800/60 backdrop-blur-md flex items-center gap-3 relative z-10">
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
                {isSelectedUserOnline
                  ? "Active Stream // Online"
                  : "Disconnected // Offline"}
              </span>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white tracking-wide">
                {selectedConversation.selectedUser?.name || "User"}
              </h2>
            </div>
          </div>

          {/* Chat log feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 relative z-10 custom-scrollbar">
            {isLoadingMessages ? (
              <ChatSkeleton />
            ) : (
              /* ✨ FIXED: Removed duplicate nested messages loop from your snippet */
              messages.map((msg) => {
                const isMe =
                  msg.senderId === currentUserId ||
                  msg.sender?.id === currentUserId;
                const isMenuOpen = activeMenuMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full group/msg`}
                  >
                    {/* Sender Name Label */}
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1.5 uppercase">
                      {isMe ? "You" : msg.sender?.name || "User"}
                    </span>

                    {/* Main Row Stack */}
                    <div
                      className={`flex items-center gap-3 max-w-[95%] md:max-w-xl ${isMe ? "flex-row justify-end" : "flex-row"}`}
                    >
                      {/* 1. Action Buttons for INCOMING messages (Shows on the left of their bubble) */}
                      {!isMe && (
                        <div className="flex items-center gap-1 relative shrink-0">
                          {/* Put any incoming message action buttons here if needed in the future */}
                        </div>
                      )}

                      {/* 2. The Message Bubble Card */}
                      <div
                        className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs border transition-all duration-300 select-none ${
                          isMe
                            ? "bg-linear-to-br from-indigo-600 to-indigo-700 dark:from-cyan-600 dark:to-indigo-600 border-indigo-500/20 dark:border-cyan-500/30 text-white rounded-tr-none"
                            : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                        }`}
                      >
                        <p>{msg.text}</p>

                        <div className="flex items-center justify-end gap-1 mt-1">
                          {msg.createdAt && (
                            <p
                              className={`text-[10px] ${isMe ? "text-indigo-200/60 dark:text-cyan-200/60" : "text-slate-400 dark:text-slate-500"}`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}

                          {isMe && (
                            <div className="flex items-center ml-1">
                              {msg.status === "READ" ? (
                                <div className="flex -space-x-1.5 text-cyan-400 dark:text-cyan-300">
                                  <FiCheck className="w-3.5 h-3.5" />
                                  <FiCheck className="w-3.5 h-3.5" />
                                </div>
                              ) : msg.status === "DELIVERED" ||
                                isSelectedUserOnline ? (
                                <div className="flex -space-x-1.5 text-slate-400 dark:text-slate-500">
                                  <FiCheck className="w-3.5 h-3.5" />
                                  <FiCheck className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <FiCheck className="w-3.5 h-3.5 text-slate-400/60 dark:text-slate-500/40" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 3. 🔥 Action Buttons for OUTGOING messages (Always stays on the right side of your message) */}
                      {/* 🔥 Action Buttons for OUTGOING messages */}
                      {isMe && (
                        <div className="flex items-center gap-1.5 relative shrink-0 flex-row">
                          {/* Delete / Unsend Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            /* 🔥 FIXED BELOW: Stripped out group-hover/msg states. 
        It now uses a clean scale/opacity toggle tied strictly to 'isMenuOpen' 
      */
                            className={`p-2 text-red-500 dark:text-red-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm transition-all duration-200 cursor-pointer focus:outline-none shrink-0 ${
                              isMenuOpen
                                ? "flex scale-100 opacity-100"
                                : "hidden scale-90 opacity-0 pointer-events-none"
                            }`}
                            title="Unsend Message"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 3-Dot Options Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuMessageId(isMenuOpen ? null : msg.id)
                            }
                            className="text-slate-400 dark:text-slate-500 transition-all cursor-pointer focus:outline-none"
                          >
                            <FiMoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

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

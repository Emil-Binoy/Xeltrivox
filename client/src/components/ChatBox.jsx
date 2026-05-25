import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import api from "../services/api";
import MessageInput from "./MessageInput";
import { FiCpu, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const ChatBox = ({ selectedConversation }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

    // ADDED: Remember to catch the deleted signal if your backend sends it
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
    } catch (error) {
      console.log(error);
      toast.error("Could not unsend message");
    }
  };

  const isSelectedUserOnline = selectedConversation?.selectedUser?.id
    ? onlineUsers.includes(selectedConversation.selectedUser.id)
    : false;

  return (
    <div className="flex-1 h-full flex flex-col bg-[#070a12]/30 relative">
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
            Select a user from the terminal matrix sidebar to open up a
            messaging stream channel.
          </p>
        </div>
      ) : (
        <>
          {/* Top Panel Bar */}
          <div className="p-5 bg-[#0d1321]/40 border-b border-slate-800/60 backdrop-blur-md flex items-center gap-3 relative z-10">
            <div
              className={`w-2 h-2 rounded-full shadow-lg transition-all duration-300 ${
                isSelectedUserOnline
                  ? "bg-cyan-400 shadow-cyan-400/50 animate-ping"
                  : "bg-slate-600 shadow-transparent"
              }`}
            />

            <div>
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block">
                {isSelectedUserOnline
                  ? "Active Stream // Online"
                  : "Disconnected // Offline"}
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
              const isMe =
                msg.senderId === currentUserId ||
                msg.sender?.id === currentUserId;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full group/msg`}
                >
                  {/* Message Header Name block */}
                  <span className="text-[10px] font-bold tracking-wider text-slate-500 mb-1 px-1.5 uppercase">
                    {isMe ? "You" : msg.sender?.name || "User"}
                  </span>

                  {/* FIXED: Added a row wrapper to structure the bubble and trash icon side-by-side */}
                  <div className={`flex items-center gap-2 max-w-md ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    
                    {/* Dynamic Message Bubble Container styles */}
                    <div
                      className={`p-3.5 rounded-2xl text-slate-200 text-sm leading-relaxed shadow-md shadow-black/40 border transition-all duration-300 ${
                        isMe
                          ? "bg-linear-to-br from-cyan-600 to-indigo-600 border-cyan-500/30 rounded-tr-none"
                          : "bg-slate-900/80 border-slate-800 rounded-tl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.createdAt && (
                        <p className={`text-[10px] mt-1 ${isMe ? "text-cyan-200/60" : "text-slate-500"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>

                    {/* FIXED: The trash icon is now perfectly aligned inside the hover group */}
                    {isMe && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="opacity-0 group-hover/msg:opacity-100 p-2 text-slate-500 hover:text-red-400 bg-slate-900/60 border border-slate-800 rounded-lg backdrop-blur-md transition-all duration-200 cursor-pointer focus:outline-none shrink-0"
                        title="Unsend Message"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
          
          <div className="relative z-10">
            <MessageInput selectedConversation={selectedConversation} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
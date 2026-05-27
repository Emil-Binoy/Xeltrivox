import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import api from "../services/api";
import MessageInput from "./MessageInput";
import { ChatSkeleton } from "./Skeleton";
import ChatHeader from "./ChatHeader";
import EmptyState from "./EmptyState";
import MessageItem from "./MessageItem";
import toast from "react-hot-toast";

const ChatBox = ({ selectedConversation, setIsMobileOpen }) => {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");
  const [activeMenuMessageId, setActiveMenuMessageId] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [typingUsersMap, setTypingUsersMap] = useState({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedConversation) return;

    setMessages([]);
    setActiveMenuMessageId(null);
    setReplyingTo(null);

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
    socket.on("onlineUsers", (users) => setOnlineUsers(users));

    const handleMessagesRead = (data) => {
      if (selectedConversation && data.conversationId === selectedConversation.id) {
        setMessages((prev) =>
          prev.map((msg) => (msg.status !== "READ" ? { ...msg, status: "READ" } : msg))
        );
      }
    };
    socket.on("messagesRead", handleMessagesRead);

    const handleIncomingMessage = (message) => {
      if (selectedConversation && message.conversationId === selectedConversation.id) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("receiveMessage", handleIncomingMessage);

    const handleDeletedMessage = (data) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
    };
    socket.on("messageDeleted", handleDeletedMessage);

    const handleTyping = ({ conversationId, senderName }) => {
      setTypingUsersMap((prev) => {
        const users = prev[conversationId] || [];
        if (!users.includes(senderName)) {
          return { ...prev, [conversationId]: [...users, senderName] };
        }
        return prev;
      });
    };
    socket.on("typing", handleTyping);

    const handleStopTyping = ({ conversationId, senderName }) => {
      setTypingUsersMap((prev) => {
        const users = prev[conversationId] || [];
        return { ...prev, [conversationId]: users.filter((name) => name !== senderName) };
      });
    };
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("onlineUsers");
      socket.off("messagesRead", handleMessagesRead);
      socket.off("receiveMessage", handleIncomingMessage);
      socket.off("messageDeleted", handleDeletedMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
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
        <EmptyState setIsMobileOpen={setIsMobileOpen} />
      ) : (
        <>
          <ChatHeader 
            selectedConversation={selectedConversation} 
            isSelectedUserOnline={isSelectedUserOnline} 
            setIsMobileOpen={setIsMobileOpen} 
            typingUsers={typingUsersMap[selectedConversation?.id] || []}
          />

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative z-10 custom-scrollbar">
            {isLoadingMessages ? (
              <ChatSkeleton />
            ) : (
              messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  msg={msg}
                  currentUserId={currentUserId}
                  isMenuOpen={activeMenuMessageId === msg.id}
                  setActiveMenuMessageId={setActiveMenuMessageId}
                  handleDeleteMessage={handleDeleteMessage}
                  isSelectedUserOnline={isSelectedUserOnline}
                  setReplyingTo={setReplyingTo}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white dark:bg-transparent border-t border-slate-200 dark:border-transparent relative z-10">
            <MessageInput 
              selectedConversation={selectedConversation} 
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
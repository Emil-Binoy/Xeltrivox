import { useState, useRef, useEffect } from "react";
import api from "../services/api";
import { FiSend, FiLoader, FiSmile, FiX } from "react-icons/fi";
import socket from "../socket";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ selectedConversation, replyingTo, setReplyingTo }) => {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    setText(e.target.value);
    
    if (selectedConversation) {
      socket.emit("typing", {
        conversationId: selectedConversation.id,
        senderName: localStorage.getItem("currentUserName") || "User",
        receiverId: selectedConversation.selectedUser.id
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", {
          conversationId: selectedConversation.id,
          senderName: localStorage.getItem("currentUserName") || "User",
          receiverId: selectedConversation.selectedUser.id
        });
      }, 2000);
    }
  };

  // Close the emoji picker when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedConversation || isSending) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stopTyping", {
      conversationId: selectedConversation.id,
      senderName: localStorage.getItem("currentUserName") || "User",
      receiverId: selectedConversation.selectedUser.id
    });

    try {
      setIsSending(true);
      const { data } = await api.post("/messages", { 
        conversationId: selectedConversation.id, 
        text,
        replyToId: replyingTo?.id || null
      });
      
      socket.emit("sendMessage", {
        ...data,
        receiverId: selectedConversation.selectedUser.id
      });
      
      setText("");
      setShowEmojiPicker(false);
      if (setReplyingTo) setReplyingTo(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative w-full" ref={pickerRef}>
      
      {/* FLOATING EMOJI PICKER WINDOW */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-3 z-50 shadow-2xl animate-fade-in">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            theme="auto" // Automatically matches system dark/light modes
            width={320}
            height={400}
          />
        </div>
      )}

      {/* REPLY PREVIEW BANNER */}
      {replyingTo && (
        <div className="mb-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-3 border-l-4 border-indigo-500 dark:border-cyan-500 flex items-center justify-between shadow-sm animate-fade-in relative overflow-hidden">
          <div className="flex flex-col truncate pr-4">
            <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 mb-0.5">
              Replying to {replyingTo.senderId === localStorage.getItem("userId") ? "yourself" : replyingTo.sender?.name || "User"}
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-300 truncate italic">
              {replyingTo.text}
            </span>
          </div>
          <button 
            type="button"
            onClick={() => setReplyingTo(null)}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors focus:outline-none"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Row Container */}
      <form onSubmit={sendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 shadow-inner focus-within:border-indigo-500 dark:focus-within:border-cyan-500 transition-colors">
          
          {/* Emoji Toggle Action Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 dark:hover:text-cyan-400 cursor-pointer transition-colors focus:outline-none shrink-0 ${
              showEmojiPicker ? "text-indigo-500 dark:text-cyan-400" : ""
            }`}
          >
            <FiSmile className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={text}
            onChange={handleTyping}
            disabled={isSending}
            placeholder="Type a message..."
            className="w-full p-3.5 bg-transparent text-sm focus:outline-none text-slate-800 dark:text-slate-100 disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className="p-3.5 bg-indigo-600 dark:bg-cyan-500 text-white rounded-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:scale-100 shrink-0"
        >
          {isSending ? (
            <FiLoader className="w-5 h-5 animate-spin" />
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
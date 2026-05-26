import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiTrash2, FiMoreVertical, FiCornerUpLeft } from "react-icons/fi";

const MessageItem = ({ 
  msg, 
  currentUserId, 
  isMenuOpen, 
  setActiveMenuMessageId, 
  handleDeleteMessage, 
  isSelectedUserOnline,
  setReplyingTo 
}) => {
  const isMe = msg.senderId === currentUserId || msg.sender?.id === currentUserId;

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full group/msg`}>
      
      {/* Embedded Quotation Reply Meta Track Header */}
      {msg.replyTo && (
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1 px-2 border-l-2 border-indigo-500/40 dark:border-cyan-500/40 max-w-xs truncate">
          <FiCornerUpLeft className="w-3 h-3 shrink-0" />
          <span>Replying to: </span>
          <span className="font-medium italic">"{msg.replyTo.text}"</span>
        </div>
      )}

      {/* Sender Profile Handle Label */}
      <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1.5 uppercase">
        {isMe ? "You" : msg.sender?.name || "User"}
      </span>

      {/* Interlocking Grid Flow Wrapper Row */}
      <div className="flex items-center gap-3 max-w-[95%] md:max-w-xl flex-row relative">
        
        {/* DRAGGABLE MESSAGE WRAPPER SHIELD */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: isMe ? 0 : 70 }}
          dragElastic={{ left: 0, right: 0.25 }}
          onDragEnd={(event, info) => {
            if (info.offset.x > 45) {
              setReplyingTo(msg);
            }
          }}
          className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-xs border transition-all duration-300 select-none cursor-grab active:cursor-grabbing relative ${
            isMe
              ? "bg-linear-to-br from-indigo-600 to-indigo-700 dark:from-cyan-600 dark:to-indigo-600 border-indigo-500/20 dark:border-cyan-500/30 text-white rounded-tr-none"
              : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
          }`}
        >
          {/* Active Gesture Pulse Signal Arrow */}
          {!isMe && (
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-active/msg:opacity-100 transition-opacity text-cyan-400 pointer-events-none">
              <FiCornerUpLeft className="w-4 h-4 animate-pulse" />
            </div>
          )}

          {/* Embedded Visual WhatsApp Quoted Reply Block */}
          {msg.replyTo && (
            <div 
              className={`mb-2 p-2 rounded-lg text-xs flex flex-col gap-0.5 border-l-4 border-solid max-w-full truncate ${
                isMe 
                  ? "bg-black/15 border-white/40 text-indigo-100" 
                  : "bg-slate-100 dark:bg-slate-950 border-indigo-600 dark:border-cyan-400 text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className={`font-bold tracking-wide uppercase text-[10px] ${isMe ? "text-cyan-200" : "text-indigo-600 dark:text-cyan-400"}`}>
                {msg.replyTo.senderId === currentUserId ? "You" : msg.replyTo.sender?.name || "User"}
              </span>
              <p className="truncate italic">{msg.replyTo.text}</p>
            </div>
          )}

          <p className="relative z-10">{msg.text}</p>

          {/* Message Receipt Metadata Footer */}
          <div className="flex items-center justify-end gap-1 mt-1.5 opacity-80">
            {msg.createdAt && (
              <p className={`text-[10px] ${isMe ? "text-indigo-200/60 dark:text-cyan-200/60" : "text-slate-400 dark:text-slate-500"}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}

            {isMe && (
              <div className="flex items-center ml-1">
                {msg.status === "READ" ? (
                  <div className="flex -space-x-1.5 text-cyan-400 dark:text-cyan-300">
                    <FiCheck className="w-3.5 h-3.5" /><FiCheck className="w-3.5 h-3.5" />
                  </div>
                ) : msg.status === "DELIVERED" || isSelectedUserOnline ? (
                  <div className="flex -space-x-1.5 text-slate-400 dark:text-slate-500">
                    <FiCheck className="w-3.5 h-3.5" /><FiCheck className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <FiCheck className="w-3.5 h-3.5 text-slate-400/60 dark:text-slate-500/40" />
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Option Settings Trays */}
        {isMe && (
          <div className="flex items-center gap-1.5 relative shrink-0 flex-row">
            <button
              type="button"
              onClick={() => handleDeleteMessage(msg.id)}
              className={`p-2 text-red-500 dark:text-red-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm transition-all duration-200 cursor-pointer focus:outline-none shrink-0 ${
                isMenuOpen ? "flex scale-100 opacity-100" : "hidden scale-90 opacity-0 pointer-events-none"
              }`}
              title="Unsend Message"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveMenuMessageId(isMenuOpen ? null : msg.id)}
              className="text-slate-400 dark:text-slate-500" 
            >
              <FiMoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
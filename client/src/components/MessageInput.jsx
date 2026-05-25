import { useState } from "react";
import api from "../services/api";
import { FiSend, FiLoader } from "react-icons/fi";

const MessageInput = ({ selectedConversation }) => {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedConversation) return;

    try {
      setIsSending(true);
      await api.post("/messages", {
        conversationId: selectedConversation.id,
        text,
      });
      setText("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 bg-transparent dark:bg-linear-to-t dark:from-[#070a12]/90 dark:to-transparent border-t border-slate-200 dark:border-slate-800/40 backdrop-blur-md">
      <form
        onSubmit={sendMessage}
        className="max-w-4xl mx-auto flex items-center gap-2 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 focus-within:border-indigo-500/50 dark:focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.1)] dark:focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isSending
              ? "Transmitting interface signal data..."
              : "Type a message or transmit signal..."
          }
          className="bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm py-2 px-3 flex-1 focus:outline-none disabled:opacity-50"
          disabled={isSending} 
        />

        <button
          type="submit"
          disabled={!text.trim() || isSending} 
          className="bg-linear-to-r from-indigo-600 to-indigo-700 dark:from-cyan-500 dark:to-indigo-600 disabled:bg-slate-100 disabled:from-transparent disabled:to-transparent dark:disabled:from-slate-800 dark:disabled:to-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 p-2.5 rounded-lg shadow-sm active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          {isSending ? (
            <FiLoader className="w-4 h-4 animate-spin text-indigo-500 dark:text-cyan-400" />
          ) : (
            <FiSend className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

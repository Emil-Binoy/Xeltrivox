import { useState } from "react";
import api from "../services/api";
import { FiSend } from "react-icons/fi";

const MessageInput = ({ selectedConversation }) => {
  const [text, setText] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() || !selectedConversation) return;

    try {
      await api.post("/messages", { conversationId: selectedConversation.id, text });
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div className="p-4 bg-linear-to-t from-[#070a12]/80 to-transparent border-t border-slate-800/40 backdrop-blur-md">
      <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          
          placeholder="Transmit interface signal message..."
          className="bg-transparent text-slate-200 placeholder-slate-500 text-sm py-2 px-3 flex-1 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-linear-to-r from-cyan-500 to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 text-white disabled:text-slate-600 p-2.5 rounded-lg shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-95 transition-all duration-200 flex items-center justify-center"
        >
          <FiSend className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
import { useEffect, useState } from "react";
import api from "../services/api";
import { FiUsers, FiLayers } from "react-icons/fi";
import socket from "../socket"

function Sidebar({ setSelectedConversation }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  useEffect(()=>{
    socket.on("onlineUsers",(users)=>{
      setOnlineUsers(users)
    })
    return()=>{
      socket.off("onlineUsers")
    }
  },[])

  const handleUserClick = async (user) => {
    try {
      const { data } = await api.post("/chat", {
        userId: user.id,
      });
      setSelectedConversation({ ...data, selectedUser: user });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-80 h-full bg-[#0d1321]/60 border-r border-slate-800/60 backdrop-blur-xl flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
        <div className="p-2.5 bg-linear-to-tr from-cyan-500 to-indigo-600 rounded-xl shadow-lg shadow-cyan-500/20 text-white">
          <FiLayers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            CORE_CHAT
          </h1>
          <p className="text-xs font-semibold tracking-wider text-cyan-400/80">
            v2.0 // DEPLOYED
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase">
        <FiUsers className="text-cyan-400" />
        <span>Active Channels</span>
      </div>

      {/* User Directory */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user)}
            className="group relative p-3.5 rounded-xl border border-transparent hover:border-slate-800/80 bg-slate-900/0 hover:bg-slate-900/40 transition-all duration-300 cursor-pointer flex items-center gap-3 overflow-hidden"
          >
            {/* Ambient hover glow line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-cyan-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />

            {/* Mini Avatar */}
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-slate-800 to-slate-700 flex items-center justify-center font-bold text-slate-300 border border-slate-700/50 group-hover:border-cyan-500/30 transition-all">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                  {user.name}
                </h3>
                {
                  onlineUsers.includes(user.id) &&
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"></div>
                }
              </div>
              <p className="text-xs text-slate-400/70 truncate group-hover:text-slate-400 transition-colors">
                {user.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;

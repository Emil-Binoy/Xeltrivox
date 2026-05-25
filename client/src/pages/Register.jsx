import React, { useState } from "react";
import {
  FiLock,
  FiMail,
  FiUser,
  FiEye,
  FiEyeOff,
  FiUserPlus,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast"; // Imported toast system

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Track submittal state

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);

    const registerPromise = api.post("auth/register", {
      name,
      username,
      email,
      password,
    });

    toast.promise(
      registerPromise,
      {
        loading: "Deploying profile onto server...",
        success: (response) => {
          const { data } = response;
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user.id);
          navigate("/chat");
          return "Account successfully created!.";
        },
        error: (err) => {
          setLoading(false);
          return (
            err.response?.data?.message ||
            "Registration failed. Please check entry fields."
          );
        },
      },
      {
        style: {
          background: "#0d1321",
          color: "#cbd5e1",
          border: "1px solid #1e293b",
        },
        success: { iconTheme: { primary: "#6366f1", secondary: "#0d1321" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#0d1321" } },
      },
    );
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-[#0b0f19] via-[#111827] to-[#070a12] text-slate-100 font-sans antialiased p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0d1321]/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-black/50 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-wider bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-xs font-semibold tracking-widest text-indigo-400 mt-1">
            JOIN US AND START CHATTING
          </p>
        </div>

        <form onSubmit={register} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-1">
              Full Name
            </label>
            <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-xl focus-within:border-indigo-500/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300">
              <span className="pl-4 text-slate-500">
                <FiUser className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-transparent text-slate-200 placeholder-slate-600 text-sm py-3 px-3 focus:outline-none"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-1">
              Unique Username (User ID)
            </label>
            <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-xl focus-within:border-indigo-500/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300">
              <span className="pl-4 text-slate-500 text-sm font-semibold">
                @
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.replace(/\s+/g, ""))
                } // Prevents spaces in handles
                placeholder="username"
                className="w-full bg-transparent text-slate-200 placeholder-slate-600 text-sm py-3 px-2 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-1">
              Email Address
            </label>
            <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-xl focus-within:border-indigo-500/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300">
              <span className="pl-4 text-slate-500">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-slate-200 placeholder-slate-600 text-sm py-3 px-3 focus:outline-none"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-1">
              Password
            </label>
            <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-xl focus-within:border-indigo-500/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all duration-300">
              <span className="pl-4 text-slate-500">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-slate-200 placeholder-slate-600 text-sm py-3 pl-3 pr-10 focus:outline-none"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-linear-to-r from-indigo-500 to-cyan-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-medium text-sm py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <FiUserPlus className="w-4 h-4" />
            <span>{loading ? "Deploying Core..." : "Sign Up"}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:underline font-semibold tracking-wide bg-transparent border-none cursor-pointer focus:outline-none"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

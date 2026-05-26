import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Xeltrivox from "../assets/Xeltrivox.png"

const XeltrivoxLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  // Smooth loading simulation (4-6 seconds)
  useEffect(() => {
    const duration = 4500; // 4.5 seconds
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onLoadingComplete) onLoadingComplete();
          }, 600); // Small delay for the final powered flash effect
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-[#030712] overflow-hidden flex flex-col items-center justify-center select-none z-50">
      {/* 1. FUTURISTIC BACKGROUND GRID & LIGHT SPECK ATMOSPHERE */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Floating Background Dust / Ambience */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/20 dark:bg-purple-500/20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 2. CORE LOGO & ENERGY STACK CONTAINER */}
      <div className="relative flex flex-col items-center justify-center p-12">
        
        {/* Holographic Communication Waves (Spreading Outward) */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`wave-${i}`}
            className="absolute rounded-full border border-cyan-500/30 dark:border-purple-500/30"
            style={{
              width: "160px",
              height: "160px",
            }}
            animate={{
              scale: [1, 2.8 + i * 0.4],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear",
            }}
          />
        ))}

        {/* Rotating Segmented Cyber Ring */}
        <motion.div
          className="absolute w-52 h-52 rounded-full border-2 border-dashed border-cyan-400/30 dark:border-purple-400/20 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Counter-Rotating Inner Ring */}
        <motion.div
          className="absolute w-44 h-44 rounded-full border border-dotted border-indigo-400/40 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />

        {/* Orbiting Digital Signal Particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
            animate={{
              rotate: 360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              transformOrigin: `${80 + i * 10}px center`,
              left: "50%",
              top: "50%",
              marginLeft: "-3px",
              marginTop: "-3px",
            }}
          />
        ))}

        {/* 3. CENTER LOGO CONTEXT WITH AMBIENT FLOATING & BREATHING EFFECTS */}
        <motion.div
          className="relative z-10 filter"
          animate={{
            y: [-6, 6, -6],
            scale: [0.98, 1.02, 0.98],
            filter: [
              "drop-shadow(0 0 20px rgba(6, 182, 212, 0.15))",
              "drop-shadow(0 0 35px rgba(168, 85, 247, 0.3))",
              "drop-shadow(0 0 20px rgba(6, 182, 212, 0.15))",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Replace src with your actual transparent file location path if needed */}
          <img
            src={Xeltrivox}
            alt="XELTRIVOX Logo"
            className="w-72 md:w-80 h-auto select-none pointer-events-none"
          />
        </motion.div>
      </div>

      {/* 4. FUTURISTIC TYPOGRAPHY AND PROGRESS INTERFACE TRAYS */}
      <div className="mt-6 flex flex-col items-center justify-center w-64 md:w-80 relative z-20">
        
        {/* Glowing Terminal Sub-text status indicators */}
        <motion.div
          className="text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] text-cyan-400/80 dark:text-purple-400/80 uppercase mb-3 flex items-center gap-2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>INITIALIZING XELTRIVOX...</span>
          <span className="font-sans text-xs">{Math.round(progress)}%</span>
        </motion.div>

        {/* Progress Tracker Loading Bar Frame Wrapper */}
        <div className="w-full h-1 bg-slate-900 border border-slate-800/60 rounded-full relative overflow-hidden shadow-inner">
          
          {/* Filled Core Stream Progress Bar Indicator */}
          <motion.div
            className="h-full bg-linear-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />

          {/* High-speed Laser Scanner Pulse Layer */}
          <motion.div
            className="absolute inset-y-0 w-12 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"
            animate={{ left: ["-20%", "120%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Ambient Secondary Metrics Text Footer Display */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono text-slate-500 tracking-wider mt-2 px-0.5">
          <span>SYS_LINK: ACTIVE</span>
          <span>SECURE // Handshake v2.0</span>
        </div>
      </div>

      {/* 5. FINISHING POWER-UP IMMERSIVE FLASH DECORATOR OVERLAY */}
      <AnimatePresence>
        {progress >= 99 && (
          <motion.div
            className="absolute inset-0 bg-white z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default XeltrivoxLoader;
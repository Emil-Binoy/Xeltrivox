import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const XeltrivoxLoader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isTextAssembled, setIsTextAssembled] = useState(false);

  // FAST CINEMATIC TIMELINE: Balanced to sync perfectly with the fast letter drop
  useEffect(() => {
    const progressTimeline = [
      { time: 0, val: 0 },
      { time: 400, val: 35 },
      { time: 900, val: 68 },
      { time: 1300, val: 89 },
      { time: 1600, val: 100 }, // Hits 100% right as the last letter drops
    ];

    progressTimeline.forEach((step) => {
      setTimeout(() => {
        setProgress(step.val);
        if (step.val === 100) {
          // 🔥 TRIGGER PAGE LOAD: Small hold for the flash impact animation, then instantly load the page!
          setTimeout(() => {
            if (onLoadingComplete) onLoadingComplete();
          }, 500); 
        }
      }, step.time);
    });

    // Mark text as fully assembled right as the last letter clicks into position (~1.2s total)
    const textTimer = setTimeout(() => {
      setIsTextAssembled(true);
    }, 1200);

    return () => clearTimeout(textTimer);
  }, [onLoadingComplete]);

  const word = "XELTRIVOX";
  
  const letterVariants = {
    X0: {
      initial: { x: -140, opacity: 0, filter: "blur(10px)" },
      animate: { x: 0, opacity: 1, filter: "blur(0px)" },
      transition: { duration: 0.35, ease: "easeOut" }
    },
    E1: {
      initial: { y: 50, opacity: 0, filter: "drop-shadow(0 0 0px rgba(168,85,247,0))" },
      animate: { y: 0, opacity: 1, filter: "drop-shadow(0 0 15px rgba(168,85,247,0.7))" },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    L2: {
      initial: { scale: 0.3, opacity: 0, filter: "blur(5px)" },
      animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
      transition: { duration: 0.35, ease: "easeOut" }
    },
    T3: {
      initial: { rotate: -45, opacity: 0, scale: 0.7 },
      animate: { rotate: 0, opacity: 1, scale: 1 },
      transition: { duration: 0.4, type: "spring", stiffness: 120, damping: 12 }
    },
    R4: {
      initial: { opacity: 0, scaleY: 0 },
      animate: { opacity: [0, 0.4, 1], scaleY: 1 },
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    I5: {
      initial: { opacity: 0, y: -15 },
      animate: { opacity: [0, 1, 0.3, 1], y: 0 },
      transition: { duration: 0.35, times: [0, 0.2, 0.5, 1] }
    },
    V6: {
      initial: { y: -40, x: -20, opacity: 0, filter: "blur(4px)" },
      animate: { y: 0, x: 0, opacity: 1, filter: "blur(0px)" },
      transition: { duration: 0.35, ease: "easeOut" }
    },
    O7: {
      initial: { scale: 1.8, opacity: 0, filter: "brightness(2) blur(8px)" },
      animate: { scale: 1, opacity: 1, filter: "brightness(1) blur(0px)" },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    X8: {
      initial: { scale: 2.5, opacity: 0, filter: "blur(12px)" },
      animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
      transition: { duration: 0.35, type: "spring", stiffness: 180, damping: 12 }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#070a12] overflow-hidden flex flex-col items-center justify-center select-none z-50 font-sans">
      
      {/* 1. SOFT AMBIENT BACKGROUND PARTICLES */}
      <div className="absolute inset-0 bg-[radial-gradient(to_right,#1f293705_1px,transparent_1px),linear-gradient(to_bottom,#1f293705_1px,transparent_1px)] bg-size-[3rem_3rem] pointer-events-none" />
      
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`bg-particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-linear-to-r from-cyan-400 to-purple-500"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -60, 0],
            opacity: [0.1, 0.7, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 1,
          }}
        />
      ))}

      {/* 2. MAIN CINEMATIC TITLE LAYER */}
      <motion.div 
        className="relative flex items-center justify-center px-12 py-8"
        animate={isTextAssembled ? {
          y: [-3, 3, -3],
          filter: [
            "drop-shadow(0 0 20px rgba(6,182,212,0.3)) drop-shadow(0 0 35px rgba(139,92,246,0.3))",
            "drop-shadow(0 0 35px rgba(6,182,212,0.5)) drop-shadow(0 0 50px rgba(139,92,246,0.5))",
            "drop-shadow(0 0 20px rgba(6,182,212,0.3)) drop-shadow(0 0 35px rgba(139,92,246,0.3))"
          ]
        } : {}}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Futuristic Energy Pulse Rings behind text after assembly */}
        {isTextAssembled && (
          <>
            <motion.div 
              className="absolute inset-0 border border-cyan-500/20 rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.95, 1.15, 0.95], opacity: [0, 0.4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-0 border border-purple-500/10 rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.9, 1.2, 0.9], opacity: [0, 0.3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
            />
          </>
        )}

        <h1 className="flex overflow-hidden text-5xl md:text-7xl font-black tracking-[0.18em] text-white">
          {word.split("").map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className="inline-block origin-center uppercase text-white"
              variants={letterVariants[`${letter}${index}`]}
              initial="initial"
              animate="animate"
              // Fast staggered individual letter entrance (0.12 seconds apart)
              transition={{ delay: index * 0.12 }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      {/* 3. INTERFACE LOADING METRICS */}
      <div className="mt-12 flex flex-col items-center justify-center w-72 md:w-96 relative z-20">
        
        {/* Terminal Text Handshake */}
        <motion.div
          className="text-[10px] md:text-xs font-mono font-semibold tracking-[0.35em] text-cyan-400/80 uppercase mb-4 flex items-center gap-3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>INITIALIZING SYSTEM...</span>
          <span className="font-sans font-bold text-indigo-300">{Math.round(progress)}%</span>
        </motion.div>

        {/* Premium Scanning Progress Bar */}
        <div className="w-full h-1 bg-slate-950 border border-slate-900 rounded-full relative overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
          
          {/* Neon Fluid Fill Line */}
          <motion.div
            className="h-full bg-linear-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />

          {/* High-Velocity Scanning Light Effect */}
          <motion.div
            className="absolute inset-y-0 w-16 bg-linear-to-r from-transparent via-cyan-300/40 to-transparent -skew-x-12"
            animate={{ left: ["-30%", "130%"] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Ambient Sub-System Labels */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono text-slate-600 tracking-widest mt-2 px-0.5 uppercase">
          <span>Core_Mesh: Linked</span>
          <span>Buffer // SECURE_TRANS</span>
        </div>
      </div>

      {/* 4. FINAL IMPACT POWER FLASH OVERLAY */}
      <AnimatePresence>
        {progress >= 100 && (
          <motion.div
            className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-purple-600/5 to-transparent z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default XeltrivoxLoader;
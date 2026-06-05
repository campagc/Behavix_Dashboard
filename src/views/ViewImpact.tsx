import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Droplet } from 'lucide-react';

interface Props {
  onDone: () => void;
}

export default function ViewImpact({ onDone }: Props) {
  const [showDrop, setShowDrop] = useState(true);
  const [fillLevel, setFillLevel] = useState(60);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Drop hits bottom
    const t1 = setTimeout(() => {
      setShowDrop(false);
      setFillLevel(70);
    }, 300);
    // Show cards after splash
    const t2 = setTimeout(() => {
      setShowContent(true);
    }, 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <main className="w-full min-h-[100dvh] pt-12 pb-32 flex flex-col items-center bg-bg relative px-6 font-sans overflow-hidden">
      
      {/* Top Header Text */}
      <div className="text-center w-full flex flex-col items-center mb-8 z-10 shrink-0">
        <div className="text-[10px] font-bold text-[#064E3B] uppercase tracking-widest mb-3">
          REAL-WORLD IMPACT
        </div>
        <h1 className="text-[32px] font-bold text-text-main mb-3 leading-tight tracking-tight">
          Digital Eco-Tank 🌿
        </h1>
        <p className="text-text-muted text-[14px] font-medium leading-relaxed max-w-[280px]">
          Watch your feedback drop transform into Trento green energy
        </p>
      </div>

      {/* Background soft glow elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#024B3E] opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gold opacity-[0.03] rounded-full blur-3xl pointer-events-none"></div>

      {/* Water Container Animation */}
      <div className="relative w-40 h-56 mx-auto bg-surface border-[4px] border-[#024B3E]/10 flex items-end shadow-sm overflow-hidden rounded-b-[40px] rounded-t-xl p-1 pb-1 mb-8 z-10 shrink-0">
        
        <AnimatePresence>
          {showDrop && (
            <motion.div
              initial={{ y: -80, scaleX: 1, scaleY: 1, opacity: 0 }}
              animate={{ 
                y: [ -80, 20, 95, 95 ],
                scaleX: [0.8, 0.9, 1.5, 0],
                scaleY: [1.3, 1.1, 0.5, 0],
                opacity: [0, 1, 1, 0]
              }}
              transition={{ 
                duration: 0.3, 
                times: [0, 0.4, 0.9, 1],
                ease: "easeIn" 
              }}
              className="absolute left-[calc(50%-20px)] top-0 text-blue-500 z-10 flex flex-col items-center"
            >
              <Droplet className="w-10 h-10 fill-current" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Splash particles */}
        {!showDrop && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 1, y: 95, x: -5 }}
              animate={{ scale: [1, 1.5, 0], opacity: [1, 1, 0], y: 45, x: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute w-3 h-3 bg-blue-500 rounded-full left-1/2 top-0 z-10"
            />
            <motion.div
              initial={{ scale: 0, opacity: 1, y: 100, x: 5 }}
              animate={{ scale: [1, 1.2, 0], opacity: [1, 1, 0], y: 55, x: 30 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="absolute w-2 h-2 bg-blue-500 rounded-full left-1/2 top-0 z-10"
            />
          </>
        )}

        <motion.div 
          initial={{ height: '60%' }}
          animate={{ height: `${fillLevel}%` }}
          transition={{ duration: 0.8, delay: 0.3, type: 'spring', bounce: 0.2 }}
          className="w-full bg-blue-500 rounded-b-[32px] rounded-t-lg relative overflow-hidden"
        >
           {/* Inner liquid wave effect */}
           <motion.div 
             animate={{ x: [-100, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
             className="absolute top-0 left-0 right-0 w-[200%] h-3 bg-white/20 rounded-full"
             style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
           />
        </motion.div>
      </div>

      {/* Content Card */}
      <div className="w-full max-w-sm relative z-20 flex-1">
        {showContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, type: 'spring', bounce: 0.4 }}
            className="w-full flex flex-col items-center gap-6"
          >
            {/* The pale yellow card */}
            <div className="bg-[#FCFCF5] border border-gold/40 rounded-[20px] p-6 text-center shadow-sm w-full">
              <h2 className="text-[#024B3E] font-bold text-[17px] mb-3 flex items-center justify-center gap-1.5">
                <span className="text-sm">🌲</span> Splash! Contribution Saved!
              </h2>
              <p className="text-[#5B6D79] text-[13.5px] leading-relaxed px-1">
                Every single drop consolidates structural waste analysis. Together, our departments have saved <strong className="text-text-main font-bold">120.5kg of carbon-equivalent</strong> this week!
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* The dark green CTA */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full px-6 max-w-sm z-50 pointer-events-none"
          >
            <div className="pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDone}
                className="w-full bg-[#024B3E] text-white font-bold text-lg py-[18px] rounded-[24px] flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(2,75,62,0.4)] border-none cursor-pointer"
              >
                <span>Continue to Dashboard</span>
                <ChevronRight className="w-5 h-5 text-gold" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

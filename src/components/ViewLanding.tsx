import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, Users } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export default function ViewLanding({ onNext }: Props) {
  return (
    <main className="w-full min-h-[100dvh] flex flex-col items-center bg-bg relative px-6 font-sans overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold opacity-[0.05] rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-[#064E3B] opacity-[0.05] rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 pt-16 pb-8">
        
        {/* App Logo or Name Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-bold text-[#064E3B] uppercase tracking-[0.2em] mb-8 bg-[#E1F0E8] px-4 py-1.5 rounded-full"
        >
          Behavix
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-[36px] font-serif font-black text-[#1E293B] leading-[1.1] mb-6 text-center tracking-tight"
        >
          Don't throw away<br />
          <span className="text-[#064E3B]">your opinion.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#64748B] text-[15px] text-center leading-relaxed max-w-[280px] font-medium mb-10"
        >
          Your feedback fuels our Canteen AI to optimize daily recipes and eliminate waste. Grow a greener campus with every tap.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full max-w-[320px] mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="w-full bg-[#022C22] text-white font-bold text-lg py-[18px] rounded-[24px] flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(2,44,34,0.4)] border-none"
          >
            <span>Sharing Opinion</span>
            <ArrowRight className="w-5 h-5 text-gold" strokeWidth={2.5} />
          </motion.button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          className="w-full max-w-[320px] bg-white rounded-[24px] p-5 shadow-card border border-gray-100 flex flex-col gap-5"
        >
          <div className="flex items-center gap-4">
             <div className="bg-[#E1F0E8] w-12 h-12 rounded-xl flex items-center justify-center text-[#064E3B] shrink-0">
               <Users size={22} strokeWidth={2.5} />
             </div>
             <div className="flex flex-col">
               <span className="text-[#64748B] text-[11px] font-bold uppercase tracking-wider mb-0.5">Feedbacks Collected</span>
               <span className="text-[#1E293B] font-black text-xl leading-none">15,420+</span>
             </div>
          </div>
          <div className="h-px w-full bg-gray-50"></div>
          <div className="flex items-center gap-4">
             <div className="bg-[#FFFBEB] w-12 h-12 rounded-xl flex items-center justify-center text-[#D97706] shrink-0">
               <Leaf size={22} strokeWidth={2.5} />
             </div>
             <div className="flex flex-col">
               <span className="text-[#64748B] text-[11px] font-bold uppercase tracking-wider mb-0.5">Food Waste Saved</span>
               <span className="text-[#1E293B] font-black text-xl leading-none">1,240 kg</span>
             </div>
          </div>
        </motion.div>
        
      </div>
    </main>
  )
}

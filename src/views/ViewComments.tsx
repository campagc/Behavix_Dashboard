import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import QuestionnaireHeader from '../components/QuestionnaireHeader';

interface Props {
  onComplete: (score: number, comments: string, isPublic: boolean) => void;
  baseScore: number;
  onBack: () => void;
}

export default function ViewComments({ onComplete, baseScore, onBack }: Props) {
  const [comments, setComments] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      let finalScore = baseScore;
      if (comments.trim().length > 10) finalScore += 50; 
      onComplete(finalScore, comments, isPublic);
    }, 1400);
  };

  if (isAnimating) {
    return (
      <main className="w-full min-h-[100dvh] bg-bg flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <motion.div 
          className="relative flex flex-col items-center justify-end z-50 drop-shadow-2xl"
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 2, opacity: 1, y: -20 }}
          transition={{ type: "spring", bounce: 0.15 }}
        >
          {/* Popping Cap */}
          <motion.div 
            className="w-10 h-3 bg-[#94A3B8] rounded-t-md mb-0.5 z-20 relative"
            initial={{ y: 0, rotate: 0, opacity: 1 }}
            animate={{ y: -80, x: 60, rotate: 200, opacity: 0 }}
            transition={{ 
              delay: 0.6, 
              duration: 1.2,
              y: { type: "spring", bounce: 0.4 },
              x: { type: "spring", bounce: 0.4 },
              rotate: { type: "spring", bounce: 0.4 }
            }}
          />
          {/* Drops */}
          {[
            { x: -40, y: -90, s: 1.2, d: 0.1 },
            { x: -20, y: -120, s: 0.8, d: 0.05 },
            { x: 10, y: -140, s: 1.5, d: 0 },
            { x: 40, y: -110, s: 0.9, d: 0.15 },
            { x: 60, y: -80, s: 1.1, d: 0.02 },
            { x: -60, y: -60, s: 0.7, d: 0.1 },
            { x: 30, y: -130, s: 1.3, d: 0.08 },
            { x: -10, y: -80, s: 1.0, d: 0.2 },
          ].map((drop, i) => (
            <motion.div 
              key={i}
              className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 z-10 drop-shadow-sm"
              initial={{ y: 10, x: 0, scale: 0, opacity: 0 }}
              animate={{ 
                 y: drop.y, 
                 x: drop.x,
                 scale: [0, drop.s, 0],
                 opacity: [0, 1, 0]
              }}
              transition={{ 
                type: "tween",
                delay: 0.6 + drop.d / 2, 
                duration: 0.6 + (i * 0.025), 
                ease: "easeOut" 
              }}
            />
          ))}
          {/* Neck */}
          <div className="w-12 h-6 border-x-[3px] border-[#CBD5E1] bg-white z-10" />
          {/* Body */}
          <div className="w-20 h-24 border-[3px] border-t-0 border-[#CBD5E1] bg-white rounded-b-2xl relative overflow-hidden">
            <motion.div 
               className="absolute bottom-0 left-0 w-full bg-blue-500"
               initial={{ height: "80%" }}
               animate={{ height: "100%" }}
               transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
            />
            {/* Pop flash */}
            <motion.div 
               className="absolute inset-0 bg-white"
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 0.9, 0] }}
               transition={{ type: "tween", delay: 0.6, duration: 0.4 }}
            />
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[100dvh] pt-4 pb-32 flex flex-col bg-bg relative px-4 font-sans">
      <QuestionnaireHeader step={5} totalSteps={5} onBack={onBack} />
      
      <header className="mb-8 px-2">
        <h1 className="text-[26px] font-serif font-black text-text-main leading-tight tracking-tight mb-2">
          Any additional comments?
        </h1>
        <p className="text-[#64748B] text-[15px] font-medium leading-relaxed">
          Help us improve by sharing more about your experience today. Your comment might be featured on the digital screen!
        </p>
      </header>

      <div className="flex-1 relative z-10 space-y-6 px-2">
        <div>
          <textarea
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="Write your comment here..."
            maxLength={500}
            className="w-full p-4 rounded-[16px] bg-[#F8FAFC] border border-gray-200 text-[14.5px] font-medium text-text-main focus:outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all resize-none h-40 shadow-sm"
          />
          <div className="flex justify-end mt-2 text-xs font-bold text-gray-400">
             {comments.length} / 500
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
           <label 
             className="flex items-center gap-3 cursor-pointer group"
             onClick={() => setIsPublic(true)}
           >
             <div className={`w-[22px] h-[22px] rounded-full border-[2px] transition-colors ${isPublic ? 'border-[#064E3B] bg-[#064E3B]' : 'border-gray-300 bg-white group-hover:border-gray-400' } flex items-center justify-center shrink-0`}>
                {isPublic && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
             </div>
             <span className={`text-[14.5px] font-bold ${isPublic ? 'text-[#064E3B]' : 'text-text-main'}`}>Allow featuring on digital screen</span>
           </label>
           
           <div className="h-px bg-gray-100 w-full"></div>
           
           <label 
             className="flex items-center gap-3 cursor-pointer group"
             onClick={() => setIsPublic(false)}
           >
             <div className={`w-[22px] h-[22px] rounded-full border-[2px] transition-colors ${!isPublic ? 'border-[#064E3B] bg-[#064E3B]' : 'border-gray-300 bg-white group-hover:border-gray-400' } flex items-center justify-center shrink-0`}>
                {!isPublic && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
             </div>
             <span className={`text-[14.5px] font-bold ${!isPublic ? 'text-[#064E3B]' : 'text-text-main'}`}>Send privately to canteen staff</span>
           </label>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50 pointer-events-none"
      >
        <div className="pointer-events-auto rounded-[24px]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className="w-full bg-[#022C22] text-white font-bold text-[17px] py-[18px] rounded-[24px] flex items-center justify-center gap-2 border-none cursor-pointer shadow-[0_8px_20px_-4px_rgba(2,44,34,0.3)]"
          >
            <span>Finish & Submit</span>
            <ArrowRight className="w-5 h-5 text-gold" strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}

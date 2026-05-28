import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import QuestionnaireHeader from './QuestionnaireHeader';

interface Props {
  profile?: UserProfile;
  onNext: (leftFood: boolean) => void;
  onBack: () => void;
}

export default function ViewDidLeaveFood({ profile, onNext, onBack }: Props) {
  const [hasLeftovers, setHasLeftovers] = useState<boolean | null>(null);

  return (
    <main className="w-full min-h-[100dvh] pt-4 pb-32 flex flex-col bg-bg relative px-4 font-sans">
      <QuestionnaireHeader step={1} totalSteps={5} onBack={onBack} />
      
      <header className="mb-6 relative px-2">
        <h1 className="text-[26px] font-serif font-black text-text-main leading-tight tracking-tight mb-2">Did you leave any food?</h1>
        <p className="text-[#64748B] text-sm font-medium">Be honest, every feedback helps.</p>
      </header>

      <div className="space-y-4 flex-1 px-2">
        <button
          onClick={() => setHasLeftovers(false)}
          className={`w-full text-left p-5 rounded-[16px] font-bold text-[16px] transition-all border-2 ${
            hasLeftovers === false 
              ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm' 
              : 'bg-white hover:border-[#F59E0B] text-text-main border-[#FBBF24]'
          }`}
        >
          No, I finished everything! 😋
        </button>
        <button
          onClick={() => setHasLeftovers(true)}
          className={`w-full text-left p-5 rounded-[16px] font-bold text-[16px] transition-all border-2 ${
            hasLeftovers === true 
              ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm' 
              : 'bg-white hover:border-[#F59E0B] text-text-main border-[#FBBF24]'
          }`}
        >
          Yes, I left some food 🍽️
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50 pointer-events-none"
      >
        <div className="pointer-events-auto shadow-[0_8px_20px_-4px_rgba(2,44,34,0.3)] rounded-[24px]">
          <motion.button
            whileHover={hasLeftovers !== null ? { scale: 1.02 } : {}}
            whileTap={hasLeftovers !== null ? { scale: 0.98 } : {}}
            onClick={() => {
              if (hasLeftovers !== null) onNext(hasLeftovers);
            }}
            disabled={hasLeftovers === null}
            className={`w-full font-bold text-[17px] py-[18px] rounded-[24px] flex items-center justify-center gap-2 border-none transition-all ${
              hasLeftovers !== null
                ? 'bg-[#022C22] text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className={`w-5 h-5 ${hasLeftovers !== null ? 'text-gold' : 'text-gray-400'}`} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}

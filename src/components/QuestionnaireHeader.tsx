import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  step: number;
  totalSteps: number;
  onBack: () => void;
  hideBottle?: boolean;
}

export default function QuestionnaireHeader({ step, totalSteps, onBack, hideBottle }: Props) {
  const progress = step / totalSteps;

  return (
    <div className="sticky top-0 w-full pt-4 pb-4 flex items-center justify-between z-50 px-2 bg-bg border-b border-transparent">
      <button 
        onClick={onBack}
        className="w-10 h-10 rounded-[14px] bg-white border-2 border-[#FBBF24] flex items-center justify-center text-[#1E293B] shadow-sm hover:bg-[#FFFBEB] hover:border-[#F59E0B] transition-all cursor-pointer"
        disabled={hideBottle}
      >
        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {!hideBottle && (
        <motion.div 
          className="relative flex flex-col items-center justify-end drop-shadow-sm"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          {/* Cap */}
          <div className="w-4 h-1.5 bg-[#94A3B8] rounded-t-sm" />
          {/* Neck */}
          <div className="w-6 h-2 border-x-[2px] border-[#CBD5E1] bg-white z-10" />
          {/* Body */}
          <div className="w-8 h-10 border-[2px] border-t-0 border-[#CBD5E1] bg-white rounded-b-md relative overflow-hidden">
            <motion.div 
               className="absolute bottom-0 left-0 w-full bg-blue-500"
               initial={{ height: 0 }}
               animate={{ height: `${progress * 100}%` }}
               transition={{ type: "spring", bounce: 0.15 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

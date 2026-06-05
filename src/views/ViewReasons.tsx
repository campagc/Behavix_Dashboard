import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { DishAmount } from '../types';
import QuestionnaireHeader from '../components/QuestionnaireHeader';

const REASONS = [
  "Too salty 🧂",
  "Too cold ❄️",
  "Doesn't taste good 🤢",
  "Looks unappetizing 📸",
  "No appetite 🤒",
  "Ordered too much 🛒",
  "Rushing to class 🏃"
];

interface Props {
  dishes: DishAmount[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function ViewReasons({ dishes, onComplete, onBack }: Props) {
  const [selections, setSelections] = useState<Record<string, Set<string>>>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});

  const toggleReason = (categoryId: string, reason: string) => {
    setSelections(prev => {
      const current = prev[categoryId] ? new Set(prev[categoryId]) : new Set();
      if (current.has(reason)) current.delete(reason);
      else current.add(reason);
      return { ...prev, [categoryId]: current };
    });
  };

  const handleOtherChange = (categoryId: string, text: string) => {
    setOtherTexts(prev => ({ ...prev, [categoryId]: text }));
  };

  const handleComplete = () => {
    // Each leftover gives base points. Let's say flat 50.
    let score = 50 + (dishes.length * 20);
    onComplete(score);
  };

  return (
    <main className="w-full min-h-[100dvh] pt-4 pb-32 flex flex-col bg-bg relative px-4 font-sans">
      <QuestionnaireHeader step={4} totalSteps={5} onBack={onBack} />
      
      <header className="mb-8 px-2">
        <h1 className="text-[26px] font-serif font-black text-text-main leading-tight tracking-tight mb-2">
          What went wrong?
        </h1>
        <p className="text-[#64748B] text-[15px] font-medium leading-relaxed">
          Help us improve by telling us why you left food on the plate.
        </p>
      </header>

      <div className="space-y-8 flex-1 relative z-10 px-2">
        {dishes.map((dish) => (
          <div key={dish.categoryId} className="bg-white p-6 rounded-[28px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-5">
            <div>
              <h2 className="text-[20px] font-bold text-[#1E293B] leading-tight">
                Oops, what went wrong with<br/>the <span className="text-[#064E3B]">{dish.name}</span>?
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {REASONS.map((reason) => {
                const isSelected = selections[dish.categoryId]?.has(reason);
                return (
                  <button
                    key={reason}
                    onClick={() => toggleReason(dish.categoryId, reason)}
                    className={`px-4 py-2.5 rounded-[100px] font-bold text-[14px] transition-all border-[2px] ${
                      isSelected 
                        ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm' 
                        : 'bg-white text-[#64748B] border-[#FBBF24] hover:border-[#F59E0B]'
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
              <div className="w-full mt-2">
                <input
                  type="text"
                  placeholder="Other (please specify)"
                  value={otherTexts[dish.categoryId] || ''}
                  onChange={(e) => handleOtherChange(dish.categoryId, e.target.value)}
                  className="w-full px-5 py-3.5 rounded-[16px] bg-[#F8FAFC] border-2 border-[#FBBF24] text-[14px] font-medium text-text-main focus:outline-none focus:border-[#F59E0B] focus:ring-4 focus:ring-[#FDE68A] transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50 pointer-events-none"
      >
        <div className="pointer-events-auto shadow-[0_8px_20px_-4px_rgba(2,44,34,0.3)] rounded-[24px]">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className="w-full bg-[#022C22] text-white font-bold text-[17px] py-[18px] rounded-[24px] flex items-center justify-center gap-2 border-none cursor-pointer shadow-[0_8px_20px_-4px_rgba(2,44,34,0.3)]"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 text-gold" strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}

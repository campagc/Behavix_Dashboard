import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DishSelection, DishAmount } from '../types';
import QuestionnaireHeader from './QuestionnaireHeader';

interface Props {
  dishes: DishSelection[];
  onNext: (amounts: DishAmount[]) => void;
  onBack: () => void;
}

const AMOUNTS = ['None', 'Less than half', 'More than half', 'Everything'] as const;

export default function ViewAmountLeft({ dishes, onNext, onBack }: Props) {
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const handleSelect = (categoryId: string, amt: string) => {
    setAmounts(prev => ({ ...prev, [categoryId]: amt }));
  };

  const handleNext = () => {
    const result: DishAmount[] = dishes.map(d => ({
      ...d,
      amountLeft: amounts[d.categoryId] as any
    }));
    onNext(result);
  };

  const isNextEnabled = dishes.every(d => amounts[d.categoryId]);

  return (
    <main className="w-full min-h-[100dvh] pt-4 pb-32 flex flex-col bg-bg relative px-4 font-sans">
      <QuestionnaireHeader step={3} totalSteps={5} onBack={onBack} />
      
      <header className="mb-8 px-2">
        <h1 className="text-[24px] font-serif font-black text-text-main mb-2 tracking-tight">
          How much did you leave on your plate?
        </h1>
        <p className="text-[#64748B] text-sm leading-relaxed font-medium">
          For each dish, indicate how much was left.
        </p>
      </header>

      <div className="space-y-8 flex-1 px-2">
        {dishes.map((dish) => (
          <div key={dish.categoryId} className="flex flex-col gap-3">
            <div>
              <h2 className="text-lg font-bold text-text-main leading-tight">{dish.categoryName}</h2>
              <span className="text-sm font-medium text-text-muted">{dish.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AMOUNTS.map((amt) => {
                const isSelected = amounts[dish.categoryId] === amt;
                return (
                  <button
                    key={amt}
                    onClick={() => handleSelect(dish.categoryId, amt)}
                    className={`p-3 rounded-[12px] text-center text-[14px] font-bold transition-all border-2 ${
                      isSelected 
                        ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm' 
                        : 'bg-white hover:border-[#F59E0B] text-text-main border-[#FBBF24]'
                    }`}
                  >
                    {amt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-50 pointer-events-none"
      >
        <div className="pointer-events-auto">
          <motion.button
            whileTap={isNextEnabled ? { scale: 0.98 } : {}}
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`w-full font-bold text-[17px] py-[18px] rounded-[24px] flex items-center justify-center gap-2 border-none transition-all ${
              isNextEnabled
                ? 'bg-[#022C22] text-white shadow-[0_8px_20px_-4px_rgba(2,44,34,0.3)] cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className={`w-5 h-5 ${isNextEnabled ? 'text-gold' : 'text-gray-400'}`} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}

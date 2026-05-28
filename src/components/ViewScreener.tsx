import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { UserProfile, DishSelection } from '../types';
import QuestionnaireHeader from './QuestionnaireHeader';

const MENU = [
  { id: 'first', label: 'What was your first dish?', options: ['Pasta or rice with oil', 'Pasta or rice with tomato sauce', 'Pasta or rice with ragù', 'Bowl of the day', 'Salad of the day'] },
  { id: 'second', label: 'Second dish?', options: ['Pizza slice with filling', 'Wrap of the day', 'Crepes of the day'] },
  { id: 'side', label: 'Side dish?', options: ['Mixed salad'] },
  { id: 'bread', label: 'Bread?', options: ['White roll', 'Wholegrain roll'] }
];

interface Props {
  profile?: UserProfile;
  onNext: (dishes: DishSelection[]) => void;
  onBack: () => void;
}

export default function ViewScreener({ profile, onNext, onBack }: Props) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const toggleSelection = (categoryId: string, option: string) => {
    setSelections(prev => {
      if (prev[categoryId] === option) {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      }
      return { ...prev, [categoryId]: option };
    });
  };

  const handleNext = () => {
    const result: DishSelection[] = MENU.map(cat => ({
      categoryId: cat.id,
      categoryName: cat.label.replace('?', '').replace('What was your ', '').trim(),
      name: selections[cat.id]
    })).filter(d => !!d.name);
    onNext(result);
  };

  const hasSelection = Object.keys(selections).length > 0;

  return (
    <main className="w-full min-h-[100dvh] pt-4 pb-32 flex flex-col bg-bg relative px-4 font-sans">
      <QuestionnaireHeader step={2} totalSteps={5} onBack={onBack} />
      
      <header className="mb-6 relative px-2">
        <h1 className="text-[26px] font-serif font-black text-text-main leading-tight tracking-tight mb-2">What did you have today?</h1>
        <p className="text-[#64748B] text-sm font-medium">Please select the items you had today.</p>
      </header>

      <div className="space-y-8 flex-1 px-2">
        {MENU.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-3">
            <div>
              <h2 className="text-[17px] font-bold text-text-main leading-tight">{cat.label}</h2>
              <span className="text-[13px] font-medium text-text-muted">If you didn't have one, don't select anything</span>
            </div>
            <div className="space-y-2">
              {cat.options.map((option) => {
                const isSelected = selections[cat.id] === option;
                return (
                  <button
                    key={option}
                    onClick={() => toggleSelection(cat.id, option)}
                    className={`w-full text-left p-4 rounded-[12px] font-bold text-[15px] transition-all border-2 ${
                      isSelected 
                        ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm' 
                        : 'bg-white hover:border-[#F59E0B] text-text-main border-[#FBBF24]'
                    }`}
                  >
                    {option}
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
            whileHover={hasSelection ? { scale: 1.02 } : {}}
            whileTap={hasSelection ? { scale: 0.98 } : {}}
            onClick={handleNext}
            disabled={!hasSelection}
            className={`w-full font-bold text-[17px] py-[18px] rounded-[24px] flex items-center justify-center gap-2 border-none transition-all ${
              hasSelection
                ? 'bg-[#022C22] text-white shadow-[0_8px_20px_-4px_rgba(2,44,34,0.3)] cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className={`w-5 h-5 ${hasSelection ? 'text-gold' : 'text-gray-400'}`} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}

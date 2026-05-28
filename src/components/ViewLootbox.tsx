import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserProfile, RewardType, Reward } from '../types';

interface Props {
  profile: UserProfile;
  sessionScore: number;
  updateProfile: (updates: Partial<UserProfile>) => void;
  onDone: () => void;
}

export default function ViewLootbox({ profile, sessionScore, updateProfile, onDone }: Props) {
  const [phase, setPhase] = useState<'intro' | 'shaking' | 'revealed'>('intro');
  const [reward, setReward] = useState<Reward | null>(null);

  const startGacha = () => {
    setPhase('shaking');
    setTimeout(() => {
      revealReward();
    }, 750); 
  };

  const revealReward = () => {
    const rand = Math.random() * 100;
    
    let type: RewardType = 'points';
    let name = '+50 Eco Points';
    let val = sessionScore || 50; 
    
    let r_espresso = profile.pityCounter >= 3 ? 50 : 30; 
    let r_dessert = profile.pityCounter >= 3 ? 30 : 15;
    let r_golden = 1;
    
    if (rand < r_golden) {
      type = 'golden_ticket'; name = 'Golden Ticket! (Free Lunch)';
    } else if (rand < r_golden + r_dessert) {
      type = 'dessert'; name = 'Free Dessert Coupon';
    } else if (rand < r_golden + r_dessert + r_espresso) {
      type = 'espresso'; name = 'Free Espresso Ticket';
    } else {
      type = 'points'; name = `+${val} Eco Points`;
    }

    const newReward: Reward = {
      id: Date.now().toString(),
      type,
      name,
      earnedAt: Date.now(),
      expiresAt: type !== 'points' ? Date.now() + 48 * 60 * 60 * 1000 : null,
      value: val
    };

    setReward(newReward);
    setPhase('revealed');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#064E3B', '#EAB308', '#FFFFFF']
    });

    const pity = type === 'points' ? profile.pityCounter + 1 : 0;
    const pts = type === 'points' ? profile.points + val : profile.points;
    const inv = type !== 'points' ? [...profile.inventory, newReward] : profile.inventory;
    
    updateProfile({ pityCounter: pity, points: pts, inventory: inv });
  };

  const getRewardLabel = (type: string) => {
    switch (type) {
      case 'points': return { text: 'ECO POINTS REWARD', bg: 'bg-bg text-text-muted' };
      case 'espresso': return { text: 'COFFEE REWARD', bg: 'bg-[#D1FAE5] text-[#059669]' };
      case 'dessert': return { text: 'DESSERT REWARD', bg: 'bg-[#FEE2E2] text-[#DC2626]' };
      case 'golden_ticket': return { text: 'LEGENDARY REWARD', bg: 'bg-[#FEF3C7] text-[#D97706]' };
      default: return { text: 'MYSTERY REWARD', bg: 'bg-bg text-text-muted' };
    }
  };

  const getRewardImage = (type: string) => {
    switch (type) {
      case 'points': return '🔋';
      case 'espresso': return '☕️';
      case 'dessert': return '🍰';
      case 'golden_ticket': return '🎫';
      default: return '🔋';
    }
  };

  const renderBarcode = (id: string) => {
    // Generate a pseudo-random barcode string for visual effect based on ID
    return (
      <div className="bg-[#F8FAFC] px-4 py-4 rounded-[16px] w-full flex flex-col items-center mt-4 border border-gray-100">
        <div className="flex gap-1 h-10 mb-2">
          {Array.from({ length: 24 }).map((_, i) => (
             <div 
               key={i} 
               className="bg-[#1E293B] h-full" 
               style={{ width: `${Math.max(1, (i * 7 + parseInt(id.slice(0, 4))) % 4)}px` }} 
             />
          ))}
        </div>
        <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest">
          BXVX-{id.substring(id.length - 8)}
        </div>
      </div>
    );
  };

  return (
    <main className="w-full min-h-[100dvh] flex flex-col pt-20 items-center bg-bg relative overflow-hidden font-sans pb-32 px-6">
      
      {/* Top Header Text (Always visible) */}
      <div className="text-center w-full flex flex-col items-center mb-16 z-10">
        <div className="text-[10px] font-bold text-sage-dark uppercase tracking-widest mb-3">
          Feedback Submitted
        </div>
        <h1 className="text-[28px] font-bold text-text-main mb-3 leading-tight tracking-tight max-w-[280px]">
          Thank you for contributing!
        </h1>
        <div className="text-gold text-2xl mb-4">✨</div>
        <p className="text-text-muted text-[13px] font-medium leading-relaxed max-w-[260px]">
          Behavix prepared a dopamine-boosting mystery box for you
        </p>
      </div>

      {phase === 'intro' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center w-full flex flex-col items-center"
        >
          {/* Box Container */}
          <div className="relative w-56 h-56 rounded-[40px] bg-white shadow-card border-2 border-gold/40 flex items-center justify-center mb-10 z-10">
            <div className="absolute top-0 right-0 -mr-2 -mt-2 w-10 h-10 rounded-full bg-gold/20 flex flex-col items-center justify-center pointer-events-none">
               <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center shadow-md">
                 <span className="text-sm">🎁</span>
               </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGacha}
              className="text-[80px] bg-transparent border-none cursor-pointer flex items-center justify-center w-full h-full p-4"
              style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
            >
              🍱
            </motion.button>
          </div>

          <div className="text-text-muted text-sm font-bold flex items-center gap-2 mb-[100px]">
            👇 Tap the box to unwrap your gift 👇
          </div>

          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
             <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={startGacha}
              className="w-full bg-[#1A1A24] text-white py-5 rounded-[20px] font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(26,26,36,0.3)] transition-transform hover:scale-105 active:scale-95"
             >
                Unwrap Mystery Box 🎁
             </motion.button>
          </div>
        </motion.div>
      )}

      {phase === 'shaking' && (
        <motion.div 
          animate={{ 
            x: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
            rotate: [0, -8, 8, -8, 8, -4, 4, 0]
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="relative w-56 h-56 rounded-[40px] bg-white shadow-card border-2 border-gold/80 flex items-center justify-center z-10"
        >
          <span className="text-[80px] drop-shadow-xl">🍱</span>
        </motion.div>
      )}

      {phase === 'revealed' && reward && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          className="text-center w-full flex flex-col items-center"
        >
          <div className="w-full max-w-[280px] bg-white rounded-[32px] shadow-card px-6 py-8 flex flex-col items-center z-10 relative">
            
            <div className={`${getRewardLabel(reward.type).bg} font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-6`}>
               {getRewardLabel(reward.type).text}
            </div>

            <div className="text-[64px] leading-none mb-6 drop-shadow-md">
              {getRewardImage(reward.type)}
            </div>

            <h2 className="text-[20px] font-bold text-text-main mb-3 text-center">
              {reward.name}
            </h2>

            <p className="text-text-muted text-[12.5px] leading-relaxed text-center px-2">
              {reward.type === 'points' 
                ? 'Awesome! Eco points added. Your pity counter is climbing, try again next time!'
                : 'Saved to vault! Valid for 48 hours. Show the barcode at any counter to redeem!'}
            </p>

            {reward.type !== 'points' && renderBarcode(reward.id)}
          </div>

          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDone}
              className="w-full bg-[#034A3E] text-white font-bold text-[17px] py-5 rounded-[24px] flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(3,74,62,0.4)] border-none"
            >
              See My Contribution! 💧
            </motion.button>
          </div>
        </motion.div>
      )}
    </main>
  );
}

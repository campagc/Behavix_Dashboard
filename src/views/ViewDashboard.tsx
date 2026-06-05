import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { MOCK_LEADERBOARD } from '../data/dinerMock';
import { Leaf, Gift, Trophy, QrCode, Ticket, Clock } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onStart: () => void;
}

const getRewardDetails = (type: string) => {
  switch (type) {
    case 'espresso': return { icon: '☕️', desc: 'Redeem at any canteen counter', bg: 'bg-[#F2FBF6]', border: 'border-[#E1F0E8]' };
    case 'dessert': return { icon: '🍰', desc: 'Show this at the dessert station', bg: 'bg-[#FEF5F5]', border: 'border-[#FEE2E2]' };
    case 'golden_ticket': return { icon: '🎟️', desc: 'Free meal at any dining hall', bg: 'bg-[#FFFBEB]', border: 'border-[#FEF3C7]' };
    default: return { icon: '🎁', desc: 'Valid at participating locations', bg: 'bg-[#F8FAFC]', border: 'border-[#E2E8F0]' };
  }
};

export default function ViewDashboard({ profile, onStart }: Props) {
  // Sort leaderboard by volume desc
  const sortedBoard = [...MOCK_LEADERBOARD].sort((a, b) => b.volume - a.volume);
  
  // Find my rank
  const myIndex = sortedBoard.findIndex(x => x.department === profile.department);
  const actualMyIndex = myIndex >= 0 ? myIndex : 0;
  
  // Get top 2 or me and rival
  let displayBoard = [];
  if (actualMyIndex === 0) {
    displayBoard = [sortedBoard[0], sortedBoard[1] || sortedBoard[0]];
  } else {
    displayBoard = [sortedBoard[actualMyIndex - 1], sortedBoard[actualMyIndex]];
  }

  const maxVol = Math.max(...displayBoard.map(d => d.volume), 1);
  const initial = profile.email ? profile.email.charAt(0).toUpperCase() : 'U';

  const resetLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <main className="w-full min-h-[100dvh] p-4 pb-32 bg-bg flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 pt-4 px-2">
        <div className="flex items-center gap-3" onClick={resetLocalStorage}>
          <div className="w-10 h-10 rounded-full bg-sage-dark text-white flex items-center justify-center font-bold text-lg shrink-0">
            {initial}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Benvenuto!</span>
            <span className="text-sm font-bold text-text-main max-w-[150px] truncate">{profile.email || 'user@example.com'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-sage-light text-sage-dark px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-sm shadow-sm whitespace-nowrap">
            <span>🔥</span>
            {profile.streak}-Day Streak
          </div>
          <button 
            onClick={resetLocalStorage}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </header>

      <div className="space-y-4 overflow-y-auto pb-20 no-scrollbar px-2">
        {/* Eco-Squad Clash */}
        <section className="bg-surface p-5 rounded-[24px] shadow-card border border-gold/30">
          <div className="flex justify-between items-start mb-5">
             <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gold shrink-0" />
                <h2 className="text-xs font-bold text-sage-dark uppercase tracking-wide leading-tight">
                  Department Leaderboard
                </h2>
             </div>
             <span className="text-[10px] font-bold text-text-muted leading-tight text-right uppercase">
               Resets<br/>Monday
             </span>
          </div>

          <div className="space-y-4 mb-5">
            {displayBoard.map((item, idx) => {
              const isMe = item.department === profile.department;
              const isLeader = idx === 0;
              const percent = (item.volume / maxVol) * 100;
              return (
                <div key={item.department} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={isMe ? 'text-sage-dark' : 'text-text-muted'}>
                      {isLeader ? '💻' : '⚙️'} {item.department}
                    </span>
                    <span className="text-text-main">{item.volume} feedbacks</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100/80 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isMe ? 'bg-sage-dark' : 'bg-gray-400'}`}
                      style={{ background: isMe ? 'linear-gradient(to right, #064E3B, #EAB308)' : undefined }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center text-[11px] font-bold text-sage-dark">
            🔥 Support your department by submitting consistent feedbacks!
          </div>
        </section>

        {/* Impact Stats */}
        <section className="bg-[#022C22] p-5 rounded-[24px] shadow-card text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F473A] flex items-center justify-center shrink-0">
             <Leaf className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="text-[9px] font-bold text-gold uppercase tracking-widest mb-1.5 opacity-90">
              This Week's Campus Ecology Impact
            </h3>
            <p className="font-bold text-sm mb-1 leading-tight">
              Reduced approx. 120 kg waste
            </p>
            <p className="text-[10px] text-white/80 flex items-center gap-1">
              🌳 Equivalent to planting 12 new trees on campus 🌳
            </p>
          </div>
        </section>

        {/* Rewards Vault */}
        <section className="bg-surface p-6 rounded-[32px] shadow-sm border border-sage-light/30">
          <h2 className="text-[13px] font-bold text-[#1E293B] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-gold" strokeWidth={2.5} /> MY REWARDS VAULT
          </h2>
          
          {profile.inventory.length === 0 ? (
            <div className="text-center py-6 text-sm font-medium text-text-muted">
              No unused vouchers yet 🥣
            </div>
          ) : (
             <div className="space-y-4">
               {profile.inventory.map((reward, i) => {
                 const details = getRewardDetails(reward.type);
                 return (
                   <div key={reward.id + i} className={`${details.bg} ${details.border} border rounded-[20px] p-4 flex items-center justify-between`}>
                     <div className="flex items-center gap-3">
                       <span className="text-[28px] drop-shadow-sm">{details.icon}</span>
                       <div className="flex flex-col gap-0.5">
                         <span className="font-bold text-[#064E3B] text-[15px] leading-tight">{reward.name}</span>
                         <span className="text-[#64748B] text-[12px] font-medium leading-tight">{details.desc}</span>
                       </div>
                     </div>
                     <div className="bg-[#172033] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 shadow-sm">
                       <Clock className="w-3.5 h-3.5 text-gold" strokeWidth={3} />
                       <span className="text-[11px] font-bold tracking-wide">48h left</span>
                     </div>
                   </div>
                 );
               })}
             </div>
          )}
        </section>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-gradient-to-t from-bg via-bg/95 to-transparent pointer-events-none z-50">
        <div className="pointer-events-auto flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="w-full bg-[#023E36] text-white font-bold text-lg py-5 rounded-[24px] shadow-[0_8px_30px_-5px_rgba(2,62,54,0.4)] flex items-center justify-center gap-3 border-none cursor-pointer"
          >
            <QrCode className="w-5 h-5 text-gold" />
            Sharing opinion about meal
          </motion.button>
          
          <div className="w-full flex justify-between px-2 mt-4 text-[11px] text-text-muted font-medium">
            <span>Pity Counter: 1/3 times</span>
            <button onClick={resetLocalStorage} className="underline hover:text-text-main cursor-pointer">
              Reset Local Storage
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}


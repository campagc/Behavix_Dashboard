import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Department, UserProfile } from '../types';
import { DEPARTMENTS } from '../data/mock';
import { Apple, Mail } from 'lucide-react';
import { signInWithGoogle, signInWithApple } from '../firebase';

interface Props {
  profile: UserProfile;
  onComplete: (email: string, dept: Department) => void;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function ViewOnboarding({ profile, onComplete }: Props) {
  const [email, setEmail] = useState(profile.email || '');
  const [dept, setDept] = useState<Department | null>(profile.department || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && dept) {
      onComplete(email, dept);
    }
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    try {
      let user;
      if (provider === 'google') {
        user = await signInWithGoogle();
      } else if (provider === 'apple') {
        user = await signInWithApple();
      }
      if (user && user.email) {
        setEmail(user.email);
      }
    } catch (e: any) {
      if (e.code === 'auth/popup-blocked') {
        alert("Please allow popups for this site to sign in with Google/Apple.");
      } else if (e.code === 'auth/unauthorized-domain') {
        alert("Domain not authorized in Firebase. Please add this preview URL to Firebase Console > Authentication > Settings > Authorized domains.");
      } else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        console.error("Auth error", e);
      }
    }
  };

  return (
    <main className="w-full min-h-[100dvh] p-6 flex flex-col justify-center items-center bg-[#F8F9FA] relative overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage-light text-sage-dark rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm">
            👋
          </div>
          <h1 className="text-[28px] font-bold text-[#204036] mb-1 tracking-tight">
            {profile.email ? 'Welcome Back' : 'Register'}
          </h1>
          <p className="text-gray-400 text-[15px] font-medium">
            {profile.email ? 'Confirm your details to claim rewards' : 'Create your new account'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="text-left w-full">
          <div className="mb-6">
            <label className="block text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wider pl-1">University Email</label>
            <div className="relative rounded-[20px] bg-white border border-[#E5E7EB] shadow-sm flex items-center px-4 py-3.5 transition-colors focus-within:border-[#204036]">
              <Mail className="w-5 h-5 text-[#9CA3AF] mr-3 flex-shrink-0" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@studenti.unitn.it"
                className="w-full bg-transparent text-[15px] text-gray-800 font-medium focus:outline-none placeholder:text-gray-400 placeholder:font-normal"
                required
              />
            </div>
          </div>
          
          <div className="mb-8">
            <label className="block text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wider pl-1">Select Department</label>
            <div className="grid grid-cols-2 gap-3">
              {DEPARTMENTS.map(d => {
                let icon = '🎓';
                if (d === 'DISI') icon = '💻';
                if (d === 'DII') icon = '⚙️';
                if (d === 'Psychology') icon = '🧠';
                if (d === 'Economics') icon = '📈';
                if (d === 'Law') icon = '⚖️';
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDept(d)}
                    className={`py-3 px-3 border rounded-[16px] transition-all font-bold text-[12px] flex flex-col items-center justify-center gap-1 text-center bg-white ${
                      dept === d 
                        ? 'border-[#204036] shadow-sm text-[#204036]' 
                        : 'border-[#F3F4F6] text-[#4B5563] hover:border-gray-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]'
                    }`}
                  >
                    <span className="text-[24px] drop-shadow-sm">{icon}</span>
                    <span>
                      {d === 'DISI' ? 'DISI (CompSci)' : d === 'DII' ? 'DII (Industrial)' : d}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!email || !dept}
            className={`w-full py-4 rounded-[20px] font-bold text-[17px] transition-all flex items-center justify-center shadow-[0_8px_30px_-5px_rgba(26,64,54,0.3)] mt-2 ${
              email && dept 
                ? 'bg-[#204036] text-white' 
                : 'bg-[#9CA3AF] text-white cursor-not-allowed shadow-none'
            }`}
          >
            {profile.email ? 'Continue' : 'Create Profile'}
          </motion.button>

          <div className="mt-8">
             <div className="relative flex items-center py-2 mb-2">
               <div className="flex-grow border-t border-[#E5E7EB]"></div>
               <span className="flex-shrink-0 mx-4 text-[#9CA3AF] text-[13px] font-bold">Or continue with</span>
               <div className="flex-grow border-t border-[#E5E7EB]"></div>
             </div>

             <div className="flex justify-center gap-4 mt-4">
               <button 
                 type="button" 
                 onClick={() => handleOAuth('google')}
                 className={`w-14 h-14 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-sm transition-colors hover:bg-gray-50 focus:outline-none`}
               >
                 <GoogleIcon />
               </button>
               <button 
                 type="button" 
                 onClick={() => handleOAuth('apple')}
                 className={`w-14 h-14 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-sm transition-colors hover:bg-gray-50 focus:outline-none`}
               >
                 <Apple className="w-[22px] h-[22px] fill-black" />
               </button>
             </div>
          </div>
        </form>
      </motion.div>
    </main>
  );
}

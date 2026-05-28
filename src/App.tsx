import React, { useState, useEffect } from 'react';
import { UserProfile, Department, DishSelection, DishAmount } from './types';
import ViewLanding from './components/ViewLanding';
import ViewDidLeaveFood from './components/ViewDidLeaveFood';
import ViewOnboarding from './components/ViewOnboarding';
import ViewDashboard from './components/ViewDashboard';
import ViewScreener from './components/ViewScreener';
import ViewAmountLeft from './components/ViewAmountLeft';
import ViewReasons from './components/ViewReasons';
import ViewComments from './components/ViewComments';
import ViewLootbox from './components/ViewLootbox';
import ViewImpact from './components/ViewImpact';

export type ViewState = 'landing' | 'did_leave' | 'onboarding' | 'dashboard' | 'screener' | 'amount' | 'reasons' | 'comments' | 'lootbox' | 'impact';

const DEFAULT_PROFILE: UserProfile = {
  email: null,
  department: null,
  streak: 0,
  points: 0,
  pityCounter: 0,
  inventory: [],
};

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [view, setView] = useState<ViewState>('onboarding');
  const [selectedDishes, setSelectedDishes] = useState<DishSelection[]>([]);
  const [dishesWithAmounts, setDishesWithAmounts] = useState<DishAmount[]>([]);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [didLeaveFood, setDidLeaveFood] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('behavix_profile');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setProfile(p);
      } catch (e) {
        console.error("Could not parse profile", e);
      }
    }
    setView('landing');
    setIsLoaded(true);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const p = { ...prev, ...updates };
      localStorage.setItem('behavix_profile', JSON.stringify(p));
      return p;
    });
  };

  const handleSurveyComplete = (score: number) => {
    setSessionScore(score);
    if (!profile.email || !profile.department) {
      setView('onboarding');
    } else {
      if (score > 0) {
        setView('lootbox');
      } else {
        setView('dashboard');
      }
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="bg-bg min-h-screen text-text-main font-sans selection:bg-sage-light">
      <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-bg relative overflow-x-hidden shadow-glow border-x border-sage-light">
        {view === 'landing' && <ViewLanding onNext={() => setView('did_leave')} />}

        {view === 'did_leave' && <ViewDidLeaveFood 
          profile={profile}
          onNext={(leftFood) => {
            setDidLeaveFood(leftFood);
            setView('screener');
          }}
          onBack={() => setView('landing')}
        />}

        {view === 'screener' && <ViewScreener 
          profile={profile}
          onNext={(dishes) => {
            setSelectedDishes(dishes);
            if (dishes.length === 0) {
              setSessionScore(200); // 200 points for zero waste
              setView('comments');
            } else if (didLeaveFood === false) {
              setSessionScore(200);
              setView('comments');
            } else {
              setView('amount');
            }
          }}
          onBack={() => setView('did_leave')}
        />}

        {view === 'amount' && <ViewAmountLeft 
          dishes={selectedDishes}
          onNext={(amounts) => {
            setDishesWithAmounts(amounts);
            const hasLeftovers = amounts.some(a => a.amountLeft !== 'None');
            if (hasLeftovers) {
              setView('reasons');
            } else {
               // user finished all they took
              setSessionScore(100);
              setView('comments');
            }
          }}
          onBack={() => setView('screener')}
        />}

        {view === 'reasons' && <ViewReasons 
          dishes={dishesWithAmounts.filter(d => d.amountLeft !== 'None')} 
          onComplete={(score) => {
            setSessionScore(score);
            setView('comments');
          }} 
          onBack={() => setView('amount')}
        />}

        {view === 'comments' && <ViewComments 
          baseScore={sessionScore}
          onComplete={(score) => {
             handleSurveyComplete(score);
          }}
          onBack={() => {
             if (didLeaveFood === false || selectedDishes.length === 0) {
               setView('screener');
             } else if (dishesWithAmounts.filter(d => d.amountLeft !== 'None').length > 0) {
               setView('reasons');
             } else {
               setView('amount');
             }
          }}
        />}

        {view === 'onboarding' && <ViewOnboarding profile={profile} onComplete={(email, dept) => {
           updateProfile({ email, department: dept });
           if (sessionScore > 0) {
             setView('lootbox');
           } else {
             setView('dashboard');
           }
        }} />}

        {view === 'lootbox' && <ViewLootbox profile={profile} sessionScore={sessionScore} updateProfile={updateProfile} onDone={() => {
           updateProfile({ streak: profile.streak + 1 });
           setView('impact');
        }} />}

        {view === 'impact' && <ViewImpact onDone={() => setView('dashboard')} />}

        {view === 'dashboard' && <ViewDashboard profile={profile} onStart={() => setView('did_leave')} />}
      </div>
    </div>
  );
}

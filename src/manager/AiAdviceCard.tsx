import { Sparkles, ArrowUpRight, AlertOctagon, Activity, Info } from 'lucide-react';
import { AI_ADVICE, AiAdvice } from '../data/managerMock';

const SEVERITY_STYLES: Record<AiAdvice['severity'], { dot: string; pill: string; icon: any; emoji: string }> = {
  high: { dot: 'bg-coral', pill: 'bg-[#FEE2E2] text-coral', icon: AlertOctagon, emoji: '🔴' },
  medium: { dot: 'bg-gold', pill: 'bg-[#FEF3C7] text-[#A16207]', icon: Activity, emoji: '🟡' },
  low: { dot: 'bg-sage-dark', pill: 'bg-sage-light text-sage-dark', icon: Info, emoji: '🟢' },
};

interface Props { advice?: AiAdvice[]; }

export default function AiAdviceCard({ advice = AI_ADVICE }: Props) {
  return (
    <section className="bg-sage-darker rounded-3xl p-6 text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 0%, #EAB308 0%, transparent 35%), radial-gradient(circle at 100% 100%, #064E3B 0%, transparent 40%)',
        }}
      />

      <header className="flex items-center justify-between mb-5 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gold/15 ring-1 ring-gold/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold" strokeWidth={2.4} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold">
              AI Smart Advice
            </div>
            <h2 className="text-lg font-extrabold leading-tight">Actions for tomorrow's service</h2>
          </div>
        </div>
        <button className="text-[11px] font-bold text-gold/80 hover:text-gold flex items-center gap-1 cursor-pointer border-none bg-transparent">
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </header>

      <ul className="space-y-3 relative">
        {advice.slice(0, 4).map((advice) => {
          const style = SEVERITY_STYLES[advice.severity];
          const Icon = style.icon;
          return (
            <li
              key={advice.id}
              className="bg-white/[0.04] hover:bg-white/[0.07] transition-colors rounded-2xl p-4 ring-1 ring-white/5"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl ${style.pill} flex items-center justify-center shrink-0`}>
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.4} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                      {advice.severity} priority
                    </span>
                  </div>
                  <h3 className="font-bold text-sm leading-tight mb-1">{advice.title}</h3>
                  <p className="text-[11px] text-white/65 leading-relaxed mb-2">
                    {advice.rationale}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-gold font-semibold">
                    <Sparkles className="w-3 h-3" /> {advice.recommendation}
                  </div>
                </div>
                {advice.expectedSavingEur > 0 && (
                  <div className="text-right shrink-0">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/50">
                      Est. saving
                    </div>
                    <div className="text-base font-extrabold text-gold leading-none mt-1">
                      €{advice.expectedSavingEur}
                    </div>
                    <div className="text-[10px] text-white/60 mt-0.5">
                      {advice.expectedSavingKg} kg
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import { Leaf, TreePine, Cloud, HandHeart } from 'lucide-react';
import { CsrSnapshot } from '../data/managerMock';

interface Props {
  csr: CsrSnapshot;
  rangeLabel: string;
}

export default function SustainabilityCard({ csr, rangeLabel }: Props) {
  const stats = [
    { icon: Leaf, label: 'Waste avoided', value: `${csr.wasteAvoidedKg} kg`, color: 'text-gold' },
    { icon: Cloud, label: 'CO₂ saved', value: `${csr.co2AvoidedKg} kg`, color: 'text-gold' },
    { icon: TreePine, label: 'Trees equivalent', value: `${csr.treesEquivalent}`, color: 'text-gold' },
    { icon: HandHeart, label: 'Meals redirected', value: `${csr.mealsRedirected}`, color: 'text-gold' },
  ];

  return (
    <section className="bg-surface rounded-3xl p-6 border border-sage-light/60 shadow-card">
      <header className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark">
            Sustainability impact · {rangeLabel}
          </div>
          <h2 className="text-lg font-extrabold text-text-main leading-tight mt-1">
            Behavix is paying back the planet
          </h2>
        </div>
        <div className="bg-sage-light text-sage-dark text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          CSR ready
        </div>
      </header>

      {/* Highlight figure */}
      <div className="bg-sage-darker rounded-2xl p-5 flex items-center justify-between text-white mb-5 relative overflow-hidden">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gold/90">
            Cost saved
          </div>
          <div className="text-4xl font-extrabold leading-none mt-1">
            € {csr.costSavedEur.toLocaleString('en-GB')}
          </div>
          <div className="text-xs text-white/70 mt-2">
            Procurement + waste-disposal savings vs. baseline
          </div>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-gold/15 ring-1 ring-gold/40 flex items-center justify-center shrink-0">
          <Leaf className="w-7 h-7 text-gold" strokeWidth={2.2} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-bg rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl bg-sage-dark flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${s.color}`} strokeWidth={2.4} />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-text-main leading-none">
                  {s.value}
                </div>
                <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mt-1 truncate">
                  {s.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

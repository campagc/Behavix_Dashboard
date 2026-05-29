import { Leaf, TreePine, Cloud, HandHeart, Download } from 'lucide-react';
import { ECO_TIMELINE, CSR_BY_RANGE, TimeRange } from '../../data/managerMock';

interface Props { range: TimeRange; }

function EcoChart() {
  const data = ECO_TIMELINE;
  const maxWaste = Math.max(...data.map((d) => d.wasteAvoidedKg)) * 1.2;
  const maxCo2 = Math.max(...data.map((d) => d.co2AvoidedKg)) * 1.2;
  const w = 560; const h = 180; const padX = 32; const padY = 20;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const step = innerW / (data.length - 1);

  const wastePath = data.map((d, i) => {
    const x = padX + step * i;
    const y = padY + innerH - (d.wasteAvoidedKg / maxWaste) * innerH;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const co2Path = data.map((d, i) => {
    const x = padX + step * i;
    const y = padY + innerH - (d.co2AvoidedKg / maxCo2) * innerH;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Area fill for waste
  const wasteArea = wastePath + ` L ${padX + step * (data.length - 1)} ${padY + innerH} L ${padX} ${padY + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#064E3B" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.33, 0.66, 1].map((t) => (
        <line key={t} x1={padX} x2={w - padX}
          y1={padY + innerH * (1 - t)} y2={padY + innerH * (1 - t)}
          stroke="#E2E8F0" strokeDasharray="3 4" />
      ))}
      <path d={wasteArea} fill="url(#wasteGrad)" />
      <path d={wastePath} fill="none" stroke="#064E3B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={co2Path} fill="none" stroke="#EAB308" strokeWidth={2} strokeDasharray="5 4" strokeLinecap="round" />
      {data.map((d, i) => {
        const x = padX + step * i;
        const yW = padY + innerH - (d.wasteAvoidedKg / maxWaste) * innerH;
        return (
          <g key={d.week}>
            <circle cx={x} cy={yW} r={4} fill="#fff" stroke="#064E3B" strokeWidth={2} />
            <text x={x} y={h - 2} textAnchor="middle" fontSize="9" fill="#94A3B8">{d.week}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ViewSustainability({ range }: Props) {
  const csr = CSR_BY_RANGE[range];

  const stats = [
    { icon: Leaf,      label: 'Waste avoided',    value: `${csr.wasteAvoidedKg} kg`,              sub: 'Food not thrown away', color: 'bg-sage-light text-sage-dark' },
    { icon: Cloud,     label: 'CO₂ saved',         value: `${csr.co2AvoidedKg} kg`,                sub: 'Carbon equivalent', color: 'bg-[#E0F2FE] text-[#0369A1]' },
    { icon: TreePine,  label: 'Trees equivalent',  value: `${csr.treesEquivalent} trees`,          sub: 'CO₂ absorption proxy', color: 'bg-[#D1FAE5] text-[#065F46]' },
    { icon: HandHeart, label: 'Meals redirected',  value: `${csr.mealsRedirected} meals`,          sub: 'Donated or repurposed', color: 'bg-[#FEE2E2] text-coral' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark mb-1">
            Sustainability
          </div>
          <h1 className="text-2xl font-extrabold text-text-main">Environmental impact report</h1>
          <p className="text-sm text-text-muted mt-1">
            How Behavix data is translating into real-world environmental and social benefit.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-sage-dark text-sage-dark text-[11px] font-bold hover:bg-sage-dark hover:text-white transition-colors cursor-pointer">
          <Download className="w-3.5 h-3.5" /> Export CSR report
        </button>
      </div>

      {/* Highlight banner */}
      <div className="bg-sage-darker rounded-3xl p-6 text-white flex items-center justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, #EAB308 0%, transparent 40%), radial-gradient(circle at 90% 20%, #064E3B 0%, transparent 40%)' }}
        />
        <div className="relative">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gold/90">Cost saved · {range}</div>
          <div className="text-5xl font-extrabold leading-none mt-1">€ {csr.costSavedEur.toLocaleString('en-GB')}</div>
          <div className="text-sm text-white/70 mt-2">Procurement + waste-disposal savings vs. baseline</div>
        </div>
        <div className="relative flex flex-col items-end gap-2">
          <div className="bg-sage-light text-sage-dark text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            CSR ready
          </div>
          <div className="text-[11px] text-white/60">Data exportable for ESG reporting</div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-surface rounded-3xl p-5 border border-gray-100 shadow-card">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${s.color}`}>
                <Icon className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div className="text-2xl font-extrabold text-text-main leading-none">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">{s.label}</div>
              <div className="text-xs text-text-muted mt-0.5">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      <section className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-card">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark">8-week trend</div>
            <h2 className="text-lg font-extrabold text-text-main mt-1">Waste avoided & CO₂ saved</h2>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-text-main">
              <span className="w-3 h-3 rounded-sm bg-sage-dark inline-block" /> Waste avoided (kg)
            </span>
            <span className="flex items-center gap-1.5 text-text-muted">
              <span className="w-5 h-0.5 inline-block bg-gold" /> CO₂ saved (kg)
            </span>
          </div>
        </div>
        <EcoChart />
      </section>

      {/* SDG callout */}
      <section className="bg-surface rounded-3xl p-6 border border-sage-light/60 shadow-card">
        <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark mb-3">
          UN Sustainable Development Goals alignment
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { sdg: 'SDG 2', title: 'Zero Hunger', desc: `${csr.mealsRedirected} meals redirected to food-aid programs.` },
            { sdg: 'SDG 12', title: 'Responsible Consumption', desc: `${csr.wasteAvoidedKg} kg of food waste prevented through AI-driven portioning.` },
            { sdg: 'SDG 13', title: 'Climate Action', desc: `${csr.co2AvoidedKg} kg CO₂ equivalent saved, equivalent to ${csr.treesEquivalent} trees absorbing carbon for a year.` },
          ].map((g) => (
            <div key={g.sdg} className="bg-bg rounded-2xl p-4 border border-gray-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark mb-1">{g.sdg}</div>
              <div className="font-extrabold text-sm text-text-main mb-1">{g.title}</div>
              <p className="text-xs text-text-muted leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

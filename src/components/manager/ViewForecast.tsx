import { Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import {
  DISH_FORECASTS,
  FORECAST_ACCURACY,
  WEEKLY_WASTE,
  AI_ADVICE,
  ACTIONABLE_COLORS,
} from '../../data/managerMock';

// Mini bar chart for accuracy trend
function AccuracyBar() {
  const max = 100;
  const w = 480;
  const h = 80;
  const padX = 20;
  const barW = 48;
  const gap = (w - padX * 2 - barW * FORECAST_ACCURACY.length) / (FORECAST_ACCURACY.length - 1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {FORECAST_ACCURACY.map((p, i) => {
        const barH = (p.accuracy / max) * (h - 20);
        const x = padX + i * (barW + gap);
        const y = h - barH - 10;
        const isLast = i === FORECAST_ACCURACY.length - 1;
        return (
          <g key={p.week}>
            <rect x={x} y={y} width={barW} height={barH} rx={8}
              fill={isLast ? '#064E3B' : '#D1FAE5'} />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fontWeight={700}
              fill={isLast ? '#064E3B' : '#64748B'}>
              {p.accuracy}%
            </text>
            <text x={x + barW / 2} y={h - 1} textAnchor="middle" fontSize="9" fill="#94A3B8">
              {p.week}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Predicted vs actual mini chart reused from dashboard but inline
function WasteLineChart() {
  const data = WEEKLY_WASTE;
  const max = Math.max(...data.flatMap((d) => [d.actualKg, d.predictedKg])) * 1.2;
  const w = 560; const h = 160; const padX = 24; const padY = 20;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const step = innerW / (data.length - 1);
  const pt = (i: number, v: number) => ({ x: padX + step * i, y: padY + innerH - (v / max) * innerH });
  const actualPath = data.map((d, i) => { const p = pt(i, d.actualKg); return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`; }).join(' ');
  const predPath = data.map((d, i) => { const p = pt(i, d.predictedKg); return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`; }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      {[0.33, 0.66, 1].map((t) => (
        <line key={t} x1={padX} x2={w - padX} y1={padY + innerH * (1 - t)} y2={padY + innerH * (1 - t)}
          stroke="#E2E8F0" strokeDasharray="3 4" />
      ))}
      <path d={predPath} fill="none" stroke="#EAB308" strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round" />
      <path d={actualPath} fill="none" stroke="#064E3B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const pA = pt(i, d.actualKg);
        return (
          <g key={d.day}>
            <circle cx={pA.x} cy={pA.y} r={4} fill="#fff" stroke="#064E3B" strokeWidth={2} />
            <text x={pA.x} y={h - 3} textAnchor="middle" fontSize="9" fill="#94A3B8">{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ViewForecast() {
  const totalExpectedSaving = AI_ADVICE.reduce((s, a) => s + a.expectedSavingKg, 0);
  const totalEurSaving = AI_ADVICE.reduce((s, a) => s + a.expectedSavingEur, 0);
  const latestAccuracy = FORECAST_ACCURACY[FORECAST_ACCURACY.length - 1].accuracy;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark mb-1">
          AI Forecast
        </div>
        <h1 className="text-2xl font-extrabold text-text-main">Tomorrow's production plan</h1>
        <p className="text-sm text-text-muted mt-1">
          AI-recommended portion volumes for each dish based on historical patterns and real-time feedback signals.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Model accuracy', value: `${latestAccuracy}%`, hint: 'last 5 weeks avg', accent: 'sage' },
          { label: 'Expected waste saving', value: `${totalExpectedSaving} kg`, hint: 'if all advice followed', accent: 'gold' },
          { label: 'Est. cost saving', value: `€ ${totalEurSaving}`, hint: 'procurement + disposal', accent: 'dark' },
          { label: 'Dishes to adjust', value: `${DISH_FORECASTS.filter(d => d.delta !== 0).length}`, hint: 'portion changes suggested', accent: 'coral' },
        ].map((c) => {
          const bg = { sage: 'bg-sage-light text-sage-dark', gold: 'bg-[#FEF3C7] text-[#A16207]', dark: 'bg-sage-darker text-gold', coral: 'bg-[#FEE2E2] text-coral' }[c.accent];
          return (
            <div key={c.label} className="bg-surface rounded-3xl p-5 border border-gray-100 shadow-card">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold mb-3 ${bg}`}>
                <Sparkles className="w-3 h-3" /> AI
              </div>
              <div className="text-2xl font-extrabold text-text-main leading-none">{c.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">{c.label}</div>
              <div className="text-xs text-text-muted mt-0.5">{c.hint}</div>
            </div>
          );
        })}
      </div>

      {/* Row: accuracy chart + waste chart */}
      <div className="grid grid-cols-2 gap-6">
        <section className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-card">
          <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark mb-1">Model accuracy trend</div>
          <h2 className="text-base font-extrabold text-text-main mb-4">Last 5 weeks</h2>
          <AccuracyBar />
        </section>
        <section className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-card">
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-text-main">
              <span className="w-3 h-3 rounded-sm bg-sage-dark inline-block" /> Actual
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted">
              <span className="w-3 h-0.5 inline-block bg-gold" /> Predicted
            </span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark mb-1">Waste comparison</div>
          <h2 className="text-base font-extrabold text-text-main mb-4">Predicted vs. actual · last 7 days</h2>
          <WasteLineChart />
        </section>
      </div>

      {/* Tomorrow's dish forecast table */}
      <section className="bg-surface rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark">Tomorrow's plan</div>
          <h2 className="text-lg font-extrabold text-text-main mt-1">Per-dish production recommendations</h2>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] px-6 py-3 bg-bg/60 text-[10px] font-bold uppercase tracking-widest text-text-muted">
          <span>Dish</span>
          <span className="text-right">Current</span>
          <span className="text-right">Recommended</span>
          <span className="text-right">Change</span>
          <span className="text-right">Exp. leftover</span>
          <span className="text-right">Confidence</span>
        </div>

        <ul className="divide-y divide-gray-100">
          {DISH_FORECASTS.map((f) => {
            const isIncrease = f.delta > 0;
            const isDecrease = f.delta < 0;
            return (
              <li key={f.dishId} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-4 hover:bg-bg/50 transition-colors">
                <div>
                  <div className="font-bold text-sm text-text-main">{f.dishName}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{f.category}</div>
                </div>
                <span className="text-sm text-text-muted text-right">{f.currentPortions}</span>
                <span className="text-sm font-bold text-text-main text-right">{f.tomorrowPortions}</span>
                <span className={`text-sm font-bold text-right flex items-center justify-end gap-1 ${isDecrease ? 'text-sage-dark' : isIncrease ? 'text-coral' : 'text-text-muted'}`}>
                  {isDecrease ? <TrendingDown className="w-3.5 h-3.5" /> : isIncrease ? <TrendingUp className="w-3.5 h-3.5" /> : null}
                  {f.delta > 0 ? '+' : ''}{f.delta}
                </span>
                <span className={`text-sm font-bold text-right ${f.expectedLeftoverRate >= 25 ? 'text-coral' : f.expectedLeftoverRate >= 15 ? 'text-[#A16207]' : 'text-sage-dark'}`}>
                  {f.expectedLeftoverRate}%
                </span>
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sage-dark rounded-full" style={{ width: `${f.confidencePct}%` }} />
                  </div>
                  <span className="text-xs font-bold text-text-main">{f.confidencePct}%</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* AI Advice list */}
      <section className="bg-sage-darker rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold">AI Smart Advice</div>
            <h2 className="text-lg font-extrabold mt-0.5">All recommendations for tomorrow</h2>
          </div>
          <div className="flex items-center gap-2 bg-gold/15 ring-1 ring-gold/40 px-3 py-1.5 rounded-full text-gold text-[11px] font-bold">
            <Sparkles className="w-3 h-3" /> {AI_ADVICE.length} actions
          </div>
        </div>
        <ul className="space-y-3">
          {AI_ADVICE.map((a) => {
            const pillColor = { high: 'bg-[#FEE2E2] text-coral', medium: 'bg-[#FEF3C7] text-[#A16207]', low: 'bg-sage-dark/40 text-white' }[a.severity];
            return (
              <li key={a.id} className="bg-white/[0.05] rounded-2xl p-4 ring-1 ring-white/10">
                <div className="flex items-start gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 mt-0.5 ${pillColor}`}>
                    {a.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm mb-0.5">{a.title}</h3>
                    <p className="text-[11px] text-white/65 mb-2">{a.rationale}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-gold font-semibold">{a.recommendation}</span>
                      {a.expectedSavingKg > 0 && (
                        <span className="text-[10px] font-bold bg-gold/15 text-gold px-2 py-0.5 rounded-full shrink-0 ml-3">
                          −{a.expectedSavingKg} kg · −€{a.expectedSavingEur}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

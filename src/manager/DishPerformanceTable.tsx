import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  ACTIONABLE_COLORS,
  ACTIONABLE_LABELS,
  ActionableReason,
  DishPerformance,
} from '../data/managerMock';

interface Props {
  dishes: DishPerformance[];
}

function rateColor(rate: number) {
  if (rate >= 30) return 'text-coral';
  if (rate >= 20) return 'text-[#A16207]';
  return 'text-sage-dark';
}

function rateBg(rate: number) {
  if (rate >= 30) return 'bg-coral';
  if (rate >= 20) return 'bg-gold';
  return 'bg-sage-dark';
}

function TrendBadge({ value }: { value: number }) {
  if (value === 0)
    return (
      <span className="inline-flex items-center gap-1 text-text-muted text-[11px] font-semibold">
        <Minus className="w-3 h-3" /> 0pp
      </span>
    );
  const up = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold ${
        up ? 'text-coral' : 'text-sage-dark'
      }`}
    >
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? '+' : ''}
      {value}pp
    </span>
  );
}

function ReasonBar({ dish }: { dish: DishPerformance }) {
  const total = (Object.keys(dish.reasons.actionable) as ActionableReason[]).reduce(
    (sum, k) => sum + dish.reasons.actionable[k],
    0,
  );

  return (
    <div className="bg-bg rounded-2xl p-4 mt-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
          Why people wasted it
        </span>
        <span className="text-[10px] font-semibold text-text-muted">
          {dish.reasons.personalShare}% of leftovers attributed to personal context
        </span>
      </div>
      <div className="flex h-2.5 w-full rounded-full overflow-hidden mb-3">
        {(Object.keys(dish.reasons.actionable) as ActionableReason[]).map((k) => {
          const w = (dish.reasons.actionable[k] / total) * 100;
          return (
            <div
              key={k}
              style={{ width: `${w}%`, backgroundColor: ACTIONABLE_COLORS[k] }}
              title={`${ACTIONABLE_LABELS[k]} ${dish.reasons.actionable[k]}%`}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(dish.reasons.actionable) as ActionableReason[]).map((k) => (
          <div key={k} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: ACTIONABLE_COLORS[k] }}
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide truncate">
                {ACTIONABLE_LABELS[k]}
              </span>
              <span className="text-xs font-bold text-text-main">
                {dish.reasons.actionable[k]}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DishPerformanceTable({ dishes }: Props) {
  const [expanded, setExpanded] = useState<string | null>(dishes[0]?.id ?? null);
  const sorted = [...dishes].sort((a, b) => b.leftoverRate - a.leftoverRate);

  return (
    <section className="bg-surface rounded-3xl border border-gray-100 shadow-card overflow-hidden">
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark">
            Menu performance
          </div>
          <h2 className="text-lg font-extrabold text-text-main leading-tight mt-1">
            Dish-level leftover rate
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-text-muted font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-coral" /> ≥30% waste
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gold" /> 20–30%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sage-dark" /> &lt;20%
          </span>
        </div>
      </header>

      <div className="grid grid-cols-[1.6fr_1fr_1.2fr_0.8fr_0.6fr_0.4fr] px-6 py-3 bg-bg/60 text-[10px] font-bold uppercase tracking-widest text-text-muted">
        <span>Dish</span>
        <span>Category</span>
        <span>Leftover rate</span>
        <span className="text-right">Servings</span>
        <span className="text-right">Trend</span>
        <span />
      </div>

      <ul className="divide-y divide-gray-100">
        {sorted.map((dish) => {
          const isOpen = expanded === dish.id;
          return (
            <li key={dish.id} className="hover:bg-bg/60 transition-colors">
              <button
                onClick={() => setExpanded(isOpen ? null : dish.id)}
                className="w-full grid grid-cols-[1.6fr_1fr_1.2fr_0.8fr_0.6fr_0.4fr] items-center px-6 py-4 cursor-pointer text-left bg-transparent border-none"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-text-main">{dish.name}</span>
                  <span className="text-[10px] text-text-muted mt-0.5">
                    Satisfaction · {dish.satisfaction}%
                  </span>
                </div>
                <span className="text-xs font-semibold text-text-muted">{dish.category}</span>
                <div className="flex items-center gap-2 pr-4">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${rateBg(dish.leftoverRate)}`}
                      style={{ width: `${Math.min(dish.leftoverRate * 2, 100)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-extrabold tabular-nums ${rateColor(dish.leftoverRate)}`}>
                    {dish.leftoverRate}%
                  </span>
                </div>
                <span className="text-sm font-semibold text-text-main text-right tabular-nums">
                  {dish.servings.toLocaleString('en-GB')}
                </span>
                <span className="text-right">
                  <TrendBadge value={dish.trend} />
                </span>
                <span className="flex justify-end text-text-muted">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-5 -mt-1">
                  <ReasonBar dish={dish} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

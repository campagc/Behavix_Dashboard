import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DISH_PERFORMANCE,
  ACTIONABLE_LABELS,
  ACTIONABLE_COLORS,
  DishCategory,
  DishPerformance,
  TimeRange,
} from '../../data/managerMock';

const CATEGORIES: DishCategory[] = ['First Course', 'Second Course', 'Side Dish', 'Bread'];

const CATEGORY_COLORS: Record<DishCategory, string> = {
  'First Course':  'bg-[#EDE9FE] text-[#6D28D9]',
  'Second Course': 'bg-[#DBEAFE] text-[#1D4ED8]',
  'Side Dish':     'bg-[#FEF3C7] text-[#A16207]',
  'Bread':         'bg-[#FEE2E2] text-coral',
};

function rateBg(r: number) {
  if (r >= 30) return 'bg-coral';
  if (r >= 20) return 'bg-gold';
  return 'bg-sage-dark';
}

interface Props { range: TimeRange; dishes?: DishPerformance[]; }

export default function ViewMenu({ range, dishes: propDishes }: Props) {
  const all = propDishes ?? DISH_PERFORMANCE[range];
  const [filterCat, setFilterCat] = useState<DishCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'leftover' | 'satisfaction' | 'servings'>('leftover');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = all
    .filter((d) => filterCat === 'All' || d.category === filterCat)
    .sort((a, b) => {
      if (sortBy === 'leftover') return b.leftoverRate - a.leftoverRate;
      if (sortBy === 'satisfaction') return b.satisfaction - a.satisfaction;
      return b.servings - a.servings;
    });

  // Category summary bar
  const catSummary = CATEGORIES.map((cat) => {
    const items = all.filter((d) => d.category === cat);
    const avg = items.length
      ? Math.round(items.reduce((s, d) => s + d.leftoverRate, 0) / items.length)
      : 0;
    return { cat, avg, count: items.length };
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark mb-1">
          Menu performance
        </div>
        <h1 className="text-2xl font-extrabold text-text-main">Dish-level analysis</h1>
        <p className="text-sm text-text-muted mt-1">
          Leftover rates, satisfaction scores and waste reasons broken down per dish.
        </p>
      </div>

      {/* Category summary strip */}
      <div className="grid grid-cols-4 gap-4">
        {catSummary.map(({ cat, avg, count }) => (
          <button
            key={cat}
            onClick={() => setFilterCat(filterCat === cat ? 'All' : cat)}
            className={`rounded-3xl p-4 border text-left transition-all cursor-pointer ${
              filterCat === cat
                ? 'border-sage-dark bg-sage-darker text-white shadow-lg'
                : 'bg-surface border-gray-100 shadow-card hover:border-sage-dark/30'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                filterCat === cat ? 'bg-white/10 text-white' : CATEGORY_COLORS[cat]
              }`}
            >
              {cat}
            </span>
            <div className={`text-3xl font-extrabold mt-3 leading-none ${filterCat === cat ? 'text-white' : 'text-text-main'}`}>
              {avg}%
            </div>
            <div className={`text-[11px] mt-1 ${filterCat === cat ? 'text-white/70' : 'text-text-muted'}`}>
              avg leftover · {count} dishes
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <section className="bg-surface rounded-3xl border border-gray-100 shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {(['All', ...CATEGORIES] as (DishCategory | 'All')[]).map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  filterCat === c
                    ? 'bg-sage-darker text-white border-sage-darker'
                    : 'bg-transparent text-text-muted border-gray-200 hover:border-sage-dark/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-semibold">
            <span>Sort by:</span>
            {(['leftover', 'satisfaction', 'servings'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  sortBy === s
                    ? 'bg-sage-dark text-white border-sage-dark'
                    : 'bg-transparent text-text-muted border-gray-200 hover:border-sage-dark/40'
                }`}
              >
                {s === 'leftover' ? 'Leftover rate' : s === 'satisfaction' ? 'Satisfaction' : 'Servings'}
              </button>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[2fr_1fr_1.2fr_0.8fr_0.7fr_0.5fr] px-6 py-3 bg-bg/60 text-[10px] font-bold uppercase tracking-widest text-text-muted">
          <span>Dish</span>
          <span>Category</span>
          <span>Leftover rate</span>
          <span className="text-right">Servings</span>
          <span className="text-right">Trend</span>
          <span />
        </div>

        <ul className="divide-y divide-gray-100">
          {filtered.map((dish) => {
            const isOpen = expanded === dish.id;
            const TrendIcon = dish.trend > 0 ? TrendingUp : dish.trend < 0 ? TrendingDown : Minus;
            const trendColor = dish.trend > 0 ? 'text-coral' : dish.trend < 0 ? 'text-sage-dark' : 'text-text-muted';
            const totalActionable = Object.values(dish.reasons.actionable).reduce((s, v) => s + v, 0);

            return (
              <li key={dish.id} className="hover:bg-bg/50 transition-colors">
                <button
                  onClick={() => setExpanded(isOpen ? null : dish.id)}
                  className="w-full grid grid-cols-[2fr_1fr_1.2fr_0.8fr_0.7fr_0.5fr] items-center px-6 py-4 cursor-pointer text-left bg-transparent border-none"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-text-main">{dish.name}</span>
                    <span className="text-[10px] text-text-muted mt-0.5">
                      Satisfaction · {dish.satisfaction}%
                    </span>
                  </div>
                  <span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[dish.category]}`}>
                      {dish.category}
                    </span>
                  </span>
                  <div className="flex items-center gap-2 pr-4">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${rateBg(dish.leftoverRate)}`}
                        style={{ width: `${Math.min(dish.leftoverRate * 2, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold w-8 text-right ${
                      dish.leftoverRate >= 30 ? 'text-coral' : dish.leftoverRate >= 20 ? 'text-[#A16207]' : 'text-sage-dark'
                    }`}>
                      {dish.leftoverRate}%
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-text-main text-right">{dish.servings.toLocaleString()}</span>
                  <span className={`flex items-center justify-end gap-1 text-xs font-bold ${trendColor}`}>
                    <TrendIcon className="w-3.5 h-3.5" strokeWidth={2.4} />
                    {dish.trend > 0 ? '+' : ''}{dish.trend}pp
                  </span>
                  <span className="flex justify-end">
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-text-muted" />
                      : <ChevronDown className="w-4 h-4 text-text-muted" />}
                  </span>
                </button>

                {/* Expanded reasons */}
                {isOpen && (
                  <div className="px-6 pb-5 grid grid-cols-2 gap-4">
                    {/* Actionable reasons */}
                    <div className="bg-bg rounded-2xl p-4 border border-gray-100">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-coral mb-3">
                        Actionable causes · {100 - dish.reasons.personalShare}%
                      </div>
                      <div className="space-y-2">
                        {(Object.entries(dish.reasons.actionable) as [keyof typeof dish.reasons.actionable, number][]).map(([key, val]) => {
                          const share = Math.round((val / totalActionable) * (100 - dish.reasons.personalShare));
                          return (
                            <div key={key} className="flex items-center gap-2">
                              <span className="text-[11px] text-text-muted w-28 shrink-0">{ACTIONABLE_LABELS[key]}</span>
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: `${share}%`, backgroundColor: ACTIONABLE_COLORS[key] }}
                                />
                              </div>
                              <span className="text-[11px] font-bold text-text-main w-8 text-right">{share}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Personal context */}
                    <div className="bg-bg rounded-2xl p-4 border border-gray-100">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3">
                        Personal context · {dish.reasons.personalShare}%
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {dish.reasons.personalShare}% of leftovers are attributed to personal factors
                        (hurry, stress, illness, diet) — outside the kitchen's control.
                      </p>
                      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${dish.reasons.personalShare}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

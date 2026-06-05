import { Calendar, ChevronDown, Bell, Download } from 'lucide-react';
import { TimeRange, CANTEEN_SITES, CanteenSite } from '../data/managerMock';

interface Props {
  range: TimeRange;
  onRangeChange: (r: TimeRange) => void;
  site: CanteenSite;
  onSiteChange: (s: CanteenSite) => void;
}

const RANGE_LABELS: Record<TimeRange, string> = {
  today: 'Today',
  week: 'This week',
  month: 'This month',
};

export default function TopBar({ range, onRangeChange, site, onSiteChange }: Props) {
  const today = new Date('2026-05-25');
  const dateLabel = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="flex items-center justify-between gap-6 px-8 py-5 bg-surface border-b border-gray-200/70 sticky top-0 z-10">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5" />
          {dateLabel}
        </div>
        <h1 className="text-[22px] font-extrabold text-text-main leading-tight mt-1">
          Good afternoon, Massimiliano
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Canteen site selector */}
        <div className="relative">
          <select
            value={site.id}
            onChange={(e) => {
              const next = CANTEEN_SITES.find((s) => s.id === e.target.value);
              if (next) onSiteChange(next);
            }}
            className="appearance-none bg-bg border border-gray-200 rounded-2xl pl-4 pr-9 py-2.5 text-sm font-semibold text-text-main cursor-pointer hover:border-sage-dark/40 focus:outline-none focus:ring-2 focus:ring-sage-dark/20"
          >
            {CANTEEN_SITES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.operator}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted" />
        </div>

        {/* Range segmented control */}
        <div className="flex items-center bg-bg border border-gray-200 rounded-2xl p-1">
          {(Object.keys(RANGE_LABELS) as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => onRangeChange(r)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer border-none ${
                range === r
                  ? 'bg-sage-dark text-white shadow-sm'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>

        <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-bg border border-gray-200 hover:bg-gray-50 text-text-muted cursor-pointer relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-coral" />
        </button>

        <button className="flex items-center gap-2 bg-sage-dark text-white px-4 py-2.5 rounded-2xl text-xs font-bold hover:bg-sage-darker transition-colors cursor-pointer border-none shadow-card">
          <Download className="w-3.5 h-3.5 text-gold" />
          Export report
        </button>
      </div>
    </header>
  );
}

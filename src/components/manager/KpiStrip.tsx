import { KpiSnapshot } from '../../data/managerMock';

interface Props {
  kpi: KpiSnapshot;
}

interface Card {
  label: string;
  value: string;
  hint: string;
  emoji: string;
  trend: string;
  trendUp: boolean;
  accent: 'sage' | 'gold' | 'coral' | 'dark';
}

export default function KpiStrip({ kpi }: Props) {
  const cards: Card[] = [
    {
      label: 'Feedback collected',
      value: kpi.feedbackCollected.toLocaleString('en-GB'),
      hint: `${kpi.responseRate.toFixed(1)}% response rate`,
      emoji: '💬',
      trend: '+12% vs prev.',
      trendUp: true,
      accent: 'sage',
    },
    {
      label: 'Leftover rate',
      value: `${kpi.leftoverRate.toFixed(1)}%`,
      hint: 'of served portions wasted',
      emoji: '🗑️',
      trend: '-2.4pp vs prev.',
      trendUp: true,
      accent: 'gold',
    },
    {
      label: 'Actionable waste',
      value: `${kpi.actionableShare}%`,
      hint: 'caused by canteen-side factors',
      emoji: '⚠️',
      trend: '+3pp vs prev.',
      trendUp: false,
      accent: 'coral',
    },
    {
      label: 'Cost exposure',
      value: `€ ${kpi.costExposureEur.toLocaleString('en-GB')}`,
      hint: 'estimated waste value',
      emoji: '💶',
      trend: '-€ 120 vs prev.',
      trendUp: true,
      accent: 'dark',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c) => {
        const iconBg = {
          sage: 'bg-sage-light text-sage-dark',
          gold: 'bg-[#FEF3C7] text-[#A16207]',
          coral: 'bg-[#FEE2E2] text-coral',
          dark: 'bg-sage-dark text-gold',
        }[c.accent];
        return (
          <div
            key={c.label}
            className="bg-surface rounded-3xl p-5 border border-gray-100 shadow-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${iconBg}`}>
                {c.emoji}
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  c.trendUp ? 'bg-sage-light text-sage-dark' : 'bg-[#FEE2E2] text-coral'
                }`}
              >
                {c.trend}
              </span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
              {c.label}
            </div>
            <div className="text-[26px] font-extrabold text-text-main leading-tight">{c.value}</div>
            <div className="text-xs text-text-muted mt-1">{c.hint}</div>
          </div>
        );
      })}
    </div>
  );
}

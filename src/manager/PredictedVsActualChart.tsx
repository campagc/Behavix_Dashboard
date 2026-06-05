import { Sparkles } from 'lucide-react';
import { WEEKLY_WASTE, DailyWastePoint } from '../data/managerMock';

interface Props { wasteData?: DailyWastePoint[]; }

export default function PredictedVsActualChart({ wasteData = WEEKLY_WASTE }: Props) {
  const data = wasteData;
  const realOnly = data.filter((d) => d.actualKg > 0);
  const max = Math.max(...data.flatMap((d) => [d.actualKg, d.predictedKg])) * 1.15;
  const width = 560;
  const height = 220;
  const padX = 28;
  const padY = 24;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const step = innerW / (data.length - 1);

  const point = (i: number, v: number) => ({
    x: padX + step * i,
    y: padY + innerH - (v / max) * innerH,
  });

  const actualPath = data
    .map((d, i) => {
      const p = point(i, d.actualKg);
      return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
    })
    .join(' ');
  const predPath = data
    .map((d, i) => {
      const p = point(i, d.predictedKg);
      return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
    })
    .join(' ');

  const totalActual = realOnly.reduce((s, d) => s + d.actualKg, 0);
  const totalPred   = realOnly.reduce((s, d) => s + d.predictedKg, 0);
  const limitedData = realOnly.length < 3;
  const accuracy = totalActual > 0
    ? Math.max(0, 100 - (Math.abs(totalActual - totalPred) / totalActual) * 100).toFixed(1)
    : 'N/A';

  return (
    <section className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-card">
      <header className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark">
            AI forecast accuracy
          </div>
          <h2 className="text-lg font-extrabold text-text-main leading-tight mt-1">
            Predicted vs. actual waste · {limitedData ? `${realOnly.length} day${realOnly.length !== 1 ? 's' : ''} of real data` : 'last 7 days'}
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-sage-light text-sage-dark px-3 py-1.5 rounded-full font-bold text-[11px]">
          <Sparkles className="w-3 h-3" /> {limitedData ? 'Limited data' : `${accuracy}% accuracy`}
        </div>
      </header>

      <div className="flex items-center gap-4 mb-3">
        <span className="flex items-center gap-2 text-[11px] font-semibold text-text-main">
          <span className="w-3 h-3 rounded-sm bg-sage-dark" /> Actual waste
        </span>
        <span className="flex items-center gap-2 text-[11px] font-semibold text-text-muted">
          <span className="w-3 h-0.5 rounded-sm bg-gold" /> AI prediction
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={padX}
              x2={width - padX}
              y1={padY + innerH * (1 - t)}
              y2={padY + innerH * (1 - t)}
              stroke="#E2E8F0"
              strokeDasharray="3 4"
            />
          ))}

          {/* Predicted line (dashed) */}
          <path
            d={predPath}
            fill="none"
            stroke="#EAB308"
            strokeWidth={2.5}
            strokeDasharray="6 5"
            strokeLinecap="round"
          />

          {/* Actual line */}
          <path
            d={actualPath}
            fill="none"
            stroke="#064E3B"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points + labels */}
          {data.map((d, i) => {
            const pA = point(i, d.actualKg);
            const pP = point(i, d.predictedKg);
            return (
              <g key={d.day}>
                <circle cx={pP.x} cy={pP.y} r={3.5} fill="#EAB308" />
                <circle
                  cx={pA.x}
                  cy={pA.y}
                  r={5}
                  fill="#FFFFFF"
                  stroke="#064E3B"
                  strokeWidth={2.5}
                />
                <text
                  x={pA.x}
                  y={pA.y - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={700}
                  fill="#1E293B"
                >
                  {d.actualKg}
                </text>
                <text
                  x={pA.x}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={700}
                  fill="#64748B"
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="bg-bg rounded-2xl p-3">
          <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
            Actual waste
          </div>
          <div className="text-lg font-extrabold text-text-main mt-1">{totalActual} kg</div>
          {limitedData && <div className="text-[9px] text-text-muted mt-0.5">{realOnly[0]?.date ?? ''}</div>}
        </div>
        <div className="bg-bg rounded-2xl p-3">
          <div className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
            AI predicted
          </div>
          <div className="text-lg font-extrabold text-text-main mt-1">{totalPred} kg</div>
        </div>
        <div className="bg-sage-darker text-white rounded-2xl p-3">
          <div className="text-[9px] font-bold uppercase tracking-widest text-gold">
            Tomorrow's forecast
          </div>
          <div className="text-lg font-extrabold mt-1">{limitedData ? '—' : '28 kg'}</div>
          {limitedData && <div className="text-[9px] text-white/50 mt-0.5">Insufficient history</div>}
        </div>
      </div>
    </section>
  );
}

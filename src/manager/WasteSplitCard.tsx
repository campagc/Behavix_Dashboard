
interface Props {
  actionableShare: number; // 0-100
}

// Simple SVG donut (no external chart library).
function Donut({ value }: { value: number }) {
  const size = 160;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#FEF9C3"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#064E3B"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeDashoffset={c / 4}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        fontSize="28"
        fontWeight={800}
        fill="#064E3B"
      >
        {value}%
      </text>
      <text
        x="50%"
        y="64%"
        textAnchor="middle"
        fontSize="9"
        fontWeight={700}
        fill="#64748B"
        letterSpacing="1.5"
      >
        ACTIONABLE
      </text>
    </svg>
  );
}

export default function WasteSplitCard({ actionableShare }: Props) {
  const personal = 100 - actionableShare;

  return (
    <section className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-card">
      <header className="mb-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark">
          ♻️ Waste attribution
        </div>
        <h2 className="text-lg font-extrabold text-text-main leading-tight mt-1">
          🍽️ Mensa vs. personal context
        </h2>
        <p className="text-xs text-text-muted mt-1">
          Separating canteen-side flaws from diner-context factors keeps your team focused on what
          you can actually fix.
        </p>
      </header>

      <div className="flex items-center gap-6">
        <Donut value={actionableShare} />

        <div className="flex-1 space-y-3">
          <div className="bg-sage-darker text-white p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base leading-none">⚡</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                Mensa / actionable
              </span>
            </div>
            <div className="text-2xl font-extrabold leading-tight">{actionableShare}%</div>
            <div className="text-[11px] text-white/70 mt-1">
              Caused by taste, portion, cooking or temperature — you can act on this.
            </div>
          </div>

          <div className="bg-bg p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base leading-none">🧘</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Personal / non-actionable
              </span>
            </div>
            <div className="text-2xl font-extrabold leading-tight text-text-main">{personal}%</div>
            <div className="text-[11px] text-text-muted mt-1">
              Hurry, stress, illness, diet, distraction — out of the kitchen's control.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

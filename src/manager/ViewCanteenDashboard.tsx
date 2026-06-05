import { useMemo, useState } from 'react';
import Sidebar, { SidebarSection } from './Sidebar';
import TopBar from './TopBar';
import KpiStrip from './KpiStrip';
import AiAdviceCard from './AiAdviceCard';
import SustainabilityCard from './SustainabilityCard';
import DishPerformanceTable from './DishPerformanceTable';
import WasteSplitCard from './WasteSplitCard';
import PredictedVsActualChart from './PredictedVsActualChart';
import ViewMenu from './ViewMenu';
import ViewForecast from './ViewForecast';
import ViewSustainability from './ViewSustainability';
import ViewSettings from './ViewSettings';
import {
  CANTEEN_SITES,
  CSR_BY_RANGE,
  CanteenSite,
  DISH_PERFORMANCE,
  KPI_BY_RANGE,
  TimeRange,
  UNITN_TGAR_KPI,
  UNITN_TGAR_CSR,
  UNITN_TGAR_DISHES,
  UNITN_TGAR_AI_ADVICE,
  UNITN_TGAR_WEEKLY_WASTE,
} from '../data/managerMock';

const RANGE_LABEL: Record<TimeRange, string> = {
  today: 'today',
  week: 'this week',
  month: 'this month',
};

export default function ViewCanteenDashboard() {
  const [section, setSection] = useState<SidebarSection>('overview');
  const [range, setRange] = useState<TimeRange>('week');
  const [site, setSite] = useState<CanteenSite>(CANTEEN_SITES[0]);

  const isTGar = site.id === 'unitn-tgar';

  const kpi    = useMemo(() => isTGar ? UNITN_TGAR_KPI            : KPI_BY_RANGE[range],    [isTGar, range]);
  const csr    = useMemo(() => isTGar ? UNITN_TGAR_CSR            : CSR_BY_RANGE[range],    [isTGar, range]);
  const dishes = useMemo(() => isTGar ? UNITN_TGAR_DISHES         : DISH_PERFORMANCE[range],[isTGar, range]);

  return (
    <div className="min-h-screen flex bg-bg text-text-main font-sans pl-[240px]">
      <Sidebar active={section} onChange={setSection} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar range={range} onRangeChange={setRange} site={site} onSiteChange={setSite} />

        <main className="flex-1 px-8 py-6 space-y-6 max-w-[1400px] w-full mx-auto">
          {/* Context banner — only on overview */}
          {section === 'overview' && (
            <div className="flex items-center justify-between bg-surface rounded-3xl px-5 py-4 border border-gray-100 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-sage-dark animate-pulse" />
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  Live · {site.name}
                </span>
                <span className="text-sm font-semibold text-text-main">
                  {isTGar
                    ? <><span className="text-coral">Real data</span> · Wed 28 May 2026 · 37 feedback records</>
                    : <>Showing data for <span className="text-sage-dark">{RANGE_LABEL[range]}</span></>}
                </span>
              </div>
              <span className="text-[11px] text-text-muted">
                Last update · just now · auto-refresh every 60s
              </span>
            </div>
          )}

          {/* ── Overview ── */}
          {section === 'overview' && (
            <>
              <KpiStrip kpi={kpi} />
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2"><AiAdviceCard advice={isTGar ? UNITN_TGAR_AI_ADVICE : undefined} /></div>
                <div className="col-span-1"><SustainabilityCard csr={csr} rangeLabel={RANGE_LABEL[range]} /></div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2"><PredictedVsActualChart wasteData={isTGar ? UNITN_TGAR_WEEKLY_WASTE : undefined} /></div>
                <div className="col-span-1"><WasteSplitCard actionableShare={kpi.actionableShare} /></div>
              </div>
              <DishPerformanceTable dishes={dishes} />
            </>
          )}

          {/* ── Menu performance ── */}
          {section === 'menu' && <ViewMenu range={range} dishes={isTGar ? UNITN_TGAR_DISHES : undefined} />}

          {/* ── AI Forecast ── */}
          {section === 'forecast' && <ViewForecast />}

          {/* ── Sustainability ── */}
          {section === 'sustainability' && <ViewSustainability range={range} />}

          {/* ── Settings ── */}
          {section === 'settings' && <ViewSettings />}

          <footer className="text-center text-[11px] text-text-muted py-6">
            🌱 Behavix Canteen Manager · prototype build · data shown is synthetic for demo purposes
          </footer>
        </main>
      </div>
    </div>
  );
}

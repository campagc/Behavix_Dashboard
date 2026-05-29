// Dedicated mock dataset for the Canteen Manager Dashboard prototype.
// Isolated from the diner-facing mock.ts so the two flows never share state.

export type TimeRange = 'today' | 'week' | 'month';

export type DishCategory = 'First Course' | 'Second Course' | 'Side Dish' | 'Bread';

export type ActionableReason =
  | 'taste'
  | 'portion'
  | 'cooking'
  | 'temperature';

export type PersonalReason =
  | 'hurry'
  | 'stress'
  | 'not_well'
  | 'diet'
  | 'environment'
  | 'distracted';

export interface DishReasonBreakdown {
  // Percent shares of waste causes (sum ~= 100 over actionable, personal carried separately)
  actionable: Record<ActionableReason, number>;
  personalShare: number; // % of leftovers attributed to personal reasons
}

export interface DishPerformance {
  id: string;
  name: string;
  category: DishCategory;
  servings: number;            // how many portions served in the range
  leftoverRate: number;        // % of portions reported as leftover
  satisfaction: number;        // 0-100, derived from "still hungry" + dislike share
  trend: number;               // pp change vs previous period (e.g. +3, -5)
  reasons: DishReasonBreakdown;
  bountyTag?: 'rising_star' | 'underperformer' | 'stable';
}

export interface DailyWastePoint {
  day: string;     // e.g. "Mon"
  date: string;    // ISO-ish "2026-05-25"
  actualKg: number;
  predictedKg: number;
}

export interface AiAdvice {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  rationale: string;
  recommendation: string;
  expectedSavingKg: number;
  expectedSavingEur: number;
}

export interface CsrSnapshot {
  wasteAvoidedKg: number;
  co2AvoidedKg: number;
  treesEquivalent: number;
  costSavedEur: number;
  mealsRedirected: number; // meals donated / redirected thanks to forecast accuracy
}

export interface KpiSnapshot {
  feedbackCollected: number;
  responseRate: number;       // % of diners that submitted a feedback
  leftoverRate: number;       // % overall
  actionableShare: number;    // % of leftovers caused by canteen-side factors
  costExposureEur: number;    // estimated cost of current waste
}

export interface CanteenSite {
  id: string;
  name: string;
  city: string;
  operator: string;
}

export const CANTEEN_SITES: CanteenSite[] = [
  { id: 'unibz-bolzano', name: 'Unibz Campus', city: 'Bolzano', operator: 'Markas' },
  { id: 'unitn-povo', name: 'UniTn Povo', city: 'Trento', operator: 'Risto3' },
  { id: 'mezzocorona', name: 'Mezzocorona Minosse', city: 'Mezzocorona', operator: 'Risto3' },
  { id: 'unitn-tgar', name: 'UniTrento T.Gar', city: 'Trento', operator: 'Risto3' },
];

// ── UniTrento T.Gar real data snapshot (2026-05-28) ──────────────────────────
// Source: Behavix_Food_Waste_Report.pdf · feedback_export.json · users_export.json
// 47 feedback sessions · 8 registered users · 45% sessions with waste
// Avg score: 99 (waste) vs 208 (clean plate) — gap of 109 points
export const UNITN_TGAR_KPI: KpiSnapshot = {
  feedbackCollected: 47,
  responseRate: 15.8,
  leftoverRate: 45,     // 45% of sessions reported waste (from report)
  actionableShare: 68,  // bread default + chicken + side portions = structural/actionable
  costExposureEur: 163,
};

export const UNITN_TGAR_CSR: CsrSnapshot = {
  wasteAvoidedKg: 4,    // single day, low baseline
  co2AvoidedKg: 10,
  treesEquivalent: 0,
  costSavedEur: 14,
  mealsRedirected: 3,
};

// Full menu from feedback_export.json · rates from Behavix_Food_Waste_Report.pdf
// Category any-waste: First 67% · Main 85% · Sides 91% · Bread 67% · Dessert 43%
export const UNITN_TGAR_DISHES: DishPerformance[] = [
  // ── First Courses ──────────────────────────────────────────────────────────
  {
    id: 'tg-fc1', name: 'Pasta with vegetable pesto', category: 'First Course',
    servings: 14, leftoverRate: 17, satisfaction: 82, trend: -3, bountyTag: 'rising_star',
    reasons: { actionable: { taste: 10, portion: 60, cooking: 15, temperature: 15 }, personalShare: 28 },
  },
  {
    id: 'tg-fc2', name: 'Pennette with tuna', category: 'First Course',
    servings: 8, leftoverRate: 50, satisfaction: 51, trend: +2, bountyTag: 'underperformer',
    reasons: { actionable: { taste: 38, portion: 28, cooking: 22, temperature: 12 }, personalShare: 20 },
  },
  {
    id: 'tg-fc3', name: 'Pasta with olive oil', category: 'First Course',
    servings: 4, leftoverRate: 62, satisfaction: 55, trend: 0, bountyTag: 'underperformer',
    reasons: { actionable: { taste: 22, portion: 45, cooking: 18, temperature: 15 }, personalShare: 24 },
  },
  {
    id: 'tg-fc4', name: 'Rice with olive oil', category: 'First Course',
    servings: 4, leftoverRate: 50, satisfaction: 48, trend: +1, bountyTag: 'underperformer',
    reasons: { actionable: { taste: 18, portion: 55, cooking: 12, temperature: 15 }, personalShare: 26 },
  },
  // ── Main Courses ───────────────────────────────────────────────────────────
  {
    id: 'tg-mc1', name: 'Chicken drumsticks with bell peppers', category: 'Second Course',
    servings: 9, leftoverRate: 100, satisfaction: 22, trend: +5, bountyTag: 'underperformer',
    reasons: { actionable: { taste: 58, portion: 10, cooking: 25, temperature: 7 }, personalShare: 12 },
  },
  {
    id: 'tg-mc2', name: 'Mustard pork loin', category: 'Second Course',
    servings: 7, leftoverRate: 86, satisfaction: 31, trend: +3, bountyTag: 'underperformer',
    reasons: { actionable: { taste: 48, portion: 18, cooking: 26, temperature: 8 }, personalShare: 14 },
  },
  {
    id: 'tg-mc3', name: 'Caprese mozzarella', category: 'Second Course',
    servings: 4, leftoverRate: 50, satisfaction: 64, trend: -1, bountyTag: 'stable',
    reasons: { actionable: { taste: 20, portion: 42, cooking: 16, temperature: 22 }, personalShare: 30 },
  },
  {
    id: 'tg-mc4', name: 'Grilled meat', category: 'Second Course',
    servings: 3, leftoverRate: 33, satisfaction: 72, trend: -2, bountyTag: 'stable',
    reasons: { actionable: { taste: 15, portion: 35, cooking: 30, temperature: 20 }, personalShare: 32 },
  },
  // ── Side Dishes ────────────────────────────────────────────────────────────
  {
    id: 'tg-sd1', name: 'Cauliflower gratin', category: 'Side Dish',
    servings: 9, leftoverRate: 91, satisfaction: 28, trend: +6, bountyTag: 'underperformer',
    reasons: { actionable: { taste: 35, portion: 38, cooking: 20, temperature: 7 }, personalShare: 18 },
  },
  {
    id: 'tg-sd2', name: 'Sauteed carrots', category: 'Side Dish',
    servings: 7, leftoverRate: 71, satisfaction: 44, trend: +2, bountyTag: 'underperformer',
    reasons: { actionable: { taste: 28, portion: 40, cooking: 18, temperature: 14 }, personalShare: 22 },
  },
  // ── Bread ──────────────────────────────────────────────────────────────────
  {
    id: 'tg-br1', name: 'White roll', category: 'Bread',
    servings: 18, leftoverRate: 62, satisfaction: 52, trend: +4, bountyTag: 'underperformer',
    reasons: { actionable: { taste: 5, portion: 80, cooking: 5, temperature: 10 }, personalShare: 15 },
  },
  {
    id: 'tg-br2', name: 'Wholegrain roll', category: 'Bread',
    servings: 5, leftoverRate: 40, satisfaction: 66, trend: 0, bountyTag: 'stable',
    reasons: { actionable: { taste: 8, portion: 72, cooking: 8, temperature: 12 }, personalShare: 18 },
  },
  // ── Dessert (mapped to Side Dish — no Dessert category in DishCategory type) ─
  {
    id: 'tg-de1', name: 'Yogurt', category: 'Side Dish',
    servings: 8, leftoverRate: 25, satisfaction: 74, trend: -1, bountyTag: 'rising_star',
    reasons: { actionable: { taste: 12, portion: 30, cooking: 8, temperature: 50 }, personalShare: 38 },
  },
  {
    id: 'tg-de2', name: 'Fresh fruit', category: 'Side Dish',
    servings: 5, leftoverRate: 20, satisfaction: 80, trend: -2, bountyTag: 'rising_star',
    reasons: { actionable: { taste: 8, portion: 25, cooking: 5, temperature: 62 }, personalShare: 40 },
  },
];

// AI advice from Behavix_Food_Waste_Report.pdf — Section 3 "Recommended Actions"
export const UNITN_TGAR_AI_ADVICE: AiAdvice[] = [
  {
    id: 'tga1',
    severity: 'high',
    title: 'Implement "Bread on Request" policy',
    rationale:
      'White roll is the #1 selected item (18×) but left intact 50% of the time and partially wasted 75% of the time. Users grab it automatically without intending to eat it.',
    recommendation:
      'Stop pre-loading rolls onto trays. Move bread to the END of the line, opt-in only. Estimated impact: cuts the single largest waste stream by 50%+ overnight. Zero cost.',
    expectedSavingKg: 14,
    expectedSavingEur: 22,
  },
  {
    id: 'tga2',
    severity: 'high',
    title: 'Redesign or replace Chicken Drumsticks with bell peppers',
    rationale:
      'Reported waste rate: 100%. 2 out of 9 plates returned entirely untouched. Bone-in, strongly flavoured peppers — the dish does not meet diner expectations.',
    recommendation:
      'Switch to boneless, simply seasoned chicken; drop the bell pepper sauce or offer it on the side. Track Behavix waste rate weekly to confirm fix.',
    expectedSavingKg: 11,
    expectedSavingEur: 35,
  },
  {
    id: 'tga3',
    severity: 'high',
    title: 'Add one structured plant-based main course every day',
    rationale:
      'User quote: "There are never vegan options and the vegetarian choice is a single side dish disguised as a main, while there are always 3 different meat options." These users settle, then leave food.',
    recommendation:
      'Replace the "vegetarian = side dish" pattern with a real protein dish (legume patty, tofu, chickpea stew) sitting alongside the meat options.',
    expectedSavingKg: 8,
    expectedSavingEur: 18,
  },
  {
    id: 'tga4',
    severity: 'medium',
    title: 'Half-portion default for side dishes',
    rationale:
      'Side dishes are wasted 91% of the time. Cauliflower gratin left entirely on 2 of 9 plates. Portions are too large for the role they play on the tray.',
    recommendation:
      'Default to a smaller scoop; allow a free "double" on request. Smaller default = less waste, same satisfaction.',
    expectedSavingKg: 7,
    expectedSavingEur: 14,
  },
  {
    id: 'tga5',
    severity: 'medium',
    title: 'Salad bar freshness signal',
    rationale:
      'User quote: "I took the salad — it had been sitting there for a while." Even when taken, stale-looking food is left on the plate.',
    recommendation:
      'Add visible prep-time labels and rotate trays every 45 minutes. Pilot a "Fresh Batch" indicator.',
    expectedSavingKg: 3,
    expectedSavingEur: 6,
  },
  {
    id: 'tga6',
    severity: 'medium',
    title: 'Sync the Behavix menu with the actual canteen offer',
    rationale:
      'Pizza slices and filled sandwiches — among the most popular items — are missing from the feedback form, creating user frustration and data blind spots.',
    recommendation:
      'Add pizza slices, filled sandwiches and all real items to the feedback form.',
    expectedSavingKg: 0,
    expectedSavingEur: 0,
  },
  {
    id: 'tga7',
    severity: 'low',
    title: '"Zero Waste" weekly challenge via existing points/streak',
    rationale:
      'Score gap between waste sessions (avg 99) and clean-plate sessions (avg 208) is 109 points — the behavioural lever already exists in the app.',
    recommendation:
      'Reward users who finish all selected dishes with extra points. Add a department leaderboard.',
    expectedSavingKg: 0,
    expectedSavingEur: 0,
  },
];

// Single-day waste point (only one real day of data available)
export const UNITN_TGAR_WEEKLY_WASTE: DailyWastePoint[] = [
  { day: 'Mon', date: '2026-05-19', actualKg: 0, predictedKg: 0 },
  { day: 'Tue', date: '2026-05-20', actualKg: 0, predictedKg: 0 },
  { day: 'Wed', date: '2026-05-21', actualKg: 0, predictedKg: 0 },
  { day: 'Thu', date: '2026-05-22', actualKg: 0, predictedKg: 0 },
  { day: 'Fri', date: '2026-05-23', actualKg: 0, predictedKg: 0 },
  { day: 'Sat', date: '2026-05-24', actualKg: 0, predictedKg: 0 },
  { day: 'Wed', date: '2026-05-28', actualKg: 18, predictedKg: 14 }, // real data day
];

// KPI snapshots vary by time range, mocking the effect of the filter.
export const KPI_BY_RANGE: Record<TimeRange, KpiSnapshot> = {
  today: {
    feedbackCollected: 184,
    responseRate: 17.4,
    leftoverRate: 22.6,
    actionableShare: 61,
    costExposureEur: 142,
  },
  week: {
    feedbackCollected: 1147,
    responseRate: 16.1,
    leftoverRate: 24.1,
    actionableShare: 58,
    costExposureEur: 967,
  },
  month: {
    feedbackCollected: 4682,
    responseRate: 15.3,
    leftoverRate: 25.8,
    actionableShare: 55,
    costExposureEur: 4120,
  },
};

export const CSR_BY_RANGE: Record<TimeRange, CsrSnapshot> = {
  today: {
    wasteAvoidedKg: 18,
    co2AvoidedKg: 45,
    treesEquivalent: 2,
    costSavedEur: 71,
    mealsRedirected: 12,
  },
  week: {
    wasteAvoidedKg: 124,
    co2AvoidedKg: 312,
    treesEquivalent: 14,
    costSavedEur: 498,
    mealsRedirected: 86,
  },
  month: {
    wasteAvoidedKg: 482,
    co2AvoidedKg: 1208,
    treesEquivalent: 53,
    costSavedEur: 1928,
    mealsRedirected: 341,
  },
};

// Last 7 days, actual vs AI-predicted waste (kg).
export const WEEKLY_WASTE: DailyWastePoint[] = [
  { day: 'Mon', date: '2026-05-19', actualKg: 31, predictedKg: 28 },
  { day: 'Tue', date: '2026-05-20', actualKg: 27, predictedKg: 30 },
  { day: 'Wed', date: '2026-05-21', actualKg: 34, predictedKg: 33 },
  { day: 'Thu', date: '2026-05-22', actualKg: 22, predictedKg: 24 },
  { day: 'Fri', date: '2026-05-23', actualKg: 38, predictedKg: 36 },
  { day: 'Sat', date: '2026-05-24', actualKg: 19, predictedKg: 21 },
  { day: 'Sun', date: '2026-05-25', actualKg: 17, predictedKg: 18 },
];

// Dish-level performance for the selected range.
// Numbers are crafted to match the PRD user stories (some clearly underperforming,
// some praised, some borderline) so the prototype tells a story.
export const DISH_PERFORMANCE: Record<TimeRange, DishPerformance[]> = {
  today: [
    {
      id: 'd1',
      name: 'Pasta al ragù',
      category: 'First Course',
      servings: 220,
      leftoverRate: 18,
      satisfaction: 74,
      trend: -3,
      bountyTag: 'rising_star',
      reasons: {
        actionable: { taste: 12, portion: 58, cooking: 18, temperature: 12 },
        personalShare: 22,
      },
    },
    {
      id: 'd2',
      name: 'Gnocchi verdi al burro e salvia',
      category: 'First Course',
      servings: 140,
      leftoverRate: 31,
      satisfaction: 58,
      trend: +6,
      bountyTag: 'underperformer',
      reasons: {
        actionable: { taste: 41, portion: 22, cooking: 25, temperature: 12 },
        personalShare: 18,
      },
    },
    {
      id: 'd3',
      name: 'Würstel Meraner',
      category: 'Second Course',
      servings: 180,
      leftoverRate: 12,
      satisfaction: 81,
      trend: -2,
      bountyTag: 'stable',
      reasons: {
        actionable: { taste: 28, portion: 30, cooking: 22, temperature: 20 },
        personalShare: 28,
      },
    },
    {
      id: 'd4',
      name: 'Tortino di patate e formaggio',
      category: 'Second Course',
      servings: 95,
      leftoverRate: 26,
      satisfaction: 64,
      trend: +1,
      bountyTag: 'stable',
      reasons: {
        actionable: { taste: 22, portion: 35, cooking: 28, temperature: 15 },
        personalShare: 25,
      },
    },
    {
      id: 'd5',
      name: 'Zucchine al forno',
      category: 'Side Dish',
      servings: 210,
      leftoverRate: 42,
      satisfaction: 47,
      trend: +9,
      bountyTag: 'underperformer',
      reasons: {
        actionable: { taste: 48, portion: 18, cooking: 24, temperature: 10 },
        personalShare: 14,
      },
    },
    {
      id: 'd6',
      name: 'Insalata mista',
      category: 'Side Dish',
      servings: 170,
      leftoverRate: 9,
      satisfaction: 88,
      trend: -4,
      bountyTag: 'rising_star',
      reasons: {
        actionable: { taste: 18, portion: 42, cooking: 8, temperature: 32 },
        personalShare: 31,
      },
    },
    {
      id: 'd7',
      name: 'Pane',
      category: 'Bread',
      servings: 410,
      leftoverRate: 34,
      satisfaction: 60,
      trend: +2,
      bountyTag: 'underperformer',
      reasons: {
        actionable: { taste: 8, portion: 72, cooking: 4, temperature: 16 },
        personalShare: 19,
      },
    },
  ],
  week: [],
  month: [],
};

// Reuse "today" data for week/month with small variations so the prototype still has content.
DISH_PERFORMANCE.week = DISH_PERFORMANCE.today.map((d) => ({
  ...d,
  servings: Math.round(d.servings * 5.6),
  leftoverRate: Math.max(4, d.leftoverRate + (d.trend > 0 ? -1 : 1)),
  trend: d.trend + (d.trend >= 0 ? -1 : 1),
}));
DISH_PERFORMANCE.month = DISH_PERFORMANCE.today.map((d) => ({
  ...d,
  servings: Math.round(d.servings * 22),
  leftoverRate: Math.max(3, d.leftoverRate - 2),
  trend: d.trend + (d.trend >= 0 ? -2 : 2),
}));

// AI Smart Advice generated for tomorrow's service.
export const AI_ADVICE: AiAdvice[] = [
  {
    id: 'a1',
    severity: 'high',
    title: 'Reduce production of Baked Zucchini',
    rationale:
      '42% of servings were reported as leftover over the last 3 lunches, with "I didn\'t like the dish" cited by 48% of diners.',
    recommendation: 'Cut tomorrow\'s prepared portions by 25% and swap the seasoning recipe.',
    expectedSavingKg: 11,
    expectedSavingEur: 44,
  },
  {
    id: 'a2',
    severity: 'high',
    title: 'Calibrate bread distribution',
    rationale:
      '72% of bread leftovers are tagged as "portion too abundant". Self-service basket fills 1.4× the actual demand.',
    recommendation: 'Switch to half-loaf pre-portioned baskets and refill on request.',
    expectedSavingKg: 8,
    expectedSavingEur: 18,
  },
  {
    id: 'a3',
    severity: 'medium',
    title: 'Increase first-course portion for Pasta al ragù',
    rationale: '34% of diners declared "still hungry" after the meal, leftover rate is already low (18%).',
    recommendation: 'Increase pasta portion by ~15g, monitor satiety signal for 5 services.',
    expectedSavingKg: 0,
    expectedSavingEur: 0,
  },
  {
    id: 'a4',
    severity: 'medium',
    title: 'Rotate out Gnocchi verdi recipe',
    rationale: 'Taste-related rejection has risen +6pp week-over-week, satisfaction down to 58%.',
    recommendation: 'Replace with a tested vegetarian first course for 2 weeks, then A/B test.',
    expectedSavingKg: 6,
    expectedSavingEur: 21,
  },
  {
    id: 'a5',
    severity: 'low',
    title: 'Re-check temperature on Mixed Salad line',
    rationale: '32% of salad-related complaints mention "too cold". Possible fridge calibration issue.',
    recommendation: 'Verify chilled display setpoint and rotate refills every 25 minutes.',
    expectedSavingKg: 2,
    expectedSavingEur: 7,
  },
];

// ── Per-dish AI forecast for tomorrow ─────────────────────────────────────────
export interface DishForecast {
  dishId: string;
  dishName: string;
  category: DishCategory;
  tomorrowPortions: number;   // AI-recommended production volume
  currentPortions: number;    // what the kitchen usually prepares
  expectedLeftoverRate: number;
  confidencePct: number;      // model confidence 0-100
  delta: number;              // tomorrowPortions - currentPortions (negative = cut)
}

export const DISH_FORECASTS: DishForecast[] = [
  { dishId: 'd1', dishName: 'Pasta al ragù',                  category: 'First Course',  tomorrowPortions: 235, currentPortions: 220, expectedLeftoverRate: 15, confidencePct: 91, delta: +15 },
  { dishId: 'd2', dishName: 'Gnocchi verdi al burro e salvia', category: 'First Course',  tomorrowPortions: 100, currentPortions: 140, expectedLeftoverRate: 22, confidencePct: 83, delta: -40 },
  { dishId: 'd3', dishName: 'Würstel Meraner',                category: 'Second Course', tomorrowPortions: 185, currentPortions: 180, expectedLeftoverRate: 11, confidencePct: 94, delta: +5  },
  { dishId: 'd4', dishName: 'Tortino di patate e formaggio',  category: 'Second Course', tomorrowPortions: 80,  currentPortions: 95,  expectedLeftoverRate: 20, confidencePct: 77, delta: -15 },
  { dishId: 'd5', dishName: 'Zucchine al forno',              category: 'Side Dish',     tomorrowPortions: 145, currentPortions: 210, expectedLeftoverRate: 28, confidencePct: 88, delta: -65 },
  { dishId: 'd6', dishName: 'Insalata mista',                 category: 'Side Dish',     tomorrowPortions: 175, currentPortions: 170, expectedLeftoverRate: 8,  confidencePct: 96, delta: +5  },
  { dishId: 'd7', dishName: 'Pane',                           category: 'Bread',         tomorrowPortions: 330, currentPortions: 410, expectedLeftoverRate: 22, confidencePct: 85, delta: -80 },
];

// Forecast accuracy history (last 30 days, sampled weekly)
export interface AccuracyPoint { week: string; accuracy: number; }
export const FORECAST_ACCURACY: AccuracyPoint[] = [
  { week: 'W1', accuracy: 81 },
  { week: 'W2', accuracy: 84 },
  { week: 'W3', accuracy: 87 },
  { week: 'W4', accuracy: 86 },
  { week: 'W5', accuracy: 91 },
];

// ── CO₂ & waste-avoided timeline (last 8 weeks) ───────────────────────────────
export interface EcoTimelinePoint {
  week: string;
  wasteAvoidedKg: number;
  co2AvoidedKg: number;
}
export const ECO_TIMELINE: EcoTimelinePoint[] = [
  { week: 'W1', wasteAvoidedKg: 14, co2AvoidedKg: 35 },
  { week: 'W2', wasteAvoidedKg: 18, co2AvoidedKg: 45 },
  { week: 'W3', wasteAvoidedKg: 21, co2AvoidedKg: 53 },
  { week: 'W4', wasteAvoidedKg: 19, co2AvoidedKg: 48 },
  { week: 'W5', wasteAvoidedKg: 28, co2AvoidedKg: 70 },
  { week: 'W6', wasteAvoidedKg: 24, co2AvoidedKg: 60 },
  { week: 'W7', wasteAvoidedKg: 31, co2AvoidedKg: 78 },
  { week: 'W8', wasteAvoidedKg: 35, co2AvoidedKg: 88 },
];

// ── User / site settings mock ─────────────────────────────────────────────────
export interface ManagerSettings {
  displayName: string;
  email: string;
  role: string;
  site: string;
  language: 'it' | 'en';
  weeklyReportEmail: boolean;
  alertsHighPriority: boolean;
  alertsMediumPriority: boolean;
  forecastHorizonDays: number;
  exportFormat: 'csv' | 'xlsx' | 'pdf';
}

export const DEFAULT_SETTINGS: ManagerSettings = {
  displayName: 'Massimiliano C.',
  email: 'massimiliano.c@markas.it',
  role: 'Canteen Manager',
  site: 'Unibz Campus — Bolzano',
  language: 'it',
  weeklyReportEmail: true,
  alertsHighPriority: true,
  alertsMediumPriority: false,
  forecastHorizonDays: 3,
  exportFormat: 'xlsx',
};

// Pretty label maps used by widgets.
export const ACTIONABLE_LABELS: Record<ActionableReason, string> = {
  taste: 'Taste',
  portion: 'Portion too big',
  cooking: 'Cooking flaws',
  temperature: 'Temperature',
};

export const ACTIONABLE_COLORS: Record<ActionableReason, string> = {
  taste: '#064E3B',
  portion: '#EAB308',
  cooking: '#F87171',
  temperature: '#0EA5E9',
};

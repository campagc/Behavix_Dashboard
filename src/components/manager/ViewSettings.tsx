import { useState, ReactNode } from 'react';
import { Save, User, Bell, Brain, Download, Globe } from 'lucide-react';
import { DEFAULT_SETTINGS, ManagerSettings } from '../../data/managerMock';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer border-none shrink-0 ${checked ? 'bg-sage-dark' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: ReactNode }) {
  return (
    <section className="bg-surface rounded-3xl p-6 border border-gray-100 shadow-card">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-2xl bg-sage-light flex items-center justify-center">
          <Icon className="w-4 h-4 text-sage-dark" strokeWidth={2.2} />
        </div>
        <h2 className="text-base font-extrabold text-text-main">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-none">
      <div>
        <div className="text-sm font-semibold text-text-main">{label}</div>
        {hint && <div className="text-[11px] text-text-muted mt-0.5">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

export default function ViewSettings() {
  const [s, setS] = useState<ManagerSettings>({ ...DEFAULT_SETTINGS });
  const [saved, setSaved] = useState(false);

  function update<K extends keyof ManagerSettings>(key: K, val: ManagerSettings[K]) {
    setS((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-sage-dark mb-1">Settings</div>
          <h1 className="text-2xl font-extrabold text-text-main">Account & preferences</h1>
          <p className="text-sm text-text-muted mt-1">Manage your profile, notification rules, and export defaults.</p>
        </div>
        <button
          onClick={save}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer border-none ${
            saved ? 'bg-sage-dark text-white' : 'bg-sage-darker text-white hover:opacity-90'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Profile */}
        <Section icon={User} title="Profile">
          <Row label="Display name" hint="Shown in exports and reports">
            <input
              value={s.displayName}
              onChange={(e) => update('displayName', e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-text-main focus:outline-none focus:border-sage-dark w-44"
            />
          </Row>
          <Row label="Email" hint="Used for report delivery">
            <input
              value={s.email}
              onChange={(e) => update('email', e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm text-text-main focus:outline-none focus:border-sage-dark w-52"
            />
          </Row>
          <Row label="Role">
            <span className="text-sm font-semibold text-text-muted">{s.role}</span>
          </Row>
          <Row label="Site">
            <span className="text-sm font-semibold text-text-muted">{s.site}</span>
          </Row>
        </Section>

        {/* Language & export */}
        <Section icon={Globe} title="Language & Export">
          <Row label="Interface language">
            <div className="flex gap-2">
              {(['it', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => update('language', lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    s.language === lang
                      ? 'bg-sage-darker text-white border-sage-darker'
                      : 'bg-transparent text-text-muted border-gray-200 hover:border-sage-dark/40'
                  }`}
                >
                  {lang === 'it' ? '🇮🇹 Italiano' : '🇬🇧 English'}
                </button>
              ))}
            </div>
          </Row>
          <Row label="Default export format" hint="Used by the Export button in the top bar">
            <div className="flex gap-2">
              {(['csv', 'xlsx', 'pdf'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => update('exportFormat', fmt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border uppercase transition-colors cursor-pointer ${
                    s.exportFormat === fmt
                      ? 'bg-sage-darker text-white border-sage-darker'
                      : 'bg-transparent text-text-muted border-gray-200 hover:border-sage-dark/40'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </Row>
          <Row label="Export icon" hint="Quick-access export in TopBar">
            <div className="flex items-center gap-2 text-sage-dark">
              <Download className="w-4 h-4" />
              <span className="text-xs font-semibold">Enabled</span>
            </div>
          </Row>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          <Row label="Weekly summary email" hint="Sent every Monday at 8:00 AM">
            <Toggle checked={s.weeklyReportEmail} onChange={(v) => update('weeklyReportEmail', v)} />
          </Row>
          <Row label="High-priority AI alerts" hint="Real-time push when a high-severity advice is generated">
            <Toggle checked={s.alertsHighPriority} onChange={(v) => update('alertsHighPriority', v)} />
          </Row>
          <Row label="Medium-priority AI alerts" hint="Batched daily digest">
            <Toggle checked={s.alertsMediumPriority} onChange={(v) => update('alertsMediumPriority', v)} />
          </Row>
        </Section>

        {/* AI & Forecast */}
        <Section icon={Brain} title="AI & Forecast">
          <Row label="Forecast horizon" hint="How many days ahead the model predicts">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 5, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => update('forecastHorizonDays', d)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    s.forecastHorizonDays === d
                      ? 'bg-sage-darker text-white border-sage-darker'
                      : 'bg-transparent text-text-muted border-gray-200 hover:border-sage-dark/40'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </Row>
          <Row label="Model" hint="Underlying AI engine">
            <span className="text-xs font-bold bg-sage-light text-sage-dark px-2.5 py-1 rounded-full">
              Behavix ML v2.1
            </span>
          </Row>
          <Row label="Training data" hint="Feedback records used by the model">
            <span className="text-sm font-semibold text-text-muted">14,230 submissions</span>
          </Row>
          <Row label="Last model update" hint="Automatic, every Sunday night">
            <span className="text-sm font-semibold text-text-muted">25 May 2026</span>
          </Row>
        </Section>
      </div>

      {/* Danger zone */}
      <section className="bg-[#FEF2F2] rounded-3xl p-6 border border-red-100">
        <h2 className="text-base font-extrabold text-coral mb-4">Danger zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-text-main">Reset all dashboard data</div>
            <div className="text-xs text-text-muted mt-0.5">Clears local preferences. Does not affect backend data.</div>
          </div>
          <button className="px-4 py-2 rounded-2xl border border-coral text-coral text-xs font-bold hover:bg-coral hover:text-white transition-colors cursor-pointer">
            Reset preferences
          </button>
        </div>
      </section>
    </div>
  );
}

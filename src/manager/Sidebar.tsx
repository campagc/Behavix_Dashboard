import {
  LayoutDashboard,
  Utensils,
  Sparkles,
  Leaf,
  Settings,
  LogOut,
} from 'lucide-react';

export type SidebarSection =
  | 'overview'
  | 'menu'
  | 'forecast'
  | 'sustainability'
  | 'settings';

interface Props {
  active: SidebarSection;
  onChange: (s: SidebarSection) => void;
}

const ITEMS: { id: SidebarSection; label: string; icon: any }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu performance', icon: Utensils },
  { id: 'forecast', label: 'AI Forecast', icon: Sparkles },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ active, onChange }: Props) {
  return (
    <aside className="w-[240px] shrink-0 bg-sage-darker text-white flex flex-col py-6 px-4 fixed top-0 left-0 h-screen overflow-y-auto z-40">
      <div className="px-2 mb-10">
        <img
          src="/logo-behavix.png"
          alt="Behavix"
          className="w-full h-auto rounded-xl object-contain"
        />
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left cursor-pointer border-none ${
                isActive
                  ? 'bg-sage-dark text-white shadow-[0_8px_24px_-12px_rgba(234,179,8,0.4)] ring-1 ring-gold/40'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : ''}`} strokeWidth={2.2} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-sage-dark flex items-center justify-center font-bold text-sm">
            MC
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold">Massimiliano C.</span>
            <span className="text-[10px] text-white/60">Markas · Bolzano</span>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors border-none cursor-pointer">
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

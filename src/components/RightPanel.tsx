import { useStore, type RightTab } from '../store/useStore';
import { TheoryPanel } from './TheoryPanel';
import { SchoolPanel } from './SchoolPanel';
import { LayoutPanel } from './LayoutPanel';
import { NumbersPanel } from './NumbersPanel';

const TABS: { id: RightTab; label: string }[] = [
  { id: 'theory', label: 'Teoria' },
  { id: 'school', label: 'Escola' },
  { id: 'layout', label: 'Diagramação' },
  { id: 'numbers', label: 'Números' },
];

export function RightPanel() {
  const tab = useStore((s) => s.rightTab);
  const set = useStore((s) => s.set);
  return (
    <div className="right-wrap">
      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => set({ rightTab: t.id })}>
            {t.label}
          </button>
        ))}
      </nav>
      <div className="tab-body">
        {tab === 'theory' && <TheoryPanel />}
        {tab === 'school' && <SchoolPanel />}
        {tab === 'layout' && <LayoutPanel />}
        {tab === 'numbers' && <NumbersPanel />}
      </div>
    </div>
  );
}

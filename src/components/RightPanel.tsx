import { useStore, type RightTab } from '../store/useStore';
import { useT } from '../hooks/useT';
import { TheoryPanel } from './TheoryPanel';
import { SchoolPanel } from './SchoolPanel';
import { LayoutPanel } from './LayoutPanel';
import { NumbersPanel } from './NumbersPanel';

const TABS: { id: RightTab; label: [string, string] }[] = [
  { id: 'theory', label: ['Teoria', 'Theory'] },
  { id: 'school', label: ['Escola', 'School'] },
  { id: 'layout', label: ['Diagramação', 'Layout'] },
  { id: 'numbers', label: ['Números', 'Numbers'] },
];

export function RightPanel() {
  const tab = useStore((s) => s.rightTab);
  const set = useStore((s) => s.set);
  const t = useT();
  return (
    <div className="right-wrap">
      <nav className="tabs" role="tablist">
        {TABS.map((x) => (
          <button key={x.id} role="tab" aria-selected={tab === x.id} className={tab === x.id ? 'on' : ''} onClick={() => set({ rightTab: x.id })}>
            {t(...x.label)}
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

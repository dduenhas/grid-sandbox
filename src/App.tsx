import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { TopBar } from './components/TopBar';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { Desk } from './components/Desk';
import { ExportMenu } from './components/ExportMenu';
import { CommandPalette } from './components/CommandPalette';
import { AboutModal, HelpModal } from './components/HelpModal';
import { useAutoplay, useFonts, useShortcuts, useUrlSync } from './hooks/useAppEffects';

export default function App() {
  const sheet = useStore((s) => s.sheet);
  const exportOpen = useStore((s) => s.exportOpen);
  const paletteOpen = useStore((s) => s.paletteOpen);
  const helpOpen = useStore((s) => s.helpOpen);
  const aboutOpen = useStore((s) => s.aboutOpen);
  const mode = useStore((s) => s.mode);
  const set = useStore((s) => s.set);
  useShortcuts();
  useAutoplay();
  useFonts();
  useUrlSync();

  useEffect(() => {
    if (mode === 'manual') set({ rightTab: 'layout' });
  }, [mode, set]);

  return (
    <div className={`app ${sheet ? `sheet-${sheet}` : ''}`}>
      <TopBar />
      <aside className="panel left" aria-label="Formato e grids">
        <div className="sheet-grip only-narrow" onClick={() => set({ sheet: null })} />
        <LeftPanel />
      </aside>
      <Desk />
      <aside className="panel right" aria-label="Teoria, escola e diagramação">
        <div className="sheet-grip only-narrow" onClick={() => set({ sheet: null })} />
        <RightPanel />
      </aside>
      {sheet && <div className="scrim only-narrow" onClick={() => set({ sheet: null })} />}
      {exportOpen && <ExportMenu />}
      {paletteOpen && <CommandPalette />}
      {helpOpen && <HelpModal />}
      {aboutOpen && <AboutModal />}
    </div>
  );
}

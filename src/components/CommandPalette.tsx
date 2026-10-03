import { tx } from '../i18n';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FORMATS } from '../core/formats';
import { ARCHETYPES } from '../core/layoutGenerator';
import { SCHOOLS } from '../content/schools';
import { useDerived, useStore, type Overlays } from '../store/useStore';

interface Cmd {
  id: string;
  label: string;
  group: string;
  run: () => void;
}

const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function CommandPalette() {
  const s = useStore();
  const d = useDerived();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  const cmds = useMemo<Cmd[]>(() => {
    const st = useStore.getState;
    const ov: [keyof Overlays, string][] = [
      ['margins', tx('Margens', 'Margins')],
      ['columns', tx('Colunas', 'Columns')],
      ['rows', tx('Campos', 'Fields')],
      ['modules', tx('Módulos', 'Modules')],
      ['baseline', tx('Linha de base', 'Baseline')],
      ['guides', tx('Guias', 'Guides')],
      ['eightpt', tx('Grade 8pt', '8pt grid')],
      ['tracing', tx('Papel vegetal', 'Tracing paper')],
      ['dimensions', tx('Cotas', 'Dimensions')],
    ];
    return [
      { id: 'next', label: tx('Próxima variação', 'Next variation'), group: tx('Diagramação', 'Layout'), run: () => st().next() },
      { id: 'prev', label: tx('Variação anterior', 'Previous variation'), group: tx('Diagramação', 'Layout'), run: () => st().prev() },
      { id: 'rand', label: tx('Variação aleatória', 'Random variation'), group: tx('Diagramação', 'Layout'), run: () => st().random() },
      { id: 'auto', label: tx('Alternar autoplay', 'Toggle autoplay'), group: tx('Diagramação', 'Layout'), run: () => st().set({ autoplay: !st().autoplay }) },
      { id: 'manual', label: tx('Modo manual', 'Manual mode'), group: tx('Diagramação', 'Layout'), run: () => st().set({ mode: 'manual' }) },
      { id: 'automode', label: tx('Modo automático', 'Automatic mode'), group: tx('Diagramação', 'Layout'), run: () => st().set({ mode: 'auto' }) },
      { id: 'build', label: tx('Construir grid passo a passo', 'Build the grid step by step'), group: tx('Aprender', 'Learn'), run: () => st().set({ buildStep: 0, buildPlaying: true }) },
      { id: 'export', label: tx('Exportar…', 'Export…'), group: tx('Arquivo', 'File'), run: () => st().set({ exportOpen: true }) },
      { id: 'help', label: tx('Atalhos e ajuda', 'Shortcuts and help'), group: tx('Aprender', 'Learn'), run: () => st().set({ helpOpen: true }) },
      { id: 'about', label: tx('Sobre o projeto e créditos', 'About the project and credits'), group: tx('Aprender', 'Learn'), run: () => st().set({ aboutOpen: true }) },
      { id: 'orient', label: tx('Alternar orientação', 'Toggle orientation'), group: tx('Formato', 'Format'), run: () => st().toggleOrientation() },
      { id: 'lang', label: tx('Interface em inglês (English)', 'Interface in Portuguese (Português)'), group: tx('Idioma', 'Language'), run: () => st().setUiLang(st().uiLang === 'en' ? 'pt' : 'en') },
      { id: 'spread', label: tx('Alternar página dupla', 'Toggle double page'), group: tx('Formato', 'Format'), run: () => st().set({ spread: !st().spread }) },
      ...FORMATS.map((f) => ({ id: `f-${f.id}`, label: `${tx('Formato', 'Format')}: ${f.name}`, group: tx('Formato', 'Format'), run: () => st().setFormat(f.id) })),
      ...d.presets.map((p) => ({ id: `g-${p.id}`, label: `Grid: ${p.type.name}`, group: 'Grid', run: () => st().setGrid(p.id) })),
      ...SCHOOLS.map((sc) => ({ id: `s-${sc.id}`, label: `${tx('Escola', 'School')}: ${sc.name}`, group: tx('Escola', 'School'), run: () => st().setSchool(sc.id, true) })),
      ...ARCHETYPES.map((a) => ({ id: `a-${a.id}`, label: `${tx('Combinação', 'Combination')}: ${a.name}`, group: tx('Diagramação', 'Layout'), run: () => st().set({ archetypeLock: a.id, variation: 0 }) })),
      ...ov.map(([k, l]) => ({ id: `o-${k}`, label: `${tx('Mostrar/ocultar', 'Show/hide')}: ${l}`, group: tx('Visualização', 'View'), run: () => st().toggleOverlay(k) })),
    ];
  }, [d.presets, s.uiLang]);

  const list = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return cmds;
    const parts = t.split(/\s+/);
    return cmds.filter((c) => parts.every((p) => norm(`${c.group} ${c.label}`).includes(p)));
  }, [q, cmds]);

  const run = (c?: Cmd) => {
    if (!c) return;
    s.set({ paletteOpen: false });
    c.run();
  };

  return (
    <div className="modal-back" onPointerDown={(e) => e.target === e.currentTarget && s.set({ paletteOpen: false })}>
      <div className="palette" role="dialog" aria-label={tx('Comandos', 'Commands')}>
        <input
          ref={inputRef}
          className="palette-input"
          placeholder={tx('Buscar comando, grid, formato, escola…', 'Search command, grid, format, school…')}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setSel((v) => Math.min(list.length - 1, v + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setSel((v) => Math.max(0, v - 1));
            } else if (e.key === 'Enter') run(list[sel]);
            else if (e.key === 'Escape') s.set({ paletteOpen: false });
          }}
        />
        <ul className="palette-list">
          {list.slice(0, 60).map((c, i) => (
            <li key={c.id}>
              <button className={i === sel ? 'on' : ''} onMouseEnter={() => setSel(i)} onClick={() => run(c)}>
                <span className="muted small">{c.group}</span>
                {c.label}
              </button>
            </li>
          ))}
          {!list.length && <li className="muted small pad">{tx('Nada encontrado.', 'Nothing found.')}</li>}
        </ul>
      </div>
    </div>
  );
}

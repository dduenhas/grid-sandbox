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
      ['margins', 'Margens'],
      ['columns', 'Colunas'],
      ['rows', 'Campos'],
      ['modules', 'Módulos'],
      ['baseline', 'Linha de base'],
      ['guides', 'Guias'],
      ['eightpt', 'Grade 8pt'],
      ['tracing', 'Papel vegetal'],
      ['dimensions', 'Cotas'],
    ];
    return [
      { id: 'next', label: 'Próxima variação', group: 'Diagramação', run: () => st().next() },
      { id: 'prev', label: 'Variação anterior', group: 'Diagramação', run: () => st().prev() },
      { id: 'rand', label: 'Variação aleatória', group: 'Diagramação', run: () => st().random() },
      { id: 'auto', label: 'Alternar autoplay', group: 'Diagramação', run: () => st().set({ autoplay: !st().autoplay }) },
      { id: 'manual', label: 'Modo manual', group: 'Diagramação', run: () => st().set({ mode: 'manual' }) },
      { id: 'automode', label: 'Modo automático', group: 'Diagramação', run: () => st().set({ mode: 'auto' }) },
      { id: 'build', label: 'Construir grid passo a passo', group: 'Aprender', run: () => st().set({ buildStep: 0, buildPlaying: true }) },
      { id: 'export', label: 'Exportar…', group: 'Arquivo', run: () => st().set({ exportOpen: true }) },
      { id: 'help', label: 'Atalhos e ajuda', group: 'Aprender', run: () => st().set({ helpOpen: true }) },
      { id: 'about', label: 'Sobre o projeto e créditos', group: 'Aprender', run: () => st().set({ aboutOpen: true }) },
      { id: 'orient', label: 'Alternar orientação', group: 'Formato', run: () => st().toggleOrientation() },
      { id: 'spread', label: 'Alternar página dupla', group: 'Formato', run: () => st().set({ spread: !st().spread }) },
      ...FORMATS.map((f) => ({ id: `f-${f.id}`, label: `Formato: ${f.name}`, group: 'Formato', run: () => st().setFormat(f.id) })),
      ...d.presets.map((p) => ({ id: `g-${p.id}`, label: `Grid: ${p.type.name}`, group: 'Grid', run: () => st().setGrid(p.id) })),
      ...SCHOOLS.map((sc) => ({ id: `s-${sc.id}`, label: `Escola: ${sc.name}`, group: 'Escola', run: () => st().setSchool(sc.id, true) })),
      ...ARCHETYPES.map((a) => ({ id: `a-${a.id}`, label: `Combinação: ${a.name}`, group: 'Diagramação', run: () => st().set({ archetypeLock: a.id, variation: 0 }) })),
      ...ov.map(([k, l]) => ({ id: `o-${k}`, label: `Mostrar/ocultar: ${l}`, group: 'Visualização', run: () => st().toggleOverlay(k) })),
    ];
  }, [d.presets]);

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
      <div className="palette" role="dialog" aria-label="Comandos">
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Buscar comando, grid, formato, escola…"
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
          {!list.length && <li className="muted small pad">Nada encontrado.</li>}
        </ul>
      </div>
    </div>
  );
}

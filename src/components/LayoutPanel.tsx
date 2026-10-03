import { tx } from '../i18n';
import { ARCHETYPES, BLOCK_LABEL, getArchetype, type BlockKind, type ShapeKind, type Tone } from '../core/layoutGenerator';
import { useDerived, useStore, type AutoTarget } from '../store/useStore';
import type { PlaceholderLang } from '../content/placeholders';
import type { ArchetypeId } from '../content/schools';
import { markupHelp } from '../content/book';
import { Icon } from './Icon';
import { Section, Segmented, Slider, Toggle } from './ui';

const ADDABLE: BlockKind[] = ['headline', 'kicker', 'subhead', 'body', 'image', 'caption', 'quote', 'folio', 'shape', 'logo', 'chapter', 'epigraph', 'toc', 'notes'];

export function LayoutPanel() {
  const s = useStore();
  const d = useDerived();
  const arch = getArchetype(d.archetype);
  return (
    <div className="panel-inner">
      <Section title={tx('Modo', 'Mode')}>
        <Segmented
          label={tx('Modo', 'Mode')}
          value={s.mode}
          options={[
            { id: 'auto', label: tx('Automático', 'Automatic') },
            { id: 'manual', label: tx('Manual (arrastar)', 'Manual (drag)') },
          ]}
          onChange={(m) => s.set({ mode: m })}
        />
        <p className="hint">
          {s.mode === 'auto'
            ? tx('Use ◀ ▶ para percorrer combinações. Clique num bloco e fixe-o (P) para mantê-lo nas próximas.', 'Use ◀ ▶ to browse combinations. Click a block and pin it (P) to keep it in the next ones.')
            : tx('Arraste os blocos: eles encaixam nas colunas e campos. Puxe o quadrado vermelho para redimensionar. Setas movem; Shift+setas redimensionam.', 'Drag the blocks: they snap to the columns and fields. Pull the red square to resize. Arrows move; Shift+arrows resize.')}
        </p>
      </Section>
      <Section title={tx('Combinação', 'Combination')}>
        <select className="select" value={s.archetypeLock ?? ''} onChange={(e) => s.set({ archetypeLock: (e.target.value || null) as ArchetypeId | null, variation: 0, selectedId: null })} aria-label={tx('Arquétipo', 'Archetype')}>
          <option value="">{tx('Automático (ciclo da escola)', 'Automatic (school cycle)')}</option>
          <optgroup label={tx('Composições livres', 'Free compositions')}>
            {ARCHETYPES.filter((a) => !a.book).map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </optgroup>
          <optgroup label={tx('Páginas de livro', 'Book pages')}>
            {ARCHETYPES.filter((a) => a.book).map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </optgroup>
        </select>
        <p className="lead small">
          <strong>{arch.name}.</strong> {arch.description}
        </p>
        <div className="row2">
          <select className="select" value={s.lang} onChange={(e) => s.set({ lang: e.target.value as PlaceholderLang })} aria-label={tx('Texto de preenchimento', 'Placeholder text')}>
            <option value="pt">{tx('Texto em português', 'Sample text in English')}</option>
            <option value="grid">{tx('Texto sobre grids', 'Text about grids')}</option>
            <option value="latin">Lorem ipsum</option>
          </select>
          <select className="select" value={s.autoTarget} onChange={(e) => s.set({ autoTarget: e.target.value as AutoTarget })} aria-label={tx('O que o autoplay muda', 'What autoplay changes')}>
            <option value="variations">{tx('Autoplay: variações', 'Autoplay: variations')}</option>
            <option value="grids">{tx('Autoplay: grids', 'Autoplay: grids')}</option>
            <option value="schools">{tx('Autoplay: escolas', 'Autoplay: schools')}</option>
            <option value="all">{tx('Autoplay: tudo', 'Autoplay: everything')}</option>
          </select>
        </div>
        <Slider label={tx('Intervalo', 'Interval')} value={s.autoplayMs / 1000} min={0.8} max={8} step={0.2} suffix="s" onChange={(v) => s.set({ autoplayMs: v * 1000 })} />
      </Section>
      <Section title={`${tx('Análise', 'Analysis')} · ${d.score.total}/100`}>
        <div className="score-parts">
          {d.score.parts.map((p) => (
            <div key={p.id} className="score-part">
              <div className="score-row">
                <span>{p.label}</span>
                <span className="mono">{Math.round(p.value * 100)}</span>
              </div>
              <div className="bar">
                <i style={{ width: `${p.value * 100}%` }} />
              </div>
              <p className="small muted">{p.note}</p>
            </div>
          ))}
        </div>
      </Section>
      <Inspector />
      <Section
        title={tx('Adicionar elemento', 'Add element')}
        aside={
          <span className="row-inline">
            <button className="icon-btn" onClick={s.undo} disabled={!s.past.length} title={tx('Desfazer (Ctrl+Z)', 'Undo (Ctrl+Z)')}>
              <Icon name="undo" size={16} />
            </button>
            <button className="icon-btn" onClick={s.redo} disabled={!s.future.length} title={tx('Refazer (Ctrl+Shift+Z)', 'Redo (Ctrl+Shift+Z)')}>
              <Icon name="redo" size={16} />
            </button>
          </span>
        }
      >
        <div className="chips-wrap">
          {ADDABLE.map((k) => (
            <button key={k} className="chip" onClick={() => s.addBlock(k)}>
              + {BLOCK_LABEL[k]}
            </button>
          ))}
        </div>
        {d.edited && (
          <button className="link" onClick={s.resetEdits}>
            {tx('descartar edições desta variação', 'discard the edits of this variation')}
          </button>
        )}
      </Section>
    </div>
  );
}

function Inspector() {
  const s = useStore();
  const d = useDerived();
  const b = d.blocks.find((x) => x.id === s.selectedId);
  if (!b) return null;
  const C = d.grid.cols.length;
  const R = d.grid.rows.length;
  const pinned = s.pinned.some((p) => p.id === b.id);
  const up = (p: Parameters<typeof s.updateBlock>[1]) => s.updateBlock(b.id, p);
  const hasText = !['image', 'shape'].includes(b.kind);
  const book = !!d.school.book;
  return (
    <Section
      title={`${tx('Bloco', 'Block')}: ${BLOCK_LABEL[b.kind]}`}
      aside={
        <span className="row-inline">
          <button className={`icon-btn ${pinned ? 'on' : ''}`} onClick={() => s.togglePin(b.id)} title={tx('Fixar (P)', 'Pin (P)')}>
            <Icon name="pin" size={16} />
          </button>
          <button className="icon-btn" onClick={() => s.duplicateBlock(b.id)} title={tx('Duplicar', 'Duplicate')}>
            <Icon name="copy" size={16} />
          </button>
          <button className="icon-btn" onClick={() => s.removeBlock(b.id)} title={tx('Excluir (Del)', 'Delete (Del)')}>
            <Icon name="trash" size={16} />
          </button>
        </span>
      }
    >
      {hasText && <textarea className="input" rows={b.kind === 'body' || b.kind === 'toc' || b.kind === 'notes' ? 5 : 2} value={b.text} onChange={(e) => up({ text: e.target.value })} aria-label={tx('Texto', 'Text')} />}
      {book && b.kind === 'body' && <p className="hint">{markupHelp()}</p>}
      {b.kind === 'chapter' && <p className="hint">{tx('Formato “número|título”. O número é composto como a escola pede (romano, arábico ou por extenso).', 'Format “number|title”. The number is set as the school asks (roman, arabic or spelled out).')}</p>}
      {b.kind === 'epigraph' && <p className="hint">{tx('Formato “texto|autor”.', 'Format “text|author”.')}</p>}
      {b.kind === 'toc' && <p className="hint">{tx('Uma entrada por linha: “número|título|página”.', 'One entry per line: “number|title|page”.')}</p>}
      {b.kind === 'notes' && <p className="hint">{tx('Uma nota por linha: “chamada|texto”.', 'One note per line: “mark|text”.')}</p>}
      {book && b.kind === 'body' && (
        <div className="row2">
          <Toggle label={tx('Capitular e versaletes', 'Drop cap and small caps')} checked={!!b.dropcap} onChange={(v) => up({ dropcap: v })} />
          <Toggle label={tx('Continua da página anterior', 'Continues from the previous page')} checked={!!b.cont} onChange={(v) => up({ cont: v })} />
        </div>
      )}
      <div className="grid4">
        <label>
          col
          <input className="input" type="number" min={1} max={C} value={b.c + 1} onChange={(e) => up({ c: Math.max(0, Math.min(C - b.cs, Number(e.target.value) - 1)) })} />
        </label>
        <label>
          {tx('linha', 'row')}
          <input className="input" type="number" min={1} max={R} value={b.r + 1} onChange={(e) => up({ r: Math.max(0, Math.min(R - b.rs, Number(e.target.value) - 1)) })} />
        </label>
        <label>
          {tx('largura', 'width')}
          <input className="input" type="number" min={1} max={C} value={b.cs} onChange={(e) => up({ cs: Math.max(1, Math.min(C - b.c, Number(e.target.value))) })} />
        </label>
        <label>
          {tx('altura', 'height')}
          <input className="input" type="number" min={1} max={R} value={b.rs} onChange={(e) => up({ rs: Math.max(1, Math.min(R - b.r, Number(e.target.value))) })} />
        </label>
      </div>
      <div className="row2">
        <select className="select" value={b.tone} onChange={(e) => up({ tone: e.target.value as Tone })} aria-label={tx('Cor', 'Color')}>
          <option value="ink">{tx('Tinta', 'Ink')}</option>
          <option value="accent">{tx('Acento', 'Accent')}</option>
          <option value="accent2">{tx('Acento 2', 'Accent 2')}</option>
          <option value="accent3">{tx('Acento 3', 'Accent 3')}</option>
          <option value="image">{tx('Cinza (foto)', 'Gray (photo)')}</option>
        </select>
        <select className="select" value={b.align} onChange={(e) => up({ align: e.target.value as 'left' | 'center' | 'right' })} aria-label={tx('Alinhamento', 'Alignment')}>
          <option value="left">{tx('Alinhado à esquerda', 'Flush left')}</option>
          <option value="center">{tx('Centralizado', 'Centered')}</option>
          <option value="right">{tx('Alinhado à direita', 'Flush right')}</option>
        </select>
      </div>
      {b.kind === 'shape' && (
        <select className="select" value={b.shape} onChange={(e) => up({ shape: e.target.value as ShapeKind })} aria-label={tx('Forma', 'Shape')}>
          <option value="circle">{tx('Círculo', 'Circle')}</option>
          <option value="square">{tx('Quadrado', 'Square')}</option>
          <option value="triangle">{tx('Triângulo', 'Triangle')}</option>
          <option value="wedge">{tx('Cunha', 'Wedge')}</option>
        </select>
      )}
      <Slider label={tx('Rotação', 'Rotation')} value={b.rotate} min={-90} max={90} step={1} digits={0} suffix="°" onChange={(v) => up({ rotate: v })} />
      <Toggle label={tx('Filete superior', 'Top rule')} checked={!!b.rule} onChange={(v) => up({ rule: v })} />
    </Section>
  );
}

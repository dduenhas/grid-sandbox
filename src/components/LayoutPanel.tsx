import { ARCHETYPES, BLOCK_LABEL, getArchetype, type BlockKind, type ShapeKind, type Tone } from '../core/layoutGenerator';
import { useDerived, useStore, type AutoTarget } from '../store/useStore';
import type { PlaceholderLang } from '../content/placeholders';
import type { ArchetypeId } from '../content/schools';
import { Icon } from './Icon';
import { Section, Segmented, Slider, Toggle } from './ui';

const ADDABLE: BlockKind[] = ['headline', 'kicker', 'subhead', 'body', 'image', 'caption', 'quote', 'folio', 'shape', 'logo'];

export function LayoutPanel() {
  const s = useStore();
  const d = useDerived();
  const arch = getArchetype(d.archetype);
  return (
    <div className="panel-inner">
      <Section title="Modo">
        <Segmented
          label="Modo"
          value={s.mode}
          options={[
            { id: 'auto', label: 'Automático' },
            { id: 'manual', label: 'Manual (arrastar)' },
          ]}
          onChange={(m) => s.set({ mode: m })}
        />
        <p className="hint">
          {s.mode === 'auto'
            ? 'Use ◀ ▶ para percorrer combinações. Clique num bloco e fixe-o (P) para mantê-lo nas próximas.'
            : 'Arraste os blocos: eles encaixam nas colunas e campos. Puxe o quadrado vermelho para redimensionar. Setas movem; Shift+setas redimensionam.'}
        </p>
      </Section>
      <Section title="Combinação">
        <select className="select" value={s.archetypeLock ?? ''} onChange={(e) => s.set({ archetypeLock: (e.target.value || null) as ArchetypeId | null, variation: 0, selectedId: null })} aria-label="Arquétipo">
          <option value="">Automático (ciclo da escola)</option>
          {ARCHETYPES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <p className="lead small">
          <strong>{arch.name}.</strong> {arch.description}
        </p>
        <div className="row2">
          <select className="select" value={s.lang} onChange={(e) => s.set({ lang: e.target.value as PlaceholderLang })} aria-label="Texto de preenchimento">
            <option value="pt">Texto em português</option>
            <option value="grid">Texto sobre grids</option>
            <option value="latin">Lorem ipsum</option>
          </select>
          <select className="select" value={s.autoTarget} onChange={(e) => s.set({ autoTarget: e.target.value as AutoTarget })} aria-label="O que o autoplay muda">
            <option value="variations">Autoplay: variações</option>
            <option value="grids">Autoplay: grids</option>
            <option value="schools">Autoplay: escolas</option>
            <option value="all">Autoplay: tudo</option>
          </select>
        </div>
        <Slider label="Intervalo" value={s.autoplayMs / 1000} min={0.8} max={8} step={0.2} suffix="s" onChange={(v) => s.set({ autoplayMs: v * 1000 })} />
      </Section>
      <Section title={`Análise · ${d.score.total}/100`}>
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
        title="Adicionar elemento"
        aside={
          <span className="row-inline">
            <button className="icon-btn" onClick={s.undo} disabled={!s.past.length} title="Desfazer (Ctrl+Z)">
              <Icon name="undo" size={16} />
            </button>
            <button className="icon-btn" onClick={s.redo} disabled={!s.future.length} title="Refazer (Ctrl+Shift+Z)">
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
            descartar edições desta variação
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
  return (
    <Section
      title={`Bloco: ${BLOCK_LABEL[b.kind]}`}
      aside={
        <span className="row-inline">
          <button className={`icon-btn ${pinned ? 'on' : ''}`} onClick={() => s.togglePin(b.id)} title="Fixar (P)">
            <Icon name="pin" size={16} />
          </button>
          <button className="icon-btn" onClick={() => s.duplicateBlock(b.id)} title="Duplicar">
            <Icon name="copy" size={16} />
          </button>
          <button className="icon-btn" onClick={() => s.removeBlock(b.id)} title="Excluir (Del)">
            <Icon name="trash" size={16} />
          </button>
        </span>
      }
    >
      {hasText && <textarea className="input" rows={b.kind === 'body' ? 5 : 2} value={b.text} onChange={(e) => up({ text: e.target.value })} aria-label="Texto" />}
      <div className="grid4">
        <label>
          col
          <input className="input" type="number" min={1} max={C} value={b.c + 1} onChange={(e) => up({ c: Math.max(0, Math.min(C - b.cs, Number(e.target.value) - 1)) })} />
        </label>
        <label>
          linha
          <input className="input" type="number" min={1} max={R} value={b.r + 1} onChange={(e) => up({ r: Math.max(0, Math.min(R - b.rs, Number(e.target.value) - 1)) })} />
        </label>
        <label>
          largura
          <input className="input" type="number" min={1} max={C} value={b.cs} onChange={(e) => up({ cs: Math.max(1, Math.min(C - b.c, Number(e.target.value))) })} />
        </label>
        <label>
          altura
          <input className="input" type="number" min={1} max={R} value={b.rs} onChange={(e) => up({ rs: Math.max(1, Math.min(R - b.r, Number(e.target.value))) })} />
        </label>
      </div>
      <div className="row2">
        <select className="select" value={b.tone} onChange={(e) => up({ tone: e.target.value as Tone })} aria-label="Cor">
          <option value="ink">Tinta</option>
          <option value="accent">Acento</option>
          <option value="accent2">Acento 2</option>
          <option value="accent3">Acento 3</option>
          <option value="image">Cinza (foto)</option>
        </select>
        <select className="select" value={b.align} onChange={(e) => up({ align: e.target.value as 'left' | 'center' | 'right' })} aria-label="Alinhamento">
          <option value="left">Alinhado à esquerda</option>
          <option value="center">Centralizado</option>
          <option value="right">Alinhado à direita</option>
        </select>
      </div>
      {b.kind === 'shape' && (
        <select className="select" value={b.shape} onChange={(e) => up({ shape: e.target.value as ShapeKind })} aria-label="Forma">
          <option value="circle">Círculo</option>
          <option value="square">Quadrado</option>
          <option value="triangle">Triângulo</option>
          <option value="wedge">Cunha</option>
        </select>
      )}
      <Slider label="Rotação" value={b.rotate} min={-90} max={90} step={1} digits={0} suffix="°" onChange={(v) => up({ rotate: v })} />
      <Toggle label="Filete superior" checked={!!b.rule} onChange={(v) => up({ rule: v })} />
    </Section>
  );
}

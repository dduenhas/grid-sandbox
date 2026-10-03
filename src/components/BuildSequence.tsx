import { useEffect } from 'react';
import { BUILD_STEPS } from '../content/concepts';
import { useDerived, useStore } from '../store/useStore';
import { fmt, fmtPt } from '../core/units';
import { Icon } from './Icon';

/** Step-by-step construction of the grid, like drawing it on the mat: format, margins, columns... */
export function BuildCaption() {
  const s = useStore();
  const d = useDerived();
  const step = s.buildStep;

  useEffect(() => {
    if (step === null || !s.buildPlaying) return;
    const t = setTimeout(() => {
      if (step >= BUILD_STEPS.length - 1) useStore.getState().set({ buildPlaying: false });
      else useStore.getState().set({ buildStep: step + 1 });
    }, 2300);
    return () => clearTimeout(t);
  }, [step, s.buildPlaying]);

  if (step === null) return null;
  const info = BUILD_STEPS[step];
  const g = d.grid;
  const u = d.page.unit;
  const facts: Record<string, string> = {
    page: `${d.format.name}: ${fmt(d.page.w, u)} × ${fmt(d.page.h, u)}${s.spread ? ' (página dupla)' : ''}`,
    margins: `Sup. ${fmt(g.margins.top, u)} · Int. ${fmt(g.margins.inner, u)} · Ext. ${fmt(g.margins.outer, u)} · Inf. ${fmt(g.margins.bottom, u)}`,
    columns: `${d.spec.cols} colunas de ${fmt(g.cols[0].size, u)}${d.spec.colRatios ? ' (proporcionais)' : ''}`,
    gutters: `Calha ${fmt(g.gutterX, u)}${d.spec.baselineLock ? ' = 1 entrelinha' : ''}`,
    rows: `${g.rows.length} linhas → ${g.cols.length * g.rows.length} campos`,
    baseline: `Entrelinha ${fmtPt(g.baseline, u)} · ${d.spec.baselineLock ? 'campos travados na entrelinha' : 'campos livres'}`,
    elements: `${d.blocks.length} elementos · ${d.blocks.filter((b) => b.kind === 'image').length} imagens`,
  };

  return (
    <div className="build-caption" role="status" aria-live="polite">
      <div className="build-head">
        <strong>{info.title}</strong>
        <button className="icon-btn" onClick={() => s.set({ buildStep: null, buildPlaying: false })} title="Fechar (Esc)">
          <Icon name="close" size={16} />
        </button>
      </div>
      <p>{info.text}</p>
      <p className="mono small">{facts[info.id]}</p>
      <div className="build-ctrl">
        <button className="icon-btn" disabled={step === 0} onClick={() => s.set({ buildStep: step - 1, buildPlaying: false })}>
          <Icon name="prev" size={16} />
        </button>
        <div className="dots">
          {BUILD_STEPS.map((b, i) => (
            <button key={b.id} className={`dot ${i <= step ? 'on' : ''}`} onClick={() => s.set({ buildStep: i, buildPlaying: false })} aria-label={b.title} />
          ))}
        </div>
        <button className="icon-btn" onClick={() => s.set({ buildPlaying: !s.buildPlaying })}>
          <Icon name={s.buildPlaying ? 'pause' : 'play'} size={16} />
        </button>
        <button className="icon-btn" disabled={step >= BUILD_STEPS.length - 1} onClick={() => s.set({ buildStep: step + 1, buildPlaying: false })}>
          <Icon name="next" size={16} />
        </button>
      </div>
    </div>
  );
}

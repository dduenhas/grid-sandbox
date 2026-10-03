import { memo } from 'react';
import { FORMATS, type PageSize } from '../core/formats';
import { buildGrid, type GridSpec } from '../core/gridEngine';
import type { GridPreset } from '../core/gridPresets';
import { useDerived, useStore } from '../store/useStore';
import { Section, Segmented, Slider, Toggle } from './ui';
import { docToPt, ptToDoc } from '../core/units';

export function LeftPanel() {
  return (
    <div className="panel-inner">
      <FormatPicker />
      <GridPicker />
      <GridParams />
    </div>
  );
}

function FormatPicker() {
  const s = useStore();
  const d = useDerived();
  return (
    <Section title="Formato">
      <select className="select" value={s.formatId} onChange={(e) => s.setFormat(e.target.value)} aria-label="Formato">
        <optgroup label="Impresso">
          {FORMATS.filter((f) => f.medium === 'print').map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Tela">
          {FORMATS.filter((f) => f.medium === 'screen').map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </optgroup>
        <option value="custom">Personalizado…</option>
      </select>
      {s.formatId === 'custom' && (
        <div className="row3">
          <input className="input" type="number" min={10} value={s.custom.w} onChange={(e) => s.set({ custom: { ...s.custom, w: Math.max(10, Number(e.target.value)) }, gridOverrides: {} })} aria-label="Largura" />
          <input className="input" type="number" min={10} value={s.custom.h} onChange={(e) => s.set({ custom: { ...s.custom, h: Math.max(10, Number(e.target.value)) }, gridOverrides: {} })} aria-label="Altura" />
          <select className="select" value={s.custom.unit} onChange={(e) => s.set({ custom: { ...s.custom, unit: e.target.value as 'mm' | 'px' }, gridOverrides: {} })} aria-label="Unidade">
            <option value="mm">mm</option>
            <option value="px">px</option>
          </select>
        </div>
      )}
      <div className="row2">
        <Segmented
          label="Orientação"
          value={s.orientation}
          options={[
            { id: 'portrait', label: 'Retrato' },
            { id: 'landscape', label: 'Paisagem' },
          ]}
          onChange={(o) => o !== s.orientation && s.toggleOrientation()}
        />
        <Toggle label="Página dupla" checked={s.spread} onChange={(v) => s.set({ spread: v, selectedId: null })} />
      </div>
      <p className="hint mono">
        {Math.round(d.page.w * 10) / 10} × {Math.round(d.page.h * 10) / 10} {d.page.unit}
        {d.format.note ? ` · ${d.format.note}` : ''}
      </p>
    </Section>
  );
}

const Thumb = memo(function Thumb({ preset, page }: { preset: GridPreset; page: PageSize }) {
  const g = buildGrid(preset.spec, page, false);
  const sw = Math.max(page.w, page.h) / 90;
  return (
    <svg viewBox={`0 0 ${page.w} ${page.h}`} className="thumb-svg" aria-hidden>
      <rect width={page.w} height={page.h} fill="#fbfbf8" />
      <g transform={g.rotation ? `rotate(${g.rotation} ${page.w / 2} ${page.h / 2})` : undefined}>
        {g.cols.map((c, i) => g.rows.map((r, j) => <rect key={`${i}-${j}`} x={c.start} y={r.start} width={c.size} height={r.size} fill="rgba(20,20,20,.13)" />))}
      </g>
      {g.guides
        .filter((l) => l.kind !== 'gerstner')
        .map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(226,35,26,.6)" strokeWidth={sw} />
        ))}
    </svg>
  );
});

function GridPicker() {
  const s = useStore();
  const d = useDerived();
  return (
    <Section title={`Grids (${d.presets.length})`} aside={<span className="hint">ordenados por adequação</span>}>
      <div className="thumbs">
        {d.presets.map((p, i) => (
          <button key={p.id} className={`thumb ${p.id === d.preset.id ? 'on' : ''}`} onClick={() => s.setGrid(p.id)} title={`${p.type.name}${i < 9 ? ` (${i + 1})` : ''}`}>
            <Thumb preset={p} page={d.page} />
            <span className="thumb-label">
              {i < 9 && <kbd>{i + 1}</kbd>}
              {p.type.short}
            </span>
            <span className="thumb-score" style={{ width: `${Math.min(100, p.score * 100)}%` }} />
          </button>
        ))}
      </div>
    </Section>
  );
}

function GridParams() {
  const s = useStore();
  const d = useDerived();
  const sp = d.spec;
  const u = d.page.unit;
  const mm = u === 'mm';
  const maxM = Math.min(d.page.w, d.page.h) / 3;
  const stepL = mm ? 0.5 : 4;
  const set = (p: Partial<GridSpec>) => s.setOverride(p);
  const m = sp.margins;
  const sfx = mm ? 'mm' : 'px';
  return (
    <Section
      title="Parâmetros do grid"
      aside={
        Object.keys(s.gridOverrides).length > 0 ? (
          <button className="link" onClick={s.resetOverrides}>
            restaurar
          </button>
        ) : undefined
      }
    >
      <Slider label="Colunas" value={sp.cols} min={1} max={16} step={1} digits={0} onChange={(v) => set({ cols: v, colRatios: v === d.preset.spec.cols ? d.preset.spec.colRatios : undefined })} />
      <Slider label="Linhas (campos)" value={sp.rows} min={1} max={16} step={1} digits={0} onChange={(v) => set({ rows: v, rowRatios: v === d.preset.spec.rows ? d.preset.spec.rowRatios : undefined })} />
      <Slider label="Calha horizontal" value={sp.gutterX} min={0} max={mm ? 20 : 80} step={stepL / 2} suffix={sfx} onChange={(v) => set({ gutterX: v })} />
      <Slider label="Calha vertical" value={sp.gutterY} min={0} max={mm ? 20 : 80} step={stepL / 2} suffix={sfx} onChange={(v) => set({ gutterY: v })} />
      <Slider label={mm ? 'Entrelinha (pt)' : 'Linha de base (px)'} value={docToPt(sp.baseline, u)} min={mm ? 5 : 2} max={mm ? 48 : 64} step={mm ? 0.5 : 1} suffix="pt" onChange={(v) => set({ baseline: ptToDoc(v, u) })} />
      <Toggle label="Travar campos na entrelinha (Müller-Brockmann)" checked={sp.baselineLock} onChange={(v) => set({ baselineLock: v })} />
      <div className="subhead-sm">Margens</div>
      <Slider label="Superior" value={m.top} min={0} max={maxM} step={stepL} suffix={sfx} onChange={(v) => set({ margins: { ...m, top: v } })} />
      <Slider label="Inferior" value={m.bottom} min={0} max={maxM} step={stepL} suffix={sfx} onChange={(v) => set({ margins: { ...m, bottom: v } })} />
      <Slider label={s.spread ? 'Interna (lombada)' : 'Esquerda (interna)'} value={m.inner} min={0} max={maxM} step={stepL} suffix={sfx} onChange={(v) => set({ margins: { ...m, inner: v } })} />
      <Slider label={s.spread ? 'Externa (corte)' : 'Direita (externa)'} value={m.outer} min={0} max={maxM} step={stepL} suffix={sfx} onChange={(v) => set({ margins: { ...m, outer: v } })} />
      {sp.baselineLock && Math.abs(d.grid.margins.bottom - m.bottom) > 0.05 && <p className="hint">Margem inferior efetiva: {Math.round(d.grid.margins.bottom * 10) / 10} {sfx} (ajustada para fechar os campos na entrelinha).</p>}
      <Slider label="Rotação do grid" value={sp.rotation} min={-45} max={45} step={1} digits={0} suffix="°" onChange={(v) => set({ rotation: v })} />
    </Section>
  );
}

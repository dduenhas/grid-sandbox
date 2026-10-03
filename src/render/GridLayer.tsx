import type { Grid } from '../core/gridEngine';
import type { Overlays } from '../store/useStore';
import { round } from '../core/units';
import type { InkColors } from './theme';

export const BUILD_INDEX = { page: 0, margins: 1, columns: 2, gutters: 3, rows: 4, baseline: 5, elements: 6 } as const;

interface Props {
  grid: Grid;
  overlays: Overlays;
  ink: InkColors;
  hair: number;
  buildStep: number | null;
  exportMode: boolean;
}

/** Grid structure drawn inside the (possibly rotated) content group. */
export function GridStructure({ grid, overlays, ink, hair, buildStep, exportMode }: Props) {
  const show = (k: keyof Overlays, step: number) => (buildStep === null ? overlays[k] : buildStep >= step);
  const anim = (step: number) => (buildStep === step && !exportMode ? 'draw' : undefined);
  const { live, cols, rows } = grid;
  const top = rows[0].start;
  const bottom = rows[rows.length - 1].start + rows[rows.length - 1].size;
  const pagesCols = grid.spread ? [cols.slice(0, grid.spineCol), cols.slice(grid.spineCol)] : [cols];

  const baselines: number[] = [];
  if (grid.baseline > 0) {
    for (let y = grid.baselineOrigin + grid.baseline; y <= grid.height - grid.margins.bottom + 1e-6; y += grid.baseline) baselines.push(y);
  }

  return (
    <g id="Grid">
      {show('modules', BUILD_INDEX.rows) && (
        <g id="Modulos" className={anim(BUILD_INDEX.rows)}>
          {cols.map((c, ci) => rows.map((r, ri) => <rect key={`${ci}-${ri}`} x={c.start} y={r.start} width={c.size} height={r.size} fill={ink.module} />))}
        </g>
      )}
      {show('columns', BUILD_INDEX.columns) && (
        <g id="Colunas" className={anim(BUILD_INDEX.columns)}>
          {cols.map((c, i) => (
            <rect key={i} x={c.start} y={top} width={c.size} height={bottom - top} fill={ink.column} />
          ))}
          {cols.map((c, i) => (
            <g key={`l${i}`} stroke={ink.line} strokeWidth={hair}>
              <line x1={c.start} y1={top} x2={c.start} y2={bottom} pathLength={1} />
              <line x1={c.start + c.size} y1={top} x2={c.start + c.size} y2={bottom} pathLength={1} />
            </g>
          ))}
        </g>
      )}
      {buildStep === BUILD_INDEX.gutters && (
        <g id="Calhas" className="pulse">
          {pagesCols.map((pc) =>
            pc.slice(0, -1).map((c, i) => (
              <rect key={`${c.start}-${i}`} x={c.start + c.size} y={top} width={grid.gutterX} height={bottom - top} fill={ink.gutter} />
            )),
          )}
          {live.map((l, li) =>
            rows.slice(0, -1).map((r, i) => (
              <rect key={`r${li}-${i}`} x={l.x} y={r.start + r.size} width={l.w} height={grid.gutterY} fill={ink.gutter} opacity={0.5} />
            )),
          )}
        </g>
      )}
      {show('rows', BUILD_INDEX.rows) && (
        <g id="Campos" stroke={ink.line} strokeWidth={hair} className={anim(BUILD_INDEX.rows)}>
          {live.map((l, li) =>
            rows.map((r, i) => (
              <g key={`${li}-${i}`}>
                <line x1={l.x} y1={r.start} x2={l.x + l.w} y2={r.start} pathLength={1} />
                <line x1={l.x} y1={r.start + r.size} x2={l.x + l.w} y2={r.start + r.size} pathLength={1} />
              </g>
            )),
          )}
        </g>
      )}
      {show('baseline', BUILD_INDEX.baseline) && baselines.length < 1500 && (
        <g id="Linha-de-base" stroke={ink.baseline} strokeWidth={hair * 0.8} className={anim(BUILD_INDEX.baseline)}>
          {live.map((l, li) => baselines.map((y) => <line key={`${li}-${y}`} x1={l.x} y1={y} x2={l.x + l.w} y2={y} pathLength={1} />))}
        </g>
      )}
      {show('margins', BUILD_INDEX.margins) && (
        <g id="Margens" fill="none" stroke={ink.margin} strokeWidth={hair * 1.2} className={anim(BUILD_INDEX.margins)}>
          {live.map((l, i) => (
            <rect key={i} x={l.x} y={l.y} width={l.w} height={l.h} pathLength={1} />
          ))}
        </g>
      )}
    </g>
  );
}

export function Guides({ grid, overlays, ink, hair, buildStep }: Omit<Props, 'exportMode'>) {
  const showGuides = buildStep === null ? overlays.guides : buildStep >= BUILD_INDEX.elements;
  const eight = overlays.eightpt || grid.spec.guides.includes('eightpt');
  const unit = grid.page.unit === 'mm' ? (8 / 72) * 25.4 : 8;
  return (
    <g id="Guias" pointerEvents="none">
      {showGuides &&
        grid.guides
          .filter((g) => g.kind !== 'eightpt')
          .map((g, i) => (
            <line
              key={i}
              x1={g.x1}
              y1={g.y1}
              x2={g.x2}
              y2={g.y2}
              stroke={ink.guide[g.kind]}
              strokeWidth={hair}
              strokeDasharray={g.dashed ? `${hair * 4} ${hair * 3}` : undefined}
            />
          ))}
      {eight && (buildStep === null ? overlays.eightpt || overlays.guides : false) && (
        <EightPt w={grid.width} h={grid.height} unit={unit} color={ink.guide.eightpt} hair={hair} />
      )}
    </g>
  );
}

function EightPt({ w, h, unit, color, hair }: { w: number; h: number; unit: number; color: string; hair: number }) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let x = unit; x < w; x += unit) xs.push(x);
  for (let y = unit; y < h; y += unit) ys.push(y);
  if (xs.length * ys.length > 200000) return null;
  return (
    <g stroke={color} strokeWidth={hair * 0.7}>
      {xs.map((x) => (
        <line key={`x${x}`} x1={x} y1={0} x2={x} y2={h} />
      ))}
      {ys.map((y) => (
        <line key={`y${y}`} x1={0} y1={y} x2={w} y2={y} />
      ))}
    </g>
  );
}

/** Measurement labels for margins, columns and gutters. */
export function Dimensions({ grid, ink, hair }: { grid: Grid; ink: InkColors; hair: number }) {
  const u = grid.page.unit;
  const fs = Math.min(grid.width, grid.height) * 0.018;
  const l = grid.live[0];
  const c0 = grid.cols[0];
  const unitLbl = u === 'mm' ? '' : 'px';
  const t = (v: number) => `${round(v, 1)}${unitLbl}`;
  return (
    <g id="Cotas" className="ui-only" fontFamily="IBM Plex Mono, monospace" fontSize={fs} fill={ink.label}>
      <text x={l.x + l.w / 2} y={grid.margins.top / 2 + fs / 3} textAnchor="middle">
        {t(grid.margins.top)}
      </text>
      <text x={l.x + l.w / 2} y={grid.height - grid.margins.bottom / 2 + fs / 3} textAnchor="middle">
        {t(grid.margins.bottom)}
      </text>
      <text x={l.x / 2} y={grid.height / 2} textAnchor="middle" transform={`rotate(-90 ${l.x / 2} ${grid.height / 2})`}>
        {t(l.x - grid.pages[0].x)}
      </text>
      <text x={l.x + l.w + (grid.pages[0].x + grid.page.w - l.x - l.w) / 2} y={grid.height / 2} textAnchor="middle" transform={`rotate(-90 ${l.x + l.w + (grid.pages[0].x + grid.page.w - l.x - l.w) / 2} ${grid.height / 2})`}>
        {t(grid.pages[0].x + grid.page.w - l.x - l.w)}
      </text>
      <g stroke={ink.label} strokeWidth={hair}>
        <line x1={c0.start} y1={l.y - fs * 0.9} x2={c0.start + c0.size} y2={l.y - fs * 0.9} />
      </g>
      <text x={c0.start + c0.size / 2} y={l.y - fs * 1.3} textAnchor="middle">
        col {t(c0.size)}
      </text>
      {grid.cols.length > 1 && (
        <text x={c0.start + c0.size + grid.gutterX / 2} y={l.y - fs * 2.6} textAnchor="middle">
          calha {t(grid.gutterX)}
        </text>
      )}
    </g>
  );
}

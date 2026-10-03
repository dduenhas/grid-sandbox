import type { PageSize } from './formats';

export type GridTypeId =
  | 'manuscript'
  | 'manuscript-notes'
  | 'col-2'
  | 'col-3'
  | 'col-4'
  | 'col-5'
  | 'col-6'
  | 'col-12'
  | 'mod-3x3'
  | 'mod-4x6'
  | 'mod-6x8'
  | 'hierarchical'
  | 'golden'
  | 'thirds'
  | 'fibonacci'
  | 'gerstner'
  | 'diagonal'
  | 'eightpt';

export type GuideKind = 'canon' | 'golden' | 'thirds' | 'diagonals' | 'gerstner' | 'eightpt';

export interface Margins {
  top: number;
  bottom: number;
  /** Spine side. On a single page it is the left margin. */
  inner: number;
  /** Fore-edge side. On a single page it is the right margin. */
  outer: number;
}

export interface GridSpec {
  type: GridTypeId;
  cols: number;
  rows: number;
  colRatios?: number[];
  rowRatios?: number[];
  margins: Margins;
  gutterX: number;
  gutterY: number;
  baseline: number;
  baselineLock: boolean;
  rotation: number;
  guides: GuideKind[];
}

export interface Track {
  start: number;
  size: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GuideLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  kind: GuideKind;
  dashed?: boolean;
}

export interface Grid {
  spec: GridSpec;
  page: PageSize;
  spread: boolean;
  width: number;
  height: number;
  pages: Rect[];
  live: Rect[];
  cols: Track[];
  rows: Track[];
  /** Index in `cols` where the right-hand page starts (spread only). */
  spineCol: number;
  baseline: number;
  /** Y of the first baseline. Subsequent baselines repeat every `baseline`. */
  baselineOrigin: number;
  /** Effective margins after baseline lock adjustments. */
  margins: Margins;
  gutterX: number;
  gutterY: number;
  guides: GuideLine[];
  rotation: number;
}

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

function normRatios(n: number, ratios?: number[]): number[] {
  if (ratios && ratios.length === n && ratios.every((r) => r > 0)) return ratios;
  return Array.from({ length: n }, () => 1);
}

/** Splits `total` into tracks proportional to `ratios`, separated by `gutter`. */
export function splitTracks(start: number, total: number, ratios: number[], gutter: number): Track[] {
  const n = ratios.length;
  const avail = total - gutter * (n - 1);
  const rs = sum(ratios);
  const out: Track[] = [];
  let pos = start;
  for (const r of ratios) {
    const size = (avail * r) / rs;
    out.push({ start: pos, size });
    pos += size + gutter;
  }
  return out;
}

/** Largest-remainder distribution of an integer total by ratios, each part >= 1. */
export function distributeInt(total: number, ratios: number[]): number[] {
  const n = ratios.length;
  const rs = sum(ratios);
  const extra = total - n;
  if (extra < 0) return ratios.map(() => 1);
  const raw = ratios.map((r) => (extra * r) / rs);
  const parts = raw.map((v) => Math.floor(v));
  let rem = extra - sum(parts);
  const order = raw.map((v, i) => [v - Math.floor(v), i] as const).sort((a, b) => b[0] - a[0]);
  for (let k = 0; rem > 0; k = (k + 1) % n, rem--) parts[order[k][1]]++;
  return parts.map((p) => p + 1);
}

/** Keeps every track at least as wide as the gutter. */
const clampGutter = (g: number, total: number, n: number) => (n <= 1 ? g : Math.max(0, Math.min(g, total / (2 * n - 1))));

interface RowResult {
  rows: Track[];
  liveH: number;
  gutterY: number;
}

function buildRows(spec: GridSpec, top: number, liveH: number): RowResult {
  const n = Math.max(1, spec.rows);
  const ratios = normRatios(n, spec.rowRatios);
  const b = spec.baseline;
  if (spec.baselineLock && b > 0) {
    const totalLines = Math.floor(liveH / b + 1e-6);
    const gLines = n > 1 ? Math.max(1, Math.round(spec.gutterY / b)) : 0;
    const fieldLines = totalLines - (n - 1) * gLines;
    if (fieldLines >= n) {
      const parts = distributeInt(fieldLines, ratios);
      const rows: Track[] = [];
      let pos = top;
      for (const p of parts) {
        rows.push({ start: pos, size: p * b });
        pos += p * b + gLines * b;
      }
      return { rows, liveH: (fieldLines + (n - 1) * gLines) * b, gutterY: gLines * b };
    }
  }
  const g = clampGutter(spec.gutterY, liveH, n);
  return { rows: splitTracks(top, liveH, ratios, g), liveH, gutterY: g };
}

export function buildGrid(spec: GridSpec, page: PageSize, spread = false): Grid {
  const { w, h } = page;
  const m = spec.margins;
  const nPages = spread ? 2 : 1;
  const width = w * nPages;
  const pages: Rect[] = Array.from({ length: nPages }, (_, i) => ({ x: i * w, y: 0, w, h }));

  const liveW = Math.max(1, w - m.inner - m.outer);
  const liveH0 = Math.max(1, h - m.top - m.bottom);
  const { rows, liveH, gutterY } = buildRows(spec, m.top, liveH0);
  const margins: Margins = { ...m, bottom: h - m.top - liveH };

  const nCols = Math.max(1, spec.cols);
  const ratios = normRatios(nCols, spec.colRatios);
  const gutterX = clampGutter(spec.gutterX, liveW, nCols);

  const cols: Track[] = [];
  const live: Rect[] = [];
  let spineCol = 0;
  pages.forEach((p, i) => {
    const isLeft = spread && i === 0;
    const left = isLeft ? m.outer : m.inner;
    const pageRatios = isLeft ? [...ratios].reverse() : ratios;
    if (spread && i === 1) spineCol = cols.length;
    cols.push(...splitTracks(p.x + left, liveW, pageRatios, gutterX));
    live.push({ x: p.x + left, y: m.top, w: liveW, h: liveH });
  });

  return {
    spec,
    page,
    spread,
    width,
    height: h,
    pages,
    live,
    cols,
    rows,
    spineCol,
    baseline: spec.baseline,
    baselineOrigin: m.top,
    margins,
    gutterX,
    gutterY,
    guides: buildGuides(spec, pages, live, width, h),
    rotation: spec.rotation,
  };
}

function buildGuides(spec: GridSpec, pages: Rect[], live: Rect[], width: number, h: number): GuideLine[] {
  const out: GuideLine[] = [];
  const kinds = new Set(spec.guides);
  for (const p of pages) {
    if (kinds.has('diagonals') || kinds.has('canon')) {
      const kind: GuideKind = kinds.has('canon') ? 'canon' : 'diagonals';
      out.push({ x1: p.x, y1: 0, x2: p.x + p.w, y2: h, kind });
      out.push({ x1: p.x + p.w, y1: 0, x2: p.x, y2: h, kind });
    }
    if (kinds.has('golden')) {
      const phi = 0.381966;
      for (const f of [phi, 1 - phi]) {
        out.push({ x1: p.x + p.w * f, y1: 0, x2: p.x + p.w * f, y2: h, kind: 'golden' });
        out.push({ x1: p.x, y1: h * f, x2: p.x + p.w, y2: h * f, kind: 'golden' });
      }
    }
    if (kinds.has('thirds')) {
      for (const f of [1 / 3, 2 / 3]) {
        out.push({ x1: p.x + p.w * f, y1: 0, x2: p.x + p.w * f, y2: h, kind: 'thirds' });
        out.push({ x1: p.x, y1: h * f, x2: p.x + p.w, y2: h * f, kind: 'thirds' });
      }
    }
  }
  if (kinds.has('canon') && pages.length === 2) {
    out.push({ x1: 0, y1: h, x2: width, y2: 0, kind: 'canon' });
    out.push({ x1: 0, y1: 0, x2: width, y2: h, kind: 'canon' });
  }
  if (kinds.has('gerstner')) {
    // Karl Gerstner, "Capital" (1962): 58 units hold 1 to 6 columns with 2-unit gutters.
    for (const l of live) {
      const u = l.w / 58;
      for (const n of [2, 3, 4, 5]) {
        const cw = (58 - 2 * (n - 1)) / n;
        for (let i = 1; i < n; i++) {
          const x = l.x + u * (i * cw + (i - 1) * 2);
          out.push({ x1: x, y1: l.y, x2: x, y2: l.y + l.h, kind: 'gerstner', dashed: true });
          out.push({ x1: x + 2 * u, y1: l.y, x2: x + 2 * u, y2: l.y + l.h, kind: 'gerstner', dashed: true });
        }
      }
    }
  }
  return out;
}

/** Rectangle covered by a span of tracks. */
export function spanRect(grid: Grid, c: number, r: number, cs: number, rs: number): Rect {
  const c0 = grid.cols[Math.max(0, Math.min(c, grid.cols.length - 1))];
  const c1 = grid.cols[Math.max(0, Math.min(c + cs - 1, grid.cols.length - 1))];
  const r0 = grid.rows[Math.max(0, Math.min(r, grid.rows.length - 1))];
  const r1 = grid.rows[Math.max(0, Math.min(r + rs - 1, grid.rows.length - 1))];
  return { x: c0.start, y: r0.start, w: c1.start + c1.size - c0.start, h: r1.start + r1.size - r0.start };
}

/** Nearest track index whose start is closest to `v`. */
export function nearestTrack(tracks: Track[], v: number, edge: 'start' | 'end' = 'start'): number {
  let best = 0;
  let bestD = Infinity;
  tracks.forEach((t, i) => {
    const p = edge === 'start' ? t.start : t.start + t.size;
    const d = Math.abs(p - v);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

export function snapToBaseline(grid: Grid, y: number): number {
  const b = grid.baseline;
  if (b <= 0) return y;
  return grid.baselineOrigin + Math.round((y - grid.baselineOrigin) / b) * b;
}

export function isValidGrid(g: Grid): boolean {
  const ok = (t: Track) => Number.isFinite(t.start) && Number.isFinite(t.size) && t.size > 0;
  if (!g.cols.length || !g.rows.length || !g.cols.every(ok) || !g.rows.every(ok)) return false;
  const eps = 1e-6;
  return g.live.every((l, pi) => {
    const pageCols = g.spread ? (pi === 0 ? g.cols.slice(0, g.spineCol) : g.cols.slice(g.spineCol)) : g.cols;
    const inX = pageCols.every((c) => c.start >= l.x - eps && c.start + c.size <= l.x + l.w + eps);
    const inY = g.rows.every((r) => r.start >= l.y - eps && r.start + r.size <= l.y + l.h + eps);
    return inX && inY && l.y + l.h <= g.height + eps;
  });
}

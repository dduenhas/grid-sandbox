import type { PageSize } from './formats';
import type { GridSpec, GridTypeId, Margins } from './gridEngine';

export type GridFamily = 'manuscrito' | 'colunas' | 'modular' | 'proporcional' | 'tela' | 'experimental';

export interface GridType {
  id: GridTypeId;
  name: string;
  short: string;
  family: GridFamily;
  build: (p: PageSize) => GridSpec;
  /** 0..1 — how well the type suits the page (format, medium, orientation). */
  suit: (p: PageSize) => number;
}

const PHI = 1.618034;
const landscape = (p: PageSize) => p.w > p.h * 1.05;
const shortSide = (p: PageSize) => Math.min(p.w, p.h);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Snaps a length to a multiple of `q` (8px on screens, 1 baseline on print). */
const q = (v: number, step: number) => Math.max(step, Math.round(v / step) * step);

function swissMargins(p: PageSize, k = 1): Margins {
  if (p.medium === 'screen') {
    const m = q(clamp(p.w * 0.055, 16, 120) * k, 8);
    return { top: m, bottom: m, inner: m, outer: m };
  }
  const u = (shortSide(p) / 14) * k;
  return { top: u, bottom: u * 1.5, inner: u, outer: u };
}

/** Tschichold's progressive margins 2 : 3 : 4 : 6 (inner : top : outer : bottom). */
function progressiveMargins(p: PageSize): Margins {
  if (p.medium === 'screen') return swissMargins(p);
  const u = p.w / 24;
  return { inner: 2 * u, top: 3 * u * (p.h / p.w > 1 ? 1 : 0.8), outer: 4 * u, bottom: 6 * u * (p.h / p.w > 1 ? 1 : 0.7) };
}

/** Economical progression 2 : 3 : 4 : 6 used by trade books (text area around 60%). */
function tradeMargins(p: PageSize): Margins {
  if (p.medium === 'screen') return swissMargins(p);
  const u = Math.min(p.w, p.h * 0.7) / 26;
  return { inner: 2 * u, top: 3 * u, outer: 4 * u, bottom: 6 * u };
}

/** William Morris: each margin 20% larger than the previous (inner, top, outer, bottom). */
function morrisMargins(p: PageSize): Margins {
  if (p.medium === 'screen') return swissMargins(p);
  const u = Math.min(p.w, p.h * 0.7) * 0.085;
  return { inner: u, top: u * 1.2, outer: u * 1.44, bottom: u * 1.728 };
}

/** Van de Graaf canon: inner 1/9 of width, top 1/9 of height, outer and bottom twice that. */
function canonMargins(p: PageSize): Margins {
  if (p.medium === 'screen') {
    const m = q(p.w / 9, 8);
    return { inner: m, outer: m, top: q(p.h / 9, 8), bottom: q((p.h / 9) * 1.5, 8) };
  }
  return { inner: p.w / 9, top: p.h / 9, outer: (2 * p.w) / 9, bottom: (2 * p.h) / 9 };
}

function gutter(p: PageSize): number {
  if (p.medium === 'screen') return p.w >= 1000 ? 24 : 16;
  return p.leading;
}

function rowsFor(p: PageSize, m: Margins, cols: number, cap = 10): number {
  const liveW = p.w - m.inner - m.outer;
  const liveH = p.h - m.top - m.bottom;
  return clamp(Math.round((cols * liveH) / liveW), 3, cap);
}

function base(p: PageSize, type: GridTypeId, partial: Partial<GridSpec> & { cols: number; margins: Margins }): GridSpec {
  return {
    type,
    rows: partial.rows ?? rowsFor(p, partial.margins, partial.cols),
    gutterX: gutter(p),
    gutterY: gutter(p),
    baseline: p.leading,
    baselineLock: p.medium === 'print',
    rotation: 0,
    guides: [],
    ...partial,
  };
}

const colType = (n: number, name: string, suit: GridType['suit']): GridType => ({
  id: `col-${n}` as GridTypeId,
  name,
  short: `${n} col`,
  family: 'colunas',
  build: (p) => {
    const margins = swissMargins(p);
    return base(p, `col-${n}` as GridTypeId, { cols: n, margins });
  },
  suit,
});

export const GRID_TYPES: GridType[] = [
  {
    id: 'manuscript',
    name: 'Manuscrito (cânone Van de Graaf)',
    short: 'Manuscrito',
    family: 'manuscrito',
    build: (p) => {
      const margins = canonMargins(p);
      return base(p, 'manuscript', { cols: 1, rows: landscape(p) ? 5 : 8, margins, guides: ['canon'] });
    },
    suit: (p) => (p.medium === 'print' ? (landscape(p) ? 0.45 : 0.8) : 0.35),
  },
  {
    id: 'book-trade',
    name: 'Livro comercial (2:3:4:6 econômica)',
    short: 'Livro',
    family: 'manuscrito',
    build: (p) => base(p, 'book-trade', { cols: 1, rows: landscape(p) ? 5 : 8, margins: tradeMargins(p) }),
    suit: (p) => (p.medium === 'print' ? (landscape(p) ? 0.4 : 0.74) : 0.3),
  },
  {
    id: 'book-morris',
    name: 'Margens de Morris (+20% a cada margem)',
    short: 'Morris',
    family: 'manuscrito',
    build: (p) => base(p, 'book-morris', { cols: 1, rows: landscape(p) ? 5 : 8, margins: morrisMargins(p) }),
    suit: (p) => (p.medium === 'print' ? (landscape(p) ? 0.35 : 0.6) : 0.25),
  },
  {
    id: 'book-2col',
    name: 'Livro de referência em 2 colunas',
    short: 'Ref. 2 col',
    family: 'manuscrito',
    build: (p) => {
      const margins = tradeMargins(p);
      const spec = base(p, 'book-2col', { cols: 2, rows: landscape(p) ? 5 : 8, margins });
      return { ...spec, gutterX: p.medium === 'print' ? p.leading * 1.5 : spec.gutterX };
    },
    suit: (p) => (p.medium === 'print' ? (shortSide(p) >= 150 ? 0.55 : 0.35) : 0.25),
  },
  {
    id: 'manuscript-notes',
    name: 'Manuscrito com coluna de notas',
    short: 'Notas',
    family: 'manuscrito',
    build: (p) => {
      const margins = progressiveMargins(p);
      return base(p, 'manuscript-notes', { cols: 2, colRatios: [3, 1.15], margins, rows: landscape(p) ? 5 : 8 });
    },
    suit: (p) => (p.medium === 'print' ? 0.72 : 0.5),
  },
  colType(2, '2 colunas', (p) => (landscape(p) ? 0.75 : 0.68)),
  colType(3, '3 colunas', () => 0.8),
  colType(4, '4 colunas', (p) => (p.medium === 'screen' && p.w < 500 ? 0.9 : 0.78)),
  colType(5, '5 colunas (assimétrico)', (p) => (shortSide(p) > 150 ? 0.66 : 0.45)),
  colType(6, '6 colunas', (p) => (p.w > 200 ? 0.8 : 0.55)),
  {
    id: 'col-12',
    name: '12 colunas (sistema de telas)',
    short: '12 col',
    family: 'tela',
    build: (p) => {
      const margins = swissMargins(p);
      return base(p, 'col-12', { cols: 12, rows: rowsFor(p, margins, 12, 8), margins });
    },
    suit: (p) => (p.medium === 'screen' ? (p.w >= 768 ? 0.97 : 0.4) : p.w > 250 ? 0.6 : 0.3),
  },
  {
    id: 'mod-3x3',
    name: 'Modular 3 × 3',
    short: '3×3',
    family: 'modular',
    build: (p) => base(p, 'mod-3x3', { cols: 3, rows: 3, margins: swissMargins(p) }),
    suit: (p) => (Math.abs(p.w - p.h) < p.w * 0.2 ? 0.9 : 0.6),
  },
  {
    id: 'mod-4x6',
    name: 'Modular 4 × 6 (24 campos)',
    short: '4×6',
    family: 'modular',
    build: (p) => {
      const l = landscape(p);
      return base(p, 'mod-4x6', { cols: l ? 6 : 4, rows: l ? 4 : 6, margins: swissMargins(p) });
    },
    suit: () => 0.92,
  },
  {
    id: 'mod-6x8',
    name: 'Modular 6 × 8 (Müller-Brockmann)',
    short: '6×8',
    family: 'modular',
    build: (p) => {
      const l = landscape(p);
      return base(p, 'mod-6x8', { cols: l ? 8 : 6, rows: l ? 6 : 8, margins: swissMargins(p, 0.85) });
    },
    suit: (p) => (shortSide(p) >= 200 || p.medium === 'screen' ? 0.88 : 0.5),
  },
  {
    id: 'hierarchical',
    name: 'Hierárquico',
    short: 'Hierárq.',
    family: 'tela',
    build: (p) => {
      const l = landscape(p);
      return base(p, 'hierarchical', {
        cols: 3,
        colRatios: l ? [2, 1, 1] : [2, 1, 1.2],
        rows: 5,
        rowRatios: [0.45, 2, 1, 1, 0.45],
        margins: swissMargins(p),
      });
    },
    suit: (p) => (p.medium === 'screen' ? 0.85 : 0.6),
  },
  {
    id: 'golden',
    name: 'Seção áurea',
    short: 'Áurea',
    family: 'proporcional',
    build: (p) => {
      const l = landscape(p);
      return base(p, 'golden', {
        cols: 2,
        colRatios: [PHI, 1],
        rows: l ? 2 : 3,
        rowRatios: l ? [PHI, 1] : [1, PHI, 1],
        margins: swissMargins(p),
        guides: ['golden'],
      });
    },
    suit: () => 0.7,
  },
  {
    id: 'thirds',
    name: 'Regra dos terços',
    short: 'Terços',
    family: 'proporcional',
    build: (p) => base(p, 'thirds', { cols: 3, rows: 3, margins: swissMargins(p, 0.7), guides: ['thirds'] }),
    suit: (p) => (p.medium === 'screen' ? 0.72 : 0.6),
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci (1, 1, 2, 3, 5)',
    short: 'Fibonacci',
    family: 'proporcional',
    build: (p) => {
      const l = landscape(p);
      return base(p, 'fibonacci', {
        cols: l ? 5 : 4,
        colRatios: l ? [1, 1, 2, 3, 5] : [1, 1, 2, 3],
        rows: l ? 4 : 5,
        rowRatios: l ? [1, 1, 2, 3] : [1, 1, 2, 3, 5],
        margins: swissMargins(p),
      });
    },
    suit: () => 0.55,
  },
  {
    id: 'gerstner',
    name: 'Gerstner 58 unidades (1 a 6 colunas)',
    short: 'Gerstner',
    family: 'experimental',
    build: (p) => {
      const margins = swissMargins(p);
      const liveW = p.w - margins.inner - margins.outer;
      const liveH = p.h - margins.top - margins.bottom;
      return {
        ...base(p, 'gerstner', { cols: 6, rows: 6, margins, guides: ['gerstner'] }),
        gutterX: (liveW / 58) * 2,
        gutterY: (liveH / 58) * 2,
        baselineLock: false,
      };
    },
    suit: (p) => (shortSide(p) > 150 ? 0.7 : 0.4),
  },
  {
    id: 'diagonal',
    name: 'Diagonal construtivista',
    short: 'Diagonal',
    family: 'experimental',
    build: (p) => ({
      ...base(p, 'diagonal', { cols: 4, rows: 6, margins: swissMargins(p, 1.2), guides: ['diagonals'] }),
      rotation: landscape(p) ? -12 : -18,
      baselineLock: false,
    }),
    suit: (p) => (p.medium === 'print' && shortSide(p) > 140 ? 0.6 : 0.4),
  },
  {
    id: 'eightpt',
    name: 'Grade 8pt + baseline 4pt',
    short: '8pt',
    family: 'tela',
    build: (p) => {
      const unit = p.unit === 'mm' ? (8 / 72) * 25.4 : 8;
      const cols = p.medium === 'screen' ? (p.w < 600 ? 4 : p.w < 1100 ? 8 : 12) : 6;
      const margins = p.medium === 'screen' ? swissMargins(p) : (() => {
        const m = Math.round(shortSide(p) / 12 / unit) * unit;
        return { top: m, bottom: m, inner: m, outer: m };
      })();
      return {
        ...base(p, 'eightpt', { cols, margins, guides: ['eightpt'] }),
        gutterX: unit * (p.w >= 1000 && p.medium === 'screen' ? 3 : 2),
        gutterY: unit * 2,
        baseline: unit / 2,
        baselineLock: true,
      };
    },
    suit: (p) => (p.medium === 'screen' ? 0.9 : 0.35),
  },
];

export const gridType = (id: GridTypeId) => GRID_TYPES.find((t) => t.id === id) ?? GRID_TYPES[0];

export interface GridPreset {
  id: GridTypeId;
  type: GridType;
  spec: GridSpec;
  score: number;
}

/**
 * All grid presets for a page, ordered by suitability. `preferred` (from the chosen design school)
 * boosts types that belong to that school's tradition. Always returns every type (21 ≥ 10).
 */
export function gridPresets(p: PageSize, preferred: GridTypeId[] = []): GridPreset[] {
  return GRID_TYPES.map((t) => {
    const pref = preferred.indexOf(t.id);
    const boost = pref >= 0 ? 0.5 - pref * 0.05 : 0;
    return { id: t.id, type: t, spec: t.build(p), score: t.suit(p) + boost };
  }).sort((a, b) => b.score - a.score);
}

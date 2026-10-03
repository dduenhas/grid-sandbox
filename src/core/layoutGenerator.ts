import type { ArchetypeId, School } from '../content/schools';
import { CAPTIONS, LABEL_IMAGE, SUBHEADS, bodyText, type PlaceholderLang } from '../content/placeholders';
import { chance, hashString, mulberry32, pick, range, type Rng } from './rng';
import { spanRect, type Grid } from './gridEngine';
import { bodyFromLeading, measureChars } from './typeScale';

export type BlockKind = 'headline' | 'kicker' | 'subhead' | 'body' | 'image' | 'caption' | 'quote' | 'folio' | 'logo' | 'shape';
export type Tone = 'ink' | 'accent' | 'accent2' | 'accent3' | 'image';
export type ShapeKind = 'circle' | 'square' | 'triangle' | 'wedge';

export interface Block {
  id: string;
  kind: BlockKind;
  c: number;
  r: number;
  cs: number;
  rs: number;
  text: string;
  tone: Tone;
  rotate: number;
  align: 'left' | 'center' | 'right';
  rule?: boolean;
  shape?: ShapeKind;
  /** Shapes in overlap-friendly schools sit behind and ignore occupancy. */
  behind?: boolean;
  pinned?: boolean;
}

export const BLOCK_LABEL: Record<BlockKind, string> = {
  headline: 'Título',
  kicker: 'Chapéu',
  subhead: 'Linha fina',
  body: 'Texto corrido',
  image: 'Imagem',
  caption: 'Legenda',
  quote: 'Citação',
  folio: 'Fólio',
  logo: 'Marca',
  shape: 'Forma',
};

type Anchor = 'top' | 'bottom' | 'below' | 'beside' | 'near-image' | 'left' | 'right' | 'center' | 'any' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface Req {
  kind: BlockKind;
  w: [number, number];
  h: [number, number];
  at: Anchor;
  p?: number;
  n?: [number, number];
  then?: Req;
}

export interface Archetype {
  id: ArchetypeId;
  name: string;
  description: string;
  reqs: (s: School) => Req[];
}

const small: [number, number] = [0.04, 0.09];

export const ARCHETYPES: Archetype[] = [
  {
    id: 'hero',
    name: 'Cartaz / hero',
    description: 'Um título dominante e uma imagem grande criam um único ponto de entrada; o texto de apoio fica pequeno, ancorado na base.',
    reqs: () => [
      { kind: 'kicker', w: [0.25, 0.5], h: small, at: 'top-left', p: 0.7 },
      { kind: 'headline', w: [0.6, 1], h: [0.18, 0.32], at: 'top' },
      { kind: 'image', w: [0.5, 1], h: [0.3, 0.5], at: 'below', then: { kind: 'caption', w: [0.2, 0.35], h: small, at: 'near-image', p: 0.7 } },
      { kind: 'body', w: [0.25, 0.5], h: [0.12, 0.25], at: 'bottom', n: [1, 2] },
      { kind: 'folio', w: [0.1, 0.25], h: small, at: 'bottom-right', p: 0.6 },
    ],
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Chapéu, título, linha fina, imagem e colunas de texto: várias portas de entrada em hierarquia clara, como numa revista.',
    reqs: (s) => [
      { kind: 'kicker', w: [0.2, 0.4], h: small, at: 'top-left', p: 0.8 },
      { kind: 'headline', w: [0.5, 1], h: [0.14, 0.24], at: 'top' },
      { kind: 'subhead', w: [0.4, 0.7], h: [0.07, 0.12], at: 'below', p: 0.8 },
      { kind: 'image', w: [0.5, 0.75], h: [0.28, 0.42], at: 'any', then: { kind: 'caption', w: [0.2, 0.35], h: small, at: 'near-image', p: 0.8 } },
      { kind: 'body', w: [0.2, 0.34], h: [0.3, 0.5], at: 'beside', n: [2, 3] },
      { kind: 'quote', w: [0.3, 0.5], h: [0.1, 0.16], at: 'any', p: s.id === 'editorial' ? 0.8 : 0.4 },
      { kind: 'folio', w: [0.1, 0.2], h: small, at: 'bottom-left', p: 0.8 },
    ],
  },
  {
    id: 'catalog',
    name: 'Catálogo',
    description: 'Imagens repetidas em módulos iguais com legendas: o ritmo regular do grid modular torna a comparação imediata.',
    reqs: () => [
      { kind: 'headline', w: [0.4, 0.8], h: [0.1, 0.18], at: 'top' },
      {
        kind: 'image',
        w: [0.22, 0.34],
        h: [0.15, 0.25],
        at: 'any',
        n: [3, 6],
        then: { kind: 'caption', w: [0.22, 0.34], h: small, at: 'near-image', p: 0.65 },
      },
      { kind: 'body', w: [0.25, 0.5], h: [0.1, 0.2], at: 'bottom', p: 0.7 },
      { kind: 'folio', w: [0.1, 0.2], h: small, at: 'bottom-right', p: 0.6 },
    ],
  },
  {
    id: 'typoster',
    name: 'Cartaz tipográfico',
    description: 'A tipografia é a imagem: um título enorme ocupa a maior parte dos campos e o texto pequeno cria contraste de escala.',
    reqs: (s) => [
      { kind: 'kicker', w: [0.3, 0.5], h: small, at: 'top-left', p: 0.8 },
      { kind: 'shape', w: [0.35, 0.6], h: [0.25, 0.4], at: 'any', p: s.shapes ? 0.6 : 0 },
      { kind: 'headline', w: [0.75, 1], h: [0.35, 0.6], at: 'any' },
      { kind: 'body', w: [0.25, 0.4], h: [0.1, 0.2], at: 'bottom', n: [1, 2] },
      { kind: 'folio', w: [0.1, 0.25], h: small, at: 'bottom-right', p: 0.5 },
    ],
  },
  {
    id: 'mosaic',
    name: 'Mosaico',
    description: 'Imagens de tamanhos variados encaixadas em múltiplos de módulos; o título é uma peça a mais do quebra-cabeça.',
    reqs: (s) => [
      { kind: 'image', w: [0.4, 0.75], h: [0.25, 0.45], at: 'any' },
      { kind: 'headline', w: [0.3, 0.6], h: [0.12, 0.25], at: 'any' },
      { kind: 'image', w: [0.2, 0.5], h: [0.15, 0.35], at: 'any', n: [2, 4] },
      { kind: 'shape', w: [0.2, 0.4], h: [0.15, 0.3], at: 'any', p: s.shapes ? 0.6 : 0 },
      { kind: 'body', w: [0.2, 0.4], h: [0.15, 0.25], at: 'any' },
      { kind: 'caption', w: [0.2, 0.3], h: small, at: 'any', p: 0.6 },
    ],
  },
  {
    id: 'zpattern',
    name: 'Padrão Z',
    description: 'O olhar percorre um Z: marca no topo à esquerda, navegação à direita, diagonal pelo destaque e chamada para ação no canto inferior direito.',
    reqs: () => [
      { kind: 'logo', w: [0.1, 0.2], h: small, at: 'top-left' },
      { kind: 'kicker', w: [0.3, 0.5], h: small, at: 'top-right' },
      { kind: 'headline', w: [0.4, 0.6], h: [0.2, 0.3], at: 'left' },
      { kind: 'image', w: [0.4, 0.6], h: [0.25, 0.4], at: 'right' },
      { kind: 'body', w: [0.3, 0.5], h: [0.12, 0.2], at: 'bottom-left' },
      { kind: 'caption', w: [0.15, 0.3], h: small, at: 'bottom-right' },
    ],
  },
  {
    id: 'fpattern',
    name: 'Padrão F',
    description: 'Leitura de varredura: faixas horizontais fortes no topo e uma coluna esquerda densa; ideal para conteúdo informativo.',
    reqs: () => [
      { kind: 'headline', w: [0.6, 1], h: [0.12, 0.2], at: 'top-left' },
      { kind: 'subhead', w: [0.4, 0.8], h: [0.06, 0.1], at: 'below' },
      { kind: 'body', w: [0.5, 0.75], h: [0.2, 0.3], at: 'left' },
      { kind: 'image', w: [0.25, 0.4], h: [0.2, 0.3], at: 'right', then: { kind: 'caption', w: [0.25, 0.4], h: small, at: 'near-image', p: 0.6 } },
      { kind: 'body', w: [0.25, 0.5], h: [0.15, 0.25], at: 'left' },
      { kind: 'folio', w: [0.1, 0.2], h: small, at: 'bottom-left', p: 0.6 },
    ],
  },
  {
    id: 'asymmetric',
    name: 'Assimétrico',
    description: 'Equilíbrio por compensação: uma coluna estreita de título contra uma massa grande de imagem, sem eixo central.',
    reqs: () => [
      { kind: 'kicker', w: [0.2, 0.35], h: small, at: 'top-left', p: 0.6 },
      { kind: 'headline', w: [0.25, 0.5], h: [0.25, 0.5], at: 'left' },
      { kind: 'image', w: [0.5, 0.75], h: [0.35, 0.6], at: 'right', then: { kind: 'caption', w: [0.2, 0.3], h: small, at: 'near-image', p: 0.7 } },
      { kind: 'body', w: [0.25, 0.4], h: [0.2, 0.35], at: 'any', n: [1, 2] },
      { kind: 'quote', w: [0.25, 0.4], h: [0.08, 0.14], at: 'any', p: 0.3 },
    ],
  },
  {
    id: 'classical',
    name: 'Clássico simétrico',
    description: 'Eixo central, título em versais sobre a mancha de texto e fólio centralizado: a ordem tradicional do livro.',
    reqs: () => [
      { kind: 'kicker', w: [0.4, 0.8], h: small, at: 'center', p: 0.7 },
      { kind: 'headline', w: [0.7, 1], h: [0.12, 0.2], at: 'center' },
      { kind: 'body', w: [1, 1], h: [0.5, 0.7], at: 'center' },
      { kind: 'folio', w: [0.2, 0.4], h: small, at: 'bottom', p: 0.9 },
    ],
  },
  {
    id: 'constructivist',
    name: 'Construtivo / dinâmico',
    description: 'Formas geométricas e um título em diagonal geram tensão e movimento; o texto pequeno ancora a composição.',
    reqs: () => [
      { kind: 'shape', w: [0.4, 0.8], h: [0.3, 0.5], at: 'any' },
      { kind: 'headline', w: [0.6, 1], h: [0.2, 0.35], at: 'any' },
      { kind: 'image', w: [0.3, 0.6], h: [0.25, 0.4], at: 'any', p: 0.7 },
      { kind: 'body', w: [0.25, 0.4], h: [0.15, 0.25], at: 'bottom' },
      { kind: 'kicker', w: [0.2, 0.4], h: small, at: 'top-right', p: 0.7 },
    ],
  },
];

export const getArchetype = (id: string) => ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[0];

export interface GenOptions {
  cols: number;
  rows: number;
  /** Column index where the right page starts (0 when single page). */
  spineCol: number;
  school: School;
  seed: number;
  archetype: ArchetypeId;
  lang: PlaceholderLang;
  pinned?: Block[];
}

const TEXT_KINDS = new Set<BlockKind>(['headline', 'kicker', 'subhead', 'body', 'caption', 'quote']);

class Occupancy {
  cells: boolean[];
  constructor(public C: number, public R: number) {
    this.cells = new Array(C * R).fill(false);
  }
  free(c: number, r: number, cs: number, rs: number) {
    if (c < 0 || r < 0 || c + cs > this.C || r + rs > this.R) return false;
    for (let y = r; y < r + rs; y++) for (let x = c; x < c + cs; x++) if (this.cells[y * this.C + x]) return false;
    return true;
  }
  fill(b: { c: number; r: number; cs: number; rs: number }) {
    for (let y = b.r; y < b.r + b.rs; y++)
      for (let x = b.c; x < b.c + b.cs; x++) if (x < this.C && y < this.R) this.cells[y * this.C + x] = true;
  }
  ratio() {
    return this.cells.filter(Boolean).length / this.cells.length;
  }
}

const clampInt = (v: number, a: number, b: number) => Math.max(a, Math.min(b, Math.round(v)));

function anchorScore(at: Anchor, c: number, r: number, cs: number, rs: number, C: number, R: number, last?: Block, lastImage?: Block): number {
  const top = 1 - (r / Math.max(1, R)) * 2;
  const bottom = r + rs === R ? 1 : -((R - r - rs) / R) * 2;
  const left = c === 0 ? 1 : -(c / C) * 2;
  const right = c + cs === C ? 1 : -((C - c - cs) / C) * 2;
  const centered = 1 - Math.abs(2 * c + cs - C) / Math.max(1, C);
  switch (at) {
    case 'top':
      return top * 1.5;
    case 'bottom':
      return bottom * 1.5;
    case 'left':
      return left;
    case 'right':
      return right;
    case 'top-left':
      return top + left;
    case 'top-right':
      return top + right;
    case 'bottom-left':
      return bottom + left;
    case 'bottom-right':
      return bottom + right;
    case 'center':
      return centered * 2 + top * 0.5;
    case 'below':
      if (!last) return top;
      return (r === last.r + last.rs ? 1.5 : -Math.abs(r - (last.r + last.rs)) / R) + (c === last.c ? 0.7 : 0);
    case 'beside':
      if (!last) return 0;
      return (c === last.c + last.cs || c + cs === last.c ? 1 : 0) + (r === last.r ? 0.7 : 0);
    case 'near-image': {
      const t = lastImage ?? last;
      if (!t) return 0;
      const under = r === t.r + t.rs && c >= t.c && c < t.c + t.cs ? 2 : 0;
      const side = (c === t.c + t.cs || c + cs === t.c) && r >= t.r && r < t.r + t.rs ? 1.4 : 0;
      return under + side - (Math.abs(r - t.r) + Math.abs(c - t.c)) / (R + C);
    }
    default:
      return 0;
  }
}

function alignBonus(c: number, r: number, cs: number, rs: number, placed: Block[]): number {
  let s = 0;
  for (const b of placed) {
    if (b.c === c) s += 0.3;
    if (b.c + b.cs === c + cs) s += 0.2;
    if (b.r === r) s += 0.15;
    if (b.r + b.rs === r + rs) s += 0.1;
  }
  return Math.min(1.2, s);
}

function crossesSpine(c: number, cs: number, spine: number) {
  return spine > 0 && c < spine && c + cs > spine;
}

interface Ctx {
  rng: Rng;
  occ: Occupancy;
  placed: Block[];
  o: GenOptions;
  counter: Record<string, number>;
  lastImage?: Block;
}

function textFor(kind: BlockKind, ctx: Ctx, i: number): string {
  const { school, lang } = ctx.o;
  const rng = ctx.rng;
  switch (kind) {
    case 'headline':
      return pick(rng, school.headlines);
    case 'kicker':
      return pick(rng, school.kickers);
    case 'subhead':
      return pick(rng, SUBHEADS);
    case 'body':
      return bodyText(lang, i + Math.floor(rng() * 4));
    case 'caption':
      return pick(rng, CAPTIONS);
    case 'quote':
      return pick(rng, school.quotes);
    case 'folio':
      return String(Math.floor(range(rng, 2, 96)));
    case 'logo':
      return school.name.split(/[\s/]/)[0].slice(0, 2).toUpperCase();
    case 'image':
      return `${pick(rng, LABEL_IMAGE)} ${i + 1}`;
    default:
      return '';
  }
}

function placeReq(req: Req, ctx: Ctx): Block | null {
  const { rng, occ, placed, o } = ctx;
  const { cols: C, rows: R, school } = o;
  const last = placed[placed.length - 1];
  const behind = req.kind === 'shape' && school.overlap;
  let cs = clampInt(range(rng, req.w[0], req.w[1]) * C, 1, C);
  let rs = clampInt(range(rng, req.h[0], req.h[1]) * R, 1, R);
  if (req.kind === 'body' && C >= 6 && cs < 2) cs = 2;

  for (let attempt = 0; attempt < 12; attempt++) {
    const cands: { c: number; r: number; s: number }[] = [];
    for (let r = 0; r + rs <= R; r++)
      for (let c = 0; c + cs <= C; c++) {
        if (!behind && !occ.free(c, r, cs, rs)) continue;
        if (TEXT_KINDS.has(req.kind) && crossesSpine(c, cs, o.spineCol)) continue;
        let s = anchorScore(req.at, c, r, cs, rs, C, R, last, ctx.lastImage) + alignBonus(c, r, cs, rs, placed) + rng() * 0.9;
        if (school.align === 'center' && TEXT_KINDS.has(req.kind)) s += (1 - Math.abs(2 * c + cs - C) / C) * 1.2;
        cands.push({ c, r, s });
      }
    if (cands.length) {
      cands.sort((a, b) => b.s - a.s);
      const best = cands[0];
      const n = (ctx.counter[req.kind] = (ctx.counter[req.kind] ?? 0) + 1);
      const block: Block = {
        id: `${req.kind}-${n}`,
        kind: req.kind,
        c: best.c,
        r: best.r,
        cs,
        rs,
        text: textFor(req.kind, ctx, n - 1),
        tone: req.kind === 'image' ? 'image' : 'ink',
        rotate: 0,
        align: school.align === 'center' ? 'center' : 'left',
        behind,
      };
      decorate(block, ctx);
      if (!behind) occ.fill(block);
      return block;
    }
    if (rs > 1 && (attempt % 2 === 0 || cs === 1)) rs--;
    else if (cs > 1) cs--;
    else break;
  }
  return null;
}

function decorate(b: Block, ctx: Ctx) {
  const { rng, o } = ctx;
  const s = o.school;
  if (b.kind === 'shape') {
    b.shape = s.id === 'constructivism' ? pick(rng, ['wedge', 'circle', 'square'] as const) : s.id === 'japanese' ? 'circle' : s.id === 'destijl' ? 'square' : pick(rng, ['circle', 'square', 'triangle'] as const);
    b.tone = s.id === 'japanese' ? 'accent' : pick(rng, ['accent', 'accent2', 'accent3'] as const);
  }
  if (b.kind === 'headline') {
    if (chance(rng, s.colorUse * 0.5)) b.tone = 'accent';
    if (s.rotation > 0 && (o.archetype === 'constructivist' || chance(rng, 0.5))) b.rotate = (chance(rng, 0.7) ? -1 : 1) * s.rotation * range(rng, 0.6, 1);
    if (s.rules && chance(rng, 0.55)) b.rule = true;
  }
  if (b.kind === 'image' && s.id === 'destijl' && chance(rng, s.colorUse)) b.tone = pick(rng, ['accent', 'accent2', 'accent3'] as const);
  if (b.kind === 'image' && s.id === 'bauhaus' && chance(rng, 0.3)) b.tone = pick(rng, ['accent', 'accent2', 'accent3'] as const);
  if ((b.kind === 'kicker' || b.kind === 'body') && s.rules && chance(rng, 0.3)) b.rule = true;
  if (b.kind === 'kicker' && chance(rng, s.colorUse)) b.tone = 'accent';
  if (b.kind === 'folio' && s.align !== 'center' && b.c + b.cs === o.cols) b.align = 'right';
}

/** Largest free rectangle (in cells) inside columns [c0, c1). */
function largestFree(occ: Occupancy, c0: number, c1: number) {
  let best: { c: number; r: number; cs: number; rs: number } | null = null;
  for (let r = 0; r < occ.R; r++)
    for (let c = c0; c < c1; c++)
      for (let rs = 1; r + rs <= occ.R; rs++)
        for (let cs = 1; c + cs <= c1; cs++) {
          if (!occ.free(c, r, cs, rs)) break;
          if (!best || cs * rs > best.cs * best.rs) best = { c, r, cs, rs };
        }
  return best;
}

/** On a spread, the page the archetype left emptier receives continuation text (or an image) and a folio. */
function fillEmptierPage(ctx: Ctx) {
  const { occ, o, rng, placed } = ctx;
  const S = o.spineCol;
  const used = (c0: number, c1: number) => placed.filter((b) => !b.behind && b.c >= c0 && b.c < c1).reduce((s, b) => s + b.cs * b.rs, 0);
  const left = used(0, S) / (S * o.rows);
  const right = used(S, o.cols) / ((o.cols - S) * o.rows);
  const [c0, c1] = left < right ? [0, S] : [S, o.cols];
  const n = (k: BlockKind) => (ctx.counter[k] = (ctx.counter[k] ?? 0) + 1);
  const free = largestFree(occ, c0, c1);
  if (free && free.cs * free.rs >= 2) {
    const kind: BlockKind = ['catalog', 'mosaic', 'hero'].includes(o.archetype) && chance(rng, 0.6) ? 'image' : 'body';
    const keepTop = chance(rng, 0.5) && free.rs > 2 ? 1 : 0;
    const blk: Block = {
      id: `${kind}-${n(kind)}`,
      kind,
      c: free.c,
      r: free.r + keepTop,
      cs: free.cs,
      rs: free.rs - keepTop,
      text: textFor(kind, ctx, placed.length),
      tone: kind === 'image' ? 'image' : 'ink',
      rotate: 0,
      align: o.school.align === 'center' ? 'center' : 'left',
    };
    occ.fill(blk);
    placed.push(blk);
  }
  if (!placed.some((b) => b.kind === 'folio' && b.c >= c0 && b.c < c1)) {
    const R = o.rows;
    for (let c = c1 - 1; c >= c0; c--)
      if (occ.free(c, R - 1, 1, 1)) {
        const right = c0 > 0;
        const f: Block = {
          id: `folio-${n('folio')}`,
          kind: 'folio',
          c: right ? c : c0,
          r: R - 1,
          cs: 1,
          rs: 1,
          text: String(Math.floor(range(rng, 2, 96))),
          tone: 'ink',
          rotate: 0,
          align: o.school.align === 'center' ? 'center' : right ? 'right' : 'left',
        };
        if (!occ.free(f.c, f.r, 1, 1)) break;
        occ.fill(f);
        placed.push(f);
        break;
      }
  }
}

export interface Layout {
  blocks: Block[];
  archetype: ArchetypeId;
  seed: number;
}

export function generateLayout(o: GenOptions): Layout {
  const rng = mulberry32(o.seed);
  const occ = new Occupancy(o.cols, o.rows);
  const placed: Block[] = [];
  const ctx: Ctx = { rng, occ, placed, o, counter: {} };
  const pinned = (o.pinned ?? []).filter((b) => b.c + b.cs <= o.cols && b.r + b.rs <= o.rows);
  for (const b of pinned) {
    if (!b.behind) occ.fill(b);
    placed.push({ ...b, pinned: true });
    ctx.counter[b.kind] = (ctx.counter[b.kind] ?? 0) + 1;
  }
  const pinnedKinds = new Set(pinned.map((b) => b.kind));
  const arch = getArchetype(o.archetype);

  for (const req of arch.reqs(o.school)) {
    if (req.kind === 'headline' && pinnedKinds.has('headline')) continue;
    if (req.p !== undefined && !chance(rng, req.p)) continue;
    const n = req.n ? Math.round(range(rng, req.n[0], req.n[1])) : 1;
    for (let i = 0; i < n; i++) {
      const b = placeReq(req, ctx);
      if (!b) break;
      placed.push(b);
      if (b.kind === 'image') ctx.lastImage = b;
      if (req.then && (req.then.p === undefined || chance(rng, req.then.p))) {
        const t = placeReq(req.then, ctx);
        if (t) placed.push(t);
      }
    }
  }

  if (!placed.some((b) => b.kind === 'headline')) {
    const b = placeReq({ kind: 'headline', w: [0.5, 1], h: [0.1, 0.3], at: 'top' }, ctx);
    if (b) placed.push(b);
  }

  if (o.spineCol > 0) fillEmptierPage(ctx);

  placed.sort((a, b) => Number(!!b.behind) - Number(!!a.behind));
  return { blocks: placed, archetype: arch.id, seed: o.seed };
}

/** Archetype order for a school: its own favorites first, then the rest. */
export function archetypeCycle(s: School): ArchetypeId[] {
  const rest = ARCHETYPES.map((a) => a.id).filter((id) => !s.archetypes.includes(id));
  return [...s.archetypes, ...rest];
}

export interface VariationKey {
  gridKey: string;
  schoolId: string;
  index: number;
}

export function variationSeed(k: VariationKey): number {
  return hashString(`${k.gridKey}|${k.schoolId}|${k.index}`);
}

export function variationArchetype(s: School, index: number, fixed?: ArchetypeId | null): ArchetypeId {
  if (fixed) return fixed;
  const cyc = archetypeCycle(s);
  return cyc[((index % cyc.length) + cyc.length) % cyc.length];
}

/* ---------------- Score ---------------- */

export interface ScorePart {
  id: string;
  label: string;
  value: number;
  note: string;
}

export interface Score {
  total: number;
  parts: ScorePart[];
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function scoreLayout(blocks: Block[], grid: Grid, school: School): Score {
  const C = grid.cols.length;
  const R = grid.rows.length;
  const occ = new Occupancy(C, R);
  blocks.filter((b) => !b.behind).forEach((b) => occ.fill(b));
  const ws = 1 - occ.ratio();
  const wsScore = clamp01(1 - Math.abs(ws - school.whitespace) * 2.2);

  const lefts = new Set(blocks.map((b) => b.c));
  const tops = new Set(blocks.map((b) => b.r));
  const n = Math.max(1, blocks.length);
  const alignScore = clamp01(1 - ((lefts.size + tops.size - 2) / (2 * n)) * 0.9);

  const area = (b: Block) => b.cs * b.rs;
  const head = blocks.filter((b) => b.kind === 'headline');
  const texts = blocks.filter((b) => b.kind === 'body' || b.kind === 'subhead' || b.kind === 'caption');
  const headA = head.reduce((s, b) => s + area(b), 0);
  const avgText = texts.length ? texts.reduce((s, b) => s + area(b), 0) / texts.length : 1;
  const hierScore = head.length === 0 ? 0 : clamp01(0.4 + (headA / Math.max(1, avgText)) * 0.35);

  const weight: Partial<Record<BlockKind, number>> = { image: 1, headline: 0.9, shape: 0.8, body: 0.45, quote: 0.6 };
  let mx = 0;
  let my = 0;
  let mt = 0;
  for (const b of blocks) {
    const rct = spanRect(grid, b.c, b.r, b.cs, b.rs);
    const wgt = (weight[b.kind] ?? 0.2) * rct.w * rct.h;
    mx += (rct.x + rct.w / 2) * wgt;
    my += (rct.y + rct.h / 2) * wgt;
    mt += wgt;
  }
  const cx = mt ? mx / mt / grid.width : 0.5;
  const cy = mt ? my / mt / grid.height : 0.5;
  const offset = Math.hypot(cx - 0.5, cy - 0.5);
  const balScore = clamp01(1 - Math.abs(offset - school.balanceOffset) * 3);

  const bodySize = bodyFromLeading(grid.baseline);
  const bodies = blocks.filter((b) => b.kind === 'body');
  const measures = bodies.map((b) => measureChars(spanRect(grid, b.c, b.r, b.cs, b.rs).w, bodySize));
  const goodM = measures.filter((m) => m >= 40 && m <= 80).length;
  const measScore = bodies.length ? goodM / bodies.length : 0.8;

  const parts: ScorePart[] = [
    {
      id: 'whitespace',
      label: 'Espaço branco',
      value: wsScore,
      note: `${Math.round(ws * 100)}% dos campos livres (ideal para ${school.name.split(' /')[0]}: ~${Math.round(school.whitespace * 100)}%). ${ws < school.whitespace - 0.1 ? 'A página está densa; remova um elemento ou reduza spans.' : ws > school.whitespace + 0.15 ? 'Muito vazio; o vazio precisa de tensão com uma massa forte.' : 'O vazio está ativo e dá respiro.'}`,
    },
    {
      id: 'alignment',
      label: 'Alinhamento',
      value: alignScore,
      note: `${lefts.size} eixos verticais e ${tops.size} linhas de fluxo para ${blocks.length} elementos. ${alignScore > 0.65 ? 'Poucos eixos compartilhados criam ordem.' : 'Muitos eixos diferentes; tente alinhar inícios de blocos à mesma coluna.'}`,
    },
    {
      id: 'hierarchy',
      label: 'Hierarquia',
      value: hierScore,
      note: head.length ? (hierScore > 0.7 ? 'O título domina com clareza: um ponto de entrada inequívoco.' : 'O título compete com os blocos de texto; aumente seu span ou reduza os demais.') : 'Sem título: falta um ponto de entrada.',
    },
    {
      id: 'balance',
      label: 'Equilíbrio',
      value: balScore,
      note: `Centro de massa visual em (${Math.round(cx * 100)}%, ${Math.round(cy * 100)}%). ${school.balanceOffset > 0.1 ? 'Esta escola pede assimetria equilibrada, não centro geométrico.' : 'Esta escola pede eixo central e simetria.'}`,
    },
    {
      id: 'measure',
      label: 'Medida do texto',
      value: measScore,
      note: bodies.length ? `Linhas de ${measures.join(', ')} caracteres. A faixa confortável é de 45 a 75 (Bringhurst).` : 'Sem texto corrido nesta variação.',
    },
  ];
  const total = Math.round((wsScore * 0.2 + alignScore * 0.2 + hierScore * 0.25 + balScore * 0.15 + measScore * 0.2) * 100);
  return { total, parts };
}

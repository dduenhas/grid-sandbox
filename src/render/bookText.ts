import type { BookStyle, CaseStyle, HeadStyle } from '../content/book';
import { measure, type FontRef } from './text';

/** Simulated small caps: capitals at this share of the size, lightly tracked. */
export const SC_SIZE = 0.8;
export const SC_TRACK = 0.06;
const CAP = 0.72;

export interface Face extends FontRef {
  stack: string;
}

export interface Run {
  x: number;
  y: number;
  text: string;
  face: Face;
  size: number;
  tracking: number;
  fill: 'ink' | 'accent' | 'muted';
  oldstyle?: boolean;
  anchor?: 'start' | 'middle' | 'end';
}

/** Applies a case style, returning the text and the size/tracking multipliers it implies. */
export function caseText(t: string, c: CaseStyle, tracking = 0): { text: string; k: number; tr: number } {
  if (c === 'smallcaps') return { text: t.toUpperCase(), k: SC_SIZE, tr: Math.max(tracking, SC_TRACK) };
  if (c === 'upper') return { text: t.toUpperCase(), k: 1, tr: tracking };
  return { text: t, k: 1, tr: tracking };
}

interface Word {
  text: string;
  face: Face;
  size: number;
  tracking: number;
  fill: Run['fill'];
  /** Glues to the next word with no space (drop-cap remainder). */
  glue?: boolean;
  w: number;
}

export interface FlowFaces {
  text: Face;
  italic: Face;
  display: Face;
  para: Face;
}

export interface FlowInput {
  md: string;
  style: BookStyle;
  faces: FlowFaces;
  size: number;
  /** Line increment (the baseline grid). */
  lead: number;
  w: number;
  h: number;
  /** Y of the first baseline inside the box. */
  y0: number;
  dropcap?: boolean;
  cont?: boolean;
  justify: boolean;
}

export interface FlowOutput {
  runs: Run[];
  /** Drop cap glyph, drawn separately. */
  drop?: Run;
  overflow: boolean;
}

const faceOf = (f: FlowFaces, role: HeadStyle['role'], italic?: boolean): Face => (role === 'display' ? f.display : role === 'para' ? f.para : italic ? f.italic : f.text);

function mkWords(text: string, face: Face, size: number, tracking: number, fill: Run['fill'] = 'ink'): Word[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    // SVG letter-spacing also follows the last glyph, so tracked words are one step wider
    .map((t) => ({ text: t, face, size, tracking, fill, w: measure(t, face, size, tracking) + tracking * size }));
}

interface Para {
  kind: 'p' | 'A' | 'B' | 'break' | 'extract';
  words: Word[];
  /** First line indent. */
  indent: number;
  /** Blank lines before and after. */
  before: number;
  after: number;
  /** Lines a head occupies (taller heads take more than one line). */
  headLines?: number;
  align?: 'left' | 'center';
  headSize?: number;
}

function parse(inp: FlowInput): Para[] {
  const { style, faces, size } = inp;
  const out: Para[] = [];
  const lines = inp.md.split('\n').filter((l) => l.trim());
  let afterBreak = false;
  let first = true;
  for (const raw of lines) {
    const head = raw.match(/^(#{1,3}) (.*)$/);
    if (head && head[1].length < 3) {
      const h = style.heads[head[1].length - 1];
      const [num, title] = head[2].includes('|') ? head[2].split('|') : ['', head[2]];
      const hs = size * h.scale;
      const c = caseText(title, h.case, h.tracking);
      const face = { ...faceOf(faces, h.role, h.italic), weight: h.weight ?? faceOf(faces, h.role, h.italic).weight, italic: h.italic };
      const words = [...(h.numbered && num ? mkWords(num, face, hs * c.k, c.tr, h.accent ? 'accent' : 'ink') : []), ...mkWords(c.text, face, hs * c.k, c.tr, h.accent ? 'accent' : 'ink')];
      out.push({ kind: head[1].length === 1 ? 'A' : 'B', words, indent: 0, before: h.before, after: h.after, headLines: Math.max(1, Math.ceil((hs * 1.15) / inp.lead - 0.15)), align: h.align, headSize: hs });
      afterBreak = true;
      first = false;
      continue;
    }
    if (raw.trim() === '***') {
      out.push({ kind: 'break', words: style.breakMark ? mkWords(style.breakMark, faces.text, size, 0.2, 'accent') : [], indent: 0, before: 0, after: 0, align: 'center' });
      afterBreak = true;
      continue;
    }
    if (raw.startsWith('> ')) {
      out.push({ kind: 'extract', words: mkWords(raw.slice(2), faces.text, size * 0.9, 0), indent: 0, before: 1, after: 1 });
      afterBreak = true;
      continue;
    }
    const flush = first ? !!(inp.cont || inp.dropcap) : afterBreak;
    const indent = style.paragraph === 'indent' && !flush ? size : 0;
    let words: Word[];
    const runIn = raw.match(/^### ([^|]+)\|(.*)$/);
    if (runIn) {
      const h = style.heads[2];
      const c = caseText(runIn[1], h.case, h.tracking);
      const face = { ...faceOf(faces, h.role, h.italic), weight: h.weight ?? faceOf(faces, h.role, h.italic).weight, italic: h.italic };
      const stop = h.case === 'none' && !h.italic && !/[.:;!?]$/.test(c.text) ? '.' : '';
      const hw = mkWords(c.text + stop, face, size * h.scale * c.k, c.tr, h.accent ? 'accent' : 'ink');
      if (hw.length) hw[hw.length - 1].w += size * 0.5;
      words = [...hw, ...mkWords(runIn[2], faces.text, size, 0)];
      out.push({ kind: 'p', words, indent, before: Math.max(h.before, style.paragraph === 'space' && !first && !afterBreak ? 1 : 0), after: 0 });
    } else {
      words = mkWords(raw, faces.text, size, 0);
      out.push({ kind: 'p', words, indent, before: style.paragraph === 'space' && !first && !afterBreak ? 1 : 0, after: 0 });
    }
    afterBreak = false;
    first = false;
  }
  if (style.paragraph === 'pilcrow') {
    const merged: Para[] = [];
    for (const p of out) {
      const prev = merged[merged.length - 1];
      if (p.kind === 'p' && prev?.kind === 'p' && p.before === 0) {
        const pil = mkWords('¶', faces.text, size, 0, 'accent');
        prev.words.push(...pil, ...p.words);
      } else merged.push({ ...p, indent: p.kind === 'p' ? 0 : p.indent });
    }
    return merged;
  }
  return out;
}

/** Leading words of a chapter opening, set in small caps. */
function leadIn(p: Para, faces: FlowFaces, size: number, n: number) {
  for (let i = 0; i < Math.min(n, p.words.length); i++) {
    const w = p.words[i];
    const c = caseText(w.text, 'smallcaps');
    p.words[i] = { ...w, text: c.text, face: faces.text, size: size * c.k, tracking: c.tr, w: measure(c.text, faces.text, size * c.k, c.tr) + c.tr * size * c.k };
  }
}

export function flowBook(inp: FlowInput): FlowOutput {
  const { style, faces, size, lead, w } = inp;
  const paras = parse(inp);
  const runs: Run[] = [];
  const maxLine = Math.max(0, Math.floor((inp.h - inp.y0 + lead * 0.25) / lead));
  let line = 0;
  let drop: Run | undefined;
  let dropLines = 0;
  let dropW = 0;
  const space = measure(' ', faces.text, size);

  const first = paras.find((p) => p.kind === 'p');
  if (inp.dropcap && first && first === paras[0]) {
    if (style.dropCap && first.words.length) {
      const n = style.dropCap.lines;
      const dSize = ((n - 1) * lead + size * CAP) / CAP;
      const w0 = first.words[0];
      const letter = w0.text[0];
      const face = faceOf(faces, style.dropCap.role);
      const dw = measure(letter, face, dSize);
      drop = { x: 0, y: inp.y0 + (n - 1) * lead, text: letter, face, size: dSize, tracking: 0, fill: style.dropCap.accent ? 'accent' : 'ink' };
      dropLines = n;
      dropW = dw + size * 0.25;
      const rest = w0.text.slice(1);
      first.words[0] = { ...w0, text: rest, w: measure(rest, w0.face, w0.size), glue: false };
      if (!rest) first.words.shift();
    }
    if (style.leadIn === 'smallcaps') leadIn(first, faces, size, 3);
  }

  const emit = (ws: Word[], x0: number, avail: number, y: number, justify: boolean, align: 'left' | 'center' | 'right' = 'left', sp = space) => {
    const total = ws.reduce((s, x) => s + x.w, 0);
    const gaps = ws.length - 1;
    let gap = sp;
    let x = x0;
    if (justify && gaps > 0) gap = Math.max(space * 0.6, (avail - total) / gaps);
    else if (align === 'center') x = x0 + (avail - total - gaps * sp) / 2;
    else if (align === 'right') x = x0 + avail - total - gaps * sp;
    ws.forEach((wd) => {
      runs.push({ x, y, text: wd.text, face: wd.face, size: wd.size, tracking: wd.tracking, fill: wd.fill, oldstyle: true });
      x += wd.w + (wd.glue ? 0 : gap);
    });
  };

  let overflow = false;
  outer: for (let pi = 0; pi < paras.length; pi++) {
    const p = paras[pi];
    const before = line === 0 ? 0 : p.before;
    if (p.kind === 'A' || p.kind === 'B') {
      const per = p.headLines ?? 1;
      const w0 = p.words[0];
      const hsp = w0 ? measure(' ', w0.face, w0.size) + w0.tracking * w0.size : space;
      const rows = breakWords(p.words, w, hsp);
      const hl = per * rows.length;
      // keep with next: a head needs at least two lines of text under it
      if (line + before + hl + p.after + 2 > maxLine) {
        overflow = true;
        break;
      }
      line += before;
      rows.forEach((ws, k) => emit(ws, 0, w, inp.y0 + (line + per * (k + 1) - 1) * lead, false, p.align, hsp));
      line += hl + p.after;
      continue;
    }
    if (p.kind === 'break') {
      if (line > 0) {
        if (line >= maxLine) break;
        if (p.words.length) emit(p.words, 0, w, inp.y0 + line * lead, false, 'center');
        line += 1;
      }
      continue;
    }
    line += before;
    const ext = p.kind === 'extract';
    const xL = ext ? size * 1.5 : 0;
    const avail = ext ? w - size * 3 : w;
    const ws = p.words;
    let i = 0;
    let firstLine = true;
    while (i < ws.length) {
      if (line >= maxLine) {
        overflow = true;
        break outer;
      }
      const inDrop = line < dropLines;
      const ind = (firstLine ? p.indent : 0) + (inDrop ? dropW : 0);
      const lineW = avail - ind;
      let j = i;
      let lw = 0;
      while (j < ws.length) {
        const add = (j > i ? (ws[j - 1].glue ? 0 : space) : 0) + ws[j].w;
        if (j > i && lw + add > lineW) break;
        lw += add;
        j++;
      }
      const last = j >= ws.length;
      emit(ws.slice(i, j), xL + ind, lineW, inp.y0 + line * lead, inp.justify && !last && !ext);
      i = j;
      line++;
      firstLine = false;
    }
    line += p.after;
  }
  return { runs, drop, overflow };
}

function breakWords(ws: Word[], w: number, space: number): Word[][] {
  const rows: Word[][] = [];
  let cur: Word[] = [];
  let lw = 0;
  for (const wd of ws) {
    const add = (cur.length ? space : 0) + wd.w;
    if (cur.length && lw + add > w) {
      rows.push(cur);
      cur = [wd];
      lw = wd.w;
    } else {
      cur.push(wd);
      lw += add;
    }
  }
  if (cur.length) rows.push(cur);
  return rows;
}

/** Wraps simple text into lines of runs (headings, captions, notes). */
export function wrapRuns(text: string, face: Face, size: number, tracking: number, w: number): { words: string[]; widths: number[] }[] {
  const words = text.split(/\s+/).filter(Boolean);
  const space = measure(' ', face, size);
  const out: { words: string[]; widths: number[] }[] = [];
  let cur: string[] = [];
  let curW: number[] = [];
  let lw = 0;
  for (const t of words) {
    const tw = measure(t, face, size, tracking);
    const add = (cur.length ? space + tracking * size : 0) + tw;
    if (cur.length && lw + add > w) {
      out.push({ words: cur, widths: curW });
      cur = [t];
      curW = [tw];
      lw = tw;
    } else {
      cur.push(t);
      curW.push(tw);
      lw += add;
    }
  }
  if (cur.length) out.push({ words: cur, widths: curW });
  return out;
}

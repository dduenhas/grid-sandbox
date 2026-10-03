let ctx: CanvasRenderingContext2D | null | undefined;

function getCtx() {
  if (ctx !== undefined) return ctx;
  ctx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  return ctx;
}

const cache = new Map<string, number>();

export interface FontRef {
  family: string;
  weight: number;
  italic?: boolean;
}

/** Width of `text` at `size` document units. Measured at 100px and scaled. */
export function measure(text: string, f: FontRef, size: number, tracking = 0): number {
  const key = `${f.family}|${f.weight}|${f.italic ? 1 : 0}|${text}`;
  let w100 = cache.get(key);
  if (w100 === undefined) {
    const c = getCtx();
    if (c) {
      c.font = `${f.italic ? 'italic ' : ''}${f.weight} 100px '${f.family}', sans-serif`;
      w100 = c.measureText(text).width;
    } else {
      w100 = text.length * 52;
    }
    if (cache.size > 20000) cache.clear();
    cache.set(key, w100);
  }
  return (w100 / 100) * size + Math.max(0, text.length - 1) * tracking * size;
}

export function clearMeasureCache() {
  cache.clear();
}

/** Greedy line breaking. Words longer than the measure stay on their own line. */
export function wrap(text: string, f: FontRef, size: number, maxW: number, tracking = 0, indentFirst = 0): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    const limit = lines.length === 0 ? maxW - indentFirst : maxW;
    if (line && measure(test, f, size, tracking) > limit) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export interface FitResult {
  size: number;
  lines: string[];
  leading: number;
  fits: boolean;
}

/**
 * Largest size from `scale` (descending) at which the text fits the box.
 * `leadingOf` maps a size to its line distance (e.g. snapped to the baseline grid).
 */
export function fitText(
  text: string,
  f: FontRef,
  w: number,
  h: number,
  scale: number[],
  leadingOf: (size: number) => number,
  tracking = 0,
  capRatio = 0.72,
): FitResult {
  const sizes = [...scale].sort((a, b) => b - a);
  for (const size of sizes) {
    const lines = wrap(text, f, size, w, tracking);
    const leading = leadingOf(size);
    const height = size * capRatio + (lines.length - 1) * leading + size * 0.22;
    const widest = Math.max(...lines.map((l) => measure(l, f, size, tracking)));
    if (widest <= w + 1e-6 && height <= h + 1e-6) return { size, lines, leading, fits: true };
  }
  const size = sizes[sizes.length - 1];
  return { size, lines: wrap(text, f, size, w, tracking), leading: leadingOf(size), fits: false };
}

export interface ParaLine {
  text: string;
  words: string[];
  /** Last line of a paragraph: never justified. */
  last: boolean;
  indent: number;
}

/** Breaks paragraphs (\n) into lines, with first-line indents after the first paragraph. */
export function layoutParagraphs(text: string, f: FontRef, size: number, maxW: number, indent: number, maxLines: number): ParaLine[] {
  const out: ParaLine[] = [];
  const paras = text.split('\n').filter((p) => p.trim());
  paras.forEach((p, pi) => {
    const ind = pi > 0 ? indent : 0;
    const lines = wrap(p, f, size, maxW, 0, ind);
    lines.forEach((l, li) => out.push({ text: l, words: l.split(' '), last: li === lines.length - 1, indent: li === 0 ? ind : 0 }));
  });
  return out.slice(0, Math.max(0, maxLines));
}

/** X positions of words for a justified line. */
export function justifyWords(line: ParaLine, f: FontRef, size: number, maxW: number): number[] {
  const widths = line.words.map((w) => measure(w, f, size));
  const avail = maxW - line.indent;
  const gaps = line.words.length - 1;
  const space = gaps > 0 ? (avail - widths.reduce((a, b) => a + b, 0)) / gaps : 0;
  const xs: number[] = [];
  let x = line.indent;
  widths.forEach((w) => {
    xs.push(x);
    x += w + space;
  });
  return xs;
}

export function applyCase(text: string, c: 'none' | 'upper' | 'lower') {
  return c === 'upper' ? text.toUpperCase() : c === 'lower' ? text.toLowerCase() : text;
}

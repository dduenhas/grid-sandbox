export interface ScaleRatio {
  id: string;
  name: string;
  ratio: number;
  note: string;
}

export const SCALE_RATIOS: ScaleRatio[] = [
  { id: 'minor-second', name: 'Segunda menor', ratio: 16 / 15, note: 'Contraste mínimo, interfaces densas' },
  { id: 'major-second', name: 'Segunda maior', ratio: 9 / 8, note: 'Texto longo, documentação' },
  { id: 'minor-third', name: 'Terça menor', ratio: 6 / 5, note: 'Equilíbrio para sites e apps' },
  { id: 'major-third', name: 'Terça maior', ratio: 5 / 4, note: 'Editorial versátil' },
  { id: 'perfect-fourth', name: 'Quarta justa', ratio: 4 / 3, note: 'Hierarquia clara, livros e revistas' },
  { id: 'perfect-fifth', name: 'Quinta justa', ratio: 3 / 2, note: 'Cartazes e capas' },
  { id: 'golden', name: 'Seção áurea', ratio: 1.618034, note: 'Contraste dramático, cartaz suíço' },
  { id: 'octave', name: 'Oitava', ratio: 2, note: 'Contraste máximo' },
];

export const getRatio = (id: string) => SCALE_RATIOS.find((r) => r.id === id) ?? SCALE_RATIOS[4];

/** Classic printer's scale (Renaissance founders' sizes) in points. */
export const CLASSIC_SCALE_PT = [6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 21, 24, 36, 48, 60, 72, 96, 120, 144];

/** Steps of a modular scale around a base size: base · ratio^k for k in [-2, 8]. */
export function modularScale(base: number, ratio: number, down = 2, up = 8): number[] {
  const out: number[] = [];
  for (let k = -down; k <= up; k++) out.push(base * ratio ** k);
  return out;
}

/**
 * Double-stranded modular scale (Bringhurst, ch. 8.2): two interleaved strands, the second
 * starting at base·√ratio. Keeps the proportional logic with finer steps for display sizes.
 */
export function doubleStrandScale(base: number, ratio: number, down = 3, up = 18): number[] {
  const a = modularScale(base, ratio, down, up);
  const b = modularScale(base * Math.sqrt(ratio), ratio, down, up);
  return [...a, ...b].sort((x, y) => x - y);
}

/** Body size derived from leading: leading ≈ 120–145% of the size (Bringhurst). */
export const bodyFromLeading = (leading: number, factor = 1.38) => leading / factor;

/** Largest step of the scale that is <= v, falling back to the smallest step. */
export function snapDown(scale: number[], v: number): number {
  let best = scale[0];
  for (const s of scale) if (s <= v + 1e-9) best = s;
  return best;
}

/**
 * Line measure in characters. Average lowercase character width ≈ 0.5 em for grotesques
 * and ≈ 0.47 em for book faces; 45–75 characters is the comfortable reading range.
 */
export const measureChars = (width: number, fontSize: number, avg = 0.5) => Math.round(width / (fontSize * avg));

export type MeasureVerdict = 'curta' | 'boa' | 'longa';
export const measureVerdict = (chars: number): MeasureVerdict => (chars < 40 ? 'curta' : chars > 80 ? 'longa' : 'boa');

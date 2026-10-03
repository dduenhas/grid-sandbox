export type Unit = 'mm' | 'px';

export const MM_PER_IN = 25.4;
export const PT_PER_IN = 72;
export const CSS_PX_PER_IN = 96;

export const ptToMm = (pt: number) => (pt / PT_PER_IN) * MM_PER_IN;
export const mmToPt = (mm: number) => (mm / MM_PER_IN) * PT_PER_IN;
export const mmToPx = (mm: number, dpi = CSS_PX_PER_IN) => (mm / MM_PER_IN) * dpi;
export const pxToMm = (px: number, dpi = CSS_PX_PER_IN) => (px / dpi) * MM_PER_IN;

/** Typographic points expressed in document units. Screens treat 1pt as 1px (CSS convention). */
export const ptToDoc = (pt: number, unit: Unit) => (unit === 'mm' ? ptToMm(pt) : pt);
export const docToPt = (v: number, unit: Unit) => (unit === 'mm' ? mmToPt(v) : v);

/** Document units to CSS pixels on screen at 100% zoom. */
export const docToScreenPx = (v: number, unit: Unit) => (unit === 'mm' ? mmToPx(v) : v);

export const round = (v: number, d = 1) => {
  const f = 10 ** d;
  return Math.round(v * f) / f;
};

export function fmt(v: number, unit: Unit, d = 1): string {
  return `${round(v, d)}${unit === 'mm' ? ' mm' : ' px'}`;
}

export function fmtPt(v: number, unit: Unit, d = 1): string {
  return `${round(docToPt(v, unit), d)} pt`;
}

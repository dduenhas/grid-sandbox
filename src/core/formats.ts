import type { Unit } from './units';
import { ptToDoc } from './units';

export type Orientation = 'portrait' | 'landscape';
export type Medium = 'print' | 'screen';

export interface Format {
  id: string;
  name: string;
  medium: Medium;
  unit: Unit;
  /** Short and long side. Orientation decides which one is the width. */
  w: number;
  h: number;
  /** Default body leading in points (on screens 1pt = 1px). Drives the baseline grid. */
  leadingPt: number;
  defaultOrientation: Orientation;
  note?: string;
}

const P: Orientation = 'portrait';
const L: Orientation = 'landscape';

export const FORMATS: Format[] = [
  { id: 'a4', name: 'A4', medium: 'print', unit: 'mm', w: 210, h: 297, leadingPt: 12, defaultOrientation: P, note: 'ISO 216, proporção 1:√2' },
  { id: 'a3', name: 'A3', medium: 'print', unit: 'mm', w: 297, h: 420, leadingPt: 14, defaultOrientation: P, note: 'ISO 216, cartaz pequeno e jornal' },
  { id: 'a5', name: 'A5', medium: 'print', unit: 'mm', w: 148, h: 210, leadingPt: 11, defaultOrientation: P, note: 'ISO 216, folheto e livro de bolso' },
  { id: 'letter', name: 'Carta (Letter)', medium: 'print', unit: 'mm', w: 215.9, h: 279.4, leadingPt: 12, defaultOrientation: P, note: 'Padrão norte-americano 8,5 × 11 in' },
  { id: 'tabloid', name: 'Tabloide', medium: 'print', unit: 'mm', w: 279.4, h: 431.8, leadingPt: 13, defaultOrientation: P, note: '11 × 17 in, jornal tabloide' },
  { id: 'poster', name: 'Pôster 50×70', medium: 'print', unit: 'mm', w: 500, h: 700, leadingPt: 24, defaultOrientation: P, note: 'Formato clássico de cartaz' },
  { id: 'book', name: 'Livro 16×23', medium: 'print', unit: 'mm', w: 160, h: 230, leadingPt: 13, defaultOrientation: P, note: 'Miolo de livro comum no Brasil' },
  { id: 'square', name: 'Quadrado 21×21', medium: 'print', unit: 'mm', w: 210, h: 210, leadingPt: 12, defaultOrientation: P, note: 'Catálogo, capa de disco' },
  { id: 'card', name: 'Cartão de visita', medium: 'print', unit: 'mm', w: 55, h: 90, leadingPt: 8, defaultOrientation: L, note: '9 × 5,5 cm' },
  { id: 'desktop', name: 'Desktop 1440', medium: 'screen', unit: 'px', w: 900, h: 1440, leadingPt: 28, defaultOrientation: L, note: 'Viewport desktop comum' },
  { id: 'laptop', name: 'Laptop 1280', medium: 'screen', unit: 'px', w: 800, h: 1280, leadingPt: 24, defaultOrientation: L },
  { id: 'tablet', name: 'Tablet 768', medium: 'screen', unit: 'px', w: 768, h: 1024, leadingPt: 24, defaultOrientation: P, note: 'iPad' },
  { id: 'tablet-l', name: 'Tablet 1024', medium: 'screen', unit: 'px', w: 1024, h: 1366, leadingPt: 24, defaultOrientation: P, note: 'iPad Pro' },
  { id: 'mobile', name: 'Mobile 390', medium: 'screen', unit: 'px', w: 390, h: 844, leadingPt: 24, defaultOrientation: P, note: 'iPhone 12 a 15' },
  { id: 'slide', name: 'Slide 16:9', medium: 'screen', unit: 'px', w: 1080, h: 1920, leadingPt: 40, defaultOrientation: L, note: 'Apresentação Full HD' },
  { id: 'ig-square', name: 'Instagram 1:1', medium: 'screen', unit: 'px', w: 1080, h: 1080, leadingPt: 40, defaultOrientation: P },
  { id: 'ig-portrait', name: 'Instagram 4:5', medium: 'screen', unit: 'px', w: 1080, h: 1350, leadingPt: 40, defaultOrientation: P },
  { id: 'ig-story', name: 'Story 9:16', medium: 'screen', unit: 'px', w: 1080, h: 1920, leadingPt: 44, defaultOrientation: P },
];

export interface CustomSize {
  w: number;
  h: number;
  unit: Unit;
}

export function getFormat(id: string, custom?: CustomSize): Format {
  if (id === 'custom' && custom) {
    return {
      id: 'custom',
      name: 'Personalizado',
      medium: custom.unit === 'mm' ? 'print' : 'screen',
      unit: custom.unit,
      w: Math.min(custom.w, custom.h),
      h: Math.max(custom.w, custom.h),
      leadingPt: custom.unit === 'mm' ? 12 : 24,
      defaultOrientation: custom.w > custom.h ? L : P,
    };
  }
  return FORMATS.find((f) => f.id === id) ?? FORMATS[0];
}

export interface PageSize {
  w: number;
  h: number;
  unit: Unit;
  medium: Medium;
  /** Body leading (baseline increment) in document units. */
  leading: number;
}

export function pageSize(f: Format, o: Orientation): PageSize {
  const short = Math.min(f.w, f.h);
  const long = Math.max(f.w, f.h);
  const w = o === 'portrait' ? short : long;
  const h = o === 'portrait' ? long : short;
  return { w, h, unit: f.unit, medium: f.medium, leading: ptToDoc(f.leadingPt, f.unit) };
}

export const isSquare = (p: { w: number; h: number }) => Math.abs(p.w - p.h) / Math.max(p.w, p.h) < 0.02;

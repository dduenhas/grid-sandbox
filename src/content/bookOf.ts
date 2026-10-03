import type { BookStyle, FontRole } from './book';
import { paraFont, type FontSpec, type School } from './schools';

const cache = new Map<string, BookStyle>();

/** The school's book recipe, or a neutral one derived from its fonts and alignment. */
export function bookOf(s: School): BookStyle {
  if (s.book) return s.book;
  const hit = cache.get(s.id);
  if (hit) return hit;
  const align = s.align === 'center' ? 'center' : 'left';
  const upper = s.headlineCase === 'upper';
  const style: BookStyle = {
    leadingPt: 13,
    leadRatio: 1.38,
    justify: align === 'center',
    paragraph: 'indent',
    dropCap: null,
    leadIn: 'none',
    chapter: {
      align,
      sink: 0.3,
      number: 'arabic',
      label: '',
      numberRole: 'display',
      numberScale: 2,
      numberCase: 'none',
      numberTracking: 0,
      numberAccent: s.colorUse >= 0.2,
      titleRole: 'display',
      titleScale: 1.8,
      titleCase: upper ? 'upper' : 'none',
      titleItalic: false,
      titleTracking: s.headlineTracking,
      gap: 1,
    },
    heads: [
      { role: 'display', scale: 1.3, case: upper ? 'upper' : 'none', tracking: upper ? 0.06 : 0, align, before: 2, after: 1 },
      { role: 'display', scale: 1, case: 'none', tracking: 0, align, before: 1, after: 0 },
      { role: 'display', scale: 0.95, case: 'none', tracking: 0, align: 'left', before: 0, after: 0, runIn: true },
    ],
    runhead: { verso: 'book', recto: 'chapter', role: 'para', case: 'upper', italic: false, tracking: 0.1, align: 'outer' },
    folio: { position: 'foot-outer', role: 'para', dropOnOpening: false },
    breakMark: '* * *',
    notes: 'foot',
    epigraph: { align: align === 'center' ? 'center' : 'left', prob: 0.4 },
    recipe: {
      fonts: `${s.display.family === s.text.family ? '1 família' : '2 famílias'}: ${s.display.family} nos títulos e ${s.text.family} no texto, herdadas da escola.`,
      margins: 'As margens do grid escolhido. Para livros, prefira os grids da família manuscrito.',
      leading: 'Entrelinha do formato, com corpo de cerca de 72% dela.',
      paragraph: 'Recuo de 1 eme.',
      opening: 'Rebaixo de 30%, número e título na fonte de display da escola.',
      hierarchy: 'Uma adaptação neutra da escola ao livro. As escolas do grupo Livro trazem receitas completas.',
    },
    masterpieces: [],
  };
  cache.set(s.id, style);
  return style;
}

export function roleFont(s: School, role: FontRole): FontSpec {
  return role === 'display' ? s.display : role === 'para' ? paraFont(s) : s.text;
}

/** Distinct families in use, in order of appearance. */
export function familiesOf(s: School): string[] {
  return [...new Set([s.display.family, s.text.family, paraFont(s).family])];
}

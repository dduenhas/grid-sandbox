import type { Derived } from '../store/useStore';
import { getRatio, modularScale } from '../core/typeScale';
import { bodySizeFor } from '../core/bookScore';
import { roleFont } from '../content/bookOf';
import type { CaseStyle, FontRole, HeadStyle } from '../content/book';
import { docToPt, round } from '../core/units';
import { getLang, tx } from '../i18n';

const fr = (ratios: number[] | undefined, n: number) => (ratios && ratios.length === n ? ratios.map((r) => `${round(r, 3)}fr`).join(' ') : `repeat(${n}, 1fr)`);

/** CSS Grid + design tokens reproducing the current grid and the blocks' placement. */
export function toCSS(d: Derived): string {
  const g = d.grid;
  const u = d.page.unit;
  const L = (v: number) => (u === 'mm' ? `${round(v, 2)}mm` : `${round(v, 0)}px`);
  const body = bodySizeFor(g.baseline, d.school);
  const scale = modularScale(body, getRatio(d.school.scale).ratio, 1, 6);
  const sp = d.spec;
  const rowsTpl = sp.baselineLock ? g.rows.map((r) => L(r.size)).join(' ') : fr(sp.rowRatios, g.rows.length);
  const tokens = [
    `  --page-w: ${L(d.page.w)};`,
    `  --page-h: ${L(d.page.h)};`,
    `  --margin-top: ${L(g.margins.top)};`,
    `  --margin-bottom: ${L(g.margins.bottom)};`,
    `  --margin-inner: ${L(g.margins.inner)};`,
    `  --margin-outer: ${L(g.margins.outer)};`,
    `  --gutter-x: ${L(g.gutterX)};`,
    `  --gutter-y: ${L(g.gutterY)};`,
    `  --baseline: ${L(g.baseline)};`,
    `  --font-display: '${d.school.display.family}', ${d.school.display.fallback};`,
    `  --font-text: '${d.school.text.family}', ${d.school.text.fallback};`,
    ...scale.map((v, i) => `  --fs-${i - 1 < 0 ? 'sm' : i - 1}: ${u === 'mm' ? `${round(docToPt(v, u), 2)}pt` : `${round(v, 2)}px`};`),
    `  --ink: ${d.school.palette.ink};`,
    `  --paper: ${d.school.palette.paper};`,
    `  --accent: ${d.school.palette.accent};`,
  ];
  const blocks = d.blocks
    .map((b) => `.${b.id.replace(/[^\w-]/g, '_')} { grid-column: ${b.c + 1} / span ${b.cs}; grid-row: ${b.r + 1} / span ${b.rs}; }`)
    .join('\n');
  return `/* Grid Sandbox · ${d.format.name} ${d.page.w}×${d.page.h}${u} · ${d.preset.type.name} · ${d.school.name} */
:root {
${tokens.join('\n')}
}

.page {
  box-sizing: border-box;
  width: var(--page-w);
  min-height: var(--page-h);
  padding: var(--margin-top) var(--margin-outer) var(--margin-bottom) var(--margin-inner);
  display: grid;
  grid-template-columns: ${fr(sp.colRatios, sp.cols)};
  grid-template-rows: ${rowsTpl};
  column-gap: var(--gutter-x);
  row-gap: var(--gutter-y);
  background: var(--paper);
  color: var(--ink);
  font: var(--fs-0) / var(--baseline) var(--font-text);
}

/* Baseline rhythm: every vertical measure is a multiple of --baseline. */
.page p { margin: 0; }
.page h1 { font-family: var(--font-display); line-height: 1; margin: 0; }

/* Responsive: collapse to 4 columns on small screens */
@media (max-width: 600px) {
  .page { grid-template-columns: repeat(4, 1fr); width: 100%; padding: 16px; }
  .page > * { grid-column: 1 / -1 !important; grid-row: auto !important; }
}

${blocks}
`;
}

/** Paragraph styles of a book school, ready to become InDesign paragraph styles. */
function bookSpecs(d: Derived): string {
  const st = d.school.book!;
  const u = d.page.unit;
  const body = bodySizeFor(d.grid.baseline, d.school);
  const P = (v: number) => `${round(docToPt(v, u), 1)} pt`;
  const lead = P(d.grid.baseline);
  const fam = (role: FontRole) => roleFont(d.school, role).family;
  const ital = tx(' itálico', ' italic');
  const cs = (c: CaseStyle) => (c === 'upper' ? tx(', maiúsculas', ', capitals') : c === 'smallcaps' ? tx(', versaletes', ', small caps') : '');
  const head = (name: string, h: HeadStyle) =>
    `  ${name}: ${fam(h.role)}${h.italic ? ital : ''}${h.weight ? ` ${h.weight}` : ''} ${P(body * h.scale)}${cs(h.case)}${h.tracking ? `, tracking ${Math.round(h.tracking * 1000)}` : ''}, ${h.align === 'center' ? tx('centralizado', 'centered') : tx('à esquerda', 'flush left')}${h.runIn ? tx(', corrido no parágrafo', ', run in') : tx(`, ${h.before} linha(s) antes e ${h.after} depois`, `, ${h.before} line(s) before and ${h.after} after`)}`;
  const ch = st.chapter;
  if (getLang() === 'en') {
    return `
PARAGRAPH STYLES (book)
  Body: ${fam('text')} ${P(body)} / ${lead}, ${st.justify ? 'justified' : 'flush left'}, ${st.paragraph === 'indent' ? '1 em indent' : st.paragraph === 'space' ? '1 line of space between paragraphs' : 'run-on paragraphs with ¶'}, aligned to the baseline grid
  Body first: same as Body, no indent${st.leadIn === 'smallcaps' ? ', first 3 words in small caps' : ''}${st.dropCap ? `, ${st.dropCap.lines}-line drop cap` : ''}
  Chapter number: ${fam(ch.numberRole)} ${P(body * ch.numberScale)}${cs(ch.numberCase)}${ch.label ? `, “${ch.label} ”` : ''}, ${ch.number === 'roman' ? 'roman' : ch.number === 'word' ? 'spelled-out' : 'arabic'} numerals
  Chapter title: ${fam(ch.titleRole)}${ch.titleItalic ? ital : ''} ${P(body * ch.titleScale)}${cs(ch.titleCase)}, sink of ${Math.round(ch.sink * 100)}% of the text block
${head('Head A', st.heads[0])}
${head('Head B', st.heads[1])}
${head('Head C', st.heads[2])}
  Running head: ${st.runhead.verso === 'none' ? 'none' : `${fam(st.runhead.role)}${cs(st.runhead.case)}, verso = ${st.runhead.verso === 'book' ? 'book title' : 'author'}, recto = ${st.runhead.recto === 'chapter' ? 'chapter title' : st.runhead.recto === 'book' ? 'book title' : '—'}`}
  Folio: ${fam(st.folio.role)}, ${st.folio.position === 'foot-center' ? 'foot, centered' : st.folio.position === 'foot-outer' ? 'foot, outer corner' : 'head, outer corner'}${st.folio.dropOnOpening ? '; drops to the foot on openings' : '; omitted on openings'}
  Notes: ${st.notes === 'side' ? 'side notes, in the notes column' : 'footnotes, with a short rule'}
  Binding: ${d.bindingMm ? `+${d.bindingMm} mm already added to the inner margin` : 'no allowance'}
`;
  }
  return `
ESTILOS DE PARÁGRAFO (livro)
  Texto: ${fam('text')} ${P(body)} / ${lead}, ${st.justify ? 'justificado' : 'alinhado à esquerda'}, ${st.paragraph === 'indent' ? 'recuo de 1 eme' : st.paragraph === 'space' ? 'espaço de 1 linha entre parágrafos' : 'parágrafos corridos com ¶'}, alinhado à grade de base
  Texto primeiro: igual ao Texto, sem recuo${st.leadIn === 'smallcaps' ? ', 3 primeiras palavras em versaletes' : ''}${st.dropCap ? `, capitular de ${st.dropCap.lines} linhas` : ''}
  Capítulo número: ${fam(ch.numberRole)} ${P(body * ch.numberScale)}${cs(ch.numberCase)}${ch.label ? `, “${ch.label} ”` : ''}, numeração ${ch.number === 'roman' ? 'romana' : ch.number === 'word' ? 'por extenso' : 'arábica'}
  Capítulo título: ${fam(ch.titleRole)}${ch.titleItalic ? ' itálico' : ''} ${P(body * ch.titleScale)}${cs(ch.titleCase)}, rebaixo de ${Math.round(ch.sink * 100)}% da mancha
${head('Título A', st.heads[0])}
${head('Título B', st.heads[1])}
${head('Título C', st.heads[2])}
  Cabeço: ${st.runhead.verso === 'none' ? 'sem cabeço' : `${fam(st.runhead.role)}${cs(st.runhead.case)}, verso = ${st.runhead.verso === 'book' ? 'título do livro' : 'autor'}, recto = ${st.runhead.recto === 'chapter' ? 'título do capítulo' : st.runhead.recto === 'book' ? 'título do livro' : '—'}`}
  Fólio: ${fam(st.folio.role)}, ${st.folio.position === 'foot-center' ? 'pé, centralizado' : st.folio.position === 'foot-outer' ? 'pé, canto externo' : 'alto, canto externo'}${st.folio.dropOnOpening ? '; nas aberturas desce ao pé' : '; omitido nas aberturas'}
  Notas: ${st.notes === 'side' ? 'laterais, na coluna de notas' : 'de rodapé, com filete curto'}
  Encadernação: ${d.bindingMm ? `+${d.bindingMm} mm já somados à margem interna` : 'sem acréscimo'}
`;
}

/** Step-by-step settings to rebuild the grid in InDesign, Illustrator, Photoshop and Figma. */
export function toSpecs(d: Derived): string {
  const g = d.grid;
  const u = d.page.unit;
  const L = (v: number) => `${round(v, 2)} ${u}`;
  const P = (v: number) => `${round(docToPt(v, u), 2)} pt`;
  const rows = g.rows.length;
  if (getLang() === 'en') {
    return `GRID SANDBOX · SPEC SHEET
${d.format.name} · ${L(d.page.w)} × ${L(d.page.h)}${g.spread ? ' · double page' : ''}
Grid: ${d.preset.type.name} · School: ${d.school.name}

MARGINS
  Top ${L(g.margins.top)} · Bottom ${L(g.margins.bottom)}
  ${g.spread ? 'Inside' : 'Left'} ${L(g.margins.inner)} · ${g.spread ? 'Outside' : 'Right'} ${L(g.margins.outer)}
COLUMNS  ${d.spec.cols} · gutter ${L(g.gutterX)}${d.spec.colRatios ? ` · ratios ${d.spec.colRatios.map((r) => round(r, 3)).join(' : ')}` : ''}
ROWS     ${rows} · gutter ${L(g.gutterY)}
LEADING (baseline)  ${P(g.baseline)} · starts at ${L(g.baselineOrigin)} from the top
TYPOGRAPHY  Headings: ${d.school.display.family} ${d.school.display.weight} · Text: ${d.school.text.family} ${d.school.text.weight}
${d.school.book ? bookSpecs(d) : ''}
INDESIGN
  1. File > New Document: ${L(d.page.w)} × ${L(d.page.h)}${g.spread ? ', facing pages' : ''}.
  2. Margins and Columns: margins above; columns ${d.spec.cols}, gutter ${L(g.gutterX)}.
  3. Layout > Create Guides: rows ${rows}, gutter ${L(g.gutterY)}, "fit guides to margins".
  4. Preferences > Grids: baseline grid, start ${L(g.baselineOrigin)}, relative to top of page, increment every ${P(g.baseline)}.
  5. Text: leading ${P(g.baseline)} and "align to baseline grid".

ILLUSTRATOR
  Artboard ${L(d.page.w)} × ${L(d.page.h)}. Draw a rectangle for the text block and use
  Object > Path > Split Into Grid: rows ${rows} (gutter ${L(g.gutterY)}), columns ${d.spec.cols} (gutter ${L(g.gutterX)}),
  check "Add Guides". Or open the exported SVG: the layers are already named.

PHOTOSHOP
  View > Guides > New Guide Layout: columns ${d.spec.cols} (gutter ${L(g.gutterX)}), rows ${rows} (gutter ${L(g.gutterY)}),
  margins T ${L(g.margins.top)} L ${L(g.margins.inner)} B ${L(g.margins.bottom)} R ${L(g.margins.outer)}.

FIGMA
  Frame ${L(d.page.w)} × ${L(d.page.h)} > Layout grid:
  Columns: count ${d.spec.cols}, Stretch, margin ${L(g.margins.inner)}, gutter ${L(g.gutterX)}
  Rows: count ${rows}, Stretch, margin ${L(g.margins.top)}, gutter ${L(g.gutterY)}
  Grid: size ${P(g.baseline)} (baseline)
`;
  }
  return `GRID SANDBOX · FICHA TÉCNICA
${d.format.name} · ${L(d.page.w)} × ${L(d.page.h)}${g.spread ? ' · página dupla' : ''}
Grid: ${d.preset.type.name} · Escola: ${d.school.name}

MARGENS
  Superior ${L(g.margins.top)} · Inferior ${L(g.margins.bottom)}
  ${g.spread ? 'Interna' : 'Esquerda'} ${L(g.margins.inner)} · ${g.spread ? 'Externa' : 'Direita'} ${L(g.margins.outer)}
COLUNAS  ${d.spec.cols} · calha ${L(g.gutterX)}${d.spec.colRatios ? ` · proporções ${d.spec.colRatios.map((r) => round(r, 3)).join(' : ')}` : ''}
LINHAS   ${rows} · calha ${L(g.gutterY)}
ENTRELINHA (baseline)  ${P(g.baseline)} · início em ${L(g.baselineOrigin)} do topo
TIPOGRAFIA  Títulos: ${d.school.display.family} ${d.school.display.weight} · Texto: ${d.school.text.family} ${d.school.text.weight}
${d.school.book ? bookSpecs(d) : ''}
INDESIGN
  1. Arquivo > Novo documento: ${L(d.page.w)} × ${L(d.page.h)}${g.spread ? ', páginas opostas' : ''}.
  2. Margens e colunas: margens acima; colunas ${d.spec.cols}, medianiz ${L(g.gutterX)}.
  3. Layout > Criar guias: linhas ${rows}, medianiz ${L(g.gutterY)}, "ajustar às margens".
  4. Preferências > Grades: grade de linha de base, início ${L(g.baselineOrigin)}, relativa à borda superior, incremento ${P(g.baseline)}.
  5. Texto: entrelinha ${P(g.baseline)} e "alinhar à grade de linha de base".

ILLUSTRATOR
  Prancheta ${L(d.page.w)} × ${L(d.page.h)}. Desenhe um retângulo da mancha e use
  Objeto > Caminho > Dividir em grade: linhas ${rows} (medianiz ${L(g.gutterY)}), colunas ${d.spec.cols} (medianiz ${L(g.gutterX)}),
  marque "Adicionar guias". Ou abra o SVG exportado: as camadas já vêm nomeadas.

PHOTOSHOP
  Visualizar > Guias > Novo layout de guias: colunas ${d.spec.cols} (medianiz ${L(g.gutterX)}), linhas ${rows} (medianiz ${L(g.gutterY)}),
  margens S ${L(g.margins.top)} E ${L(g.margins.inner)} I ${L(g.margins.bottom)} D ${L(g.margins.outer)}.

FIGMA
  Frame ${L(d.page.w)} × ${L(d.page.h)} > Layout grid:
  Columns: count ${d.spec.cols}, Stretch, margin ${L(g.margins.inner)}, gutter ${L(g.gutterX)}
  Rows: count ${rows}, Stretch, margin ${L(g.margins.top)}, gutter ${L(g.gutterY)}
  Grid: size ${P(g.baseline)} (baseline)
`;
}

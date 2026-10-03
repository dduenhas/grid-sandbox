import type { Derived } from '../store/useStore';
import { bodyFromLeading, getRatio, modularScale } from '../core/typeScale';
import { docToPt, round } from '../core/units';

const fr = (ratios: number[] | undefined, n: number) => (ratios && ratios.length === n ? ratios.map((r) => `${round(r, 3)}fr`).join(' ') : `repeat(${n}, 1fr)`);

/** CSS Grid + design tokens reproducing the current grid and the blocks' placement. */
export function toCSS(d: Derived): string {
  const g = d.grid;
  const u = d.page.unit;
  const L = (v: number) => (u === 'mm' ? `${round(v, 2)}mm` : `${round(v, 0)}px`);
  const body = bodyFromLeading(g.baseline);
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

/** Step-by-step settings to rebuild the grid in InDesign, Illustrator, Photoshop and Figma. */
export function toSpecs(d: Derived): string {
  const g = d.grid;
  const u = d.page.unit;
  const L = (v: number) => `${round(v, 2)} ${u}`;
  const P = (v: number) => `${round(docToPt(v, u), 2)} pt`;
  const rows = g.rows.length;
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

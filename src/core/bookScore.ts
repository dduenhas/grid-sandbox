import type { Grid } from './gridEngine';
import { spanRect } from './gridEngine';
import type { Block, Score, ScorePart } from './layoutGenerator';
import { measureChars } from './typeScale';
import type { School } from '../content/schools';
import { bookOf, familiesOf } from '../content/bookOf';
import { mmToPt } from './units';
import { tx } from '../i18n';

/** Body size from leading. Book styles carry their own leading ratio. */
export const bodySizeFor = (baseline: number, school: School) => baseline / (school.book?.leadRatio ?? 1.38);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Ranks how well a book page follows the canon: progressive margins, measure, leading, register, hierarchy. */
export function scoreBook(blocks: Block[], grid: Grid, school: School, bindingMm: number): Score {
  const style = bookOf(school);
  const m = grid.margins;
  const isMm = grid.page.unit === 'mm';
  const binding = isMm ? bindingMm : 0;
  const inner = Math.max(0.01, m.inner - binding);
  const seq = [inner, m.top, m.outer, m.bottom];
  const ordered = seq.slice(1).filter((v, i) => v >= seq[i] - 0.01).length;
  const outerRatio = m.outer / inner;
  const marginScore = clamp01(ordered / 3 * 0.6 + (outerRatio >= 1.3 && outerRatio <= 2.3 ? 0.4 : 0.15));

  const page = grid.pages[0];
  const live = grid.live[0];
  const share = (live.w * live.h) / (page.w * page.h);
  const shareScore = clamp01(share >= 0.42 && share <= 0.7 ? 1 : 1 - Math.min(Math.abs(share - 0.42), Math.abs(share - 0.7)) * 4);

  const size = bodySizeFor(grid.baseline, school);
  const bodies = blocks.filter((b) => b.kind === 'body');
  const measures = bodies.map((b) => measureChars(spanRect(grid, b.c, b.r, b.cs, b.rs).w, size, 0.47));
  const mScore = (c: number) => (c >= 55 && c <= 75 ? 1 : c >= 45 && c <= 80 ? 0.75 : c >= 38 && c <= 90 ? 0.4 : 0.1);
  const measScore = measures.length ? measures.reduce((s, c) => s + mScore(c), 0) / measures.length : 0.8;

  const ratio = grid.baseline / size;
  const leadScore = clamp01(ratio >= 1.2 && ratio <= 1.45 ? 1 : 1 - Math.min(Math.abs(ratio - 1.2), Math.abs(ratio - 1.45)) * 5);

  const fams = familiesOf(school).length;
  const used = new Set(blocks.flatMap((b) => (b.text.match(/^#{1,3} /gm) ?? []).map((h) => h.trim())));
  const hierScore = clamp01((fams <= 3 ? 0.6 : 0.2) + (style.heads.every((h) => h.after <= h.before) ? 0.4 : 0.1));

  const regScore = grid.spec.baselineLock ? 1 : 0.45;
  const pt = (v: number) => r1(isMm ? mmToPt(v) : v);

  const parts: ScorePart[] = [
    {
      id: 'margins',
      label: tx('Margens progressivas', 'Progressive margins'),
      value: marginScore,
      note: tx(
        `Visíveis: interna ${r1(inner)}, superior ${r1(m.top)}, externa ${r1(m.outer)}, inferior ${r1(m.bottom)}${isMm ? ' mm' : ''}${binding ? ` (+${binding} mm de encadernação na interna)` : ''}. ${ordered === 3 ? 'A sequência interna < superior < externa < inferior mantém a mancha unida no centro da dupla.' : 'Quebra a progressão clássica: a dupla perde a unidade.'} Externa/interna = ${r1(outerRatio)} (as duas internas somadas ≈ uma externa).`,
        `Visible: inner ${r1(inner)}, top ${r1(m.top)}, outer ${r1(m.outer)}, bottom ${r1(m.bottom)}${isMm ? ' mm' : ''}${binding ? ` (+${binding} mm binding allowance on the inner margin)` : ''}. ${ordered === 3 ? 'The sequence inner < top < outer < bottom keeps the text blocks together at the center of the spread.' : 'It breaks the classical progression: the spread loses its unity.'} Outer/inner = ${r1(outerRatio)} (the two inner margins together ≈ one outer margin).`,
      ),
    },
    {
      id: 'share',
      label: tx('Mancha', 'Text block'),
      value: shareScore,
      note: tx(
        `A mancha ocupa ${Math.round(share * 100)}% da página. Cânones clássicos ficam entre 44% (Van de Graaf) e 55%; o livro comercial vai até ~70%.`,
        `The text block fills ${Math.round(share * 100)}% of the page. Classical canons sit between 44% (Van de Graaf) and 55%; trade books go up to ~70%.`,
      ),
    },
    {
      id: 'measure',
      label: tx('Medida', 'Measure'),
      value: measScore,
      note: measures.length
        ? tx(`${measures.join(', ')} caracteres por linha. Em livro o ideal é 60–70; 45–75 é aceitável (Bringhurst 2.1.2).`, `${measures.join(', ')} characters per line. In a book the ideal is 60–70; 45–75 is acceptable (Bringhurst 2.1.2).`)
        : tx('Página sem texto corrido.', 'Page without body text.'),
    },
    {
      id: 'leading',
      label: tx('Entrelinha', 'Leading'),
      value: leadScore,
      note: tx(
        `Corpo ${pt(size)} pt sobre ${pt(grid.baseline)} pt (${Math.round(ratio * 100)}%). Texto longo pede 120–145%; mais aberta para medidas longas e faces de altura-x grande.${ratio < 1.2 ? ' Abaixo disso a página fica escura e densa, como nas private presses: ganha cor tipográfica, perde conforto em leituras longas.' : ''}`,
        `${pt(size)} pt type on ${pt(grid.baseline)} pt leading (${Math.round(ratio * 100)}%). Long text calls for 120–145%; looser for long measures and large x-height faces.${ratio < 1.2 ? ' Below that the page turns dark and dense, as in the private presses: it gains typographic color but loses comfort in long reading.' : ''}`,
      ),
    },
    {
      id: 'hierarchy',
      label: tx('Hierarquia', 'Hierarchy'),
      value: hierScore,
      note: tx(
        `${fams} ${fams === 1 ? 'família' : 'famílias'}, ${style.heads.length} níveis de intertítulo${used.size ? ` (${used.size} em uso)` : ''}. Cada nível muda uma variável (caixa, itálico, peso ou posição) e tem mais espaço antes do que depois.`,
        `${fams} ${fams === 1 ? 'family' : 'families'}, ${style.heads.length} heading levels${used.size ? ` (${used.size} in use)` : ''}. Each level changes one variable (case, italic, weight or position) and has more space before than after.`,
      ),
    },
    {
      id: 'register',
      label: tx('Registro', 'Register'),
      value: regScore,
      note: grid.spec.baselineLock
        ? tx('Linhas em registro: frente e verso coincidem e o espaço vertical é medido em linhas inteiras.', 'Lines in register: front and back coincide and vertical space is measured in whole lines.')
        : tx('Sem registro: as linhas do verso aparecem entre as da frente no papel fino.', 'Out of register: on thin paper the lines on the back show between those on the front.'),
    },
  ];
  const total = Math.round((marginScore * 0.22 + shareScore * 0.13 + measScore * 0.22 + leadScore * 0.15 + hierScore * 0.14 + regScore * 0.14) * 100);
  return { total, parts };
}

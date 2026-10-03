import type { Block, BlockKind, GenOptions, Layout, PageFurniture } from './layoutGenerator';
import { chance, mulberry32, pick, range, type Rng } from './rng';
import {
  AUTHORS,
  BOOK_SUBTITLES,
  BOOK_TITLES,
  CHAPTER_TITLES,
  DEDICATIONS,
  EPIGRAPHS,
  HEADS_A,
  HEADS_B,
  HEADS_C,
  NOTES,
  PART_TITLES,
  PUBLISHERS,
  SUPERSCRIPTS,
  prose,
  type BookArchetypeId,
  type BookStyle,
} from '../content/book';
import { bookOf, familiesOf } from '../content/bookOf';
import { tx } from '../i18n';

interface Page {
  c0: number;
  c1: number;
  /** Text frames as [first column, span]. Two frames on reference grids. */
  text: [number, number][];
  /** Narrow column for side notes and captions, if the grid has one. */
  note?: number;
  recto: boolean;
}

function pagesOf(o: GenOptions): Page[] {
  const C = o.cols;
  const S = o.spineCol;
  const ranges: [number, number][] = S > 0 ? [[0, S], [S, C]] : [[0, C]];
  return ranges.map(([c0, c1], i) => {
    const widths = Array.from({ length: c1 - c0 }, (_, k) => o.colWidths?.[c0 + k] ?? 1);
    const max = Math.max(...widths);
    const main = widths.map((w, k) => (w >= max * 0.6 ? c0 + k : -1)).filter((c) => c >= 0);
    const notes = widths.map((w, k) => (w < max * 0.6 ? c0 + k : -1)).filter((c) => c >= 0);
    const first = main[0];
    const n = main.length;
    const text: [number, number][] = n === 2 || (n > 2 && n % 2 === 0) ? [[first, n / 2], [first + n / 2, n / 2]] : [[first, n]];
    return { c0, c1, text, note: notes[0], recto: S > 0 ? i === 1 : true };
  });
}

class Grid2 {
  cells: boolean[];
  constructor(
    public C: number,
    public R: number,
  ) {
    this.cells = new Array(C * R).fill(false);
  }
  free(c: number, r: number, cs: number, rs: number) {
    if (c < 0 || r < 0 || cs < 1 || rs < 1 || c + cs > this.C || r + rs > this.R) return false;
    for (let y = r; y < r + rs; y++) for (let x = c; x < c + cs; x++) if (this.cells[y * this.C + x]) return false;
    return true;
  }
  fill(b: { c: number; r: number; cs: number; rs: number }) {
    for (let y = b.r; y < b.r + b.rs; y++) for (let x = b.c; x < b.c + b.cs; x++) if (x < this.C && y < this.R) this.cells[y * this.C + x] = true;
  }
}

const clampI = (v: number, a: number, b: number) => Math.max(a, Math.min(b, Math.round(v)));

/* ---------------- Markup ---------------- */

interface FlowCtx {
  o: GenOptions;
  rng: Rng;
  chapter: number;
  sec: number;
  sub: number;
  para: number;
  note: number;
}

type Piece = 'p' | 'A' | 'B' | 'C' | 'break' | 'extract' | 'pn';

function flow(f: FlowCtx, pieces: Piece[]): string {
  const out: string[] = [];
  for (const p of pieces) {
    const [text] = prose(f.o.lang, f.para++, 1);
    if (p === 'p') out.push(text);
    else if (p === 'pn') {
      const k = f.note++;
      out.push(text.replace(/([.;])\s/, `$1${SUPERSCRIPTS[k % SUPERSCRIPTS.length]} `));
    } else if (p === 'A') {
      f.sec++;
      f.sub = 0;
      out.push(`# ${f.chapter}.${f.sec}|${HEADS_A[(f.chapter + f.sec) % HEADS_A.length]}`);
    } else if (p === 'B') {
      f.sub++;
      out.push(`## ${f.chapter}.${Math.max(1, f.sec)}.${f.sub}|${HEADS_B[(f.chapter + f.sec + f.sub) % HEADS_B.length]}`);
    } else if (p === 'C') out.push(`### ${HEADS_C[(f.para + f.chapter) % HEADS_C.length]}|${text}`);
    else if (p === 'break') out.push('***');
    else out.push(`> ${EPIGRAPHS[(f.para + 1) % EPIGRAPHS.length].text} ${EPIGRAPHS[f.para % EPIGRAPHS.length].text}`);
  }
  return out.join('\n');
}

/* ---------------- Layout ---------------- */

export function bookLayout(o: GenOptions, archetype: BookArchetypeId): Layout {
  const rng = mulberry32(o.seed);
  const style: BookStyle = bookOf(o.school);
  const R = o.rows;
  const lpr = Math.max(1, o.linesPerRow ?? 3);
  /** Rows needed to hold `lines` text lines (row gutters count as one line each). */
  const rowsFor = (lines: number) => clampI(Math.ceil((lines + 1) / (lpr + 1)), 1, R);
  const occ = new Grid2(o.cols, R);
  const blocks: Block[] = [];
  const counter: Partial<Record<BlockKind, number>> = {};

  for (const b of (o.pinned ?? []).filter((b) => b.c + b.cs <= o.cols && b.r + b.rs <= R)) {
    occ.fill(b);
    blocks.push({ ...b, pinned: true });
    counter[b.kind] = (counter[b.kind] ?? 0) + 1;
  }

  const add = (kind: BlockKind, c: number, r: number, cs: number, rs: number, text: string, extra: Partial<Block> = {}): Block | null => {
    rs = Math.min(rs, R - r);
    if (!occ.free(c, r, cs, rs)) return null;
    const n = (counter[kind] = (counter[kind] ?? 0) + 1);
    const b: Block = {
      id: `${kind}-${n}`,
      kind,
      c,
      r,
      cs,
      rs,
      text,
      tone: kind === 'image' ? 'image' : 'ink',
      rotate: 0,
      align: style.chapter.align,
      ...extra,
    };
    occ.fill(b);
    blocks.push(b);
    return b;
  };

  const chapter = 1 + Math.floor(rng() * 9);
  const f: FlowCtx = { o, rng, chapter, sec: Math.floor(rng() * 3), sub: 0, para: Math.floor(rng() * 8), note: 0 };
  const bookTitle = pick(rng, BOOK_TITLES);
  const author = pick(rng, AUTHORS);
  const chTitle = CHAPTER_TITLES[(chapter - 1) % CHAPTER_TITLES.length];
  const pages = pagesOf(o);
  const recto = pages[pages.length - 1];
  const verso = pages.length > 1 ? pages[0] : undefined;
  const roles: PageFurniture['role'][] = pages.map(() => 'text');
  const roleOf = (p: Page, role: PageFurniture['role']) => (roles[pages.indexOf(p)] = role);
  const sink = clampI(R * style.chapter.sink, 0, Math.max(0, R - 3));
  const sideNotes = style.notes === 'side';

  /** Fills the text frames of a page from row r0 to r1 with flowing text. */
  const textFrames = (p: Page, r0: number, r1: number, pieces: Piece[], extra: Partial<Block> = {}) => {
    const md = flow(f, pieces);
    p.text.forEach(([c, cs], i) => {
      if (r1 - r0 < 1) return;
      add('body', c, r0, cs, r1 - r0, i === 0 ? md : flow(f, ['p', 'p', 'p', 'p', 'p']), i === 0 ? extra : { cont: true });
    });
  };

  const sidenote = (p: Page, r: number, text: string) => {
    if (p.note === undefined) return;
    add('notes', p.note, clampI(r, 0, R - 1), 1, rowsFor(4), text);
  };

  const chapterRows = () => {
    const titleLines = style.chapter.titleScale > 1.6 ? 3 : 2;
    const numLines = Math.ceil(style.chapter.numberScale * (style.chapter.numberRole === 'display' ? 1.1 : 1));
    return rowsFor(numLines + style.chapter.gap + titleLines + (style.chapter.ornament ? 2 : 0));
  };

  const openChapter = (p: Page, withEpigraph: boolean) => {
    roleOf(p, 'opening');
    const [c, cs] = [p.text[0][0], p.text[p.text.length - 1][0] + p.text[p.text.length - 1][1] - p.text[0][0]];
    const ch = add('chapter', c, sink, cs, chapterRows(), `${chapter}|${chTitle}`);
    let r = (ch ? ch.r + ch.rs : sink + 1);
    if (withEpigraph && R - r > 3) {
      const e = pick(rng, EPIGRAPHS);
      const ep = add('epigraph', c, r, cs, rowsFor(4), `${e.text}|${e.who}`, { align: style.epigraph.align });
      if (ep) r = ep.r + ep.rs;
    }
    textFrames(p, r, R, ['p', 'p', 'p', 'p', 'p', 'p'], { dropcap: true });
  };

  switch (archetype) {
    case 'chapter': {
      if (verso) {
        if (chance(rng, 0.55)) {
          const end = clampI(R * range(rng, 0.35, 0.75), 1, R);
          textFrames(verso, 0, end, ['p', 'p', 'p', 'p'], { cont: true });
        } else roleOf(verso, 'blank');
      }
      openChapter(recto, chance(rng, style.epigraph.prob));
      break;
    }
    case 'sections': {
      if (verso) {
        textFrames(verso, 0, R, [sideNotes ? 'pn' : 'p', 'p', 'B', 'p', 'C', 'p', 'p', 'p', 'p'], { cont: true });
        if (sideNotes) sidenote(verso, Math.floor(R * 0.4), `${SUPERSCRIPTS[0]}|${NOTES[chapter % NOTES.length]}`);
      }
      textFrames(recto, 0, R, ['p', 'A', 'p', 'p', 'B', 'p', 'C', 'p', 'p', 'p'], { cont: !!verso });
      break;
    }
    case 'running': {
      if (verso) textFrames(verso, 0, R, ['p', 'p', 'p', 'p', 'p', 'p'], { cont: true });
      textFrames(recto, 0, R, ['p', 'p', 'break', 'p', 'p', 'extract', 'p', 'p', 'p'], { cont: true });
      break;
    }
    case 'figure': {
      const figPage = verso && chance(rng, 0.5) ? verso : recto;
      const other = figPage === recto ? verso : recto;
      if (other) textFrames(other, 0, R, ['p', 'p', 'p', 'p', 'p', 'p'], { cont: true });
      const top = chance(rng, 0.5);
      const c = figPage.text[0][0];
      const cs = figPage.text[figPage.text.length - 1][0] + figPage.text[figPage.text.length - 1][1] - c;
      const capInNote = figPage.note !== undefined;
      const capRows = capInNote ? 0 : 1;
      const imgRs = clampI(R * range(rng, 0.35, 0.5), 1, Math.max(1, R - capRows - 1));
      const r0 = top ? 0 : R - imgRs - capRows;
      const img = add('image', c, r0, cs, imgRs, `${tx('Figura', 'Figure')} ${chapter}.${1 + Math.floor(rng() * 4)}`);
      if (img) {
        const cap = `Fig. ${chapter}.1 — ${pick(rng, tx(['Prova de composição sobre papel pólen.', 'Página dupla do manuscrito original.', 'Estudo de margens a lápis.'], ['Typesetting proof on cream book paper.', 'Spread from the original manuscript.', 'Margin study in pencil.']))}`;
        if (capInNote) add('caption', figPage.note!, img.r + img.rs - 1, 1, rowsFor(3), cap);
        else add('caption', c, img.r + img.rs, cs, 1, cap);
      }
      if (top) textFrames(figPage, imgRs + capRows, R, ['p', 'p', 'p', 'p'], { cont: true });
      else textFrames(figPage, 0, r0, ['p', 'p', 'p'], { cont: true });
      break;
    }
    case 'notes': {
      for (const p of pages) {
        const notes = `${SUPERSCRIPTS[f.note % 9]}|${NOTES[(chapter + f.note) % NOTES.length]}\n${SUPERSCRIPTS[(f.note + 1) % 9]}|${NOTES[(chapter + f.note + 1) % NOTES.length]}`;
        if (sideNotes && p.note !== undefined) {
          textFrames(p, 0, R, ['pn', 'p', 'pn', 'p', 'p', 'p'], { cont: true });
          sidenote(p, 1, notes.split('\n')[0]);
          sidenote(p, Math.floor(R * 0.55), notes.split('\n')[1]);
        } else {
          const nr = rowsFor(4);
          textFrames(p, 0, R - nr, ['pn', 'p', 'pn', 'p', 'p', 'p'], { cont: true });
          add('notes', p.text[0][0], R - nr, p.text[p.text.length - 1][0] + p.text[p.text.length - 1][1] - p.text[0][0], nr, notes);
        }
      }
      break;
    }
    case 'contents': {
      if (verso) roleOf(verso, 'blank');
      roleOf(recto, 'display');
      const c = recto.text[0][0];
      const cs = recto.text[recto.text.length - 1][0] + recto.text[recto.text.length - 1][1] - c;
      let pg = 9;
      const entries = CHAPTER_TITLES.slice(0, 8).map((t, i) => {
        const line = `${i + 1}|${t}|${pg}`;
        pg += 14 + Math.floor(rng() * 20);
        return line;
      });
      add('toc', c, Math.max(0, sink - 1), cs, R - Math.max(0, sink - 1), entries.join('\n'));
      break;
    }
    case 'titlepage': {
      roleOf(recto, 'display');
      const c = recto.text[0][0];
      const cs = recto.text[recto.text.length - 1][0] + recto.text[recto.text.length - 1][1] - c;
      add('kicker', c, 0, cs, 1, author);
      const tr = clampI(R * 0.22, 1, R - 4);
      const t = add('headline', c, tr, cs, 2, bookTitle);
      if (t) add('subhead', c, t.r + t.rs, cs, 1, pick(rng, BOOK_SUBTITLES));
      const publisher = pick(rng, PUBLISHERS);
      add('kicker', c, R - 1, cs, 1, publisher);
      if (verso) {
        roleOf(verso, 'display');
        const vc = verso.text[0][0];
        const vcs = verso.text[verso.text.length - 1][0] + verso.text[verso.text.length - 1][1] - vc;
        const fams = familiesOf(o.school).join(', ');
        const colophon = tx(
          [`© 2026 ${author}`, 'Todos os direitos reservados.', `Projeto gráfico: Grid Sandbox`, `Composto em ${fams}`, 'Impresso em papel pólen 80 g/m²', publisher],
          [`© 2026 ${author}`, 'All rights reserved.', `Book design: Grid Sandbox`, `Set in ${fams}`, 'Printed on 80 gsm cream book paper', publisher],
        ).join('\n');
        add('caption', vc, R - rowsFor(7), vcs, rowsFor(7), colophon, { align: 'left' });
      }
      break;
    }
    case 'part': {
      if (verso) roleOf(verso, 'blank');
      roleOf(recto, 'display');
      const c = recto.text[0][0];
      const cs = recto.text[recto.text.length - 1][0] + recto.text[recto.text.length - 1][1] - c;
      const r = clampI(R * 0.3, 0, R - 3);
      const n = 1 + Math.floor(rng() * 3);
      add('kicker', c, r, cs, 1, tx(`Parte ${['Um', 'Dois', 'Três', 'Quatro'][n - 1]}`, `Part ${['One', 'Two', 'Three', 'Four'][n - 1]}`));
      add('headline', c, r + 1, cs, 2, PART_TITLES[(n - 1) % PART_TITLES.length]);
      break;
    }
    case 'epigraph': {
      if (verso) roleOf(verso, 'blank');
      roleOf(recto, 'display');
      const c = recto.text[0][0];
      const cs = recto.text[recto.text.length - 1][0] + recto.text[recto.text.length - 1][1] - c;
      add('subhead', c, clampI(R * 0.15, 0, R - 1), cs, 1, pick(rng, DEDICATIONS), { align: style.epigraph.align === 'center' ? 'center' : style.epigraph.align === 'right' ? 'right' : 'left' });
      const e = pick(rng, EPIGRAPHS);
      add('epigraph', c, clampI(R * 0.45, 1, R - 2), cs, rowsFor(5), `${e.text}|${e.who}`, { align: style.epigraph.align });
      break;
    }
  }

  const k = 6 + Math.floor(rng() * 80);
  const furniture: PageFurniture[] = pages.map((p, i) => {
    const folio = pages.length > 1 ? (p.recto ? 2 * k + 1 : 2 * k) : 2 * k + 1;
    const runhead = p.recto
      ? style.runhead.recto === 'chapter'
        ? chTitle
        : style.runhead.recto === 'book'
          ? bookTitle
          : ''
      : style.runhead.verso === 'book'
        ? bookTitle
        : style.runhead.verso === 'author'
          ? author
          : '';
    return { role: roles[i], runhead, folio, recto: p.recto };
  });

  return { blocks, archetype, seed: o.seed, furniture };
}

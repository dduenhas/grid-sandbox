import type { ReactNode } from 'react';
import type { Block, PageFurniture } from '../core/layoutGenerator';
import type { Grid } from '../core/gridEngine';
import { chapterNumber, type CaseStyle, type FontRole } from '../content/book';
import { bookOf, roleFont } from '../content/bookOf';
import { fontStack, type School } from '../content/schools';
import { caseText, flowBook, wrapRuns, type Face, type FlowFaces, type Run } from './bookText';
import { measure } from './text';
import type { RenderCtx } from './BlockContent';
import { tx } from '../i18n';

const CAP = 0.72;

export const BOOK_KINDS = new Set<Block['kind']>(['chapter', 'epigraph', 'toc', 'notes']);

export function facesOf(s: School): FlowFaces {
  const f = (role: FontRole, italic = false): Face => {
    const spec = roleFont(s, role);
    return { family: spec.family, weight: spec.weight, italic, stack: fontStack(spec) };
  };
  return { text: f('text'), italic: f('text', true), display: f('display'), para: f('para') };
}

const faceFor = (faces: FlowFaces, role: FontRole, italic?: boolean, weight?: number): Face => {
  const base = role === 'display' ? faces.display : role === 'para' ? faces.para : italic ? faces.italic : faces.text;
  return { ...base, italic: !!italic, weight: weight ?? base.weight };
};

function fillOf(s: School, f: Run['fill']) {
  return f === 'accent' ? s.palette.accent : f === 'muted' ? s.palette.muted : s.palette.ink;
}

function RunText({ r, s, k }: { r: Run; s: School; k: string | number }) {
  return (
    <text
      key={k}
      x={r.x}
      y={r.y}
      textAnchor={r.anchor}
      fontFamily={r.face.stack}
      fontWeight={r.face.weight}
      fontStyle={r.face.italic ? 'italic' : undefined}
      fontSize={r.size}
      letterSpacing={r.tracking ? r.tracking * r.size : undefined}
      fill={fillOf(s, r.fill)}
      style={r.oldstyle ? { fontVariantNumeric: 'oldstyle-nums' } : undefined}
    >
      {r.text}
    </text>
  );
}

/** First baseline below `top` for a line of the given size, kept on the baseline grid. */
function baselineAt(grid: Grid, top: number, size: number) {
  const b = grid.baseline;
  if (!grid.spec.baselineLock || b <= 0) return top + size * CAP;
  return top + Math.max(1, Math.ceil((size * CAP) / b - 1e-6)) * b;
}

/** A centered/left line of styled text, wrapped, each line on the grid. Returns runs and the next free baseline. */
function setLines(
  text: string,
  face: Face,
  size: number,
  cs: CaseStyle,
  tracking: number,
  w: number,
  y: number,
  lead: number,
  align: 'left' | 'center' | 'right',
  fill: Run['fill'],
  x0 = 0,
): { runs: Run[]; y: number } {
  const c = caseText(text, cs, tracking);
  const sz = size * c.k;
  const rows = wrapRuns(c.text, face, sz, c.tr, w);
  const runs: Run[] = rows.map((row, i) => {
    const t = row.words.join(' ');
    const anchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';
    const x = align === 'center' ? x0 + w / 2 : align === 'right' ? x0 + w : x0;
    return { x, y: y + i * lead, text: t, face, size: sz, tracking: c.tr, fill, anchor, oldstyle: true };
  });
  return { runs, y: y + rows.length * lead };
}

export function BookBlock({ block: b, w, h, ctx }: { block: Block; w: number; h: number; ctx: RenderCtx }) {
  const s = ctx.school;
  const st = bookOf(s);
  const faces = facesOf(s);
  const size = ctx.bodySize;
  const lead = ctx.grid.baseline > 0 ? ctx.grid.baseline : size * 1.38;
  const runs: Run[] = [];
  const nodes: ReactNode[] = [];
  const align = (b.align === 'right' ? 'right' : b.align === 'center' ? 'center' : 'left') as 'left' | 'center' | 'right';
  const snap = (v: number) => Math.max(1, Math.round(v / lead)) * lead;

  switch (b.kind) {
    case 'body': {
      const out = flowBook({ md: b.text, style: st, faces, size, lead, w, h, y0: baselineAt(ctx.grid, 0, size), dropcap: b.dropcap, cont: b.cont, justify: st.justify });
      runs.push(...out.runs);
      if (out.drop) runs.push(out.drop);
      break;
    }
    case 'chapter': {
      const [n, title] = b.text.includes('|') ? b.text.split('|') : ['1', b.text];
      const ch = st.chapter;
      const al = ch.align;
      const num = chapterNumber(Number(n) || 1, ch.number);
      const label = ch.label ? `${ch.label} ${num}` : num;
      const nFace = faceFor(faces, ch.numberRole, ch.numberItalic);
      const nSize = size * ch.numberScale;
      let y = baselineAt(ctx.grid, 0, nSize * caseText(label, ch.numberCase).k);
      const nr = setLines(label, nFace, nSize, ch.numberCase, ch.numberTracking, w, y, snap(nSize * 1.1), al, ch.numberAccent ? 'accent' : 'ink');
      runs.push(...nr.runs);
      y = nr.runs[nr.runs.length - 1].y + lead * (ch.gap + 1);
      const tFace = faceFor(faces, ch.titleRole, ch.titleItalic, ch.titleWeight);
      let tSize = size * ch.titleScale;
      const room = h - y;
      for (let k = 0; k < 8; k++) {
        const c = caseText(title, ch.titleCase, ch.titleTracking);
        const rows = wrapRuns(c.text, tFace, tSize * c.k, c.tr, w).length;
        if ((rows - 1) * snap(tSize * 1.15) <= room || tSize <= size) break;
        tSize *= 0.9;
      }
      y += Math.max(0, Math.ceil((tSize * CAP) / lead) - 1) * lead;
      const tr = setLines(title, tFace, tSize, ch.titleCase, ch.titleTracking, w, y, snap(tSize * 1.15), al, 'ink');
      runs.push(...tr.runs);
      if (ch.ornament) {
        const oy = tr.runs[tr.runs.length - 1].y + lead * 2;
        if (oy < h) runs.push({ x: al === 'center' ? w / 2 : 0, y: oy, text: ch.ornament, face: faces.text, size: size * 1.4, tracking: 0, fill: 'accent', anchor: al === 'center' ? 'middle' : 'start' });
      }
      break;
    }
    case 'epigraph': {
      const [text, who] = b.text.includes('|') ? b.text.split('|') : [b.text, ''];
      const bw = align === 'center' ? w * 0.8 : Math.min(w, w * 0.68);
      const x0 = align === 'right' ? w - bw : align === 'center' ? (w - bw) / 2 : 0;
      const es = size * 0.92;
      const inner = align === 'center' ? 'center' : 'left';
      const r1 = setLines(text, faces.italic, es, 'none', 0, bw, baselineAt(ctx.grid, 0, es), lead, inner, 'ink', x0);
      runs.push(...r1.runs);
      if (who) {
        const r2 = setLines(`— ${who}`, faces.text, es, 'smallcaps', 0, bw, r1.y, lead, align === 'left' ? 'left' : align === 'center' ? 'center' : 'right', 'muted', x0);
        runs.push(...r2.runs);
      }
      break;
    }
    case 'toc': {
      const h0 = st.heads[0];
      const hFace = faceFor(faces, h0.role, h0.italic, h0.weight);
      let y = baselineAt(ctx.grid, 0, size * h0.scale);
      const head = setLines(tx('Sumário', 'Contents'), hFace, size * h0.scale, h0.case, h0.tracking, w, y, lead, st.chapter.align, h0.accent ? 'accent' : 'ink');
      runs.push(...head.runs);
      y = head.y + lead * 2;
      const entries = b.text.split('\n').filter(Boolean);
      const step = entries.length * 2 * lead <= h - y ? 2 : 1;
      const numW = size * 2.6;
      for (const e of entries) {
        if (y > h) break;
        const [n, t, pg] = e.split('|');
        const num = chapterNumber(Number(n) || 1, st.chapter.number);
        if (st.chapter.align === 'center') {
          runs.push({ x: w / 2, y, text: `${num}  ·  ${t}  ·  ${pg ?? ''}`, face: faces.text, size, tracking: 0, fill: 'ink', anchor: 'middle', oldstyle: true });
        } else {
          runs.push({ x: 0, y, text: num, face: faces.text, size, tracking: 0, fill: st.chapter.numberAccent ? 'accent' : 'muted', oldstyle: true });
          const maxT = w - numW - size * 3;
          let tt = t;
          while (tt.length > 4 && measure(tt, faces.text, size) > maxT) tt = `${tt.slice(0, -2).trimEnd()}…`;
          runs.push({ x: numW, y, text: tt, face: faces.text, size, tracking: 0, fill: 'ink' });
          runs.push({ x: w, y, text: pg ?? '', face: faces.text, size, tracking: 0, fill: 'ink', anchor: 'end', oldstyle: true });
        }
        y += lead * step;
      }
      break;
    }
    case 'notes': {
      const ns = size * 0.8;
      const nl = lead * 0.8;
      const side = st.notes === 'side' && w < size * 20;
      let y = baselineAt(ctx.grid, 0, ns);
      if (!side) {
        nodes.push(<line key="rule" x1={0} x2={Math.min(w, size * 8)} y1={y - lead * 0.75} y2={y - lead * 0.75} stroke={s.palette.ink} strokeWidth={Math.max(ctx.hair, size * 0.04)} />);
        y += lead * 0.25;
      }
      for (const n of b.text.split('\n').filter(Boolean)) {
        const [mark, text] = n.includes('|') ? n.split('|') : ['', n];
        const face = side ? faces.para : faces.text;
        const markW = measure(mark + ' ', face, ns);
        runs.push({ x: 0, y, text: mark, face, size: ns, tracking: 0, fill: 'accent' });
        const rows = wrapRuns(text, face, ns, 0, w - markW);
        rows.forEach((row, i) => {
          if (y + i * nl <= h) runs.push({ x: markW, y: y + i * nl, text: row.words.join(' '), face, size: ns, tracking: 0, fill: 'ink', oldstyle: true });
        });
        y += rows.length * nl + nl * 0.5;
      }
      break;
    }
    case 'headline': {
      const ch = st.chapter;
      const tFace = faceFor(faces, ch.titleRole, ch.titleItalic, ch.titleWeight);
      let tSize = size * Math.max(2.4, ch.titleScale * 1.5);
      for (let k = 0; k < 10; k++) {
        const c = caseText(b.text, ch.titleCase, ch.titleTracking);
        const rows = wrapRuns(c.text, tFace, tSize * c.k, c.tr, w);
        const wide = Math.max(...rows.map((r) => r.widths.reduce((a, x) => a + x, 0)));
        if ((tSize * CAP + (rows.length - 1) * snap(tSize * 1.1) <= h && wide <= w) || tSize <= size) break;
        tSize *= 0.9;
      }
      runs.push(...setLines(b.text, tFace, tSize, ch.titleCase, ch.titleTracking, w, baselineAt(ctx.grid, 0, tSize), snap(tSize * 1.1), align, 'ink').runs);
      break;
    }
    case 'kicker':
    case 'folio': {
      const face = faceFor(faces, st.runhead.role);
      runs.push(...setLines(b.text, face, size, 'smallcaps', 0.08, w, baselineAt(ctx.grid, 0, size), lead, align, b.tone === 'accent' ? 'accent' : 'ink').runs);
      break;
    }
    case 'subhead':
    case 'quote': {
      const ss = size * 1.15;
      runs.push(...setLines(b.text, faces.italic, ss, 'none', 0, w, baselineAt(ctx.grid, 0, ss), snap(ss * 1.2), align, 'ink').runs);
      break;
    }
    case 'caption': {
      const cs = size * 0.85;
      const face = faceFor(faces, 'para', faces.para.family === faces.text.family);
      let y = baselineAt(ctx.grid, 0, cs);
      for (const para of b.text.split('\n').filter(Boolean)) {
        const r = setLines(para, face, cs, 'none', 0, w, y, lead, align, 'muted');
        runs.push(...r.runs.filter((x) => x.y <= h + 1e-6));
        y = r.y;
      }
      break;
    }
    default:
      return null;
  }

  return (
    <>
      {nodes}
      {runs.map((r, i) => (
        <RunText key={i} k={i} r={r} s={s} />
      ))}
    </>
  );
}

/** Running heads and folios, drawn in the margins of each page. */
export function BookFurniture({ grid, school, furniture, bodySize }: { grid: Grid; school: School; furniture: PageFurniture[]; bodySize: number }) {
  const st = bookOf(school);
  const faces = facesOf(school);
  const lead = grid.baseline > 0 ? grid.baseline : bodySize * 1.38;
  const runs: Run[] = [];
  furniture.forEach((f, i) => {
    const live = grid.live[i];
    if (!live || f.role === 'blank' || f.role === 'display') return;
    const recto = f.recto;
    const outerX = recto ? live.x + live.w : live.x;
    const outerAnchor = recto ? 'end' : 'start';
    const headY = live.y - lead * 0.9;
    const footY = live.y + live.h + lead * 1.6;
    const opening = f.role === 'opening';
    const fsz = bodySize * 0.9;
    const fFace = faceFor(faces, st.folio.role);
    const folio = String(f.folio);
    const pos = opening ? (st.folio.dropOnOpening ? 'foot-center' : null) : st.folio.position;
    if (pos === 'foot-center') runs.push({ x: live.x + live.w / 2, y: footY, text: folio, face: fFace, size: fsz, tracking: 0, fill: 'ink', anchor: 'middle', oldstyle: true });
    if (pos === 'foot-outer') runs.push({ x: outerX, y: footY, text: folio, face: fFace, size: fsz, tracking: 0, fill: 'ink', anchor: outerAnchor, oldstyle: true });
    if (pos === 'head-outer') runs.push({ x: outerX, y: headY, text: folio, face: fFace, size: fsz, tracking: 0, fill: 'ink', anchor: outerAnchor, oldstyle: true });
    if (opening || !f.runhead) return;
    const rh = st.runhead;
    const c = caseText(f.runhead, rh.case, rh.tracking);
    const face = faceFor(faces, rh.role, rh.italic);
    const rs = bodySize * 0.85 * c.k;
    if (rh.align === 'center') {
      runs.push({ x: live.x + live.w / 2, y: headY, text: c.text, face, size: rs, tracking: c.tr, fill: 'ink', anchor: 'middle' });
    } else {
      const off = pos === 'head-outer' ? measure(folio, fFace, fsz) + bodySize * 1.5 : 0;
      runs.push({ x: recto ? outerX - off : outerX + off, y: headY, text: c.text, face, size: rs, tracking: c.tr, fill: 'ink', anchor: outerAnchor });
    }
  });
  return (
    <g id={tx('Cabecos-e-folios', 'Running-heads-and-folios')}>
      {runs.map((r, i) => (
        <RunText key={i} k={i} r={r} s={school} />
      ))}
    </g>
  );
}

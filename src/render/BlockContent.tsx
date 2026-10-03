import type { ReactNode } from 'react';
import type { Grid } from '../core/gridEngine';
import type { Block, Tone } from '../core/layoutGenerator';
import { fontStack, type School } from '../content/schools';
import { applyCase, fitText, justifyWords, layoutParagraphs, measure, wrap, type FontRef } from './text';
import { snapDown } from '../core/typeScale';

export interface RenderCtx {
  school: School;
  grid: Grid;
  bodySize: number;
  scale: number[];
  hair: number;
  cutout: boolean;
  exportMode: boolean;
}

const CAP = 0.72;

export function toneColor(t: Tone, s: School) {
  const p = s.palette;
  return t === 'accent' ? p.accent : t === 'accent2' ? p.accent2 : t === 'accent3' ? p.accent3 : t === 'image' ? p.image : p.ink;
}

/** First baseline at or below `capTop + capHeight`, snapped to the grid when locked. */
function firstBaseline(ctx: RenderCtx, top: number, size: number) {
  const b = ctx.grid.baseline;
  if (!ctx.grid.spec.baselineLock || b <= 0) return top + size * CAP;
  return top + Math.max(1, Math.ceil((size * CAP) / b - 1e-6)) * b;
}

const snapLeading = (ctx: RenderCtx, size: number, factor: number) => {
  const b = ctx.grid.baseline;
  if (!ctx.grid.spec.baselineLock || b <= 0) return size * factor;
  return Math.max(1, Math.round((size * factor) / b)) * b;
};

function xFor(align: Block['align'], w: number, lineW: number) {
  return align === 'center' ? (w - lineW) / 2 : align === 'right' ? w - lineW : 0;
}

const anchorOf = (a: Block['align']) => (a === 'center' ? 'middle' : a === 'right' ? 'end' : 'start');

interface Props {
  block: Block;
  w: number;
  h: number;
  ctx: RenderCtx;
}

export function BlockContent({ block: b, w, h, ctx }: Props) {
  const s = ctx.school;
  const pal = s.palette;
  const color = toneColor(b.tone, s);
  const display: FontRef = { family: s.display.family, weight: s.display.weight };
  const text: FontRef = { family: s.text.family, weight: s.text.weight };
  const bold: FontRef = { family: s.text.family, weight: 700 };
  const b0 = ctx.grid.baseline;
  const ruleH = b.rule ? Math.max(b0 * 0.3, ctx.hair * 3) : 0;
  const top = b.rule ? ruleH + b0 * 0.5 : 0;
  const boxed = s.id === 'brutalism';
  const nodes: ReactNode[] = [];
  const pad = ctx.cutout ? Math.max(b0 * 0.25, ctx.hair * 2) : 0;

  if (b.rule) nodes.push(<rect key="rule" x={0} y={0} width={w} height={ruleH} fill={b.tone === 'ink' ? pal.ink : color} />);

  switch (b.kind) {
    case 'headline': {
      const t = applyCase(b.text, s.headlineCase);
      const tracking = s.headlineTracking;
      const fit = fitText(t, display, w - pad * 2, h - top - pad, ctx.scale, (sz) => (ctx.grid.spec.baselineLock ? Math.max(sz * 0.8, snapLeading(ctx, sz, s.headlineLeading)) : sz * s.headlineLeading), tracking, CAP);
      const y0 = top + pad + fit.size * CAP;
      fit.lines.forEach((ln, i) => {
        const lw = measure(ln, display, fit.size, tracking);
        const x = xFor(b.align, w - pad * 2, lw) + pad;
        const y = y0 + i * fit.leading;
        if (ctx.cutout) {
          nodes.push(
            <rect key={`p${i}`} className="cut" x={x - pad} y={y - fit.size * CAP - pad} width={lw + pad * 2} height={fit.size * (CAP + 0.26) + pad * 2} fill={b.tone === 'ink' ? '#fdfdfb' : '#fdfdfb'} />,
          );
        }
        nodes.push(
          <text key={`t${i}`} x={x} y={y} fontFamily={fontStack(s.display)} fontWeight={s.display.weight} fontSize={fit.size} letterSpacing={tracking * fit.size} fill={color}>
            {ln}
          </text>,
        );
      });
      break;
    }
    case 'kicker':
    case 'folio': {
      const isK = b.kind === 'kicker';
      const size = isK ? ctx.bodySize : ctx.bodySize * 0.9;
      const tr = isK && s.headlineCase !== 'lower' ? 0.08 : 0;
      const t = isK ? (s.headlineCase === 'lower' ? b.text.toLowerCase() : b.text.toUpperCase()) : b.text;
      const lines = wrap(t, bold, size, w - pad * 2, tr).slice(0, Math.max(1, Math.floor((h - top) / b0)));
      const y0 = firstBaseline(ctx, top, size);
      if (ctx.cutout) {
        const lw = Math.max(...lines.map((l) => measure(l, bold, size, tr)));
        nodes.push(<rect key="p" className="cut" x={xFor(b.align, w, lw + pad * 2)} y={y0 - size * CAP - pad} width={lw + pad * 2} height={(lines.length - 1) * b0 + size * (CAP + 0.26) + pad * 2} fill="#fdfdfb" />);
      }
      lines.forEach((ln, i) =>
        nodes.push(
          <text key={i} x={b.align === 'center' ? w / 2 : b.align === 'right' ? w - pad : pad} y={y0 + i * b0} textAnchor={anchorOf(b.align)} fontFamily={fontStack(s.text)} fontWeight={isK ? 700 : 500} fontSize={size} letterSpacing={tr * size} fill={color}>
            {ln}
          </text>,
        ),
      );
      break;
    }
    case 'subhead':
    case 'quote': {
      const isQ = b.kind === 'quote';
      const f: FontRef = isQ ? { family: s.display.family, weight: Math.min(s.display.weight, 600), italic: s.display.fallback.includes('serif') && !s.display.fallback.includes('sans') } : { family: s.text.family, weight: 500 };
      const stack = isQ ? fontStack(s.display) : fontStack(s.text);
      const t = isQ ? b.text : b.text;
      const maxSize = ctx.bodySize * (isQ ? 2.6 : 1.9);
      const scale = ctx.scale.filter((v) => v >= ctx.bodySize * 1.05 && v <= maxSize);
      const fit = fitText(t, f, w - pad * 2, h - top - pad, scale.length ? scale : [ctx.bodySize * 1.2], (sz) => snapLeading(ctx, sz, 1.2));
      const y0 = firstBaseline(ctx, top + pad, fit.size);
      const qColor = isQ && s.colorUse >= 0.25 ? pal.accent : color;
      if (ctx.cutout) nodes.push(<rect key="p" className="cut" x={0} y={0} width={w} height={Math.min(h, y0 + (fit.lines.length - 1) * fit.leading + fit.size * 0.3 + pad)} fill="#fdfdfb" />);
      fit.lines.forEach((ln, i) =>
        nodes.push(
          <text key={i} x={b.align === 'center' ? w / 2 : pad} y={y0 + i * fit.leading} textAnchor={anchorOf(b.align === 'right' ? 'left' : b.align)} fontFamily={stack} fontWeight={f.weight} fontStyle={f.italic ? 'italic' : undefined} fontSize={fit.size} fill={qColor}>
            {ln}
          </text>,
        ),
      );
      break;
    }
    case 'body':
    case 'caption': {
      const isC = b.kind === 'caption';
      const size = isC ? snapDown(ctx.scale, ctx.bodySize * 0.82) : ctx.bodySize;
      const lead = b0;
      const justify = !isC && s.id === 'classical';
      const innerW = w - pad * 2;
      const y0 = firstBaseline(ctx, top + (ctx.cutout ? pad : 0), size);
      const maxLines = Math.max(0, Math.floor((h - y0 + lead * 0.2) / lead) + 1);
      const lines = layoutParagraphs(b.text, text, size, innerW, isC ? 0 : size * 1.2, maxLines);
      if (ctx.cutout) nodes.push(<rect key="p" className="cut" x={0} y={0} width={w} height={Math.min(h, y0 + (lines.length - 1) * lead + size * 0.35 + pad)} fill="#fdfdfb" />);
      lines.forEach((ln, i) => {
        const y = y0 + i * lead;
        if (justify && !ln.last && ln.words.length > 1) {
          const xs = justifyWords(ln, text, size, innerW);
          nodes.push(
            <text key={i} y={y} fontFamily={fontStack(s.text)} fontSize={size} fill={color}>
              {ln.words.map((wd, k) => (
                <tspan key={k} x={pad + xs[k]}>
                  {wd}
                </tspan>
              ))}
            </text>,
          );
        } else {
          const lw = measure(ln.text, text, size);
          const x = b.align === 'center' ? (innerW - lw) / 2 + pad : b.align === 'right' ? innerW - lw + pad : pad + ln.indent;
          nodes.push(
            <text key={i} x={x} y={y} fontFamily={fontStack(s.text)} fontSize={size} fill={isC ? pal.muted : color} fontStyle={isC && s.text.fallback.includes('serif') && !s.text.fallback.includes('sans') ? 'italic' : undefined}>
              {ln.text}
            </text>,
          );
        }
      });
      break;
    }
    case 'image': {
      const fill = toneColor(b.tone, s);
      const isPhoto = b.tone === 'image';
      nodes.push(<rect key="img" className="cut" x={0} y={top} width={w} height={h - top} fill={fill} />);
      if (isPhoto) {
        nodes.push(
          <g key="x" stroke="rgba(0,0,0,.14)" strokeWidth={ctx.hair}>
            <line x1={0} y1={top} x2={w} y2={h} />
            <line x1={w} y1={top} x2={0} y2={h} />
          </g>,
        );
        const fs = Math.max(ctx.bodySize * 0.7, Math.min(w, h) * 0.04);
        nodes.push(
          <text key="lbl" x={fs * 0.6} y={h - fs * 0.6} fontFamily="IBM Plex Mono, monospace" fontSize={fs} fill="rgba(0,0,0,.42)">
            {b.text} · {b.cs}×{b.rs}
          </text>,
        );
      }
      break;
    }
    case 'shape': {
      const fill = toneColor(b.tone, s);
      const hh = h - top;
      if (b.shape === 'circle') {
        const r = Math.min(w, hh) / 2;
        const cx = b.align === 'right' ? w - r : b.align === 'center' ? w / 2 : r;
        nodes.push(<circle key="s" className="cut" cx={cx} cy={top + hh / 2} r={r} fill={fill} />);
      } else if (b.shape === 'triangle') {
        nodes.push(<polygon key="s" className="cut" points={`0,${h} ${w},${h} ${w / 2},${top}`} fill={fill} />);
      } else if (b.shape === 'wedge') {
        nodes.push(<polygon key="s" className="cut" points={`0,${top + hh / 2} ${w},${top} ${w},${h}`} fill={fill} />);
      } else {
        nodes.push(<rect key="s" className="cut" x={0} y={top} width={w} height={hh} fill={fill} />);
      }
      break;
    }
    case 'logo': {
      const d = Math.min(h - top, b0 * 3, w);
      nodes.push(<circle key="c" cx={d / 2} cy={top + d / 2} r={d / 2} fill={pal.ink} />);
      nodes.push(
        <text key="t" x={d / 2} y={top + d / 2 + d * 0.13} textAnchor="middle" fontFamily={fontStack(s.display)} fontWeight={700} fontSize={d * 0.36} fill={pal.paper}>
          {b.text}
        </text>,
      );
      break;
    }
  }

  if (boxed) nodes.push(<rect key="box" x={0} y={0} width={w} height={h} fill="none" stroke={pal.ink} strokeWidth={ctx.hair * 2} />);
  return <>{nodes}</>;
}

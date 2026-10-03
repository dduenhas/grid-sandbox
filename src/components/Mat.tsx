import { memo } from 'react';
import type { DeskTheme } from '../store/useStore';

interface Props {
  w: number;
  h: number;
  cell: number;
  theme: DeskTheme;
}

/** Self-healing cutting mat: cm grid with a heavier line every 5 cells, edge numbers and angle guides. */
export const Mat = memo(function Mat({ w, h, cell, theme }: Props) {
  if (theme === 'wood' || w <= 0 || h <= 0) return null;
  const c = Math.max(10, cell);
  const nx = Math.ceil(w / c);
  const ny = Math.ceil(h / c);
  const fs = Math.max(8, Math.min(11, c * 0.42));
  const d = Math.max(w, h);
  return (
    <svg className="mat" width={w} height={h} aria-hidden>
      <defs>
        <pattern id="mat-minor" width={c} height={c} patternUnits="userSpaceOnUse">
          <path d={`M ${c} 0 L 0 0 0 ${c}`} className="mat-line" fill="none" />
        </pattern>
        <pattern id="mat-major" width={c * 5} height={c * 5} patternUnits="userSpaceOnUse">
          <rect width={c * 5} height={c * 5} fill="url(#mat-minor)" />
          <path d={`M ${c * 5} 0 L 0 0 0 ${c * 5}`} className="mat-line-major" fill="none" />
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#mat-major)" />
      <g className="mat-diag" fill="none">
        <line x1={0} y1={0} x2={d} y2={d} />
        <line x1={w} y1={0} x2={w - d} y2={d} />
        <line x1={0} y1={h * 0.62} x2={d} y2={h * 0.62 - d * 0.577} strokeDasharray="6 6" />
        <path d={`M ${c * 4} ${c * 2} A ${c * 2} ${c * 2} 0 0 1 ${c * 4 + c * 2 * Math.cos(Math.PI / 6)} ${c * 2 + c * 2 * Math.sin(Math.PI / 6)}`} />
      </g>
      <g className="mat-num" fontSize={fs}>
        {Array.from({ length: nx }, (_, i) => (
          <text key={`t${i}`} x={i * c + 2} y={fs + 2} className={i % 5 === 0 ? 'b' : undefined}>
            {i}
          </text>
        ))}
        {Array.from({ length: nx }, (_, i) => (
          <text key={`b${i}`} x={i * c + 2} y={h - 4} className={i % 5 === 0 ? 'b' : undefined}>
            {i}
          </text>
        ))}
        {Array.from({ length: ny }, (_, i) =>
          i > 0 ? (
            <text key={`l${i}`} x={3} y={i * c - 3} className={i % 5 === 0 ? 'b' : undefined}>
              {i}
            </text>
          ) : null,
        )}
        <text x={c * 4 + c * 2.2} y={c * 2.2}>
          30°
        </text>
        <text x={w - c * 3} y={c * 3.2}>
          45°
        </text>
      </g>
    </svg>
  );
});

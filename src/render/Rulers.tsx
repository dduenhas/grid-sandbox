import type { Grid } from '../core/gridEngine';

/** T-square style rulers in the pad area around the page, with column and field markers. */
export function Rulers({ grid, pad, hair }: { grid: Grid; pad: number; hair: number }) {
  const W = grid.width;
  const H = grid.height;
  const mm = grid.page.unit === 'mm';
  const pxPerUnit = 1 / hair;
  const major = mm ? (10 * pxPerUnit >= 26 ? 10 : 50) : 100 * pxPerUnit >= 34 ? 100 : 500;
  const minor = mm ? (pxPerUnit >= 3 ? 1 : major === 50 ? 10 : 5) : major === 500 ? 100 : pxPerUnit >= 0.5 ? 10 : 50;
  const th = pad * 0.55;
  const y0 = -pad * 0.8;
  const x0 = -pad * 0.8;
  const fs = th * 0.36;
  const ticks = (len: number) => {
    const out: { v: number; kind: 0 | 1 | 2 }[] = [];
    for (let v = 0; v <= len + 1e-6; v += minor) {
      const r = Math.round(v * 1000) / 1000;
      out.push({ v: r, kind: r % major === 0 ? 2 : mm && r % 5 === 0 ? 1 : 0 });
    }
    return out;
  };
  const tx = ticks(W);
  const ty = ticks(H);
  const label = (v: number) => (mm ? String(v / 10) : String(v));
  const mark = Math.min(th * 0.35, pad * 0.2);

  return (
    <g className="ui-only rulers" pointerEvents="none">
      <rect x={-pad * 0.02} y={y0} width={W + pad * 0.04} height={th} rx={th * 0.08} className="ruler-body" />
      <rect x={x0} y={-pad * 0.02} width={th} height={H + pad * 0.04} rx={th * 0.08} className="ruler-body" />
      <g className="ruler-ink" strokeWidth={hair}>
        {tx.map((t) => (
          <line key={`x${t.v}`} x1={t.v} y1={y0 + th} x2={t.v} y2={y0 + th - th * (t.kind === 2 ? 0.5 : t.kind === 1 ? 0.32 : 0.18)} />
        ))}
        {ty.map((t) => (
          <line key={`y${t.v}`} x1={x0 + th} y1={t.v} x2={x0 + th - th * (t.kind === 2 ? 0.5 : t.kind === 1 ? 0.32 : 0.18)} y2={t.v} />
        ))}
      </g>
      <g className="ruler-label" fontSize={fs} fontFamily="IBM Plex Mono, monospace">
        {tx
          .filter((t) => t.kind === 2)
          .map((t) => (
            <text key={`lx${t.v}`} x={t.v + fs * 0.2} y={y0 + fs * 1.1}>
              {label(t.v)}
            </text>
          ))}
        {ty
          .filter((t) => t.kind === 2 && t.v > 0)
          .map((t) => (
            <text key={`ly${t.v}`} x={x0 + fs * 0.3} y={t.v - fs * 0.25}>
              {label(t.v)}
            </text>
          ))}
        <text x={W - fs * 2.4} y={y0 + fs * 1.1}>
          {mm ? 'cm' : 'px'}
        </text>
      </g>
      <g className="ruler-marks">
        {grid.cols.map((c, i) => (
          <g key={i}>
            <polygon points={`${c.start},${y0 + th} ${c.start - mark / 2},${y0 + th + mark} ${c.start + mark / 2},${y0 + th + mark}`} />
            <polygon points={`${c.start + c.size},${y0 + th} ${c.start + c.size - mark / 2},${y0 + th + mark} ${c.start + c.size + mark / 2},${y0 + th + mark}`} />
          </g>
        ))}
        {grid.rows.map((r, i) => (
          <g key={i}>
            <polygon points={`${x0 + th},${r.start} ${x0 + th + mark},${r.start - mark / 2} ${x0 + th + mark},${r.start + mark / 2}`} />
            <polygon points={`${x0 + th},${r.start + r.size} ${x0 + th + mark},${r.start + r.size - mark / 2} ${x0 + th + mark},${r.start + r.size + mark / 2}`} />
          </g>
        ))}
      </g>
    </g>
  );
}

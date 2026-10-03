import { forwardRef, type PointerEvent as RPE, type Ref } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { spanRect, type Grid } from '../core/gridEngine';
import type { Block } from '../core/layoutGenerator';
import type { School } from '../content/schools';
import { getRatio, doubleStrandScale, bodyFromLeading } from '../core/typeScale';
import type { GridInk, Overlays } from '../store/useStore';
import { BlockContent, type RenderCtx } from './BlockContent';
import { BUILD_INDEX, Dimensions, GridStructure, Guides } from './GridLayer';
import { INKS } from './theme';
import { Rulers } from './Rulers';

export type Span = { c: number; r: number; cs: number; rs: number };

export interface ArtboardProps {
  grid: Grid;
  blocks: Block[];
  school: School;
  overlays: Overlays;
  cutout: boolean;
  gridInk: GridInk;
  exportMode?: boolean;
  includeGrid?: boolean;
  buildStep?: number | null;
  selectedId?: string | null;
  pinnedIds?: string[];
  preview?: Record<string, Span>;
  pxPerUnit?: number;
  manual?: boolean;
  onBlockDown?: (e: RPE, b: Block, mode: 'move' | 'resize') => void;
  onBackgroundDown?: (e: RPE) => void;
  contentRef?: Ref<SVGGElement>;
}

export const blockLayerName = (b: Block) => b.id.replace(/[^\w-]/g, '_');

export const ArtboardSVG = forwardRef<SVGSVGElement, ArtboardProps>(function ArtboardSVG(p, ref) {
  const { grid, school, overlays, exportMode = false } = p;
  const W = grid.width;
  const H = grid.height;
  const unit = grid.page.unit;
  const hair = exportMode ? (unit === 'mm' ? 0.1 : 1) : 1 / (p.pxPerUnit ?? 1);
  const pad = exportMode ? 0 : Math.max(W, H) * 0.05;
  const ink = INKS[p.gridInk];
  const bodySize = bodyFromLeading(grid.baseline > 0 ? grid.baseline : grid.page.leading);
  const ratio = getRatio(school.scale).ratio;
  const ctx: RenderCtx = {
    school,
    grid,
    bodySize,
    scale: doubleStrandScale(bodySize, ratio),
    hair,
    cutout: p.cutout && !exportMode,
    exportMode,
  };
  const buildStep = p.buildStep ?? null;
  const showElements = buildStep === null || buildStep >= BUILD_INDEX.elements;
  const showGrid = !exportMode || p.includeGrid;
  const cx = W / 2;
  const cy = H / 2;
  const rot = grid.rotation ? `rotate(${grid.rotation} ${cx} ${cy})` : undefined;

  const size = exportMode
    ? { width: `${W}${unit}`, height: `${H}${unit}` }
    : { width: (W + pad * 2) * (p.pxPerUnit ?? 1), height: (H + pad * 2) * (p.pxPerUnit ?? 1) };

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={exportMode ? `0 0 ${W} ${H}` : `${-pad} ${-pad} ${W + pad * 2} ${H + pad * 2}`}
      {...size}
      className={`artboard ${p.cutout ? 'cutout' : ''} ${p.manual ? 'manual' : ''}`}
      textRendering="geometricPrecision"
    >
      <defs>
        <clipPath id="page-clip">
          {grid.pages.map((pg, i) => (
            <rect key={i} x={pg.x} y={pg.y} width={pg.w} height={pg.h} />
          ))}
        </clipPath>
      </defs>
      {!exportMode && <Rulers grid={grid} pad={pad} hair={hair} />}
      <g id="Papel">
        {grid.pages.map((pg, i) => (
          <rect key={i} className="paper" x={pg.x} y={pg.y} width={pg.w} height={pg.h} fill={school.palette.paper} onPointerDown={p.onBackgroundDown} />
        ))}
        {grid.spread && !exportMode && <line x1={grid.page.w} y1={0} x2={grid.page.w} y2={H} stroke="rgba(0,0,0,.18)" strokeWidth={hair * 2} />}
      </g>
      <g clipPath="url(#page-clip)">
        <g transform={rot} ref={p.contentRef}>
          {showGrid && <GridStructure grid={grid} overlays={overlays} ink={ink} hair={hair} buildStep={buildStep} exportMode={exportMode} />}
        </g>
        {overlays.tracing && !exportMode && (
          <g className="ui-only" pointerEvents="none">
            {grid.pages.map((pg, i) => (
              <rect key={i} x={pg.x} y={pg.y} width={pg.w} height={pg.h} fill="rgba(252,252,248,.55)" />
            ))}
          </g>
        )}
        <g transform={rot}>
          <g id="Elementos">
            {exportMode ? (
              p.blocks.map((b) => <StaticBlock key={b.id} b={b} grid={grid} ctx={ctx} />)
            ) : (
              <AnimatePresence>
                {showElements &&
                  p.blocks.map((b, i) => (
                    <LiveBlock
                      key={b.id}
                      b={b}
                      i={i}
                      grid={grid}
                      ctx={ctx}
                      span={p.preview?.[b.id]}
                      selected={p.selectedId === b.id}
                      pinned={!!p.pinnedIds?.includes(b.id)}
                      manual={!!p.manual}
                      onDown={p.onBlockDown}
                      building={buildStep !== null}
                    />
                  ))}
              </AnimatePresence>
            )}
          </g>
        </g>
        {showGrid && <Guides grid={grid} overlays={overlays} ink={ink} hair={hair} buildStep={buildStep} />}
      </g>
      {!exportMode && overlays.dimensions && <Dimensions grid={grid} ink={ink} hair={hair} />}
    </svg>
  );
});

function StaticBlock({ b, grid, ctx }: { b: Block; grid: Grid; ctx: RenderCtx }) {
  const r = spanRect(grid, b.c, b.r, b.cs, b.rs);
  const t = `translate(${r.x} ${r.y})${b.rotate ? ` rotate(${b.rotate} ${r.w / 2} ${r.h / 2})` : ''}`;
  return (
    <g id={blockLayerName(b)} transform={t}>
      <BlockContent block={b} w={r.w} h={r.h} ctx={ctx} />
    </g>
  );
}

interface LiveProps {
  b: Block;
  i: number;
  grid: Grid;
  ctx: RenderCtx;
  span?: Span;
  selected: boolean;
  pinned: boolean;
  manual: boolean;
  building: boolean;
  onDown?: ArtboardProps['onBlockDown'];
}

function LiveBlock({ b, i, grid, ctx, span, selected, pinned, manual, building, onDown }: LiveProps) {
  const s = span ?? b;
  const r = spanRect(grid, s.c, s.r, s.cs, s.rs);
  const hair = ctx.hair;
  const hs = Math.min(r.w / 2, r.h / 2, 14 * hair);
  return (
    <motion.g
      initial={{ opacity: 0, x: r.x, y: r.y - (building ? grid.height * 0.04 : 0), rotate: b.rotate + (building ? 4 : 0), scale: 1.03 }}
      animate={{ opacity: 1, x: r.x, y: r.y, rotate: b.rotate, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={span ? { duration: 0 } : { type: 'spring', stiffness: 210, damping: 26, delay: building ? i * 0.12 : Math.min(i * 0.025, 0.25) }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      className={`block kind-${b.kind}${selected ? ' selected' : ''}`}
      onPointerDown={(e) => onDown?.(e, b, 'move')}
    >
      <rect x={0} y={0} width={r.w} height={r.h} fill="transparent" />
      <BlockContent block={b} w={r.w} h={r.h} ctx={ctx} />
      {(selected || manual) && (
        <g className="ui-only">
          <rect x={0} y={0} width={r.w} height={r.h} fill="none" stroke={selected ? '#e2231a' : 'rgba(226,35,26,.35)'} strokeWidth={hair * (selected ? 2 : 1)} strokeDasharray={selected ? undefined : `${hair * 4} ${hair * 3}`} />
          {selected && manual && (
            <rect
              className="handle"
              x={r.w - hs * 0.7}
              y={r.h - hs * 0.7}
              width={hs}
              height={hs}
              fill="#e2231a"
              onPointerDown={(e) => {
                e.stopPropagation();
                onDown?.(e, b, 'resize');
              }}
            />
          )}
        </g>
      )}
      {pinned && (
        <g className="ui-only" transform={`translate(${r.w - hs * 1.2} ${hs * 0.2})`}>
          <circle cx={hs / 2} cy={hs / 2} r={hs / 2} fill="#e2231a" />
          <circle cx={hs / 2} cy={hs / 2} r={hs / 5} fill="#fff" />
        </g>
      )}
    </motion.g>
  );
}

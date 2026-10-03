import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPE } from 'react';
import { useDerived, useStore } from '../store/useStore';
import { ArtboardSVG, type Span } from '../render/ArtboardSVG';
import { nearestTrack, spanRect } from '../core/gridEngine';
import type { Block } from '../core/layoutGenerator';
import { docToScreenPx } from '../core/units';
import { Mat } from './Mat';
import { Toolbar } from './Toolbar';
import { VariantNav } from './VariantNav';
import { BuildCaption } from './BuildSequence';

export const ARTBOARD_ID = 'artboard-live';

export function Desk() {
  const d = useDerived();
  const s = useStore();
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<SVGGElement>(null);
  const [box, setBox] = useState({ w: 800, h: 600 });
  const [preview, setPreview] = useState<Record<string, Span> | undefined>();

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const W = d.grid.width;
  const H = d.grid.height;
  const pad = Math.max(W, H) * 0.05;
  const compact = box.w < 640;
  const reserveY = compact ? 150 : 150;
  const reserveX = compact ? 12 : 48;
  const fit = Math.max(0.01, Math.min((box.w - reserveX) / (W + pad * 2), (box.h - reserveY) / (H + pad * 2)));
  const pxPerUnit = fit * s.zoom;
  const realPx = docToScreenPx(1, d.page.unit);
  const matCell = (() => {
    let c = (d.page.unit === 'mm' ? 10 : 40) * pxPerUnit;
    while (c < 14) c *= 2;
    while (c > 90) c /= 2;
    return c;
  })();

  /* ---------- Manual drag with snapping ---------- */
  const toLocal = (e: { clientX: number; clientY: number }) => {
    const g = contentRef.current;
    const m = g?.getScreenCTM();
    if (!g || !m) return { x: 0, y: 0 };
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: pt.x, y: pt.y };
  };

  const onBlockDown = useCallback(
    (e: RPE, b: Block, mode: 'move' | 'resize') => {
      e.stopPropagation();
      const st = useStore.getState();
      st.set({ selectedId: b.id });
      if (st.mode !== 'manual' || e.button > 0) return;
      e.preventDefault();
      const grid = d.grid;
      const C = grid.cols.length;
      const R = grid.rows.length;
      const start = toLocal(e);
      const r0 = spanRect(grid, b.c, b.r, b.cs, b.rs);
      let span: Span = { c: b.c, r: b.r, cs: b.cs, rs: b.rs };
      const move = (ev: PointerEvent) => {
        const p = toLocal(ev);
        const dx = p.x - start.x;
        const dy = p.y - start.y;
        if (mode === 'move') {
          const c = Math.min(C - b.cs, nearestTrack(grid.cols, r0.x + dx));
          const r = Math.min(R - b.rs, nearestTrack(grid.rows, r0.y + dy));
          span = { c, r, cs: b.cs, rs: b.rs };
        } else {
          const ce = Math.max(b.c, nearestTrack(grid.cols, r0.x + r0.w + dx, 'end'));
          const re = Math.max(b.r, nearestTrack(grid.rows, r0.y + r0.h + dy, 'end'));
          span = { c: b.c, r: b.r, cs: ce - b.c + 1, rs: re - b.r + 1 };
        }
        setPreview({ [b.id]: span });
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        setPreview(undefined);
        if (span.c !== b.c || span.r !== b.r || span.cs !== b.cs || span.rs !== b.rs) useStore.getState().updateBlock(b.id, span);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [d.grid],
  );

  /* ---------- Touch: swipe for variations, pinch for zoom ---------- */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ x: number; y: number; t: number; dist?: number; zoom?: number } | null>(null);

  const onDown = (e: RPE) => {
    if (e.pointerType !== 'touch') return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) gesture.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { x: 0, y: 0, t: 0, dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: useStore.getState().zoom };
    }
  };
  const onMove = (e: RPE) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 2 && g?.dist) {
      const [a, b] = [...pointers.current.values()];
      const z = Math.max(0.3, Math.min(6, (g.zoom ?? 1) * (Math.hypot(a.x - b.x, a.y - b.y) / g.dist)));
      useStore.getState().set({ zoom: z });
    }
  };
  const onUp = (e: RPE) => {
    const g = gesture.current;
    const single = pointers.current.size === 1;
    pointers.current.delete(e.pointerId);
    if (!g || !single || g.dist) {
      if (pointers.current.size === 0) gesture.current = null;
      return;
    }
    gesture.current = null;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (Date.now() - g.t < 600 && Math.abs(dx) > 60 && Math.abs(dy) < 60 && !preview) {
      if (dx < 0) useStore.getState().next();
      else useStore.getState().prev();
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const z = useStore.getState().zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1);
    useStore.getState().set({ zoom: Math.max(0.3, Math.min(6, z)) });
  };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    };
    el.addEventListener('wheel', prevent, { passive: false });
    return () => el.removeEventListener('wheel', prevent);
  }, []);

  const svgW = (W + pad * 2) * pxPerUnit;
  const svgH = (H + pad * 2) * pxPerUnit;

  return (
    <main className={`desk theme-${s.deskTheme}`}>
      <div className="desk-frame">
        <div className="desk-surface" ref={wrapRef}>
          <Mat w={box.w} h={box.h} cell={matCell} theme={s.deskTheme} />
          <div className="desk-scroll" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={onWheel}>
            <div className="desk-stage" style={{ minWidth: svgW + 24, minHeight: svgH + reserveY }}>
              <div className="artboard-wrap" id={ARTBOARD_ID} style={{ width: svgW, height: svgH }}>
                <ArtboardSVG
                  grid={d.grid}
                  blocks={d.blocks}
                  school={d.school}
                  overlays={s.overlays}
                  cutout={s.cutout}
                  gridInk={s.gridInk}
                  buildStep={s.buildStep}
                  selectedId={s.selectedId}
                  pinnedIds={s.pinned.map((p) => p.id)}
                  preview={preview}
                  pxPerUnit={pxPerUnit}
                  manual={s.mode === 'manual'}
                  onBlockDown={onBlockDown}
                  onBackgroundDown={() => s.set({ selectedId: null })}
                  contentRef={contentRef}
                  key={s.fontsVersion}
                />
              </div>
            </div>
          </div>
          <Toolbar realZoom={pxPerUnit / realPx} fitZoom={fit / realPx} />
          <VariantNav />
          <BuildCaption />
        </div>
      </div>
    </main>
  );
}

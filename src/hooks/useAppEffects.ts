import { useEffect } from 'react';
import { derive, useStore, type State } from '../store/useStore';
import { SCHOOLS, getSchool, loadSchoolFonts } from '../content/schools';
import { clearMeasureCache } from '../render/text';
import { FORMATS } from '../core/formats';
import { GRID_TYPES } from '../core/gridPresets';
import type { GridTypeId } from '../core/gridEngine';

const isTyping = (e: KeyboardEvent) => {
  const t = e.target as HTMLElement | null;
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
};

export function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useStore.getState();
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        s.set({ paletteOpen: !s.paletteOpen });
        return;
      }
      if (e.key === 'Escape') {
        if (s.paletteOpen || s.exportOpen || s.helpOpen || s.aboutOpen || s.buildStep !== null || s.sheet)
          s.set({ paletteOpen: false, exportOpen: false, helpOpen: false, aboutOpen: false, buildStep: null, buildPlaying: false, sheet: null });
        else s.set({ selectedId: null });
        return;
      }
      if (isTyping(e) || s.paletteOpen || s.exportOpen) return;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) s.redo();
        else s.undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        s.redo();
        return;
      }
      if (mod) return;

      const d = derive(s);
      const sel = s.mode === 'manual' ? d.blocks.find((b) => b.id === s.selectedId) : undefined;
      const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (arrows[e.key]) {
        const [dx, dy] = arrows[e.key];
        if (sel) {
          e.preventDefault();
          const C = d.grid.cols.length;
          const R = d.grid.rows.length;
          if (e.shiftKey) s.updateBlock(sel.id, { cs: Math.max(1, Math.min(C - sel.c, sel.cs + dx)), rs: Math.max(1, Math.min(R - sel.r, sel.rs + dy)) });
          else s.updateBlock(sel.id, { c: Math.max(0, Math.min(C - sel.cs, sel.c + dx)), r: Math.max(0, Math.min(R - sel.rs, sel.r + dy)) });
          return;
        }
        if (dx > 0) s.next();
        else if (dx < 0) s.prev();
        return;
      }
      const k = e.key;
      if (/^[1-9]$/.test(k)) {
        const p = d.presets[Number(k) - 1];
        if (p) s.setGrid(p.id);
        return;
      }
      const toggles: Record<string, keyof State['overlays']> = { g: 'columns', b: 'baseline', l: 'rows', u: 'guides', t: 'tracing', d: 'dimensions' };
      const lower = k.toLowerCase();
      if (toggles[lower] && !e.shiftKey) return s.toggleOverlay(toggles[lower]);
      switch (k) {
        case ' ':
          e.preventDefault();
          return s.set({ autoplay: !s.autoplay });
        case 'r':
        case 'R':
          return s.random();
        case '[':
          return s.cycleGrid(-1);
        case ']':
          return s.cycleGrid(1);
        case 's':
        case 'S': {
          const i = SCHOOLS.findIndex((x) => x.id === s.schoolId);
          const n = SCHOOLS.length;
          return s.setSchool(SCHOOLS[(i + (e.shiftKey ? -1 : 1) + n) % n].id, true);
        }
        case 'o':
        case 'O':
          return s.toggleOrientation();
        case 'f':
        case 'F':
          return s.set({ spread: !s.spread, selectedId: null });
        case 'm':
        case 'M':
          return s.set({ mode: s.mode === 'manual' ? 'auto' : 'manual' });
        case 'c':
        case 'C':
          return s.set({ cutout: !s.cutout });
        case 'k':
        case 'K':
          return s.set({ buildStep: s.buildStep === null ? 0 : null, buildPlaying: s.buildStep === null });
        case 'p':
        case 'P':
          if (s.selectedId) s.togglePin(s.selectedId);
          return;
        case 'Delete':
        case 'Backspace':
          if (s.selectedId) s.removeBlock(s.selectedId);
          return;
        case 'e':
        case 'E':
          return s.set({ exportOpen: true });
        case '?':
          return s.set({ helpOpen: !s.helpOpen });
        case '+':
        case '=':
          return s.set({ zoom: Math.min(6, s.zoom * 1.2) });
        case '-':
          return s.set({ zoom: Math.max(0.3, s.zoom / 1.2) });
        case '0':
          return s.set({ zoom: 1 });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

export function useAutoplay() {
  const on = useStore((s) => s.autoplay);
  const ms = useStore((s) => s.autoplayMs);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => useStore.getState().autoStep(), ms);
    return () => clearInterval(id);
  }, [on, ms]);
}

export function useFonts() {
  const schoolId = useStore((s) => s.schoolId);
  useEffect(() => {
    let alive = true;
    loadSchoolFonts(getSchool(schoolId)).then(() => {
      if (!alive) return;
      clearMeasureCache();
      useStore.setState((s) => ({ fontsVersion: s.fontsVersion + 1 }));
    });
    return () => {
      alive = false;
    };
  }, [schoolId]);
}

/** Shareable URL: #f=a4&o=p&g=mod-4x6&s=swiss&v=3&sp=1 */
export function useUrlSync() {
  useEffect(() => {
    applyHash();
    window.addEventListener('hashchange', applyHash);

    let t: ReturnType<typeof setTimeout> | undefined;
    const unsub = useStore.subscribe((s) => {
      clearTimeout(t);
      t = setTimeout(() => {
        const d = derive(s);
        const q = new URLSearchParams({
          f: s.formatId,
          o: s.orientation === 'portrait' ? 'p' : 'l',
          g: d.preset.id,
          s: s.schoolId,
          v: String(s.variation),
          ...(s.spread ? { sp: '1' } : {}),
        });
        const next = `#${q.toString()}`;
        if (location.hash !== next) history.replaceState(null, '', next);
      }, 250);
    });
    return () => {
      window.removeEventListener('hashchange', applyHash);
      clearTimeout(t);
      unsub();
    };
  }, []);
}

function applyHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  const patch: Partial<State> = {};
  const f = h.get('f');
  if (f && FORMATS.some((x) => x.id === f)) patch.formatId = f;
  const o = h.get('o');
  if (o === 'p' || o === 'l') patch.orientation = o === 'p' ? 'portrait' : 'landscape';
  const g = h.get('g');
  if (g && GRID_TYPES.some((t) => t.id === g)) patch.gridTypeId = g as GridTypeId;
  const sc = h.get('s');
  if (sc && SCHOOLS.some((x) => x.id === sc)) patch.schoolId = sc;
  const v = Number(h.get('v'));
  if (h.has('v') && Number.isInteger(v) && v >= 0) patch.variation = v;
  if (h.has('f')) patch.spread = h.get('sp') === '1';
  if (!Object.keys(patch).length) return;
  const cur = useStore.getState();
  const gridChanged = (patch.formatId && patch.formatId !== cur.formatId) || (patch.gridTypeId && patch.gridTypeId !== cur.gridTypeId) || (patch.orientation && patch.orientation !== cur.orientation);
  useStore.getState().set({ ...patch, ...(gridChanged ? { gridOverrides: {} } : {}) });
}

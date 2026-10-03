import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FORMATS, getFormat, pageSize, type CustomSize, type Orientation } from '../core/formats';
import { buildGrid, type GridSpec, type GridTypeId } from '../core/gridEngine';
import { gridPresets } from '../core/gridPresets';
import {
  generateLayout,
  scoreLayout,
  variationArchetype,
  variationSeed,
  type Block,
  type BlockKind,
} from '../core/layoutGenerator';
import { SCHOOLS, getSchool, type ArchetypeId } from '../content/schools';
import type { PlaceholderLang } from '../content/placeholders';
import { bindingOf, type BindingId } from '../content/book';
import { ptToDoc } from '../core/units';
import { CAPTIONS, SUBHEADS, bodyText } from '../content/placeholders';

export interface Overlays {
  margins: boolean;
  columns: boolean;
  rows: boolean;
  modules: boolean;
  baseline: boolean;
  guides: boolean;
  eightpt: boolean;
  tracing: boolean;
  dimensions: boolean;
}

export type DeskTheme = 'mat' | 'black' | 'wood' | 'light';
export type GridInk = 'pencil' | 'blue' | 'magenta';
export type AutoTarget = 'variations' | 'grids' | 'schools' | 'all';
export type RightTab = 'theory' | 'school' | 'layout' | 'numbers';
export type Sheet = null | 'left' | 'right';

export interface State {
  formatId: string;
  orientation: Orientation;
  custom: CustomSize;
  spread: boolean;
  /** Binding allowance added to the inner margin on print. */
  binding: BindingId;
  schoolId: string;
  gridTypeId: GridTypeId | null;
  gridOverrides: Partial<GridSpec>;
  variation: number;
  archetypeLock: ArchetypeId | null;
  lang: PlaceholderLang;
  edits: Record<string, Block[]>;
  pinned: Block[];
  past: (Block[] | null)[];
  future: (Block[] | null)[];
  selectedId: string | null;
  mode: 'auto' | 'manual';
  autoplay: boolean;
  autoplayMs: number;
  autoTarget: AutoTarget;
  overlays: Overlays;
  cutout: boolean;
  gridInk: GridInk;
  deskTheme: DeskTheme;
  buildStep: number | null;
  buildPlaying: boolean;
  zoom: number;
  rightTab: RightTab;
  sheet: Sheet;
  paletteOpen: boolean;
  exportOpen: boolean;
  helpOpen: boolean;
  aboutOpen: boolean;
  fontsVersion: number;
}

export interface Actions {
  set: (p: Partial<State>) => void;
  setFormat: (id: string) => void;
  toggleOrientation: () => void;
  setSchool: (id: string, openExamples?: boolean) => void;
  setGrid: (id: GridTypeId) => void;
  cycleGrid: (dir: 1 | -1) => void;
  setOverride: (p: Partial<GridSpec>) => void;
  resetOverrides: () => void;
  next: () => void;
  prev: () => void;
  random: () => void;
  toggleOverlay: (k: keyof Overlays) => void;
  updateBlock: (id: string, patch: Partial<Block>) => void;
  addBlock: (kind: BlockKind) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  togglePin: (id: string) => void;
  resetEdits: () => void;
  undo: () => void;
  redo: () => void;
  autoStep: () => void;
  importProject: (json: string) => boolean;
}

export const DEFAULT_OVERLAYS: Overlays = {
  margins: true,
  columns: true,
  rows: true,
  modules: false,
  baseline: false,
  guides: true,
  eightpt: false,
  tracing: false,
  dimensions: false,
};

const initial: State = {
  formatId: 'a4',
  orientation: 'portrait',
  custom: { w: 200, h: 200, unit: 'mm' },
  spread: false,
  binding: 'none',
  schoolId: 'swiss',
  gridTypeId: 'mod-4x6',
  gridOverrides: {},
  variation: 0,
  archetypeLock: null,
  lang: 'pt',
  edits: {},
  pinned: [],
  past: [],
  future: [],
  selectedId: null,
  mode: 'auto',
  autoplay: false,
  autoplayMs: 2600,
  autoTarget: 'variations',
  overlays: DEFAULT_OVERLAYS,
  cutout: true,
  gridInk: 'pencil',
  deskTheme: 'mat',
  buildStep: null,
  buildPlaying: false,
  zoom: 1,
  rightTab: 'theory',
  sheet: null,
  paletteOpen: false,
  exportOpen: false,
  helpOpen: false,
  aboutOpen: false,
  fontsVersion: 0,
};

const BOOK_DEFAULT_TEXT: Partial<Record<BlockKind, string>> = {
  chapter: '1|A forma do livro',
  epigraph: 'A tipografia existe para honrar o conteúdo.|Robert Bringhurst',
  toc: '1|A forma do livro|9\n2|Margens e mancha|27\n3|A página dupla|45\n4|Hierarquia|63',
  notes: '¹|Ver Tschichold, A forma do livro, 1975.\n²|Bringhurst, Elementos do estilo tipográfico, 2.1.2.',
};

/* ---------- Derived state (memoized on its inputs) ---------- */

type DeriveInput = Pick<
  State,
  'formatId' | 'orientation' | 'custom' | 'spread' | 'schoolId' | 'gridTypeId' | 'gridOverrides' | 'variation' | 'archetypeLock' | 'lang' | 'edits' | 'pinned' | 'binding'
>;

function computeDerived(s: DeriveInput) {
  const format = getFormat(s.formatId, s.custom);
  const school = getSchool(s.schoolId);
  const base = pageSize(format, s.orientation);
  const print = base.medium === 'print';
  // book schools set their own leading, scaled from the 16×23 cm reference (13 pt) to the format
  const page = school.book && print ? { ...base, leading: ptToDoc((school.book.leadingPt * format.leadingPt) / 13, base.unit) } : base;
  const presets = gridPresets(page, school.preferredGrids);
  const preset = presets.find((p) => p.id === s.gridTypeId) ?? presets[0];
  const spec: GridSpec = { ...preset.spec, ...s.gridOverrides, type: preset.id };
  const bindingMm = print ? bindingOf(s.binding).mm : 0;
  const grid = buildGrid(bindingMm ? { ...spec, margins: { ...spec.margins, inner: spec.margins.inner + bindingMm } } : spec, page, s.spread);
  const C = grid.cols.length;
  const R = grid.rows.length;
  const gridKey = `${format.id}:${s.orientation}:${preset.id}:${s.spread ? 2 : 1}:${C}x${R}`;
  const editKey = `${gridKey}|${school.id}|${s.variation}|${s.archetypeLock ?? ''}`;
  const archetype = variationArchetype(school, s.variation, s.archetypeLock);
  const edited = s.edits[editKey];
  const generated = generateLayout({
    cols: C,
    rows: R,
    spineCol: grid.spineCol,
    school,
    seed: variationSeed({ gridKey, schoolId: school.id, index: s.variation }),
    archetype,
    lang: s.lang,
    pinned: s.pinned,
    colWidths: grid.cols.map((c) => c.size),
    linesPerRow: grid.baseline > 0 ? Math.max(1, Math.round(grid.rows[0].size / grid.baseline)) : 3,
  });
  const blocks = edited ?? generated.blocks;
  const score = scoreLayout(blocks, grid, school, archetype, bindingMm);
  return { format, page, school, presets, preset, spec, grid, gridKey, editKey, archetype, blocks, edited: !!edited, score, furniture: generated.furniture, bindingMm };
}

export type Derived = ReturnType<typeof computeDerived>;

let lastIn: DeriveInput | null = null;
let lastOut: Derived | null = null;
const KEYS: (keyof DeriveInput)[] = ['formatId', 'orientation', 'custom', 'spread', 'schoolId', 'gridTypeId', 'gridOverrides', 'variation', 'archetypeLock', 'lang', 'edits', 'pinned', 'binding'];

export function derive(s: DeriveInput): Derived {
  if (lastIn && lastOut && KEYS.every((k) => lastIn![k] === s[k])) return lastOut;
  lastIn = KEYS.reduce((o, k) => ({ ...o, [k]: s[k] }), {} as DeriveInput);
  lastOut = computeDerived(s);
  return lastOut;
}

/* ---------- Store ---------- */

const HISTORY = 80;

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => {
      const commit = (blocks: Block[] | null, selectedId?: string | null) => {
        const s = get();
        const d = derive(s);
        const edits = { ...s.edits };
        if (blocks) edits[d.editKey] = blocks;
        else delete edits[d.editKey];
        set({
          edits,
          past: [...s.past.slice(-HISTORY), d.edited ? d.blocks : null],
          future: [],
          ...(selectedId !== undefined ? { selectedId } : {}),
        });
      };
      const regen = { selectedId: null, past: [], future: [] };

      return {
        ...initial,
        set: (p) => set(p),
        setFormat: (id) => {
          const f = getFormat(id, get().custom);
          set({ formatId: id, orientation: f.defaultOrientation, gridOverrides: {}, variation: 0, ...regen });
        },
        toggleOrientation: () =>
          set((s) => ({ orientation: s.orientation === 'portrait' ? 'landscape' : 'portrait', gridOverrides: {}, ...regen })),
        setSchool: (id, openExamples = false) => {
          const school = getSchool(id);
          const patch: Partial<State> = { schoolId: id, ...regen };
          if (openExamples) {
            patch.gridTypeId = school.preferredGrids[0];
            patch.gridOverrides = {};
            patch.variation = 0;
            patch.archetypeLock = null;
            if (school.book) {
              const cur = get();
              if (!['book', 'a5'].includes(cur.formatId)) patch.formatId = 'book';
              patch.orientation = 'portrait';
              patch.spread = true;
              if (cur.binding === 'none') patch.binding = 'perfect';
            }
          }
          set(patch);
        },
        setGrid: (id) => set({ gridTypeId: id, gridOverrides: {}, variation: 0, ...regen }),
        cycleGrid: (dir) => {
          const d = derive(get());
          const i = d.presets.findIndex((p) => p.id === d.preset.id);
          const n = d.presets.length;
          get().setGrid(d.presets[(i + dir + n) % n].id);
        },
        setOverride: (p) => set((s) => ({ gridOverrides: { ...s.gridOverrides, ...p }, ...regen })),
        resetOverrides: () => set({ gridOverrides: {}, ...regen }),
        next: () => set((s) => ({ variation: s.variation + 1, ...regen })),
        prev: () => set((s) => ({ variation: Math.max(0, s.variation - 1), ...regen })),
        random: () => set({ variation: Math.floor(Math.random() * 9999), ...regen }),
        toggleOverlay: (k) => set((s) => ({ overlays: { ...s.overlays, [k]: !s.overlays[k] } })),

        updateBlock: (id, patch) => {
          const s = get();
          const d = derive(s);
          const blocks = d.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b));
          commit(blocks);
          if (s.pinned.some((p) => p.id === id)) {
            set({ pinned: get().pinned.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
          }
        },
        addBlock: (kind) => {
          const s = get();
          const d = derive(s);
          const C = d.grid.cols.length;
          const R = d.grid.rows.length;
          const n = d.blocks.filter((b) => b.kind === kind).length + 1;
          const id = `${kind}-${n}-${Date.now().toString(36).slice(-4)}`;
          const sizes: Partial<Record<BlockKind, [number, number]>> = {
            headline: [Math.max(1, Math.ceil(C * 0.75)), 1],
            image: [Math.max(1, Math.ceil(C / 2)), Math.max(1, Math.ceil(R / 3))],
            body: [Math.max(1, Math.ceil(C / 3)), Math.max(1, Math.ceil(R / 3))],
            shape: [Math.max(1, Math.ceil(C / 2)), Math.max(1, Math.ceil(R / 3))],
            chapter: [C, Math.max(1, Math.ceil(R / 4))],
            epigraph: [C, Math.max(1, Math.ceil(R / 6))],
            toc: [C, Math.max(1, Math.ceil(R * 0.7))],
            notes: [C, Math.max(1, Math.ceil(R / 6))],
          };
          const [cs, rs] = sizes[kind] ?? [Math.max(1, Math.ceil(C / 4)), 1];
          const text =
            kind === 'headline'
              ? d.school.headlines[0]
              : kind === 'body'
                ? bodyText(s.lang, n)
                : kind === 'caption'
                  ? CAPTIONS[0]
                  : kind === 'subhead'
                    ? SUBHEADS[0]
                    : kind === 'quote'
                      ? d.school.quotes[0]
                      : kind === 'kicker'
                        ? d.school.kickers[0]
                        : kind === 'folio'
                          ? '1'
                          : kind === 'image'
                            ? `Imagem ${n}`
                            : (BOOK_DEFAULT_TEXT[kind] ?? '');
          const block: Block = {
            id,
            kind,
            c: 0,
            r: 0,
            cs: Math.min(cs, C),
            rs: Math.min(rs, R),
            text,
            tone: kind === 'image' ? 'image' : kind === 'shape' ? 'accent' : 'ink',
            rotate: 0,
            align: d.school.align === 'center' ? 'center' : 'left',
            shape: kind === 'shape' ? 'circle' : undefined,
          };
          commit([...d.blocks, block], id);
          set({ mode: 'manual' });
        },
        removeBlock: (id) => {
          const d = derive(get());
          commit(
            d.blocks.filter((b) => b.id !== id),
            null,
          );
          set((s) => ({ pinned: s.pinned.filter((p) => p.id !== id) }));
        },
        duplicateBlock: (id) => {
          const d = derive(get());
          const b = d.blocks.find((x) => x.id === id);
          if (!b) return;
          const C = d.grid.cols.length;
          const nb = { ...b, id: `${b.kind}-${Date.now().toString(36)}`, c: Math.min(C - b.cs, b.c + 1), pinned: false };
          commit([...d.blocks, nb], nb.id);
        },
        togglePin: (id) => {
          const s = get();
          const d = derive(s);
          if (s.pinned.some((p) => p.id === id)) {
            set({ pinned: s.pinned.filter((p) => p.id !== id) });
            return;
          }
          const b = d.blocks.find((x) => x.id === id);
          if (b) set({ pinned: [...s.pinned, { ...b, pinned: true }] });
        },
        resetEdits: () => commit(null, null),
        undo: () => {
          const s = get();
          if (!s.past.length) return;
          const d = derive(s);
          const prev = s.past[s.past.length - 1];
          const edits = { ...s.edits };
          if (prev) edits[d.editKey] = prev;
          else delete edits[d.editKey];
          set({ edits, past: s.past.slice(0, -1), future: [...s.future, d.edited ? d.blocks : null] });
        },
        redo: () => {
          const s = get();
          if (!s.future.length) return;
          const d = derive(s);
          const nxt = s.future[s.future.length - 1];
          const edits = { ...s.edits };
          if (nxt) edits[d.editKey] = nxt;
          else delete edits[d.editKey];
          set({ edits, future: s.future.slice(0, -1), past: [...s.past, d.edited ? d.blocks : null] });
        },
        autoStep: () => {
          const s = get();
          const t = s.autoTarget;
          if (t === 'variations') return s.next();
          if (t === 'grids') return s.cycleGrid(1);
          if (t === 'schools') {
            const i = SCHOOLS.findIndex((x) => x.id === s.schoolId);
            return s.setSchool(SCHOOLS[(i + 1) % SCHOOLS.length].id, true);
          }
          const r = Math.random();
          if (r < 0.6) s.next();
          else if (r < 0.85) s.cycleGrid(1);
          else s.setSchool(SCHOOLS[Math.floor(Math.random() * SCHOOLS.length)].id, true);
        },
        importProject: (json) => {
          try {
            const data = JSON.parse(json);
            if (data?.app !== 'grid-sandbox' || typeof data.state !== 'object') return false;
            const st = data.state as Partial<State>;
            if (st.formatId && st.formatId !== 'custom' && !FORMATS.some((f) => f.id === st.formatId)) return false;
            set({ ...st, ...regen });
            return true;
          } catch {
            return false;
          }
        },
      };
    },
    {
      name: 'grid-sandbox:v1',
      partialize: (s) => ({
        formatId: s.formatId,
        orientation: s.orientation,
        custom: s.custom,
        spread: s.spread,
        binding: s.binding,
        schoolId: s.schoolId,
        gridTypeId: s.gridTypeId,
        gridOverrides: s.gridOverrides,
        variation: s.variation,
        archetypeLock: s.archetypeLock,
        lang: s.lang,
        edits: s.edits,
        pinned: s.pinned,
        mode: s.mode,
        autoplayMs: s.autoplayMs,
        autoTarget: s.autoTarget,
        overlays: s.overlays,
        cutout: s.cutout,
        gridInk: s.gridInk,
        deskTheme: s.deskTheme,
        rightTab: s.rightTab,
      }),
    },
  ),
);

export const PROJECT_KEYS = [
  'formatId',
  'orientation',
  'custom',
  'spread',
  'binding',
  'schoolId',
  'gridTypeId',
  'gridOverrides',
  'variation',
  'archetypeLock',
  'lang',
  'edits',
  'pinned',
  'overlays',
] as const;

export function useDerived(): Derived {
  return useStore((s) => derive(s));
}

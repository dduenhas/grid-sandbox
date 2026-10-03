import { describe, expect, it } from 'vitest';
import { FORMATS, pageSize, type Orientation } from '../formats';
import { buildGrid, distributeInt, isValidGrid } from '../gridEngine';
import { gridPresets } from '../gridPresets';
import { ARCHETYPES, generateLayout, scoreLayout, variationArchetype, variationSeed } from '../layoutGenerator';
import { SCHOOLS } from '../../content/schools';
import { GRID_CONCEPTS } from '../../content/concepts';

const ORIENTS: Orientation[] = ['portrait', 'landscape'];

describe('grid presets', () => {
  for (const f of FORMATS)
    for (const o of ORIENTS)
      for (const spread of [false, true])
        it(`${f.id} ${o}${spread ? ' spread' : ''} has >= 10 valid grids`, () => {
          const p = pageSize(f, o);
          const presets = gridPresets(p);
          const valid = presets.filter((g) => isValidGrid(buildGrid(g.spec, p, spread)));
          expect(valid.length).toBeGreaterThanOrEqual(10);
          expect(valid.length).toBe(presets.length);
        });

  it('every grid type has a theory entry', () => {
    const p = pageSize(FORMATS[0], 'portrait');
    for (const g of gridPresets(p)) expect(GRID_CONCEPTS[g.id]).toBeDefined();
  });
});

describe('baseline lock', () => {
  it('makes every field a whole number of lines and gutters one line', () => {
    const p = pageSize(FORMATS[0], 'portrait');
    const spec = gridPresets(p).find((g) => g.id === 'mod-4x6')!.spec;
    const g = buildGrid(spec, p);
    for (const r of g.rows) {
      const lines = r.size / g.baseline;
      expect(Math.abs(lines - Math.round(lines))).toBeLessThan(1e-6);
    }
    expect(Math.abs(g.rows[1].start - (g.rows[0].start + g.rows[0].size) - g.baseline)).toBeLessThan(1e-6);
  });

  it('distributeInt keeps the total', () => {
    expect(distributeInt(17, [1, 1, 2, 3]).reduce((a, b) => a + b, 0)).toBe(17);
  });
});

describe('layout generator', () => {
  const p = pageSize(FORMATS[0], 'portrait');
  const presets = gridPresets(p);

  it('is deterministic for the same seed', () => {
    const s = SCHOOLS[0];
    const opts = { cols: 4, rows: 6, spineCol: 0, school: s, seed: 1234, archetype: 'hero' as const, lang: 'pt' as const };
    expect(generateLayout(opts)).toEqual(generateLayout(opts));
    expect(variationSeed({ gridKey: 'a', schoolId: 'b', index: 3 })).toBe(variationSeed({ gridKey: 'a', schoolId: 'b', index: 3 }));
  });

  it('never overlaps blocks that occupy cells, stays inside the grid and always has a headline', () => {
    for (const school of SCHOOLS)
      for (const preset of presets)
        for (let i = 0; i < 6; i++) {
          const grid = buildGrid(preset.spec, p);
          const C = grid.cols.length;
          const R = grid.rows.length;
          const layout = generateLayout({
            cols: C,
            rows: R,
            spineCol: 0,
            school,
            seed: variationSeed({ gridKey: preset.id, schoolId: school.id, index: i }),
            archetype: variationArchetype(school, i),
            lang: 'pt',
          });
          const cells = new Set<string>();
          for (const b of layout.blocks) {
            expect(b.c + b.cs).toBeLessThanOrEqual(C);
            expect(b.r + b.rs).toBeLessThanOrEqual(R);
            if (b.behind) continue;
            for (let y = b.r; y < b.r + b.rs; y++)
              for (let x = b.c; x < b.c + b.cs; x++) {
                const k = `${x},${y}`;
                expect(cells.has(k)).toBe(false);
                cells.add(k);
              }
          }
          // free layouts need a headline; book pages enter through the chapter head, the text or the title page
          const entry = school.book ? ['headline', 'chapter', 'body', 'toc', 'epigraph'] : ['headline'];
          expect(layout.blocks.some((b) => entry.includes(b.kind))).toBe(true);
          const score = scoreLayout(layout.blocks, grid, school, layout.archetype);
          expect(score.total).toBeGreaterThanOrEqual(0);
          expect(score.total).toBeLessThanOrEqual(100);
        }
  });

  it('fills both pages of a spread', () => {
    // book openings leave the verso blank on purpose
    for (const school of SCHOOLS.filter((s) => !s.book))
      for (const preset of presets)
        for (let i = 0; i < 4; i++) {
          const grid = buildGrid(preset.spec, p, true);
          const S = grid.spineCol;
          expect(S).toBeGreaterThan(0);
          const layout = generateLayout({
            cols: grid.cols.length,
            rows: grid.rows.length,
            spineCol: S,
            school,
            seed: variationSeed({ gridKey: `${preset.id}-sp`, schoolId: school.id, index: i }),
            archetype: variationArchetype(school, i),
            lang: 'pt',
          });
          const content = layout.blocks.filter((b) => b.kind !== 'folio');
          expect(content.some((b) => b.c < S)).toBe(true);
          expect(content.some((b) => b.c + b.cs > S)).toBe(true);
        }
  });

  it('keeps pinned blocks in place', () => {
    const s = SCHOOLS[0];
    const pinned = [{ id: 'headline-1', kind: 'headline' as const, c: 0, r: 0, cs: 2, rs: 1, text: 'Fixo', tone: 'ink' as const, rotate: 0, align: 'left' as const }];
    for (const a of ARCHETYPES) {
      const l = generateLayout({ cols: 4, rows: 6, spineCol: 0, school: s, seed: 9, archetype: a.id, lang: 'pt', pinned });
      const h = l.blocks.find((b) => b.id === 'headline-1')!;
      expect(h).toMatchObject({ c: 0, r: 0, cs: 2, rs: 1, text: 'Fixo' });
    }
  });
});

describe('book pages', () => {
  const book = FORMATS.find((f) => f.id === 'book')!;
  const p = pageSize(book, 'portrait');
  const bookSchools = SCHOOLS.filter((s) => s.book);
  const bookTypes = ARCHETYPES.filter((a) => a.book);

  it('there are book schools with one, two and three font roles', () => {
    expect(bookSchools.length).toBeGreaterThanOrEqual(5);
    const counts = new Set(bookSchools.map((s) => new Set([s.display.family, s.text.family, (s.para ?? s.text).family]).size));
    expect([...counts].sort()).toEqual([1, 2, 3]);
  });

  it('cycles only book page types for book schools and only free layouts for the others', () => {
    for (const s of SCHOOLS) {
      const cyc = Array.from({ length: 30 }, (_, i) => variationArchetype(s, i));
      for (const a of cyc) expect(!!ARCHETYPES.find((x) => x.id === a)!.book).toBe(!!s.book);
    }
  });

  it('every book school lays out every page type on a spread without overlaps', () => {
    for (const school of bookSchools)
      for (const gt of school.preferredGrids) {
        const preset = gridPresets(p, school.preferredGrids).find((g) => g.id === gt)!;
        const grid = buildGrid(preset.spec, p, true);
        const C = grid.cols.length;
        const R = grid.rows.length;
        for (const a of bookTypes)
          for (let i = 0; i < 3; i++) {
            const layout = generateLayout({
              cols: C,
              rows: R,
              spineCol: grid.spineCol,
              school,
              seed: 100 + i,
              archetype: a.id,
              lang: 'pt',
              colWidths: grid.cols.map((c) => c.size),
              linesPerRow: Math.round(grid.rows[0].size / grid.baseline),
            });
            const cells = new Set<string>();
            for (const b of layout.blocks) {
              expect(b.c + b.cs).toBeLessThanOrEqual(C);
              expect(b.r + b.rs).toBeLessThanOrEqual(R);
              for (let y = b.r; y < b.r + b.rs; y++)
                for (let x = b.c; x < b.c + b.cs; x++) {
                  expect(cells.has(`${x},${y}`)).toBe(false);
                  cells.add(`${x},${y}`);
                }
            }
            expect(layout.blocks.length).toBeGreaterThan(0);
            expect(layout.furniture).toHaveLength(2);
            const [verso, recto] = layout.furniture!;
            expect(verso.folio % 2).toBe(0);
            expect(recto.folio % 2).toBe(1);
            if (a.id === 'chapter') expect(recto.role).toBe('opening');
            const score = scoreLayout(layout.blocks, grid, school, a.id, 5);
            expect(score.total).toBeGreaterThanOrEqual(0);
            expect(score.total).toBeLessThanOrEqual(100);
          }
      }
  });

  it('book margins progress inner < top < outer < bottom', () => {
    for (const id of ['book-trade', 'book-morris'] as const) {
      const m = gridPresets(p).find((g) => g.id === id)!.spec.margins;
      expect(m.inner).toBeLessThan(m.top);
      expect(m.top).toBeLessThan(m.outer);
      expect(m.outer).toBeLessThan(m.bottom);
    }
  });
});

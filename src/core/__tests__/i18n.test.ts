import { afterEach, describe, expect, it } from 'vitest';
import { setLang, type UiLang } from '../../i18n';
import { FORMATS, pageSize } from '../formats';
import { buildGrid } from '../gridEngine';
import { GRID_TYPES, gridPresets } from '../gridPresets';
import { ARCHETYPES, generateLayout, variationArchetype, variationSeed } from '../layoutGenerator';
import { SCHOOLS } from '../../content/schools';
import { GRID_CONCEPTS } from '../../content/concepts';
import * as BOOK from '../../content/book';
import { CAPTIONS, LABEL_IMAGE, SUBHEADS } from '../../content/placeholders';

const inLang = <T,>(l: UiLang, f: () => T): T => {
  setLang(l);
  try {
    return f();
  } finally {
    setLang('pt');
  }
};

afterEach(() => setLang('pt'));

describe('interface language', () => {
  it('Portuguese is the default and the content is unchanged', () => {
    expect(SCHOOLS[0].name).toBe('Suíço / Estilo Tipográfico Internacional');
    expect(FORMATS[0].name).not.toMatch(/Letter/);
    expect(GRID_CONCEPTS['col-4'].title).toBeTruthy();
  });

  it('English replaces names, keeps ids and structure', () => {
    const pt = SCHOOLS.map((s) => ({ id: s.id, name: s.name, grids: s.preferredGrids, palette: s.palette }));
    const en = inLang('en', () => SCHOOLS.map((s) => ({ id: s.id, name: s.name, grids: s.preferredGrids, palette: s.palette })));
    expect(en.map((s) => s.id)).toEqual(pt.map((s) => s.id));
    expect(en.map((s) => s.grids)).toEqual(pt.map((s) => s.grids));
    expect(en.map((s) => s.palette)).toEqual(pt.map((s) => s.palette));
    expect(en[0].name).toBe('Swiss / International Typographic Style');
    expect(SCHOOLS[0].name).toBe(pt[0].name);
  });

  it('English sample arrays have the same length as the Portuguese ones', () => {
    const lens = () => [
      ...SCHOOLS.flatMap((s) => [s.headlines.length, s.kickers.length, s.quotes.length]),
      CAPTIONS.length,
      SUBHEADS.length,
      LABEL_IMAGE.length,
      ...[BOOK.BOOK_TITLES, BOOK.CHAPTER_TITLES, BOOK.HEADS_A, BOOK.HEADS_B, BOOK.HEADS_C, BOOK.EPIGRAPHS, BOOK.NOTES, BOOK.DEDICATIONS, BOOK.PART_TITLES, BOOK.PUBLISHERS, BOOK.BOOK_SUBTITLES].map((a) => a.length),
      GRID_TYPES.length,
      ARCHETYPES.length,
    ];
    expect(inLang('en', lens)).toEqual(lens());
  });

  it('every grid and school has English text', () => {
    inLang('en', () => {
      for (const s of SCHOOLS) expect(s.summary, s.id).not.toMatch(/ção|ções| não | é /);
      for (const g of GRID_TYPES) expect(GRID_CONCEPTS[g.id].concept, g.id).not.toMatch(/ção|ções| não | é /);
    });
  });

  it('layout geometry is identical in both languages', () => {
    const geo = (spread: boolean) => {
      const out: unknown[] = [];
      for (const fmt of [FORMATS[0], FORMATS.find((f) => f.id === 'book')!]) {
        const p = pageSize(fmt, 'portrait');
        for (const school of SCHOOLS)
          for (const preset of gridPresets(p).slice(0, 6))
            for (let i = 0; i < 3; i++) {
              const grid = buildGrid(preset.spec, p, spread);
              const layout = generateLayout({
                cols: grid.cols.length,
                rows: grid.rows.length,
                spineCol: grid.spineCol,
                school,
                seed: variationSeed({ gridKey: preset.id, schoolId: school.id, index: i }),
                archetype: variationArchetype(school, i),
                lang: 'pt',
                colWidths: grid.cols.map((c) => c.size),
                linesPerRow: Math.round(grid.rows[0].size / grid.baseline),
              });
              out.push(layout.archetype, layout.blocks.map((b) => [b.id, b.kind, b.c, b.r, b.cs, b.rs, b.tone, b.rotate, b.align]));
            }
      }
      return out;
    };
    for (const spread of [false, true]) expect(inLang('en', () => geo(spread))).toEqual(geo(spread));
  });
});

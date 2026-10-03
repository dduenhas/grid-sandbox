import { renderToStaticMarkup } from 'react-dom/server';
import { ArtboardSVG } from '../render/ArtboardSVG';
import type { Derived, Overlays } from '../store/useStore';
import { googleFontsUrl } from '../content/schools';
import type { GridInk } from '../store/useStore';

export interface SvgOptions {
  includeGrid: boolean;
  overlays: Overlays;
  gridInk: GridInk;
  embedFontCss?: string;
}

/**
 * Static SVG in real units (mm or px). Group ids become layer names in Illustrator and Figma:
 * Papel, Grid (Margens, Colunas, Campos, Linha-de-base), Elementos (one group per block), Guias.
 */
export function toSVG(d: Derived, o: SvgOptions): string {
  const markup = renderToStaticMarkup(
    <ArtboardSVG
      grid={d.grid}
      blocks={d.blocks}
      school={d.school}
      furniture={d.furniture}
      overlays={{ ...o.overlays, tracing: false, dimensions: false }}
      cutout={false}
      gridInk={o.gridInk}
      exportMode
      includeGrid={o.includeGrid}
    />,
  );
  const style = o.embedFontCss ? `<style>${o.embedFontCss}</style>` : `<style>@import url('${googleFontsUrl(d.school).replace(/&/g, '&amp;')}');</style>`;
  const body = markup.replace(/<svg([^>]*)>/, (m) => `${m}<title>Grid Sandbox · ${d.format.name} · ${d.preset.type.name}</title>${style}`).replace(/ class="[^"]*"/g, '');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`;
}

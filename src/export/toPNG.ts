import { googleFontsUrl, type School } from '../content/schools';

const fontCssCache = new Map<string, string>();

function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(b);
  });
}

/**
 * Inlines the school's Latin font files as data URLs. An SVG rendered through <img> cannot load
 * external fonts, so without this the PNG would fall back to system faces.
 */
export async function embeddedFontCss(s: School): Promise<string> {
  const cached = fontCssCache.get(s.id);
  if (cached) return cached;
  try {
    const css = await (await fetch(googleFontsUrl(s))).text();
    const faces = css.split('@font-face').slice(1).map((f) => `@font-face${f.split('}')[0]}}`);
    const latin = faces.filter((f) => !/unicode-range/.test(f) || /U\+0000-00FF/i.test(f));
    const out: string[] = [];
    for (const f of latin) {
      const m = f.match(/url\((https:[^)]+)\)/);
      if (!m) continue;
      const data = await blobToDataUrl(await (await fetch(m[1])).blob());
      out.push(f.replace(m[1], data));
    }
    const result = out.join('\n');
    fontCssCache.set(s.id, result);
    return result;
  } catch {
    return '';
  }
}

export async function svgToPng(svg: string, pxW: number, pxH: number, background?: string): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error('Falha ao rasterizar o SVG'));
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(pxW);
    canvas.height = Math.round(pxH);
    const ctx = canvas.getContext('2d')!;
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Canvas vazio'))), 'image/png'));
  } finally {
    URL.revokeObjectURL(url);
  }
}

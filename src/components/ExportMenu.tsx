import { useMemo, useRef, useState } from 'react';
import { useDerived, useStore } from '../store/useStore';
import { Modal, Segmented, Toggle } from './ui';
import { toSVG } from '../export/toSVG';
import { embeddedFontCss, svgToPng } from '../export/toPNG';
import { toCSS, toSpecs } from '../export/toCSS';
import { toJSON } from '../export/toJSON';
import { downloadBlob, downloadText, fileBase } from '../export/download';
import { mmToPx } from '../core/units';

type Tab = 'files' | 'css' | 'specs';

export function ExportMenu() {
  const s = useStore();
  const d = useDerived();
  const [tab, setTab] = useState<Tab>('files');
  const [includeGrid, setIncludeGrid] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const base = fileBase(['grid', d.format.name, s.orientation, d.preset.id, d.school.id, `v${s.variation + 1}`]);
  const mm = d.page.unit === 'mm';
  const css = useMemo(() => toCSS(d), [d]);
  const specs = useMemo(() => toSpecs(d), [d]);

  const close = () => s.set({ exportOpen: false });
  const opts = { includeGrid, overlays: s.overlays, gridInk: s.gridInk };

  const svg = () => {
    downloadText(toSVG(d, opts), `${base}.svg`, 'image/svg+xml');
    setMsg('SVG salvo. No Illustrator: Arquivo > Abrir. No Figma: arraste o arquivo para o canvas.');
  };

  const png = async (label: string, pxW: number, pxH: number) => {
    setBusy(label);
    try {
      const fonts = await embeddedFontCss(d.school);
      const markup = toSVG(d, { ...opts, embedFontCss: fonts });
      const blob = await svgToPng(markup, pxW, pxH, d.school.palette.paper);
      downloadBlob(blob, `${base}-${label}.png`);
      setMsg(`PNG ${Math.round(pxW)} × ${Math.round(pxH)} px salvo. Abra no Photoshop como camada de referência.`);
    } catch (e) {
      setMsg(`Erro: ${(e as Error).message}`);
    } finally {
      setBusy(null);
    }
  };

  const W = d.grid.width;
  const H = d.grid.height;
  const pngs: { label: string; w: number; h: number }[] = mm
    ? [
        { label: '96dpi', w: mmToPx(W, 96), h: mmToPx(H, 96) },
        { label: '150dpi', w: mmToPx(W, 150), h: mmToPx(H, 150) },
        { label: '300dpi', w: mmToPx(W, 300), h: mmToPx(H, 300) },
      ]
    : [
        { label: '1x', w: W, h: H },
        { label: '2x', w: W * 2, h: H * 2 },
        { label: '3x', w: W * 3, h: H * 3 },
      ];

  const copy = async (t: string) => {
    await navigator.clipboard.writeText(t);
    setMsg('Copiado para a área de transferência.');
  };

  const onImport = async (f: File) => {
    const ok = s.importProject(await f.text());
    setMsg(ok ? 'Projeto importado.' : 'Arquivo inválido.');
  };

  return (
    <Modal title="Exportar para a ferramenta final" onClose={close} wide>
      <Segmented
        label="Tipo"
        value={tab}
        onChange={setTab}
        options={[
          { id: 'files', label: 'Arquivos' },
          { id: 'css', label: 'CSS / tokens' },
          { id: 'specs', label: 'Ficha técnica' },
        ]}
      />
      {tab === 'files' && (
        <div className="export-grid">
          <div className="export-card">
            <h4>SVG vetorial</h4>
            <p className="small muted">Dimensões reais ({mm ? 'mm' : 'px'}), camadas nomeadas: Papel, Grid, Elementos, Guias. Para Illustrator, Figma, Affinity e Inkscape.</p>
            <Toggle label="Incluir o grid como camada" checked={includeGrid} onChange={setIncludeGrid} />
            <button className="btn primary" onClick={svg}>
              Baixar SVG
            </button>
          </div>
          <div className="export-card">
            <h4>PNG</h4>
            <p className="small muted">Fontes incorporadas. Ideal como referência no Photoshop ou para apresentar.</p>
            <div className="row-inline wrap">
              {pngs.map((p) => (
                <button key={p.label} className="btn" disabled={!!busy} onClick={() => png(p.label, p.w, p.h)}>
                  {busy === p.label ? '…' : p.label} <span className="muted small">{Math.round(p.w)}×{Math.round(p.h)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="export-card">
            <h4>Projeto (JSON)</h4>
            <p className="small muted">Salva formato, grid, escola, variação e edições manuais. Reabra depois ou compartilhe.</p>
            <div className="row-inline wrap">
              <button className="btn" onClick={() => downloadText(toJSON(s), `${base}.grid.json`, 'application/json')}>
                Exportar JSON
              </button>
              <button className="btn" onClick={() => fileRef.current?.click()}>
                Importar…
              </button>
              <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
            </div>
          </div>
          <div className="export-card">
            <h4>Link</h4>
            <p className="small muted">O endereço da página guarda formato, grid, escola e variação.</p>
            <button className="btn" onClick={() => copy(location.href)}>
              Copiar link
            </button>
          </div>
        </div>
      )}
      {tab === 'css' && (
        <div className="code-wrap">
          <pre className="code">{css}</pre>
          <div className="row-inline">
            <button className="btn primary" onClick={() => copy(css)}>
              Copiar CSS
            </button>
            <button className="btn" onClick={() => downloadText(css, `${base}.css`, 'text/css')}>
              Baixar .css
            </button>
          </div>
        </div>
      )}
      {tab === 'specs' && (
        <div className="code-wrap">
          <pre className="code">{specs}</pre>
          <div className="row-inline">
            <button className="btn primary" onClick={() => copy(specs)}>
              Copiar ficha
            </button>
            <button className="btn" onClick={() => downloadText(specs, `${base}.txt`)}>
              Baixar .txt
            </button>
          </div>
        </div>
      )}
      {msg && <p className="toast-inline">{msg}</p>}
    </Modal>
  );
}

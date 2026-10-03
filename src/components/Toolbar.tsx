import { useStore, type DeskTheme, type GridInk, type Overlays } from '../store/useStore';
import { useT } from '../hooks/useT';
import { Icon } from './Icon';

const TOGGLES: { k: keyof Overlays; label: [string, string]; key?: string }[] = [
  { k: 'margins', label: ['Margens', 'Margins'] },
  { k: 'columns', label: ['Colunas', 'Columns'], key: 'G' },
  { k: 'rows', label: ['Campos', 'Fields'], key: 'L' },
  { k: 'modules', label: ['Módulos', 'Modules'] },
  { k: 'baseline', label: ['Linha de base', 'Baseline'], key: 'B' },
  { k: 'guides', label: ['Guias', 'Guides'], key: 'U' },
  { k: 'eightpt', label: ['8pt', '8pt'] },
  { k: 'tracing', label: ['Vegetal', 'Tracing'], key: 'T' },
  { k: 'dimensions', label: ['Cotas', 'Dimensions'], key: 'D' },
];

const INKS: { id: GridInk; label: [string, string] }[] = [
  { id: 'pencil', label: ['Lápis', 'Pencil'] },
  { id: 'blue', label: ['Azul não-repro', 'Non-repro blue'] },
  { id: 'magenta', label: ['Magenta', 'Magenta'] },
];

const DESKS: { id: DeskTheme; label: [string, string] }[] = [
  { id: 'mat', label: ['Base de corte', 'Cutting mat'] },
  { id: 'black', label: ['Base preta', 'Black mat'] },
  { id: 'wood', label: ['Madeira', 'Wood'] },
  { id: 'light', label: ['Mesa de luz', 'Light table'] },
];

/** The instrument tray: overlay toggles, ink, cutouts, desk and zoom. */
export function Toolbar({ realZoom, fitZoom }: { realZoom: number; fitZoom: number }) {
  const s = useStore();
  const t = useT();
  return (
    <div className="tray" role="toolbar" aria-label={t('Bandeja de instrumentos', 'Instrument tray')}>
      <div className="tray-group">
        {TOGGLES.map((x) => {
          const label = t(...x.label);
          return (
            <button key={x.k} className={`chip ${s.overlays[x.k] ? 'on' : ''}`} onClick={() => s.toggleOverlay(x.k)} title={x.key ? `${label} (${x.key})` : label}>
              {label}
            </button>
          );
        })}
      </div>
      <div className="tray-group">
        <select className="mini" value={s.gridInk} onChange={(e) => s.set({ gridInk: e.target.value as GridInk })} aria-label={t('Tinta do grid', 'Grid ink')}>
          {INKS.map((i) => (
            <option key={i.id} value={i.id}>
              {t(...i.label)}
            </option>
          ))}
        </select>
        <button className={`chip ${s.cutout ? 'on' : ''}`} onClick={() => s.set({ cutout: !s.cutout })} title={t('Recortes de papel (C)', 'Paper cutouts (C)')}>
          {t('Recortes', 'Cutouts')}
        </button>
        <select className="mini" value={s.deskTheme} onChange={(e) => s.set({ deskTheme: e.target.value as DeskTheme })} aria-label={t('Mesa', 'Desk')}>
          {DESKS.map((i) => (
            <option key={i.id} value={i.id}>
              {t(...i.label)}
            </option>
          ))}
        </select>
      </div>
      <div className="tray-group zoom">
        <button className="icon-btn" onClick={() => s.set({ zoom: Math.max(0.3, s.zoom / 1.2) })} title={t('Reduzir (-)', 'Zoom out (-)')}>
          <Icon name="minus" size={16} />
        </button>
        <button className="chip mono" onClick={() => s.set({ zoom: 1 })} title={t('Ajustar à tela (0)', 'Fit to screen (0)')}>
          {Math.round(realZoom * 100)}%
        </button>
        <button className="icon-btn" onClick={() => s.set({ zoom: Math.min(6, s.zoom * 1.2) })} title={t('Ampliar (+)', 'Zoom in (+)')}>
          <Icon name="plus" size={16} />
        </button>
        <button className="chip" onClick={() => s.set({ zoom: 1 / fitZoom })} title={t('Tamanho real (1:1)', 'Actual size (1:1)')}>
          1:1
        </button>
      </div>
    </div>
  );
}

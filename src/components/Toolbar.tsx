import { useStore, type DeskTheme, type GridInk, type Overlays } from '../store/useStore';
import { Icon } from './Icon';

const TOGGLES: { k: keyof Overlays; label: string; key?: string }[] = [
  { k: 'margins', label: 'Margens' },
  { k: 'columns', label: 'Colunas', key: 'G' },
  { k: 'rows', label: 'Campos', key: 'L' },
  { k: 'modules', label: 'Módulos' },
  { k: 'baseline', label: 'Linha de base', key: 'B' },
  { k: 'guides', label: 'Guias', key: 'U' },
  { k: 'eightpt', label: '8pt' },
  { k: 'tracing', label: 'Vegetal', key: 'T' },
  { k: 'dimensions', label: 'Cotas', key: 'D' },
];

const INKS: { id: GridInk; label: string }[] = [
  { id: 'pencil', label: 'Lápis' },
  { id: 'blue', label: 'Azul não-repro' },
  { id: 'magenta', label: 'Magenta' },
];

const DESKS: { id: DeskTheme; label: string }[] = [
  { id: 'mat', label: 'Base de corte' },
  { id: 'black', label: 'Base preta' },
  { id: 'wood', label: 'Madeira' },
  { id: 'light', label: 'Mesa de luz' },
];

/** The instrument tray: overlay toggles, ink, cutouts, desk and zoom. */
export function Toolbar({ realZoom, fitZoom }: { realZoom: number; fitZoom: number }) {
  const s = useStore();
  return (
    <div className="tray" role="toolbar" aria-label="Bandeja de instrumentos">
      <div className="tray-group">
        {TOGGLES.map((t) => (
          <button key={t.k} className={`chip ${s.overlays[t.k] ? 'on' : ''}`} onClick={() => s.toggleOverlay(t.k)} title={t.key ? `${t.label} (${t.key})` : t.label}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tray-group">
        <select className="mini" value={s.gridInk} onChange={(e) => s.set({ gridInk: e.target.value as GridInk })} aria-label="Tinta do grid">
          {INKS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.label}
            </option>
          ))}
        </select>
        <button className={`chip ${s.cutout ? 'on' : ''}`} onClick={() => s.set({ cutout: !s.cutout })} title="Recortes de papel (C)">
          Recortes
        </button>
        <select className="mini" value={s.deskTheme} onChange={(e) => s.set({ deskTheme: e.target.value as DeskTheme })} aria-label="Mesa">
          {DESKS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.label}
            </option>
          ))}
        </select>
      </div>
      <div className="tray-group zoom">
        <button className="icon-btn" onClick={() => s.set({ zoom: Math.max(0.3, s.zoom / 1.2) })} title="Reduzir (-)">
          <Icon name="minus" size={16} />
        </button>
        <button className="chip mono" onClick={() => s.set({ zoom: 1 })} title="Ajustar à tela (0)">
          {Math.round(realZoom * 100)}%
        </button>
        <button className="icon-btn" onClick={() => s.set({ zoom: Math.min(6, s.zoom * 1.2) })} title="Ampliar (+)">
          <Icon name="plus" size={16} />
        </button>
        <button className="chip" onClick={() => s.set({ zoom: 1 / fitZoom })} title="Tamanho real (1:1)">
          1:1
        </button>
      </div>
    </div>
  );
}

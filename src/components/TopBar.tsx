import { SCHOOLS } from '../content/schools';
import { FORMATS } from '../core/formats';
import { useDerived, useStore } from '../store/useStore';
import { useT } from '../hooks/useT';
import { Icon } from './Icon';

export function TopBar() {
  const s = useStore();
  const d = useDerived();
  const t = useT();
  return (
    <header className="topbar">
      <button className="icon-btn only-narrow" onClick={() => s.set({ sheet: s.sheet === 'left' ? null : 'left' })} aria-label={t('Grids e formato', 'Grids and format')}>
        <Icon name="grid" />
      </button>
      <div className="brand">
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
          <rect width="32" height="32" rx="5" fill="#0f5c4d" />
          <rect x="7" y="5" width="18" height="22" fill="#fafaf7" />
          <path d="M13 7v18M19 7v18M9 12h14M9 17h14M9 22h14" stroke="#9aa" strokeWidth=".6" />
          <rect x="9" y="7" width="10" height="4" fill="#111" />
          <rect x="9" y="13" width="14" height="6" fill="#c9c9c4" />
        </svg>
        <div>
          <strong>Grid Sandbox</strong>
          <span className="muted small hide-sm">{t('prancheta de grids e diagramação', 'a drawing board for grids and layout')}</span>
        </div>
      </div>
      <div className="top-controls">
        <select className="select compact" value={s.formatId} onChange={(e) => s.setFormat(e.target.value)} aria-label={t('Formato', 'Format')}>
          {FORMATS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
          <option value="custom">{t('Personalizado', 'Custom')}</option>
        </select>
        <button className="chip" onClick={s.toggleOrientation} title={t('Orientação (O)', 'Orientation (O)')}>
          {s.orientation === 'portrait' ? t('Retrato', 'Portrait') : t('Paisagem', 'Landscape')}
        </button>
        <select className="select compact hide-sm" value={s.schoolId} onChange={(e) => s.setSchool(e.target.value, true)} aria-label={t('Escola', 'School')}>
          <optgroup label={t('Escolas e movimentos', 'Schools and movements')}>
            {SCHOOLS.filter((sc) => !sc.book).map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </optgroup>
          <optgroup label={t('Livro: diagramação de texto', 'Book: text layout')}>
            {SCHOOLS.filter((sc) => sc.book).map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </optgroup>
        </select>
        <div className="segmented hide-xs" role="radiogroup" aria-label={t('Modo', 'Mode')}>
          <button className={s.mode === 'auto' ? 'on' : ''} onClick={() => s.set({ mode: 'auto' })} title={t('Automático', 'Automatic')}>
            <Icon name="wand" size={16} /> <span className="hide-sm">Auto</span>
          </button>
          <button className={s.mode === 'manual' ? 'on' : ''} onClick={() => s.set({ mode: 'manual' })} title="Manual (M)">
            <Icon name="hand" size={16} /> <span className="hide-sm">Manual</span>
          </button>
        </div>
      </div>
      <div className="top-actions">
        <div className="segmented lang-switch" role="radiogroup" aria-label={t('Idioma', 'Language')}>
          <button role="radio" aria-checked={s.uiLang === 'pt'} className={s.uiLang === 'pt' ? 'on' : ''} onClick={() => s.setUiLang('pt')} title="Português" lang="pt-BR">
            PT
          </button>
          <button role="radio" aria-checked={s.uiLang === 'en'} className={s.uiLang === 'en' ? 'on' : ''} onClick={() => s.setUiLang('en')} title="English" lang="en">
            EN
          </button>
        </div>
        <button className="icon-btn hide-xs" onClick={s.undo} disabled={!s.past.length} title={t('Desfazer (Ctrl+Z)', 'Undo (Ctrl+Z)')}>
          <Icon name="undo" />
        </button>
        <button className="icon-btn hide-xs" onClick={() => s.set({ paletteOpen: true })} title={t('Comandos (Ctrl+K)', 'Commands (Ctrl+K)')}>
          <Icon name="search" />
        </button>
        <button className="icon-btn hide-xs" onClick={() => s.set({ helpOpen: true })} title={t('Ajuda (?)', 'Help (?)')}>
          <Icon name="help" />
        </button>
        <button className="icon-btn hide-xs" onClick={() => s.set({ aboutOpen: true })} title={t('Sobre e créditos', 'About and credits')}>
          <Icon name="info" />
        </button>
        <button className="btn primary" onClick={() => s.set({ exportOpen: true })} title={t('Exportar (E)', 'Export (E)')}>
          <Icon name="export" size={16} /> <span className="hide-sm">{t('Exportar', 'Export')}</span>
        </button>
        <button className="icon-btn only-narrow" onClick={() => s.set({ sheet: s.sheet === 'right' ? null : 'right' })} aria-label={t('Teoria e escola', 'Theory and school')}>
          <Icon name="book" />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {d.preset.type.name}
      </span>
    </header>
  );
}

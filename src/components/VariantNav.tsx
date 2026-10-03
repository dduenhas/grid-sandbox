import { tx } from '../i18n';
import { getArchetype } from '../core/layoutGenerator';
import { useDerived, useStore } from '../store/useStore';
import { Icon } from './Icon';

export function VariantNav() {
  const s = useStore();
  const d = useDerived();
  const arch = getArchetype(d.archetype);
  const sel = d.blocks.find((b) => b.id === s.selectedId);
  const pinned = sel ? s.pinned.some((p) => p.id === sel.id) : false;
  const tone = d.score.total >= 75 ? 'good' : d.score.total >= 55 ? 'ok' : 'low';

  return (
    <div className="variant-nav" role="group" aria-label={tx('Variações de diagramação', 'Layout variations')}>
      <button className="nav-btn" onClick={s.prev} disabled={s.variation === 0} title={tx('Variação anterior (←)', 'Previous variation (←)')}>
        <Icon name="prev" size={22} />
      </button>
      <div className="nav-info">
        <div className="nav-title">
          <span className="mono">{tx('Nº', 'No.')} {String(s.variation + 1).padStart(3, '0')}</span>
          <span className="nav-arch">{arch.name}</span>
          {d.edited && <span className="tag">{tx('editado', 'edited')}</span>}
        </div>
        <div className="nav-sub">
          <span className={`score ${tone}`} title={tx('Pontuação teórica da variação', 'Theoretical score of the variation')}>
            {d.score.total}
          </span>
          <span className="muted">
            {d.preset.type.short} · {d.school.name.split(' /')[0].split(' (')[0]}
          </span>
        </div>
      </div>
      <button className="nav-btn" onClick={s.next} title={tx('Próxima variação (→)', 'Next variation (→)')}>
        <Icon name="next" size={22} />
      </button>
      <span className="nav-sep" />
      <button className="icon-btn" onClick={s.random} title={tx('Variação aleatória (R)', 'Random variation (R)')}>
        <Icon name="dice" />
      </button>
      <button className={`icon-btn ${s.autoplay ? 'on' : ''}`} onClick={() => s.set({ autoplay: !s.autoplay })} title={tx('Autoplay (Espaço)', 'Autoplay (Space)')}>
        <Icon name={s.autoplay ? 'pause' : 'play'} />
      </button>
      <button className={`icon-btn ${pinned ? 'on' : ''}`} disabled={!sel} onClick={() => sel && s.togglePin(sel.id)} title={tx('Fixar bloco selecionado nas próximas variações (P)', 'Pin the selected block in the next variations (P)')}>
        <Icon name="pin" />
      </button>
      <button className={`icon-btn ${s.buildStep !== null ? 'on' : ''}`} onClick={() => s.set({ buildStep: s.buildStep === null ? 0 : null, buildPlaying: s.buildStep === null })} title={tx('Construir o grid passo a passo (K)', 'Build the grid step by step (K)')}>
        <Icon name="build" />
      </button>
    </div>
  );
}

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
    <div className="variant-nav" role="group" aria-label="Variações de diagramação">
      <button className="nav-btn" onClick={s.prev} disabled={s.variation === 0} title="Variação anterior (←)">
        <Icon name="prev" size={22} />
      </button>
      <div className="nav-info">
        <div className="nav-title">
          <span className="mono">Nº {String(s.variation + 1).padStart(3, '0')}</span>
          <span className="nav-arch">{arch.name}</span>
          {d.edited && <span className="tag">editado</span>}
        </div>
        <div className="nav-sub">
          <span className={`score ${tone}`} title="Pontuação teórica da variação">
            {d.score.total}
          </span>
          <span className="muted">
            {d.preset.type.short} · {d.school.name.split(' /')[0].split(' (')[0]}
          </span>
        </div>
      </div>
      <button className="nav-btn" onClick={s.next} title="Próxima variação (→)">
        <Icon name="next" size={22} />
      </button>
      <span className="nav-sep" />
      <button className="icon-btn" onClick={s.random} title="Variação aleatória (R)">
        <Icon name="dice" />
      </button>
      <button className={`icon-btn ${s.autoplay ? 'on' : ''}`} onClick={() => s.set({ autoplay: !s.autoplay })} title="Autoplay (Espaço)">
        <Icon name={s.autoplay ? 'pause' : 'play'} />
      </button>
      <button className={`icon-btn ${pinned ? 'on' : ''}`} disabled={!sel} onClick={() => sel && s.togglePin(sel.id)} title="Fixar bloco selecionado nas próximas variações (P)">
        <Icon name="pin" />
      </button>
      <button className={`icon-btn ${s.buildStep !== null ? 'on' : ''}`} onClick={() => s.set({ buildStep: s.buildStep === null ? 0 : null, buildPlaying: s.buildStep === null })} title="Construir o grid passo a passo (K)">
        <Icon name="build" />
      </button>
    </div>
  );
}

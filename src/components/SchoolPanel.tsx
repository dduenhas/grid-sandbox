import { SCHOOLS, fontStack, getSchool } from '../content/schools';
import { gridType } from '../core/gridPresets';
import { useDerived, useStore } from '../store/useStore';
import { Section } from './ui';

export function SchoolPanel() {
  const s = useStore();
  const d = useDerived();
  const cur = getSchool(s.schoolId);
  return (
    <div className="panel-inner">
      <Section title="Escola de design">
        <div className="schools">
          {SCHOOLS.map((sc) => (
            <div key={sc.id} className={`school-card ${sc.id === cur.id ? 'on' : ''}`}>
              <button className="school-main" onClick={() => s.setSchool(sc.id)} title="Aplicar tipografia e paleta mantendo o grid">
                <span className="school-sample" style={{ fontFamily: fontStack(sc.display), fontWeight: sc.display.weight, background: sc.palette.paper, color: sc.palette.ink }}>
                  Aa
                </span>
                <span className="school-text">
                  <strong>{sc.name}</strong>
                  <span className="muted small">{sc.era}</span>
                </span>
                <span className="swatches">
                  {[sc.palette.ink, sc.palette.accent, sc.palette.accent2, sc.palette.accent3].map((c, i) => (
                    <i key={i} style={{ background: c }} />
                  ))}
                </span>
              </button>
              <button className="school-open" onClick={() => s.setSchool(sc.id, true)} title="Abrir exemplos com o grid preferido da escola">
                exemplos
              </button>
            </div>
          ))}
        </div>
      </Section>
      <Section title={cur.name}>
        <p className="lead">{cur.summary}</p>
        <p className="small muted">Mestres: {cur.masters.join(', ')}</p>
        <h4>Princípios</h4>
        <ul className="bullets">{cur.principles.map((p) => <li key={p}>{p}</li>)}</ul>
        <h4>Tipografia</h4>
        <p>{cur.typography}</p>
        <div className="type-specimen" style={{ background: cur.palette.paper, color: cur.palette.ink }}>
          <div style={{ fontFamily: fontStack(cur.display), fontWeight: cur.display.weight, letterSpacing: `${cur.headlineTracking}em`, textTransform: cur.headlineCase === 'upper' ? 'uppercase' : cur.headlineCase === 'lower' ? 'lowercase' : undefined }}>{cur.headlines[0]}</div>
          <p style={{ fontFamily: fontStack(cur.text) }}>{cur.quotes[0]}</p>
        </div>
        <h4>Grid recomendado</h4>
        <p>{cur.gridAdvice}</p>
        <div className="chips-wrap">
          {cur.preferredGrids.map((g) => (
            <button key={g} className={`chip ${d.preset.id === g ? 'on' : ''}`} onClick={() => s.setGrid(g)}>
              {gridType(g).short}
            </button>
          ))}
        </div>
        <h4>Referências para estudar</h4>
        <ul className="refs">
          {cur.references.map((r) => (
            <li key={r.title}>
              <em>{r.title}</em>, {r.author} ({r.year})
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

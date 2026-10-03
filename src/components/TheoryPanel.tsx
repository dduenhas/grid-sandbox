import { CONCEPTS, GRID_CONCEPTS } from '../content/concepts';
import { useDerived, useStore } from '../store/useStore';
import { Icon } from './Icon';
import { Section } from './ui';
import { bodyFromLeading, measureChars, measureVerdict } from '../core/typeScale';
import { docToPt, round } from '../core/units';

export function TheoryPanel() {
  const d = useDerived();
  const s = useStore();
  const c = GRID_CONCEPTS[d.preset.id];
  const body = bodyFromLeading(d.grid.baseline);
  const colChars = measureChars(d.grid.cols[0].size, body);
  const v = measureVerdict(colChars);
  return (
    <div className="panel-inner theory">
      <Section title="Por que este grid?">
        <h2 className="theory-title">{c.title}</h2>
        <p className="lead">{c.concept}</p>
        <p className="origin">
          <strong>Origem.</strong> {c.origin}
        </p>
        <button className="btn primary" onClick={() => s.set({ buildStep: 0, buildPlaying: true })}>
          <Icon name="build" size={16} /> Construir passo a passo
        </button>
      </Section>
      <Section title="Neste formato, agora">
        <ul className="facts">
          <li>
            Uma coluna comporta <strong>{colChars} caracteres</strong> com corpo {round(docToPt(body, d.page.unit), 1)} pt:{' '}
            {v === 'boa' ? 'medida confortável para texto corrido.' : v === 'curta' ? 'curta; o texto corrido deve ocupar 2 ou mais colunas.' : 'longa; divida em mais colunas ou aumente o corpo.'}
          </li>
          <li>
            Calha / entrelinha = <strong>{round(d.grid.gutterX / d.grid.baseline, 2)}</strong>
            {Math.abs(d.grid.gutterX / d.grid.baseline - 1) < 0.05 ? ' (método suíço: calha igual a 1 linha).' : '. No método suíço vale 1.'}
          </li>
          <li>
            Proporção da mancha {round(d.grid.live[0].w / d.grid.live[0].h, 3)} vs. página {round(d.page.w / d.page.h, 3)}
            {Math.abs(d.grid.live[0].w / d.grid.live[0].h - d.page.w / d.page.h) < 0.03 ? ': harmônicas, como no cânone clássico.' : '.'}
          </li>
        </ul>
      </Section>
      <Section title="Quando usar">
        <ul className="bullets">{c.whenToUse.map((t) => <li key={t}>{t}</li>)}</ul>
      </Section>
      <Section title="Estratégias">
        <ol className="bullets num">{c.strategies.map((t) => <li key={t}>{t}</li>)}</ol>
      </Section>
      <Section title="Evite">
        <ul className="bullets warn">
          {c.avoid.map((t) => (
            <li key={t}>{t}</li>
          ))}
          {c.mistakes.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>
      <Section title="Glossário">
        <dl className="glossary">
          {CONCEPTS.map((k) => (
            <div key={k.id}>
              <dt>{k.term}</dt>
              <dd>{k.def}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}

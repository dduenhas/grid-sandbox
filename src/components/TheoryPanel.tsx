import { CONCEPTS, GRID_CONCEPTS } from '../content/concepts';
import { useDerived, useStore } from '../store/useStore';
import { Icon } from './Icon';
import { Section } from './ui';
import { measureChars, measureVerdict } from '../core/typeScale';
import { bodySizeFor } from '../core/bookScore';
import { docToPt, round } from '../core/units';
import { BOOK_CONCEPTS, BOOK_PRINCIPLES, isBookArchetype, pageType } from '../content/book';

function BookTheory() {
  const d = useDerived();
  const g = d.grid;
  const u = d.page.unit;
  const pt = (v: number) => round(docToPt(v, u), 1);
  const mm = (v: number) => round(v, 1);
  const body = bodySizeFor(g.baseline, d.school);
  const pType = pageType(d.archetype);
  const main = Math.max(...g.cols.slice(0, g.spineCol || g.cols.length).map((c) => c.size));
  const chars = measureChars(main, body, 0.47);
  const m = g.margins;
  const inner = m.inner - d.bindingMm;
  const live = g.live[0];
  const share = Math.round(((live.w * live.h) / (d.page.w * d.page.h)) * 100);
  const sfx = u === 'mm' ? ' mm' : ' px';
  return (
    <>
      {pType && (
        <Section title="Esta página do livro">
          <h2 className="theory-title">{pType.name}</h2>
          <p className="lead">{pType.description}</p>
          <ul className="bullets">{pType.rules.map((r) => <li key={r}>{r}</li>)}</ul>
        </Section>
      )}
      <Section title="Os números do miolo">
        <ul className="facts">
          <li>
            Corpo <strong>{pt(body)} pt</strong> sobre entrelinha <strong>{pt(g.baseline)} pt</strong> ({Math.round((g.baseline / body) * 100)}%).
          </li>
          <li>
            Linha de <strong>{chars} caracteres</strong>
            {chars >= 55 && chars <= 75 ? ': na faixa ideal do livro.' : chars < 45 ? ': curta para texto corrido.' : chars > 80 ? ': longa; aumente o corpo ou as margens.' : ': aceitável.'}
          </li>
          <li>
            Margens visíveis: interna {mm(inner)}, superior {mm(m.top)}, externa {mm(m.outer)}, inferior {mm(m.bottom)}
            {sfx}
            {d.bindingMm ? ` (+${d.bindingMm} mm de encadernação somados à interna)` : ''}.{' '}
            {inner < m.top && m.top < m.outer && m.outer < m.bottom ? 'Progressão clássica.' : 'Fora da progressão clássica.'}
          </li>
          <li>
            A mancha ocupa <strong>{share}%</strong> da página.
          </li>
        </ul>
      </Section>
      <Section title="Princípios do livro">
        <ol className="bullets num principles">
          {BOOK_PRINCIPLES.map((p) => (
            <li key={p.title}>
              <strong>{p.title}.</strong> {p.text}
              <span className="src">{p.source}</span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}

export function TheoryPanel() {
  const d = useDerived();
  const s = useStore();
  const c = GRID_CONCEPTS[d.preset.id];
  const body = bodySizeFor(d.grid.baseline, d.school);
  const book = !!d.school.book || isBookArchetype(d.archetype);
  const colChars = measureChars(d.grid.cols[0].size, body, book ? 0.47 : 0.5);
  const v = measureVerdict(colChars);
  return (
    <div className="panel-inner theory">
      {book && <BookTheory />}
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
          {(book ? [...BOOK_CONCEPTS, ...CONCEPTS] : CONCEPTS).map((k) => (
            <div key={k.term}>
              <dt>{k.term}</dt>
              <dd>{k.def}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}

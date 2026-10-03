import { CONCEPTS, GRID_CONCEPTS } from '../content/concepts';
import { useDerived, useStore } from '../store/useStore';
import { Icon } from './Icon';
import { Section } from './ui';
import { measureChars, measureVerdict } from '../core/typeScale';
import { bodySizeFor } from '../core/bookScore';
import { docToPt, round } from '../core/units';
import { BOOK_CONCEPTS, BOOK_PRINCIPLES, isBookArchetype, pageType } from '../content/book';
import { tx } from '../i18n';

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
        <Section title={tx('Esta página do livro', 'This page of the book')}>
          <h2 className="theory-title">{pType.name}</h2>
          <p className="lead">{pType.description}</p>
          <ul className="bullets">{pType.rules.map((r) => <li key={r}>{r}</li>)}</ul>
        </Section>
      )}
      <Section title={tx('Os números do miolo', 'The numbers of the text pages')}>
        <ul className="facts">
          <li>
            {tx('Corpo', 'Body')} <strong>{pt(body)} pt</strong> {tx('sobre entrelinha', 'on a leading of')} <strong>{pt(g.baseline)} pt</strong> ({Math.round((g.baseline / body) * 100)}%).
          </li>
          <li>
            {tx('Linha de', 'Lines of')} <strong>{chars} {tx('caracteres', 'characters')}</strong>
            {chars >= 55 && chars <= 75
              ? tx(': na faixa ideal do livro.', ': within the ideal range for books.')
              : chars < 45
                ? tx(': curta para texto corrido.', ': short for running text.')
                : chars > 80
                  ? tx(': longa; aumente o corpo ou as margens.', ': long; increase the type size or the margins.')
                  : tx(': aceitável.', ': acceptable.')}
          </li>
          <li>
            {tx('Margens visíveis: interna', 'Visible margins: inside')} {mm(inner)}, {tx('superior', 'top')} {mm(m.top)}, {tx('externa', 'outside')} {mm(m.outer)}, {tx('inferior', 'bottom')} {mm(m.bottom)}
            {sfx}
            {d.bindingMm ? tx(` (+${d.bindingMm} mm de encadernação somados à interna)`, ` (+${d.bindingMm} mm of binding added to the inside)`) : ''}.{' '}
            {inner < m.top && m.top < m.outer && m.outer < m.bottom ? tx('Progressão clássica.', 'Classical progression.') : tx('Fora da progressão clássica.', 'Outside the classical progression.')}
          </li>
          <li>
            {tx('A mancha ocupa', 'The text block covers')} <strong>{share}%</strong> {tx('da página.', 'of the page.')}
          </li>
        </ul>
      </Section>
      <Section title={tx('Princípios do livro', 'Principles of the book')}>
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
      <Section title={tx('Por que este grid?', 'Why this grid?')}>
        <h2 className="theory-title">{c.title}</h2>
        <p className="lead">{c.concept}</p>
        <p className="origin">
          <strong>{tx('Origem.', 'Origin.')}</strong> {c.origin}
        </p>
        <button className="btn primary" onClick={() => s.set({ buildStep: 0, buildPlaying: true })}>
          <Icon name="build" size={16} /> {tx('Construir passo a passo', 'Build it step by step')}
        </button>
      </Section>
      <Section title={tx('Neste formato, agora', 'In this format, right now')}>
        <ul className="facts">
          <li>
            {tx('Uma coluna comporta', 'One column holds')} <strong>{colChars} {tx('caracteres', 'characters')}</strong> {tx('com corpo', 'at')} {round(docToPt(body, d.page.unit), 1)} pt:{' '}
            {v === 'boa'
              ? tx('medida confortável para texto corrido.', 'a comfortable measure for running text.')
              : v === 'curta'
                ? tx('curta; o texto corrido deve ocupar 2 ou mais colunas.', 'short; running text should span 2 or more columns.')
                : tx('longa; divida em mais colunas ou aumente o corpo.', 'long; split into more columns or increase the type size.')}
          </li>
          <li>
            {tx('Calha / entrelinha', 'Gutter / leading')} = <strong>{round(d.grid.gutterX / d.grid.baseline, 2)}</strong>
            {Math.abs(d.grid.gutterX / d.grid.baseline - 1) < 0.05 ? tx(' (método suíço: calha igual a 1 linha).', ' (Swiss method: gutter equal to 1 line).') : tx('. No método suíço vale 1.', '. In the Swiss method it is 1.')}
          </li>
          <li>
            {tx('Proporção da mancha', 'Text block ratio')} {round(d.grid.live[0].w / d.grid.live[0].h, 3)} {tx('vs. página', 'vs. page')} {round(d.page.w / d.page.h, 3)}
            {Math.abs(d.grid.live[0].w / d.grid.live[0].h - d.page.w / d.page.h) < 0.03 ? tx(': harmônicas, como no cânone clássico.', ': in harmony, as in the classical canon.') : '.'}
          </li>
        </ul>
      </Section>
      <Section title={tx('Quando usar', 'When to use it')}>
        <ul className="bullets">{c.whenToUse.map((t) => <li key={t}>{t}</li>)}</ul>
      </Section>
      <Section title={tx('Estratégias', 'Strategies')}>
        <ol className="bullets num">{c.strategies.map((t) => <li key={t}>{t}</li>)}</ol>
      </Section>
      <Section title={tx('Evite', 'Avoid')}>
        <ul className="bullets warn">
          {c.avoid.map((t) => (
            <li key={t}>{t}</li>
          ))}
          {c.mistakes.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>
      <Section title={tx('Glossário', 'Glossary')}>
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

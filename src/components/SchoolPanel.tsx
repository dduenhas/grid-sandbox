import { tx } from '../i18n';
import type { CSSProperties } from 'react';
import { SCHOOLS, fontStack, getSchool, type School } from '../content/schools';
import { chapterNumber, type CaseStyle, type HeadStyle } from '../content/book';
import { bookOf, familiesOf, roleFont } from '../content/bookOf';
import { gridType } from '../core/gridPresets';
import { useDerived, useStore } from '../store/useStore';
import { Section } from './ui';

function SchoolCards({ list }: { list: School[] }) {
  const s = useStore();
  return (
    <div className="schools">
      {list.map((sc) => (
        <div key={sc.id} className={`school-card ${sc.id === s.schoolId ? 'on' : ''}`}>
          <button className="school-main" onClick={() => s.setSchool(sc.id)} title={tx('Aplicar tipografia e paleta mantendo o grid', 'Apply type and palette, keeping the grid')}>
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
          <button className="school-open" onClick={() => s.setSchool(sc.id, true)} title={sc.book ? tx('Abrir em Livro 16×23, página dupla, com acréscimo de encadernação', 'Open as a 16×23 book, double page, with binding allowance') : tx('Abrir exemplos com o grid preferido da escola', 'Open examples with the school’s preferred grid')}>
            {tx('exemplos', 'examples')}
          </button>
        </div>
      ))}
    </div>
  );
}

export function SchoolPanel() {
  const s = useStore();
  const d = useDerived();
  const cur = getSchool(s.schoolId);
  return (
    <div className="panel-inner">
      <Section title={tx('Escolas e movimentos', 'Schools and movements')}>
        <SchoolCards list={SCHOOLS.filter((sc) => !sc.book)} />
      </Section>
      <Section title={tx('Livro: diagramação de texto', 'Book: text layout')}>
        <p className="hint" style={{ marginTop: 0 }}>
          {tx('Receitas completas para texto corrido: fontes, margens, entrelinha, capitulação e hierarquia. “Exemplos” abre o livro em página dupla.', 'Complete recipes for running text: fonts, margins, leading, chapter openings and hierarchy. “Examples” opens the book as a double page.')}
        </p>
        <SchoolCards list={SCHOOLS.filter((sc) => sc.book)} />
      </Section>
      <Section title={cur.name}>
        <p className="lead">{cur.summary}</p>
        <p className="small muted">{tx('Mestres', 'Masters')}: {cur.masters.join(', ')}</p>
        <h4>{tx('Princípios', 'Principles')}</h4>
        <ul className="bullets">{cur.principles.map((p) => <li key={p}>{p}</li>)}</ul>
        <h4>{tx('Tipografia', 'Typography')}</h4>
        <p>{cur.typography}</p>
        {cur.book ? (
          <BookSpecimen school={cur} />
        ) : (
          <div className="type-specimen" style={{ background: cur.palette.paper, color: cur.palette.ink }}>
            <div style={{ fontFamily: fontStack(cur.display), fontWeight: cur.display.weight, letterSpacing: `${cur.headlineTracking}em`, textTransform: cur.headlineCase === 'upper' ? 'uppercase' : cur.headlineCase === 'lower' ? 'lowercase' : undefined }}>{cur.headlines[0]}</div>
            <p style={{ fontFamily: fontStack(cur.text) }}>{cur.quotes[0]}</p>
          </div>
        )}
        <h4>{tx('Grid recomendado', 'Recommended grid')}</h4>
        <p>{cur.gridAdvice}</p>
        <div className="chips-wrap">
          {cur.preferredGrids.map((g) => (
            <button key={g} className={`chip ${d.preset.id === g ? 'on' : ''}`} onClick={() => s.setGrid(g)}>
              {gridType(g).short}
            </button>
          ))}
        </div>
      </Section>
      {cur.book && <BookRecipe school={cur} />}
      <Section title={tx('Referências para estudar', 'References to study')}>
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

const caseCss = (c: CaseStyle): CSSProperties => (c === 'upper' ? { textTransform: 'uppercase' } : c === 'smallcaps' ? { fontVariantCaps: 'all-small-caps' } : {});

function headCss(sc: School, h: HeadStyle): CSSProperties {
  const f = roleFont(sc, h.role);
  return {
    fontFamily: fontStack(f),
    fontWeight: h.weight ?? f.weight,
    fontStyle: h.italic ? 'italic' : undefined,
    fontSize: `${h.scale}em`,
    letterSpacing: h.tracking ? `${h.tracking}em` : undefined,
    textAlign: h.align,
    color: h.accent ? sc.palette.accent : undefined,
    ...caseCss(h.case),
  };
}

/** The whole hierarchy of the book style, from chapter number to running text, at reading size. */
function BookSpecimen({ school: sc }: { school: School }) {
  const st = bookOf(sc);
  const ch = st.chapter;
  const text = roleFont(sc, 'text');
  const nf = roleFont(sc, ch.numberRole);
  const tf = roleFont(sc, ch.titleRole);
  const num = chapterNumber(4, ch.number);
  const [a, b, c] = st.heads;
  const lh = st.leadRatio;
  const gap = (n: number) => `${n * lh}em`;
  const dc = st.dropCap;
  const lead = dc ? tx(' página dupla', ' double page') : tx('A página dupla', 'The double page');
  return (
    <div className="book-specimen" style={{ background: sc.palette.paper, color: sc.palette.ink, fontFamily: fontStack(text), lineHeight: lh, textAlign: st.justify ? 'justify' : 'left' }}>
      <div style={{ textAlign: ch.align }}>
        <div style={{ fontFamily: fontStack(nf), fontWeight: nf.weight, fontStyle: ch.numberItalic ? 'italic' : undefined, fontSize: `${Math.min(ch.numberScale, 3.2)}em`, lineHeight: 1.1, letterSpacing: ch.numberTracking ? `${ch.numberTracking}em` : undefined, color: ch.numberAccent ? sc.palette.accent : undefined, ...caseCss(ch.numberCase) }}>
          {ch.label ? `${ch.label} ${num}` : num}
        </div>
        <div style={{ fontFamily: fontStack(tf), fontWeight: ch.titleWeight ?? tf.weight, fontStyle: ch.titleItalic ? 'italic' : undefined, fontSize: `${Math.min(ch.titleScale, 2)}em`, lineHeight: 1.15, letterSpacing: ch.titleTracking ? `${ch.titleTracking}em` : undefined, marginTop: gap(ch.gap * 0.5), ...caseCss(ch.titleCase) }}>
          {tx('A forma do livro', 'The Form of the Book')}
        </div>
        {ch.ornament && <div style={{ color: sc.palette.accent, marginTop: gap(0.5) }}>{ch.ornament}</div>}
      </div>
      <p style={{ marginTop: gap(1) }}>
        {dc && (
          <span className="dropcap" style={{ fontFamily: fontStack(roleFont(sc, dc.role)), color: dc.accent ? sc.palette.accent : undefined, fontSize: `${dc.lines * lh * 0.98}em` }}>
            A
          </span>
        )}
        {st.leadIn === 'smallcaps' ? <span style={{ fontVariantCaps: 'all-small-caps', letterSpacing: '0.05em' }}>{lead}</span> : lead}
        {tx(' é a unidade do livro: as margens e a mancha se julgam no par, nunca numa página isolada.', ' is the unit of the book: margins and text block are judged as a pair, never on a single page.')}
      </p>
      <div style={{ ...headCss(sc, a), marginTop: gap(a.before), marginBottom: gap(a.after) }}>{a.numbered ? '4.1 ' : ''}{tx('Margens e mancha', 'Margins and text block')}</div>
      <p>{tx('O texto que segue um título não tem recuo, porque o próprio título já marca o começo.', 'Text that follows a heading is not indented, because the heading already marks the start.')}</p>
      <p style={{ textIndent: st.paragraph === 'indent' ? '1em' : undefined, marginTop: st.paragraph === 'space' ? gap(1) : undefined }}>
        {st.paragraph === 'pilcrow' && <span style={{ color: sc.palette.accent }}>¶ </span>}{tx('O parágrafo seguinte marca a entrada', 'The next paragraph marks its start')} {st.paragraph === 'indent' ? tx('com recuo de 1 eme', 'with a 1 em indent') : st.paragraph === 'space' ? tx('com uma linha em branco', 'with a blank line') : tx('com o caldeirão', 'with the pilcrow')}.
      </p>
      <div style={{ ...headCss(sc, b), marginTop: gap(b.before), marginBottom: gap(b.after) }}>{b.numbered ? '4.1.1 ' : ''}{tx('A medianiz', 'The gutter')}</div>
      <p style={{ marginTop: gap(c.before) }}>
        <span style={headCss(sc, c)}>{tx('Título corrido.', 'Run-in head.')}</span> {tx('O terceiro nível entra na própria linha, sem gastar espaço vertical.', 'The third level runs into the line itself, using no vertical space.')}
      </p>
      <p className="book-specimen-note">
        {familiesOf(sc).length} {familiesOf(sc).length === 1 ? tx('família', 'family') : tx('famílias', 'families')}: {familiesOf(sc).join(' + ')} · {tx('entrelinha', 'leading')} {Math.round(lh * 100)}% · {st.justify ? tx('justificado', 'justified') : tx('alinhado à esquerda', 'flush left')}
      </p>
    </div>
  );
}

function BookRecipe({ school: sc }: { school: School }) {
  const st = bookOf(sc);
  const rows: [string, string][] = [
    [tx('Fontes', 'Fonts'), st.recipe.fonts],
    [tx('Margens', 'Margins'), st.recipe.margins],
    [tx('Corpo e entrelinha', 'Size and leading'), st.recipe.leading],
    [tx('Parágrafo', 'Paragraph'), st.recipe.paragraph],
    [tx('Abertura de capítulo', 'Chapter opening'), st.recipe.opening],
    [tx('Hierarquia', 'Hierarchy'), st.recipe.hierarchy],
  ];
  return (
    <>
      <Section title={tx('Receita do livro', 'Book recipe')}>
        <dl className="recipe">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Section>
      {st.masterpieces.length > 0 && (
        <Section title={tx('Obras-primas da hierarquia', 'Masterpieces of hierarchy')}>
          <ul className="masterpieces">
            {st.masterpieces.map((m) => (
              <li key={m.title}>
                <strong>
                  <em>{m.title}</em>
                </strong>
                <span className="muted small">
                  {' '}
                  · {m.who}, {m.year}
                </span>
                <p>{m.lesson}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

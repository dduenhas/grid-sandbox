import { useDerived } from '../store/useStore';
import { Section } from './ui';
import { CLASSIC_SCALE_PT, getRatio, measureChars, modularScale } from '../core/typeScale';
import { bodySizeFor } from '../core/bookScore';
import { docToPt, fmt, round } from '../core/units';
import { spanRect } from '../core/gridEngine';
import { tx } from '../i18n';

export function NumbersPanel() {
  const d = useDerived();
  const g = d.grid;
  const u = d.page.unit;
  const body = bodySizeFor(g.baseline, d.school);
  const ratio = getRatio(d.school.scale);
  const scale = modularScale(body, ratio.ratio, 1, 7);
  const lines = g.rows.map((r) => round(r.size / g.baseline, 2));
  const bodies = d.blocks.filter((b) => b.kind === 'body');
  const pt = (v: number) => `${round(docToPt(v, u), 1)} pt`;
  const rows: [string, string][] = [
    [tx('Página', 'Page'), `${fmt(d.page.w, u)} × ${fmt(d.page.h, u)}`],
    [tx('Mancha', 'Text block'), `${fmt(g.live[0].w, u)} × ${fmt(g.live[0].h, u)}`],
    [tx('Ocupação da página', 'Page coverage'), `${round(((g.live[0].w * g.live[0].h) / (d.page.w * d.page.h)) * 100, 0)}%`],
    [tx('Margens (S / I / Int / Ext)', 'Margins (T / B / In / Out)'), `${round(g.margins.top)} / ${round(g.margins.bottom)} / ${round(g.margins.inner)} / ${round(g.margins.outer)} ${u}`],
    [tx('Colunas', 'Columns'), `${d.spec.cols} × ${g.cols.map((c) => round(c.size)).filter((v, i, a) => a.indexOf(v) === i).join(' / ')} ${u}`],
    [tx('Calhas', 'Gutters'), `${fmt(g.gutterX, u)} (h) · ${fmt(g.gutterY, u)} (v)`],
    [tx('Campos', 'Fields'), `${g.cols.length} × ${g.rows.length} = ${g.cols.length * g.rows.length}`],
    [tx('Linhas por campo', 'Lines per field'), lines.filter((v, i, a) => a.indexOf(v) === i).join(' / ')],
    [tx('Entrelinha', 'Leading'), `${pt(g.baseline)} (${fmt(g.baseline, u, 2)})`],
    [tx('Corpo do texto', 'Body size'), `${pt(body)} (${tx('entrelinha', 'leading')} ${round((g.baseline / body) * 100, 0)}%)`],
    [tx('Medida por coluna', 'Measure per column'), `${measureChars(g.cols[0].size, body)} ${tx('caracteres', 'characters')}`],
  ];
  return (
    <div className="panel-inner">
      <Section title={tx('Números do grid', 'Grid numbers')}>
        <table className="nums">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}>
                <th>{k}</th>
                <td className="mono">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      {bodies.length > 0 && (
        <Section title={tx('Medida dos blocos de texto', 'Measure of the text blocks')}>
          <table className="nums">
            <tbody>
              {bodies.map((b) => {
                const m = measureChars(spanRect(g, b.c, b.r, b.cs, b.rs).w, body);
                return (
                  <tr key={b.id}>
                    <th>
                      {b.id} · {b.cs} col
                    </th>
                    <td className={`mono ${m < 40 || m > 80 ? 'warn' : 'ok'}`}>
                      {m} {tx('car.', 'ch.')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Section>
      )}
      <Section title={`${tx('Escala tipográfica', 'Type scale')} · ${ratio.name} (${round(ratio.ratio, 3)})`}>
        <p className="small muted">
          {ratio.note}.{' '}
          {tx(
            'Os títulos usam o maior degrau que cabe no bloco, numa escala de dupla cadeia (Bringhurst: uma segunda série começa em corpo × √razão).',
            'Headings use the largest step that fits the block, on a double-stranded scale (Bringhurst: a second series starts at body × √ratio).',
          )}
        </p>
        <div className="scale">
          {scale.map((v, i) => (
            <div key={i} className="scale-step">
              <span className="mono small">{round(docToPt(v, u), 1)} pt</span>
              <span className="scale-sample" style={{ fontSize: Math.min(54, docToPt(v, u) * (u === 'mm' ? 1.333 : 1)), fontFamily: `'${d.school.display.family}'`, fontWeight: i > 1 ? d.school.display.weight : d.school.text.weight }}>
                Grid
              </span>
            </div>
          ))}
        </div>
        <p className="small muted">
          {tx('Escala clássica dos tipógrafos', 'The printers’ classic scale')}: {CLASSIC_SCALE_PT.join(' · ')} pt.
        </p>
      </Section>
    </div>
  );
}

import { useDerived } from '../store/useStore';
import { Section } from './ui';
import { CLASSIC_SCALE_PT, bodyFromLeading, getRatio, measureChars, modularScale } from '../core/typeScale';
import { docToPt, fmt, round } from '../core/units';
import { spanRect } from '../core/gridEngine';

export function NumbersPanel() {
  const d = useDerived();
  const g = d.grid;
  const u = d.page.unit;
  const body = bodyFromLeading(g.baseline);
  const ratio = getRatio(d.school.scale);
  const scale = modularScale(body, ratio.ratio, 1, 7);
  const lines = g.rows.map((r) => round(r.size / g.baseline, 2));
  const bodies = d.blocks.filter((b) => b.kind === 'body');
  const pt = (v: number) => `${round(docToPt(v, u), 1)} pt`;
  const rows: [string, string][] = [
    ['Página', `${fmt(d.page.w, u)} × ${fmt(d.page.h, u)}`],
    ['Mancha', `${fmt(g.live[0].w, u)} × ${fmt(g.live[0].h, u)}`],
    ['Ocupação da página', `${round(((g.live[0].w * g.live[0].h) / (d.page.w * d.page.h)) * 100, 0)}%`],
    ['Margens (S / I / Int / Ext)', `${round(g.margins.top)} / ${round(g.margins.bottom)} / ${round(g.margins.inner)} / ${round(g.margins.outer)} ${u}`],
    ['Colunas', `${d.spec.cols} × ${g.cols.map((c) => round(c.size)).filter((v, i, a) => a.indexOf(v) === i).join(' / ')} ${u}`],
    ['Calhas', `${fmt(g.gutterX, u)} (h) · ${fmt(g.gutterY, u)} (v)`],
    ['Campos', `${g.cols.length} × ${g.rows.length} = ${g.cols.length * g.rows.length}`],
    ['Linhas por campo', lines.filter((v, i, a) => a.indexOf(v) === i).join(' / ')],
    ['Entrelinha', `${pt(g.baseline)} (${fmt(g.baseline, u, 2)})`],
    ['Corpo do texto', `${pt(body)} (entrelinha ${round((g.baseline / body) * 100, 0)}%)`],
    ['Medida por coluna', `${measureChars(g.cols[0].size, body)} caracteres`],
  ];
  return (
    <div className="panel-inner">
      <Section title="Números do grid">
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
        <Section title="Medida dos blocos de texto">
          <table className="nums">
            <tbody>
              {bodies.map((b) => {
                const m = measureChars(spanRect(g, b.c, b.r, b.cs, b.rs).w, body);
                return (
                  <tr key={b.id}>
                    <th>
                      {b.id} · {b.cs} col
                    </th>
                    <td className={`mono ${m < 40 || m > 80 ? 'warn' : 'ok'}`}>{m} car.</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Section>
      )}
      <Section title={`Escala tipográfica · ${ratio.name} (${round(ratio.ratio, 3)})`}>
        <p className="small muted">{ratio.note}. Os títulos usam o maior degrau que cabe no bloco, numa escala de dupla cadeia (Bringhurst: uma segunda série começa em corpo × √razão).</p>
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
        <p className="small muted">Escala clássica dos tipógrafos: {CLASSIC_SCALE_PT.join(' · ')} pt.</p>
      </Section>
    </div>
  );
}

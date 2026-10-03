import { useStore } from '../store/useStore';
import { Modal } from './ui';

const KEYS: [string, string][] = [
  ['← →', 'Variação anterior / próxima (com bloco selecionado no modo manual: move o bloco)'],
  ['Shift + ← → ↑ ↓', 'Redimensiona o bloco selecionado (modo manual)'],
  ['Espaço', 'Autoplay'],
  ['R', 'Variação aleatória'],
  ['1 a 9', 'Escolhe o grid da lista'],
  ['[  ]', 'Grid anterior / próximo'],
  ['S / Shift+S', 'Próxima / anterior escola'],
  ['O', 'Alterna retrato e paisagem'],
  ['F', 'Página dupla'],
  ['M', 'Modo manual / automático'],
  ['G · B · L · U · T · D', 'Colunas · linha de base · campos · guias · vegetal · cotas'],
  ['C', 'Recortes de papel'],
  ['K', 'Construir o grid passo a passo'],
  ['P', 'Fixar o bloco selecionado'],
  ['Del', 'Excluir o bloco selecionado'],
  ['Ctrl + Z / Ctrl + Shift + Z', 'Desfazer / refazer'],
  ['Ctrl + K', 'Paleta de comandos'],
  ['E', 'Exportar'],
  ['+ − 0', 'Zoom e ajustar à tela (Ctrl + roda também)'],
  ['?', 'Esta ajuda'],
];

export function HelpModal() {
  const s = useStore();
  return (
    <Modal title="Como usar a prancheta" onClose={() => s.set({ helpOpen: false })} wide>
      <div className="help-cols">
        <div>
          <h4>O fluxo em 30 segundos</h4>
          <ol className="bullets num">
            <li>Escolha o formato e a orientação.</li>
            <li>Escolha uma escola de design: ela define fontes, paleta, grids e combinações típicas.</li>
            <li>Escolha um dos grids, ordenados pela adequação ao formato.</li>
            <li>Percorra as combinações com ◀ ▶ (ou deslize no celular), como quem reposiciona recortes de papel sobre a folha.</li>
            <li>Fixe o que funcionou (P), passe para o modo manual (M) e ajuste arrastando.</li>
            <li>Exporte em SVG, PNG, CSS ou a ficha técnica e termine no Illustrator, Figma ou Photoshop.</li>
          </ol>
          <h4>Para aprender</h4>
          <p>
            O painel <strong>Teoria</strong> explica o grid escolhido e mostra os números ao vivo. O botão <strong>Construir</strong> monta o grid camada por camada. O painel{' '}
            <strong>Diagramação</strong> avalia a variação (espaço branco, alinhamento, hierarquia, equilíbrio e medida) e diz o que melhorar.
          </p>
        </div>
        <div>
          <h4>Atalhos</h4>
          <table className="nums keys">
            <tbody>
              {KEYS.map(([k, v]) => (
                <tr key={k}>
                  <th>
                    <kbd>{k}</kbd>
                  </th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="help-foot">
        <button className="link" onClick={() => s.set({ helpOpen: false, aboutOpen: true })}>
          Sobre o projeto e créditos
        </button>
      </p>
    </Modal>
  );
}

export const REPO_URL = 'https://github.com/dduenhas/grid-sandbox';
const AUTHOR_URL = 'https://diegoduenhas.com.br';
const EMAIL = 'dduenhas@gmail.com';
const YEAR = 2026;

export function AboutModal() {
  const s = useStore();
  return (
    <Modal title="Sobre o Grid Sandbox" onClose={() => s.set({ aboutOpen: false })} wide>
      <div className="help-cols about">
        <div>
          <h4>Filosofia</h4>
          <p>
            O grid nasce na prancheta: folha, régua, lápis e recortes de papel reposicionados à mão até a página encontrar sua ordem. O Grid Sandbox leva esse gesto
            para a tela. Em vez de começar num software de produção com um documento vazio, o designer experimenta dezenas de estruturas e diagramações em segundos e
            só depois segue para o Illustrator, o Figma ou o Photoshop com uma decisão tomada.
          </p>
          <h4>Decisões de projeto</h4>
          <ul className="bullets">
            <li>
              <strong>Rapidez acima de tudo.</strong> Cada combinação é gerada na hora, de forma determinística, e percorrida com ◀ ▶ ou pelo teclado.
            </li>
            <li>
              <strong>Teoria embutida.</strong> Grids, margens e escalas seguem Müller-Brockmann, Tschichold, Van de Graaf, Gerstner e Bringhurst, e cada escolha vem
              explicada.
            </li>
            <li>
              <strong>Escolas como ponto de partida.</strong> Cada escola de design carrega suas fontes, paleta, grids e arquétipos de página.
            </li>
            <li>
              <strong>Automático e manual.</strong> A máquina propõe, o designer fixa o que funciona e ajusta à mão, sempre encaixado no grid.
            </li>
            <li>
              <strong>Saída utilizável.</strong> SVG em camadas, PNG, CSS Grid e uma ficha técnica para refazer o grid na ferramenta de produção.
            </li>
          </ul>
          <h4>Motivação</h4>
          <p>
            Servir ao mesmo tempo como ferramenta de estudo, para quem está aprendendo diagramação, e como etapa de esboço rápido no dia a dia de quem já trabalha
            com design gráfico e de interfaces.
          </p>
        </div>
        <div>
          <h4>Autor</h4>
          <p>
            Desenvolvido por{' '}
            <a href={AUTHOR_URL} target="_blank" rel="noreferrer">
              <strong>Diego Duenhas</strong>
            </a>
            , designer gráfico e desenvolvedor web com mais de duas décadas de experiência em identidades visuais, projetos editoriais e interfaces digitais, da
            concepção gráfica à implementação front-end.
          </p>
          <ul className="bullets">
            <li>Tecnologia em Design Gráfico · SENAC São Paulo (2026)</li>
            <li>Tecnologia em Sistemas para Internet · IFSP São João da Boa Vista (2017)</li>
          </ul>
          <table className="nums about-links">
            <tbody>
              <tr>
                <th>Site</th>
                <td>
                  <a href={AUTHOR_URL} target="_blank" rel="noreferrer">
                    diegoduenhas.com.br
                  </a>
                </td>
              </tr>
              <tr>
                <th>E-mail</th>
                <td>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </td>
              </tr>
              <tr>
                <th>Código</th>
                <td>
                  <a href={REPO_URL} target="_blank" rel="noreferrer">
                    github.com/dduenhas/grid-sandbox
                  </a>
                </td>
              </tr>
              <tr>
                <th>Licença</th>
                <td>
                  <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
                    MIT
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="muted small">
            © {YEAR} Diego Duenhas. Software livre sob a licença MIT: use, modifique e distribua, mantendo o aviso de copyright.
          </p>
        </div>
      </div>
    </Modal>
  );
}

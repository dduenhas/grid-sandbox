import { useStore } from '../store/useStore';
import { useT } from '../hooks/useT';
import { Modal } from './ui';

const KEYS: [string, string, string][] = [
  ['← →', 'Variação anterior / próxima (com bloco selecionado no modo manual: move o bloco)', 'Previous / next variation (with a block selected in manual mode: moves the block)'],
  ['Shift + ← → ↑ ↓', 'Redimensiona o bloco selecionado (modo manual)', 'Resizes the selected block (manual mode)'],
  ['Espaço|Space', 'Autoplay', 'Autoplay'],
  ['R', 'Variação aleatória', 'Random variation'],
  ['1 a 9|1 to 9', 'Escolhe o grid da lista', 'Picks a grid from the list'],
  ['[  ]', 'Grid anterior / próximo', 'Previous / next grid'],
  ['S / Shift+S', 'Próxima / anterior escola', 'Next / previous school'],
  ['O', 'Alterna retrato e paisagem', 'Toggles portrait and landscape'],
  ['F', 'Página dupla', 'Double page'],
  ['M', 'Modo manual / automático', 'Manual / automatic mode'],
  ['G · B · L · U · T · D', 'Colunas · linha de base · campos · guias · vegetal · cotas', 'Columns · baseline · fields · guides · tracing · dimensions'],
  ['C', 'Recortes de papel', 'Paper cutouts'],
  ['K', 'Construir o grid passo a passo', 'Build the grid step by step'],
  ['P', 'Fixar o bloco selecionado', 'Pin the selected block'],
  ['Del', 'Excluir o bloco selecionado', 'Delete the selected block'],
  ['Ctrl + Z / Ctrl + Shift + Z', 'Desfazer / refazer', 'Undo / redo'],
  ['Ctrl + K', 'Paleta de comandos', 'Command palette'],
  ['E', 'Exportar', 'Export'],
  ['+ − 0', 'Zoom e ajustar à tela (Ctrl + roda também)', 'Zoom and fit to screen (Ctrl + wheel too)'],
  ['?', 'Esta ajuda', 'This help'],
];

export function HelpModal() {
  const s = useStore();
  const t = useT();
  return (
    <Modal title={t('Como usar a prancheta', 'How to use the drawing board')} onClose={() => s.set({ helpOpen: false })} wide>
      <div className="help-cols">
        <div>
          <h4>{t('O fluxo em 30 segundos', 'The workflow in 30 seconds')}</h4>
          <ol className="bullets num">
            <li>{t('Escolha o formato e a orientação.', 'Choose the format and the orientation.')}</li>
            <li>{t('Escolha uma escola de design: ela define fontes, paleta, grids e combinações típicas.', 'Choose a design school: it sets the fonts, palette, grids and typical combinations.')}</li>
            <li>{t('Escolha um dos grids, ordenados pela adequação ao formato.', 'Choose one of the grids, sorted by how well they fit the format.')}</li>
            <li>{t('Percorra as combinações com ◀ ▶ (ou deslize no celular), como quem reposiciona recortes de papel sobre a folha.', 'Browse the combinations with ◀ ▶ (or swipe on a phone), like moving paper cutouts around on the sheet.')}</li>
            <li>{t('Fixe o que funcionou (P), passe para o modo manual (M) e ajuste arrastando.', 'Pin what works (P), switch to manual mode (M) and adjust by dragging.')}</li>
            <li>{t('Exporte em SVG, PNG, CSS ou a ficha técnica e termine no Illustrator, Figma ou Photoshop.', 'Export as SVG, PNG, CSS or the spec sheet and finish in Illustrator, Figma or Photoshop.')}</li>
          </ol>
          <h4>{t('Para aprender', 'To learn')}</h4>
          {t(
            <p>
              O painel <strong>Teoria</strong> explica o grid escolhido e mostra os números ao vivo. O botão <strong>Construir</strong> monta o grid camada por camada. O painel{' '}
              <strong>Diagramação</strong> avalia a variação (espaço branco, alinhamento, hierarquia, equilíbrio e medida) e diz o que melhorar.
            </p>,
            <p>
              The <strong>Theory</strong> panel explains the chosen grid and shows its numbers live. The <strong>Build</strong> button draws the grid layer by layer. The{' '}
              <strong>Layout</strong> panel scores the variation (white space, alignment, hierarchy, balance and measure) and says what to improve.
            </p>,
          )}
          <h4>{t('Livros', 'Books')}</h4>
          {t(
            <p>
              No grupo <strong>Livro</strong> do seletor de escolas há seis receitas de miolo, com uma, duas ou três fontes. “Exemplos” abre o Livro 16×23 em página dupla com acréscimo de encadernação, e ◀ ▶ percorrem as páginas típicas: abertura de capítulo, intertítulos, texto corrido, figura, notas, sumário, folha de rosto, parte e epígrafe. Cabeços e fólios seguem recto e verso.
            </p>,
            <p>
              The <strong>Book</strong> group of the school selector holds six recipes for text pages, with one, two or three fonts. “Examples” opens the 16×23 Book as a double page with a binding allowance, and ◀ ▶ step through the typical pages: chapter opening, subheads, running text, figure, notes, contents, title page, part and epigraph. Running heads and folios follow recto and verso.
            </p>,
          )}
        </div>
        <div>
          <h4>{t('Atalhos', 'Shortcuts')}</h4>
          <table className="nums keys">
            <tbody>
              {KEYS.map(([k, pt, en]) => {
                const [kPt, kEn = kPt] = k.split('|');
                return (
                  <tr key={k}>
                    <th>
                      <kbd>{t(kPt, kEn)}</kbd>
                    </th>
                    <td>{t(pt, en)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="help-foot">
        <button className="link" onClick={() => s.set({ helpOpen: false, aboutOpen: true })}>
          {t('Sobre o projeto e créditos', 'About the project and credits')}
        </button>
      </p>
    </Modal>
  );
}

export const REPO_URL = 'https://github.com/dduenhas/grid-sandbox';
const AUTHOR_URL = 'https://diegoduenhas.com.br';
const EMAIL = 'dduenhas@gmail.com';
const YEAR = 2026;
const VIDEO_URL = 'https://www.youtube.com/shorts/3FZIsShcU08';
const VIDEO_THUMB = '/inspiracao-will-paterson.jpg';

export function AboutModal() {
  const s = useStore();
  const t = useT();
  return (
    <Modal title={t('Sobre o Grid Sandbox', 'About Grid Sandbox')} onClose={() => s.set({ aboutOpen: false })} wide>
      <div className="help-cols about">
        <div>
          <h4>{t('Filosofia', 'Philosophy')}</h4>
          <p>
            {t(
              'O grid nasce na prancheta: folha, régua, lápis e recortes de papel reposicionados à mão até a página encontrar sua ordem. O Grid Sandbox leva esse gesto para a tela. Em vez de começar num software de produção com um documento vazio, o designer experimenta dezenas de estruturas e diagramações em segundos e só depois segue para o Illustrator, o Figma ou o Photoshop com uma decisão tomada.',
              'The grid is born on the drawing board: sheet, ruler, pencil and paper cutouts moved by hand until the page finds its order. Grid Sandbox brings that gesture to the screen. Instead of starting in production software with an empty document, the designer tries dozens of structures and layouts in seconds, and only then moves on to Illustrator, Figma or Photoshop with a decision already made.',
            )}
          </p>
          <h4>{t('Decisões de projeto', 'Design decisions')}</h4>
          <ul className="bullets">
            <li>
              <strong>{t('Rapidez acima de tudo.', 'Speed above all.')}</strong>{' '}
              {t('Cada combinação é gerada na hora, de forma determinística, e percorrida com ◀ ▶ ou pelo teclado.', 'Every combination is generated instantly and deterministically, and browsed with ◀ ▶ or the keyboard.')}
            </li>
            <li>
              <strong>{t('Teoria embutida.', 'Built-in theory.')}</strong>{' '}
              {t(
                'Grids, margens e escalas seguem Müller-Brockmann, Tschichold, Van de Graaf, Gerstner e Bringhurst, e cada escolha vem explicada.',
                'Grids, margins and scales follow Müller-Brockmann, Tschichold, Van de Graaf, Gerstner and Bringhurst, and every choice is explained.',
              )}
            </li>
            <li>
              <strong>{t('Escolas como ponto de partida.', 'Schools as a starting point.')}</strong>{' '}
              {t('Cada escola de design carrega suas fontes, paleta, grids e arquétipos de página.', 'Each design school brings its own fonts, palette, grids and page archetypes.')}
            </li>
            <li>
              <strong>{t('Automático e manual.', 'Automatic and manual.')}</strong>{' '}
              {t('A máquina propõe, o designer fixa o que funciona e ajusta à mão, sempre encaixado no grid.', 'The machine proposes; the designer pins what works and adjusts by hand, always snapped to the grid.')}
            </li>
            <li>
              <strong>{t('Saída utilizável.', 'Usable output.')}</strong>{' '}
              {t('SVG em camadas, PNG, CSS Grid e uma ficha técnica para refazer o grid na ferramenta de produção.', 'Layered SVG, PNG, CSS Grid and a spec sheet to rebuild the grid in your production tool.')}
            </li>
          </ul>
          <h4>{t('Motivação', 'Motivation')}</h4>
          <p>
            {t(
              'Servir ao mesmo tempo como ferramenta de estudo, para quem está aprendendo diagramação, e como etapa de esboço rápido no dia a dia de quem já trabalha com design gráfico e de interfaces.',
              'To serve both as a study tool for people learning layout and as a quick sketching step in the daily work of those already working in graphic and interface design.',
            )}
          </p>
        </div>
        <div>
          <h4>{t('Inspiração', 'Inspiration')}</h4>
          <a
            className="about-video"
            href={VIDEO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={t('Assistir no YouTube: How Does The Grid System Work?, de Will Paterson', 'Watch on YouTube: How Does The Grid System Work?, by Will Paterson')}
          >
            <img src={VIDEO_THUMB} alt={t('Cena do vídeo How Does The Grid System Work?, de Will Paterson', 'Still from the video How Does The Grid System Work?, by Will Paterson')} loading="lazy" />
          </a>
          {t(
            <p>
              A ideia surgiu ao assistir ao vídeo{' '}
              <a href={VIDEO_URL} target="_blank" rel="noreferrer">
                “How Does The Grid System Work?”
              </a>
              , do designer e youtuber Will Paterson. Ele me lembrou que construir com o grid adequado exige muita prática e estudo teórico até saber qual escolher.
              Exemplos concretos, cada um aplicado ao uso em que funciona melhor, podem ajudar a encontrar o grid certo para cada projeto.
            </p>,
            <p>
              The idea came from watching the video{' '}
              <a href={VIDEO_URL} target="_blank" rel="noreferrer">
                “How Does The Grid System Work?”
              </a>
              {' '}by designer and YouTuber Will Paterson. It reminded me that building with the right grid takes a lot of practice and theoretical study before you know
              which one to choose. Concrete examples, each applied to the use it suits best, can help you find the right grid for each project.
            </p>,
          )}
          <h4>{t('Autor', 'Author')}</h4>
          {t(
            <p>
              Desenvolvido por{' '}
              <a href={AUTHOR_URL} target="_blank" rel="noreferrer">
                <strong>Diego Duenhas</strong>
              </a>
              , designer gráfico e desenvolvedor web com mais de duas décadas de experiência em identidades visuais, projetos editoriais e interfaces digitais, da
              concepção gráfica à implementação front-end.
            </p>,
            <p>
              Developed by{' '}
              <a href={AUTHOR_URL} target="_blank" rel="noreferrer">
                <strong>Diego Duenhas</strong>
              </a>
              , a graphic designer and web developer with more than two decades of experience in visual identities, editorial projects and digital interfaces, from
              graphic concept to front-end implementation.
            </p>,
          )}
          <ul className="bullets">
            <li>{t('Tecnologia em Design Gráfico · SENAC São Paulo (2026)', 'Technologist degree in Graphic Design · SENAC São Paulo (2026)')}</li>
            <li>{t('Tecnologia em Sistemas para Internet · IFSP São João da Boa Vista (2017)', 'Technologist degree in Internet Systems · IFSP São João da Boa Vista (2017)')}</li>
          </ul>
          <table className="nums about-links">
            <tbody>
              <tr>
                <th>{t('Site', 'Website')}</th>
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
                <th>{t('Código', 'Code')}</th>
                <td>
                  <a href={REPO_URL} target="_blank" rel="noreferrer">
                    github.com/dduenhas/grid-sandbox
                  </a>
                </td>
              </tr>
              <tr>
                <th>{t('Licença', 'License')}</th>
                <td>
                  <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
                    MIT
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="muted small">
            © {YEAR} Diego Duenhas.{' '}
            {t(
              'Software livre sob a licença MIT: use, modifique e distribua, mantendo o aviso de copyright.',
              'Free software under the MIT license: use, modify and distribute it, keeping the copyright notice.',
            )}
          </p>
        </div>
      </div>
    </Modal>
  );
}

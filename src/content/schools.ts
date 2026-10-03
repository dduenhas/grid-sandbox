import type { GridTypeId } from '../core/gridEngine';
import type { BookArchetypeId, BookStyle } from './book';
import { bilingualList } from '../i18n';
import { SCHOOLS_EN } from './en/schools';

export type ArchetypeId =
  | BookArchetypeId
  | 'hero'
  | 'editorial'
  | 'catalog'
  | 'typoster'
  | 'mosaic'
  | 'zpattern'
  | 'fpattern'
  | 'asymmetric'
  | 'classical'
  | 'constructivist';

export interface FontSpec {
  family: string;
  weight: number;
  fallback: string;
  italic?: boolean;
}

export interface Palette {
  paper: string;
  ink: string;
  accent: string;
  accent2: string;
  accent3: string;
  image: string;
  muted: string;
}

export interface Reference {
  title: string;
  author: string;
  year: string;
}

export interface School {
  id: string;
  name: string;
  era: string;
  masters: string[];
  summary: string;
  principles: string[];
  typography: string;
  gridAdvice: string;
  display: FontSpec;
  text: FontSpec;
  /** Third style for paratext (running heads, folios, notes). Defaults to `text`. */
  para?: FontSpec;
  googleFamilies: string[];
  headlineCase: 'none' | 'upper' | 'lower';
  headlineTracking: number;
  headlineLeading: number;
  align: 'left' | 'center' | 'right';
  palette: Palette;
  preferredGrids: GridTypeId[];
  archetypes: ArchetypeId[];
  scale: string;
  /** Max rotation (degrees) the generator may apply to blocks. */
  rotation: number;
  overlap: boolean;
  rules: boolean;
  shapes: boolean;
  /** Probability of an accent-colored block. */
  colorUse: number;
  /** Target share of empty modules (0..1). */
  whitespace: number;
  /** Desired offset of the visual center of mass (0 = centered, 0.2 = clearly asymmetric). */
  balanceOffset: number;
  headlines: string[];
  kickers: string[];
  quotes: string[];
  references: Reference[];
  /** Present on book styles: the full recipe for book pages. */
  book?: BookStyle;
}

const sans = 'Helvetica Neue, Arial, sans-serif';
const serif = 'Georgia, Times New Roman, serif';
const mono = 'Courier New, monospace';

const SCHOOLS_PT: School[] = [
  {
    id: 'swiss',
    name: 'Suíço / Estilo Tipográfico Internacional',
    era: 'Basileia e Zurique, 1950–1970',
    masters: ['Josef Müller-Brockmann', 'Armin Hofmann', 'Emil Ruder', 'Max Bill', 'Wim Crouwel'],
    summary:
      'Objetividade, legibilidade e ordem matemática. O grid modular é a espinha de tudo; a tipografia sem serifa, alinhada à esquerda e sem justificação, organiza a informação em hierarquias claras com muito espaço branco ativo.',
    principles: [
      'Grid modular com campos múltiplos da entrelinha',
      'Alinhamento à esquerda, margem direita irregular (flush-left, ragged-right)',
      'Assimetria equilibrada: o peso não fica no centro',
      'Fotografia objetiva no lugar de ilustração',
      'Contraste por escala e peso, não por ornamento',
      'Espaço branco é elemento ativo da composição',
    ],
    typography: 'Grotescas neutras (Akzidenz-Grotesk, Helvetica, Univers). Aqui: Inter Tight e Inter.',
    gridAdvice: 'Prefira modulares 4×6 ou 6×8 com baseline travado. Alinhe todos os elementos às linhas de fluxo e deixe campos vazios.',
    display: { family: 'Inter Tight', weight: 700, fallback: sans },
    text: { family: 'Inter', weight: 400, fallback: sans },
    googleFamilies: ['Inter+Tight:wght@400;500;700;800', 'Inter:wght@400;500;700'],
    headlineCase: 'none',
    headlineTracking: -0.025,
    headlineLeading: 0.95,
    align: 'left',
    palette: { paper: '#f6f5f0', ink: '#141414', accent: '#e2231a', accent2: '#141414', accent3: '#8a8a85', image: '#cfcfc9', muted: '#7d7d78' },
    preferredGrids: ['mod-4x6', 'mod-6x8', 'col-4', 'col-6', 'mod-3x3', 'col-3'],
    archetypes: ['hero', 'typoster', 'asymmetric', 'editorial', 'mosaic'],
    scale: 'golden',
    rotation: 0,
    overlap: false,
    rules: true,
    shapes: false,
    colorUse: 0.25,
    whitespace: 0.4,
    balanceOffset: 0.15,
    headlines: ['O Sistema de Grid', 'Ordem e Clareza', 'Forma segue função', 'Konstruktive Grafik', 'Der Film', 'Música Viva', 'Tipografia Objetiva'],
    kickers: ['Ausstellung', 'Kunstgewerbemuseum Zürich', 'Programa 1958', 'Edição Nº 4'],
    quotes: ['O grid é uma ajuda, não uma garantia.', 'Menos é mais.', 'Ordem é a base de toda boa forma.'],
    references: [
      { title: 'Grid Systems in Graphic Design', author: 'Josef Müller-Brockmann', year: '1981' },
      { title: 'Typographie', author: 'Emil Ruder', year: '1967' },
      { title: 'Neue Grafik (revista)', author: 'Müller-Brockmann, Lohse, Neuburg, Vivarelli', year: '1958–65' },
      { title: 'Der Film (cartaz)', author: 'Josef Müller-Brockmann', year: '1960' },
    ],
  },
  {
    id: 'bauhaus',
    name: 'Bauhaus',
    era: 'Weimar, Dessau e Berlim, 1919–1933',
    masters: ['Herbert Bayer', 'László Moholy-Nagy', 'Joost Schmidt', 'Josef Albers'],
    summary:
      'Unir arte, artesanato e indústria. Formas geométricas primárias (círculo, quadrado, triângulo), cores primárias, tipografia sem serifa e barras grossas que dirigem o olhar. A página é uma máquina de comunicação.',
    principles: [
      'Formas primárias associadas às cores primárias (Kandinsky: triângulo amarelo, quadrado vermelho, círculo azul)',
      'Barras e filetes grossos como estrutura e direção',
      'Tipografia geométrica, muitas vezes em minúsculas (Bayer: Universal)',
      'Composição dinâmica com eixos fortes horizontais e verticais',
      'Fotografia e fotomontagem como linguagem moderna',
    ],
    typography: 'Geométricas (Futura, Universal de Bayer). Aqui: Jost.',
    gridAdvice: 'Grids de 3 ou 4 colunas com campos grandes; use formas geométricas ocupando módulos inteiros e barras na linha de fluxo.',
    display: { family: 'Jost', weight: 700, fallback: sans },
    text: { family: 'Jost', weight: 400, fallback: sans },
    googleFamilies: ['Jost:wght@400;500;700;800'],
    headlineCase: 'lower',
    headlineTracking: -0.01,
    headlineLeading: 0.95,
    align: 'left',
    palette: { paper: '#efe8d8', ink: '#1a1a1a', accent: '#d62718', accent2: '#f2b705', accent3: '#1f4fa0', image: '#c9c0ac', muted: '#6f675a' },
    preferredGrids: ['col-3', 'mod-3x3', 'col-4', 'mod-4x6', 'thirds'],
    archetypes: ['constructivist', 'asymmetric', 'hero', 'mosaic'],
    scale: 'perfect-fifth',
    rotation: 0,
    overlap: true,
    rules: true,
    shapes: true,
    colorUse: 0.6,
    whitespace: 0.3,
    balanceOffset: 0.18,
    headlines: ['bauhaus ausstellung', 'arte e técnica', 'forma e cor', 'staatliches bauhaus', 'nova unidade'],
    kickers: ['weimar 1923', 'dessau', 'oficina de tipografia', 'curso preliminar'],
    quotes: ['a forma segue a função', 'arte e técnica: uma nova unidade'],
    references: [
      { title: 'Cartaz da exposição Bauhaus', author: 'Joost Schmidt', year: '1923' },
      { title: 'Universal (alfabeto)', author: 'Herbert Bayer', year: '1925' },
      { title: 'Malerei, Fotografie, Film', author: 'László Moholy-Nagy', year: '1925' },
    ],
  },
  {
    id: 'constructivism',
    name: 'Construtivismo russo',
    era: 'Moscou e Petrogrado, 1917–1932',
    masters: ['El Lissitzky', 'Alexander Rodchenko', 'Varvara Stepanova', 'Gustav Klutsis'],
    summary:
      'Arte a serviço da revolução e da produção. Diagonais tensas, vermelho e preto, tipografia condensada em blocos, fotomontagem e composições que parecem estar em movimento.',
    principles: [
      'Diagonais e eixos rotacionados criam energia e movimento',
      'Paleta restrita: vermelho, preto e o papel',
      'Tipografia pesada e condensada, frequentemente em caixa-alta',
      'Formas geométricas como agentes (a cunha vermelha de Lissitzky)',
      'Sobreposição e fotomontagem',
    ],
    typography: 'Grotescas condensadas e pesadas. Aqui: Oswald e PT Sans.',
    gridAdvice: 'Use o grid diagonal e mantenha um eixo dominante. A diagonal ascendente (da esquerda para a direita) lê-se como avanço.',
    display: { family: 'Oswald', weight: 700, fallback: 'Impact, sans-serif' },
    text: { family: 'PT Sans', weight: 400, fallback: sans },
    googleFamilies: ['Oswald:wght@400;600;700', 'PT+Sans:wght@400;700'],
    headlineCase: 'upper',
    headlineTracking: 0,
    headlineLeading: 0.9,
    align: 'left',
    palette: { paper: '#e9dfc8', ink: '#161616', accent: '#c4161c', accent2: '#161616', accent3: '#c4161c', image: '#b9ad94', muted: '#6d6352' },
    preferredGrids: ['diagonal', 'col-4', 'mod-4x6', 'gerstner'],
    archetypes: ['constructivist', 'typoster', 'asymmetric', 'hero'],
    scale: 'octave',
    rotation: 12,
    overlap: true,
    rules: true,
    shapes: true,
    colorUse: 0.6,
    whitespace: 0.3,
    balanceOffset: 0.2,
    headlines: ['Livros!', 'Golpeie os brancos com a cunha vermelha', 'Construção', 'Novo Mundo', 'Kino-Glaz'],
    kickers: ['Lengiz 1924', 'Moscou', 'Edições do Estado', 'Proletários'],
    quotes: ['A arte morreu, viva a arte da máquina.', 'Construir, não decorar.'],
    references: [
      { title: 'Golpeie os brancos com a cunha vermelha', author: 'El Lissitzky', year: '1919' },
      { title: 'Livros (cartaz Lengiz)', author: 'Alexander Rodchenko', year: '1924' },
      { title: 'Dlia golosa (Para a voz)', author: 'El Lissitzky e Maiakóvski', year: '1923' },
    ],
  },
  {
    id: 'destijl',
    name: 'De Stijl / Neoplasticismo',
    era: 'Holanda, 1917–1931',
    masters: ['Piet Mondrian', 'Theo van Doesburg', 'Bart van der Leck', 'Vilmos Huszár'],
    summary:
      'Harmonia universal pela abstração pura: apenas horizontais, verticais, as três cores primárias e o preto, o branco e o cinza. Retângulos assimétricos separados por filetes grossos.',
    principles: [
      'Somente linhas ortogonais (sem diagonais na versão de Mondrian)',
      'Cores primárias puras em campos retangulares',
      'Filetes pretos grossos dividindo o plano',
      'Assimetria dinâmica e equilíbrio por compensação de áreas',
      'Letreiramento construído a partir de retângulos',
    ],
    typography: 'Letras geométricas e blocadas. Aqui: Archivo Black e Archivo.',
    gridAdvice: 'Fibonacci ou seção áurea com campos desiguais funcionam bem; preencha alguns campos com cor pura e use filetes nas calhas.',
    display: { family: 'Archivo Black', weight: 400, fallback: sans },
    text: { family: 'Archivo', weight: 400, fallback: sans },
    googleFamilies: ['Archivo+Black', 'Archivo:wght@400;600;800'],
    headlineCase: 'upper',
    headlineTracking: 0.02,
    headlineLeading: 0.95,
    align: 'left',
    palette: { paper: '#f6f4ee', ink: '#111111', accent: '#d6281b', accent2: '#f6c700', accent3: '#1d3e94', image: '#d8d6cf', muted: '#77756f' },
    preferredGrids: ['fibonacci', 'golden', 'mod-3x3', 'col-5', 'hierarchical'],
    archetypes: ['mosaic', 'asymmetric', 'typoster'],
    scale: 'perfect-fifth',
    rotation: 0,
    overlap: false,
    rules: true,
    shapes: true,
    colorUse: 0.7,
    whitespace: 0.25,
    balanceOffset: 0.2,
    headlines: ['De Stijl', 'Composição II', 'Ritmo e Plano', 'Neo-Plasticisme'],
    kickers: ['Leiden 1917', 'Maandblad', 'Nº 1'],
    quotes: ['A linha reta é a expressão do universal.'],
    references: [
      { title: 'Revista De Stijl (capa)', author: 'Vilmos Huszár', year: '1917' },
      { title: 'Composição com vermelho, amarelo e azul', author: 'Piet Mondrian', year: '1930' },
    ],
  },
  {
    id: 'newtypo',
    name: 'Nova Tipografia (Tschichold)',
    era: 'Alemanha, 1925–1935',
    masters: ['Jan Tschichold', 'Kurt Schwitters', 'Piet Zwart', 'Paul Renner'],
    summary:
      'Tipografia funcional e assimétrica: a ordem vem do conteúdo, não da tradição centralizada. Hierarquia por tamanho e peso, espaços generosos, filetes e grotescas. Base direta do Estilo Suíço.',
    principles: [
      'Assimetria funcional no lugar do eixo central',
      'Tipos sem serifa como "a letra do nosso tempo"',
      'Contraste de tamanho, peso e direção para hierarquia',
      'Padronização: formatos DIN (A4, A5)',
      'Filetes e pontos como sinalização tipográfica',
    ],
    typography: 'Grotescas e geométricas (Futura, Akzidenz). Aqui: Hanken Grotesk.',
    gridAdvice: 'Manuscrito com coluna de notas ou 5 colunas assimétricas; o texto ocupa as colunas largas e os metadados as estreitas.',
    display: { family: 'Hanken Grotesk', weight: 800, fallback: sans },
    text: { family: 'Hanken Grotesk', weight: 400, fallback: sans },
    googleFamilies: ['Hanken+Grotesk:wght@400;600;800'],
    headlineCase: 'none',
    headlineTracking: -0.015,
    headlineLeading: 1,
    align: 'left',
    palette: { paper: '#f2efe6', ink: '#151515', accent: '#c8102e', accent2: '#151515', accent3: '#c8102e', image: '#cdc8bb', muted: '#76716a' },
    preferredGrids: ['manuscript-notes', 'col-5', 'col-3', 'mod-4x6'],
    archetypes: ['asymmetric', 'editorial', 'fpattern', 'typoster'],
    scale: 'perfect-fourth',
    rotation: 0,
    overlap: false,
    rules: true,
    shapes: false,
    colorUse: 0.3,
    whitespace: 0.42,
    balanceOffset: 0.18,
    headlines: ['Die neue Typographie', 'Tipografia Funcional', 'Phoebus Palast', 'Elementare Typographie'],
    kickers: ['Berlim 1928', 'Ein Handbuch', 'Bildungsverband'],
    quotes: ['A essência da nova tipografia é a clareza.'],
    references: [
      { title: 'Die neue Typographie', author: 'Jan Tschichold', year: '1928' },
      { title: 'Elementare Typographie', author: 'Jan Tschichold', year: '1925' },
      { title: 'Cartazes Phoebus Palast', author: 'Jan Tschichold', year: '1927' },
    ],
  },
  {
    id: 'classical',
    name: 'Livro renascentista (Aldo Manuzio)',
    era: 'Veneza e Europa, séculos XV–XVIII',
    masters: ['Aldo Manuzio', 'Claude Garamond', 'Nicolas Jenson', 'Giambattista Bodoni', 'Jan Tschichold (tardio)'],
    summary:
      'A página como harmonia de proporções. Mancha de texto com a mesma proporção da página, margens progressivas (interna < superior < externa < inferior), eixo central, versaletes, capitulares e romanas de alto contraste.',
    principles: [
      'Cânone de Van de Graaf / Villard: proporções 2:3 e margens 1/9',
      'Margens progressivas que equilibram a página dupla',
      'Eixo simétrico e títulos centralizados',
      'Romanas humanistas ou garaldinas, versaletes e itálicos',
      'Cor tipográfica uniforme: justificação com hifenização cuidadosa',
    ],
    typography: 'Garaldinas (Garamond, Bembo, Jenson). Aqui: EB Garamond.',
    gridAdvice: 'Use o manuscrito com cânone e ative a página dupla para ver o espelhamento. A mancha deve ter a proporção da página.',
    display: { family: 'EB Garamond', weight: 500, fallback: serif },
    text: { family: 'EB Garamond', weight: 400, fallback: serif },
    googleFamilies: ['EB+Garamond:ital,wght@0,400;0,500;0,700;1,400;1,500'],
    headlineCase: 'upper',
    headlineTracking: 0.08,
    headlineLeading: 1.1,
    align: 'center',
    palette: { paper: '#f5efe1', ink: '#2a2622', accent: '#8b1e1e', accent2: '#2a2622', accent3: '#8b1e1e', image: '#d9cfb9', muted: '#7d7263' },
    preferredGrids: ['manuscript', 'book-trade', 'manuscript-notes', 'book-2col'],
    archetypes: ['chapter', 'sections', 'running', 'figure', 'notes', 'contents', 'titlepage', 'part', 'epigraph'],
    scale: 'perfect-fourth',
    rotation: 0,
    overlap: false,
    rules: false,
    shapes: false,
    colorUse: 0.15,
    whitespace: 0.3,
    balanceOffset: 0,
    headlines: ['Hypnerotomachia Poliphili', 'Da Arte de Imprimir', 'Elementos de Estilo', 'Capítulo Primeiro'],
    kickers: ['Venetiis MCCCCXCIX', 'Livro I', 'In aedibus Aldi'],
    quotes: ['A tipografia existe para honrar o conteúdo.'],
    references: [
      { title: 'Hypnerotomachia Poliphili', author: 'Aldo Manuzio', year: '1499' },
      { title: 'The Form of the Book', author: 'Jan Tschichold', year: '1975' },
      { title: 'The Elements of Typographic Style', author: 'Robert Bringhurst', year: '1992' },
      { title: 'A construção do livro', author: 'Emanuel Araújo', year: '1986' },
    ],
    book: {
      leadingPt: 14,
      leadRatio: 1.3,
      justify: true,
      paragraph: 'indent',
      dropCap: { lines: 3, role: 'display', accent: true },
      leadIn: 'smallcaps',
      chapter: {
        align: 'center',
        sink: 1 / 3,
        number: 'roman',
        label: 'Capítulo',
        numberRole: 'text',
        numberScale: 1,
        numberCase: 'smallcaps',
        numberTracking: 0.12,
        numberAccent: true,
        titleRole: 'display',
        titleScale: 1.5,
        titleCase: 'upper',
        titleItalic: false,
        titleTracking: 0.12,
        gap: 1,
        ornament: '❦',
      },
      heads: [
        { role: 'text', scale: 1, case: 'upper', tracking: 0.14, align: 'center', before: 2, after: 1 },
        { role: 'text', scale: 1, italic: true, case: 'none', tracking: 0, align: 'center', before: 1, after: 0 },
        { role: 'text', scale: 1, case: 'smallcaps', tracking: 0.06, align: 'left', before: 0, after: 0, runIn: true },
      ],
      runhead: { verso: 'book', recto: 'chapter', role: 'text', case: 'smallcaps', italic: false, tracking: 0.12, align: 'center' },
      folio: { position: 'foot-center', role: 'text', dropOnOpening: true },
      breakMark: '❦',
      notes: 'foot',
      epigraph: { align: 'center', prob: 0.4 },
      recipe: {
        fonts: '1 família, 4 estilos: EB Garamond em romano, itálico, versaletes e maiúsculas espacejadas. A hierarquia nasce da caixa e do estilo, quase sem mudar o corpo.',
        margins: 'Cânone de Van de Graaf: 1/9 e 2/9 da página. A mancha tem a proporção da página e ocupa cerca de 44% da área.',
        leading: '10,8/14 pt (130%), justificado.',
        paragraph: 'Recuo de 1 eme. O primeiro parágrafo depois de um título ou de uma quebra começa alinhado.',
        opening: 'Rebaixo de 1/3, “Capítulo I” em versaletes vermelhos, título em maiúsculas espacejadas, vinheta ❦, capitular vermelha de 3 linhas e primeiras palavras em versaletes.',
        hierarchy: 'A: maiúsculas espacejadas no corpo do texto, centradas, 2 linhas antes e 1 depois. B: itálico centrado, 1 linha antes. C: versaletes corridos no início do parágrafo.',
      },
      masterpieces: [
        { title: 'Hypnerotomachia Poliphili', who: 'Aldo Manuzio, tipos de Francesco Griffo', year: '1499', lesson: 'Texto e imagem compostos como arquitetura. Capitulares e maiúsculas espacejadas fazem a hierarquia sem trocar de família.' },
        { title: 'De Aetna', who: 'Pietro Bembo, impresso por Aldo Manuzio', year: '1496', lesson: 'A romana de Griffo, origem das garaldinas: cor uniforme e proporções calmas.' },
        { title: 'A forma do livro', who: 'Jan Tschichold', year: '1975', lesson: 'Reconstrói o cânone das margens dos manuscritos e mostra por que a mancha deve ter a proporção da página.' },
      ],
    },
  },
  {
    id: 'vignelli',
    name: 'Modernismo americano (Vignelli)',
    era: 'Nova York, 1960–2000',
    masters: ['Massimo Vignelli', 'Lella Vignelli', 'Paul Rand', 'Ivan Chermayeff'],
    summary:
      'Disciplina, adequação e intemporalidade. Poucas fontes (Helvetica, Bodoni, Garamond, Century, Futura), grids rigorosos, faixas pretas e contraste de escala. "Se você faz certo, dura para sempre."',
    principles: [
      'Semântica, sintática e pragmática: significado, estrutura e uso',
      'Um pequeno vocabulário tipográfico usado com maestria',
      'Grids rigorosos com faixa superior (cabeçalho) dominante',
      'Contraste de escala extremo entre títulos e texto',
      'Preto, branco e vermelho como paleta',
    ],
    typography: 'Bodoni para títulos e grotesca para texto. Aqui: Bodoni Moda e Inter.',
    gridAdvice: 'Hierárquico ou 6 colunas com uma faixa superior forte. Mantenha o vocabulário mínimo e consistente.',
    display: { family: 'Bodoni Moda', weight: 700, fallback: serif },
    text: { family: 'Inter', weight: 400, fallback: sans },
    googleFamilies: ['Bodoni+Moda:opsz,wght@6..96,500;6..96,700', 'Inter:wght@400;500;700'],
    headlineCase: 'none',
    headlineTracking: -0.02,
    headlineLeading: 0.95,
    align: 'left',
    palette: { paper: '#fafafa', ink: '#000000', accent: '#d7261e', accent2: '#000000', accent3: '#d7261e', image: '#d1d1d1', muted: '#777777' },
    preferredGrids: ['hierarchical', 'col-6', 'mod-6x8', 'col-12', 'col-3'],
    archetypes: ['editorial', 'hero', 'fpattern', 'catalog'],
    scale: 'perfect-fifth',
    rotation: 0,
    overlap: false,
    rules: true,
    shapes: false,
    colorUse: 0.25,
    whitespace: 0.38,
    balanceOffset: 0.1,
    headlines: ['The Vignelli Canon', 'Intemporal', 'Disciplina', 'Design is One'],
    kickers: ['New York', 'Unimark International', 'Nº 12'],
    quotes: ['Se você faz certo, dura para sempre.', 'O design é um só.'],
    references: [
      { title: 'The Vignelli Canon', author: 'Massimo Vignelli', year: '2010' },
      { title: 'NYC Subway Diagram', author: 'Massimo Vignelli', year: '1972' },
      { title: 'Identidade da American Airlines', author: 'Massimo Vignelli', year: '1967' },
    ],
  },
  {
    id: 'newwave',
    name: 'New Wave / Pós-moderno',
    era: 'Basileia, Califórnia, Londres, 1970–1995',
    masters: ['Wolfgang Weingart', 'April Greiman', 'David Carson', 'Neville Brody', 'Ed Fella'],
    summary:
      'Questionar a neutralidade suíça por dentro: camadas, tipografia espaçada e rotacionada, mudanças bruscas de escala, texturas e quebra deliberada do grid. O grid existe para ser tensionado.',
    principles: [
      'O grid é conhecido para poder ser quebrado com intenção',
      'Camadas, sobreposições e transparências',
      'Tracking e escala exagerados, palavras rotacionadas',
      'Cor vibrante e ruído controlado',
      'Leitura como experiência, não só transmissão',
    ],
    typography: 'Grotescas expressivas e tipos de exibição. Aqui: Syne e Space Grotesk.',
    gridAdvice: 'Comece por um modular denso (6×8) e deixe 1 ou 2 elementos escaparem: rotação, sangria, sobreposição. O resto continua alinhado.',
    display: { family: 'Syne', weight: 800, fallback: sans },
    text: { family: 'Space Grotesk', weight: 400, fallback: sans },
    googleFamilies: ['Syne:wght@500;700;800', 'Space+Grotesk:wght@400;500;700'],
    headlineCase: 'upper',
    headlineTracking: 0.04,
    headlineLeading: 0.88,
    align: 'left',
    palette: { paper: '#f2f0ea', ink: '#121212', accent: '#ff3c8e', accent2: '#2bd1c4', accent3: '#f7d83b', image: '#c8c4bb', muted: '#6f6b64' },
    preferredGrids: ['mod-6x8', 'gerstner', 'diagonal', 'fibonacci', 'col-12'],
    archetypes: ['mosaic', 'constructivist', 'typoster', 'asymmetric'],
    scale: 'octave',
    rotation: 8,
    overlap: true,
    rules: true,
    shapes: true,
    colorUse: 0.55,
    whitespace: 0.25,
    balanceOffset: 0.22,
    headlines: ['Ray Gun', 'Typography as Discourse', 'The End of Print', 'Kunsthalle Basel'],
    kickers: ['Issue 21', 'Los Angeles', 'Basel 1979'],
    quotes: ['Não confunda legibilidade com comunicação.'],
    references: [
      { title: 'Revista Ray Gun', author: 'David Carson', year: '1992–95' },
      { title: 'Cartazes Kunsthalle Basel', author: 'Wolfgang Weingart', year: '1977–84' },
      { title: 'Does It Make Sense? (Design Quarterly)', author: 'April Greiman', year: '1986' },
    ],
  },
  {
    id: 'japanese',
    name: 'Minimalismo japonês',
    era: 'Tóquio, 1950–hoje',
    masters: ['Ikko Tanaka', 'Kenya Hara', 'Yusaku Kamekura', 'Kazumasa Nagai'],
    summary:
      '"Ma" (間): o intervalo, o vazio carregado de sentido. Poucos elementos, muita respiração, equilíbrio sutil, cores planas e tipografia discreta. O silêncio comunica tanto quanto a forma.',
    principles: [
      'Ma: o espaço vazio é protagonista',
      'Poucos elementos com posicionamento preciso',
      'Assimetria serena (ausência de centro obrigatório)',
      'Cores planas e naturais, um único acento',
      'Tipografia pequena, vertical ou deslocada para as bordas',
    ],
    typography: 'Mincho e Gothic. Aqui: Noto Serif JP e Noto Sans JP.',
    gridAdvice: 'Terços ou seção áurea com poucos elementos. Ocupe menos da metade dos campos e use a margem como espaço ativo.',
    display: { family: 'Noto Serif JP', weight: 600, fallback: serif },
    text: { family: 'Noto Sans JP', weight: 400, fallback: sans },
    googleFamilies: ['Noto+Serif+JP:wght@400;600', 'Noto+Sans+JP:wght@400;500'],
    headlineCase: 'none',
    headlineTracking: 0.12,
    headlineLeading: 1.2,
    align: 'left',
    palette: { paper: '#f7f4ee', ink: '#1d1d1b', accent: '#bc002d', accent2: '#1d1d1b', accent3: '#4b6b5c', image: '#d9d4ca', muted: '#8a857b' },
    preferredGrids: ['thirds', 'golden', 'mod-3x3', 'manuscript', 'col-5'],
    archetypes: ['typoster', 'asymmetric', 'hero'],
    scale: 'golden',
    rotation: 0,
    overlap: false,
    rules: false,
    shapes: true,
    colorUse: 0.3,
    whitespace: 0.65,
    balanceOffset: 0.2,
    headlines: ['Ma 間', 'Vazio', 'Muji', 'Silêncio e Forma', 'Nihon Buyo'],
    kickers: ['Tóquio', 'Design Committee', 'Primavera'],
    quotes: ['O vazio contém todas as possibilidades.'],
    references: [
      { title: 'Nihon Buyo (cartaz)', author: 'Ikko Tanaka', year: '1981' },
      { title: 'Designing Design', author: 'Kenya Hara', year: '2007' },
      { title: 'Tokyo Olympics 1964 (cartaz)', author: 'Yusaku Kamekura', year: '1961' },
    ],
  },
  {
    id: 'editorial',
    name: 'Editorial de revista',
    era: 'Nova York e Londres, 1930–hoje',
    masters: ['Alexey Brodovitch', 'Fabien Baron', 'Roger Black', 'Willy Fleckhaus'],
    summary:
      'Ritmo de leitura em página dupla: títulos serifados de alto contraste, fotografia sangrada, texto em colunas, olhos e citações em destaque. Hierarquia rica para várias portas de entrada.',
    principles: [
      'Múltiplos pontos de entrada: título, linha fina, olho, legenda',
      'Contraste entre serifa de display e texto',
      'Fotografia grande que dialoga com o texto (Brodovitch)',
      'Colunas de texto com 45–75 caracteres',
      'Ritmo e respiro entre páginas',
    ],
    typography: 'Didone de display e serifa de texto. Aqui: Playfair Display e Source Serif 4.',
    gridAdvice: '3, 6 ou 12 colunas. Imagens ocupam múltiplos de colunas; corpo de texto em 1 a 2 colunas; citação cruzando a calha.',
    display: { family: 'Playfair Display', weight: 800, fallback: serif },
    text: { family: 'Source Serif 4', weight: 400, fallback: serif },
    googleFamilies: ['Playfair+Display:wght@500;700;800', 'Source+Serif+4:wght@400;600'],
    headlineCase: 'none',
    headlineTracking: -0.01,
    headlineLeading: 1,
    align: 'left',
    palette: { paper: '#fbf8f2', ink: '#141414', accent: '#b4232a', accent2: '#141414', accent3: '#b4232a', image: '#d4cec3', muted: '#7a756d' },
    preferredGrids: ['col-6', 'col-3', 'col-12', 'mod-6x8', 'hierarchical'],
    archetypes: ['editorial', 'fpattern', 'catalog', 'hero'],
    scale: 'perfect-fifth',
    rotation: 0,
    overlap: false,
    rules: true,
    shapes: false,
    colorUse: 0.15,
    whitespace: 0.28,
    balanceOffset: 0.12,
    headlines: ['A Era do Grid', 'O Retorno da Forma', 'Entrevista: o Desenho do Tempo', 'Cidades Invisíveis'],
    kickers: ['Ensaio', 'Cultura', 'Edição de Outono', 'Perfil'],
    quotes: ['“Uma boa página é uma conversa entre imagem e texto.”', '“O leitor entra pela imagem e fica pelo texto.”'],
    references: [
      { title: "Harper's Bazaar", author: 'Alexey Brodovitch', year: '1934–58' },
      { title: 'Twen (revista)', author: 'Willy Fleckhaus', year: '1959–71' },
      { title: 'Interview / Vogue Paris', author: 'Fabien Baron', year: '1980–2000' },
    ],
  },
  {
    id: 'webui',
    name: 'Web moderna / UI (8pt, 12 colunas)',
    era: 'Digital, 2010–hoje',
    masters: ['Material Design (Google)', 'Apple HIG', 'Bootstrap', 'Ethan Marcotte (responsivo)'],
    summary:
      'Sistemas de design para telas: grade de 8pt, 12 colunas fluidas, breakpoints, tokens tipográficos e componentes reutilizáveis. Legibilidade em qualquer tamanho e consistência em escala.',
    principles: [
      'Espaçamentos múltiplos de 8 (4 para ajustes finos)',
      '12 colunas no desktop, 8 no tablet, 4 no mobile',
      'Escala tipográfica modular com tokens',
      'Hierarquia por peso, tamanho e cor de contraste acessível (WCAG)',
      'Conteúdo primeiro, mobile primeiro',
    ],
    typography: 'Grotescas de interface. Aqui: IBM Plex Sans.',
    gridAdvice: 'Use 12 colunas ou a grade 8pt. Componentes ocupam spans de 3, 4, 6 ou 12; o texto corrido não passa de 8 colunas.',
    display: { family: 'IBM Plex Sans', weight: 700, fallback: sans },
    text: { family: 'IBM Plex Sans', weight: 400, fallback: sans },
    googleFamilies: ['IBM+Plex+Sans:wght@400;500;700'],
    headlineCase: 'none',
    headlineTracking: -0.02,
    headlineLeading: 1.05,
    align: 'left',
    palette: { paper: '#ffffff', ink: '#0f172a', accent: '#4f46e5', accent2: '#0ea5e9', accent3: '#10b981', image: '#e2e8f0', muted: '#64748b' },
    preferredGrids: ['col-12', 'eightpt', 'hierarchical', 'col-4', 'col-6'],
    archetypes: ['zpattern', 'fpattern', 'hero', 'catalog'],
    scale: 'major-third',
    rotation: 0,
    overlap: false,
    rules: false,
    shapes: false,
    colorUse: 0.35,
    whitespace: 0.35,
    balanceOffset: 0.08,
    headlines: ['Construa mais rápido', 'Seu produto, em escala', 'Design System 2.0', 'Comece agora'],
    kickers: ['Novo', 'Plataforma', 'Beta', 'Recursos'],
    quotes: ['Consistência é a melhor feature.'],
    references: [
      { title: 'Material Design Guidelines', author: 'Google', year: '2014–hoje' },
      { title: 'Responsive Web Design', author: 'Ethan Marcotte', year: '2010' },
      { title: 'Human Interface Guidelines', author: 'Apple', year: '1987–hoje' },
    ],
  },
  {
    id: 'brutalism',
    name: 'Brutalismo web',
    era: 'Internet, 2014–hoje',
    masters: ['brutalistwebsites.com', 'Experimental Jetset', 'Bloomberg Businessweek (Richard Turley)'],
    summary:
      'Estrutura exposta, cru e honesto: tipografia monoespaçada, bordas visíveis, cores padrão do sistema, blocos que revelam o grid em vez de escondê-lo.',
    principles: [
      'O grid é visível: bordas, filetes e caixas aparentes',
      'Monoespaçadas e fontes do sistema',
      'Cores puras de sistema (azul link, amarelo, preto)',
      'Hierarquia direta e literal',
      'Anti-polimento como posicionamento',
    ],
    typography: 'Monoespaçadas. Aqui: Space Mono.',
    gridAdvice: 'Grade 8pt ou 12 colunas com bordas aparentes; deixe os módulos visíveis e use o contraste de escala bruto.',
    display: { family: 'Space Mono', weight: 700, fallback: mono },
    text: { family: 'Space Mono', weight: 400, fallback: mono },
    googleFamilies: ['Space+Mono:wght@400;700'],
    headlineCase: 'upper',
    headlineTracking: -0.03,
    headlineLeading: 0.95,
    align: 'left',
    palette: { paper: '#f0f0f0', ink: '#000000', accent: '#0000ff', accent2: '#ffff00', accent3: '#ff0000', image: '#bdbdbd', muted: '#555555' },
    preferredGrids: ['eightpt', 'col-12', 'mod-6x8', 'mod-4x6'],
    archetypes: ['mosaic', 'fpattern', 'typoster', 'catalog'],
    scale: 'octave',
    rotation: 0,
    overlap: false,
    rules: true,
    shapes: false,
    colorUse: 0.4,
    whitespace: 0.2,
    balanceOffset: 0.1,
    headlines: ['INDEX.HTML', 'NO STYLE', 'RAW DATA', 'HELLO WORLD'],
    kickers: ['v0.1', 'README', 'localhost'],
    quotes: ['Function over polish.'],
    references: [
      { title: 'Brutalist Websites', author: 'Pascal Deville', year: '2014' },
      { title: 'Bloomberg Businessweek', author: 'Richard Turley', year: '2010–14' },
    ],
  },
  ...BOOK_SCHOOLS(),
];

export const SCHOOLS: School[] = bilingualList(SCHOOLS_PT, SCHOOLS_EN);

function BOOK_SCHOOLS(): School[] {
  const bookArch: ArchetypeId[] = ['chapter', 'sections', 'running', 'figure', 'notes', 'contents', 'titlepage', 'part', 'epigraph'];
  const common = { rotation: 0, overlap: false, rules: false, shapes: false, archetypes: bookArch };
  return [
    {
      ...common,
      id: 'penguin',
      name: 'Clássico moderno (Tschichold / Penguin)',
      era: 'Londres, 1947–1949',
      masters: ['Jan Tschichold', 'Hans Schmoller', 'Allen Lane (editor)'],
      summary:
        'O livro de bolso como obra de precisão: uma família, quase um único corpo, eixo central, versaletes e itálico fazendo toda a hierarquia. Regras escritas para que milhares de títulos saíssem coerentes.',
      principles: [
        'Um só corpo para quase tudo: a hierarquia vem da caixa e do estilo',
        'Eixo central e simetria serena',
        'Primeiras palavras do capítulo em versaletes, sem capitular',
        'Quebra de seção: uma linha em branco',
        'Margens econômicas, mas progressivas',
      ],
      typography: 'Garaldinas e transicionais de texto (Bembo, Baskerville, Garamond). Aqui: Crimson Pro, uma só família.',
      gridAdvice: 'Use o grid de livro comercial em página dupla, com acréscimo para brochura colada. Uma coluna, mancha econômica.',
      display: { family: 'Crimson Pro', weight: 500, fallback: serif },
      text: { family: 'Crimson Pro', weight: 400, fallback: serif },
      googleFamilies: ['Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400'],
      headlineCase: 'upper',
      headlineTracking: 0.1,
      headlineLeading: 1.15,
      align: 'center',
      palette: { paper: '#f7f3ea', ink: '#1e1c1a', accent: '#d9661f', accent2: '#1e1c1a', accent3: '#d9661f', image: '#d8d1c3', muted: '#7b746a' },
      preferredGrids: ['book-trade', 'manuscript', 'book-2col'],
      scale: 'major-third',
      colorUse: 0.05,
      whitespace: 0.3,
      balanceOffset: 0,
      headlines: ['O Desenho do Tempo', 'A Página Silenciosa'],
      kickers: ['Penguin Modern Classics', 'Parte Um'],
      quotes: ['A tipografia perfeita é certamente a mais esquiva de todas as artes.'],
      references: [
        { title: 'Penguin Composition Rules', author: 'Jan Tschichold', year: '1947' },
        { title: 'The Form of the Book', author: 'Jan Tschichold', year: '1975' },
        { title: 'Penguin by Design', author: 'Phil Baines', year: '2005' },
      ],
      book: {
        leadingPt: 13,
        leadRatio: 1.24,
        justify: true,
        paragraph: 'indent',
        dropCap: null,
        leadIn: 'smallcaps',
        chapter: {
          align: 'center',
          sink: 0.3,
          number: 'arabic',
          label: '',
          numberRole: 'text',
          numberScale: 1.6,
          numberCase: 'none',
          numberTracking: 0,
          numberAccent: false,
          titleRole: 'text',
          titleScale: 1,
          titleCase: 'upper',
          titleItalic: false,
          titleTracking: 0.16,
          gap: 1,
        },
        heads: [
          { role: 'text', scale: 1, case: 'upper', tracking: 0.12, align: 'center', before: 2, after: 1 },
          { role: 'text', scale: 1, case: 'smallcaps', tracking: 0.08, align: 'center', before: 1, after: 0 },
          { role: 'text', scale: 1, italic: true, case: 'none', tracking: 0, align: 'left', before: 0, after: 0, runIn: true },
        ],
        runhead: { verso: 'none', recto: 'none', role: 'text', case: 'smallcaps', italic: false, tracking: 0.1, align: 'center' },
        folio: { position: 'foot-center', role: 'text', dropOnOpening: true },
        breakMark: '',
        notes: 'foot',
        epigraph: { align: 'center', prob: 0.3 },
        recipe: {
          fonts: '1 família e praticamente 1 corpo: Crimson Pro em romano, itálico, versaletes e maiúsculas espacejadas.',
          margins: 'Progressão 2:3:4:6 econômica, própria do livro de bolso, com acréscimo de lombada para brochura colada.',
          leading: '10,5/13 pt (124%), justificado.',
          paragraph: 'Recuo de 1 eme; o primeiro parágrafo do capítulo e o que segue uma quebra começam alinhados.',
          opening: 'Rebaixo de cerca de 30%, número em algarismo um pouco maior, título em maiúsculas espacejadas no corpo do texto e primeiras palavras em versaletes. Sem capitular, sem cabeços.',
          hierarchy: 'A: maiúsculas espacejadas. B: versaletes. C: itálico corrido. Três níveis no mesmo corpo, uma variável por nível. Ficção dispensa cabeços: o fólio ao pé basta.',
        },
        masterpieces: [
          { title: 'Penguin Composition Rules', who: 'Jan Tschichold', year: '1947', lesson: 'Quatro páginas de regras que padronizaram recuos, espacejamento das maiúsculas, versaletes e quebras para toda a coleção.' },
          { title: 'Penguin Classics e Penguin Shakespeare', who: 'Jan Tschichold, redesenho', year: '1947–1949', lesson: 'Hierarquia com um corpo só: o leitor sente a ordem sem perceber os estilos.' },
        ],
      },
    },
    {
      ...common,
      id: 'privatepress',
      name: 'Private press (Morris / Doves / Gill)',
      era: 'Inglaterra, 1891–1931',
      masters: ['William Morris', 'T. J. Cobden-Sanderson', 'Emery Walker', 'Eric Gill'],
      summary:
        'A reação artesanal ao livro industrial: página densa e escura, margens que crescem 20% de uma para a outra, iniciais vermelhas e caldeirões no lugar do recuo. A hierarquia vem da cor (a rubrica) e do tamanho da inicial.',
      principles: [
        'A unidade é a página dupla (Morris)',
        'Margens na razão 1 : 1,2 : 1,44 : 1,73',
        'Mancha densa, entrelinha apertada, cor tipográfica escura',
        'Rubricação: iniciais, títulos e sinais em vermelho',
        'Parágrafos contínuos marcados por ¶ (Gill)',
      ],
      typography: 'Romanas venezianas de traço pesado (Golden Type, Doves Type). Aqui: Alegreya em peso médio.',
      gridAdvice: 'Use o grid de Morris em página dupla. Uma coluna larga e densa; a margem inferior é a maior.',
      display: { family: 'Alegreya', weight: 800, fallback: serif },
      text: { family: 'Alegreya', weight: 500, fallback: serif },
      googleFamilies: ['Alegreya:ital,wght@0,500;0,700;0,800;1,500'],
      headlineCase: 'upper',
      headlineTracking: 0.06,
      headlineLeading: 1.1,
      align: 'center',
      palette: { paper: '#f3ead6', ink: '#1b1714', accent: '#a3201a', accent2: '#1b1714', accent3: '#a3201a', image: '#d6c9ad', muted: '#7a6c58' },
      preferredGrids: ['book-morris', 'manuscript', 'book-2col'],
      scale: 'perfect-fourth',
      colorUse: 0.4,
      whitespace: 0.2,
      balanceOffset: 0,
      headlines: ['Memórias da Prancheta', 'O Livro Inacabado'],
      kickers: ['Kelmscott', 'Livro Primeiro'],
      quotes: ['A unidade do livro não é a página, mas o par de páginas.'],
      references: [
        { title: 'The Ideal Book', author: 'William Morris', year: '1893' },
        { title: 'The Book Beautiful', author: 'T. J. Cobden-Sanderson', year: '1902' },
        { title: 'An Essay on Typography', author: 'Eric Gill', year: '1931' },
      ],
      book: {
        leadingPt: 13.5,
        leadRatio: 1.16,
        justify: true,
        paragraph: 'pilcrow',
        dropCap: { lines: 4, role: 'display', accent: true },
        leadIn: 'none',
        chapter: {
          align: 'center',
          sink: 0.12,
          number: 'word',
          label: 'Capítulo',
          numberRole: 'text',
          numberScale: 1,
          numberCase: 'upper',
          numberTracking: 0.1,
          numberAccent: true,
          titleRole: 'display',
          titleScale: 1.5,
          titleWeight: 800,
          titleCase: 'upper',
          titleItalic: false,
          titleTracking: 0.04,
          gap: 0,
          ornament: '❧',
        },
        heads: [
          { role: 'display', scale: 1.2, weight: 800, case: 'upper', tracking: 0.06, align: 'center', before: 1, after: 0, accent: true },
          { role: 'text', scale: 1, italic: true, case: 'none', tracking: 0, align: 'center', before: 1, after: 0, accent: true },
          { role: 'text', scale: 1, weight: 700, case: 'upper', tracking: 0.04, align: 'left', before: 0, after: 0, runIn: true, accent: true },
        ],
        runhead: { verso: 'none', recto: 'none', role: 'text', case: 'upper', italic: false, tracking: 0.1, align: 'center' },
        folio: { position: 'foot-center', role: 'text', dropOnOpening: false },
        breakMark: '❧',
        notes: 'foot',
        epigraph: { align: 'center', prob: 0.2 },
        recipe: {
          fonts: '1 família em peso médio: Alegreya para o texto, negrito pesado para títulos e o vermelho para tudo o que organiza.',
          margins: 'Morris: cada margem 20% maior que a anterior, de dentro para cima, para fora e para baixo (1 : 1,2 : 1,44 : 1,73).',
          leading: '11,6/13,5 pt (116%): denso de propósito, para uma página escura e uniforme.',
          paragraph: 'Parágrafos contínuos separados por caldeirões ¶ vermelhos, sem recuo e sem mudar de linha.',
          opening: 'Rebaixo mínimo, capítulo por extenso em vermelho, título em maiúsculas pesadas, vinheta ❧ e inicial vermelha de 4 linhas.',
          hierarchy: 'A hierarquia é cromática: vermelho para títulos, iniciais e sinais; preto para o texto. O tamanho só muda na inicial e no título A.',
        },
        masterpieces: [
          { title: 'Kelmscott Chaucer', who: 'William Morris e Edward Burne-Jones', year: '1896', lesson: 'A página dupla como unidade, margens progressivas e ornamento integrado ao texto.' },
          { title: 'Doves Bible', who: 'T. J. Cobden-Sanderson e Emery Walker', year: '1903–1905', lesson: 'Nenhum ornamento: só tipo bem composto e iniciais vermelhas. A prova de que a hierarquia pode vir da cor.' },
          { title: 'An Essay on Typography', who: 'Eric Gill', year: '1931', lesson: 'Parágrafos marcados por caldeirões ¶ dentro da mancha, sem recuo nem linha nova.' },
        ],
      },
    },
    {
      ...common,
      id: 'hochuli',
      name: 'Livro assimétrico suíço (Hochuli)',
      era: 'St. Gallen e Zurique, 1930–hoje',
      masters: ['Jost Hochuli', 'Jan Tschichold (anos 1930)', 'Max Caflisch', 'Robin Kinross'],
      summary:
        'O livro moderno sem eixo central: texto alinhado à esquerda, títulos em grotesca, margem externa larga para notas e números. A ordem vem da posição e do alinhamento, não da simetria.',
      principles: [
        'Assimetria funcional: o eixo é a margem esquerda do texto',
        'Alinhado à esquerda, sem justificar, com bandeira regular',
        'Duas famílias com papéis distintos: serifa para ler, grotesca para orientar',
        'Coluna de notas na margem externa',
        'Cabeço e fólio juntos no alto da página, no canto externo',
      ],
      typography: 'Serifa de texto com grotesca para títulos e paratexto. Aqui: Literata e Instrument Sans.',
      gridAdvice: 'Use o manuscrito com coluna de notas em página dupla: a coluna estreita fica na margem externa de cada página.',
      display: { family: 'Instrument Sans', weight: 600, fallback: sans },
      text: { family: 'Literata', weight: 400, fallback: serif },
      para: { family: 'Instrument Sans', weight: 400, fallback: sans },
      googleFamilies: ['Literata:ital,wght@0,400;0,600;1,400', 'Instrument+Sans:wght@400;600;700'],
      headlineCase: 'none',
      headlineTracking: 0,
      headlineLeading: 1.1,
      align: 'left',
      palette: { paper: '#f6f5f0', ink: '#1a1a1a', accent: '#d0021b', accent2: '#1a1a1a', accent3: '#d0021b', image: '#d6d4cc', muted: '#777777' },
      preferredGrids: ['manuscript-notes', 'book-trade', 'book-2col'],
      scale: 'perfect-fourth',
      colorUse: 0.15,
      whitespace: 0.35,
      balanceOffset: 0.12,
      headlines: ['Tratado da Forma Breve', 'A Página Silenciosa'],
      kickers: ['Edition Ostschweiz', 'Typotron'],
      quotes: ['Simetria e assimetria são escolhas de função, não de ideologia.'],
      references: [
        { title: 'Designing Books: Practice and Theory', author: 'Jost Hochuli e Robin Kinross', year: '1996' },
        { title: 'O detalhe na tipografia', author: 'Jost Hochuli', year: '1987' },
        { title: 'Typographische Gestaltung', author: 'Jan Tschichold', year: '1935' },
      ],
      book: {
        leadingPt: 14,
        leadRatio: 1.4,
        justify: false,
        paragraph: 'indent',
        dropCap: null,
        leadIn: 'none',
        chapter: {
          align: 'left',
          sink: 1 / 3,
          number: 'arabic',
          label: '',
          numberRole: 'display',
          numberScale: 2.4,
          numberCase: 'none',
          numberTracking: 0,
          numberAccent: true,
          titleRole: 'display',
          titleScale: 1.6,
          titleWeight: 600,
          titleCase: 'none',
          titleItalic: false,
          titleTracking: -0.01,
          gap: 1,
        },
        heads: [
          { role: 'display', scale: 1.2, weight: 600, case: 'none', tracking: 0, align: 'left', before: 2, after: 1, numbered: true },
          { role: 'display', scale: 1, weight: 600, case: 'none', tracking: 0, align: 'left', before: 1, after: 0, numbered: true },
          { role: 'display', scale: 0.92, weight: 600, case: 'none', tracking: 0, align: 'left', before: 0, after: 0, runIn: true },
        ],
        runhead: { verso: 'book', recto: 'chapter', role: 'para', case: 'none', italic: false, tracking: 0.02, align: 'outer' },
        folio: { position: 'head-outer', role: 'para', dropOnOpening: false },
        breakMark: '',
        notes: 'side',
        epigraph: { align: 'left', prob: 0.35 },
        recipe: {
          fonts: '2 famílias: Literata para o texto e Instrument Sans para títulos, números, cabeços e notas. Contraste de estrutura (serifa × grotesca) com alturas de x parecidas.',
          margins: 'Assimétricas: interna estreita e externa larga, que abriga a coluna de notas.',
          leading: '10/14 pt (140%): mais ar porque o texto não é justificado.',
          paragraph: 'Recuo de 1 eme, alinhado à esquerda com bandeira e sem hifenização excessiva.',
          opening: 'Rebaixo de 1/3, número grande em vermelho na grotesca e título alinhado à esquerda. Sem capitular, sem ornamento.',
          hierarchy: 'Títulos numerados em grotesca seminegrita: A maior e com 2 linhas antes, B no corpo do texto, C corrido. O alinhamento à esquerda é constante; mudam só o tamanho e o espaço.',
        },
        masterpieces: [
          { title: 'Edition Typotron e Edition Ostschweiz', who: 'Jost Hochuli', year: '1983–2010', lesson: 'Livros pequenos com assimetria precisa: cada página resolve a relação entre texto, nota e imagem pelo alinhamento.' },
          { title: 'Designing Books: Practice and Theory', who: 'Jost Hochuli e Robin Kinross', year: '1996', lesson: 'Defende que simetria e assimetria são escolhas funcionais, decididas pelo conteúdo.' },
          { title: 'Typographische Gestaltung', who: 'Jan Tschichold', year: '1935', lesson: 'A tipografia assimétrica aplicada ao livro, antes de Tschichold voltar ao clássico.' },
        ],
      },
    },
    {
      ...common,
      id: 'contemporary',
      name: 'Literatura contemporânea (3 estilos)',
      era: 'Brasil e mundo, 1990–hoje',
      masters: ['Elaine Ramos', 'Raul Loureiro', 'Victor Burton', 'Richard Hendel'],
      summary:
        'O livro de ficção e ensaio de hoje: uma display expressiva nas aberturas, uma serifa de texto confortável e uma sem serifa discreta para o paratexto. O número do capítulo vira imagem.',
      principles: [
        'Três estilos, três papéis: display, texto e paratexto',
        'Aberturas como pequenos cartazes; miolo silencioso',
        'Epígrafes e números como elementos gráficos',
        'Margens comerciais com acréscimo de lombada',
        'Fólios e cabeços na sem serifa, discretos',
      ],
      typography: 'Display serifada de alto contraste, serifa de texto e grotesca pequena. Aqui: Fraunces, Newsreader e Inter.',
      gridAdvice: 'Use o grid de livro comercial em página dupla com brochura colada. As aberturas usam o rebaixo como palco.',
      display: { family: 'Fraunces', weight: 600, fallback: serif },
      text: { family: 'Newsreader', weight: 400, fallback: serif },
      para: { family: 'Inter', weight: 500, fallback: sans },
      googleFamilies: ['Fraunces:ital,wght@0,400;0,600;0,800;1,400', 'Newsreader:ital,wght@0,400;0,600;1,400', 'Inter:wght@400;500;600'],
      headlineCase: 'none',
      headlineTracking: -0.01,
      headlineLeading: 1.05,
      align: 'left',
      palette: { paper: '#fbf9f4', ink: '#1c1b19', accent: '#c2410c', accent2: '#1c1b19', accent3: '#c2410c', image: '#dcd6cb', muted: '#78736b' },
      preferredGrids: ['book-trade', 'manuscript', 'manuscript-notes'],
      scale: 'perfect-fifth',
      colorUse: 0.2,
      whitespace: 0.35,
      balanceOffset: 0.1,
      headlines: ['O Livro Inacabado', 'Memórias da Prancheta'],
      kickers: ['Romance', 'Ensaios'],
      quotes: ['O designer de livros serve ao texto.'],
      references: [
        { title: 'On Book Design', author: 'Richard Hendel', year: '1998' },
        { title: 'Book Design', author: 'Andrew Haslam', year: '2006' },
        { title: 'Edições Cosac Naify', author: 'direção de arte de Elaine Ramos', year: '2000–2015' },
      ],
      book: {
        leadingPt: 14.5,
        leadRatio: 1.42,
        justify: true,
        paragraph: 'indent',
        dropCap: null,
        leadIn: 'smallcaps',
        chapter: {
          align: 'left',
          sink: 0.28,
          number: 'arabic',
          label: '',
          numberRole: 'display',
          numberScale: 6,
          numberCase: 'none',
          numberTracking: -0.02,
          numberAccent: true,
          titleRole: 'display',
          titleScale: 1.9,
          titleWeight: 400,
          titleCase: 'none',
          titleItalic: true,
          titleTracking: -0.01,
          gap: 1,
        },
        heads: [
          { role: 'display', scale: 1.45, weight: 600, case: 'none', tracking: -0.01, align: 'left', before: 2, after: 1 },
          { role: 'text', scale: 1, italic: true, case: 'none', tracking: 0, align: 'left', before: 1, after: 0 },
          { role: 'para', scale: 0.82, weight: 600, case: 'upper', tracking: 0.08, align: 'left', before: 0, after: 0, runIn: true },
        ],
        runhead: { verso: 'author', recto: 'book', role: 'para', case: 'upper', italic: false, tracking: 0.12, align: 'center' },
        folio: { position: 'foot-outer', role: 'para', dropOnOpening: false },
        breakMark: '* * *',
        notes: 'foot',
        epigraph: { align: 'right', prob: 0.7 },
        recipe: {
          fonts: '3 estilos com papéis fixos: Fraunces (display) nas aberturas e nos títulos A, Newsreader no texto e nos títulos B, Inter no paratexto: cabeços, fólios, notas e títulos C.',
          margins: 'Comerciais e progressivas (2:3:4:6 econômica), com acréscimo para brochura colada.',
          leading: '10,2/14,5 pt (142%), justificado.',
          paragraph: 'Recuo de 1 eme; primeiro parágrafo alinhado, com as primeiras palavras em versaletes.',
          opening: 'Número enorme em laranja como imagem, título em display itálica e epígrafe alinhada à direita.',
          hierarchy: 'Cada nível troca de família: A na display, B no itálico do texto, C na sem serifa em maiúsculas pequenas. Com três famílias, cada uma precisa de um único papel.',
        },
        masterpieces: [
          { title: 'Edições da Cosac Naify', who: 'direção de arte de Elaine Ramos', year: '2000–2015', lesson: 'Um projeto para cada título, com aberturas gráficas e miolo rigoroso: o livro como objeto.' },
          { title: 'On Book Design', who: 'Richard Hendel', year: '1998', lesson: 'O designer de livros serve ao texto: cada obra pede sua própria solução, sem fórmula.' },
          { title: 'Book Design', who: 'Andrew Haslam', year: '2006', lesson: 'Manual das convenções do livro: grids, margens, hierarquia e produção.' },
        ],
      },
    },
    {
      ...common,
      id: 'technical',
      name: 'Livro técnico e didático (Tufte)',
      era: 'EUA e Europa, 1983–hoje',
      masters: ['Edward Tufte', 'Robert Bringhurst', 'Ellen Lupton'],
      summary:
        'O livro que ensina: seções numeradas, notas laterais junto do argumento, figuras com legendas na margem. Uma superfamília dá três estilos coerentes para texto, títulos e dados.',
      principles: [
        'Seções numeradas (3, 3.1, 3.1.1) para referência cruzada',
        'Notas e legendas na margem, ao lado do texto (Tufte)',
        'Superfamília: serifa, sem serifa e mono com o mesmo desenho de base',
        'Alinhado à esquerda e parágrafos separados por espaço',
        'Figuras integradas ao fluxo do texto',
      ],
      typography: 'Superfamília Source: Source Serif 4 (texto), Source Sans 3 (títulos) e Source Code Pro (números e dados).',
      gridAdvice: 'Use o manuscrito com coluna de notas: a coluna larga recebe o texto, a estreita recebe notas laterais e legendas.',
      display: { family: 'Source Sans 3', weight: 600, fallback: sans },
      text: { family: 'Source Serif 4', weight: 400, fallback: serif },
      para: { family: 'Source Code Pro', weight: 400, fallback: mono },
      googleFamilies: ['Source+Serif+4:ital,wght@0,400;0,600;1,400', 'Source+Sans+3:wght@400;600;700', 'Source+Code+Pro:wght@400;500'],
      headlineCase: 'none',
      headlineTracking: -0.01,
      headlineLeading: 1.1,
      align: 'left',
      palette: { paper: '#fdfdfb', ink: '#202124', accent: '#1a5fb4', accent2: '#202124', accent3: '#1a5fb4', image: '#dfe2e6', muted: '#6b7078' },
      preferredGrids: ['manuscript-notes', 'book-2col', 'book-trade'],
      scale: 'major-third',
      colorUse: 0.2,
      whitespace: 0.3,
      balanceOffset: 0.12,
      headlines: ['Tratado da Forma Breve', 'O Desenho do Tempo'],
      kickers: ['Manual', 'Volume 1'],
      quotes: ['Acima de tudo, mostre os dados.'],
      references: [
        { title: 'The Visual Display of Quantitative Information', author: 'Edward Tufte', year: '1983' },
        { title: 'Envisioning Information', author: 'Edward Tufte', year: '1990' },
        { title: 'Pensar com tipos', author: 'Ellen Lupton', year: '2004' },
      ],
      book: {
        leadingPt: 13,
        leadRatio: 1.35,
        justify: false,
        paragraph: 'space',
        dropCap: null,
        leadIn: 'none',
        chapter: {
          align: 'left',
          sink: 0.25,
          number: 'arabic',
          label: 'Capítulo',
          numberRole: 'para',
          numberScale: 0.9,
          numberCase: 'upper',
          numberTracking: 0.1,
          numberAccent: true,
          titleRole: 'display',
          titleScale: 2,
          titleWeight: 600,
          titleCase: 'none',
          titleItalic: false,
          titleTracking: -0.01,
          gap: 0,
        },
        heads: [
          { role: 'display', scale: 1.3, weight: 600, case: 'none', tracking: 0, align: 'left', before: 2, after: 1, numbered: true },
          { role: 'display', scale: 1.05, weight: 600, case: 'none', tracking: 0, align: 'left', before: 1, after: 0, numbered: true },
          { role: 'display', scale: 0.95, weight: 700, case: 'none', tracking: 0, align: 'left', before: 0, after: 0, runIn: true },
        ],
        runhead: { verso: 'book', recto: 'chapter', role: 'para', case: 'none', italic: false, tracking: 0, align: 'outer' },
        folio: { position: 'head-outer', role: 'para', dropOnOpening: false },
        breakMark: '',
        notes: 'side',
        epigraph: { align: 'left', prob: 0.2 },
        recipe: {
          fonts: '3 estilos de uma superfamília: Source Serif 4 para ler, Source Sans 3 para títulos e legendas, Source Code Pro para números de seção, fólios e dados. O desenho comum garante a harmonia.',
          margins: 'Assimétricas, com uma coluna larga de notas na margem externa para notas laterais e legendas.',
          leading: '9,6/13 pt (135%), alinhado à esquerda.',
          paragraph: 'Parágrafos separados por uma linha em branco, sem recuo: favorece a consulta e a leitura não linear.',
          opening: 'Rótulo “Capítulo 3” em mono azul, título grande na sem serifa e rebaixo de 1/4.',
          hierarchy: 'Numeração decimal (3.1, 3.1.1) na sem serifa seminegrita: o número carrega a hierarquia e o tamanho só a confirma.',
        },
        masterpieces: [
          { title: 'The Visual Display of Quantitative Information', who: 'Edward Tufte', year: '1983', lesson: 'Notas laterais e figuras ao lado do argumento: o leitor não precisa virar a página para ver a evidência.' },
          { title: 'Elementos do estilo tipográfico', who: 'Robert Bringhurst', year: '1992', lesson: 'Seções numeradas e notas na margem larga: o próprio livro demonstra o que ensina.' },
          { title: 'Pensar com tipos', who: 'Ellen Lupton', year: '2004', lesson: 'Didática visual: cada regra vem acompanhada do exemplo composto.' },
        ],
      },
    },
  ];
}

export const getSchool = (id: string) => SCHOOLS.find((s) => s.id === id) ?? SCHOOLS[0];
export const isBookSchool = (s: School) => !!s.book;
export const paraFont = (s: School) => s.para ?? s.text;

export const fontStack = (f: FontSpec) => `'${f.family}', ${f.fallback}`;

const loaded = new Set<string>();

/** Injects the Google Fonts stylesheet for a school (once). Resolves when faces are ready. */
export async function loadSchoolFonts(s: School): Promise<void> {
  if (typeof document === 'undefined') return;
  if (!loaded.has(s.id)) {
    loaded.add(s.id);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = googleFontsUrl(s);
    document.head.appendChild(link);
    await new Promise<void>((res) => {
      link.onload = () => res();
      link.onerror = () => res();
    });
  }
  try {
    await Promise.all([
      document.fonts.load(`${s.display.weight} 32px '${s.display.family}'`),
      document.fonts.load(`${s.text.weight} 16px '${s.text.family}'`),
      document.fonts.load(`700 16px '${s.text.family}'`),
      document.fonts.load(`italic ${s.text.weight} 16px '${s.text.family}'`),
      ...(s.para ? [document.fonts.load(`${s.para.weight} 16px '${s.para.family}'`)] : []),
    ]);
  } catch {
    /* offline: fallbacks are used */
  }
}

export const googleFontsUrl = (s: School) =>
  `https://fonts.googleapis.com/css2?${s.googleFamilies.map((f) => `family=${f}`).join('&')}&display=swap`;

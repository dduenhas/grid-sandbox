import type { GridTypeId } from '../core/gridEngine';

export type ArchetypeId =
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
}

const sans = 'Helvetica Neue, Arial, sans-serif';
const serif = 'Georgia, Times New Roman, serif';
const mono = 'Courier New, monospace';

export const SCHOOLS: School[] = [
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
    name: 'Clássico / livro renascentista',
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
    googleFamilies: ['EB+Garamond:ital,wght@0,400;0,500;0,700;1,400'],
    headlineCase: 'upper',
    headlineTracking: 0.08,
    headlineLeading: 1.1,
    align: 'center',
    palette: { paper: '#f5efe1', ink: '#2a2622', accent: '#8b1e1e', accent2: '#2a2622', accent3: '#8b1e1e', image: '#d9cfb9', muted: '#7d7263' },
    preferredGrids: ['manuscript', 'manuscript-notes', 'col-2', 'golden'],
    archetypes: ['classical', 'editorial'],
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
    ],
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
];

export const getSchool = (id: string) => SCHOOLS.find((s) => s.id === id) ?? SCHOOLS[0];

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
    ]);
  } catch {
    /* offline: fallbacks are used */
  }
}

export const googleFontsUrl = (s: School) =>
  `https://fonts.googleapis.com/css2?${s.googleFamilies.map((f) => `family=${f}`).join('&')}&display=swap`;

import type { PlaceholderLang } from './placeholders';

/* ---------------- Book style: the recipe each book school carries ---------------- */

export type FontRole = 'display' | 'text' | 'para';
export type CaseStyle = 'none' | 'upper' | 'smallcaps';

export interface HeadStyle {
  role: FontRole;
  /** Size as a multiple of the body size. */
  scale: number;
  weight?: number;
  italic?: boolean;
  case: CaseStyle;
  /** Letterspacing in em. */
  tracking: number;
  align: 'left' | 'center';
  /** Blank lines above and below. Head + space always add up to whole lines (register). */
  before: number;
  after: number;
  /** Run-in head: starts the paragraph on the same line. */
  runIn?: boolean;
  numbered?: boolean;
  accent?: boolean;
}

export interface BookStyle {
  /** Leading of the running text at 16×23 cm, in points. */
  leadingPt: number;
  /** Leading ÷ body size (1.2–1.45 for continuous reading). */
  leadRatio: number;
  justify: boolean;
  paragraph: 'indent' | 'space' | 'pilcrow';
  dropCap: { lines: number; role: FontRole; accent: boolean } | null;
  leadIn: 'smallcaps' | 'none';
  chapter: {
    align: 'left' | 'center';
    /** Share of the text block left empty above the chapter head (rebaixo). */
    sink: number;
    number: 'roman' | 'arabic' | 'word';
    label: string;
    numberRole: FontRole;
    numberScale: number;
    numberCase: CaseStyle;
    numberTracking: number;
    numberAccent: boolean;
    numberItalic?: boolean;
    titleRole: FontRole;
    titleScale: number;
    titleWeight?: number;
    titleCase: CaseStyle;
    titleItalic: boolean;
    titleTracking: number;
    /** Blank lines between number and title. */
    gap: number;
    ornament?: string;
  };
  /** Section heads A, B and C (C is usually run-in). */
  heads: [HeadStyle, HeadStyle, HeadStyle];
  runhead: { verso: 'book' | 'author' | 'none'; recto: 'chapter' | 'book' | 'none'; role: FontRole; case: CaseStyle; italic: boolean; tracking: number; align: 'center' | 'outer' };
  folio: { position: 'foot-center' | 'foot-outer' | 'head-outer'; role: FontRole; dropOnOpening: boolean };
  /** Mark set in the blank line of a section break ('' = space only). */
  breakMark: string;
  notes: 'foot' | 'side';
  epigraph: { align: 'left' | 'right' | 'center'; prob: number };
  recipe: {
    fonts: string;
    margins: string;
    leading: string;
    paragraph: string;
    opening: string;
    hierarchy: string;
  };
  masterpieces: { title: string; who: string; year: string; lesson: string }[];
}

/* ---------------- Binding ---------------- */

export type BindingId = 'none' | 'sewn' | 'perfect' | 'wire';

export const BINDINGS: { id: BindingId; name: string; mm: number; note: string }[] = [
  { id: 'none', name: 'Sem acréscimo', mm: 0, note: 'Margem interna como desenhada. Bom para estudar o cânone puro.' },
  { id: 'sewn', name: 'Costurada', mm: 2, note: 'Cadernos costurados abrem quase planos: basta um pequeno acréscimo na medianiz.' },
  { id: 'perfect', name: 'Brochura colada', mm: 5, note: 'Lombada colada (hot melt ou PUR) não abre por inteiro: some 3 a 6 mm, mais em livros grossos.' },
  { id: 'wire', name: 'Wire-o / espiral', mm: 10, note: 'A furação come a margem: reserve 8 a 12 mm além da margem desenhada.' },
];

export const bindingOf = (id: BindingId) => BINDINGS.find((b) => b.id === id) ?? BINDINGS[0];

/* ---------------- Page types (book archetypes) ---------------- */

export type BookArchetypeId = 'chapter' | 'sections' | 'running' | 'figure' | 'notes' | 'contents' | 'titlepage' | 'part' | 'epigraph';

export interface PageType {
  id: BookArchetypeId;
  name: string;
  description: string;
  rules: string[];
}

export const PAGE_TYPES: PageType[] = [
  {
    id: 'chapter',
    name: 'Abertura de capítulo',
    description: 'O capítulo começa com rebaixo: o título desce pela mancha e o vazio acima anuncia o recomeço. Capitular ou versaletes conduzem o olho para a primeira linha.',
    rules: [
      'Rebaixo de cerca de 1/3 da mancha, sempre em linhas inteiras',
      'Sem cabeço; o fólio desce para o pé ou desaparece',
      'Primeiro parágrafo sem recuo; capitular alinhada à altura das maiúsculas e à linha de base',
      'Em livros clássicos o capítulo abre em página ímpar (à direita)',
    ],
  },
  {
    id: 'sections',
    name: 'Seções e intertítulos',
    description: 'A página mostra os três níveis de hierarquia (A, B e C) dentro do texto corrido. Cada nível muda uma variável e ocupa um número inteiro de linhas.',
    rules: [
      'Espaço antes maior que o espaço depois: o título pertence ao texto que vem a seguir',
      'Nunca deixe um intertítulo no pé da página sem pelo menos duas linhas de texto',
      'O parágrafo após um intertítulo começa sem recuo',
      'Três níveis bastam; mais que isso pede reorganizar o texto, não mais estilos',
    ],
  },
  {
    id: 'running',
    name: 'Texto corrido',
    description: 'A página comum do livro: só texto, cabeços e fólios. É aqui que se julga a cor tipográfica, a medida e a entrelinha.',
    rules: [
      'Linhas registradas: as linhas das duas páginas se alinham e coincidem frente e verso',
      'Quebra de seção: uma linha em branco, com ou sem ornamento',
      'Evite viúvas (última linha de parágrafo no topo da página) e órfãs (primeira linha no pé)',
    ],
  },
  {
    id: 'figure',
    name: 'Texto com figura',
    description: 'Pouca imagem em livro de texto: a figura entra na largura da mancha, com legenda curta, e o texto continua acima e abaixo.',
    rules: [
      'A figura ocupa um número inteiro de linhas, para o texto abaixo voltar ao registro',
      'Legenda em corpo menor, colada à figura, ou na coluna de notas',
      'Prefira figuras no alto ou no pé da página, não no meio de um parágrafo',
    ],
  },
  {
    id: 'notes',
    name: 'Texto com notas',
    description: 'Notas de rodapé no pé da mancha ou notas laterais na margem. As chamadas são algarismos sobrescritos depois da pontuação.',
    rules: [
      'Notas em corpo menor, separadas do texto por um filete curto ou por espaço',
      'Notas laterais alinhadas à linha do texto a que se referem (Tufte)',
      'A numeração recomeça a cada capítulo em livros longos',
    ],
  },
  {
    id: 'contents',
    name: 'Sumário',
    description: 'O mapa do livro. Os títulos e os números de página precisam ser fáceis de associar sem pontilhados longos.',
    rules: [
      'Mantenha os números perto dos títulos ou alinhados à direita, sem linhas pontilhadas extensas',
      'Use os mesmos estilos da hierarquia do miolo, em escala menor',
      'Segundo a NBR 6027, o sumário reproduz os títulos como aparecem no texto',
    ],
  },
  {
    id: 'titlepage',
    name: 'Folha de rosto',
    description: 'Autor, título, subtítulo e editora em hierarquia calma. O verso traz créditos, ficha catalográfica e colofão.',
    rules: [
      'O título fica acima do centro óptico, não no centro geométrico',
      'Poucos tamanhos: o título cresce, o resto fica próximo do corpo do texto',
      'A NBR 6029 define a ordem dos elementos pré-textuais',
    ],
  },
  {
    id: 'part',
    name: 'Página de parte',
    description: 'Divide o livro em grandes blocos. Sozinha na página ímpar, com o verso em branco, funciona como uma pausa.',
    rules: ['Mesma família e alinhamento das aberturas de capítulo', 'Sem cabeço nem fólio impresso (o número conta, mas não aparece)'],
  },
  {
    id: 'epigraph',
    name: 'Dedicatória e epígrafe',
    description: 'Páginas de respiro antes do texto. Pouca tinta, muito branco, posição alta na página.',
    rules: ['Dedicatória em itálico ou versaletes, curta', 'Epígrafe estreita, com a autoria em versaletes abaixo'],
  },
];

export const pageType = (id: string) => PAGE_TYPES.find((p) => p.id === id);
export const isBookArchetype = (id: string): id is BookArchetypeId => PAGE_TYPES.some((p) => p.id === id);

/* ---------------- Theory ---------------- */

export const BOOK_PRINCIPLES: { title: string; text: string; source: string }[] = [
  {
    title: 'A unidade é a página dupla',
    text: 'O leitor vê sempre duas páginas. Margens, mancha e alinhamentos se julgam no par, e por isso a margem interna é a menor: as duas internas somadas formam a medianiz.',
    source: 'William Morris, The Ideal Book (1893); Jan Tschichold, A forma do livro',
  },
  {
    title: 'Margens progressivas',
    text: 'Interna < superior < externa < inferior. A mancha parece assentada e não “cai” da página. O cânone de Van de Graaf dá 2:3:4:6 numa página 2:3; Morris aumentava cada margem em 20%.',
    source: 'Van de Graaf (1946), Tschichold, Morris',
  },
  {
    title: 'Medida, corpo e entrelinha',
    text: 'Entre 45 e 75 caracteres por linha, idealmente 60–70 em livro de coluna única. Corpo de 10 a 12 pt e entrelinha de 120% a 145% do corpo; linhas mais longas pedem mais entrelinha.',
    source: 'Robert Bringhurst, Elementos do estilo tipográfico, cap. 2',
  },
  {
    title: 'Registro',
    text: 'Todo espaço vertical é múltiplo da entrelinha: intertítulos, quebras, rebaixos e figuras. Assim as linhas das duas páginas se alinham e coincidem frente e verso, sem a sombra do verso aparecer entre linhas.',
    source: 'Bringhurst: “acrescente e retire espaço vertical em intervalos medidos”',
  },
  {
    title: 'Hierarquia com economia',
    text: 'Cada nível muda uma variável de cada vez: posição, caixa, estilo, peso ou tamanho. Use o menor número de níveis que o texto pede, e mais espaço antes do título que depois dele.',
    source: 'Tschichold, Penguin Composition Rules (1947); Bringhurst, cap. 4',
  },
  {
    title: 'Combinar fontes',
    text: 'Uma família completa (romano, itálico, versaletes) já dá quatro ou cinco níveis. Duas famílias pedem contraste de estrutura (serifa × sem serifa) com proporções parecidas. Três estilos só com papéis claros: títulos, texto e paratexto.',
    source: 'Bringhurst, cap. 6; Ellen Lupton, Pensar com tipos',
  },
  {
    title: 'O parágrafo',
    text: 'Marque o parágrafo de um jeito só: recuo de 1 eme, linha em branco ou caldeirão (¶). Não recue o primeiro parágrafo depois de um título ou de uma quebra.',
    source: 'Bringhurst, 2.3; Eric Gill, An Essay on Typography (1931)',
  },
  {
    title: 'Ímpar à direita',
    text: 'Páginas ímpares (recto) ficam à direita. Aberturas de capítulo e partes nobres abrem na ímpar. Cabeços: título do livro no verso, título do capítulo no recto.',
    source: 'Tradição editorial; ABNT NBR 6029',
  },
];

export const BOOK_CONCEPTS: { id: string; term: string; def: string }[] = [
  { id: 'recto', term: 'Recto e verso', def: 'Recto é a página ímpar, à direita; verso é a par, à esquerda. Capítulos clássicos abrem no recto.' },
  { id: 'medianiz', term: 'Medianiz e lombada', def: 'Medianiz é o branco entre as duas manchas da página dupla. A encadernação consome parte dela; por isso se soma um acréscimo à margem interna.' },
  { id: 'rebaixo', term: 'Rebaixo (afundamento)', def: 'Espaço em branco acima do título na abertura do capítulo, normalmente cerca de 1/3 da mancha.' },
  { id: 'capitular', term: 'Capitular', def: 'Letra inicial ampliada que ocupa duas a quatro linhas. Seu topo alinha com a altura das maiúsculas da primeira linha e sua base com uma linha de base.' },
  { id: 'versalete', term: 'Versalete (small caps)', def: 'Maiúsculas desenhadas na altura das minúsculas. Usadas em siglas, cabeços e nas primeiras palavras do capítulo.' },
  { id: 'cabeco', term: 'Cabeço (título corrente)', def: 'Linha no alto da página com o título do livro ou do capítulo. Some nas aberturas e em páginas em branco.' },
  { id: 'folio', term: 'Fólio', def: 'Número da página. No canto externo, ajuda a folhear; ao pé e centralizado, é mais discreto.' },
  { id: 'registro', term: 'Registro', def: 'Coincidência das linhas de base entre colunas, entre as páginas do par e entre frente e verso da folha.' },
  { id: 'viuva', term: 'Viúva e órfã', def: 'Viúva: última linha de um parágrafo isolada no topo da página. Órfã: primeira linha isolada no pé. Ambas quebram o bloco.' },
  { id: 'recuo', term: 'Recuo de parágrafo', def: 'Entrada da primeira linha, geralmente 1 eme (o corpo da fonte). Não se usa junto com espaço entre parágrafos.' },
  { id: 'runin', term: 'Título corrido (run-in)', def: 'Intertítulo que inicia o parágrafo na mesma linha, em itálico ou versaletes. Hierarquia sem gastar espaço vertical.' },
  { id: 'cor', term: 'Cor tipográfica', def: 'Densidade de cinza da mancha de texto. Deve ser uniforme: sem rios, buracos ou linhas mais escuras.' },
  { id: 'pretextuais', term: 'Elementos pré-textuais', def: 'Falsa folha de rosto, folha de rosto e seu verso, dedicatória, epígrafe, sumário. A ordem está na ABNT NBR 6029.' },
  { id: 'vinheta', term: 'Vinheta (ornamento)', def: 'Sinal como ❦ ou * * * que marca uma quebra de seção dentro do capítulo.' },
];

/* ---------------- Placeholder content ---------------- */

export const BOOK_TITLES = ['O Desenho do Tempo', 'A Página Silenciosa', 'Memórias da Prancheta', 'Tratado da Forma Breve', 'O Livro Inacabado'];
export const BOOK_SUBTITLES = ['e outros ensaios sobre a forma', 'romance', 'notas de um compositor', 'uma introdução à página'];
export const AUTHORS = ['Helena Marques', 'Tomás Albuquerque', 'Clara Vieira Neto', 'João de Barros Leme'];
export const PUBLISHERS = ['Editora Prancheta', 'Oficina do Livro', 'Edições Linha de Base'];
export const PART_TITLES = ['A oficina', 'O ofício', 'A forma', 'O retorno'];

export const CHAPTER_TITLES = [
  'A casa das margens',
  'O peso do branco',
  'Sobre a linha de base',
  'Uma tarde em Veneza',
  'O ofício do compositor',
  'A medida do olhar',
  'Cartas ao tipógrafo',
  'O silêncio entre as letras',
  'Ruas de chumbo',
  'A última prova',
];

export const HEADS_A = ['A forma do bloco', 'Proporção e medida', 'O ritmo da página', 'Entre a régua e o lápis'];
export const HEADS_B = ['Primeiras provas', 'O compositor e a caixa', 'Uma questão de cor', 'Margens e lombada'];
export const HEADS_C = ['Da medida.', 'Do recuo.', 'Das notas.', 'Da entrelinha.'];

export const EPIGRAPHS = [
  { text: 'A tipografia é o ofício de dar forma visível e durável à linguagem humana.', who: 'Robert Bringhurst' },
  { text: 'A impressão deve ser invisível.', who: 'Beatrice Warde, A taça de cristal' },
  { text: 'Matamos o tempo; o tempo nos enterra.', who: 'Machado de Assis, Memórias póstumas de Brás Cubas' },
  { text: 'A tipografia perfeita é certamente a mais esquiva de todas as artes.', who: 'Jan Tschichold' },
  { text: 'No meio do caminho tinha uma pedra.', who: 'Carlos Drummond de Andrade' },
];

export const SUPERSCRIPTS = ['¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

export const DEDICATIONS = ['Para quem compõe, linha a linha, em silêncio.', 'Aos tipógrafos anônimos de todas as oficinas.', 'Para M., que leu as primeiras provas.'];

export const NOTES = [
  'Sobre o cânone das margens, ver Tschichold, A forma do livro.',
  'A medida ideal varia com o corpo e com a largura da família tipográfica.',
  'A capitular descende das iniciais iluminadas dos manuscritos medievais.',
  'Bringhurst recomenda entre 45 e 75 caracteres por linha.',
  'Morris, The Ideal Book: a unidade do livro é a página dupla.',
];

const PROSE_PT = [
  'Naquela manhã a oficina cheirava a tinta e a papel úmido. O compositor abriu a caixa de tipos, escolheu o corpo e começou a formar as primeiras palavras do capítulo, uma a uma, sem pressa, como quem constrói um muro de pedras pequenas.',
  'Ninguém repara na margem quando ela está certa. O leitor apenas sente que a página respira, que o texto não foge pelas bordas nem se espreme contra a lombada, e segue adiante sem saber por que a leitura parece tão natural.',
  'O mestre dizia que um livro se julga pela página comum, não pela capa nem pela abertura. É na centésima página, no meio de um parágrafo qualquer, que a tipografia mostra se foi feita com cuidado ou apenas com pressa.',
  'Havia regras, claro, mas as regras serviam ao leitor e não ao contrário. A entrelinha abria quando a linha crescia; o recuo marcava o parágrafo sem alarde; o título descia pela página para anunciar que algo novo começava.',
  'Quando a prova chegou, ele a pendurou contra a luz da janela. As linhas da frente coincidiam com as do verso, como se o papel fosse um só bloco de texto atravessado pela claridade. Aquilo era o registro, e aquilo bastava.',
  'Os livros antigos da biblioteca tinham manchas pequenas e margens imensas. Os novos, mais econômicos, aproveitavam o papel até o limite. Entre um extremo e outro, ele procurava a medida justa de cada obra, como quem afina um instrumento.',
  'A capitular desceu três linhas e se acomodou no canto do parágrafo. As primeiras palavras, em versaletes, faziam a ponte entre a letra grande e o texto miúdo, e o olho entrava na página sem tropeçar.',
  'Ao fim do dia restava a revisão: uma viúva no alto da página oito, uma palavra partida em três linhas seguidas, um intertítulo abandonado no pé da página. Pequenos defeitos que ninguém nomeia, mas que todo leitor percebe.',
];

const PROSE_LATIN = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
];

const PROSE_GRID = [
  'O livro é a forma mais antiga de grid em uso contínuo. Uma mancha retangular, quatro margens e uma entrelinha regular bastam para organizar centenas de páginas com a mesma serenidade.',
  'A margem interna é a menor porque as duas margens internas se somam na medianiz. A inferior é a maior para que a mancha pareça assentada, e não caindo para fora da página.',
  'A hierarquia de um livro raramente precisa de mais de três níveis de título. Cada nível muda uma só variável: a caixa, o estilo, o peso ou o tamanho, nunca todas ao mesmo tempo.',
  'Todo espaço vertical deve ser múltiplo da entrelinha. Um intertítulo com uma linha antes e uma depois mantém o texto no registro, e as linhas das duas páginas continuam alinhadas.',
  'A abertura de capítulo usa o vazio como sinal. O rebaixo empurra o título para baixo, a capitular marca o início e as primeiras palavras em versaletes conduzem o olho para o texto.',
  'Uma família completa, com romano, itálico e versaletes, oferece hierarquia suficiente para quase qualquer livro. Uma segunda família só entra quando tem um papel claro e diferente.',
];

const PROSE: Record<PlaceholderLang, string[]> = { pt: PROSE_PT, latin: PROSE_LATIN, grid: PROSE_GRID };

export function prose(lang: PlaceholderLang, i: number, n: number): string[] {
  const bank = PROSE[lang];
  return Array.from({ length: n }, (_, k) => bank[(((i + k) % bank.length) + bank.length) % bank.length]);
}

const ROMAN: [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];
const WORDS = ['Zero', 'Um', 'Dois', 'Três', 'Quatro', 'Cinco', 'Seis', 'Sete', 'Oito', 'Nove', 'Dez', 'Onze', 'Doze', 'Treze', 'Catorze', 'Quinze', 'Dezesseis', 'Dezessete', 'Dezoito', 'Dezenove', 'Vinte'];

export function toRoman(n: number): string {
  let out = '';
  let v = Math.max(1, Math.min(39, Math.round(n)));
  for (const [k, s] of ROMAN)
    while (v >= k) {
      out += s;
      v -= k;
    }
  return out;
}

export function chapterNumber(n: number, form: BookStyle['chapter']['number']): string {
  return form === 'roman' ? toRoman(n) : form === 'word' ? (WORDS[n] ?? String(n)) : String(n);
}

/**
 * Body markup understood by the book renderer:
 *   paragraphs separated by \n · "# " head A · "## " head B · "### Head|text" run-in head C
 *   "***" section break · "> " extract
 */
export const MARKUP_HELP = 'Um parágrafo por linha. “# ” título A, “## ” título B, “### Título|texto” título corrido C, “***” quebra de seção, “> ” citação recuada.';

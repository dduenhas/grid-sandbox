export type PlaceholderLang = 'pt' | 'latin' | 'grid';

const LATIN = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
];

const PT = [
  'Era uma vez uma página em branco que esperava por ordem. O designer traçou margens, dividiu a mancha em colunas e, aos poucos, cada palavra encontrou seu lugar sem esforço aparente, como se sempre tivesse estado ali.',
  'A tipografia é a arte de dar forma visível à linguagem. Quando o leitor não percebe a estrutura, mas lê com conforto do início ao fim, o trabalho cumpriu sua função mais nobre e silenciosa.',
  'Cada coluna funciona como uma rua; as calhas são as calçadas e a linha de base é o chão comum a todos. Em uma cidade bem desenhada ninguém se perde, mesmo sem mapa, porque o ritmo guia os passos.',
  'O espaço em branco não é desperdício. Ele dá respiro ao conteúdo, separa ideias, cria pausas e conduz o olhar. Uma composição sem vazios é como uma frase sem vírgulas: tecnicamente possível, praticamente ilegível.',
];

const GRID = [
  'O grid divide a superfície bidimensional em campos menores. Os campos podem ter a mesma largura ou não; a altura corresponde a um número inteiro de linhas de texto, e as distâncias entre eles equivalem a uma linha vazia.',
  'Com o grid, o designer organiza texto, imagem e espaço de modo objetivo e funcional. A informação ganha clareza, a leitura fica mais rápida e o leitor confia no conteúdo apresentado com ordem.',
  'Quanto mais campos o grid tiver, mais possibilidades de combinação ele oferece; quanto menos, mais simples e monumental será o resultado. Escolher o número de campos é escolher o grau de liberdade.',
  'Todas as dimensões nascem da entrelinha: altura dos campos, calhas, margens. Assim o texto de colunas vizinhas compartilha a mesma linha de base e a página inteira vibra no mesmo compasso.',
];

const BANKS: Record<PlaceholderLang, string[]> = { pt: PT, latin: LATIN, grid: GRID };

export function paragraph(lang: PlaceholderLang, i: number): string {
  const bank = BANKS[lang];
  return bank[((i % bank.length) + bank.length) % bank.length];
}

/** Enough text to fill any block: the renderer truncates at the bottom of the field. */
export function bodyText(lang: PlaceholderLang, i: number, paragraphs = 14): string {
  return Array.from({ length: paragraphs }, (_, k) => paragraph(lang, i + k)).join('\n');
}

export const CAPTIONS = [
  'Fig. 1 — Estudo de proporção sobre papel vegetal.',
  'Fig. 2 — A linha de base sincroniza colunas vizinhas.',
  'Fig. 3 — Campos vazios como pausas de leitura.',
  'Foto: arquivo do estúdio.',
  'Detalhe do cartaz original, 1958.',
];

export const SUBHEADS = [
  'Como ordem e proporção constroem a leitura',
  'Um sistema para organizar texto e imagem',
  'Estrutura invisível, leitura visível',
  'Notas sobre margens, colunas e ritmo',
];

export const LABEL_IMAGE = ['Imagem', 'Foto', 'Ilustração', 'Gráfico'];

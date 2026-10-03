import type { GridTypeId } from '../core/gridEngine';

export interface GridConcept {
  title: string;
  origin: string;
  concept: string;
  whenToUse: string[];
  avoid: string[];
  strategies: string[];
  mistakes: string[];
}

export const GRID_CONCEPTS: Record<GridTypeId, GridConcept> = {
  manuscript: {
    title: 'Grid manuscrito (bloco único)',
    origin: 'Manuscritos medievais e livros incunábulos. O cânone de Villard de Honnecourt e Van de Graaf (redescoberto por Tschichold) define a mancha pela diagonal da página.',
    concept:
      'Um único bloco de texto retangular dentro de margens. É a estrutura mais simples: tudo depende das proporções da mancha e das margens. No cânone clássico, a mancha tem a mesma proporção da página e as margens seguem 1/9 (interna e superior) e 2/9 (externa e inferior).',
    whenToUse: ['Livros de leitura contínua (romances, ensaios)', 'Relatórios e cartas', 'Páginas de artigo longo na web'],
    avoid: ['Conteúdo com muitas imagens ou tipos de informação', 'Peças que precisam de várias entradas de leitura'],
    strategies: [
      'Calcule a medida para 60–70 caracteres por linha ajustando o corpo da fonte, não a mancha',
      'Use margens progressivas: a página dupla parece centrada quando a margem interna é a menor',
      'Ative a página dupla e as diagonais para ver o cânone se fechar',
      'Títulos e fólios podem ficar fora da mancha, nas margens',
    ],
    mistakes: ['Margens iguais em todos os lados (a página parece “cair”)', 'Linhas longas demais em formatos largos'],
  },
  'manuscript-notes': {
    title: 'Manuscrito com coluna de notas',
    origin: 'Tradição de comentários marginais (glosas) e da Nova Tipografia de Tschichold, que deslocou o texto para criar assimetria funcional.',
    concept:
      'Uma coluna larga de texto principal e uma coluna estreita para notas, legendas, intertítulos ou metadados. A assimetria cria hierarquia: o conteúdo principal e o secundário ficam visualmente distintos sem precisar de ornamentos.',
    whenToUse: ['Livros acadêmicos e catálogos de arte', 'Relatórios com notas laterais', 'Documentação técnica'],
    avoid: ['Formatos muito estreitos, como mobile, onde a coluna de notas fica ilegível'],
    strategies: [
      'Coloque notas e legendas alinhadas à linha de base do trecho a que se referem',
      'A coluna estreita pode receber títulos “pendurados” (hanging heads)',
      'Use um corpo menor na coluna de notas, mantendo a mesma entrelinha base',
    ],
    mistakes: ['Notas com entrelinha diferente, quebrando o alinhamento', 'Usar a coluna estreita para texto corrido longo'],
  },
  'col-2': {
    title: 'Grid de 2 colunas',
    origin: 'Bíblias e jornais antigos; permanece padrão em publicações científicas.',
    concept: 'Duas colunas iguais dividem a mancha. É estável e simétrico, mas oferece poucas combinações: um elemento ocupa uma ou duas colunas.',
    whenToUse: ['Artigos científicos, bíblias e dicionários', 'Livros ilustrados simples', 'Páginas de paisagem com texto e imagem lado a lado'],
    avoid: ['Composições que pedem assimetria ou muitos tamanhos de imagem'],
    strategies: ['Combine com linhas horizontais (campos) para variar a altura das imagens', 'Use a calha como eixo de simetria para títulos centralizados'],
    mistakes: ['Calha estreita demais: as colunas parecem um bloco único'],
  },
  'col-3': {
    title: 'Grid de 3 colunas',
    origin: 'Revistas e jornais do século XX. Um dos grids mais versáteis do design editorial.',
    concept: 'Três colunas permitem spans de 1, 2 ou 3: a combinação 2 + 1 cria assimetria natural (conteúdo principal + lateral) e 1 + 1 + 1 cria ritmo regular.',
    whenToUse: ['Revistas, newsletters e folhetos', 'Landing pages com três benefícios', 'Cartazes com hierarquia simples'],
    avoid: ['Formatos muito pequenos, onde cada coluna fica abaixo de ~35 caracteres'],
    strategies: ['Título em 2 colunas e texto na 3ª cria tensão assimétrica', 'Imagens em 2 colunas com legenda na 3ª, alinhada pela base', 'Para texto corrido, uma coluna com 40–55 caracteres funciona bem'],
    mistakes: ['Usar sempre as três colunas iguais (fica monótono)'],
  },
  'col-4': {
    title: 'Grid de 4 colunas',
    origin: 'Padrão de cartazes suíços e do mobile (Material Design: 4 colunas em telas pequenas).',
    concept: 'Quatro colunas dividem-se em metades e quartos: spans de 1, 2, 3 e 4. É o grid do vídeo de referência: título em 2–3 colunas, imagem em 4, texto em 1–2.',
    whenToUse: ['Cartazes, capas e páginas de abertura', 'Layouts mobile', 'Revistas com imagens em meia página'],
    avoid: ['Texto corrido em uma única coluna estreita de formatos pequenos'],
    strategies: ['Spans 3 + 1 criam assimetria elegante', 'Divida também em linhas (campos) para ter um grid modular 4 × n', 'Recorte e reposicione elementos, como no vídeo, para testar combinações rapidamente'],
    mistakes: ['Centralizar tudo e desperdiçar a assimetria natural do 3 + 1'],
  },
  'col-5': {
    title: 'Grid de 5 colunas (assimétrico)',
    origin: 'Nova Tipografia e catálogos de museus. O número ímpar impede a simetria perfeita.',
    concept: 'Cinco colunas favorecem divisões 2 + 3 e 1 + 4: o grid “empurra” o designer para composições assimétricas e dinâmicas.',
    whenToUse: ['Catálogos de arte e livros de fotografia', 'Relatórios com coluna lateral de destaques', 'Peças que pedem modernidade'],
    avoid: ['Formatos estreitos, onde a coluna fica minúscula'],
    strategies: ['Reserve 1 coluna para legendas e metadados e 4 para o conteúdo', 'Use 2 + 3 para contrapor imagem e texto'],
    mistakes: ['Forçar um eixo central (não existe calha no centro)'],
  },
  'col-6': {
    title: 'Grid de 6 colunas',
    origin: 'Design editorial e de jornais modernos (múltiplos de 2 e 3).',
    concept: 'Seis colunas contêm os grids de 2 e de 3: spans de 1 a 6, metades, terços e sextos. Muita flexibilidade sem perder a ordem.',
    whenToUse: ['Revistas e jornais', 'Relatórios anuais', 'Sites de conteúdo'],
    avoid: ['Formatos muito pequenos (cartões, mobile)'],
    strategies: ['Texto corrido em spans de 2 (≈ 3 colunas) ou 3 (≈ 2 colunas)', 'Alterne páginas em 3 + 3 e 4 + 2 para ritmo', 'Use a coluna 1 vazia como margem ativa'],
    mistakes: ['Usar spans de 1 coluna para texto corrido (linhas curtas demais)'],
  },
  'col-12': {
    title: 'Grid de 12 colunas',
    origin: 'Sistemas de telas: 960 Grid System (2008), Bootstrap e Material Design. Também usado em jornais de grande formato.',
    concept: 'Doze é divisível por 1, 2, 3, 4, 6 e 12. Componentes ocupam spans de 3, 4, 6, 8 ou 12. Em telas, colunas são fluidas e as calhas são fixas (16–32 px).',
    whenToUse: ['Websites e dashboards', 'Sistemas de design com componentes', 'Jornais e peças complexas'],
    avoid: ['Peças simples, onde 12 colunas viram ruído', 'Formatos pequenos (use 4 colunas no mobile)'],
    strategies: ['Defina breakpoints: 12 colunas no desktop, 8 no tablet, 4 no mobile', 'Texto corrido em no máximo 6–8 colunas no desktop', 'Use “offset” (colunas vazias) para assimetria'],
    mistakes: ['Esticar o texto pelas 12 colunas', 'Calhas que não são múltiplas de 8'],
  },
  'mod-3x3': {
    title: 'Grid modular 3 × 3',
    origin: 'Composições modulares simples; aparece em cartazes suíços e capas quadradas.',
    concept: 'Nove módulos iguais. Poucos campos: composições monumentais, de leitura imediata. A divisão em terços aproxima-se da regra dos terços da fotografia.',
    whenToUse: ['Cartazes e capas com poucos elementos', 'Posts quadrados para redes sociais', 'Capas de disco'],
    avoid: ['Conteúdo extenso e variado'],
    strategies: ['Deixe pelo menos 3 módulos vazios', 'Coloque o elemento principal sobre uma interseção dos terços'],
    mistakes: ['Preencher todos os módulos'],
  },
  'mod-4x6': {
    title: 'Grid modular 4 × 6 (24 campos)',
    origin: 'Josef Müller-Brockmann, Grid Systems in Graphic Design. É o grid do vídeo de referência.',
    concept:
      'Quatro colunas e seis linhas: 24 campos. A altura de cada campo é um número inteiro de linhas de texto e a calha vertical é uma linha vazia. Assim, imagens e textos compartilham as mesmas linhas de fluxo e a página “trava” no lugar.',
    whenToUse: ['Cartazes e capas', 'Revistas e catálogos', 'Qualquer peça que mistura texto e imagem'],
    avoid: ['Livros de texto contínuo (excesso de estrutura)'],
    strategies: [
      'Ative o “travar na entrelinha” e veja a margem inferior se ajustar automaticamente',
      'Imagens de 2 × 2, 4 × 2 e 4 × 3 campos criam relações proporcionais',
      'O título pode ocupar o primeiro campo de linha e “pendurar” na linha de fluxo',
      'Teste muitas variações com ◀ ▶: o grid garante que todas fiquem coerentes',
    ],
    mistakes: ['Campos com altura que não é múltipla da entrelinha (o texto desalinha entre colunas)'],
  },
  'mod-6x8': {
    title: 'Grid modular 6 × 8 (Müller-Brockmann)',
    origin: 'Müller-Brockmann descreve grids de 8, 20 e 32 campos para catálogos e revistas complexas.',
    concept: 'Muitos campos pequenos dão muitas combinações. Quanto mais campos, maior a liberdade (e o risco de desordem). É o grid da Neue Grafik e de catálogos industriais.',
    whenToUse: ['Catálogos com muitas imagens', 'Revistas complexas', 'Peças de identidade com muitas aplicações'],
    avoid: ['Formatos pequenos', 'Peças com 2 ou 3 elementos'],
    strategies: ['Agrupe campos em unidades maiores (2 × 2, 3 × 2) e repita-as', 'Mantenha poucos eixos de alinhamento mesmo com muitos campos'],
    mistakes: ['Usar cada campo para um elemento diferente (vira mosaico sem hierarquia)'],
  },
  hierarchical: {
    title: 'Grid hierárquico',
    origin: 'Design de web e de jornais: faixas (bands) de alturas diferentes organizadas pela importância do conteúdo.',
    concept: 'Colunas e linhas de tamanhos desiguais definidos pelo conteúdo, não por uma unidade repetida. Uma faixa de cabeçalho, um destaque grande, faixas de conteúdo e um rodapé.',
    whenToUse: ['Home pages e landing pages', 'Capas de jornal', 'Dashboards'],
    avoid: ['Conteúdo homogêneo e repetitivo (prefira modular)'],
    strategies: ['Comece pelo conteúdo mais importante e dê a ele a maior faixa', 'Mantenha as calhas constantes mesmo com faixas desiguais'],
    mistakes: ['Faixas arbitrárias sem relação proporcional'],
  },
  golden: {
    title: 'Grid de seção áurea',
    origin: 'Proporção φ ≈ 1,618, estudada desde Euclides e usada por Le Corbusier (Modulor) e em cânones de livros.',
    concept: 'Colunas e linhas na razão 1 : 1,618. A parte maior está para a menor assim como o todo está para a maior. Produz assimetrias que parecem “naturais”.',
    whenToUse: ['Capas, cartazes e identidades', 'Layouts com um elemento principal e um secundário'],
    avoid: ['Sistemas com muitos componentes iguais'],
    strategies: ['Coloque o foco sobre as linhas áureas (guias douradas)', 'Use a escala tipográfica áurea (1,618) para títulos'],
    mistakes: ['Tratar φ como fórmula mágica: ainda é preciso hierarquia e contraste'],
  },
  thirds: {
    title: 'Regra dos terços',
    origin: 'Pintura e fotografia (John Thomas Smith, 1797). Simplificação prática da seção áurea.',
    concept: 'Divide a página em 3 × 3. As quatro interseções são pontos fortes de atenção; posicionar o foco ali evita a rigidez do centro.',
    whenToUse: ['Peças com foto dominante', 'Posts, slides e capas', 'Composições minimalistas'],
    avoid: ['Conteúdo textual extenso'],
    strategies: ['Ponha o título ou o rosto da foto numa interseção', 'Deixe dois terços vazios para criar “ma”'],
    mistakes: ['Centralizar o foco por hábito'],
  },
  fibonacci: {
    title: 'Grid Fibonacci',
    origin: 'Sequência 1, 1, 2, 3, 5, 8… cuja razão tende a φ. Usado em De Stijl tardio, arquitetura e identidades.',
    concept: 'Colunas e linhas crescem pela sequência, criando campos de tamanhos progressivos. Cada campo é a soma dos dois anteriores: ritmo crescente, como uma espiral.',
    whenToUse: ['Composições abstratas e cartazes', 'Mosaicos de imagem', 'Peças de identidade'],
    avoid: ['Texto corrido longo nos campos estreitos'],
    strategies: ['Coloque o elemento mais importante no maior campo', 'Use as faixas estreitas para metadados e cor'],
    mistakes: ['Encher todos os campos estreitos de texto pequeno'],
  },
  gerstner: {
    title: 'Grid de Gerstner (58 unidades)',
    origin: 'Karl Gerstner, revista Capital (1962) e Designing Programmes (1964). Um “grid programável”.',
    concept: 'A mancha tem 58 unidades. Com calhas de 2 unidades, ela se divide exatamente em 1, 2, 3, 4, 5 ou 6 colunas, todas sobrepostas. É um sistema que contém muitos grids.',
    whenToUse: ['Revistas que alternam tipos de página', 'Sistemas de identidade', 'Quem quer flexibilidade máxima com ordem'],
    avoid: ['Iniciantes que ainda não dominam um grid simples'],
    strategies: ['Observe as guias tracejadas: cada uma é uma divisão possível', 'Alterne 2 e 3 colunas na mesma página mantendo as margens'],
    mistakes: ['Misturar divisões aleatoriamente na mesma página'],
  },
  diagonal: {
    title: 'Grid diagonal (construtivista)',
    origin: 'El Lissitzky, Rodchenko e o Construtivismo russo; retomado pelo New Wave.',
    concept: 'Um grid regular rotacionado. A estrutura continua lá, mas a diagonal introduz movimento, tensão e direção de leitura.',
    whenToUse: ['Cartazes de evento, música e esporte', 'Capas experimentais'],
    avoid: ['Textos longos (a leitura inclinada cansa)', 'Interfaces'],
    strategies: ['Use uma diagonal ascendente (avanço) ou descendente (queda)', 'Mantenha um eixo dominante: todos os elementos na mesma rotação', 'Contraponha uma forma ortogonal pequena para ancorar'],
    mistakes: ['Rotacionar cada elemento num ângulo diferente'],
  },
  eightpt: {
    title: 'Grade 8pt com baseline de 4pt',
    origin: 'Sistemas de design digitais (Material Design, iOS). Telas de 1×, 1,5×, 2× e 3× dividem 8 sem frações.',
    concept: 'Todo espaçamento e dimensão é múltiplo de 8 (ajustes finos em 4). Combinado com 4, 8 ou 12 colunas, cria consistência entre telas e componentes.',
    whenToUse: ['Apps e interfaces', 'Design systems', 'Qualquer peça que vai para o Figma'],
    avoid: ['Livros e impressos tradicionais (use a entrelinha como unidade)'],
    strategies: ['Defina entrelinhas em múltiplos de 4 (16/24, 20/28, 32/40)', 'Espaçamentos: 4, 8, 16, 24, 32, 48, 64', 'Use os tokens exportados no CSS'],
    mistakes: ['Valores “quase” múltiplos (15, 23, 33)'],
  },
};

export interface Concept {
  id: string;
  term: string;
  def: string;
}

export const CONCEPTS: Concept[] = [
  { id: 'mancha', term: 'Mancha (área útil)', def: 'Área da página ocupada pelo conteúdo, delimitada pelas margens.' },
  { id: 'margens', term: 'Margens', def: 'Espaço entre a mancha e o corte. Emolduram, dão respiro e protegem do refile e da encadernação. Margens progressivas: interna < superior < externa < inferior.' },
  { id: 'coluna', term: 'Coluna', def: 'Divisão vertical da mancha. Define a medida das linhas de texto.' },
  { id: 'calha', term: 'Calha (gutter)', def: 'Espaço entre colunas ou campos. No grid modular clássico, a calha vertical é igual a uma entrelinha.' },
  { id: 'campo', term: 'Campo / módulo', def: 'Unidade formada pela interseção de colunas e linhas. Sua altura deve ser um número inteiro de linhas de texto.' },
  { id: 'fluxo', term: 'Linha de fluxo', def: 'Alinhamento horizontal que atravessa a página e guia o olhar; elementos “penduram” nela.' },
  { id: 'baseline', term: 'Linha de base', def: 'Grade horizontal a cada entrelinha. Faz o texto de colunas vizinhas se alinhar.' },
  { id: 'entrelinha', term: 'Entrelinha (leading)', def: 'Distância entre linhas de base. Para texto corrido, 120–145% do corpo.' },
  { id: 'medida', term: 'Medida', def: 'Comprimento da linha. Ideal entre 45 e 75 caracteres, cerca de 66 (Bringhurst).' },
  { id: 'escala', term: 'Escala tipográfica', def: 'Sequência de tamanhos relacionados por uma razão (4:3, 3:2, φ). Cria hierarquia harmônica.' },
  { id: 'espaco', term: 'Espaço branco', def: 'Áreas sem conteúdo. Ativo quando tensiona a composição; passivo quando sobra.' },
  { id: 'hierarquia', term: 'Hierarquia', def: 'Ordem de leitura criada por tamanho, peso, cor, posição e espaço.' },
];

export interface BuildStep {
  id: 'page' | 'margins' | 'columns' | 'gutters' | 'rows' | 'baseline' | 'elements';
  title: string;
  text: string;
}

export const BUILD_STEPS: BuildStep[] = [
  { id: 'page', title: '1. O formato', text: 'Tudo começa pela folha. A proporção do formato condiciona cada decisão seguinte.' },
  { id: 'margins', title: '2. As margens', text: 'As margens definem a mancha. Margens generosas dão dignidade; a inferior costuma ser a maior para a mancha não “cair”.' },
  { id: 'columns', title: '3. As colunas', text: 'Dividimos a mancha verticalmente. O número de colunas define a medida do texto e as possibilidades de combinação.' },
  { id: 'gutters', title: '4. As calhas', text: 'Entre as colunas, as calhas separam os conteúdos. No método suíço, a calha vale uma entrelinha.' },
  { id: 'rows', title: '5. Os campos', text: 'Dividimos também na horizontal: surgem os campos (módulos), cada um com um número inteiro de linhas.' },
  { id: 'baseline', title: '6. A linha de base', text: 'A grade de linhas de base sincroniza todo o texto. Os campos se encaixam nela; a margem inferior se ajusta.' },
  { id: 'elements', title: '7. Os elementos', text: 'Agora os recortes entram na página: título, imagens e texto encaixam nos campos. Mude a combinação com ◀ ▶.' },
];

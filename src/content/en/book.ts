import type { Overlay } from '../../i18n';
import type { BindingId, PageType } from '../book';

export const BINDINGS_EN: Record<BindingId, { name: string; note: string }> = {
  none: { name: 'No allowance', note: 'Inner margin as drawn. Good for studying the pure canon.' },
  sewn: { name: 'Sewn', note: 'Sewn signatures open almost flat: a small allowance at the gutter is enough.' },
  perfect: { name: 'Perfect bound', note: 'A glued spine (hot melt or PUR) does not open fully: add 3 to 6 mm, more for thick books.' },
  wire: { name: 'Wire-O / spiral', note: 'The punching eats the margin: reserve 8 to 12 mm beyond the drawn margin.' },
};

export const PAGE_TYPES_EN: Record<string, Overlay<PageType>> = {
  chapter: {
    name: 'Chapter opening',
    description: 'The chapter starts with a sink: the title drops down the text block and the empty space above announces a new beginning. A drop cap or small caps lead the eye to the first line.',
    rules: [
      'Sink of about 1/3 of the text block, always in whole lines',
      'No running head; the folio drops to the foot or disappears',
      'First paragraph without indent; drop cap aligned to the cap height and to the baseline',
      'In classical books the chapter opens on an odd (right-hand) page',
    ],
  },
  sections: {
    name: 'Sections and subheads',
    description: 'The page shows the three levels of hierarchy (A, B and C) within the running text. Each level changes one variable and takes a whole number of lines.',
    rules: [
      'More space before than after: the heading belongs to the text that follows',
      'Never leave a subhead at the foot of the page without at least two lines of text',
      'The paragraph after a subhead starts without indent',
      'Three levels are enough; more calls for reorganizing the text, not more styles',
    ],
  },
  running: {
    name: 'Running text',
    description: 'The ordinary page of the book: just text, running heads and folios. This is where typographic color, measure and leading are judged.',
    rules: [
      'Lines in register: lines on both pages align and coincide front and back',
      'Section break: one blank line, with or without an ornament',
      'Avoid widows (last line of a paragraph at the top of a page) and orphans (first line at the foot)',
    ],
  },
  figure: {
    name: 'Text with figure',
    description: 'Few images in a text book: the figure takes the width of the text block, with a short caption, and the text continues above and below.',
    rules: [
      'The figure takes a whole number of lines, so the text below returns to register',
      'Caption in a smaller size, close to the figure, or in the notes column',
      'Prefer figures at the top or foot of the page, not in the middle of a paragraph',
    ],
  },
  notes: {
    name: 'Text with notes',
    description: 'Footnotes at the foot of the text block or side notes in the margin. Note references are superscript figures after the punctuation.',
    rules: [
      'Notes in a smaller size, separated from the text by a short rule or by space',
      'Side notes aligned to the line of text they refer to (Tufte)',
      'Numbering restarts with each chapter in long books',
    ],
  },
  contents: {
    name: 'Contents',
    description: 'The map of the book. Titles and page numbers must be easy to pair without long dot leaders.',
    rules: [
      'Keep numbers close to the titles or right-aligned, without long dot leaders',
      'Use the same styles as the body hierarchy, at a smaller scale',
      'The contents reproduces the headings exactly as they appear in the text',
    ],
  },
  titlepage: {
    name: 'Title page',
    description: 'Author, title, subtitle and publisher in a calm hierarchy. The back carries credits, cataloging data and colophon.',
    rules: [
      'The title sits above the optical center, not at the geometric center',
      'Few sizes: the title grows, everything else stays close to the text size',
      'Front matter follows a conventional order (in Brazil, ABNT NBR 6029)',
    ],
  },
  part: {
    name: 'Part page',
    description: 'Divides the book into large blocks. Alone on an odd page, with a blank back, it works as a pause.',
    rules: ['Same family and alignment as the chapter openings', 'No running head and no printed folio (the page counts but the number does not appear)'],
  },
  epigraph: {
    name: 'Dedication and epigraph',
    description: 'Breathing pages before the text. Little ink, a lot of white, high on the page.',
    rules: ['Dedication in italic or small caps, short', 'Narrow epigraph, with the attribution in small caps below'],
  },
};

export const BOOK_PRINCIPLES_EN = [
  {
    title: 'The unit is the double-page spread',
    text: 'Readers always see two pages. Margins, text block and alignments are judged as a pair, which is why the inner margin is the smallest: the two inner margins together form the gutter.',
    source: 'William Morris, The Ideal Book (1893); Jan Tschichold, The Form of the Book',
  },
  {
    title: 'Progressive margins',
    text: 'Inner < top < outer < bottom. The text block looks settled and does not “fall” off the page. The Van de Graaf canon gives 2:3:4:6 on a 2:3 page; Morris increased each margin by 20%.',
    source: 'Van de Graaf (1946), Tschichold, Morris',
  },
  {
    title: 'Measure, size and leading',
    text: 'Between 45 and 75 characters per line, ideally 60–70 in a single-column book. Type of 10 to 12 pt and leading of 120% to 145% of the size; longer lines call for more leading.',
    source: 'Robert Bringhurst, The Elements of Typographic Style, ch. 2',
  },
  {
    title: 'Register',
    text: 'All vertical space is a multiple of the leading: subheads, breaks, sinks and figures. That way lines on both pages align and coincide front and back, without the back showing between the lines.',
    source: 'Bringhurst: “add and delete vertical space in measured intervals”',
  },
  {
    title: 'Economical hierarchy',
    text: 'Each level changes one variable at a time: position, case, style, weight or size. Use the fewest levels the text needs, and more space before a heading than after it.',
    source: 'Tschichold, Penguin Composition Rules (1947); Bringhurst, ch. 4',
  },
  {
    title: 'Pairing typefaces',
    text: 'A complete family (roman, italic, small caps) already gives four or five levels. Two families need structural contrast (serif × sans) with similar proportions. Three styles only with clear roles: headings, text and paratext.',
    source: 'Bringhurst, ch. 6; Ellen Lupton, Thinking with Type',
  },
  {
    title: 'The paragraph',
    text: 'Mark the paragraph in one way only: a 1 em indent, a blank line or a pilcrow (¶). Do not indent the first paragraph after a heading or a break.',
    source: 'Bringhurst, 2.3; Eric Gill, An Essay on Typography (1931)',
  },
  {
    title: 'Odd pages on the right',
    text: 'Odd pages (recto) sit on the right. Chapter openings and important parts open on the recto. Running heads: book title on the verso, chapter title on the recto.',
    source: 'Publishing tradition; ABNT NBR 6029',
  },
];

export const BOOK_CONCEPTS_EN = [
  { id: 'recto', term: 'Recto and verso', def: 'Recto is the odd page, on the right; verso is the even one, on the left. Classical chapters open on the recto.' },
  { id: 'medianiz', term: 'Gutter and spine', def: 'The gutter is the white space between the two text blocks of the spread. Binding consumes part of it, so an allowance is added to the inner margin.' },
  { id: 'rebaixo', term: 'Sink (chapter drop)', def: 'White space above the title at a chapter opening, usually about 1/3 of the text block.' },
  { id: 'capitular', term: 'Drop cap', def: 'An enlarged initial letter spanning two to four lines. Its top aligns with the cap height of the first line and its foot with a baseline.' },
  { id: 'versalete', term: 'Small caps', def: 'Capitals drawn at the height of the lowercase. Used for acronyms, running heads and the first words of a chapter.' },
  { id: 'cabeco', term: 'Running head', def: 'A line at the top of the page with the book or chapter title. It disappears on openings and blank pages.' },
  { id: 'folio', term: 'Folio', def: 'The page number. At the outer corner it helps browsing; centered at the foot it is more discreet.' },
  { id: 'registro', term: 'Register', def: 'The coincidence of baselines between columns, between the pages of a spread and between the front and back of the sheet.' },
  { id: 'viuva', term: 'Widow and orphan', def: 'Widow: the last line of a paragraph alone at the top of a page. Orphan: the first line alone at the foot. Both break the block.' },
  { id: 'recuo', term: 'Paragraph indent', def: 'The indent of the first line, usually 1 em (the type size). Not combined with space between paragraphs.' },
  { id: 'runin', term: 'Run-in head', def: 'A subhead that starts the paragraph on the same line, in italic or small caps. Hierarchy without spending vertical space.' },
  { id: 'cor', term: 'Typographic color', def: 'The gray density of the text block. It should be even: no rivers, holes or darker lines.' },
  { id: 'pretextuais', term: 'Front matter', def: 'Half title, title page and its back, dedication, epigraph, contents. Their order follows publishing convention.' },
  { id: 'vinheta', term: 'Ornament (fleuron)', def: 'A sign such as ❦ or * * * that marks a section break within a chapter.' },
];

export const BOOK_TITLES_EN = ['The Drawing of Time', 'The Silent Page', 'Memoirs of the Drawing Board', 'A Treatise on Brief Form', 'The Unfinished Book'];
export const BOOK_SUBTITLES_EN = ['and other essays on form', 'a novel', 'notes of a typesetter', 'an introduction to the page'];
export const PUBLISHERS_EN = ['Drawing Board Press', 'The Book Workshop', 'Baseline Editions'];
export const PART_TITLES_EN = ['The workshop', 'The craft', 'The form', 'The return'];

export const CHAPTER_TITLES_EN = [
  'The house of margins',
  'The weight of white',
  'On the baseline',
  'An afternoon in Venice',
  'The typesetter’s craft',
  'The measure of the eye',
  'Letters to the typographer',
  'The silence between letters',
  'Streets of lead',
  'The final proof',
];

export const HEADS_A_EN = ['The shape of the block', 'Proportion and measure', 'The rhythm of the page', 'Between ruler and pencil'];
export const HEADS_B_EN = ['First proofs', 'The typesetter and the case', 'A question of color', 'Margins and spine'];
export const HEADS_C_EN = ['On measure.', 'On indents.', 'On notes.', 'On leading.'];

export const EPIGRAPHS_EN = [
  { text: 'Typography is the craft of endowing human language with a durable visual form.', who: 'Robert Bringhurst' },
  { text: 'Printing should be invisible.', who: 'Beatrice Warde, The Crystal Goblet' },
  { text: 'We kill time; time buries us.', who: 'Machado de Assis, The Posthumous Memoirs of Brás Cubas' },
  { text: 'Perfect typography is certainly the most elusive of all arts.', who: 'Jan Tschichold' },
  { text: 'In the middle of the road there was a stone.', who: 'Carlos Drummond de Andrade' },
];

export const DEDICATIONS_EN = ['For those who set type, line by line, in silence.', 'To the anonymous typographers of every workshop.', 'For M., who read the first proofs.'];

export const NOTES_EN = [
  'On the canon of margins, see Tschichold, The Form of the Book.',
  'The ideal measure varies with the type size and with the width of the typeface.',
  'The drop cap descends from the illuminated initials of medieval manuscripts.',
  'Bringhurst recommends between 45 and 75 characters per line.',
  'Morris, The Ideal Book: the unit of the book is the double-page spread.',
];

export const PROSE_EN = [
  'That morning the workshop smelled of ink and damp paper. The typesetter opened the type case, chose the size and began to form the first words of the chapter, one by one, unhurried, like someone building a wall of small stones.',
  'Nobody notices the margin when it is right. Readers only feel that the page breathes, that the text neither escapes over the edges nor squeezes against the spine, and they carry on without knowing why reading feels so natural.',
  'The master used to say that a book is judged by its ordinary page, not by its cover or its opening. It is on the hundredth page, in the middle of any paragraph, that typography shows whether it was made with care or merely in a hurry.',
  'There were rules, of course, but the rules served the reader and not the other way round. The leading opened when the line grew longer; the indent marked the paragraph without fuss; the title dropped down the page to announce that something new was beginning.',
  'When the proof arrived, he held it up against the window light. The lines on the front coincided with those on the back, as if the paper were a single block of text crossed by the brightness. That was register, and that was enough.',
  'The old books in the library had small text blocks and immense margins. The new ones, more economical, used the paper to its limit. Between one extreme and the other, he searched for the right measure for each work, like someone tuning an instrument.',
  'The drop cap fell three lines and settled into the corner of the paragraph. The first words, in small caps, bridged the large letter and the small text, and the eye entered the page without stumbling.',
  'At the end of the day there was the proofreading: a widow at the top of page eight, a word hyphenated on three consecutive lines, a subhead abandoned at the foot of a page. Small flaws nobody names, but every reader perceives.',
];

export const PROSE_GRID_EN = [
  'The book is the oldest form of grid in continuous use. A rectangular text block, four margins and a regular leading are enough to organize hundreds of pages with the same serenity.',
  'The inner margin is the smallest because the two inner margins add up at the gutter. The bottom one is the largest so the text block looks settled, not falling off the page.',
  'A book’s hierarchy rarely needs more than three heading levels. Each level changes a single variable: case, style, weight or size, never all of them at once.',
  'All vertical space should be a multiple of the leading. A subhead with one line before and one after keeps the text in register, and the lines of both pages stay aligned.',
  'The chapter opening uses emptiness as a signal. The sink pushes the title down, the drop cap marks the start and the first words in small caps lead the eye into the text.',
  'A complete family, with roman, italic and small caps, offers enough hierarchy for almost any book. A second family only comes in when it has a clear and different role.',
];

export const WORDS_EN = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];

export const MARKUP_HELP_EN = 'One paragraph per line. “# ” head A, “## ” head B, “### Head|text” run-in head C, “***” section break, “> ” indented extract.';

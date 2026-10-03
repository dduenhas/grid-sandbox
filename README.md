# Grid Sandbox

**Prancheta digital para prototipar grids e diagramações antes de abrir o Illustrator, o Figma ou o Photoshop.**

Escolha o formato, o grid e a escola de design, percorra as combinações com ◀ ▶, ajuste à mão e exporte.

![Interface do Grid Sandbox: grid modular 4 × 6 suíço num A4 sobre a base de corte, com o painel de teoria aberto](docs/interface.png)

## Filosofia

O grid nasce na prancheta: folha, régua, lápis e recortes de papel reposicionados à mão até a página encontrar sua ordem. O Grid Sandbox leva esse gesto para a tela. Em vez de começar num software de produção com um documento vazio, o designer experimenta dezenas de estruturas e diagramações em segundos e só depois segue para a ferramenta final com uma decisão tomada.

O projeto tem dois públicos ao mesmo tempo: quem está **aprendendo** diagramação, que encontra a teoria explicada ao lado de cada escolha, e quem já **trabalha** com design gráfico e de interfaces, que ganha uma etapa de esboço rápido antes da produção.

### Decisões de projeto

- **Rapidez acima de tudo.** Cada combinação é gerada na hora, de forma determinística (a mesma variação sempre volta igual), e tudo tem atalho de teclado.
- **Teoria embutida.** Grids, margens e escalas seguem Müller-Brockmann, Tschichold, Van de Graaf, Gerstner e Bringhurst. Cada grid traz conceito, origem, quando usar, estratégias e erros comuns.
- **Escolas como ponto de partida.** Cada escola carrega suas fontes, paleta, grids preferidos e arquétipos de página.
- **Automático e manual.** A máquina propõe; o designer fixa o que funciona e ajusta à mão, sempre encaixado nas colunas e campos.
- **A metáfora da prancheta.** Base de corte, réguas, papel vegetal e recortes de papel com sombra, como no processo analógico de diagramação.
- **Saída utilizável.** SVG em camadas, PNG em alta resolução, CSS Grid e uma ficha técnica para refazer o grid no InDesign, Illustrator, Photoshop ou Figma.

![Construtivismo russo: grid diagonal num cartaz 50 × 70 com o painel de escolas aberto](docs/escolas.png)

## Recursos

1. **Formatos.** 18 formatos de impressão e tela (A4, A3, livro, cartaz, desktop, mobile, Instagram e outros), em retrato ou paisagem e com página dupla.
2. **Grids.** 18 tipos, ordenados pela adequação ao formato: colunas, modulares, Müller-Brockmann com linha de base, cânone de Van de Graaf, margens progressivas de Tschichold, Gerstner 58, áurea, terços, Fibonacci, 8pt, diagonal construtivista e outros.
3. **Escolas.** 12 escolas: Suíça, Bauhaus, Construtivismo, De Stijl, Nova Tipografia, Clássica, Vignelli, New Wave, Japonesa, Editorial, Web/UI e Brutalismo.
4. **Combinações.** ◀ ▶ geram diagramações no grid escolhido, com nota e análise de espaço branco, alinhamento, hierarquia, equilíbrio e medida do texto.
5. **Modo manual.** Arraste e redimensione blocos com encaixe no grid; fixe blocos para mantê-los nas próximas combinações; desfaça e refaça.
6. **Aprender.** A aba Teoria explica o grid ativo com os números ao vivo, e o botão Construir anima o grid etapa por etapa.
7. **Exportar.** SVG em camadas, PNG (até 300 dpi, com fontes embutidas), JSON do projeto, CSS Grid e ficha técnica.

## Rodar localmente

Requer Node.js 18 ou superior.

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5173
npm test         # testes do motor de grids e do gerador de layouts
npm run build    # verificação de tipos e build de produção em dist/
```

### Deploy na Vercel

O projeto é um app Vite estático. Ao importar o repositório na Vercel, o preset **Vite** é detectado automaticamente: comando de build `npm run build` e diretório de saída `dist`.

## Atalhos

| Tecla | Ação |
| --- | --- |
| ← → | combinação anterior / próxima (no modo manual, move o bloco) |
| R | combinação aleatória |
| 1–9, [ ] | escolher / alternar grid |
| O | retrato / paisagem |
| F | página dupla |
| S / Shift+S | próxima / anterior escola |
| M | auto / manual |
| P | fixar bloco selecionado |
| Del | remover bloco |
| Espaço | autoplay |
| C | recortes de papel |
| K | construir passo a passo |
| G / L / B / U / T / D | colunas · campos · linha de base · guias · vegetal · cotas |
| + − 0 | zoom |
| E | exportar |
| Ctrl+K | paleta de comandos |
| Ctrl+Z / Ctrl+Y | desfazer / refazer |
| ? | ajuda |

O estado atual fica na URL (por exemplo `#f=a4&o=p&g=mod-4x6&s=swiss&v=0`), pronto para compartilhar, e é salvo no navegador.

## Tecnologia

React 18, TypeScript, Vite, Zustand e Framer Motion. A prancheta é desenhada em SVG nas unidades reais do documento (mm para impressão, px para tela).

- `src/core`: unidades, formatos, motor de grids, presets, escala tipográfica, gerador e avaliação de layouts
- `src/content`: escolas, textos de preenchimento e teoria
- `src/render`: prancheta em SVG, camadas do grid, réguas e tipografia
- `src/components`: interface e painéis
- `src/export`: SVG, PNG, JSON, CSS e fichas técnicas

## Autor

Desenvolvido por **[Diego Duenhas](https://diegoduenhas.com.br)**, designer gráfico e desenvolvedor web com mais de duas décadas de experiência em identidades visuais, projetos editoriais e interfaces digitais, da concepção gráfica à implementação front-end.

- Tecnologia em Design Gráfico, SENAC São Paulo (2026)
- Tecnologia em Sistemas para Internet, IFSP São João da Boa Vista (2017)

Contato: [dduenhas@gmail.com](mailto:dduenhas@gmail.com)

## Licença

[MIT](LICENSE) © 2026 Diego Duenhas

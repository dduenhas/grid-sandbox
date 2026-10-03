import type { GridInk } from '../store/useStore';

export interface InkColors {
  line: string;
  margin: string;
  module: string;
  column: string;
  baseline: string;
  gutter: string;
  guide: Record<string, string>;
  label: string;
}

export const INKS: Record<GridInk, InkColors> = {
  pencil: {
    line: 'rgba(70,70,66,.55)',
    margin: 'rgba(70,70,66,.7)',
    module: 'rgba(0,0,0,.035)',
    column: 'rgba(0,0,0,.025)',
    baseline: 'rgba(90,90,85,.22)',
    gutter: 'rgba(226,35,26,.18)',
    guide: { canon: 'rgba(160,40,40,.55)', golden: 'rgba(196,140,20,.75)', thirds: 'rgba(30,120,170,.6)', diagonals: 'rgba(160,40,40,.45)', gerstner: 'rgba(30,120,170,.5)', eightpt: 'rgba(0,0,0,.06)' },
    label: '#5d5d58',
  },
  blue: {
    line: 'rgba(40,150,205,.75)',
    margin: 'rgba(40,150,205,.95)',
    module: 'rgba(80,180,230,.10)',
    column: 'rgba(80,180,230,.07)',
    baseline: 'rgba(40,150,205,.28)',
    gutter: 'rgba(226,35,26,.2)',
    guide: { canon: 'rgba(214,40,120,.6)', golden: 'rgba(214,150,0,.85)', thirds: 'rgba(214,40,120,.55)', diagonals: 'rgba(214,40,120,.5)', gerstner: 'rgba(120,80,210,.55)', eightpt: 'rgba(40,150,205,.1)' },
    label: '#1d7fb0',
  },
  magenta: {
    line: 'rgba(140,80,215,.75)',
    margin: 'rgba(214,40,160,.9)',
    module: 'rgba(140,80,215,.07)',
    column: 'rgba(140,80,215,.05)',
    baseline: 'rgba(60,170,230,.35)',
    gutter: 'rgba(214,40,160,.18)',
    guide: { canon: 'rgba(0,160,120,.6)', golden: 'rgba(214,150,0,.85)', thirds: 'rgba(0,160,120,.6)', diagonals: 'rgba(0,160,120,.5)', gerstner: 'rgba(60,170,230,.6)', eightpt: 'rgba(140,80,215,.08)' },
    label: '#a03a9a',
  },
};

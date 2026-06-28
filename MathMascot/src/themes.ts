import type { MascotId, MascotTheme } from './types';

/**
 * Colores de cada mascota.
 * Tip: exportá el SVG desde Figma → copiá los fill/stroke exactos acá.
 */
export const MASCOT_THEMES: Record<MascotId, MascotTheme> = {
  plus: {
    body: '#5BB5FF',
    outline: '#2E8FD9',
    highlight: '#9AD4FF',
    cheek: '#C8EBFF',
    feature: '#002B5B',
  },
  minus: {
    body: '#6FD06F',
    outline: '#45A845',
    highlight: '#A8E8A8',
    cheek: '#C8F5C8',
    feature: '#002B5B',
  },
  times: {
    body: '#A4F52A',
    outline: '#7ED321',
    highlight: '#D4FF70',
    cheek: '#D4FF70',
    feature: '#002B5B',
  },
  div: {
    body: '#B08FE8',
    outline: '#8B6FD4',
    highlight: '#D4C4F5',
    cheek: '#E8DDF8',
    feature: '#002B5B',
  },
};

/** @deprecated Usá theme.feature — se mantiene por compatibilidad. */
export const FEATURE_COLOR = '#002B5B';

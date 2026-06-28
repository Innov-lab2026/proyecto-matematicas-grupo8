import type { Variants } from 'framer-motion';
import type { MascotState } from './types';

export const mascotVariants: Variants = {
  idle: {
    y: [0, -4, 0],
    rotate: [-1, 1, -1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  celebrate: {
    scale: [1, 1.2, 1],
    rotate: [0, 8, -8, 0],
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
  error: {
    x: [0, -8, 8, -8, 8, -4, 4, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  thinking: {
    rotate: [-2, 2, -2],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  talking: {
    scale: [1, 1.06, 1],
    transition: {
      duration: 0.55,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export function getMascotAnimation(state: MascotState) {
  return mascotVariants[state];
}

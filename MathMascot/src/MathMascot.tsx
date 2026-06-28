import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import type { MathMascotProps, MascotId } from './types';
import { mascotVariants } from './animations';
import { MASCOT_THEMES } from './themes';
import {
  DivMascot,
  MinusMascot,
  PlusMascot,
  TimesMascot,
} from './mascots/MascotBodies';
import { SpeechBubble } from './SpeechBubble';
import './styles.css';

const MASCOT_COMPONENTS = {
  plus: PlusMascot,
  minus: MinusMascot,
  times: TimesMascot,
  div: DivMascot,
} as const satisfies Record<
  MascotId,
  ComponentType<{
    state: MathMascotProps['state'];
    theme: (typeof MASCOT_THEMES)[MascotId];
  }>
>;

const VIEWBOX = '0 0 100 120';

export function MathMascot({
  mascotId,
  state,
  dialogue = '',
  size = 120,
  className,
}: MathMascotProps) {
  const theme = MASCOT_THEMES[mascotId];
  const Body = MASCOT_COMPONENTS[mascotId];

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {dialogue ? <SpeechBubble text={dialogue} /> : null}
      <motion.svg
        width={size}
        height={size * (120 / 100)}
        viewBox={VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Mascota ${mascotId}`}
        variants={mascotVariants}
        animate={state}
        initial={false}
      >
        <Body state={state} theme={theme} />
      </motion.svg>
    </div>
  );
}

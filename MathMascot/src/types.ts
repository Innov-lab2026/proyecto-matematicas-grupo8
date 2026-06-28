export type MascotId = 'plus' | 'minus' | 'times' | 'div';

export type MascotState =
  | 'idle'
  | 'celebrate'
  | 'error'
  | 'thinking'
  | 'talking';

/** Paleta por mascota — editá estos valores para matchear Figma al pixel. */
export interface MascotTheme {
  body: string;
  outline: string;
  highlight: string;
  cheek: string;
  feature: string;
}

export interface MathMascotProps {
  mascotId: MascotId;
  state: MascotState;
  dialogue?: string;
  size?: number;
  className?: string;
}

export interface SpeechBubbleProps {
  text: string;
  className?: string;
}

export interface MascotBodyProps {
  state: MascotState;
  theme: MascotTheme;
}

export interface MascotFaceProps {
  state: MascotState;
  cx: number;
  cy: number;
  eyeOffsetX?: number;
  eyeOffsetY?: number;
  theme: MascotTheme;
}

export interface MascotLimbsProps {
  state: MascotState;
  theme: MascotTheme;
  legAnchor: { x: number; y: number };
  armAnchors: [{ x: number; y: number }, { x: number; y: number }];
}

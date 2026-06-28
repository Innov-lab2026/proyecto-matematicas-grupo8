import type { ReactNode } from 'react';
import type { MascotBodyProps } from '../types';
import { MascotFace } from './MascotFace';
import { MascotArms, MascotLegs } from './MascotLimbs';
import { RoundedCircle, RoundedRect, RoundedStroke } from './shared/RoundedStroke';

const TIMES_X = 'M 24 24 L 76 76 M 76 24 L 24 76';
const PLUS_V = 'M 50 16 L 50 84';
const PLUS_H = 'M 16 50 L 84 50';

function MascotLayers({
  state,
  theme,
  body,
  faceCx,
  faceCy,
  eyeOffsetX,
  legAnchor,
  armAnchors,
}: MascotBodyProps & {
  body: ReactNode;
  faceCx: number;
  faceCy: number;
  eyeOffsetX?: number;
  legAnchor: { x: number; y: number };
  armAnchors: [{ x: number; y: number }, { x: number; y: number }];
}) {
  const limbProps = { state, theme, legAnchor, armAnchors };

  return (
    <>
      <MascotLegs {...limbProps} />
      {body}
      <MascotFace
        state={state}
        cx={faceCx}
        cy={faceCy}
        eyeOffsetX={eyeOffsetX}
        theme={theme}
      />
      <MascotArms {...limbProps} />
    </>
  );
}

export function PlusMascot({ state, theme }: MascotBodyProps) {
  return (
    <MascotLayers
      state={state}
      theme={theme}
      faceCx={50}
      faceCy={48}
      eyeOffsetX={10}
      legAnchor={{ x: 50, y: 72 }}
      armAnchors={[
        { x: 28, y: 50 },
        { x: 72, y: 50 },
      ]}
      body={
        <>
          <RoundedStroke d={PLUS_V} body={theme.body} outline={theme.outline} strokeWidth={20} />
          <RoundedStroke d={PLUS_H} body={theme.body} outline={theme.outline} strokeWidth={20} />
          <ellipse cx={50} cy={22} rx={8} ry={4} fill={theme.highlight} opacity={0.55} />
        </>
      }
    />
  );
}

export function MinusMascot({ state, theme }: MascotBodyProps) {
  return (
    <MascotLayers
      state={state}
      theme={theme}
      faceCx={50}
      faceCy={48}
      eyeOffsetX={10}
      legAnchor={{ x: 50, y: 62 }}
      armAnchors={[
        { x: 22, y: 50 },
        { x: 78, y: 50 },
      ]}
      body={
        <>
          <RoundedRect
            x={14}
            y={40}
            width={72}
            height={20}
            rx={10}
            body={theme.body}
            outline={theme.outline}
          />
          <ellipse cx={50} cy={42} rx={14} ry={3.5} fill={theme.highlight} opacity={0.5} />
        </>
      }
    />
  );
}

export function TimesMascot({ state, theme }: MascotBodyProps) {
  return (
    <MascotLayers
      state={state}
      theme={theme}
      faceCx={50}
      faceCy={46}
      eyeOffsetX={11}
      legAnchor={{ x: 50, y: 74 }}
      armAnchors={[
        { x: 34, y: 38 },
        { x: 66, y: 38 },
      ]}
      body={
        <>
          <RoundedStroke
            d={TIMES_X}
            body={theme.body}
            outline={theme.outline}
            strokeWidth={20}
          />
          <ellipse
            cx={30}
            cy={30}
            rx={7}
            ry={3.5}
            fill={theme.highlight}
            opacity={0.6}
            transform="rotate(-45 30 30)"
          />
          <ellipse
            cx={70}
            cy={30}
            rx={7}
            ry={3.5}
            fill={theme.highlight}
            opacity={0.6}
            transform="rotate(45 70 30)"
          />
        </>
      }
    />
  );
}

export function DivMascot({ state, theme }: MascotBodyProps) {
  return (
    <MascotLayers
      state={state}
      theme={theme}
      faceCx={50}
      faceCy={50}
      eyeOffsetX={10}
      legAnchor={{ x: 50, y: 82 }}
      armAnchors={[
        { x: 24, y: 50 },
        { x: 76, y: 50 },
      ]}
      body={
        <>
          <RoundedCircle cx={50} cy={22} r={8} body={theme.body} outline={theme.outline} />
          <RoundedRect
            x={16}
            y={42}
            width={68}
            height={18}
            rx={9}
            body={theme.body}
            outline={theme.outline}
          />
          <RoundedCircle cx={50} cy={80} r={8} body={theme.body} outline={theme.outline} />
          <ellipse cx={50} cy={44} rx={12} ry={3} fill={theme.highlight} opacity={0.5} />
        </>
      }
    />
  );
}

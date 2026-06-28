import type { MascotFaceProps } from '../types';

/**
 * Cara estilo Figma: ojos arco grandes, cejas blancas, mejillas, boca navy.
 * Editá offsets y paths acá para afinar expresiones.
 */
export function MascotFace({
  state,
  cx,
  cy,
  eyeOffsetX = 11,
  eyeOffsetY = 0,
  theme,
}: MascotFaceProps) {
  const { feature, cheek } = theme;
  const leftEyeX = cx - eyeOffsetX;
  const rightEyeX = cx + eyeOffsetX;
  const eyeY = cy + eyeOffsetY - 2;
  const browY = eyeY - 10;
  const eyeSpan = 8;

  if (state === 'error') {
    return (
      <g className="mascot-face">
        <path
          d={`M ${leftEyeX - 6} ${eyeY - 5} L ${leftEyeX + 6} ${eyeY + 5} M ${leftEyeX + 6} ${eyeY - 5} L ${leftEyeX - 6} ${eyeY + 5}`}
          stroke={feature}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${rightEyeX - 6} ${eyeY - 5} L ${rightEyeX + 6} ${eyeY + 5} M ${rightEyeX + 6} ${eyeY - 5} L ${rightEyeX - 6} ${eyeY + 5}`}
          stroke={feature}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${cx - 8} ${cy + 12} Q ${cx} ${cy + 6} ${cx + 8} ${cy + 12}`}
          stroke={feature}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  if (state === 'thinking') {
    return (
      <g className="mascot-face">
        <path
          d={`M ${leftEyeX - eyeSpan} ${browY + 2} Q ${leftEyeX} ${browY - 5} ${leftEyeX + eyeSpan} ${browY + 2}`}
          stroke="#fff"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M ${rightEyeX - eyeSpan} ${browY + 4} Q ${rightEyeX + 2} ${browY - 2} ${rightEyeX + eyeSpan + 2} ${browY + 3}`}
          stroke="#fff"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
        />
        <ellipse
          cx={leftEyeX + 1}
          cy={eyeY}
          rx={7}
          ry={5}
          fill={feature}
          className="mascot-eye"
        />
        <ellipse
          cx={rightEyeX + 3}
          cy={eyeY - 2}
          rx={6}
          ry={4.5}
          fill={feature}
          className="mascot-eye mascot-eye--right"
        />
        <circle cx={leftEyeX + 3} cy={eyeY - 1} r={2} fill="#fff" />
        <circle cx={rightEyeX + 5} cy={eyeY - 3} r={1.6} fill="#fff" />
        <path
          d={`M ${cx - 3} ${cy + 10} Q ${cx + 2} ${cy + 13} ${cx + 6} ${cy + 9}`}
          stroke={feature}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  if (state === 'talking') {
    return (
      <g className="mascot-face">
        <FigmaBrows leftX={leftEyeX} rightX={rightEyeX} y={browY} span={eyeSpan} />
        <FigmaEyes
          leftX={leftEyeX}
          rightX={rightEyeX}
          y={eyeY}
          span={eyeSpan}
          feature={feature}
        />
        <ellipse cx={cx} cy={cy + 11} rx={5.5} ry={4.5} fill={feature} />
      </g>
    );
  }

  if (state === 'celebrate') {
    return (
      <g className="mascot-face">
        <FigmaBrows leftX={leftEyeX} rightX={rightEyeX} y={browY} span={eyeSpan} />
        <FigmaEyes
          leftX={leftEyeX}
          rightX={rightEyeX}
          y={eyeY}
          span={eyeSpan}
          feature={feature}
        />
        <FigmaCheeks leftX={leftEyeX} rightX={rightEyeX} y={eyeY} color={cheek} />
        <path
          d={`M ${cx - 9} ${cy + 10} Q ${cx} ${cy + 18} ${cx + 9} ${cy + 10}`}
          stroke={feature}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  return (
    <g className="mascot-face">
      <FigmaBrows leftX={leftEyeX} rightX={rightEyeX} y={browY} span={eyeSpan} />
      <FigmaEyes
        leftX={leftEyeX}
        rightX={rightEyeX}
        y={eyeY}
        span={eyeSpan}
        feature={feature}
      />
      <FigmaCheeks leftX={leftEyeX} rightX={rightEyeX} y={eyeY} color={cheek} />
      <path
        d={`M ${cx - 4} ${cy + 10} Q ${cx} ${cy + 14} ${cx + 4} ${cy + 10}`}
        stroke={feature}
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

function FigmaBrows({
  leftX,
  rightX,
  y,
  span,
}: {
  leftX: number;
  rightX: number;
  y: number;
  span: number;
}) {
  return (
    <>
      <path
        d={`M ${leftX - span} ${y} Q ${leftX} ${y - 5} ${leftX + span} ${y}`}
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${rightX - span} ${y} Q ${rightX} ${y - 5} ${rightX + span} ${y}`}
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

function FigmaEyes({
  leftX,
  rightX,
  y,
  span,
  feature,
}: {
  leftX: number;
  rightX: number;
  y: number;
  span: number;
  feature: string;
}) {
  return (
    <>
      <path
        d={`M ${leftX - span} ${y} Q ${leftX} ${y + 11} ${leftX + span} ${y}`}
        fill={feature}
        className="mascot-eye"
      />
      <path
        d={`M ${rightX - span} ${y} Q ${rightX} ${y + 11} ${rightX + span} ${y}`}
        fill={feature}
        className="mascot-eye mascot-eye--right"
      />
      <circle cx={leftX + 3} cy={y + 4} r={2.2} fill="#fff" />
      <circle cx={leftX - 2} cy={y + 6} r={1.3} fill="#fff" />
      <circle cx={rightX + 3} cy={y + 4} r={2.2} fill="#fff" />
      <circle cx={rightX - 2} cy={y + 6} r={1.3} fill="#fff" />
    </>
  );
}

function FigmaCheeks({
  leftX,
  rightX,
  y,
  color,
}: {
  leftX: number;
  rightX: number;
  y: number;
  color: string;
}) {
  return (
    <>
      <ellipse cx={leftX - 11} cy={y + 9} rx={5} ry={3} fill={color} opacity={0.55} />
      <ellipse cx={rightX + 11} cy={y + 9} rx={5} ry={3} fill={color} opacity={0.55} />
    </>
  );
}

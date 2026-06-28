import type { MascotLimbsProps } from '../types';

/**
 * Brazos y piernas estilo Figma.
 * Editá los paths de cada estado para cambiar poses.
 */
export function MascotLegs({ state, theme, legAnchor }: MascotLimbsProps) {
  const { feature } = theme;
  const { x, y } = legAnchor;
  const spread = 7;
  const leftX = x - spread;
  const rightX = x + spread;
  const footY = y + 18;

  const wobble =
    state === 'error' ? 2 : state === 'celebrate' ? -2 : 0;

  return (
    <g className="mascot-legs" stroke={feature} strokeLinecap="round">
      <line
        x1={leftX}
        y1={y}
        x2={leftX - wobble}
        y2={footY}
        strokeWidth={2.8}
      />
      <line
        x1={rightX}
        y1={y}
        x2={rightX + wobble}
        y2={footY}
        strokeWidth={2.8}
      />
      <ellipse
        cx={leftX - 4}
        cy={footY + 2}
        rx={6}
        ry={3}
        fill={feature}
        transform={`rotate(-18 ${leftX} ${footY})`}
      />
      <ellipse
        cx={rightX + 4}
        cy={footY + 2}
        rx={6}
        ry={3}
        fill={feature}
        transform={`rotate(18 ${rightX} ${footY})`}
      />
    </g>
  );
}

export function MascotArms({ state, theme, armAnchors }: MascotLimbsProps) {
  const { feature } = theme;
  const [left, right] = armAnchors;

  if (state === 'celebrate') {
    return (
      <g className="mascot-arms" stroke={feature} strokeLinecap="round" fill="none">
        <path
          d={`M ${left.x} ${left.y} Q ${left.x - 14} ${left.y - 18} ${left.x - 8} ${left.y - 32}`}
          strokeWidth={2.8}
        />
        <path
          d={`M ${right.x} ${right.y} Q ${right.x + 14} ${right.y - 18} ${right.x + 8} ${right.y - 32}`}
          strokeWidth={2.8}
        />
        <OpenHand x={left.x - 8} y={left.y - 34} feature={feature} flip />
        <OpenHand x={right.x + 8} y={right.y - 34} feature={feature} />
      </g>
    );
  }

  if (state === 'thinking') {
    return (
      <g className="mascot-arms" stroke={feature} strokeLinecap="round" fill="none">
        <path
          d={`M ${left.x} ${left.y} Q ${left.x - 10} ${left.y + 6} ${left.x - 4} ${left.y + 14}`}
          strokeWidth={2.8}
        />
        <path
          d={`M ${right.x} ${right.y} Q ${right.x + 4} ${right.y - 10} ${right.x + 2} ${right.y - 22}`}
          strokeWidth={2.8}
        />
        <circle cx={right.x + 2} cy={right.y - 24} r={4.5} strokeWidth={2.2} />
        <ChinHand x={right.x + 2} y={right.y - 20} feature={feature} />
      </g>
    );
  }

  if (state === 'error') {
    return (
      <g className="mascot-arms" stroke={feature} strokeLinecap="round" fill="none">
        <path
          d={`M ${left.x} ${left.y} L ${left.x - 16} ${left.y + 10}`}
          strokeWidth={2.8}
        />
        <path
          d={`M ${right.x} ${right.y} L ${right.x + 16} ${right.y + 10}`}
          strokeWidth={2.8}
        />
        <OpenHand x={left.x - 16} y={left.y + 12} feature={feature} flip />
        <OpenHand x={right.x + 16} y={right.y + 12} feature={feature} />
      </g>
    );
  }

  return (
    <g className="mascot-arms" stroke={feature} strokeLinecap="round" fill="none">
      <path
        d={`M ${left.x} ${left.y} Q ${left.x - 12} ${left.y + 8} ${left.x - 18} ${left.y + 18}`}
        strokeWidth={2.8}
      />
      <OpenHand x={left.x - 18} y={left.y + 20} feature={feature} flip />
      <path
        d={`M ${right.x} ${right.y} Q ${right.x + 10} ${right.y - 12} ${right.x + 16} ${right.y - 22}`}
        strokeWidth={2.8}
      />
      <OkHand x={right.x + 18} y={right.y - 24} feature={feature} />
    </g>
  );
}

function OkHand({
  x,
  y,
  feature,
}: {
  x: number;
  y: number;
  feature: string;
}) {
  return (
    <g stroke={feature} strokeLinecap="round" fill="none">
      <circle cx={x} cy={y} r={5.5} strokeWidth={2.2} />
      <line x1={x + 4} y1={y - 3} x2={x + 9} y2={y - 10} strokeWidth={2} />
      <line x1={x + 5} y1={y - 1} x2={x + 11} y2={y - 3} strokeWidth={2} />
      <line x1={x + 5} y1={y + 1} x2={x + 11} y2={y + 2} strokeWidth={2} />
      <line x1={x + 4} y1={y + 3} x2={x + 9} y2={y + 8} strokeWidth={2} />
    </g>
  );
}

function OpenHand({
  x,
  y,
  feature,
  flip = false,
}: {
  x: number;
  y: number;
  feature: string;
  flip?: boolean;
}) {
  const dir = flip ? -1 : 1;
  return (
    <g stroke={feature} strokeLinecap="round">
      <line x1={x} y1={y} x2={x + dir * 5} y2={y - 5} strokeWidth={2} />
      <line x1={x} y1={y} x2={x + dir * 7} y2={y - 1} strokeWidth={2} />
      <line x1={x} y1={y} x2={x + dir * 7} y2={y + 3} strokeWidth={2} />
      <line x1={x} y1={y} x2={x + dir * 5} y2={y + 6} strokeWidth={2} />
    </g>
  );
}

function ChinHand({
  x,
  y,
  feature,
}: {
  x: number;
  y: number;
  feature: string;
}) {
  return (
    <g stroke={feature} strokeLinecap="round">
      <line x1={x - 3} y1={y} x2={x - 6} y2={y + 4} strokeWidth={2} />
      <line x1={x} y1={y + 1} x2={x - 1} y2={y + 5} strokeWidth={2} />
      <line x1={x + 3} y1={y} x2={x + 4} y2={y + 5} strokeWidth={2} />
    </g>
  );
}

interface RoundedStrokeProps {
  d: string;
  body: string;
  outline: string;
  strokeWidth?: number;
}

/** Trazo grueso con borde — base del estilo Figma para +, −, ×. */
export function RoundedStroke({
  d,
  body,
  outline,
  strokeWidth = 18,
}: RoundedStrokeProps) {
  const outlineWidth = strokeWidth + 4;

  return (
    <>
      <path
        d={d}
        stroke={outline}
        strokeWidth={outlineWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d={d}
        stroke={body}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  );
}

interface RoundedRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  body: string;
  outline: string;
  strokeWidth?: number;
}

export function RoundedRect({
  x,
  y,
  width,
  height,
  rx,
  body,
  outline,
  strokeWidth = 3,
}: RoundedRectProps) {
  return (
    <>
      <rect
        x={x - strokeWidth / 2}
        y={y - strokeWidth / 2}
        width={width + strokeWidth}
        height={height + strokeWidth}
        rx={rx + strokeWidth / 2}
        fill={outline}
      />
      <rect x={x} y={y} width={width} height={height} rx={rx} fill={body} />
    </>
  );
}

interface RoundedCircleProps {
  cx: number;
  cy: number;
  r: number;
  body: string;
  outline: string;
  strokeWidth?: number;
}

export function RoundedCircle({
  cx,
  cy,
  r,
  body,
  outline,
  strokeWidth = 3,
}: RoundedCircleProps) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r + strokeWidth / 2} fill={outline} />
      <circle cx={cx} cy={cy} r={r} fill={body} />
    </>
  );
}

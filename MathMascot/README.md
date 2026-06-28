# Math Mascot

Componentes React animados de mascotas matemáticas (`+`, `−`, `×`, `÷`) con estilo ilustrado (cuerpo redondeado, ojos expresivos, extremidades y gestos).

## Instalación

```bash
npm install framer-motion
# Copiá o linkeá esta carpeta en tu proyecto React
```

## Uso

```tsx
import { MathMascot } from './MathMascot/src';
import './MathMascot/src/styles.css';

<MathMascot
  mascotId="times"
  state="idle"
  dialogue="El × lo multiplica todo: esfuerzo, resultado."
  size={160}
/>
```

## Props

| Prop | Tipo | Default |
|------|------|---------|
| `mascotId` | `'plus' \| 'minus' \| 'times' \| 'div'` | — |
| `state` | `'idle' \| 'celebrate' \| 'error' \| 'thinking' \| 'talking'` | — |
| `dialogue` | `string` | `''` |
| `size` | `number` | `120` |
| `className` | `string` | — |

## Demo local

```bash
npm install
npm run demo
```

## Build

```bash
npm run build
```

Exporta desde `dist/` con tipos TypeScript. Ver `CUSTOMIZACION.md` para ajustar colores y formas SVG.

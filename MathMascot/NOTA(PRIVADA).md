# Math Mascot

## Estructura

MathMascot/
├── src/
│   ├── MathMascot.tsx      # Componente principal
│   ├── SpeechBubble.tsx    # Burbuja de diálogo
│   ├── animations.ts       # Variants de Framer Motion
│   ├── mascots/            # SVGs: plus, minus, times, div
│   ├── styles.css          # Animación de parpadeo
│   └── index.ts            # Exports tree-shakeable
├── demo/                   # Preview interactivo
└── README.md

## Uso en tu proyecto React

```bash
import { MathMascot } from './MathMascot/src';
import './MathMascot/src/styles.css'; // parpadeo de ojos (una vez)

<MathMascot
  mascotId="times"
  state="idle"
  dialogue="El × lo multiplica todo: esfuerzo, resultado."
  size={160}
/>
```


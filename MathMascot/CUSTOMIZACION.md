# Guía de customización — Math Mascot

Si querés que las mascotas queden **idénticas al Figma**, estos son los archivos que tenés que tocar.

## Mapa rápido

| Qué querés cambiar | Archivo |
|---|---|
| Colores (verde del ×, navy de ojos, etc.) | `src/themes.ts` |
| Forma del cuerpo (+, −, ×, ÷) | `src/mascots/MascotBodies.tsx` |
| Ojos, cejas, boca, mejillas | `src/mascots/MascotFace.tsx` |
| Brazos, piernas, manos, pies | `src/mascots/MascotLimbs.tsx` |
| Borde redondeado / trazo grueso | `src/mascots/shared/RoundedStroke.tsx` |
| Animaciones (flotar, shake, etc.) | `src/animations.ts` |
| Parpadeo de ojos | `src/styles.css` |

---

## 1. Colores exactos de Figma

Abrí `src/themes.ts`. Cada mascota tiene 5 colores:

```ts
times: {
  body: '#A4F52A',
  outline: '#7ED321',
  highlight: '#D4FF70',
  cheek: '#D4FF70',
  feature: '#002B5B',
},
```

**Tip:** en Figma, seleccioná un elemento → panel derecho → copiá el hex → pegalo acá.

---

## 2. Forma del × (u otro operador)

Abrí `src/mascots/MascotBodies.tsx`.

El × usa un path SVG de dos diagonales:

```ts
const TIMES_X = 'M 24 24 L 76 76 M 76 24 L 24 76';
```

- **Más grueso/fino:** cambiá `strokeWidth={20}` en `<RoundedStroke />`.
- **Más ancho/estrecho:** mové los puntos (ej. `M 20 20 L 80 80`).
- **Preview en vivo:** abrí [svgviewer.dev](https://www.svgviewer.dev/) y pegá el path.

---

## 3. Cara (ojos, cejas, boca)

Todo está en `src/mascots/MascotFace.tsx`.

- **Posición:** props `cx`, `cy`, `eyeOffsetX` (se pasan desde `MascotBodies.tsx`).
- **Tamaño de ojos:** constante `eyeSpan = 8` — subilo para ojos más grandes.
- **Cejas blancas:** componente `FigmaBrows` — grosor en `strokeWidth={4}`.
- **Expresiones por estado:** cada `if (state === '...')` tiene su propia cara.

---

## 4. Brazos y piernas

En `src/mascots/MascotLimbs.tsx`:

- **Pose idle (mano OK):** función `OkHand` + path del brazo derecho en `MascotArms`.
- **Dónde se unen al cuerpo:** `armAnchors` y `legAnchor` en `MascotBodies.tsx`:

```ts
armAnchors={[
  { x: 34, y: 38 },
  { x: 66, y: 38 },
]}
legAnchor={{ x: 50, y: 74 }}
```

---

## 5. Exportar desde Figma (método pro)

1. Seleccioná la mascota en Figma → **Export → SVG**.
2. Abrí el SVG en un editor de texto.
3. Copiá los `<path d="...">` y reemplazá el cuerpo en `MascotBodies.tsx`.
4. Copiá los colores `fill`/`stroke` a `themes.ts`.

---

## 6. Probar cambios

```bash
npm run demo
```

Abrí http://localhost:5173 — los cambios en `src/` se ven al instante con hot reload.

---

## Estructura visual (capas)

```
Piernas (atrás)
  ↓
Cuerpo (+ borde + brillos)
  ↓
Cara (ojos, cejas, mejillas, boca)
  ↓
Brazos (adelante)
```

Si un brazo tapa la cara, revisá el orden en `MascotLayers` dentro de `MascotBodies.tsx`.

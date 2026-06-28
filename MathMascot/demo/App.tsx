import { useState } from 'react';
import { MathMascot } from '../src';
import type { MascotId, MascotState } from '../src';

const MASCOTS: { id: MascotId; label: string; quote: string }[] = [
  {
    id: 'plus',
    label: '+ el entusiasta',
    quote: '¡Sumemos energía y ganas de aprender!',
  },
  {
    id: 'minus',
    label: '− el tranquilo',
    quote: 'Paso a paso, sin prisa pero sin pausa.',
  },
  {
    id: 'times',
    label: '× el serio',
    quote: 'El × lo multiplica todo: esfuerzo, resultado.',
  },
  {
    id: 'div',
    label: '÷ el filósofo',
    quote: 'Dividir un problema lo hace más claro.',
  },
];

const STATES: { id: MascotState; label: string }[] = [
  { id: 'celebrate', label: 'Celebrar 🎉' },
  { id: 'error', label: 'Error 😵' },
  { id: 'thinking', label: 'Pensar 🤔' },
  { id: 'talking', label: 'Hablar 💬' },
];

export function App() {
  const [mascotId, setMascotId] = useState<MascotId>('times');
  const [state, setState] = useState<MascotState>('idle');

  const selected = MASCOTS.find((m) => m.id === mascotId)!;

  return (
    <div className="demo">
      <header className="demo__header">
        <h1>Math Mascots</h1>
        <p>Mascotas de operadores con estilo Figma — listas para integrar en React.</p>
      </header>

      <div className="demo__picker">
        {MASCOTS.map((mascot) => (
          <button
            key={mascot.id}
            type="button"
            className={`demo__mascot-btn ${mascotId === mascot.id ? 'demo__mascot-btn--active' : ''}`}
            onClick={() => {
              setMascotId(mascot.id);
              setState('idle');
            }}
          >
            <MathMascot mascotId={mascot.id} state="idle" size={56} />
            <span>{mascot.label}</span>
          </button>
        ))}
      </div>

      <section className="demo__stage">
        <MathMascot
          mascotId={mascotId}
          state={state}
          dialogue={selected.quote}
          size={160}
        />
      </section>

      <div className="demo__actions">
        {STATES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`demo__action-btn ${state === item.id ? 'demo__action-btn--active' : ''}`}
            onClick={() => setState(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className={`demo__action-btn ${state === 'idle' ? 'demo__action-btn--active' : ''}`}
          onClick={() => setState('idle')}
        >
          Idle
        </button>
      </div>
    </div>
  );
}

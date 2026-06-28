import type { SpeechBubbleProps } from './types';

export function SpeechBubble({ text, className }: SpeechBubbleProps) {
  if (!text) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        maxWidth: 280,
        padding: '10px 16px',
        borderRadius: 14,
        border: '1px solid rgba(255, 255, 255, 0.18)',
        background: 'rgba(30, 35, 45, 0.95)',
        color: '#f5f7fa',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 14,
        lineHeight: 1.45,
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
      }}
    >
      {text}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -8,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid rgba(30, 35, 45, 0.95)',
        }}
      />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          bottom: -10,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '9px solid transparent',
          borderRight: '9px solid transparent',
          borderTop: '9px solid rgba(255, 255, 255, 0.18)',
          zIndex: -1,
        }}
      />
    </div>
  );
}

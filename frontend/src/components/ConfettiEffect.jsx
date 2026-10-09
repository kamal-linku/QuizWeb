import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiEffect({ trigger = true, duration = 3000 }) {
  useEffect(() => {
    if (!trigger) return;

    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [trigger, duration]);

  return null;
}


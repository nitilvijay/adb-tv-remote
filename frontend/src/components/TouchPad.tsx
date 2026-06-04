import React, { useState, useRef } from 'react';

interface TouchPadProps {
  onSwipe: (x1: number, y1: number, x2: number, y2: number, duration: number) => void;
  onTap: () => void;
}

const TouchPad: React.FC<TouchPadProps> = ({ onSwipe, onTap }) => {
  const [isMoving, setIsMoving] = useState(false);
  const startPos = useRef<{ x: number, y: number } | null>(null);
  const startTime = useRef<number>(0);

  const handleStart = (x: number, y: number) => {
    startPos.current = { x, y };
    startTime.current = Date.now();
    setIsMoving(false);
  };

  const handleEnd = (x: number, y: number) => {
    if (!startPos.current) return;

    const dx = x - startPos.current.x;
    const dy = y - startPos.current.y;
    const duration = Date.now() - startTime.current;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      onTap();
    } else {
      // Scale coordinates if necessary, but ADB usually uses absolute resolution.
      // For this demo, we'll send relative-like coordinates or map them.
      // ADB swipe: input swipe x1 y1 x2 y2 duration
      // We'll use a fixed coordinate system (e.g., 0-1000) for the pad.
      onSwipe(500, 500, 500 + dx, 500 + dy, duration);
    }
    startPos.current = null;
    setIsMoving(false);
  };

  return (
    <div 
      className="w-full h-48 bg-tv-card rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center relative overflow-hidden active:border-tv-primary transition-colors cursor-crosshair"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseUp={(e) => handleEnd(e.clientX, e.clientY)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
      onMouseMove={() => setIsMoving(true)}
    >
      <span className="text-gray-500 pointer-events-none select-none">
        {isMoving ? 'Swiping...' : 'Touchpad Area'}
      </span>
    </div>
  );
};

export default TouchPad;

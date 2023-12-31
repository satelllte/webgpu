'use client';
import {useEffect, useRef} from 'react';
import {useWindowSize} from 'usehooks-ts';

export function PlaygroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {width, height} = useWindowSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pixelRatio = Math.max(devicePixelRatio, 1);
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
  }, [width, height]);

  return <canvas ref={canvasRef} className='absolute h-full w-full' />;
}

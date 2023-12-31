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

  useEffect(() => {
    const run = async () => {
      if (!navigator.gpu) {
        showAlert('WebGPU is not supported in this browser');
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        showAlert('Failed to request WebGPU adapter');
        return;
      }

      console.debug('[WebGPU] adapter: ', adapter);
      console.debug('[WebGPU] adapter features: ', getAdapterFeatures(adapter));

      const device = await adapter.requestDevice();
      console.debug('[WebGPU] device: ', device);
    };

    void run();
  }, []);

  return <canvas ref={canvasRef} className='absolute h-full w-full' />;
}

const showAlert = (message: string) => {
  alert(message); // eslint-disable-line no-alert
};

const getAdapterFeatures = (adapter: GPUAdapter): string[] => {
  const features: string[] = [];
  adapter.features.forEach((feature) => {
    features.push(feature);
  });
  return features;
};

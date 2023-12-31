'use client';
import {useEffect, useRef} from 'react';
import {useWindowSize} from 'usehooks-ts';

export function PlaygroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {width, height} = useWindowSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scale = Math.max(devicePixelRatio, 1);
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
  }, [width, height]);

  useEffect(() => {
    const run = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const {gpu} = navigator;
      if (!gpu) {
        showAlert('WebGPU is not supported in this browser');
        return;
      }

      const context = canvas.getContext('webgpu');
      if (!context) {
        showAlert('Failed to get WebGPU context');
        return;
      }

      const adapter = await gpu.requestAdapter();
      if (!adapter) {
        showAlert('Failed to request WebGPU adapter');
        return;
      }

      const adapterInfo = await adapter.requestAdapterInfo();
      const adapterFeatures = getAdapterFeatures(adapter);

      gpuDebugLog('adapter: ', adapter);
      gpuDebugLog('adapter info: ', adapterInfo);
      gpuDebugLog('adapter features: ', adapterFeatures);

      const device = await adapter.requestDevice();
      gpuDebugLog('device: ', device);

      const gpuPreferredCanvasFormat = gpu.getPreferredCanvasFormat();

      context.configure({
        device,
        format: gpuPreferredCanvasFormat,
        alphaMode: 'premultiplied',
      });

      // eslint-disable-next-line no-warning-comments
      // TODO: Configure .wgsl shader files loader
      const shaderWgsl = `
        struct VertexOut {
          @builtin(position) position : vec4f,
          @location(0) color : vec4f
        }

        @vertex
        fn vertex_main(@location(0) position: vec4f, @location(1) color: vec4f) -> VertexOut
        {
          var output : VertexOut;
          output.position = position;
          output.color = color;
          return output;
        }

        @fragment
        fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
        {
          return fragData.color;
        }
      `;
      const shaderModule = device.createShaderModule({code: shaderWgsl});

      // prettier-ignore
      const vertices = new Float32Array([
         0.0,  0.6,  0.0,  1.0,  1.0,  0.0,  0.0,  1.0, // Point 0: XYZW + RGBA
        -0.5, -0.6,  0.0,  1.0,  0.0,  1.0,  0.0,  1.0, // Point 1: XYZW + RGBA
         0.5, -0.6,  0.0,  1.0,  0.0,  0.0,  1.0,  1.0, // Point 2: XYZW + RGBA
      ]);

      const verticesBuffer = device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST, // eslint-disable-line no-bitwise
      });

      device.queue.writeBuffer(verticesBuffer, 0, vertices, 0, vertices.length);

      const renderPipeline = device.createRenderPipeline({
        layout: 'auto',
        primitive: {topology: 'triangle-list'},
        vertex: {
          module: shaderModule,
          entryPoint: 'vertex_main',
          buffers: [
            {
              arrayStride: 32,
              stepMode: 'vertex',
              attributes: [
                {shaderLocation: 0, offset: 0, format: 'float32x4'}, // Position
                {shaderLocation: 1, offset: 16, format: 'float32x4'}, // Color
              ],
            },
          ] as const satisfies Iterable<GPUVertexBufferLayout>,
        },
        fragment: {
          module: shaderModule,
          entryPoint: 'fragment_main',
          targets: [
            {format: gpuPreferredCanvasFormat},
          ] as const satisfies Iterable<GPUColorTargetState>,
        },
      });
      gpuDebugLog('renderPipeline: ', renderPipeline);

      const commandEncoder = device.createCommandEncoder();
      gpuDebugLog('commandEncoder: ', commandEncoder);

      const passEncoder = commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            clearValue: [0.0, 0.0, 0.0, 1.0],
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store',
          },
        ] as const satisfies Iterable<GPURenderPassColorAttachment>,
      });
      gpuDebugLog('passEncoder: ', passEncoder);

      passEncoder.setPipeline(renderPipeline);
      passEncoder.setVertexBuffer(0, verticesBuffer);
      passEncoder.draw(3);
      passEncoder.end();

      device.queue.submit([commandEncoder.finish()]);
    };

    void run();
  }, []);

  return <canvas ref={canvasRef} className='absolute h-full w-full' />;
}

const showAlert = (message: string): void => {
  alert(message); // eslint-disable-line no-alert
};

const gpuDebugLog = (message: string, ...args: unknown[]): void => {
  console.debug(`[WebGPU] ${message}`, ...args);
};

const getAdapterFeatures = (adapter: GPUAdapter): string[] => {
  const features: string[] = [];
  adapter.features.forEach((feature) => {
    features.push(feature);
  });
  return features;
};

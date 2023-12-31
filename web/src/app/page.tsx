import {PlaygroundCanvas} from '@/components/PlaygroundCanvas';

export default function Home() {
  return (
    <div className='absolute inset-0 flex flex-col gap-4 p-6'>
      <h1 className='text-center text-3xl'>WebGPU playground</h1>
      <div className='relative flex-1 border border-white'>
        <PlaygroundCanvas />
      </div>
    </div>
  );
}

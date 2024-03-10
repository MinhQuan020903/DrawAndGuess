import Image from 'next/image';
import Canvas from './Canvas';

export default function Home() {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full">
        <Canvas></Canvas>
      </div>
    </main>
  );
}

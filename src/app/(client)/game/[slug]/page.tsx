'use client';
import { useState } from 'react';
import CustomCanvas from '@/components/CustomCanvas';
// import { cn } from '@/utils/utils';
import { Slider } from '@/components/ui/slider';
import ChatComponent from '@/components/chat';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PlayHeader from '@/components/headers/playHeader';
type SliderProps = React.ComponentProps<typeof Slider>;
export default function Page({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [color, setColor] = useState('#000000'); // Brush color
  const [clear, setClear] = useState(false); // Clear Mode 0 or 1
  const [selected, setSelected] = useState(0); // Color mode 0 to 5
  const [fillMode, setFillMode] = useState(false); // Paint/fill mode
  const [brushSize, setBrushSize] = useState(10);
  const colors = {
    black: '#000000',
    brown: '#732620',
    red: '#e61e10',
    yellow: '#e6c510',
    green: '#65e610',
    'dark green': '#2d5c0e',
    cyan: '#00FFFF',
    blue: ' #000080',
    eraser: '#ffffff',
  };
  return (
    <div className="flex flex-col gap-4 min-h-screen text-white p-24">
      <PlayHeader />
      {/* Body */}

      <div className="flex flex-row grow gap-4">
        <div className="basis-3/4 flex bg-white rounded-md">
          <CustomCanvas
            fillMode={fillMode}
            brushSize={brushSize}
            clear={clear}
            setClear={setClear}
            color={color}
            className="w-full"
          ></CustomCanvas>
        </div>
        <div className="basis-1/4 flex bg-green-400 rounded-full">
          <ChatComponent />
        </div>
      </div>
      <div className="flex w-[70%] h-16 bg-cyan-600 rounded-full">
        <div className="flex flex-row grow gap-2 justify-evenly">
          {Object.entries(colors).map(([key, value], index) => (
            <button
              key={key}
              className={selected == index ? `bg-black text-white p-2` : ''}
              onClick={() => {
                setColor(value);
                setSelected(index);
              }}
            >
              {key}
            </button>
          ))}

          <button
            onClick={() => {
              setClear(true);
            }}
          >
            clear
          </button>
          <button
            className="flex flex-row gap-2 items-center"
            onClick={() => {
              setFillMode(!fillMode);
            }}
          >
            <div
              style={{ background: fillMode ? 'lime' : 'red' }}
              className="h-4 w-4 rounded-full"
            ></div>{' '}
            {fillMode ? 'fill on' : 'fill off'}
          </button>
        </div>
      </div>
      <div className="flex w-[70%] h-12 bg-purple-500 rounded-full">
        <Slider
          defaultValue={[10]}
          onValueChange={(value: number[]) => {
            setBrushSize(value[0]);
          }}
          max={30}
          min={5}
          step={1}
        />
      </div>
    </div>
  );
}

'use client';

import { FC, useEffect, useState } from 'react';
import { useDraw } from '../hooks/useDraw';

import { io } from 'socket.io-client';
import { drawLine } from '../utils/drawLine';
import {
  ColorPicker,
  Hue,
  IColor,
  Saturation,
  useColor,
} from 'react-color-palette';

interface pageProps {}

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};
const room = 1;

console.log(process.env.NEXT_PUBLIC_SOCKET_BASE_URL);
const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL + `?room=${room}`, {
  transports: ['websocket', 'polling', 'flashsocket'],
});

export const Canvas = ({}) => {
  const [color, setColor] = useColor('#561ecb');

  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    console.log(socket);
    socket.emit('client-ready');

    socket.on('get-canvas-state', () => {
      console.log('I received the request');
      if (!canvasRef.current?.toDataURL()) return;
      console.log('sending canvas state');
      socket.emit('canvas-state', {
        canvasState: canvasRef.current.toDataURL(),
      });
    });

    socket.on('canvas-state-from-server', (data: { canvasState: string }) => {
      console.log('I received the state');
      const img = new Image();
      img.src = data.canvasState;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      'draw-line',
      (line: { prevPoint: Point; currentPoint: Point; color: IColor }) => {
        if (!ctx) return console.log('no ctx here');

        drawLine({ ...line, ctx });
      }
    );

    socket.on('clear', clear);

    return () => {
      socket.off('draw-line');
      socket.off('get-canvas-state');
      socket.off('canvas-state-from-server');
      socket.off('clear');
    };
  }, [canvasRef]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit('draw-line', { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, ctx, color });
  }

  return (
    <div className="w-full h-full bg-white flex justify-center items-center">
      <ColorPicker
        height={200}
        hideAlpha
        hideInput={['rgb', 'hsv']}
        color={color}
        onChange={setColor}
      />
      <div className="flex flex-col gap-10 pr-10 text-black">
        <button
          type="button"
          className="p-2 rounded-md border border-black text-black"
          onClick={() => socket.emit('clear')}
        >
          Clear canvas
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </div>
  );
};

export default Canvas;

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

const socket = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL + '/draw', {
  transports: ['websocket'],
  upgrade: true,
  reconnection: true,
  // transportOptions: {
  //   polling: {
  //     extraHeaders: {
  //       Authorization:
  //         'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0cmFuX3Zhbl9hIiwiaWF0IjoxNzE0ODk1OTM4LCJleHAiOjE3MTQ5ODIzMzh9.X_UBMFksH0JyKO47-gMKqruLrGiPTH4_axVxl57DoAk', // Thay bằng token thật
  //     },
  //   },
  // },
});

export const Canvas = ({}) => {
  const [color, setColor] = useColor('#561ecb');

  //For testing, randomize the user id
  //If want to change the user id, just F5 refresh the page
  //1 is the player, 0 is the guest
  const [id, setId] = useState(Math.round(Math.random()));
  const [isPlayer, setIsPlayer] = useState(false);
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    console.log(socket);
    console.log(id);
    //Fake user id (1 is the player, 2 is the guest)
    //Scenarios:
    //1. User with id 1 joins the room => User 1 is the player
    //2. User with id 0 joins the room => User 0 is the guest

    socket.emit('client-ready');

    socket.on('request-canvas-state', (data) => {
      console.log('🚀 ~ socket.on ~ data:', data);
      if (data.userId == id) {
        setIsPlayer(true);
        console.log('I am the player');
        console.log('sending canvas state');
      } else {
        console.log('I am the guest');
        console.log('requesting canvas state');
      }
      socket.emit('canvas-state', {
        canvasState: canvasRef!.current!.toDataURL(),
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
    if (isPlayer) {
      socket.emit('draw-line', { prevPoint, currentPoint, color });
      drawLine({ prevPoint, currentPoint, ctx, color });
    }
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

'use client';
import { useRef, useEffect, MouseEvent, useState } from 'react';
import {
  ColorPicker,
  Hue,
  IColor,
  Saturation,
  useColor,
} from 'react-color-palette';

import { useDraw } from '@/hooks/useDraw';

import { io } from 'socket.io-client';
import { drawLine } from '../utils/drawLine';
import { useRouter } from 'next/router';

interface CanvasProps {
  className: string;
  width: number;
  height: number;
  color: string;
  clear: boolean;
  brushSize: number;
  fillMode: boolean;
  setClear: (params: any) => any;
  session: any;
  roomId: string;
}

const CustomCanvas = (props: CanvasProps) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [lastMouseX, setLastMouseX] = useState<number | null>(null);
  const [lastMouseY, setLastMouseY] = useState<number | null>(null);

  const [socket, setSocket] = useState<any>(null);
  const { canvasRef, onMouseDown, clear } = useDraw(() => {});
  const [color, setColor] = useColor(props.color);

  function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
  }

  useEffect(() => {
    // Initialize socket only once and only if props.session is not null or undefined
    if (!socket && props.session) {
      const accessToken = props.session?.user?.access_token;
      setSocket(
        io(`${process.env.NEXT_PUBLIC_SOCKET_BASE_URL}/draw`, {
          transports: ['websocket'],
          query: {
            token: accessToken,
          },
        })
      );
    }
  }, [props.session]);

  useEffect(() => {
    if (!socket) return;
    const ctx = canvasRef.current?.getContext('2d');
    console.log(socket);
    socket.emit('subscribe-room', {
      roomId: props.roomId,
      user: props.session?.user,
    });

    socket.on('request-canvas-state', (data) => {
      console.log('I received the request: ', data);

      if (data.id === props.session?.user?.id) {
        if (canvasRef.current) {
          const dataURL = canvasRef.current.toDataURL();
          console.log('sending canvas state: ' + dataURL);
          socket.emit('canvas-state', {
            canvasState: dataURL,
          });
        } else {
          console.log('canvasRef is null');
        }
      }
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
      (line: {
        prevPoint: Point;
        currentPoint: Point;
        color: IColor;
        brushSize: number;
      }) => {
        if (!ctx) return console.log('no ctx here');

        drawLine({ ...line, ctx, brushSize: line.brushSize });
      }
    );

    socket.on('clear', clear);

    return () => {
      socket.off('draw-line');
      socket.off('request-canvas-state');
      socket.off('canvas-state-from-server');
      socket.off('clear');
    };
  }, [socket, canvasRef, clear]);

  useEffect(() => {
    if (canvasRef.current && props.clear) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;
      context.clearRect(0, 0, canvas.width, canvas.height);
      props.setClear(false);
      socket.emit('clear', true);
    }
  }, [props.clear]);

  function interpolate(
    x: number,
    y: number,
    x2: number,
    y2: number,
    context: CanvasRenderingContext2D
  ) {
    var a = x - x2;
    var b = y - y2;
    var c = Math.hypot(a, b);
    var interpolation = (20 / props.brushSize) * 40;
    if (c > 10) {
      for (var i = 1; i <= interpolation; i++) {
        context.fillStyle = props.color;
        context.beginPath();
        context.arc(
          x + i * ((x2 - x) / interpolation),
          y + i * ((y2 - y) / interpolation),
          props.brushSize,
          0,
          2 * Math.PI
        );
        context.fill();
      }
    }
  }

  function draw(e: MouseEvent) {
    if (canvasRef.current && mouseDown && !props.fillMode) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;
      var pos = getMousePos(canvas, e);
      var posx = pos.x;
      var posy = pos.y;
      if (lastMouseX !== null && lastMouseY !== null) {
        interpolate(lastMouseX, lastMouseY, posx, posy, context);
      }
      context.fillStyle = props.color;
      context.beginPath();
      context.arc(posx, posy, props.brushSize, 0, 2 * Math.PI);
      context.fill();
      setLastMouseX(posx);
      setLastMouseY(posy);

      // Emit the draw-line event to the socket with brush size
      socket.emit('draw-line', {
        prevPoint: { x: lastMouseX, y: lastMouseY },
        currentPoint: { x: posx, y: posy },
        color,
        brushSize: props.brushSize, // Include brush size here
      });
    }
  }

  function getPixel(imgData: Uint8ClampedArray, index: number) {
    var i = Math.floor(index * 4);
    var d = imgData;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]]; // Returns array [R,G,B,A]
  }

  function arraysEqual(a: number[], b: number[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function fill(e: MouseEvent) {
    if (canvasRef.current && props.fillMode) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;
      const pos = getMousePos(canvas, e);
      const x = Math.floor(pos.x);
      const y = Math.floor(pos.y);
      const imgd = context.getImageData(0, 0, canvas.width, canvas.height);
      const pix = imgd.data;

      const initialPixel = getPixel(pix, y * imgd.width + x);
      const filledPixels = new Set<string>();

      const stack = [[x, y]]; // Push the seed
      const fillColor = props.color;

      context.fillStyle = fillColor;

      while (stack.length > 0) {
        const currPos = stack.shift()!;
        var currX = currPos[0];
        var currY = currPos[1];
        const pixelKey = `${currX},${currY}`;

        if (
          currX >= 0 &&
          currX < canvas.width &&
          currY >= 0 &&
          currY < canvas.height &&
          !filledPixels.has(pixelKey) &&
          arraysEqual(initialPixel, getPixel(pix, currY * imgd.width + currX))
        ) {
          context.fillRect(currX, currY, 1, 1); // Fill the point with the foreground
          filledPixels.add(pixelKey);

          stack.push([currX + 1, currY]); // Fill the east neighbour
          stack.push([currX, currY + 1]); // Fill the south neighbour
          stack.push([currX - 1, currY]); // Fill the west neighbour
          stack.push([currX, currY - 1]); // Fill the north neighbour
        }
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onContextMenu={(event: MouseEvent) => event.preventDefault()}
      onClick={(event: MouseEvent) => {
        fill(event);
      }}
      onMouseDown={(event: MouseEvent) => {
        if (event.button == 0) {
          setMouseDown(true);
          const pos = getMousePos(canvasRef.current!, event);
          setLastMouseX(pos.x);
          setLastMouseY(pos.y);
        }
        onMouseDown(event); // Call onMouseDown function here
      }}
      onMouseLeave={() => {
        setMouseDown(false);
        setLastMouseX(null);
        setLastMouseY(null);
      }}
      onMouseUp={() => {
        setMouseDown(false);
        setLastMouseX(null);
        setLastMouseY(null);
      }}
      onMouseMove={draw}
      className={props.className}
      height={props.height}
      width={props.width}
    />
  );
};

CustomCanvas.defaultProps = {
  width: 1280,
  height: 500,
};
export default CustomCanvas;

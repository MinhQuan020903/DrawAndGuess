'use client';
import { useRef, useEffect, MouseEvent, useState } from 'react';
import { IColor, useColor } from 'react-color-palette';
import { useDraw } from '@/hooks/useDraw';
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
  socket: any;
  isPlayer: boolean;
  isPlaying: boolean;
}

const CustomCanvas = (props: CanvasProps) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [lastMouseX, setLastMouseX] = useState<number | null>(null);
  const [lastMouseY, setLastMouseY] = useState<number | null>(null);
  const { canvasRef, onMouseDown, clear } = useDraw(() => {});
  const [color, setColor] = useColor(props.color);

  useEffect(() => {
    if (!props.socket) return;

    if (!props.isPlaying) {
      clear();
    }

    const handleCanvasStateFromServer = (data: { canvasState: string }) => {
      const ctx = canvasRef.current?.getContext('2d');
      const img = new Image();
      img.src = data.canvasState;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    };

    const handleDrawLine = (line: {
      prevPoint: Point;
      currentPoint: Point;
      color: IColor;
      brushSize: number;
    }) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      drawLine({ ...line, ctx, brushSize: line.brushSize });
    };

    const handleClear = () => clear();

    props.socket.on('canvas-state-from-server', handleCanvasStateFromServer);
    props.socket.on('draw-line', handleDrawLine);
    props.socket.on('clear', handleClear);

    props.socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err);
    });

    props.socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });

    return () => {
      props.socket.off('canvas-state-from-server', handleCanvasStateFromServer);
      props.socket.off('draw-line', handleDrawLine);
      props.socket.off('clear', handleClear);
      props.socket.off('connect_error');
      props.socket.off('disconnect');
    };
  }, [canvasRef, props.socket, clear]);

  useEffect(() => {
    if (canvasRef.current && props.clear) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;
      context.clearRect(0, 0, canvas.width, canvas.height);
      props.setClear(false);
      props.socket.emit('clear', true);
    }
  }, [props.clear, props.socket, canvasRef]);

  function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
  }

  function interpolate(
    x: number,
    y: number,
    x2: number,
    y2: number,
    context: CanvasRenderingContext2D
  ) {
    const a = x - x2;
    const b = y - y2;
    const c = Math.hypot(a, b);
    const interpolation = (20 / props.brushSize) * 40;
    if (c > 10) {
      for (let i = 1; i <= interpolation; i++) {
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
      const pos = getMousePos(canvas, e);
      const posx = pos.x;
      const posy = pos.y;
      if (lastMouseX !== null && lastMouseY !== null) {
        interpolate(lastMouseX, lastMouseY, posx, posy, context);
      }
      context.fillStyle = props.color;
      context.beginPath();
      context.arc(posx, posy, props.brushSize, 0, 2 * Math.PI);
      context.fill();
      setLastMouseX(posx);
      setLastMouseY(posy);

      props.socket.emit('draw-line', {
        prevPoint: { x: lastMouseX, y: lastMouseY },
        currentPoint: { x: posx, y: posy },
        color,
        brushSize: props.brushSize,
      });
    }
  }

  function getPixel(imgData: Uint8ClampedArray, index: number) {
    const i = Math.floor(index * 4);
    const d = imgData;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]]; // Returns array [R,G,B,A]
  }

  function arraysEqual(a: number[], b: number[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
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
        const currX = currPos[0];
        const currY = currPos[1];
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
        if (!props.isPlayer) return;
        fill(event);
      }}
      onMouseDown={(event: MouseEvent) => {
        if (!props.isPlayer) return;
        if (event.button === 0) {
          setMouseDown(true);
          const pos = getMousePos(canvasRef.current!, event);
          setLastMouseX(pos.x);
          setLastMouseY(pos.y);
        }
        onMouseDown(event);
      }}
      onMouseLeave={() => {
        if (!props.isPlayer) return;
        setMouseDown(false);
        setLastMouseX(null);
        setLastMouseY(null);
      }}
      onMouseUp={() => {
        if (!props.isPlayer) return;
        setMouseDown(false);
        setLastMouseX(null);
        setLastMouseY(null);
      }}
      onMouseMove={(event: MouseEvent) => {
        if (!props.isPlayer) return;
        draw(event);
      }}
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

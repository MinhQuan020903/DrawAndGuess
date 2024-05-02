"use client";
import { useRef, useEffect, MouseEvent, useState } from "react";

interface CanvasProps {
  className: string;
  width: number;
  height: number;
  color: string;
  clear: boolean;
  brushSize: number;
  fillMode: boolean;
  setClear: (params: any) => any;
}

const CustomCanvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseDown, setmouseDown] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);
  function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
  }
  useEffect(() => {
    //console.log("clear");
    if (canvasRef.current && props.clear) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;
      context.clearRect(0, 0, canvas.width, canvas.height);
      console.log(canvas.toDataURL());
      props.setClear(false);
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
    var interpolation=(20/props.brushSize)*40
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
      const context = canvas.getContext("2d")!;
      var pos = getMousePos(canvas, e);
      var posx = pos.x;
      var posy = pos.y;
      if (lastMouseX != 0 || lastMouseY != 0) {
        interpolate(lastMouseX, lastMouseY, posx, posy, context);
      }
      context.fillStyle = props.color;
      context.beginPath();
      context.arc(posx, posy, props.brushSize, 0, 2 * Math.PI);
      context.fill();
      setLastMouseX(posx);
      setLastMouseY(posy);
    }
  }

  function getPixel(imgData: Uint8ClampedArray, index: number) {
    var i = Math.floor(index * 4);
    var d = imgData;
    //console.log("d",d);
    //console.log(i, d[i])
    return [d[i], d[i + 1], d[i + 2], d[i + 3]]; // Returns array [R,G,B,A]
  }

  function arraysEqual(a: number[], b: number[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  function fill(e: MouseEvent) {
    if (canvasRef.current && props.fillMode) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;
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
        var currX=currPos[0];
        var currY=currPos[1];
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
      onContextMenu={(event: MouseEvent)=>event.preventDefault()}
      onClick={(event: MouseEvent) => {fill(event)}}
      onMouseDown={(event: MouseEvent) => {
        if(event.button==0) setmouseDown(true);
      }}
      onMouseLeave={() => {
        setmouseDown(false);
        setLastMouseX(0);
        setLastMouseY(0);
      }}
      onMouseUp={() => {
        setmouseDown(false);
        setLastMouseX(0);
        setLastMouseY(0);
      }}
      onMouseMove={draw}
      className={props.className}
      ref={canvasRef}
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

import { IColor } from 'react-color-palette';

type DrawLineProps = {
  prevPoint: Point;
  currentPoint: Point;
  ctx: CanvasRenderingContext2D;
  color: IColor;
  brushSize: number;
};

export const drawLine = ({
  prevPoint,
  currentPoint,
  ctx,
  color,
  brushSize,
}: DrawLineProps) => {
  const { x: currX, y: currY } = currentPoint;
  const lineColor = color.hex ?? '#000000';
  const lineWidth = brushSize;

  let startPoint = prevPoint ?? currentPoint;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();

  // Draw a circle at the end point to ensure the stroke ends properly
  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(currX, currY, lineWidth / 2, 0, 2 * Math.PI);
  ctx.fill();
};

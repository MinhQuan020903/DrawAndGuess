import { IColor } from 'react-color-palette';

type DrawLineProps = {
  prevPoint: Point;
  currentPoint: Point;
  ctx: CanvasRenderingContext2D;
  color: IColor;
};

export const drawLine = ({
  prevPoint,
  currentPoint,
  ctx,
  color,
}: DrawLineProps) => {
  const { x: currX, y: currY } = currentPoint;
  const lineColor = color.hex ?? '#000000';
  const lineWidth = 5;

  let startPoint = prevPoint ?? currentPoint;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();

  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
  ctx.fill();
};

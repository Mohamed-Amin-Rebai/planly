"use client";

import { useState } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";

type Point = { x: number; y: number };

export default function LandSketcher({
  onAreaCalculate,
  onBoundaryChange,
}: {
  onAreaCalculate: (area: number) => void;
  onBoundaryChange: (points: number[][]) => void;
}) {
  const [points, setPoints] = useState<Point[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [currentPos, setCurrentPos] = useState<Point | null>(null);

  const scale = 10;

  const calcDistance = (a: Point, b: Point) => {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2) / scale;
  };

  const calcAngle = (a: Point, b: Point, c: Point) => {
    const angle =
      Math.atan2(c.y - b.y, c.x - b.x) -
      Math.atan2(a.y - b.y, a.x - b.x);
    let deg = (angle * 180) / Math.PI;
    return deg < 0 ? deg + 360 : deg;
  };

  const calculateArea = (pts: Point[]) => {
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      area += pts[i].x * pts[j].y;
      area -= pts[j].x * pts[i].y;
    }
    return Math.abs(area / 2 / (scale * scale));
  };

  const handleClick = (e: any) => {
    if (isFinished) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    setPoints([...points, { x: pos.x, y: pos.y }]);
  };

  const handleMove = (e: any) => {
    if (!points.length || isFinished) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (pos) setCurrentPos(pos);
  };

  const finishShape = () => {
    if (points.length < 3) return;

    setIsFinished(true);

    const area = calculateArea(points);
    onAreaCalculate(area);

    const polygon = points.map((p) => [p.x, p.y]);
    onBoundaryChange(polygon);
  };

  const clear = () => {
    setPoints([]);
    setIsFinished(false);
  };

  return (
    <div>
      <h3>Land Sketcher</h3>

      <Stage
        width={800}
        height={500}
        onClick={handleClick}
        onMouseMove={handleMove}
      >
        <Layer>

          {/* Points */}
          {points.map((p, i) => (
            <Circle
              key={i}
              x={p.x}
              y={p.y}
              radius={5}
              fill="black"
              draggable
              onDragMove={(e) => {
                const newPts = [...points];
                newPts[i] = { x: e.target.x(), y: e.target.y() };
                setPoints(newPts);
              }}
            />
          ))}

          {/* Polygon */}
          {points.length > 1 && (
            <Line
              points={points.flatMap((p) => [p.x, p.y])}
              stroke="black"
              closed={isFinished}
            />
          )}

          {/* Preview line */}
          {currentPos && points.length > 0 && !isFinished && (
            <Line
              points={[
                points[points.length - 1].x,
                points[points.length - 1].y,
                currentPos.x,
                currentPos.y,
              ]}
              stroke="gray"
              dash={[5, 5]}
            />
          )}

          {/* Distances */}
          {isFinished &&
            points.map((p, i) => {
              const next = points[(i + 1) % points.length];
              return (
                <Text
                  key={i}
                  x={(p.x + next.x) / 2}
                  y={(p.y + next.y) / 2}
                  text={`${calcDistance(p, next).toFixed(1)}m`}
                  fontSize={12}
                />
              );
            })}

          {/* Angles */}
          {isFinished &&
            points.map((p, i) => {
              const prev = points[(i - 1 + points.length) % points.length];
              const next = points[(i + 1) % points.length];

              return (
                <Text
                  key={`angle-${i}`}
                  x={p.x}
                  y={p.y - 10}
                  text={`${calcAngle(prev, p, next).toFixed(0)}°`}
                  fontSize={12}
                />
              );
            })}

          {/* Center area */}
          {isFinished && (
            <Text
              x={
                points.reduce((a, p) => a + p.x, 0) / points.length
              }
              y={
                points.reduce((a, p) => a + p.y, 0) / points.length
              }
              text={`${calculateArea(points).toFixed(1)} m²`}
              fontSize={16}
            />
          )}
        </Layer>
      </Stage>

      <button onClick={finishShape}>Finish</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
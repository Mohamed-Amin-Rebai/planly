"use client";

import { useState, useEffect } from "react";
import { Stage, Layer, Line, Circle, Text } from "react-konva";
import { Pencil, CheckCircle, RotateCcw, MapPin, Maximize2 } from "lucide-react";

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

  useEffect(() => {
    console.log("LandSketcher mounted");

    return () => {
      console.log("LandSketcher cleanup");
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100">
            <Pencil className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Land Sketcher</h3>
            <p className="text-xs text-gray-400">
              {!isFinished ? (
                points.length === 0 ? 'Click on the canvas to draw' : `${points.length} points placed`
              ) : (
                '✓ Boundary locked'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Point counter */}
          {points.length > 0 && !isFinished && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
              {points.length} points
            </span>
          )}

          {/* Action buttons */}
          <button
            onClick={finishShape}
            disabled={points.length < 3 || isFinished}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${points.length >= 3 && !isFinished
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <CheckCircle className="w-4 h-4" />
            Finish
          </button>

          <button
            onClick={clear}
            disabled={points.length === 0}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${points.length > 0
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 active:scale-95'
                : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }
            `}
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-200/50 bg-white">
        <Stage
          width={800}
          height={500}
          onClick={handleClick}
          onMouseMove={handleMove}
          className="w-full cursor-crosshair"
        >
          <Layer>
            {/* Grid pattern - subtle background */}
            <Line
              points={[0, 0, 800, 0, 800, 500, 0, 500, 0, 0]}
              stroke="#f3f4f6"
              strokeWidth={1}
              closed
              fill="#fafafa"
            />

            {/* Grid lines */}
            {Array.from({ length: 20 }, (_, i) => {
              const pos = i * 40;
              return [
                <Line
                  key={`h-${i}`}
                  points={[0, pos, 800, pos]}
                  stroke="#f0f0f0"
                  strokeWidth={0.5}
                  dash={[2, 4]}
                />,
                <Line
                  key={`v-${i}`}
                  points={[pos, 0, pos, 500]}
                  stroke="#f0f0f0"
                  strokeWidth={0.5}
                  dash={[2, 4]}
                />,
              ];
            })}

            {/* Points */}
            {points.map((p, i) => (
              <Circle
                key={i}
                x={p.x}
                y={p.y}
                radius={7}
                fill={isFinished ? '#10B981' : i === 0 ? '#8B5CF6' : '#6366F1'}
                stroke="#ffffff"
                strokeWidth={2}
                shadowColor="rgba(0,0,0,0.2)"
                shadowBlur={8}
                shadowOffsetY={2}
                draggable={!isFinished}
                onDragMove={(e) => {
                  if (isFinished) return;
                  const newPts = [...points];
                  newPts[i] = { x: e.target.x(), y: e.target.y() };
                  setPoints(newPts);
                }}
              />
            ))}

            {/* Point labels */}
            {points.map((p, i) => (
              <Text
                key={`label-${i}`}
                x={p.x + 10}
                y={p.y - 10}
                text={`${i + 1}`}
                fontSize={11}
                fontFamily="system-ui, sans-serif"
                fill="#6B7280"
                fontStyle="bold"
              />
            ))}

            {/* Polygon */}
            {points.length > 1 && (
              <Line
                points={points.flatMap((p) => [p.x, p.y])}
                stroke={isFinished ? '#10B981' : '#8B5CF6'}
                strokeWidth={2.5}
                closed={isFinished}
                fill={isFinished ? 'rgba(139, 92, 246, 0.1)' : undefined}
                shadowColor={isFinished ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)'}
                shadowBlur={isFinished ? 20 : 10}
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
                stroke="#9CA3AF"
                strokeWidth={1.5}
                dash={[6, 4]}
                opacity={0.6}
              />
            )}

            {/* Distances */}
            {isFinished &&
              points.map((p, i) => {
                const next = points[(i + 1) % points.length];
                const midX = (p.x + next.x) / 2;
                const midY = (p.y + next.y) / 2;
                const distance = calcDistance(p, next);

                return (
                  <Text
                    key={`dist-${i}`}
                    x={midX - 15}
                    y={midY - 8}
                    text={`${distance.toFixed(1)}m`}
                    fontSize={11}
                    fontFamily="system-ui, sans-serif"
                    fill="#6B7280"
                    fontStyle="bold"
                    offsetX={0}
                    offsetY={0}
                    shadowColor="rgba(255,255,255,0.8)"
                    shadowBlur={4}
                    shadowOpacity={1}
                  />
                );
              })}

            {/* Angles */}
            {isFinished &&
              points.map((p, i) => {
                const prev = points[(i - 1 + points.length) % points.length];
                const next = points[(i + 1) % points.length];
                const angle = calcAngle(prev, p, next);

                return (
                  <Text
                    key={`angle-${i}`}
                    x={p.x - 10}
                    y={p.y - 22}
                    text={`${angle.toFixed(0)}°`}
                    fontSize={10}
                    fontFamily="system-ui, sans-serif"
                    fill="#9CA3AF"
                    fontStyle="bold"
                    shadowColor="rgba(255,255,255,0.8)"
                    shadowBlur={4}
                    shadowOpacity={1}
                  />
                );
              })}

            {/* Center area */}
            {isFinished && points.length > 2 && (
              <Text
                x={
                  points.reduce((a, p) => a + p.x, 0) / points.length - 30
                }
                y={
                  points.reduce((a, p) => a + p.y, 0) / points.length - 10
                }
                text={`${calculateArea(points).toFixed(1)} m²`}
                fontSize={16}
                fontFamily="system-ui, sans-serif"
                fill="#7C3AED"
                fontStyle="bold"
                shadowColor="rgba(255,255,255,0.9)"
                shadowBlur={8}
                shadowOpacity={1}
              />
            )}

            {/* Empty state hint */}
            {points.length === 0 && !isFinished && (
              <Text
                x={280}
                y={230}
                text="Click anywhere to start drawing"
                fontSize={14}
                fontFamily="system-ui, sans-serif"
                fill="#D1D5DB"
                fontStyle="italic"
              />
            )}
          </Layer>
        </Stage>

        {/* Canvas overlay status */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-200/50 text-xs text-gray-600">
            {!isFinished ? (
              points.length === 0 ? '✏️ Click to draw' : '✏️ Drawing boundary'
            ) : (
              '✅ Boundary complete'
            )}
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-200/50 text-xs text-gray-600 flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3" />
            {isFinished ? `${calculateArea(points).toFixed(1)} m²` : points.length > 0 ? `${points.length} points` : 'Draw to begin'}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!isFinished && points.length < 3 && (
        <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200/50">
          <div className="p-1 rounded-lg bg-amber-100 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-amber-700 font-medium">
              {points.length === 0 ? 'Click on the canvas to place your first point' : `${3 - points.length} more points needed`}
            </p>
            <p className="text-xs text-amber-600/70 mt-0.5">
              {points.length === 0 ? 'Add at least 3 points to create a boundary' : 'Continue clicking to define your land boundary'}
            </p>
          </div>
        </div>
      )}

      {/* Success message */}
      {isFinished && (
        <div className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-200/50 animate-in slide-in-from-top-2 duration-300">
          <div className="p-1 rounded-lg bg-emerald-100">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-emerald-700 font-medium">
              Boundary complete! Area: {calculateArea(points).toFixed(1)} m²
            </p>
            <p className="text-xs text-emerald-600/70 mt-0.5">
              You can now proceed to the floorplan details
            </p>
          </div>
        </div>
      )}

      {/* Canvas size info */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>Click points to draw • Drag to adjust</span>
        <span>Scale: 1 unit = {scale}px</span>
      </div>
    </div>
  );
}
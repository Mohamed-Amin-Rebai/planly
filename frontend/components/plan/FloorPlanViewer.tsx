"use client";

import {
  Stage,
  Layer,
  Rect,
  Text,
  Group,
  Line,
} from "react-konva";
import { useEffect, useState } from "react";
import { Plan } from "@/lib/types";
import { Home, Ruler, ZoomIn, ZoomOut, Maximize, Minus, Plus } from "lucide-react";

type Props = {
  plan: Plan;
};

export default function FloorPlanViewer({
  plan,
}: Props) {

  // const viewportWidth = 800;
  // const planWidth = Math.max(
  //   ...plan.layout.rooms.map(
  //     (r:any) => r.x + r.width
  //   )
  // );
  // const SCALE =Math.min(20,viewportWidth / planWidth);
  const SCALE =20;


  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Zoom handlers
  const handleZoomIn = () => {
    setScale((s) => Math.min(s + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((s) => Math.max(s - 0.1, 0.3));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Calculate plan dimensions for better visualization
  const getPlanDimensions = () => {
    if (!plan.layout?.rooms || plan.layout.rooms.length === 0) {
      return { width: 800, height: 600 };
    }

    let maxX = 0;
    let maxY = 0;

    plan.layout.rooms.forEach((room: any) => {
      const right = room.x * SCALE + room.width * SCALE;
      const bottom = room.y * SCALE + room.height * SCALE;
      if (right > maxX) maxX = right;
      if (bottom > maxY) maxY = bottom;
    });

    return {
      width: Math.max(maxX + 40, 800),
      height: Math.max(maxY + 40, 600),
    };
  };

  const dimensions = getPlanDimensions();

  // Color palette for rooms
  const roomColors = [
    '#E8F5E9', // Bedroom - light green
    '#E3F2FD', // Bathroom - light blue
    '#FFF3E0', // Kitchen - light orange
    '#F3E5F5', // Living Room - light purple
    '#E0F7FA', // Garage - light cyan
    '#FCE4EC', // Office - light pink
    '#FFF8E1', // Dining Room - light yellow
    '#F1F8E9', // Hallway - light lime
    '#E8EAF6', // Closet - light indigo
    '#FBE9E7', // Utility - light deep orange
  ];

  const getRoomColor = (index: number) => {
    return roomColors[index % roomColors.length];
  };

  const getRoomStrokeColor = (index: number) => {
    const colors = [
      '#43A047', // Bedroom - green
      '#1E88E5', // Bathroom - blue
      '#FB8C00', // Kitchen - orange
      '#8E24AA', // Living Room - purple
      '#00ACC1', // Garage - cyan
      '#D81B60', // Office - pink
      '#F9A825', // Dining Room - yellow
      '#558B2F', // Hallway - lime
      '#3949AB', // Closet - indigo
      '#D84315', // Utility - deep orange
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    console.log("FloorPlanViewer mounted");

    return () => {
      console.log("FloorPlanViewer cleanup");
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with plan info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-violet-50/30 to-indigo-50/30 rounded-xl border border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100">
            <Home className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {plan.name || "Floorplan"}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {plan.layout?.rooms && (
                <>
                  <span>{plan.layout.rooms.length} rooms</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                </>
              )}
              {plan.area && (
                <span className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" />
                  {plan.area.toFixed(1)} m²
                </span>
              )}
            </div>
          </div>
        </div>

        

        {/* ZOOM CONTROLS */}
        <div className="flex items-center gap-1.5 bg-white rounded-xl border border-gray-200/50 p-1 shadow-sm">
          {/* Zoom level display */}
          <div className="px-2.5 py-1 text-xs font-medium text-gray-600 min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </div>
          
          <div className="w-px h-6 bg-gray-200" />
          
          {/* Zoom buttons */}
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.3}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${scale > 0.3
                ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-110 active:scale-95"
                : "text-gray-300 cursor-not-allowed"
              }
            `}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-110 active:scale-95 transition-all duration-200"
            aria-label="Reset zoom"
            title="Reset to 100%"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${scale < 3
                ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-110 active:scale-95"
                : "text-gray-300 cursor-not-allowed"
              }
            `}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="overflow-auto max-h-[700px] shadow-lg shadow-gray-200/50 border border-gray-200/50 bg-white">
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
          scaleX={scale}
          scaleY={scale}
          draggable
        >
          <Layer>
            {/* Background grid */}
            <Rect
              x={0}
              y={0}
              width={dimensions.width}
              height={dimensions.height}
              fill="#FAFAFA"
            />

            {/* Grid lines */}
            {Array.from({ length: Math.ceil(dimensions.width / 40) }, (_, i) => {
              const pos = i * 40;
              return (
                <Line
                  key={`grid-v-${i}`}
                  points={[pos, 0, pos, dimensions.height]}
                  stroke="#F0F0F0"
                  strokeWidth={0.5}
                  dash={[2, 4]}
                />
              );
            })}
            {Array.from({ length: Math.ceil(dimensions.height / 40) }, (_, i) => {
              const pos = i * 40;
              return (
                <Line
                  key={`grid-h-${i}`}
                  points={[0, pos, dimensions.width, pos]}
                  stroke="#F0F0F0"
                  strokeWidth={0.5}
                  dash={[2, 4]}
                />
              );
            })}

            {/* Rooms */}
            {plan.layout?.rooms?.map(
              (room: any, i: number) => {
                const color = getRoomColor(i);
                const strokeColor = getRoomStrokeColor(i);
                const x = room.x * SCALE;
                const y = room.y * SCALE;
                const width = room.width * SCALE;
                const height = room.height * SCALE;

                return (
                  <Group key={i}>
                    {/* Room shadow */}
                    <Rect
                      x={x + 2}
                      y={y + 2}
                      width={width}
                      height={height}
                      fill="rgba(0,0,0,0.05)"
                      shadowColor="rgba(0,0,0,0.1)"
                      shadowBlur={10}
                      shadowOffsetY={4}
                    />

                    {/* Room background */}
                    <Rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={color}
                      stroke={strokeColor}
                      strokeWidth={2}
                      cornerRadius={4}
                      shadowColor="rgba(0,0,0,0.05)"
                      shadowBlur={5}
                      shadowOffsetY={2}
                    />

                    {/* Room dimensions */}
                    <Text
                      text={`${room.width}m × ${room.height}m`}
                      x={x + 8}
                      y={y + height - 20}
                      fontSize={9}
                      fontFamily="system-ui, sans-serif"
                      fill="#666666"
                      fontStyle="normal"
                      opacity={0.7}
                    />

                    {/* Room name */}
                    <Text
                      text={room.name || `Room ${i + 1}`}
                      x={x + 8}
                      y={y + 10}
                      fontSize={13}
                      fontFamily="system-ui, sans-serif"
                      fill="#333333"
                      fontStyle="bold"
                    />

                    {/* Room area label */}
                    {room.width && room.height && (
                      <Text
                        text={`${(room.width * room.height).toFixed(1)} m²`}
                        x={x + 8}
                        y={y + 28}
                        fontSize={10}
                        fontFamily="system-ui, sans-serif"
                        fill="#888888"
                        fontStyle="normal"
                      />
                    )}

                    {/* Room number badge */}
                    <Rect
                      x={x + width - 28}
                      y={y + 8}
                      width={20}
                      height={20}
                      fill="rgba(255,255,255,0.8)"
                      stroke={strokeColor}
                      strokeWidth={1}
                      cornerRadius={10}
                      shadowColor="rgba(0,0,0,0.05)"
                      shadowBlur={4}
                    />
                    <Text
                      text={`${i + 1}`}
                      x={x + width - 22}
                      y={y + 12}
                      fontSize={10}
                      fontFamily="system-ui, sans-serif"
                      fill={strokeColor}
                      fontStyle="bold"
                      align="center"
                    />
                  </Group>
                );
              }
            )}

            {/* Doors */}
            {plan.layout?.doors?.map(
              (door: any, i: number) => {

                const room = plan.layout?.rooms?.find(
                  (r: any) =>
                    r.name === door.room
                );

                if (!room) return null;

                const x = room.x * SCALE;
                const y = room.y * SCALE;
                const width = room.width * SCALE;
                const height = room.height * SCALE;

                let points = [0, 0, 0, 0];

                switch (door.wall) {
                  case "north":
                    points = [
                      x + width / 2 - 10,
                      y,
                      x + width / 2 + 10,
                      y,
                    ];
                    break;

                  case "south":
                    points = [
                      x + width / 2 - 10,
                      y + height,
                      x + width / 2 + 10,
                      y + height,
                    ];
                    break;

                  case "east":
                    points = [
                      x + width,
                      y + height / 2 - 10,
                      x + width,
                      y + height / 2 + 10,
                    ];
                    break;

                  case "west":
                    points = [
                      x,
                      y + height / 2 - 10,
                      x,
                      y + height / 2 + 10,
                    ];
                    break;
                }

                return (
                  <Line
                    key={`door-${i}`}
                    points={points}
                    stroke={
                      door.type === "main"
                        ? "#7C3AED"
                        : "#8B4513"
                    }
                    strokeWidth={5}
                    lineCap="round"
                  />
                );
              }
            )}

            {/* Windows */}
            {plan.layout?.windows?.map(
              (window: any, i: number) => {

                const room = plan.layout?.rooms?.find(
                  (r: any) =>
                    r.name === window.room
                );

                if (!room) return null;

                const x = room.x * SCALE;
                const y = room.y * SCALE;
                const width =
                  room.width * SCALE;
                const height =
                  room.height * SCALE;

                let points = [0, 0, 0, 0];

                switch (window.wall) {
                  case "north":
                    points = [
                      x + width / 2 - 12,
                      y,
                      x + width / 2 + 12,
                      y,
                    ];
                    break;

                  case "south":
                    points = [
                      x + width / 2 - 12,
                      y + height,
                      x + width / 2 + 12,
                      y + height,
                    ];
                    break;

                  case "east":
                    points = [
                      x + width,
                      y + height / 2 - 12,
                      x + width,
                      y + height / 2 + 12,
                    ];
                    break;

                  case "west":
                    points = [
                      x,
                      y + height / 2 - 12,
                      x,
                      y + height / 2 + 12,
                    ];
                    break;
                }

                return (
                  <Line
                    key={`window-${i}`}
                    points={points}
                    stroke="#2196F3"
                    strokeWidth={4}
                    lineCap="round"
                  />
                );
              }
            )}

            {/* Empty state */}
            {(!plan.layout?.rooms || plan.layout.rooms.length === 0) && (
              <Group>
                <Rect
                  x={0}
                  y={0}
                  width={dimensions.width}
                  height={dimensions.height}
                  fill="#FAFAFA"
                />
                <Text
                  text="No rooms to display"
                  x={dimensions.width / 2 - 80}
                  y={dimensions.height / 2 - 10}
                  fontSize={16}
                  fontFamily="system-ui, sans-serif"
                  fill="#D1D5DB"
                  fontStyle="italic"
                />
                <Text
                  text="Generate your floorplan to see it here"
                  x={dimensions.width / 2 - 120}
                  y={dimensions.height / 2 + 20}
                  fontSize={13}
                  fontFamily="system-ui, sans-serif"
                  fill="#E5E7EB"
                  fontStyle="italic"
                />
              </Group>
            )}
          </Layer>
        </Stage>

        {/* Canvas overlay status */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-200/50 text-xs text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Plan loaded</span>
          </div>
        </div>

        {/* Room count badge */}
        {plan.layout?.rooms && plan.layout.rooms.length > 0 && (
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-200/50 text-xs text-gray-600 flex items-center gap-1.5">
              <Home className="w-3 h-3" />
              <span>{plan.layout.rooms.length} rooms</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {plan.layout?.rooms && plan.layout.rooms.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/50">
          <span className="text-xs font-medium text-gray-500">Legend:</span>
          {plan.layout.rooms.slice(0, 6).map((room: any, i: number) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: getRoomColor(i) }}
              />
              <span className="text-xs text-gray-600">{room.name || `Room ${i + 1}`}</span>
            </div>
          ))}
          {plan.layout.rooms.length > 6 && (
            <span className="text-xs text-gray-400">
              +{plan.layout.rooms.length - 6} more
            </span>
          )}
        </div>
      )}

      {/* Plan stats */}
      {plan.layout?.rooms && plan.layout.rooms.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-xl border border-gray-200/50 shadow-sm">
            <p className="text-xs text-gray-400">Total Rooms</p>
            <p className="text-lg font-bold text-gray-900">{plan.layout.rooms.length}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200/50 shadow-sm">
            <p className="text-xs text-gray-400">Total Area</p>
            <p className="text-lg font-bold text-gray-900">{plan.area?.toFixed(1) || '0'} m²</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200/50 shadow-sm">
            <p className="text-xs text-gray-400">Avg Room Size</p>
            <p className="text-lg font-bold text-gray-900">
              {plan.layout.rooms.length > 0 
                ? (plan.area / plan.layout.rooms.length).toFixed(1) 
                : '0'} m²
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200/50 shadow-sm">
            <p className="text-xs text-gray-400">Status</p>
            <p className="text-lg font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ready
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Point } from "@/lib/types";
import { MapPin, CheckCircle, RotateCcw, Maximize2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

export default function LandMapDrawer({
  onAreaCalculate,
  onBoundaryChange,
}: {
  onAreaCalculate: (area: number) => void;
  onBoundaryChange: (points: number[][]) => void;
}) {
  const [points, setPoints] = useState<Point[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (isFinished) return;

        setPoints((prev) => [
          ...prev,
          { lat: e.latlng.lat, lng: e.latlng.lng },
        ]);
      },
    });
    return null;
  };

  // ✅ Distance
  const calcDistance = (a: Point, b: Point) => {
    const R = 6371000;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLon = ((b.lng - a.lng) * Math.PI) / 180;

    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return R * c;
  };

  // ✅ Area
  const calcArea = () => {
    let total = 0;

    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      total +=
        points[i].lng * points[j].lat -
        points[j].lng * points[i].lat;
    }

    return Math.abs(total * 111319.9 * 111319.9 * 0.5);
  };

  // ✅ center
  const getCenter = () => {
    let lat = 0;
    let lng = 0;

    points.forEach((p) => {
      lat += p.lat;
      lng += p.lng;
    });

    return {
      lat: lat / points.length,
      lng: lng / points.length,
    };
  };

  const finish = () => {
    if (points.length < 3) return;

    setIsFinished(true);

    const area = calcArea();
    onAreaCalculate(area);

    const polygon = points.map((p) => [p.lat, p.lng]);
    onBoundaryChange(polygon);
  };

  const reset = () => {
    setPoints([]);
    setIsFinished(false);
  };

  // Custom marker icons
  const createMarkerIcon = (color: string = '#8B5CF6') => {
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 16px;
        height: 16px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: all 0.2s;
      "></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  const createLabelIcon = (html: string, isArea: boolean = false) => {
    return L.divIcon({
      className: "custom-label",
      html: `<div style="
        background: ${isArea ? 'rgba(139, 92, 246, 0.9)' : 'rgba(0, 0, 0, 0.75)'};
        color: white;
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,0.2);
        white-space: nowrap;
        font-family: system-ui, -apple-system, sans-serif;
        ${isArea ? 'background: linear-gradient(135deg, #8B5CF6, #6366F1);' : ''}
      ">${html}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100">
            <MapPin className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Draw on Map</h3>
            <p className="text-xs text-gray-400">
              {!isFinished ? (
                points.length === 0 ? 'Click on the map to add points' : `${points.length} points placed`
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
            onClick={finish}
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
            onClick={reset}
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
            Reset
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-200/50">
        <MapContainer
          center={[36.8, 10.18]}
          zoom={15}
          style={{ height: "500px", width: "100%" }}
          className="z-0"
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapClickHandler />

          {/* Drawing line */}
          {!isFinished && points.length > 1 && (
            <Polyline 
              positions={points} 
              pathOptions={{
                color: '#8B5CF6',
                weight: 3,
                opacity: 0.8,
                dashArray: '5, 5',
                lineJoin: 'round',
              }}
            />
          )}

          {/* Polygon */}
          {isFinished && (
            <Polygon 
              positions={points}
              pathOptions={{
                color: '#8B5CF6',
                weight: 3,
                opacity: 0.8,
                fillColor: '#8B5CF6',
                fillOpacity: 0.15,
                lineJoin: 'round',
              }}
            />
          )}

          {/* Points */}
          {points.map((p, i) => (
            <Marker
              key={i}
              position={[p.lat, p.lng]}
              draggable={!isFinished}
              icon={createMarkerIcon(
                isFinished ? '#10B981' : i === 0 ? '#8B5CF6' : '#6366F1'
              )}
              eventHandlers={{
                dragend: (e) => {
                  if (isFinished) return;
                  const updated = [...points];
                  updated[i] = e.target.getLatLng();
                  setPoints(updated);
                },
              }}
            />
          ))}

          {/* Distances */}
          {isFinished &&
            points.map((p, i) => {
              const next = points[(i + 1) % points.length];
              const distance = calcDistance(p, next);

              return (
                <Marker
                  key={`d-${i}`}
                  position={[
                    (p.lat + next.lat) / 2,
                    (p.lng + next.lng) / 2,
                  ]}
                  icon={createLabelIcon(`${distance.toFixed(1)}m`)}
                />
              );
            })}

          {/* Area */}
          {isFinished && points.length > 2 && (
            <Marker
              position={[getCenter().lat, getCenter().lng]}
              icon={createLabelIcon(`${calcArea().toFixed(1)} m²`, true)}
            />
          )}
        </MapContainer>

        {/* Map overlay status */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-200/50 text-xs text-gray-600">
            {!isFinished ? (
              points.length === 0 ? '📍 Click map to add points' : '✏️ Draw your boundary'
            ) : (
              '✅ Boundary complete'
            )}
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-200/50 text-xs text-gray-600 flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3" />
            {isFinished ? `${calcArea().toFixed(1)} m²` : points.length > 0 ? `${points.length} points` : 'Zoom to draw'}
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
              {points.length === 0 ? 'Click on the map to place your first point' : `${3 - points.length} more points needed`}
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
              Boundary complete! Area: {calcArea().toFixed(1)} m²
            </p>
            <p className="text-xs text-emerald-600/70 mt-0.5">
              You can now proceed to the floorplan details
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
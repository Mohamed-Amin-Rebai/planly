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

  return (
    <div>
      <h3>Draw on Map</h3>

      <MapContainer
        center={[36.8, 10.18]}
        zoom={15}
        style={{ height: "500px", width: "800px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />

        {/* Drawing line */}
        {!isFinished && points.length > 1 && (
          <Polyline positions={points} />
        )}

        {/* Polygon */}
        {isFinished && <Polygon positions={points} />}

        {/* Points */}
        {points.map((p, i) => (
          <Marker
            key={i}
            position={[p.lat, p.lng]}
            draggable
            icon={L.divIcon({
              className: "",
              iconSize: [10, 10],
            })}
            eventHandlers={{
              dragend: (e) => {
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

            return (
              <Marker
                key={`d-${i}`}
                position={[
                  (p.lat + next.lat) / 2,
                  (p.lng + next.lng) / 2,
                ]}
                icon={L.divIcon({
                  html: `${calcDistance(p, next).toFixed(1)}m`,
                })}
              />
            );
          })}

        {/* Area */}
        {isFinished && points.length > 2 && (
          <Marker
            position={[getCenter().lat, getCenter().lng]}
            icon={L.divIcon({
              html: `${calcArea().toFixed(1)} m²`,
            })}
          />
        )}
      </MapContainer>

      <button onClick={finish}>Finish</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
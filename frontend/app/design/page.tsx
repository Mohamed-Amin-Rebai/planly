"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoggedInNavbar from "@/components/navbar/LoggedInNavbar";
import FloorPlanForm from "@/components/design/FloorPlanForm";
import LandSketcher from "@/components/design/LandSketcher";
import { api } from "@/lib/api";

export default function Design() {
  const router = useRouter();

  const [mode, setMode] = useState<"canvas" | "map">("canvas");
  const [area, setArea] = useState(0);

  // placeholder state (we replace later)
  const [boundary, setBoundary] = useState<any>([
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ]);

  const handleGenerate = async (data: any) => {
    try {
        const res = await api.post("/plans", {
        name: data.title,
        boundary,
        constraints: {
            rooms: data.roomSetup,
            usedArea: data.usedArea,
            prompt: data.prompt,    
        },
        });

        const planId = res.data.id;

        await api.post(`/plans/${planId}/generate`);

        router.push(`/plan/${planId}`);
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div>
      <LoggedInNavbar />

      <h1>Design Page</h1>

      {/* Mode selector */}
      <div>
        <button onClick={() => setMode("canvas")}>
          Canvas Mode
        </button>

        <button onClick={() => setMode("map")}>
          Map Mode
        </button>
      </div>

      <div>
        <p>Current mode: {mode}</p>
      </div>

      {/* Placeholder for drawing */}
      <LandSketcher
        onAreaCalculate={setArea}
        onBoundaryChange={setBoundary}
        />

      {/* Placeholder for form */}
      <FloorPlanForm
        floorPlanArea={area} // placeholder for now
        onGenerate={handleGenerate}
        />

      <button onClick={handleGenerate}>
        Generate Plan
      </button>
    </div>
  );
}
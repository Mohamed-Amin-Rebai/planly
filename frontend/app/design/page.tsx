"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloorPlanForm from "@/components/design/FloorPlanForm";
import LandSketcher from "@/components/design/LandSketcher";
import { api } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";

const LandMapDrawer = dynamic(
  () => import("@/components/design/LandMapDrawer"),
  {
    ssr: false,
  }
);

export default function Design() {
  const router = useRouter();
  const { user } = useUser();

  const [mode, setMode] = useState<"canvas" | "map">("canvas");
  const [area, setArea] = useState(0);
  const [loading, setLoading] = useState(false); //to finish

  // placeholder state (we replace later)
  const [boundary, setBoundary] = useState<any>([
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ]);

  const handleGenerate = async (data: any) => {

    if (!user) return;
    try {

      console.log({
  clerkId: user?.id,
  name: data.title,
  boundary,
  constraints: {
    roomSetup: data.roomSetup,
    desiredBuiltArea: data.desiredBuiltArea,
    userPrompt: data.prompt,
  },
});
        const res = await api.post("/plans", {
        name: data.title,
        clerkId: user.id,
        boundary,
        constraints: {
            rooms: data.roomSetup,
            desiredBuiltArea: data.desiredBuiltArea,
            prompt: data.prompt,
        },
        });

        
        const planId = res.data.id;

        await api.post(`/plans/${planId}/generate`);

        router.push(`/plan/${planId}`);
    } catch (err : any) {
      console.log(err.response?.data);
      console.error(err);
    }
  };

  return (
    <div>

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
      {mode === "canvas" ? (
        <LandSketcher
          onAreaCalculate={setArea}
          onBoundaryChange={setBoundary}
        />
      ) : (
        <LandMapDrawer
          onAreaCalculate={setArea}
          onBoundaryChange={setBoundary}
        />
      )}

      {/* Placeholder for form */}
      <FloorPlanForm
        floorPlanArea={area} // placeholder for now
        onGenerate={handleGenerate}
        />

    </div>
  );
}
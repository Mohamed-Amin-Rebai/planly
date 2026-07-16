"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloorPlanForm from "@/components/design/FloorPlanForm";
import { api } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Brush, Loader2 } from "lucide-react";

const LandMapDrawer = dynamic(
  () => import("@/components/design/LandMapDrawer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading map...</div>
      </div>
    ),
  }
);

const LandSketcher = dynamic(
  () => import("@/components/design/LandSketcher"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading ...</div>
      </div>
    ),
  }
);

export default function Design() {
  const router = useRouter();
  const { user } = useUser();

  const [mode, setMode] = useState<"canvas" | "map">("canvas");
  const [area, setArea] = useState(0);
  const [loading, setLoading] = useState(false);

  const [boundary, setBoundary] = useState<number[][]>([
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ]);
  // const [boundary, setBoundary] = useState<number[][]>([]);

  const handleGenerate = async (data: any) => {
    if (loading) return;
    if (!user) {
      console.error("No user logged in");
      return;
    }

    // Validate required fields
    if (!data.title?.trim()) {
      console.error("Title is required");
      return;
    }

    if (!data.desiredBuiltArea || data.desiredBuiltArea <= 0) {
      console.error("Valid desired built area is required");
      return;
    }

    if (!boundary || boundary.length < 3) {
      console.error("Valid boundary is required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/plans", {
        name: data.title,
        clerkId: user.id,
        boundary,
        constraints: {
          roomSetup: data.roomSetup,
          desiredBuiltArea: data.desiredBuiltArea,
          userPrompt: data.prompt,
        },
      });

      console.log("PLAN CREATED");
      console.log(res.data);
      const planId = res.data.id;

      try {
        const generateRes = await api.post(`/plans/${planId}/generate`);
        console.log("PLAN GENERATED");
        console.log(generateRes.data);
      } catch (err: any) {
        console.log("GENERATE FAILED");
        console.log(err.response?.data);
      }

      router.push(`/plan/${planId}`);
    } catch (err: any) {
      console.error("Generation error:", err);

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Design Your Floorplan
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Draw your land and let AI generate your dream floorplan
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:inline">
              {area > 0 ? `${area.toFixed(2)} m²` : "No area selected"}
            </span>
            {area > 0 && (
              <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200/50">
                ✓ Land ready
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-6">
        <div className="inline-flex bg-white p-1 rounded-2xl shadow-sm border border-gray-200/50">
          <button
            onClick={() => setMode("canvas")}
            className={`
              relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
              ${
                mode === "canvas"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              }
            `}
          >
            <Brush size={18} className={mode === "canvas" ? "text-white" : "text-gray-400"} />
            <span>Canvas Mode</span>
            {mode === "canvas" && (
              <motion.div
                layoutId="mode-indicator"
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </button>

          <button
            onClick={() => setMode("map")}
            className={`
              relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
              ${
                mode === "map"
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              }
            `}
          >
            <Map size={18} className={mode === "map" ? "text-white" : "text-gray-400"} />
            <span>Map Mode</span>
            {mode === "map" && (
              <motion.div
                layoutId="mode-indicator"
                className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Drawing Area - Takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/50 overflow-hidden">
              <div className="p-4 border-b border-gray-100/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    {mode === "canvas" ? "Canvas Drawing" : "Map Drawing"}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {mode === "canvas" ? "✏️ Draw your land" : "📍 Click to add points"}
                </span>
              </div>
              <div className="p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Form Area - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/50 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-violet-50/50 to-indigo-50/50">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1 h-5 bg-gradient-to-b from-violet-600 to-indigo-600 rounded-full" />
                  Floorplan Details
                </h2>
              </div>
              <div className="p-4">
                <FloorPlanForm
                  floorPlanArea={area}
                  onGenerate={handleGenerate}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-violet-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Generating Your Floorplan</h3>
            <p className="text-sm text-gray-500 text-center">
              Our AI is crafting the perfect floorplan for your land...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ChatPanel from "@/components/plan/ChatPanel";
import { Plan } from "@/lib/types";
import { ArrowLeft, Home, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";

const FloorPlanViewer = dynamic(
  () => import("@/components/plan/FloorPlanViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading floormap...</div>
      </div>
    ),
  }
);

export default function PlanPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setError(null);
        const res = await api.get(`/plans/${id}`);
        setPlan(res.data);
      } catch (err: any) {
        console.error("Error fetching plan:", err);
        setError(err.response?.data?.message || "Failed to load plan");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlan();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Home className="w-6 h-6 text-violet-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Loading your plan</h3>
            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your floorplan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200/50 p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Plan Not Found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {error || "The plan you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/design")}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105 active:scale-95"
            >
              Create New Plan
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">

              <button
                onClick={() => router.push("/design")}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {plan.name || "Floorplan"}
                </h1>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>ID: #{id.slice(0, 8)}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    await api.post(`/plans/${plan.id}/finalize`);
                    setPlan({
                      ...plan,
                      status: "finalized",
                    });
                  } catch (err) {
                    console.error("Error finalizing plan:", err);
                  }
                }}
                disabled={plan.status === "finalized"}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
                  ${plan.status === "finalized"
                    ? "bg-emerald-100 text-emerald-700 cursor-not-allowed opacity-70"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95"
                  }
                `}
              >
                {plan.status === "finalized" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Finalized
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Finalize Plan
                  </>
                )}
              </button>
              <button
                onClick={() => router.push("/design")}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                New Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* <div className="grid lg:grid-cols-3 gap-6"> */}
        <div
          className={`grid gap-6 ${
            plan.status === "finalized"
              ? "grid-cols-1"
              : "lg:grid-cols-3"
          }`}
        >
          {/* FloorPlan Viewer - Takes 2/3 of the space */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            // className="lg:col-span-2"
            className={
              plan.status === "finalized"
              ? "col-span-1"
              : "lg:col-span-2"
            }
          >
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/50 overflow-hidden">
              <div className="p-4">
                <FloorPlanViewer plan={plan} />
              </div>
            </div>
          </motion.div>

          {/* Chat Panel - Takes 1/3 of the space */}
          {plan.status !== "finalized" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/50 overflow-hidden h-[calc(100vh-200px)]">
                <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-indigo-50/30 to-violet-50/30">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full" />
                    AI Assistant Chat
                  </h2>
                </div>
                <div className="h-[calc(100%-60px)]">
                  <ChatPanel
                    plan={plan}
                    onPlanUpdate={setPlan}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
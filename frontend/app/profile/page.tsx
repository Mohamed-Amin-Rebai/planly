"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { Plan } from "@/lib/types";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfilePlans from "@/components/profile/ProfilePlans";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPlans = async () => {
      try {
        const res = await api.get(`/plans/user/${user.id}`);
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user]);

  const generatedCount = plans.filter((p) => p.status === "generated").length;
  const finalizedCount = plans.filter((p) => p.status === "finalized").length;

  const handlePlanUpdate = (updatedPlan: Plan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  };

  const handlePlanDelete = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-violet-600" />
                  Profile
                </h1>
                <p className="text-xs text-gray-500">Manage your floorplans and account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Profile Card */}
        <ProfileCard user={user} />

        {/* Stats */}
        <ProfileStats 
          plans={plans}
          generatedCount={generatedCount}
          finalizedCount={finalizedCount}
        />

        {/* Plans */}
        <ProfilePlans
          plans={plans}
          loading={loading}
          onPlanUpdate={handlePlanUpdate}
          onPlanDelete={handlePlanDelete}
        />
      </div>
    </div>
  );
}
"use client";

import {
  Users,
  Home,
  Sparkles,
  CheckCircle,
  TrendingUp,
  ArrowUp,
} from "lucide-react";
import { DashboardProps } from "@/lib/types";

export default function Dashboard({
  totalUsers,
  totalPlans,
  generatedPlans,
  finalizedPlans,
}: DashboardProps) {
  const averagePlansPerUser =
    totalUsers > 0
      ? (totalPlans / totalUsers).toFixed(1)
      : "0";

  // Calculate percentages for visual indicators
  const generatedPercentage = totalPlans > 0 
    ? Math.round((generatedPlans / totalPlans) * 100) 
    : 0;
  const finalizedPercentage = totalPlans > 0 
    ? Math.round((finalizedPlans / totalPlans) * 100) 
    : 0;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200/50",
      trend: totalUsers > 0 ? "up" : "neutral",
      description: "Registered users",
    },
    {
      title: "Total Plans",
      value: totalPlans,
      icon: Home,
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200/50",
      trend: totalPlans > 0 ? "up" : "neutral",
      description: "Created floorplans",
    },
    {
      title: "Generated Plans",
      value: generatedPlans,
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      bgColor: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200/50",
      trend: generatedPlans > 0 ? "up" : "neutral",
      description: `${generatedPercentage}% of total`,
    },
    {
      title: "Finalized Plans",
      value: finalizedPlans,
      icon: CheckCircle,
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200/50",
      trend: finalizedPlans > 0 ? "up" : "neutral",
      description: `${finalizedPercentage}% of total`,
    },
    {
      title: "Avg Plans / User",
      value: averagePlansPerUser,
      icon: TrendingUp,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
      borderColor: "border-pink-200/50",
      trend: Number(averagePlansPerUser) > 1 ? "up" : "neutral",
      description: "Per active user",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Admin Dashboard
          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </h2>
        <p className="text-gray-500 flex items-center gap-2 mt-1">
          <span>Platform overview</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isUp = stat.trend === "up";

          return (
            <div
              key={stat.title}
              className={`
                group relative bg-white rounded-2xl border p-5 shadow-sm 
                hover:shadow-lg transition-all duration-300 hover:-translate-y-1
                ${stat.borderColor}
                border-gray-200/50
              `}
            >
              {/* Decorative gradient bar */}
              <div className={`
                absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} 
                rounded-t-2xl transition-all duration-300 group-hover:h-1.5
              `} />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      {isUp && Number(stat.value) > 0 && (
                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <ArrowUp className="w-2.5 h-2.5" />
                          Active
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300 origin-left">
                      {stat.value}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  </div>

                  <div className={`
                    p-3 rounded-xl bg-gradient-to-br ${stat.color} 
                    shadow-lg transition-all duration-300 
                    group-hover:scale-110 group-hover:shadow-xl
                  `}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Progress bar for visual interest */}
                {stat.title !== "Total Users" && stat.title !== "Avg Plans / User" && (
                  <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                      style={{ 
                        width: totalPlans > 0 
                          ? `${(Number(stat.value) / totalPlans) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
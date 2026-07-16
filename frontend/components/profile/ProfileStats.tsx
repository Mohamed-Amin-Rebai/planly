"use client";

import { Plan } from "@/lib/types";
import { Home, Sparkles, CheckCircle } from "lucide-react";

interface ProfileStatsProps {
  plans: Plan[];
  generatedCount: number;
  finalizedCount: number;
}

export default function ProfileStats({ plans, generatedCount, finalizedCount }: ProfileStatsProps) {
  const stats = [
    {
      label: "Total Plans",
      value: plans.length,
      icon: Home,
      gradient: "from-violet-500 to-indigo-500",
      bgGradient: "from-violet-50 to-indigo-50",
    },
    {
      label: "Generated",
      value: generatedCount,
      icon: Sparkles,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      label: "Finalized",
      value: finalizedCount,
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group relative bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Decorative background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Progress bar for visual interest */}
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-500`}
                  style={{ 
                    width: plans.length > 0 
                      ? `${(stat.value / plans.length) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
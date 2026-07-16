"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { HealthResponse } from "@/lib/types";

import {
  Activity,
  Database,
  Bot,
  Server,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function SystemStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await api.get("/health");
        setHealth(res.data);
      } catch (err) {
        console.error(err);
        setHealth({
          status: "offline",
          api: "offline",
          database: "offline",
          ai: "offline",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  const getStatusColor = (status: string) => {
    return status === "online" ? "bg-emerald-500" : "bg-red-500";
  };

  const getStatusBgColor = (status: string) => {
    return status === "online" ? "bg-emerald-50" : "bg-red-50";
  };

  const getStatusTextColor = (status: string) => {
    return status === "online" ? "text-emerald-700" : "text-red-700";
  };

  const getStatusIcon = (status: string) => {
    if (status === "online") return CheckCircle;
    if (status === "offline") return XCircle;
    return Loader2;
  };

  const getStatusGlow = (status: string) => {
    return status === "online" 
      ? "shadow-emerald-500/20" 
      : "shadow-red-500/20";
  };

  const cards = [
    {
      title: "API Status",
      value: health?.api ?? "loading",
      icon: Server,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Database Status",
      value: health?.database ?? "loading",
      icon: Database,
      gradient: "from-purple-500 to-violet-500",
    },
    {
      title: "AI Status",
      value: health?.ai ?? "loading",
      icon: Bot,
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`
          p-2.5 rounded-2xl transition-all duration-300
          ${health?.status === "online" ? "bg-emerald-100" : "bg-red-100"}
        `}>
          <Activity className={`
            w-5 h-5 transition-all duration-300
            ${health?.status === "online" ? "text-emerald-600" : "text-red-600"}
          `} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            System Status
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>Live health monitoring</span>
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200/50 p-12 text-center shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            <p className="text-gray-500 font-medium">Loading status...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            const StatusIcon = getStatusIcon(card.value);
            const isOnline = card.value === "online";
            const isOffline = card.value === "offline";
            const isLoading = card.value === "loading";

            return (
              <div
                key={card.title}
                className={`
                  group relative bg-white rounded-2xl border p-5 shadow-sm 
                  hover:shadow-lg transition-all duration-300 hover:-translate-y-1
                  ${getStatusBgColor(card.value)}
                  border-gray-200/50
                `}
              >
                {/* Decorative gradient bar */}
                <div className={`
                  absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} 
                  rounded-t-2xl transition-all duration-300 group-hover:h-1.5
                `} />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-600">
                          {card.title}
                        </p>
                        {!isLoading && (
                          <span className={`
                            text-[10px] font-medium px-1.5 py-0.5 rounded
                            ${isOnline ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}
                          `}>
                            {isOnline ? "Live" : "Down"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <div className={`
                          w-3 h-3 rounded-full transition-all duration-300
                          ${isOnline ? `bg-emerald-500 shadow-lg ${getStatusGlow(card.value)}` : ''}
                          ${isOffline ? `bg-red-500 shadow-lg ${getStatusGlow(card.value)}` : ''}
                          ${isLoading ? 'bg-gray-400 animate-pulse' : ''}
                        `} />
                        <span className={`
                          text-lg font-bold capitalize transition-colors duration-300
                          ${isOnline ? 'text-emerald-700' : ''}
                          ${isOffline ? 'text-red-700' : ''}
                          ${isLoading ? 'text-gray-400' : ''}
                        `}>
                          {card.value}
                        </span>
                      </div>
                    </div>

                    <div className={`
                      p-3 rounded-xl transition-all duration-300
                      ${isOnline ? 'bg-emerald-100 group-hover:bg-emerald-200' : ''}
                      ${isOffline ? 'bg-red-100 group-hover:bg-red-200' : ''}
                      ${isLoading ? 'bg-gray-100' : ''}
                    `}>
                      <Icon className={`
                        w-5 h-5 transition-all duration-300
                        ${isOnline ? 'text-emerald-600' : ''}
                        ${isOffline ? 'text-red-600' : ''}
                        ${isLoading ? 'text-gray-400 animate-pulse' : ''}
                      `} />
                    </div>
                  </div>

                  {/* Status icon badge */}
                  {!isLoading && (
                    <div className="absolute top-4 right-4">
                      <StatusIcon className={`
                        w-4 h-4
                        ${isOnline ? 'text-emerald-500' : ''}
                        ${isOffline ? 'text-red-500' : ''}
                      `} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
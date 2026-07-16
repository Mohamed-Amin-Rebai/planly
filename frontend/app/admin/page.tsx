"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Dashboard from "@/components/admin/Dashboard";
import UserManagement from "@/components/admin/UserManagement";
import PlanManagement from "@/components/admin/PlanManagement";
import SystemStatus from "@/components/admin/SystemStatus";

import { Shield, LayoutDashboard, Activity, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, plansRes] = await Promise.all([
          api.get("/users"),
          api.get("/plans"),
        ]);

        setUsers(usersRes.data);
        setPlans(plansRes.data);
      } catch (err) {
        console.error("Admin page error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-6 h-6 text-violet-600 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Loading Admin Dashboard</h3>
            <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span>Manage users, plans and system health</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Activity className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="space-y-8">
        
          {/* Dashboard Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Dashboard
              totalUsers={users.length}
              totalPlans={plans.length}
              generatedPlans={
                plans.filter((p: any) => p.status === "generated").length
              }
              finalizedPlans={
                plans.filter((p: any) => p.status === "finalized").length
              }
            />
          </motion.div>

          {/* User Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <UserManagement users={users} />
          </motion.div>

          {/* Plan Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <PlanManagement plans={plans} />
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <SystemStatus />
          </motion.div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200/50">
            <p>© {new Date().getFullYear()} Planly Admin Panel • All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
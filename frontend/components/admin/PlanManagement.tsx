"use client";

import {
  Home,
  Layers3,
  Calendar,
  User,
  Hash,
  CheckCircle,
  Clock,
  Pencil,
  FileText,
} from "lucide-react";
import { PlanManagementProps } from "@/lib/types";

export default function PlanManagement({
  plans,
}: PlanManagementProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200/50";
      case "generated":
        return "bg-blue-100 text-blue-700 border-blue-200/50";
      case "editing":
        return "bg-purple-100 text-purple-700 border-purple-200/50";
      case "finalized":
        return "bg-emerald-100 text-emerald-700 border-emerald-200/50";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200/50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return Clock;
      case "generated":
        return CheckCircle;
      case "editing":
        return Pencil;
      case "finalized":
        return FileText;
      default:
        return Clock;
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-500";
      case "generated":
        return "bg-blue-500";
      case "editing":
        return "bg-purple-500";
      case "finalized":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
          <Home className="w-5 h-5 text-violet-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Plan Management
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
              {plans.length} total
            </span>
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>Generated floorplans</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Layers3 className="w-3.5 h-3.5" />
                    Name
                  </div>
                </th>

                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Owner
                  </div>
                </th>

                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Status
                  </div>
                </th>

                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Created Date
                  </div>
                </th>

                <th className="px-4 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    Rooms
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {plans.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Home className="w-10 h-10 text-gray-300" />
                      <p className="text-gray-400 font-medium">No plans found</p>
                      <p className="text-xs text-gray-300">Plans will appear here once created</p>
                    </div>
                  </td>
                </tr>
              ) : (
                plans.map((plan, index) => {
                  const StatusIcon = getStatusIcon(plan.status);
                  const statusDotColor = getStatusDotColor(plan.status);

                  return (
                    <tr
                      key={plan.id}
                      className={`
                        border-b border-gray-100/50 last:border-b-0 
                        hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-indigo-50/50 
                        transition-all duration-200 group
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                      `}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 group-hover:scale-110 transition-transform duration-200">
                            <Layers3 className="w-4 h-4 text-violet-600" />
                          </div>
                          <span className="font-semibold text-gray-900 group-hover:text-violet-600 transition-colors duration-200">
                            {plan.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">
                            {plan.id.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="text-gray-600 font-mono text-xs">
                            {plan.id.slice(0, 12)}...
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`
                            inline-flex items-center gap-1.5 px-2.5 py-1.5 
                            rounded-full text-xs font-medium border
                            ${getStatusColor(plan.status)}
                          `}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {plan.status}
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor} animate-pulse ml-0.5`} />
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(plan.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-50 to-indigo-50 text-sm font-bold text-violet-600">
                            {plan.roomsCount}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {plans.length > 0 && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Showing {plans.length} plans</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  Draft: {plans.filter((p: any) => p.status === "draft").length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Generated: {plans.filter((p: any) => p.status === "generated").length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Editing: {plans.filter((p: any) => p.status === "editing").length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Finalized: {plans.filter((p: any) => p.status === "finalized").length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
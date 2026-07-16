"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plan } from "@/lib/types";
import { api } from "@/lib/api";
import { 
  Search, 
  Plus, 
  FolderOpen, 
  Edit2, 
  Trash2,
  ExternalLink,
  Calendar,
  Home,
  Loader2
} from "lucide-react";

interface ProfilePlansProps {
  plans: Plan[];
  loading: boolean;
  onPlanUpdate: (updatedPlan: Plan) => void;
  onPlanDelete: (id: string) => void;
}

export default function ProfilePlans({ 
  plans, 
  loading, 
  onPlanUpdate,
  onPlanDelete 
}: ProfilePlansProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRename = async (id: string) => {
    try {
      const res = await api.patch(`/plans/${id}`, {
        name: editingName,
      });

      onPlanUpdate(res.data);
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/plans/${id}`);
      onPlanDelete(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    }
  };

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
        return "📝";
      case "generated":
        return "✨";
      case "editing":
        return "🔄";
      case "finalized":
        return "✅";
      default:
        return "📋";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Create Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200/50 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 shadow-sm"
            placeholder="Search your plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => router.push("/design")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      {/* Plans List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200/50 p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            <p className="text-gray-500">Loading your plans...</p>
          </div>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/50 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">No plans found</p>
              <p className="text-sm text-gray-500 mt-1">
                {search ? "Try adjusting your search" : "Create your first floorplan"}
              </p>
            </div>
            <button
              onClick={() => router.push("/design")}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Create First Plan
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="group bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-violet-200/50 overflow-hidden"
            >
              {/* Status bar */}
              <div className={`h-1 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 ${
                plan.status === 'finalized' ? 'from-emerald-500 to-teal-500' :
                plan.status === 'generated' ? 'from-blue-500 to-cyan-500' :
                'from-violet-500 to-indigo-500'
              }`} />

              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Plan Info */}
                  <div className="flex-1 min-w-0">
                    {editingId === plan.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(plan.id);
                            if (e.key === "Escape") {
                              setEditingId(null);
                              setEditingName("");
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-gray-50 border border-violet-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(plan.id)}
                          className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                          }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-violet-600 transition-colors duration-300 truncate">
                        {plan.name}
                      </h3>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5" />
                        <span>{plan.roomsCount} rooms</span>
                      </div>
                      {plan.area && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{plan.area.toFixed(1)} m²</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)} flex items-center gap-1.5`}>
                      <span>{getStatusIcon(plan.status)}</span>
                      <span className="capitalize">{plan.status}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100/50">
                  <button
                    onClick={() => router.push(`/plan/${plan.id}`)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-medium shadow-md shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(plan.id);
                      setEditingName(plan.name);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200/50 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Rename
                  </button>

                  {deleteConfirmId === plan.id ? (
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs text-red-600 font-medium">Confirm?</span>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(plan.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-red-200/50 text-red-600 rounded-xl text-xs font-medium hover:bg-red-50 hover:border-red-300 hover:scale-105 active:scale-95 transition-all duration-200 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Results count */}
          <div className="text-center text-xs text-gray-400 pt-2">
            Showing {filteredPlans.length} of {plans.length} plans
          </div>
        </div>
      )}
    </div>
  );
}
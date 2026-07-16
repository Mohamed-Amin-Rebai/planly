"use client";

import { Users, User, Mail, Shield, Calendar, Hash, BadgeCheck } from "lucide-react";
import { UserManagementProps } from "@/lib/types";

export default function UserManagement({
  users,
}: UserManagementProps) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100">
          <Users className="w-5 h-5 text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            User Management
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
              {users.length} total
            </span>
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>Registered platform users</span>
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
                    <Hash className="w-3.5 h-3.5" />
                    ID
                  </div>
                </th>

                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Name
                  </div>
                </th>

                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </div>
                </th>

                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Role
                  </div>
                </th>

                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Created Date
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-10 h-10 text-gray-300" />
                      <p className="text-gray-400 font-medium">No users found</p>
                      <p className="text-xs text-gray-300">Users will appear here once they register</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const isAdmin = user.role === "admin";
                  
                  return (
                    <tr
                      key={user.id}
                      className={`
                        border-b border-gray-100/50 last:border-b-0 
                        hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 
                        transition-all duration-200 group
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}
                      `}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                            #{user.id.slice(0, 8)}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {user.name || "Unnamed User"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-600">
                            {user.email}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`
                            inline-flex items-center gap-1.5 px-2.5 py-1.5 
                            rounded-full text-xs font-medium border
                            ${isAdmin 
                              ? "bg-violet-100 text-violet-700 border-violet-200/50" 
                              : "bg-gray-100 text-gray-700 border-gray-200/50"
                            }
                          `}
                        >
                          {isAdmin ? (
                            <BadgeCheck className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {user.role}
                          {isAdmin && (
                            <span className={`w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse ml-0.5`} />
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
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
        {users.length > 0 && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200/50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Showing {users.length} users</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  Admins: {users.filter((u: any) => u.role === "admin").length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Users: {users.filter((u: any) => u.role !== "admin").length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
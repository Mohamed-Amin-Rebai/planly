"use client";

import { User } from "@clerk/nextjs/server";
import { Mail, Calendar } from "lucide-react";

interface ProfileCardProps {
  user: User | null;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        
        <div className="p-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full ring-4 ring-violet-50 shadow-lg overflow-hidden">
                <img
                  src={user.imageUrl || "/avatar.png"}
                  alt={user.fullName || "User avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 truncate">
                {user.fullName || "User"}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">
                    {user.emailAddresses?.[0]?.emailAddress || "No email"}
                  </span>
                </div>
                <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full" />
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200/50">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
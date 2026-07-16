"use client";

import { useRouter, usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { PencilRuler, Shield, House, Users } from "lucide-react";

export default function Header({
  role,
  signedIn,
}: {
  role: string;
  signedIn: boolean;
}) {

  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = role === "admin";

  // helper for active styling
  const isActive = (route: string) => pathname === route;

  const navItems = [
  {
    label: "Design",
    route: "/design",
    icon: PencilRuler,
  },
  {
    label: "Profile",
    route: "/profile",
    icon: Users,
  },
];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 backdrop-blur-xl bg-white/90 border-b border-gray-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <div 
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 group-hover:scale-105 transition-all duration-300">
            <House className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-violet-700 group-hover:to-indigo-700 transition-all duration-300">
            Planly
          </span>
        </div>

        {/* NAV */}
        <div className="items-center gap-1 text-sm">
          {!signedIn ? (
            // Unauthenticated users - show Login/Sign Up
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/sign-in")}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200 relative group"
              >
                Login
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
              <button
                onClick={() => router.push("/sign-up")}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          ) : (
            // Authenticated users - show navigation
            <div className="flex items-center gap-2">

              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.route);

                return (
                  <button
                    key={item.route}
                    onClick={() => router.push(item.route)}
                    className={`
                      group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300
                      ${
                        active
                          ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/50"
                          : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-sm"
                      }
                    `}
                  >
                    <Icon
                      size={17}
                      className={
                        active
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                      }
                    />

                    <span className="relative">
                      {item.label}
                      {!active && (
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      )}
                    </span>

                    {active && (
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full ml-0.5 animate-pulse" />
                    )}
                  </button>
                );
              })}

              {/* ADMIN */}
              {isAdmin && (
                <button
                  onClick={() => router.push("/admin")}
                  className={`
                    group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300
                    ${isActive("/admin")
                      ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 font-semibold shadow-sm border border-amber-100/50"
                      : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 hover:shadow-sm"
                    }
                  `}
                >
                  <Shield size={17} className={`
                    ${isActive("/admin") 
                      ? "text-amber-600" 
                      : "text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                    }
                  `} />
                  <span className="relative">
                    Admin
                    {!isActive("/admin") && (
                      <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    )}
                  </span>
                  {isActive("/admin") && (
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full ml-0.5 animate-pulse" />
                  )}
                </button>
              )}

              {/* DIVIDER */}
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1.5" />

              {/* USER */}
              <div className="flex items-center p-1 rounded-lg hover:bg-gray-100/80 transition-all duration-200 hover:shadow-sm">
                <UserButton />
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
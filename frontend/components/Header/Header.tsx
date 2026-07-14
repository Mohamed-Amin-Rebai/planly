"use client";

import { useRouter, usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { PencilRuler , Shield, House , Users } from "lucide-react";

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
    <header className="sticky top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <div 
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <House className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80 transition">
            Planly
          </span>
        </div>

        {/* NAV - Desktop */}
        <div className="items-center gap-1 text-sm">
          {!signedIn ? (
            // Unauthenticated users - show Login/Sign Up
            <>
              <button
                onClick={() => router.push("/sign-in")}
                className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/sign-up")}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-105"
              >
                Sign Up
              </button>
            </>
          ) : (
            // Authenticated users - show navigation
            <div className="flex items-center gap-3">

              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.route);

                return (
                  <button
                    key={item.route}
                    onClick={() => router.push(item.route)}
                    className={`
                      group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
                      ${
                        active
                          ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon
                      size={16}
                      className={
                        active
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      }
                    />

                    <span>{item.label}</span>

                    {active && (
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1" />
                    )}
                  </button>
                );
              })}

              {/* ADMIN - Admin only */}
              {isAdmin && (
                <button
                  onClick={() => router.push("/admin")}
                  className={`
                    group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
                    ${isActive("/admin")
                      ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Shield size={16} className={`
                    ${isActive("/admin") ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}
                  `} />
                  <span>Admin</span>
                  {isActive("/admin") && (
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full ml-1" />
                  )}
                </button>
              )}

              {/* DIVIDER */}
              <div className="w-px h-8 bg-gray-200 mx-1" />

              {/* USER */}
              <div className="flex items-center p-1 rounded-lg hover:bg-gray-100 transition">
                <UserButton />
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
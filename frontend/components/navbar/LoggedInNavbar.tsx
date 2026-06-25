"use client";

import { useRouter } from "next/navigation";

export default function LoggedInNavbar() {
  const router = useRouter();

  const logout = () => {
    // placeholder for now
    router.push("/login");
  };

  return (
    <div>
      <button onClick={() => router.push("/dashboard")}>
        Home
      </button>

      <button onClick={() => router.push("/dashboard")}>
        Design
      </button>

      <button onClick={() => router.push("/profile")}>
        Profile
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}
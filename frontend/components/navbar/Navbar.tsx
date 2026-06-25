"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push("/")}>
        Planly
      </button>
    </div>
  );
}
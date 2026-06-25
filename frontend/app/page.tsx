"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Navbar />
      <h1>Planly</h1>

      <p>
        Crafting your dream home, one plan at a time.
      </p>

      <button onClick={() => router.push("/signup")}>
        Start Designing
      </button>
    </div>
  );
}
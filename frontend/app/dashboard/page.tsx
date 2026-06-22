"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [boundary, setBoundary] = useState([
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
  ]);

  const [planId, setPlanId] = useState<string | null>(null);

  const createPlan = async () => {
    const res = await api.post("/plans", {
      name: "My House",
      boundary,
      constraints: {
        bedrooms: 2,
        bathrooms: 1,
      },
    });

    setPlanId(res.data.id);
  };

  const generatePlan = async () => {
    if (!planId) return;

    await api.post(`/plans/${planId}/generate`);
    window.location.href = `/plan/${planId}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <pre>{JSON.stringify(boundary, null, 2)}</pre>

      <button onClick={createPlan}>Create Plan</button>

      <button onClick={generatePlan} disabled={!planId}>
        Generate Plan
      </button>
    </div>
  );
}
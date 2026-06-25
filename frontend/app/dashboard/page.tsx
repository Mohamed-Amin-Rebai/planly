"use client";

import { useEffect, useState } from "react";
import { useRouter, redirect } from "next/navigation";
import LoggedInNavbar from "@/components/navbar/LoggedInNavbar";
import { api } from "@/lib/api";
import { useUser } from "@clerk/nextjs";

interface Plan {
  id: string;
  name: string;
  layout?: any;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch plans from YOUR backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans");
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  
  const { user } = useUser();
  if (!user) redirect("/sign-in");


  // ✅ Delete plan
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div>
      <LoggedInNavbar />

      <h1>Dashboard</h1>

      <button onClick={() => router.push("/dashboard")}>
        Generate New Plan
      </button>

      <h2>Your Plans</h2>

      {loading ? (
        <p>Loading...</p>
      ) : plans.length === 0 ? (
        <div>
          <p>No plans yet</p>
          <button onClick={() => router.push("/dashboard")}>
            Create first plan
          </button>
        </div>
      ) : (
        plans.map((plan) => (
          <div key={plan.id}>
            <h3>{plan.name}</h3>
            <p>{plan.createdAt}</p>

            <button onClick={() => router.push(`/plan/${plan.id}`)}>
              Open
            </button>

            <button onClick={() => router.push(`/dashboard`)}>
              Edit
            </button>

            <button onClick={() => handleDelete(plan.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
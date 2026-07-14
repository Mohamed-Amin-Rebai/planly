"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { Plan } from "@/lib/types";


export default function Profile() {
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
  if (!user) return;

  console.log("SYNCING USER");

  api.post("/users/sync", {
    clerkId: user.id,
    email: user.emailAddresses[0].emailAddress,
    name: user.firstName,
  })
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));
}, [user]);
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

      <h1>Profile</h1>

      <button onClick={() => router.push("/design")}>
        Generate New Plan
      </button>

      <h2>Your Plans</h2>

      {loading ? (
        <p>Loading...</p>
      ) : plans.length === 0 ? (
        <div>
          <p>No plans yet</p>
          <button onClick={() => router.push("/design")}>
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


            <button onClick={() => handleDelete(plan.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
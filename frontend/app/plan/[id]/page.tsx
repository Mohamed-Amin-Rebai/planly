"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoggedInNavbar from "@/components/navbar/LoggedInNavbar";
import { api } from "@/lib/api";
import { Stage, Layer, Rect, Text } from "react-konva";

interface Plan {
  id: string;
  name: string;
  layout?: any;
}

export default function PlanPage({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/plans/${id}`);
        setPlan(res.data);
      } catch (err) {
        console.error("Error fetching plan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  if (loading) return <div>Loading plan...</div>;
  if (!plan) return <div>Plan not found</div>;

  return (
    <div>
      <LoggedInNavbar />

      <h1>Generated Plan</h1>

      <div>
        <h2>{plan.name}</h2>

        <Stage width={800} height={600}>
          <Layer>
            {plan.layout?.rooms?.map((room: any, i: number) => (
              <>
                <Rect
                  key={i}
                  x={room.x * 20}
                  y={room.y * 20}
                  width={room.width * 20}
                  height={room.height * 20}
                  stroke="black"
                />

                <Text
                  text={room.name}
                  x={room.x * 20}
                  y={room.y * 20}
                  fontSize={12}
                />
              </>
            ))}
          </Layer>
        </Stage>
      </div>

      <div>
        <button onClick={() => router.push("/dashboard")}>
          Start New Plan
        </button>

        <button onClick={() => router.push(`/dashboard`)}>
          Modify Plan
        </button>
      </div>
    </div>
  );
}
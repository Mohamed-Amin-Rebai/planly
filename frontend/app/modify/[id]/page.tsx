"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import LoggedInNavbar from "@/components/navbar/LoggedInNavbar";

type RoomSetupType = {
  [roomType: string]: number;
};

export default function ModifyPage({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedRooms, setSelectedRooms] = useState<
    { type: string; index: number }[]
  >([]);

  const [roomSizes, setRoomSizes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/plans/${id}`);
        setPlan(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleSelect = (type: string, index: number) => {
    const key = `${type}-${index}`;

    const exists = selectedRooms.some(
      (r) => r.type === type && r.index === index
    );

    if (!exists) {
      setSelectedRooms([...selectedRooms, { type, index }]);
      setRoomSizes((prev) => ({ ...prev, [key]: 50 }));
    }
  };

  const handleSize = (type: string, index: number, value: number) => {
    const key = `${type}-${index}`;
    setRoomSizes((prev) => ({ ...prev, [key]: value }));
  };

  const applyChanges = async () => {
    if (!selectedRooms.length) return;

    const modified = selectedRooms.map((r) => {
      const key = `${r.type}-${r.index}`;

      return {
        roomType: r.type,
        index: r.index,
        size: roomSizes[key],
      };
    });

    try {
      await api.patch(`/plans/${id}`, {
        modifiedRooms: modified,
      });

      router.push(`/plan/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!plan) return <div>Plan not found</div>;

  const rooms = plan.constraints?.rooms || {};

  return (
    <div>
      <LoggedInNavbar />

      <h1>Modify Plan</h1>

      {/* Room list */}
      <div>
        {Object.entries(rooms).map(([type, count]: any) => {
          return Array.from({ length: count }).map((_, i) => (
            <button key={`${type}-${i}`} onClick={() => handleSelect(type, i)}>
              {type} #{i + 1}
            </button>
          ));
        })}
      </div>

      {/* Selected rooms */}
      {selectedRooms.length > 0 && (
        <div>
          <h2>Adjust sizes</h2>

          {selectedRooms.map((r) => {
            const key = `${r.type}-${r.index}`;

            return (
              <div key={key}>
                <p>
                  {r.type} #{r.index + 1} — {roomSizes[key]}m²
                </p>

                <input
                  type="range"
                  min={20}
                  max={100}
                  value={roomSizes[key]}
                  onChange={(e) =>
                    handleSize(r.type, r.index, +e.target.value)
                  }
                />
              </div>
            );
          })}

          <button onClick={applyChanges}>
            Apply Changes
          </button>
        </div>
      )}

      <button onClick={() => router.push(`/plan/${id}`)}>
        Back
        </button>
    </div>
  );
}
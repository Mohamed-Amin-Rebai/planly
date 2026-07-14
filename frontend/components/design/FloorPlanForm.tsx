"use client";

import { useState, useEffect } from "react";
import { RoomSetupType } from "@/lib/types";


export default function FloorPlanForm({
  floorPlanArea,
  onGenerate,
}: {
  floorPlanArea: number;
  onGenerate: (data: {
    desiredBuiltArea: number;
    roomSetup: RoomSetupType;
    title: string;
    prompt: string,
  }) => void;
}) {
  const [title, setTitle] = useState("My Plan");
  const [desiredBuiltArea, setDesiredBuiltArea] = useState(0);
  const [roomSetup, setRoomSetup] = useState<RoomSetupType>({});
  const [isValid, setIsValid] = useState(false);
  const [prompt, setPrompt] = useState("");

  const roomTypes = [
    "Bedroom",
    "Bathroom",
    "Kitchen",
    "Living Room",
    "Garage",
    "Office",
    "Dining Room",
  ];

  // ✅ validation
  useEffect(() => {
    let valid = true;

    // area check
    if (desiredBuiltArea <= 0 || desiredBuiltArea > floorPlanArea) {
      valid = false;
    }

    // at least 1 room
    const hasRoom = Object.values(roomSetup).some((c) => c > 0);
    if (!hasRoom) {
      valid = false;
    }

    setIsValid(valid);
  }, [desiredBuiltArea, roomSetup, floorPlanArea]);

  // ✅ update rooms
  const handleRoomChange = (type: string, count: number) => {
    setRoomSetup((prev) => ({
      ...prev,
      [type]: count,
    }));
  };

  // ✅ submit
  const handleSubmit = () => {
    if (!isValid) {
      console.log("Invalid form");
      return;
    }

    onGenerate({ title, desiredBuiltArea, roomSetup, prompt});
  };

  return (
    <div>
      <h2>Floor Plan Form</h2>

      {/* Title */}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Used Area */}
      <input
        type="number"
        placeholder="Used area"
        value={desiredBuiltArea}
        onChange={(e) => setDesiredBuiltArea(+e.target.value)}
      />

      {/* Rooms */}
      <div>
        <p>Rooms</p>

        {roomTypes.map((type) => (
          <input
            key={type}
            type="number"
            placeholder={type}
            onChange={(e) =>
              handleRoomChange(type, +e.target.value)
            }
          />
        ))}
      </div>

      <input
        placeholder="Describe your house..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Generate Plan
      </button>
    </div>
  );
}


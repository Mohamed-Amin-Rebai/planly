"use client";

import { useState, useEffect } from "react";

type RoomSetupType = {
  [roomType: string]: number;
};

export default function FloorPlanForm({
  floorPlanArea,
  onGenerate,
}: {
  floorPlanArea: number;
  onGenerate: (data: {
    usedArea: number;
    roomSetup: RoomSetupType;
    title: string;
    prompt: string,
  }) => void;
}) {
  const [title, setTitle] = useState("My Plan");
  const [usedArea, setUsedArea] = useState(0);
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
    if (usedArea <= 0 || usedArea > floorPlanArea) {
      valid = false;
    }

    // at least 1 room
    const hasRoom = Object.values(roomSetup).some((c) => c > 0);
    if (!hasRoom) {
      valid = false;
    }

    setIsValid(valid);
  }, [usedArea, roomSetup, floorPlanArea]);

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

    onGenerate({ title, usedArea, roomSetup, prompt});
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
        value={usedArea}
        onChange={(e) => setUsedArea(+e.target.value)}
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


"use client";

import { useState, useEffect } from "react";
import { RoomSetupType } from "@/lib/types";
import { 
  Home, 
  Ruler, 
  Bed, 
  Bath, 
  Utensils, 
  Sofa, 
  Car, 
  Briefcase, 
  Coffee,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function FloorPlanForm({
  floorPlanArea,
  onGenerate,
  loading,
}: {
  floorPlanArea: number;
  onGenerate: (data: {
    desiredBuiltArea: number;
    roomSetup: RoomSetupType;
    title: string;
    prompt: string,
  }) => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState("My Plan");
  const [desiredBuiltArea, setDesiredBuiltArea] = useState(0);
  const [roomSetup, setRoomSetup] = useState<RoomSetupType>({});
  const [isValid, setIsValid] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const roomTypes = [
    "Bedroom",
    "Bathroom",
    "Kitchen",
    "Living Room",
    "Garage",
    "Office",
    "Dining Room",
  ];

  const roomIcons: Record<string, any> = {
    "Bedroom": Bed,
    "Bathroom": Bath,
    "Kitchen": Utensils,
    "Living Room": Sofa,
    "Garage": Car,
    "Office": Briefcase,
    "Dining Room": Coffee,
  };

  // validation
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

  // update rooms
  const handleRoomChange = (type: string, count: number) => {
    setRoomSetup((prev) => ({
      ...prev,
      [type]: count,
    }));
    setTouched((prev) => ({ ...prev, [type]: true }));
  };

  // submit
  const handleSubmit = () => {
    if (!isValid) {
      console.log("Invalid form");
      return;
    }

    onGenerate({ title, desiredBuiltArea, roomSetup, prompt});
  };

  const totalRooms = Object.values(roomSetup).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-5">
      {/* Title Field */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Home className="w-4 h-4 text-gray-400" />
          Plan Title
        </label>
        <input
          placeholder="e.g., My Dream Home"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
        />
      </div>

      {/* Used Area Field */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Ruler className="w-4 h-4 text-gray-400" />
          Desired Built Area (m²)
          <span className="ml-auto text-xs text-gray-400">
            Max: {floorPlanArea > 0 ? floorPlanArea.toFixed(2) : '0'} m²
          </span>
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="Enter desired area"
            value={desiredBuiltArea || ''}
            onChange={(e) => setDesiredBuiltArea(+e.target.value)}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200
              ${desiredBuiltArea > 0 && desiredBuiltArea <= floorPlanArea 
                ? 'border-emerald-300 focus:border-emerald-500' 
                : desiredBuiltArea > 0 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-violet-500'
              }`}
          />
          {desiredBuiltArea > 0 && desiredBuiltArea <= floorPlanArea && (
            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
          )}
          {desiredBuiltArea > 0 && desiredBuiltArea > floorPlanArea && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
          )}
        </div>
        {desiredBuiltArea > 0 && desiredBuiltArea > floorPlanArea && (
          <p className="text-xs text-red-500 mt-1">
            Desired area exceeds total land area
          </p>
        )}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                desiredBuiltArea > 0 
                  ? desiredBuiltArea <= floorPlanArea 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                  : 'bg-gray-200'
              }`}
              style={{ 
                width: floorPlanArea > 0 
                  ? `${Math.min((desiredBuiltArea / floorPlanArea) * 100, 100)}%` 
                  : '0%' 
              }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500 min-w-[40px]">
            {floorPlanArea > 0 ? Math.round((desiredBuiltArea / floorPlanArea) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Home className="w-4 h-4 text-gray-400" />
            Rooms
          </label>
          {totalRooms > 0 && (
            <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full font-medium">
              {totalRooms} room{totalRooms > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {roomTypes.map((type) => {
            const Icon = roomIcons[type] || Home;
            const count = roomSetup[type] || 0;
            const isTouched = touched[type];

            return (
              <div key={type} className="group">
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200">
                  <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    count > 0 
                      ? 'bg-violet-100 text-violet-600' 
                      : 'bg-gray-200/50 text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <label className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                    {type}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRoomChange(type, Math.max(0, count - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center justify-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={count === 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-700">
                      {count}
                    </span>
                    <button
                      onClick={() => handleRoomChange(type, count + 1)}
                      className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-md hover:shadow-violet-500/25 transition-all duration-200 flex items-center justify-center text-sm font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
                {isTouched && count === 0 && (
                  <p className="text-xs text-amber-500 mt-0.5 ml-12">
                    Add at least one room
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Prompt Field */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Sparkles className="w-4 h-4 text-gray-400" />
          Description (Optional)
        </label>
        <textarea
          placeholder="Describe your dream house in detail... e.g., open concept, large windows, modern style"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 resize-none"
        />
        <p className="text-xs text-gray-400">
          {prompt.length > 0 ? `${prompt.length} characters` : 'Add details to help AI generate better results'}
        </p>
      </div>

      {/* Validation Status */}
      <div className="flex items-center gap-2 text-xs">
        {!isValid && (
          <div className="flex items-center gap-1.5 text-amber-600">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Please complete all required fields</span>
          </div>
        )}
        {isValid && (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Ready to generate</span>
          </div>
        )}
        <span className="ml-auto text-gray-400">
          {floorPlanArea > 0 ? `${floorPlanArea.toFixed(2)} m² available` : 'Draw your land first'}
        </span>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !isValid || floorPlanArea === 0}
        className={`
          w-full relative py-3.5 rounded-xl text-sm font-semibold transition-all duration-300
          flex items-center justify-center gap-2.5
          ${loading || !isValid || floorPlanArea === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Plan
          </>
        )}
        
        {!loading && !isValid && floorPlanArea > 0 && (
          <div className="absolute -top-1 -right-1">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
        )}
      </button>

      {/* Quick Stats */}
      {desiredBuiltArea > 0 && totalRooms > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total rooms: {totalRooms}</span>
            <span>Avg room size: {(desiredBuiltArea / totalRooms).toFixed(1)} m²</span>
            <span>Coverage: {floorPlanArea > 0 ? Math.round((desiredBuiltArea / floorPlanArea) * 100) : 0}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
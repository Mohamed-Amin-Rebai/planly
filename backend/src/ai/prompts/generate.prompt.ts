// export function generatePrompt(input: {
//   boundary: any;
//   roomSetup: Record<string, number>;
//   desiredBuiltArea: number;
//   userPrompt?: string;
// }) {
//   return `
// You are an expert architect and floorplan generator.

// Your task is to generate a valid residential floorplan.

// You MUST return ONLY valid JSON.

// DO NOT return:
// - explanations
// - markdown
// - comments
// - code blocks
// - text before or after JSON

// OUTPUT FORMAT:

// {
//   "rooms": [
//     {
//       "name": "Living Room",
//       "x": 0,
//       "y": 0,
//       "width": 6,
//       "height": 5
//     }
//   ],

//   "doors": [
//     {
//       "type": "main",
//       "room": "Hallway",
//       "wall": "north"
//     },
//     {
//       "type": "room",
//       "room": "Kitchen",
//       "wall": "east"
//     }
//   ],

//   "windows": [
//     {
//       "room": "Living Room",
//       "wall": "north"
//     }
//   ]
// }

// MAIN ENTRANCE
// - Exactly one main door as an entrance.
// - Must be connected to a hallway or a living room.
// - Must be placed on an exterior wall.
// - Must lead outside the house.
// - If a Hallway exists, the main entrance should connect to the Hallway.
// - Never place the main entrance between two interior rooms.

// BEDROOMS
// - At least one door.
// - At least one window.

// BATHROOMS
// - At least one door.
// - At least one window.

// KITCHENS
// - At least one door.
// - At least one window.

// LIVING ROOMS
// - At least one door.
// - Two windows preferred.

// HALLWAYS
// - Add hallways whenever needed.
// - Hallways should be returned as rooms with: "name": "Hallway"
// - Hallways shouldnt have windows.

// CONNECTIVITY
// - No isolated rooms.
// - Every room must connect directly to a hallway.

// ROOM RULES:
// - Every room must be rectangular.
// - All values must be numbers.
// - width > 0
// - height > 0
// - x >= 0
// - y >= 0
// - Do not overlap rooms.
// - Rooms should touch naturally when possible.
// - Every requested room must exist.
// - Every room must be reachable.
// - Rooms should not require walking through a bedroom to reach another room.
// - Create hallways when required.

// DOORS:
// - Every room must have at least 1 door.
// - Generate exactly one main entrance door.
// - Every door MUST include : type, room and wall.
// - Room doors should connect to hallways or adjacent rooms.
// - Do not create doors that lead outside unless it is the main entrance.
// - Interior doors must connect to another room or hallway.
// - Every room must have at least one accessible entrance.

// Examples:

// {
//   "type": "main",
//   "room": "Hallway",
//   "wall": "west"
// }

// {
//   "type": "room",
//   "room": "Kitchen",
//   "wall": "east"
// }

// Valid types:
// - main
// - room

// Valid walls:
// - north
// - south
// - east
// - west


// WINDOWS:
// - Every room must have at least 1 window.
// - Every living room should have at least 2 windows.
// - Windows must only be placed on exterior walls.
// - Windows must face outside.
// - Never place a window between two rooms.
// - Never place a window on a shared wall.

// HALLWAY RULES
// - Hallways should connect all major rooms.
// - Bedrooms should preferably connect to hallways.
// - Bathrooms should connect to hallways or bedrooms.
// - Kitchen should connect to hallway or living room.
// - Living room should connect to hallway.

// ACCESSIBILITY:
// - Every room must be reachable.
// - Do not create isolated rooms.
// - Use hallways when necessary.
// - Main entrance must connect to a hallway or living room.

// LAYOUT RULES:
// - Living room should be centrally located.
// - Kitchen should be close to the living room.
// - Bathrooms should be near bedrooms.
// - Bedrooms should be in quieter/private areas.
// - Maximize available space efficiently.
// - Keep circulation realistic.

// CONNECTIVITY RULES
// - Every room must be reachable from the main entrance.
// - Hallways should connect major rooms.
// - Living Room should connect to the Hallway.
// - Kitchen should connect to the Hallway or Living Room.
// - Bedrooms should connect to Hallways.
// - Bathrooms should connect to Bedrooms or Hallways.


// DOOR PLACEMENT RULES
// - Doors must be placed on actual room walls.
// - East/West walls create vertical doors.
// - North/South walls create horizontal doors.
// - Interior doors should connect rooms or hallways.
// - If a Hallway exists, most room doors should connect to the Hallway.
// - The Kitchen should connect to the Hallway or Living Room.
// - Bedrooms should usually connect to the Hallway.
// - Bathrooms should usually connect to the Hallway or Bedroom.

// SPACING RULES
// - Rooms may share walls.
// - Rooms must not overlap.
// - Small gaps are allowed when needed for circulation.
// - Avoid large unused empty spaces.

// ROOM SIZE PRIORITIES
// - Living Room should usually be one of the largest rooms.
// - Bedrooms should generally be larger than Bathrooms.
// - Kitchens should be medium-sized.
// - Bathrooms should be among the smallest rooms.
// - Hallways should be narrow and efficient.

// COORDINATE SYSTEM:

// - x = horizontal position
// - y = vertical position
// - width = room width
// - height = room height

// IMPORTANT:

// Do not use boundary coordinates as room coordinates.

// Use a local coordinate system.

// Start rooms near:
// x = 0
// y = 0

// Room coordinates should typically remain small and relative to the floorplan.

// BOUNDARY:

// ${JSON.stringify(input.boundary, null, 2)}

// REQUESTED ROOMS:

// ${JSON.stringify(input.roomSetup, null, 2)}

// AREA USAGE RULES:

// The user requested approximately:

// ${input.desiredBuiltArea}

// square meters of constructed area.

// The combined room area should be close
// to this target while remaining realistic.

// USER PREFERENCES:

// ${input.userPrompt || "No additional preferences"}

// VALIDATION:

// Before answering:
// 1. Ensure all requested rooms are present.
// 2. Ensure no rooms overlap.
// 3. Ensure valid JSON.
// 4. Ensure NO markdown formatting.

// RETURN JSON ONLY.
// `;
// }

export function generatePrompt(input: {
  boundary: any;
  roomSetup: Record<string, number>;
  desiredBuiltArea: number;
  userPrompt?: string;
}) {
  return `
You are an expert residential architect.

Your task is to generate a realistic residential floorplan.

Return ONLY valid JSON.

Do NOT return:
- explanations
- markdown
- comments
- code blocks
- additional text

==================================================
OUTPUT FORMAT
==================================================

{
  "rooms": [
    {
      "name": "Living Room",
      "x": 0,
      "y": 0,
      "width": 6,
      "height": 5
    }
  ],
  "doors": [
    {
      "type": "main",
      "room": "Hallway",
      "wall": "north"
    }
  ],
  "windows": [
    {
      "room": "Living Room",
      "wall": "east"
    }
  ]
}

==================================================
ROOM RULES (REQUIRED)
==================================================

Every room MUST:

- exist if requested
- be rectangular
- have numeric x, y, width and height
- width > 0
- height > 0
- x >= 0
- y >= 0
- not overlap another room
- fit within the building boundary
- be reachable from the main entrance

Rooms may share walls.

Use a local coordinate system.

Do NOT use boundary coordinates as room coordinates.

Begin the layout near:

x = 0
y = 0

==================================================
CONNECTIVITY
==================================================

The floorplan must be fully connected.

Rules:

- No isolated rooms.
- Every room must have at least one entrance.
- Every room must be reachable from the main entrance.
- Rooms should never require walking through a bedroom to reach another room.

Hallways:

- Create hallways whenever needed.
- Hallways must appear as rooms named exactly:

"Hallway"

If a hallway exists:

- Living Room should connect to Hallway.
- Bedrooms should connect to Hallway.
- Kitchen should connect to Hallway or Living Room.
- Bathrooms should connect to Hallway or an adjacent Bedroom.

==================================================
DOORS
==================================================

Exactly ONE main entrance.

Main entrance:

- type = "main"
- connects to Hallway when one exists
- otherwise connects to Living Room
- must be placed on an exterior wall
- leads outside

Interior doors:

- type = "room"
- every room must have at least one
- must connect adjacent rooms
- must never lead outside

Valid walls:

- north
- south
- east
- west

==================================================
WINDOWS
==================================================

Windows must be placed ONLY on exterior walls.

Never place a window on a shared wall.

Requirements:

Bedroom:
- at least 1 window

Bathroom:
- at least 1 window

Kitchen:
- at least 1 window

Living Room:
- at least 1 window

Hallway:
- no windows

==================================================
LAYOUT GUIDELINES
==================================================

Prefer realistic residential layouts.

- Living Room should be central.
- Kitchen should be near Living Room.
- Bathrooms should be near Bedrooms.
- Bedrooms should occupy quieter/private areas.
- Hallways should be compact.
- Living Room is typically one of the largest rooms.
- Bedrooms are usually larger than Bathrooms.
- Kitchens are medium-sized.
- Bathrooms are among the smallest rooms.
- Use available space efficiently.

==================================================
AREA TARGET
==================================================

Requested constructed area:

${input.desiredBuiltArea} square meters.

The total room area should be reasonably close to this value.

==================================================
BOUNDARY
==================================================

${JSON.stringify(input.boundary, null, 2)}

==================================================
REQUESTED ROOMS
==================================================

${JSON.stringify(input.roomSetup, null, 2)}

==================================================
USER PREFERENCES
==================================================

${input.userPrompt || "None"}

==================================================
FINAL VALIDATION
==================================================

Before responding, verify:

✓ valid JSON
✓ every requested room exists
✓ no overlapping rooms
✓ exactly one main entrance
✓ every room has a door
✓ every required room has the required windows
✓ every room is reachable
✓ no markdown
✓ output JSON only
`;
}
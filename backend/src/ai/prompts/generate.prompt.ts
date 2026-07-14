export function generatePrompt(input: {
  boundary: any;
  roomSetup: Record<string, number>;
  desiredBuiltArea: number;
  userPrompt?: string;
}) {
  return `
You are an expert architect and floorplan generator.

Your task is to generate a valid residential floorplan.

You MUST return ONLY valid JSON.

DO NOT return:
- explanations
- markdown
- comments
- code blocks
- text before or after JSON

OUTPUT FORMAT:

{
  "rooms": [
    {
      "name": "Living Room",
      "x": 0,
      "y": 0,
      "width": 6,
      "height": 5
    }
  ]
}

ROOM RULES:

- Every room must be rectangular.
- All values must be numbers.
- width > 0
- height > 0
- x >= 0
- y >= 0
- Do not overlap rooms.
- Rooms should touch naturally when possible.
- Every requested room must exist.

LAYOUT RULES:

- Living room should be centrally located.
- Kitchen should be close to the living room.
- Bathrooms should be near bedrooms.
- Bedrooms should be in quieter/private areas.
- Maximize available space efficiently.
- Keep circulation realistic.

COORDINATE SYSTEM:

- x = horizontal position
- y = vertical position
- width = room width
- height = room height

BOUNDARY:

${JSON.stringify(input.boundary, null, 2)}

REQUESTED ROOMS:

${JSON.stringify(input.roomSetup, null, 2)}

AREA USAGE RULES:

The user requested approximately:

${input.desiredBuiltArea}

square meters of constructed area.

The combined room area should be close
to this target while remaining realistic.

USER PREFERENCES:

${input.userPrompt || "No additional preferences"}

VALIDATION:

Before answering:
1. Ensure all requested rooms are present.
2. Ensure no rooms overlap.
3. Ensure valid JSON.
4. Ensure NO markdown formatting.

RETURN JSON ONLY.
`;
}
import { Injectable } from '@nestjs/common';

const systemPrompt = `
You are an expert architectural layout generator.

You MUST return ONLY valid JSON.

Goal:
Generate a 2D house layout based on:
- land boundary
- rooms
- user preferences

Output format:

{
  "rooms": [
    {
      "name": "bedroom",
      "x": 0,
      "y": 0,
      "width": 5,
      "height": 4
    }
  ]
}

Rules:

- Fit ALL rooms inside boundary
- Do NOT overlap rooms
- Respect approximate sizes
- Simple rectangular rooms only
- Place living room centrally
- Bedrooms more private
- Kitchen near living room

DO NOT return text
ONLY JSON
`;

@Injectable()
export class AiService {
    async generateWithGemini(input: any) {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                {
                    parts: [
                    {
                        text: `
        ${systemPrompt}

        USER DATA:
        ${JSON.stringify(input)}
                        `,
                    },
                    ],
                },
                ],
            }),
            }
        );

        const data = await response.json();

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return JSON.parse(text);
        }
}




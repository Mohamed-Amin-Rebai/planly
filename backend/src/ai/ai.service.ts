import { Injectable } from '@nestjs/common';
import { cleanJson } from './utils/clean-json-response';
import { validateLayout } from './utils/validate-layout';

import { generatePrompt } from './prompts/generate.prompt';
import { planPrompt } from './prompts/plan.prompt';
import { updatePrompt } from './prompts/update.prompt';

@Injectable()
export class AiService {
  private async callGemini(prompt: string) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const text = await response.text();

      console.error("GEMINI ERROR:");
      console.error(text);

      throw new Error(
        `Gemini request failed: ${response.status}`,
      );
    }

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    );
  }

  async generateLayout(input: any) {
    const raw = await this.callGemini(generatePrompt(input));

    const cleaned = cleanJson(raw);

    const layout = JSON.parse(cleaned);

    console.log(
      JSON.stringify(layout, null, 2)
    );

    if (!validateLayout(layout, input.boundary)) {
      console.log("BOUNDARY:");
      console.log(
        JSON.stringify(input.boundary, null, 2)
      );

      throw new Error("Invalid generated layout");
    }

    return layout;
  }

  async planModification(message: string, currentLayout: any) {
    return this.callGemini(
      planPrompt(message, currentLayout),
    );
  }

  async updateLayout(message: string, currentLayout: any, boundary: number[][]) {
    const raw = await this.callGemini(
      updatePrompt(message, currentLayout),
    );

    const cleaned = cleanJson(raw);

    const layout = JSON.parse(cleaned);

    if (!validateLayout(layout, boundary)) {
      throw new Error('Invalid updated layout');
    }

    return layout;
  }

}
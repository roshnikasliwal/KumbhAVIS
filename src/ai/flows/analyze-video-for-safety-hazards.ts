'use server';

/**
 * @fileOverview Analyzes video streams for safety hazards using GenAI.
 *
 * - analyzeVideoForSafetyHazards - A function that takes a video data URI and analyzes it for safety hazards.
 * - AnalyzeVideoForSafetyHazardsInput - The input type for the analyzeVideoForSafetyHazards function.
 * - AnalyzeVideoForSafetyHazardsOutput - The return type for the analyzeVideoForSafetyHazards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVideoForSafetyHazardsInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeVideoForSafetyHazardsInput = z.infer<typeof AnalyzeVideoForSafetyHazardsInputSchema>;

const AnalyzeVideoForSafetyHazardsOutputSchema = z.object({
  safetyAnalysis: z.object({
    hazardDetected: z.boolean().describe('Whether a safety hazard was detected in the video.'),
    hazardDescription: z.string().describe('A description of the safety hazard detected, if any.'),
    timestamp: z.string().optional().describe('The timestamp in the video where the primary hazard was detected (e.g., 00:25).'),
    crowdDensity: z.string().describe('A description of the crowd density observed in the video.'),
    unusualEvents: z.string().describe('A description of any unusual events observed in the video, such as smoke, fire, or panicked crowd surges.'),
    smokeDetected: z.boolean().describe('Whether smoke was detected in the video.'),
    fireDetected: z.boolean().describe('Whether fire was detected in the video.'),
    panicDetected: z.boolean().describe('Whether a panicked crowd surge was detected in the video.'),
  }),
});
export type AnalyzeVideoForSafetyHazardsOutput = z.infer<typeof AnalyzeVideoForSafetyHazardsOutputSchema>;

export async function analyzeVideoForSafetyHazards(input: AnalyzeVideoForSafetyHazardsInput): Promise<AnalyzeVideoForSafetyHazardsOutput> {
  return analyzeVideoForSafetyHazardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVideoForSafetyHazardsPrompt',
  input: {schema: AnalyzeVideoForSafetyHazardsInputSchema},
  output: {schema: AnalyzeVideoForSafetyHazardsOutputSchema},
  prompt: `You are an expert in analyzing video footage for safety hazards at large public events.

You will analyze the video provided and identify any potential safety hazards. Specifically, look for:
- Smoke or fire.
- Signs of a panicked crowd surge (e.g., people running in the same direction, expressions of fear).
- Overly dense crowds that could lead to crushing.
- Any other unusual events or potential threats.

Video: {{media url=videoDataUri}}

Based on your analysis:
- Set 'hazardDetected' to true if any safety hazards (including smoke, fire, or panic) are present, otherwise false.
- If a hazard is detected, provide the timestamp in the video where it appears (e.g., 00:25) in the 'timestamp' field.
- Set 'smokeDetected', 'fireDetected', and 'panicDetected' to true or false accordingly.
- Provide a detailed description in 'hazardDescription' if a hazard is detected.
- Describe the crowd density in the 'crowdDensity' field.
- Note any other unusual events in the 'unusualEvents' field.
`,
});

const analyzeVideoForSafetyHazardsFlow = ai.defineFlow(
  {
    name: 'analyzeVideoForSafetyHazardsFlow',
    inputSchema: AnalyzeVideoForSafetyHazardsInputSchema,
    outputSchema: AnalyzeVideoForSafetyHazardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

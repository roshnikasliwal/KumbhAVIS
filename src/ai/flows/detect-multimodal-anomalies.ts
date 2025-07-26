/**
 * @fileOverview An AI agent that detects multimodal anomalies from video feeds.
 *
 * - detectMultimodalAnomalies - A function that detects anomalies like smoke, fire, or panicked crowds.
 * - DetectMultimodalAnomaliesInput - The input type for the detectMultimodalAnomalies function.
 * - DetectMultimodalAnomaliesOutput - The return type for the detectMultimodalAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectMultimodalAnomaliesInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A frame from a video feed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type DetectMultimodalAnomaliesInput = z.infer<
  typeof DetectMultimodalAnomaliesInputSchema
>;

export const DetectMultimodalAnomaliesOutputSchema = z.object({
    isAnomaly: z.boolean().describe('Whether or not an anomaly was detected in the image.'),
    anomalyType: z.string().describe('The type of anomaly detected (e.g., Smoke, Fire, Panic, Obstruction, None).'),
    description: z.string().describe('A brief description of the detected anomaly.'),
});
export type DetectMultimodalAnomaliesOutput = z.infer<
  typeof DetectMultimodalAnomaliesOutputSchema
>;

export async function detectMultimodalAnomalies(
  input: DetectMultimodalAnomaliesInput
): Promise<DetectMultimodalAnomaliesOutput> {
  return detectMultimodalAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectMultimodalAnomaliesPrompt',
  input: {schema: DetectMultimodalAnomaliesInputSchema},
  output: {schema: DetectMultimodalAnomaliesOutputSchema},
  model: 'vertexai/gemini-1.5-flash-preview',
  prompt: `You are an AI security expert monitoring a live video feed from a crowded public event. Your task is to analyze the provided image frame and detect any anomalies.

  Anomalies to look for include, but are not limited to:
  - Smoke or fire
  - Visual signatures of a crowd surge or panic (people running in the same direction, expressions of fear, large gaps opening in the crowd)
  - Large unattended objects or obstructions in pathways
  - Fights or violent altercations

  If an anomaly is detected, set isAnomaly to true, specify the anomalyType, and provide a concise description. If the scene appears normal, set isAnomaly to false and anomalyType to "None". Be precise and act as a real-time security system.

  Image to analyze: {{media url=imageDataUri}}
  `,
});

const detectMultimodalAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectMultimodalAnomaliesFlow',
    inputSchema: DetectMultimodalAnomaliesInputSchema,
    outputSchema: DetectMultimodalAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

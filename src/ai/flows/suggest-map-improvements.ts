/**
 * @fileOverview An AI agent that suggests map improvements based on the event type.
 *
 * - suggestMapImprovements - A function that suggests map improvements.
 * - SuggestMapImprovementsInput - The input type for the suggestMapImprovements function.
 * - SuggestMapImprovementsOutput - The return type for the suggestMapImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMapImprovementsInputSchema = z.object({
  eventDescription: z
    .string()
    .describe('The type of event, e.g., concert, marathon, protest.'),
  currentMapFeatures: z
    .string()
    .describe('A description of the current map features, including key locations and annotations.'),
});
export type SuggestMapImprovementsInput = z.infer<
  typeof SuggestMapImprovementsInputSchema
>;

const SuggestMapImprovementsOutputSchema = z.object({
  suggestedImprovements: z
    .string()
    .describe(
      'A list of suggested improvements to the map for better situational awareness, based on the event type.'
    ),
});
export type SuggestMapImprovementsOutput = z.infer<
  typeof SuggestMapImprovementsOutputSchema
>;

export async function suggestMapImprovements(
  input: SuggestMapImprovementsInput
): Promise<SuggestMapImprovementsOutput> {
  return suggestMapImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMapImprovementsPrompt',
  input: {schema: SuggestMapImprovementsInputSchema},
  output: {schema: SuggestMapImprovementsOutputSchema},
  prompt: `You are an expert event planner, specializing in map optimization for situational awareness.

  Based on the event type and current map features, suggest improvements to the map that would be most beneficial for event organizers.

  Event Type: {{{eventDescription}}}
  Current Map Features: {{{currentMapFeatures}}}

  Provide a detailed list of actionable improvements.
  `,
});

const suggestMapImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestMapImprovementsFlow',
    inputSchema: SuggestMapImprovementsInputSchema,
    outputSchema: SuggestMapImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
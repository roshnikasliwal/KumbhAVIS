'use server';

/**
 * @fileOverview Finds a missing person in a video feed using a photo.
 *
 * - findMissingPerson - A function that takes a photo and video and tries to find the person.
 * - FindMissingPersonInput - The input type for the findMissingPerson function.
 * - FindMissingPersonOutput - The return type for the findMissingPerson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindMissingPersonInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the missing person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  videoDataUri: z
    .string()
    .describe(
      "A video feed to scan, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FindMissingPersonInput = z.infer<typeof FindMissingPersonInputSchema>;

const FindMissingPersonOutputSchema = z.object({
  personFound: z.boolean().describe('Whether or not the missing person was found in the video.'),
  timestamp: z.string().optional().describe('The timestamp in the video where the person was found (e.g., 00:45).'),
  details: z.string().describe('Additional details about the finding or why the person was not found.'),
});
export type FindMissingPersonOutput = z.infer<typeof FindMissingPersonOutputSchema>;


export async function findMissingPerson(input: FindMissingPersonInput): Promise<FindMissingPersonOutput> {
  return findMissingPersonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findMissingPersonPrompt',
  input: {schema: FindMissingPersonInputSchema},
  output: {schema: FindMissingPersonOutputSchema},
  prompt: `You are an expert security analyst. Your task is to find a missing person in a video feed using a reference photo.

Carefully analyze the provided video feed frame by frame and compare it against the photo of the missing person.

If you find a match, set 'personFound' to true, provide the timestamp in the video where they appear, and add any relevant details.
If you cannot find the person, set 'personFound' to false and explain why (e.g., "Person not visible in the provided footage.").

Reference Photo:
{{media url=photoDataUri}}

Video to analyze:
{{media url=videoDataUri}}
`,
});

const findMissingPersonFlow = ai.defineFlow(
  {
    name: 'findMissingPersonFlow',
    inputSchema: FindMissingPersonInputSchema,
    outputSchema: FindMissingPersonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// 'use server'
'use server';

/**
 * @fileOverview Summarizes social media sentiment related to the Kumbh Mela.
 *
 * - summarizeSocialMediaSentiment - A function that summarizes the sentiment of social media feeds.
 * - SummarizeSocialMediaSentimentInput - The input type for the summarizeSocialMediaSentiment function.
 * - SummarizeSocialMediaSentimentOutput - The return type for the summarizeSocialMediaSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSocialMediaSentimentInputSchema = z.object({
  socialMediaFeeds: z.string().describe('The content of social media feeds related to the Kumbh Mela.')
});

export type SummarizeSocialMediaSentimentInput = z.infer<typeof SummarizeSocialMediaSentimentInputSchema>;

const SummarizeSocialMediaSentimentOutputSchema = z.object({
  overallSentiment: z.string().describe('The overall sentiment of the social media feeds (e.g., positive, negative, neutral).'),
  keyConcerns: z.string().describe('A summary of the key concerns or issues identified in the social media feeds.'),
  potentialSafetyIssues: z.string().describe('Any potential safety issues or risks highlighted in the social media feeds.')
});

export type SummarizeSocialMediaSentimentOutput = z.infer<typeof SummarizeSocialMediaSentimentOutputSchema>;

export async function summarizeSocialMediaSentiment(input: SummarizeSocialMediaSentimentInput): Promise<SummarizeSocialMediaSentimentOutput> {
  return summarizeSocialMediaSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSocialMediaSentimentPrompt',
  input: {schema: SummarizeSocialMediaSentimentInputSchema},
  output: {schema: SummarizeSocialMediaSentimentOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing social media sentiment related to the Kumbh Mela.

  Analyze the provided social media feeds and extract the overall sentiment, key concerns, and potential safety issues.
  Provide a concise summary of each aspect.

  Social Media Feeds:
  {{socialMediaFeeds}}

  Output:
  Overall Sentiment: (positive, negative, or neutral)
  Key Concerns: (a brief summary of the main concerns expressed in the feeds)
  Potential Safety Issues: (any potential safety risks or hazards mentioned in the feeds)`
});

const summarizeSocialMediaSentimentFlow = ai.defineFlow(
  {
    name: 'summarizeSocialMediaSentimentFlow',
    inputSchema: SummarizeSocialMediaSentimentInputSchema,
    outputSchema: SummarizeSocialMediaSentimentOutputSchema
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

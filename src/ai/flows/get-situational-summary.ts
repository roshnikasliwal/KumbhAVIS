'use server';

/**
 * @fileOverview Generates a situational summary based on a natural language query using tools.
 *
 * - getSituationalSummary - A function that takes a query and returns a summary.
 * - GetSituationalSummaryInput - The input type for the getSituationalSummary function.
 * - GetSituationalSummaryOutput - The return type for the getSituationalSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Tool to get video analytics summary
const getVideoAnalyticsSummary = ai.defineTool(
  {
    name: 'getVideoAnalyticsSummary',
    description: 'Get a summary of the latest video analytics data, including crowd density and hazard alerts.',
    outputSchema: z.object({
      summary: z.string(),
    }),
  },
  async () => {
    // In a real app, this would fetch from a live data source.
    return {
      summary: 'High crowd density detected at Ghat 5 and Sector 12 Bridge. A smoke alert was triggered near the market area 15 minutes ago; resolved. No current signs of panic or large-scale unrest.',
    };
  }
);

// Tool to get on-ground officer reports
const getOfficerReports = ai.defineTool(
  {
    name: 'getOfficerReports',
    description: "Get the latest reports from on-ground security and medical officers.",
    outputSchema: z.object({
      reports: z.array(z.string()),
    }),
  },
  async () => {
    // In a real app, this would fetch from a reporting system.
    return {
      reports: [
        'Officer A7: Reports a minor medical incident at the Main Parking area, subject is stable.',
        'Officer B4: Reports traffic congestion on Service Road 3, recommending diversion.',
        'Officer C1: Reports a lost child at Ghat 2, now resolved.',
      ],
    };
  }
);

// Tool to get social media sentiment analysis
const getSocialMediaSentiment = ai.defineTool(
  {
    name: 'getSocialMediaSentiment',
    description: 'Get the latest analysis of public social media posts related to the event.',
    outputSchema: z.object({
      summary: z.string(),
    }),
  },
  async () => {
    // In a real app, this would call another service or flow.
    return {
      summary: 'Overall Sentiment: Mixed. Key Concerns: Overcrowding at major Ghats, sanitation issues near camp areas. Potential Safety Issues: Multiple posts about the Sector 12 Bridge feeling "unsteady" due to crowds. Reports of petty theft in the Market Area.',
    };
  }
);


const GetSituationalSummaryInputSchema = z.object({
  query: z.string().describe('The natural language query from the commander.'),
});
export type GetSituationalSummaryInput = z.infer<typeof GetSituationalSummaryInputSchema>;

const GetSituationalSummaryOutputSchema = z.object({
  summary: z.string().describe('The concise, actionable briefing for the commander.'),
});
export type GetSituationalSummaryOutput = z.infer<typeof GetSituationalSummaryOutputSchema>;

export async function getSituationalSummary(input: GetSituationalSummaryInput): Promise<GetSituationalSummaryOutput> {
  return situationalSummaryFlow(input);
}

const situationalSummaryFlow = ai.defineFlow(
  {
    name: 'situationalSummaryFlow',
    inputSchema: GetSituationalSummaryInputSchema,
    outputSchema: GetSituationalSummaryOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
        prompt: `You are an AI intelligence analyst for the Kumbh Mela command center. Your task is to synthesize information from multiple sources to provide a concise, actionable briefing in response to a commander's query.

        Use the available tools to gather the most up-to-date information from video analytics, officer reports, and social media.

        Fuse the information you gather into a coherent narrative that directly answers the commander's query. Do not just list the data sources. Highlight the most critical information first.

        Commander's Query: "${input.query}"
        `,
        model: 'googleai/gemini-1.5-flash-latest',
        tools: [getVideoAnalyticsSummary, getOfficerReports, getSocialMediaSentiment],
        output: {
            schema: GetSituationalSummaryOutputSchema,
        },
    });

    return llmResponse.output!;
  }
);

'use server';

/**
 * @fileOverview Dispatches a drone to a high-priority incident location.
 *
 * - dispatchDrone - A function that takes an incident location and dispatches a drone.
 * - DispatchDroneInput - The input type for the dispatchDrone function.
 * - DispatchDroneOutput - The return type for the dispatchDrone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DispatchDroneInputSchema = z.object({
  incidentLocation: z.string().describe('The location of the high-priority incident.'),
});
export type DispatchDroneInput = z.infer<typeof DispatchDroneInputSchema>;

const DispatchDroneOutputSchema = z.object({
  confirmationMessage: z.string().describe('A confirmation message that the drone has been dispatched.'),
});
export type DispatchDroneOutput = z.infer<typeof DispatchDroneOutputSchema>;


export async function dispatchDrone(input: DispatchDroneInput): Promise<DispatchDroneOutput> {
  return dispatchDroneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dispatchDronePrompt',
  input: {schema: DispatchDroneInputSchema},
  output: {schema: DispatchDroneOutputSchema},
  prompt: `You are a drone dispatch operator for a large public event.

Your task is to dispatch a drone to a high-priority incident to provide a closer look for the security team.

The incident is at: {{incidentLocation}}.

Acknowledge the request and confirm that a drone is being dispatched to the location immediately.
`,
});

const dispatchDroneFlow = ai.defineFlow(
  {
    name: 'dispatchDroneFlow',
    inputSchema: DispatchDroneInputSchema,
    outputSchema: DispatchDroneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

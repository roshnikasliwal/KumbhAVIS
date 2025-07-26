'use server';

/**
 * @fileOverview Dispatches the nearest available responder to a high-priority incident.
 *
 * - dispatchResponder - A function that takes an incident location and type, finds the nearest responder, and dispatches them with the fastest route.
 * - DispatchResponderInput - The input type for the dispatchResponder function.
 * - DispatchResponderOutput - The return type for the dispatchResponder function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Mock data for available responders
const availableResponders = [
  { id: 'medic-01', type: 'Medical', location: { lat: 25.447, lng: 81.875 }, onDuty: true },
  { id: 'medic-02', type: 'Medical', location: { lat: 25.442, lng: 81.845 }, onDuty: true },
  { id: 'security-01', type: 'Security', location: { lat: 25.452, lng: 81.868 }, onDuty: true },
  { id: 'security-02', type: 'Security', location: { lat: 25.441, lng: 81.851 }, onDuty: false },
];

const incidentLocations: { [key: string]: { lat: number; lng: number } } = {
    'Ghat 5': { lat: 25.4485, lng: 81.872 },
    'Sector 12 Bridge': { lat: 25.444, lng: 81.849 },
    'Main Parking': { lat: 25.451, lng: 81.865 },
    'Ghat 2': { lat: 25.447, lng: 81.868 },
    'Market Area': { lat: 25.450, lng: 81.855 },
    'Service Road 3': { lat: 25.443, lng: 81.860 },
}

// Tool to get available responders near a location
const getAvailableResponders = ai.defineTool(
  {
    name: 'getAvailableResponders',
    description: 'Get a list of available responders (Medical or Security) near a specific incident location.',
    inputSchema: z.object({
      incidentLocation: z.string().describe('The location of the incident (e.g., "Ghat 5").'),
      responderType: z.enum(['Medical', 'Security']).describe('The type of responder needed.'),
    }),
    outputSchema: z.array(z.object({
        id: z.string(),
        type: z.string(),
        location: z.object({ lat: z.number(), lng: z.number() }),
        distance: z.string(),
    }))
  },
  async ({ incidentLocation, responderType }) => {
    // In a real app, you'd use a Geo-lookup. Here, we'll just return all on-duty responders of the correct type.
    console.log(`Searching for ${responderType} responders near ${incidentLocation}`);
    return availableResponders
        .filter(r => r.onDuty && r.type === responderType)
        .map(r => ({ ...r, distance: `${Math.floor(Math.random() * 500) + 100}m` }));
  }
);


// Tool to get the fastest route
const getFastestRoute = ai.defineTool(
  {
    name: 'getFastestRoute',
    description: 'Calculates the fastest route for a responder to get to an incident location.',
    inputSchema: z.object({
      responderId: z.string().describe("The ID of the responding unit."),
      destination: z.string().describe('The destination of the incident (e.g., "Ghat 5").'),
    }),
    outputSchema: z.object({
      route: z.string().describe("A text description of the fastest route."),
      eta: z.string().describe("The estimated time of arrival."),
      polyline: z.array(z.object({ lat: z.number(), lng: z.number() })).describe("An array of lat/lng coordinates representing the route path."),
    })
  },
  async ({ responderId, destination }) => {
    const responder = availableResponders.find(r => r.id === responderId);
    const destinationCoords = incidentLocations[destination];

    if (!responder || !destinationCoords) {
        throw new Error("Invalid responder or destination");
    }

    // Mock route calculation
    const eta = `${Math.floor(Math.random() * 5) + 2} minutes`;
    const routeDescription = `Proceed via Main Road, turn left at the central tower, and continue straight to ${destination}.`;
    
    // Create a mock polyline from responder to destination
    const polyline = [
        responder.location,
        // Add a few intermediate points for a more realistic-looking route
        { lat: (responder.location.lat + destinationCoords.lat) / 2 + 0.001, lng: (responder.location.lng + destinationCoords.lng) / 2 - 0.002},
        destinationCoords,
    ];

    console.log(`Calculating route for ${responderId} to ${destination}`);
    return { route: routeDescription, eta, polyline };
  }
);


const DispatchResponderInputSchema = z.object({
  incidentLocation: z.string().describe('The location of the high-priority incident.'),
  incidentType: z.string().describe('The type of incident (e.g., Medical, Unrest, Accident).'),
});
export type DispatchResponderInput = z.infer<typeof DispatchResponderInputSchema>;

const DispatchResponderOutputSchema = z.object({
  dispatchConfirmation: z.string().describe('A detailed confirmation message about the dispatch, including the unit, route, and ETA.'),
  routePolyline: z.array(z.object({ lat: z.number(), lng: z.number() })).optional().describe("The route polyline for the map."),
});
export type DispatchResponderOutput = z.infer<typeof DispatchResponderOutputSchema>;


export async function dispatchResponder(input: DispatchResponderInput): Promise<DispatchResponderOutput> {
  return dispatchResponderFlow(input);
}

const dispatchResponderPromptText = `You are the AI dispatch commander for the Kumbh Mela event.
A high-priority incident has been reported. Your task is to intelligently dispatch the best available unit.

Incident Details:
- Type: {{incidentType}}
- Location: {{incidentLocation}}

Follow these steps:
1. Determine the required responder type. For "Medical" or "Accident", you need "Medical". For "Unrest", you need "Security".
2. Use the 'getAvailableResponders' tool to find the closest available unit of that type.
3. Once you have the best unit, use the 'getFastestRoute' tool to find their route to the incident.
4. Formulate a clear, concise dispatch confirmation message. State which unit is responding, their ETA, and the route they should take. If no responders are available, state that clearly.
`;


const dispatchResponderFlow = ai.defineFlow(
  {
    name: 'dispatchResponderFlow',
    inputSchema: DispatchResponderInputSchema,
    outputSchema: DispatchResponderOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: dispatchResponderPromptText,
      model: 'googleai/gemini-1.5-flash-latest',
      history: [{role: 'user', content: [{text: `Incident Type: ${input.incidentType}, Location: ${input.incidentLocation}`}]}],
      tools: [getAvailableResponders, getFastestRoute],
      output: {
          schema: z.object({ dispatchConfirmation: z.string() })
      }
    });
    
    const getRouteToolResponse = llmResponse.history.findLast(
      (turn) => turn.role === 'tool' && turn.content[0].toolRequest.name === 'getFastestRoute'
    )?.content[0].toolResponse;
  
    if (getRouteToolResponse) {
       const routeData = getRouteToolResponse.part.data as any;
       
       return {
         dispatchConfirmation: llmResponse.output!.dispatchConfirmation,
         routePolyline: routeData.polyline,
       };
    }
    
    return {
        dispatchConfirmation: llmResponse.output!.dispatchConfirmation,
    };
  }
);

import {genkit} from 'genkit';
import {vertexAI} from '@genkit-ai/vertexai';

export const ai = genkit({
  plugins: [vertexAI({project: process.env.GCLOUD_PROJECT})],
  model: 'vertexai/gemini-2.0-flash',
});

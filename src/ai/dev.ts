'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-video-for-safety-hazards.ts';
import '@/ai/flows/summarize-social-media-sentiment.ts';
import '@/ai/flows/find-missing-person.ts';
import '@/ai/flows/dispatch-drone.ts';
import '@/ai/flows/dispatch-responder.ts';
import '@/ai/flows/get-situational-summary.ts';

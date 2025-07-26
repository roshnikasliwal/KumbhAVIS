
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { AnalyzeVideoForSafetyHazardsOutput } from '@/ai/flows/analyze-video-for-safety-hazards';

export async function addVideoInsight(videoUrl: string, analysis: AnalyzeVideoForSafetyHazardsOutput) {
  try {
    const docRef = await addDoc(collection(db, 'video-insights'), {
      videoUrl,
      analysis,
      createdAt: serverTimestamp(),
    });
    console.log('Video insight saved with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not save video insight to Firestore.');
  }
}


import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { SummarizeSocialMediaSentimentOutput } from '@/ai/flows/summarize-social-media-sentiment';

export async function addSocialSentimentAnalysis(
  sourceText: string,
  analysis: SummarizeSocialMediaSentimentOutput
) {
  try {
    const docRef = await addDoc(collection(db, 'social-sentiments'), {
      sourceText,
      analysis,
      createdAt: serverTimestamp(),
    });
    console.log('Social sentiment analysis saved with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not save social sentiment analysis to Firestore.');
  }
}

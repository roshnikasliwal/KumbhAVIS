
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { GetSituationalSummaryOutput } from '@/ai/flows/get-situational-summary';

export async function addSituationalSummary(
  query: string,
  analysis: GetSituationalSummaryOutput
) {
  try {
    const docRef = await addDoc(collection(db, 'situational-summaries'), {
      query,
      summary: analysis.summary,
      createdAt: serverTimestamp(),
    });
    console.log('Situational summary saved with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not save situational summary to Firestore.');
  }
}

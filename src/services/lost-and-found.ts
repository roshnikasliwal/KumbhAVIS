
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { FindMissingPersonOutput } from '@/ai/flows/find-missing-person';

export async function addLostAndFoundCase(
  photoUrl: string,
  videoUrl: string,
  analysis: FindMissingPersonOutput
) {
  try {
    const docRef = await addDoc(collection(db, 'lost-and-found-cases'), {
      photoUrl,
      videoUrl,
      analysis,
      createdAt: serverTimestamp(),
    });
    console.log('Lost and found case saved with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not save lost and found case to Firestore.');
  }
}

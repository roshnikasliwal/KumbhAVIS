
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDocs, query, orderBy } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';

export interface AlertAction {
    type: 'DISPATCH_RESPONDER' | 'DISPATCH_DRONE';
    details: string;
    timestamp: Timestamp;
}

export interface Alert {
    id: string;
    type: string;
    location: string;
    severity: 'Low' | 'Medium' | 'High';
    createdAt: Timestamp;
    actions?: AlertAction[];
}

export async function addAlert(data: { type: string; location: string; severity: string; }) {
  try {
    const docRef = await addDoc(collection(db, 'live-alerts'), {
      ...data,
      createdAt: serverTimestamp(),
      actions: [],
    });
    console.log('Alert created with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not create alert in Firestore.');
  }
}

export async function updateAlertAction(alertId: string, actionData: { type: string, details: string }) {
    try {
        const alertRef = doc(db, 'live-alerts', alertId);
        await updateDoc(alertRef, {
            actions: arrayUnion({
                ...actionData,
                timestamp: serverTimestamp(),
            })
        });
        console.log(`Action added to alert ${alertId}`);
    } catch(e) {
        console.error('Error updating document: ', e);
        throw new Error('Could not update alert action in Firestore.');
    }
}

export async function getAlerts(): Promise<Alert[]> {
    try {
        const q = query(collection(db, "live-alerts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const alerts: Alert[] = [];
        querySnapshot.forEach((doc) => {
            alerts.push({ id: doc.id, ...doc.data() } as Alert);
        });
        return alerts;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Could not fetch alerts from Firestore.");
    }
}

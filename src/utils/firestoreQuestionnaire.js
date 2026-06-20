import { db } from '../lib/firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function saveQuestionnaireData(clientId, data) {
  try {
    const docRef = doc(db, 'customers', clientId);
    await updateDoc(docRef, {
      questionnaire: data
    });
    return true;
  } catch (err) {
    console.error("Error saving questionnaire to Firestore:", err);
    throw err;
  }
}

export async function getQuestionnaireData(clientId) {
  try {
    const docRef = doc(db, 'customers', clientId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().questionnaire || null;
    }
    return null;
  } catch (err) {
    console.error("Error getting questionnaire from Firestore:", err);
    throw err;
  }
}

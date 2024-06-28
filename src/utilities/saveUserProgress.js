import { doc, setDoc } from 'firebase/firestore';
import { db } from 'firebase';

export const saveUserProgress = async (userId, problemId, solved) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const problemData = { solved: solved };

    await setDoc(userDocRef, { [problemId]: problemData }, { merge: true });
  } catch (e) {
    console.error('Error saving document: ', e);
  }
};

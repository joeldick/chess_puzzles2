import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const loadUserProgress = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document');
      return {};
    }
  } catch (e) {
    console.error('Error getting document: ', e);
    return {};
  }
};

export default loadUserProgress;

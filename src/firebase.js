import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB8Zki6WT7zv7OhibmhAgzKSg60HOGbrww",
    authDomain: "chess-puzzles2.firebaseapp.com",
    projectId: "chess-puzzles2",
    storageBucket: "chess-puzzles2.appspot.com",
    messagingSenderId: "237749960690",
    appId: "1:237749960690:web:51820f98a2a650041fb56b",
    measurementId: "G-N4HJWMTSS9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };

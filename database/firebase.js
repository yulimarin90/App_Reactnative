import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBlXOnhjkwJLvip2J0Lnek5Ygwzmn0PC8g",
  authDomain: "crud1-dfb56.firebaseapp.com",
  projectId: "crud1-dfb56",
  storageBucket: "crud1-dfb56.firebasestorage.app",
  messagingSenderId: "584447348768",
  appId: "1:584447348768:web:1da90595afcb4484602c45"
};

/*if (!firebase.apps.length) {
    // Si no hay ninguna instancia, inicializa Firebase con la configuración
    firebase.initializeApp(firebaseConfig);
}*/

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//export default firebase;

const db = firebase.firestore();


export default {
  firebase,
  db
};
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCTwS3D7LDDt6i0C9P2wvGc59lFigLH0Ps",
    authDomain: "posts-2a61a.firebaseapp.com",
    projectId: "posts-2a61a",
    storageBucket: "posts-2a61a.appspot.com",
    messagingSenderId: "227180837568",
    appId: "1:227180837568:web:3cc22bab7b0835959b8b25",
    measurementId: "G-QN47FY32ED"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
  
export default firebase;
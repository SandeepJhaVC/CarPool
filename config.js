
// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/database'
//require('firebase/auth')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCF7TH5EOePm0ZQwTPLkH9O751vWiUoII",
  authDomain: "car-pool-a1f90.firebaseapp.com",
  databaseURL: "https://car-pool-a1f90-default-rtdb.firebaseio.com",
  projectId: "car-pool-a1f90",
  storageBucket: "car-pool-a1f90.appspot.com",
  messagingSenderId: "301339773836",
  appId: "1:301339773836:web:dfbad7b332f4fcd63ce4a9"
};

const app = firebase.initializeApp(firebaseConfig)

//const auth = auth(app)


export default firebase

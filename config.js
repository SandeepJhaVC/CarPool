import firebase from "firebase";
//require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCCF7TH5EOePm0ZQwTPLkH9O751vWiUoII",
  authDomain: "car-pool-a1f90.firebaseapp.com",
  databaseURL: "https://car-pool-a1f90-default-rtdb.firebaseio.com",
  projectId: "car-pool-a1f90",
  storageBucket: "car-pool-a1f90.appspot.com",
  messagingSenderId: "301339773836",
  appId: "1:301339773836:web:dfbad7b332f4fcd63ce4a9"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore()

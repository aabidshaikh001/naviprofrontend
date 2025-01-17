import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDfZyuupjtNgWPZwHc2AXYbFEGVdByUVHE",
    authDomain: "navipro-7a003.firebaseapp.com",
    databaseURL: "https://navipro-7a003-default-rtdb.firebaseio.com",
    projectId: "navipro-7a003",
    storageBucket: "navipro-7a003.firebasestorage.app",
    messagingSenderId: "754911086438",
    appId: "1:754911086438:web:cbcbcdb7b213a444b6aaa7",
    measurementId: "G-K0CT07H5KD"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };

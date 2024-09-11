const chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C" ,"D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

// Generate ID
export default function uniqueId(){

    // Force start with a letter
    let uid = "i"

    for(let i = 0; i < 5; i++){
        const char = chars[Math.floor(Math.random()*chars.length)]
        uid += char
    }

    return uid
}

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCIi8BSffIs9xf5sYsxC0L5kd2UZL7Kcn4",
//   authDomain: "timer-app-f13e4.firebaseapp.com",
//   projectId: "timer-app-f13e4",
//   storageBucket: "timer-app-f13e4.appspot.com",
//   messagingSenderId: "379327249931",
//   appId: "1:379327249931:web:7e845a46aa40c0bb4bd10e"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
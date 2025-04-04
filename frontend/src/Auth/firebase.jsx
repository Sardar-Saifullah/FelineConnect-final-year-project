// firebase.jsx
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import firestore module
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// Firebase is available after the script is loaded
const firebaseConfig = {
  apiKey: "AIzaSyA3xkZJYDlMYNRfdhKbASAnF8Nh2e1PyfY",
  authDomain: "cats-store-2ac7d.firebaseapp.com",
  projectId: "cats-store-2ac7d",
  storageBucket: "cats-store-2ac7d.appspot.com",
  messagingSenderId: "333084473413",
  appId: "1:333084473413:web:0a96f076a53da996f2cb2c",
};
let app;
let auth;
let firestore;
let storage;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = () => {
      try {
        const userString = localStorage.getItem("cats-store-user");
        if (userString) {
          const user = JSON.parse(userString);
          if (user) {
            setCurrentUser(user);
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        setCurrentUser(null);
      }
      setLoading(false);
    };

    verifyUser();
  }, [localStorage.getItem("cats-store-user")]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { auth, firestore, storage, AuthContext }; // Export firestore along with auth and AuthContext

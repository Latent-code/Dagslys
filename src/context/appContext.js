import React, { createContext, useState, useEffect } from "react";

import { firebase } from "../utils/firebase";
import { addUser } from "../utils/firestoreCRUD";

import {
  onAuthStateChanged,
  getAuth,
  signOut,
  signInWithEmailAndPassword,
} from "@firebase/auth";

import {
  collection,
  addDoc,
  getFirestore,
  onSnapshot,
  doc,
  getDocs,
  query,
  where,
  get,
  collectionGroup,
} from "firebase/firestore";

export const AppContext = createContext({
  user: null,
  db: null,
  auth: null,
});


const AppProvider = ({ children }) => {
  const databaseName = "dagslys";
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("root");


  const handleClosePopup = (reason) =>
  reason !== "clickaway"
    ? setIsPopupOpen({ open: false, message: "none", severity: "success" })
    : null;


  const [isPopupOpen, setIsPopupOpen] = useState({
    open: false,
    message: "",
    severity: "",
    closePopup: handleClosePopup,
  });

  const isBrowser = typeof window !== "undefined";
  let auth;
  let db;
  if (isBrowser) {
    auth = getAuth(firebase);
    db = getFirestore(firebase);
  }

  const addUserInfo = () => {
    setIsModalOpen(true);
  };

  
  
  useEffect(() => {
    if(user){
    //THIS INITIATES REALTIME LISTENERS
    const userRef = collection(db, databaseName);
    const q = query(
      collectionGroup(db, databaseName),
      where("email", "==", user ? user.email : "")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            console.log("Item added: ", change.doc.data());
        }
        if (change.type === "modified") {
            console.log("Item modified: ", JSON.stringify(change.doc.data()));
            console.log(JSON.stringify(change.doc.data()) !== JSON.stringify(userData));
            if (JSON.stringify(change.doc.data()) !== JSON.stringify(userData)) {
              unsubscribe()
            }
        }
        if (change.type === "removed") {
            console.log("Item removed: ", change.doc.data());
        }
      });
      if (querySnapshot.empty && user) {
        
        addUser({ email: user.email, brentCollection: databaseName });
        addUserInfo();
      }
      const userItems = [];
      querySnapshot.forEach((doc) => {

        setUserData(doc.data());
        userItems.push(doc.data());
      });
    });
    // }

    return () => {
      unsubscribe();
      console.log("unsubscribed!");
    };
  }
  }, [databaseName, user]);


  useEffect(() => {
    if (!auth) return;
    return auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        console.log("user is logged in");
        setUser(firebaseUser);
      } else {
        console.log("user is not logged in");
      }
    });
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setIsPopupOpen({
          open: true,
          message: "Signed out...",
          severity: "success",
          closePopup: handleClosePopup,
        });
        setUser(null);
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const handleSignIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setIsPopupOpen({
          open: true,
          message: "Signed in with email " + userCredential.user.email,
          severity: "success",
          closePopup: handleClosePopup,
        });
        setUser(userCredential.user);
        // ...
      })
      .catch((error) => {
        setIsPopupOpen({
          open: true,
          message: error.message,
          severity: "error",
          closePopup: handleClosePopup,
        });
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const isLoggedIn = () => {
    return !!user;
  };



  const output = {
    user: user,
    db: firebase,
    auth: auth,
    handleSignOut,
    handleSignIn,
    isPopupOpen,
    setIsPopupOpen,
    isModalOpen,
    setIsModalOpen,
    isBrowser,
    handleClosePopup,
    userData,
    isLoggedIn,
    addUser,
    databaseName,
    selectedIndex,
    setSelectedIndex
  };

  return <AppContext.Provider value={output}>{children}</AppContext.Provider>;
};

export default AppProvider;

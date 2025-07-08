import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();
// authProvider
export const AuthProvider = ({ children }) => {
  const [currentUser, setcurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // sign-up user
  const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  //login user
  const signInUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  //login with google email, password
  const signInWithGoogle = async (email, password) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("🔥 Google Sign-In User:", user);

      return {
        email: user.email,
        displayName: user.displayName,
      };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  // Sign-out
  const logOut = () => {
    return signOut(auth);
  };

  // Reset Password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent to:", email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  // Manage User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setcurrentUser(user);
      setLoading(false);

      if (user) {
        const { email, displayName, photoURL } = user;
        const userData = {
          email,
          userName: displayName,
          photo: photoURL,
        };
      }
    });
    return () => unsubscribe;
  }, []);

  const value = {
    currentUser,
    registerUser,
    signInUser,
    signInWithGoogle,
    logOut,
    resetPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

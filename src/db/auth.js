import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { serverTimestamp, set } from "firebase/database";
import { auth } from "../firebase";
import { userRef } from "./schema";

const emailFor = (username) => `${username.trim().toLowerCase()}@quiz-app.local`;

export const register = async (username, password) => {
  const email = emailFor(username);
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await set(userRef(cred.user.uid), {
    username: username.trim(),
    createdAt: serverTimestamp(),
  });
  return cred.user;
};

export const login = (username, password) =>
  signInWithEmailAndPassword(auth, emailFor(username), password);

export const logout = () => signOut(auth);

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { onValue } from "firebase/database";
import { auth } from "../firebase";
import { adminRef, userRef } from "../db/schema";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setUsername(null);
      return undefined;
    }
    const off = onValue(userRef(user.uid), (snap) => {
      setUsername(snap.val()?.username ?? null);
    });
    return off;
  }, [user]);

  useEffect(() => {
    if (!username) {
      setIsAdmin(false);
      return undefined;
    }
    const off = onValue(adminRef(username.toLowerCase()), (snap) => {
      setIsAdmin(snap.exists() && snap.val() === true);
    });
    return off;
  }, [username]);

  return { user, username, isAdmin, loading };
}

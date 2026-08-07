import { useEffect, useMemo, useState } from "react";
import { onDisconnect, onValue, set } from "firebase/database";
import {
  presenceSessionRef,
  presenceSessionsRef,
} from "../db/schema";

const newSessionId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function usePresence(uid) {
  const sessionId = useMemo(newSessionId, []);
  const [online, setOnline] = useState(false);
  const [otherActive, setOtherActive] = useState(false);

  useEffect(() => {
    if (!uid) return undefined;

    const myRef = presenceSessionRef(uid, sessionId);
    set(myRef, { since: Date.now() }).catch(() => {});
    const cancel = onDisconnect(myRef);
    cancel.remove();

    const off = onValue(presenceSessionsRef(uid), (snap) => {
      const sessions = snap.val();
      const ids = sessions ? Object.keys(sessions) : [];
      setOnline(ids.length > 0);
      setOtherActive(ids.some((id) => id !== sessionId));
    });

    const onPageHide = () => {
      set(myRef, null).catch(() => {});
    };
    window.addEventListener("pagehide", onPageHide);

    return () => {
      off();
      window.removeEventListener("pagehide", onPageHide);
      set(myRef, null).catch(() => {});
    };
  }, [uid, sessionId]);

  return { online, otherActive };
}

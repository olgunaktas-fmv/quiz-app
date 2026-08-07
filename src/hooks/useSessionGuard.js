import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const CHANNEL = "quiz-arena-session";
export const SESSION_GUARD_KEY = "quiz_guard_message";

export function useSessionGuard(uid) {
  useEffect(() => {
    if (!uid) return undefined;

    const startedAt = Date.now();
    const channel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel(CHANNEL)
        : null;

    const onMessage = (e) => {
      const msg = e.data;
      if (!msg || msg.type !== "hello" || msg.uid !== uid) return;
      if (msg.startedAt < startedAt) {
        sessionStorage.setItem(
          SESSION_GUARD_KEY,
          "Bu oyuncu zaten başka bir sekmede açık. Yeni oyuncu olarak giriş yapabilirsiniz."
        );
        signOut(auth).catch(() => {});
      }
    };

    if (channel) {
      channel.onmessage = onMessage;
      try {
        channel.postMessage({ type: "hello", uid, startedAt });
      } catch {
        /* channel kapalı olabilir */
      }
    }

    const onPageHide = () => {
      try {
        channel?.postMessage({ type: "bye", uid });
      } catch {
        /* yoksay */
      }
    };
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      onPageHide();
      channel?.close();
    };
  }, [uid]);
}

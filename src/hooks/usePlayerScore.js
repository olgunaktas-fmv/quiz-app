import { useEffect, useState } from "react";
import { scoreRef } from "../db/schema";
import { onValue } from "firebase/database";

export function usePlayerScore(playerId) {
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (!playerId) return undefined;
    const off = onValue(scoreRef(playerId), (snap) => setScore(snap.val()));
    return off;
  }, [playerId]);

  return score;
}

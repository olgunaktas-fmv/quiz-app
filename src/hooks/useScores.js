import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { scoresRef } from "../db/schema";

export function useScores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const off = onValue(scoresRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data)
        .map(([id, s]) => ({ id, ...s }))
        .sort(
          (a, b) =>
            (b.total ?? 0) - (a.total ?? 0) ||
            (b.correctCount ?? 0) - (a.correctCount ?? 0)
        );
      setScores(list);
    });
    return off;
  }, []);

  return scores;
}

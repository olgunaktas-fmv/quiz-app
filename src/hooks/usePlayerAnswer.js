import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { playerAnswerRef } from "../db/schema";

export function usePlayerAnswer(questionId, playerId) {
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    if (!questionId || !playerId) {
      setAnswer(null);
      return undefined;
    }
    const off = onValue(playerAnswerRef(questionId, playerId), (snap) =>
      setAnswer(snap.val())
    );
    return off;
  }, [questionId, playerId]);

  return answer;
}

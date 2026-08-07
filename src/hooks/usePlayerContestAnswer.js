import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { contestPlayerAnswerRef } from "../db/schema";

export function usePlayerContestAnswer(contestId, questionId, uid) {
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    if (!contestId || !questionId || !uid) {
      setAnswer(null);
      return undefined;
    }
    const off = onValue(contestPlayerAnswerRef(contestId, questionId, uid), (snap) =>
      setAnswer(snap.val())
    );
    return off;
  }, [contestId, questionId, uid]);

  return answer;
}

import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { contestAnswersForQuestionRef } from "../db/schema";

export function useContestAnswers(contestId, questionId) {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!contestId || !questionId) {
      setAnswers([]);
      return undefined;
    }
    const off = onValue(contestAnswersForQuestionRef(contestId, questionId), (snap) => {
      const data = snap.val() || {};
      setAnswers(
        Object.entries(data).map(([uid, a]) => ({ uid, ...a }))
      );
    });
    return off;
  }, [contestId, questionId]);

  return answers;
}

import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { questionAnswersRef } from "../db/schema";

export function useQuestionAnswers(questionId) {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!questionId) {
      setAnswers([]);
      return undefined;
    }
    const off = onValue(questionAnswersRef(questionId), (snap) => {
      const data = snap.val() || {};
      setAnswers(
        Object.entries(data).map(([playerId, a]) => ({ playerId, ...a }))
      );
    });
    return off;
  }, [questionId]);

  return answers;
}

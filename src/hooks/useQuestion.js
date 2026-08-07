import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { questionRef } from "../db/schema";

export function useQuestion(questionId) {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    if (!questionId) {
      setQuestion(null);
      return undefined;
    }
    const off = onValue(questionRef(questionId), (snap) =>
      setQuestion({ id: questionId, ...(snap.val() || {}) })
    );
    return off;
  }, [questionId]);

  return question;
}

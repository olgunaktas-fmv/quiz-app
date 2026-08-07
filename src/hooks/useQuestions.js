import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { questionsRef } from "../db/schema";

export function useQuestions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const off = onValue(questionsRef, (snap) => {
      const data = snap.val() || {};
      setQuestions(
        Object.entries(data).map(([id, q]) => ({ id, ...q }))
      );
    });
    return off;
  }, []);

  return questions;
}

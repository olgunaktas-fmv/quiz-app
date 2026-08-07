import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { resultsForContestRef } from "../db/schema";

export function useContestResults(contestId) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!contestId) {
      setResults([]);
      return undefined;
    }
    const off = onValue(resultsForContestRef(contestId), (snap) => {
      const data = snap.val() || {};
      setResults(
        Object.entries(data)
          .map(([id, r]) => ({ id, ...r }))
          .sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
      );
    });
    return off;
  }, [contestId]);

  return results;
}

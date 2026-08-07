import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { contestRef } from "../db/schema";

export function useContest(contestId) {
  const [contest, setContest] = useState(null);

  useEffect(() => {
    if (!contestId) {
      setContest(null);
      return undefined;
    }
    const off = onValue(contestRef(contestId), (snap) =>
      setContest({ id: contestId, ...(snap.val() || {}) })
    );
    return off;
  }, [contestId]);

  return contest;
}

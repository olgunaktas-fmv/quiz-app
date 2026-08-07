import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { contestsRef } from "../db/schema";

export function useContests() {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const off = onValue(contestsRef, (snap) => {
      const data = snap.val() || {};
      setContests(
        Object.entries(data)
          .map(([id, c]) => ({ id, ...c }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      );
    });
    return off;
  }, []);

  return contests;
}

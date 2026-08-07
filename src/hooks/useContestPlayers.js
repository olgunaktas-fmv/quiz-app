import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { contestPlayersForRef } from "../db/schema";

export function useContestPlayers(contestId) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!contestId) {
      setPlayers([]);
      return undefined;
    }
    const off = onValue(contestPlayersForRef(contestId), (snap) => {
      const data = snap.val() || {};
      setPlayers(
        Object.entries(data).map(([uid, p]) => ({ uid, ...p }))
      );
    });
    return off;
  }, [contestId]);

  return players;
}

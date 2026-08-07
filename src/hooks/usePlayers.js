import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { playersRef } from "../db/schema";

export function usePlayers() {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    const off = onValue(playersRef, (snap) => {
      const data = snap.val() || {};
      setPlayers(data);
    });
    return off;
  }, []);

  return players;
}

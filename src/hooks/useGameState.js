import { useEffect, useState } from "react";
import { onValue } from "firebase/database";
import { gameRef } from "../db/schema";

export function useGameState() {
  const [game, setGame] = useState(undefined);

  useEffect(() => {
    const off = onValue(gameRef, (snap) => setGame(snap.val()));
    return off;
  }, []);

  return game;
}

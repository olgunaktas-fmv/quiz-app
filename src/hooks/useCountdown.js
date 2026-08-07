import { useEffect, useState } from "react";

export function useCountdown(seconds, isActive, startedAt) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!isActive || !seconds) return undefined;
    const elapsed = startedAt
      ? Math.floor((Date.now() - startedAt) / 1000)
      : 0;
    setRemaining(Math.max(0, seconds - elapsed));
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds, isActive, startedAt]);

  return remaining;
}

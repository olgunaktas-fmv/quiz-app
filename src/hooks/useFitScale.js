import { useEffect, useRef, useState } from "react";

export function useFitScale() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return undefined;

    const update = () => {
      const k = Math.min(
        1,
        outer.clientHeight / inner.offsetHeight,
        outer.clientWidth / inner.offsetWidth
      );
      setScale(Number.isFinite(k) && k > 0 ? k : 1);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return { outerRef, innerRef, scale };
}

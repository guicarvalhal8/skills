"use client";
import { useEffect, useState } from "react";

/** true quando o usuário pediu movimento reduzido no sistema. */
export function usePrefersReducedMotion() {
  const [reduz, setReduz] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduz(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduz(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduz;
}

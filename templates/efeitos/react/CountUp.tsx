"use client";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = { to: number; duration?: number; decimals?: number; prefix?: string; suffix?: string; className?: string };

const fmt = (v: number, d: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Número que conta até `to` quando entra na tela. */
export function CountUp({ to, duration = 1600, decimals = 0, prefix = "", suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);
  const reduz = usePrefersReducedMotion();

  useEffect(() => {
    if (reduz) { setValor(to); return; }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const passo = (agora: number) => {
        const t = Math.min((agora - t0) / duration, 1);
        setValor(to * (1 - Math.pow(1 - t, 4)));
        if (t < 1) raf = requestAnimationFrame(passo);
      };
      raf = requestAnimationFrame(passo);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration, reduz]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${fmt(to, decimals)}${suffix}`}>
      <span aria-hidden>{prefix}{fmt(valor, decimals)}{suffix}</span>
    </span>
  );
}

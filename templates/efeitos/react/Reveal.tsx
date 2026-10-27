"use client";
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** atraso em ms (use i * 80 para cascata em listas) */
  delay?: number;
  /** deslocamento inicial em px no eixo Y (negativo = vem de cima) */
  y?: number;
  className?: string;
  once?: boolean;
};

/** Entra com fade + slide quando aparece na tela. */
export function Reveal({ children, as: Tag = "div", delay = 0, y = 28, className, once = true }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  const reduz = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisivel(true); if (once) io.disconnect(); }
      else if (!once) setVisivel(false);
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const style: CSSProperties = reduz ? {} : {
    opacity: visivel ? 1 : 0,
    transform: visivel ? "none" : `translate3d(0, ${y}px, 0)`,
    transition: "opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)",
    transitionDelay: `${delay}ms`,
  };

  return <Tag ref={ref} className={className} style={style}>{children}</Tag>;
}

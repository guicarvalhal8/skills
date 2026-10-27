"use client";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** segundos por volta */
  duration?: number;
  reverse?: boolean;
  gap?: string;
  className?: string;
};

/**
 * Faixa rolando infinitamente (logos, depoimentos). Pausa no hover.
 * Requer o CSS de `efeitos.css` (keyframes `marquee-rolar` + classes .marquee*) no globals.css.
 */
export function Marquee({ children, duration = 30, reverse = false, gap = "3rem", className = "" }: Props) {
  const vars = { "--duracao": `${duration}s`, "--gap": gap } as CSSProperties;
  return (
    <div className={`marquee ${reverse ? "marquee--reverso" : ""} ${className}`} style={vars}>
      <div className="marquee__trilha">
        <div className="marquee__grupo">{children}</div>
        <div className="marquee__grupo" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}

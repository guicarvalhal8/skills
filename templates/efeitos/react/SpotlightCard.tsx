"use client";
import { useRef, type ReactNode, type PointerEvent, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** cor do brilho em "R G B", ex.: "200 255 61" */
  color?: string;
  radius?: number;
};

/** Card com brilho radial que segue o cursor. Combine com suas classes (bg, borda, padding). */
export function SpotlightCard({ children, className, color = "255 255 255", radius = 320 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mover = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot-op", "1");
  };
  const sair = () => ref.current?.style.setProperty("--spot-op", "0");

  const style = { position: "relative", isolation: "isolate", overflow: "hidden" } as CSSProperties;
  const brilho: CSSProperties = {
    position: "absolute", inset: 0, zIndex: -1, pointerEvents: "none",
    opacity: "var(--spot-op, 0)", transition: "opacity .3s ease",
    background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), rgb(${color} / .14), transparent 60%)`,
  };

  return (
    <div ref={ref} className={className} style={style} onPointerMove={mover} onPointerLeave={sair}>
      <span aria-hidden style={brilho} />
      {children}
    </div>
  );
}

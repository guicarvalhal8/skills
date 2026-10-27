"use client";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = { children: ReactNode; strength?: number; className?: string };

/** Envolve um botão/link e o "puxa" na direção do cursor. */
export function Magnetic({ children, strength = 0.3, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduz = usePrefersReducedMotion();

  const mover = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduz || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const soltar = () => { if (ref.current) ref.current.style.transform = ""; };

  return (
    <span
      ref={ref}
      className={className}
      onPointerMove={mover}
      onPointerLeave={soltar}
      style={{ display: "inline-block", transition: "transform .35s cubic-bezier(.16,1,.3,1)" }}
    >
      {children}
    </span>
  );
}

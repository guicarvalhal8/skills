"use client";
import { useEffect, useRef, useState, type ElementType } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Props = { text: string; as?: ElementType; step?: number; className?: string };

/** Headline em que cada palavra sobe em sequência. Texto completo fica acessível via aria-label. */
export function SplitText({ text, as: Tag = "h1", step = 70, className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  const reduz = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisivel(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const palavras = text.split(/\s+/);
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {palavras.map((p, i) => (
        <span key={i} aria-hidden style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: ".08em" }}>
          <span
            style={{
              display: "inline-block",
              transform: reduz || visivel ? "none" : "translateY(105%)",
              transition: reduz ? "none" : `transform .8s cubic-bezier(.16,1,.3,1) ${i * step}ms`,
            }}
          >
            {p}
          </span>
          {i < palavras.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

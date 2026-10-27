// Tilt 3D — inclina o elemento conforme o cursor.
// Uso: <div data-tilt>…</div>   inclinação máx em graus: data-tilt="10"
(() => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    const max = Number(el.dataset.tilt) || 8;
    el.style.transformStyle = "preserve-3d";
    el.style.transition = "transform .4s cubic-bezier(.16,1,.3,1)";
    let raf = 0;
    el.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) scale(1.02)`;
      });
    });
    el.addEventListener("pointerleave", () => { cancelAnimationFrame(raf); el.style.transform = ""; });
  });
})();

// Botão magnético — o elemento é "puxado" pelo cursor.
// Uso: <a class="btn" data-magnetico>…</a>   força: data-magnetico="0.35" (0–1)
(() => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-magnetico]").forEach((el) => {
    const forca = Number(el.dataset.magnetico) || 0.3;
    el.style.transition = "transform .35s cubic-bezier(.16,1,.3,1)";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * forca;
      const y = (e.clientY - (r.top + r.height / 2)) * forca;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
})();

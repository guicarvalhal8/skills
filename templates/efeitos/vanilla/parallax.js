// Parallax leve — o elemento se move mais devagar/rápido que o scroll.
// Uso: <img data-parallax="0.2" …>   positivo = mais lento (fica "atrás"), negativo = mais rápido
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const els = [...document.querySelectorAll("[data-parallax]")];
  if (!els.length) return;
  const visiveis = new Set();
  let agendado = false;

  function atualizar() {
    agendado = false;
    const vh = innerHeight;
    visiveis.forEach((el) => {
      const r = el.getBoundingClientRect();
      const centro = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(centro * -Number(el.dataset.parallax)).toFixed(1)}px, 0)`;
    });
  }
  const agendar = () => { if (!agendado) { agendado = true; requestAnimationFrame(atualizar); } };

  const io = new IntersectionObserver((es) => {
    es.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
    agendar();
  }, { rootMargin: "20% 0px" });
  els.forEach((el) => { el.style.willChange = "transform"; io.observe(el); });
  addEventListener("scroll", agendar, { passive: true });
  addEventListener("resize", agendar, { passive: true });
})();

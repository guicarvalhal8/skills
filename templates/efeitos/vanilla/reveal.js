// Reveal no scroll — ver reveal.css para o uso.
(() => {
  document.querySelectorAll("[data-reveal-stagger]").forEach((pai) => {
    const passo = Number(pai.dataset.revealStagger) || 80;
    [...pai.children].forEach((filho, i) => {
      if (!filho.hasAttribute("data-reveal")) filho.setAttribute("data-reveal", "");
      filho.style.setProperty("--reveal-delay", `${i * passo}ms`);
    });
  });
  const alvos = document.querySelectorAll("[data-reveal]");
  alvos.forEach((el) => {
    if (el.dataset.revealDelay) el.style.setProperty("--reveal-delay", `${el.dataset.revealDelay}ms`);
  });
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    alvos.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      if (!e.target.hasAttribute("data-reveal-repeat")) io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  alvos.forEach((el) => io.observe(el));
})();

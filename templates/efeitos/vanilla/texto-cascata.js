// Texto em cascata — ver texto-cascata.css.
(() => {
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-cascata]").forEach((el) => {
    const texto = el.textContent.trim();
    el.setAttribute("aria-label", texto);
    if (el.dataset.cascata) el.style.setProperty("--cascata-passo", `${el.dataset.cascata}ms`);
    el.innerHTML = texto.split(/\s+/).map((p, i) =>
      `<span class="cascata-palavra" aria-hidden="true"><span class="cascata-interna" style="--i:${i}">${p.replace(/</g, "&lt;")}</span></span>`
    ).join(" ");
    if (reduz || !("IntersectionObserver" in window)) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
  });
})();

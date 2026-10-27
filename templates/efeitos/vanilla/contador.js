// Contador animado ao entrar na tela.
// Uso: <span data-contador="1500" data-prefixo="R$ " data-sufixo="+" data-duracao="1600" data-decimais="0">0</span>
(() => {
  const fmt = (v, dec) => v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);
  const animar = (el) => {
    const alvo = Number(el.dataset.contador);
    const dur = Number(el.dataset.duracao) || 1600;
    const dec = Number(el.dataset.decimais) || 0;
    const pre = el.dataset.prefixo || "", suf = el.dataset.sufixo || "";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = pre + fmt(alvo, dec) + suf; return; }
    const t0 = performance.now();
    const passo = (agora) => {
      const t = Math.min((agora - t0) / dur, 1);
      el.textContent = pre + fmt(alvo * easeOut(t), dec) + suf;
      if (t < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { animar(e.target); io.unobserve(e.target); }
  }), { threshold: 0.5 });
  document.querySelectorAll("[data-contador]").forEach((el) => io.observe(el));
})();

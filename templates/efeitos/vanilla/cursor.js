// Cursor seguidor — ver cursor.css. Mantém o cursor nativo (acessibilidade); o efeito é decorativo.
(() => {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ponto = Object.assign(document.createElement("div"), { className: "cursor-ponto" });
  const anel = Object.assign(document.createElement("div"), { className: "cursor-anel" });
  ponto.setAttribute("aria-hidden", "true"); anel.setAttribute("aria-hidden", "true");
  document.body.append(ponto, anel);
  let mx = -100, my = -100, ax = mx, ay = my;
  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    ponto.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
  }, { passive: true });
  const loop = () => {
    ax += (mx - ax) * 0.18; ay += (my - ay) * 0.18;
    anel.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
  const seletor = "a, button, [data-cursor]";
  document.addEventListener("pointerover", (e) => {
    const alvo = e.target.closest(seletor);
    anel.classList.toggle("ativo", !!alvo);
    anel.textContent = alvo?.dataset.cursor || "";
  });
  document.addEventListener("pointerleave", () => { anel.classList.add("oculto"); ponto.classList.add("oculto"); });
  document.addEventListener("pointerenter", () => { anel.classList.remove("oculto"); ponto.classList.remove("oculto"); });
})();

// Máquina de escrever com frases rotativas.
// Uso: <span data-typewriter='["sites rápidos","apps com IA","automações"]'></span>
//      velocidade: data-velocidade="60" (ms/letra) · pausa: data-pausa="1600" (ms)
(() => {
  document.querySelectorAll("[data-typewriter]").forEach((el) => {
    const frases = JSON.parse(el.dataset.typewriter);
    const vel = Number(el.dataset.velocidade) || 60;
    const pausa = Number(el.dataset.pausa) || 1600;
    el.setAttribute("aria-label", frases.join(", "));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = frases[0]; return; }
    const texto = document.createElement("span");
    texto.setAttribute("aria-hidden", "true");
    const caret = document.createElement("span");
    caret.textContent = "|"; caret.setAttribute("aria-hidden", "true");
    caret.style.cssText = "margin-left:2px;animation:tw-piscar 1s steps(1) infinite";
    el.replaceChildren(texto, caret);
    if (!document.getElementById("tw-estilo")) {
      const s = document.createElement("style"); s.id = "tw-estilo";
      s.textContent = "@keyframes tw-piscar{50%{opacity:0}}"; document.head.append(s);
    }
    let i = 0, n = 0, apagando = false;
    const tick = () => {
      const f = frases[i];
      n += apagando ? -1 : 1;
      texto.textContent = f.slice(0, n);
      let espera = apagando ? vel / 2 : vel;
      if (!apagando && n === f.length) { apagando = true; espera = pausa; }
      else if (apagando && n === 0) { apagando = false; i = (i + 1) % frases.length; espera = 300; }
      setTimeout(tick, espera);
    };
    tick();
  });
})();

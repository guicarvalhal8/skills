---
name: efeitos
description: Catálogo de efeitos visuais e animações prontos para sites e apps (reveal no scroll, botão magnético, spotlight no card, tilt 3D, texto em cascata, marquee infinito, fundo gradiente animado, cursor seguidor, contador, máquina de escrever, parallax) em CSS/JS puro e React, com regras de performance e acessibilidade de animação. Use quando o usuário pedir animação, efeito, micro-interação, "deixa mais vivo", "efeito de scroll", "hover bonito", "site premium", ou rodar /efeitos.
---

# Efeitos

Os arquivos prontos ficam em `templates/efeitos/` do repo skills-base:
```bash
BASE="$(cat ~/.claude/.skills-base-path)"; ls "$BASE/templates/efeitos"/{vanilla,react}
```
Abra `templates/efeitos/index.html` no navegador para ver todos funcionando.

## Catálogo
| Efeito | Vanilla | React | Bom para | Custo |
|---|---|---|---|---|
| Reveal no scroll | `reveal.css/.js` | `Reveal.tsx` | seções, cards, listas (stagger) | baixo |
| Botão magnético | `magnetico.js` | `Magnetic.tsx` | CTA principal | baixo |
| Spotlight no card | `spotlight.css/.js` | `SpotlightCard.tsx` | grids de features/preços | baixo |
| Tilt 3D | `tilt.js` | — | card de produto, mockup | baixo |
| Texto em cascata | `texto-cascata.css/.js` | `SplitText.tsx` | headline do hero | baixo |
| Marquee infinito | `marquee.css` | `Marquee.tsx` | logos de clientes, depoimentos | muito baixo (CSS) |
| Fundo gradiente animado | `fundo-gradiente.css` | — | hero, seção de destaque | baixo (CSS) |
| Cursor seguidor | `cursor.css/.js` | — | portfólio, site criativo (só desktop) | médio |
| Contador | `contador.js` | `CountUp.tsx` | números/estatísticas | baixo |
| Máquina de escrever | `typewriter.js` | — | subtítulo rotativo | baixo |
| Parallax leve | `parallax.js` | — | imagens de fundo, camadas do hero | médio |

## Como aplicar
1. Escolha **no máximo 2–3 efeitos por página** e um efeito "assinatura" (o que a pessoa vai lembrar). Efeito em tudo = nada se destaca.
2. Copie os arquivos para o projeto (`src/components/efeitos/` no React, `assets/` no estático) — não importe do repo base.
3. Vanilla: os efeitos são ativados por atributo `data-*` (ex.: `data-reveal`, `data-magnetico`) — veja o topo de cada arquivo.
4. Next.js: componentes React já vêm com `"use client"`; use-os em folhas da árvore.

## Regras de movimento
- Anime só `transform` e `opacity` (GPU). Nunca `width/height/top/left/box-shadow` em loop.
- Durações: micro-interação 150–250ms · entrada de elemento 400–700ms · nada acima de 1s sem motivo.
- Easing: entrada `cubic-bezier(.16,1,.3,1)` (ease-out expo); evite `linear` exceto marquee/loops.
- Stagger entre itens de 60–100ms.
- **Sempre** respeitar `prefers-reduced-motion: reduce` (todos os arquivos já fazem — mantenha ao adaptar).
- Efeitos de ponteiro (magnético, tilt, cursor, spotlight) só em `(hover: hover) and (pointer: fine)`.
- Nada de animação que bloqueie leitura ou atrase o conteúdo principal (LCP).
- Use `IntersectionObserver` e `requestAnimationFrame`; nunca `scroll` listener pesado sem rAF.

## Quando precisar de mais
- Sequências complexas/scroll-telling: GSAP + ScrollTrigger ou `motion` (Framer Motion).
- 3D real: Three.js / React Three Fiber (carregar com `dynamic`, só onde precisa).
- Transições entre páginas: View Transitions API.
Adicione o efeito novo em `templates/efeitos/` e nesta tabela, para reaproveitar no próximo projeto.

# templates/efeitos

Abra `index.html` no navegador para ver todos os efeitos funcionando.

- `vanilla/` — CSS/JS puro, ativado por atributos `data-*` (instruções no topo de cada arquivo). Sem dependências.
- `react/` — componentes TSX com `"use client"` (Next.js/Vite). Copie para `src/components/efeitos/`. O `Marquee` precisa do `efeitos.css` no `globals.css`.
- Os efeitos de cursor seguidor, tilt, parallax, máquina de escrever e fundo gradiente existem só em vanilla — em React, carregue o arquivo vanilla num `useEffect` ou adapte usando os componentes como modelo.

Todos respeitam `prefers-reduced-motion` e só animam `transform`/`opacity`. Regras de uso: skill `efeitos`.

Adicionou um efeito novo? Coloque aqui, adicione na galeria `index.html` e na tabela da skill `efeitos`.

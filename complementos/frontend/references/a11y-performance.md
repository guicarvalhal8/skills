# Checklist de acessibilidade e performance

## Acessibilidade (WCAG 2.2 AA, o essencial)
- [ ] Um `h1` por página; headings em ordem
- [ ] Todo input com `<label>` (ou `aria-label`); erro ligado via `aria-describedby`
- [ ] Botão é `<button>`, link é `<a href>` — nunca `div onClick`
- [ ] Foco visível (`focus-visible:ring`) e ordem de tab lógica
- [ ] Modal prende o foco e fecha com Esc (shadcn já faz)
- [ ] Contraste ≥ 4.5:1 texto normal, 3:1 texto grande/ícones
- [ ] `alt` descritivo; imagem decorativa com `alt=""`
- [ ] Alvo de toque ≥ 44×44 px no mobile
- [ ] `prefers-reduced-motion: reduce` desliga animações não essenciais
- [ ] `lang="pt-BR"` no `<html>`

## Performance
- [ ] Imagens via `next/image` com `sizes`; hero com `priority`
- [ ] Fontes via `next/font` (sem FOIT/CLS)
- [ ] Espaço reservado para imagem/embed (sem layout shift)
- [ ] Client components mínimos; libs pesadas com `dynamic(() => import(...), { ssr: false })` se só cliente
- [ ] Sem waterfall de requests: `Promise.all` no servidor
- [ ] Listas longas paginadas ou virtualizadas
- [ ] `npm run build` → conferir tamanho das rotas; investigar rota > 200 kB JS

## Como medir rápido
```bash
npx lighthouse http://localhost:3000 --only-categories=performance,accessibility --quiet --chrome-flags="--headless"
```

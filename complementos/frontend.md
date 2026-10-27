## Complemento skills-base — práticas da base

> As regras abaixo vêm da base skills-base e complementam a skill original acima. Em conflito, siga a skill original na **metodologia** e esta seção nos **padrões do projeto** (stack, caminhos `docs/`, formatos).

### Padrões (a menos que o projeto já use outra coisa — aí siga o projeto)
- **Next.js App Router + TypeScript estrito** (`"strict": true`). Desktop: Electron + Vite + React.
- **Tailwind** + tokens no `tailwind.config`/CSS vars (cores, raio, sombra, fonte). Nada de cor hex solta em componente.
- **shadcn/ui** para primitivos (Dialog, Select, Toast…) — acessíveis por padrão. Não reinvente modal.
- **Formulários:** react-hook-form + Zod (o mesmo schema valida no servidor).
- **Dados:** Server Components + `fetch`/Server Actions por padrão; TanStack Query só para estado de servidor no cliente (polling, otimista, cache).
- **Estado de UI:** `useState`/URL (searchParams) primeiro; Zustand se precisar de global. Sem Redux para app pequeno.
- **Ícones:** lucide-react. **Animação:** CSS/`motion` (ver skill `efeitos`).

### Estrutura
```
src/
  app/                 # rotas (page.tsx, layout.tsx, loading.tsx, error.tsx)
    (marketing)/       # grupos de rota
    api/               # route handlers (só se precisar de endpoint público)
  components/
    ui/                # primitivos (shadcn) — não colocar regra de negócio aqui
    <feature>/         # componentes da feature
  features/<feature>/  # actions, hooks, schemas, tipos da feature (opcional p/ apps maiores)
  lib/                 # utilitários puros, clients (db, api), cn()
  styles/
```
Detalhes e convenções: `references/estrutura-nextjs.md`.

### Regras de componente
1. `"use client"` só onde há estado/efeito/evento — empurre para a folha da árvore.
2. Um componente por arquivo, `PascalCase.tsx`; props tipadas com `type Props = {...}`.
3. Componente > ~150 linhas ou com 3+ responsabilidades → quebre.
4. Sem `fetch` dentro de `useEffect` para dado inicial — busque no servidor.
5. Toda lista com `key` estável (id, nunca índice se a lista muda).
6. Todo estado assíncrono tem: carregando · vazio · erro · sucesso.

### Design
Direção visual (tipografia, paleta, composição, anti-"cara de IA") fica na skill `frontend-design`; esta cuida da engenharia.

### Acessibilidade e responsivo (obrigatório)
- HTML semântico (`button`, `nav`, `main`, `label`), foco visível, contraste AA, `alt` em imagem.
- Mobile-first; testar 360 / 768 / 1280 px.
- Respeitar `prefers-reduced-motion`.
Checklist completo: `references/a11y-performance.md`.

### Performance
- `next/image` (com `sizes`), `next/font`, `dynamic()` para componentes pesados abaixo da dobra.
- Não importar lib inteira (`lodash` → `lodash/debounce` ou nativo).
- Metas: LCP < 2,5s · INP < 200ms · CLS < 0,1.

### Antes de entregar UI
1. `npm run lint && npm run build` sem erro.
2. Abra a página no navegador (Playwright) em desktop e mobile e **olhe o screenshot**.
3. Confira os 4 estados e a navegação por teclado.

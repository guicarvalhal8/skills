# Next.js — convenções

## Nomes
| Coisa | Padrão | Exemplo |
|---|---|---|
| Componente | PascalCase.tsx | `PedidoCard.tsx` |
| Hook | useCamelCase.ts | `usePedidos.ts` |
| Server action | verboSubstantivo em `actions.ts` | `criarPedido` |
| Schema Zod | `xxxSchema` + `type Xxx = z.infer<…>` | `pedidoSchema` |
| Rota | kebab-case | `app/meus-pedidos/page.tsx` |

## Arquivos especiais por rota
- `loading.tsx` — skeleton (não spinner genérico)
- `error.tsx` — `"use client"`, botão "tentar de novo" com `reset()`
- `not-found.tsx`
- `metadata` exportado em toda `page.tsx` pública (title, description, openGraph)

## Server Actions
```ts
"use server";
import { z } from "zod";
const schema = z.object({ nome: z.string().min(2).max(80) });

export async function criarCliente(_: unknown, form: FormData) {
  const sessao = await exigirSessao();                 // autenticação SEMPRE no servidor
  const dados = schema.safeParse(Object.fromEntries(form));
  if (!dados.success) return { erro: dados.error.flatten().fieldErrors };
  await db.cliente.create({ data: { ...dados.data, donoId: sessao.userId } });
  revalidatePath("/clientes");
  return { ok: true };
}
```
Server Action é endpoint público: valide e autorize dentro dela, sempre.

## Variáveis de ambiente
- `NEXT_PUBLIC_*` vai para o navegador — **nunca** chave secreta aí.
- Valide env na inicialização (`src/lib/env.ts` com Zod) para falhar cedo.

## Utilitários padrão
```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
```

## Electron
- `contextIsolation: true`, `nodeIntegration: false`, expor só o necessário via `preload` + `contextBridge`.
- IPC com canais nomeados e payload validado; nunca `shell.openExternal` com URL não validada.

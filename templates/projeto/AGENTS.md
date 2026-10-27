# {{NOME_PROJETO}}

> Instruções para qualquer agente de IA (padrão AGENTS.md). Lido em toda sessão: mantenha < 80 linhas. Detalhes ficam nas skills e em docs/.

## O que é
<1–2 frases: o que o projeto faz e para quem>

## Stack
- <ex.: Next.js 15 (App Router) + TypeScript + Tailwind + shadcn/ui>
- <ex.: Postgres + Prisma> · <deploy: Vercel/Render>

## Comandos
| Ação | Comando |
|---|---|
| dev | `<npm run dev>` |
| testes | `<npm test>` |
| lint | `<npm run lint>` |
| typecheck | `<npx tsc --noEmit>` |
| build | `<npm run build>` |
| migração | `<npx prisma migrate dev>` |

## Mapa de pastas
```
<src/app — rotas · src/components — UI · src/lib — utilitários · tests/ — testes>
```

## Regras do projeto
- Siga as skills `regras`, `clean-code`, `boas-praticas` (base skills-base).
- Implementação de feature: skill `fluxo-dev`. Antes de merge: skill `esquadrao-julgamento`.
- Antes de explorar o código: leia `graphify-out/GRAPH_REPORT.md` (se existir).
- Estado do trabalho: `docs/PROGRESSO.md` — leia ao começar, atualize ao terminar.
- Nunca leia nem mostre `.env`; variáveis documentadas em `.env.example`.
- <regras específicas deste projeto, ex.: "valores em centavos", "textos da UI em pt-BR">

## Docs
- Produto: `docs/SPEC.md` · Tarefas: `docs/PLANO.md` · Estado: `docs/PROGRESSO.md` · Decisões: `docs/adr/`

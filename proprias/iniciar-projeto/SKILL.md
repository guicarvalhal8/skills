---
name: iniciar-projeto
description: Ponto de entrada para começar QUALQUER projeto novo (ou adotar um projeto existente) usando a base skills-base — copia os templates (AGENTS.md, docs, .github, settings), confere Superpowers e Graphify, define stack, e conduz brainstorm → SPEC → PLANO. Use quando o usuário disser "novo projeto", "iniciar projeto", "começar do zero", "bootstrap", "setup inicial", "adotar este repo" ou rodar /iniciar-projeto.
---

# Iniciar projeto

Objetivo: sair desta skill com um repositório que tem **regras, mapa, especificação, plano e primeiro commit** — pronto para a skill `subagent-driven-development` (fluxo por agentes).

## 0. Localizar a base
```bash
BASE="$(cat ~/.agents/.skills-base-path 2>/dev/null || cat .agents/.skills-base-path 2>/dev/null)"
echo "$BASE"; ls "$BASE/templates/projeto"
```
Se não existir, peça ao usuário o caminho do clone do `skills-base` (ou para rodar `./install.sh`).

## 1. Entender o projeto (perguntas curtas, de uma vez)
Pergunte só o que não dá para deduzir do pedido ou da pasta:
1. O que é e para quem (1 frase)? Qual o resultado mínimo que prova valor (MVP)?
2. Tipo: site/landing · web app · API · app desktop (Electron) · mobile · agente/automação de IA · CLI.
3. Stack preferida (se não disser, proponha a padrão abaixo e siga).
4. Onde roda/deploy (Vercel, Render, VPS, Docker, local).
5. Tem dado pessoal, pagamento ou login? (ativa checklist de `seguranca` + LGPD desde o início).

**Stacks padrão** (use se o usuário não escolher):
| Tipo | Stack |
|---|---|
| Site / landing | Next.js (App Router) + TypeScript + Tailwind |
| Web app | Next.js + TS + Tailwind + shadcn/ui + Zod + Prisma/Drizzle + Postgres |
| API | Node/TS (Fastify ou NestJS) **ou** Java Spring Boot **ou** Python FastAPI — conforme o usuário |
| Desktop | Electron + Vite + React + TS |
| Agente de IA | Python (FastAPI) ou Node/TS + SDK do provedor + Postgres/pgvector para RAG |

## 2. Aplicar o template
Projeto novo ou existente — **nunca sobrescreva** arquivo que já existe:
```bash
"$BASE/scripts/novo-projeto.sh" . "<nome-do-projeto>"
```
Depois **edite o `AGENTS.md` gerado**: preencha visão, stack, comandos (dev/test/lint/build) e estrutura de pastas. Mantenha-o curto (< 80 linhas) — ele é lido em toda sessão.

O `AGENTS.md` é lido por todas as IAs (Claude Code, Codex, Antigravity, Cursor, Copilot…). **Não crie `CLAUDE.md`/`GEMINI.md` separados** — se uma ferramenta exigir, o arquivo dela deve só importar o `AGENTS.md` (ex.: `@AGENTS.md`).

Extras específicos de ferramenta que o template traz (opcionais, não substituem o AGENTS.md): `.claude/settings.json` com `deny` de pastas pesadas (`node_modules`, `dist`, `.next`, `target`, `.venv`) — ajuste para a stack.

## 3. Dependências do fluxo
- **Superpowers** já vem nesta base (skills `brainstorming`, `writing-plans`, `subagent-driven-development`, `test-driven-development`…). Confira que aparecem na lista de skills da IA; se não, rode o `install.sh` da base. Não instale o plugin oficial junto (duplica). Detalhes: skill `using-superpowers`.
- **Graphify**: `command -v graphify || uv tool install graphifyy` → `graphify install` (registra a skill na IA em uso). Em projeto existente, rode `/graphify .` agora. Em projeto vazio, rode depois do primeiro scaffold. Detalhes: skill `usar-graphify`.

## 4. Scaffold da stack
Use o gerador oficial (ex.: `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`), **não** escreva boilerplate à mão. Depois configure lint + format + teste (ver `boas-praticas`).

## 5. Especificar e planejar
1. Brainstorm com o usuário (Superpowers `brainstorming`, se instalado) → preencher `docs/SPEC.md`.
2. Quebrar em tarefas atômicas → `docs/PLANO.md` (formato do cartão em `subagent-driven-development`).
3. Registrar decisões de arquitetura relevantes em `docs/adr/`.
4. Peça aprovação do usuário para SPEC e PLANO antes de implementar.

## 6. Fechar
- `docs/PROGRESSO.md` com o estado atual e o próximo passo.
- `git add -A && git commit -m "chore: bootstrap do projeto com skills-base"`.
- Informe ao usuário: o que foi criado, o que falta configurar (env, chaves), e que o próximo passo é a skill `subagent-driven-development`.

## Checklist de saída
- [ ] AGENTS.md preenchido e curto
- [ ] .env.example com todas as variáveis (sem valores reais) e `.env` no .gitignore
- [ ] lint, format e teste rodando (`npm test` / equivalente passa, mesmo que vazio)
- [ ] SPEC e PLANO aprovados
- [ ] Graphify rodado (se já houver código)
- [ ] primeiro commit feito

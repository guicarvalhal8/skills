---
name: economia-tokens
description: Técnicas para gastar o mínimo de tokens e contexto no Claude Code — mapa do código com Graphify, busca dirigida em vez de ler arquivos inteiros, subagentes para exploração, modelos baratos para tarefas simples, estado em arquivo entre sessões, /clear e /compact, CLAUDE.md enxuto, saídas curtas e permissões que bloqueiam pastas pesadas. Use ao começar a trabalhar num repo grande, quando a sessão ficar lenta/cara, ao configurar um projeto novo, ou quando o usuário falar em "tokens", "contexto", "custo", "limite", "/economia-tokens".
---

# Economia de tokens

O maior gasto não é a resposta — é **contexto**: arquivos lidos, logs, saídas de comando e histórico longo. Toda regra abaixo reduz o que entra no contexto.

## 1. Mapa antes de ler
- Repo com código: `graphify-out/GRAPH_REPORT.md` primeiro; perguntas de arquitetura → `/graphify query "..."` (ver `usar-graphify`).
- Sem grafo: `git ls-files | head -100`, `tree -L 2 -I node_modules`, e o `CLAUDE.md`.

## 2. Ler o mínimo
- Procure com `Grep`/`rg -n` e `Glob` antes de abrir arquivo.
- Abra com `offset`/`limit` só o trecho relevante; não releia arquivo que já está no contexto.
- Nunca leia: lockfiles, `dist/`, `build/`, `.next/`, `node_modules/`, `target/`, `*.min.js`, dumps, CSV grande (use `head`, `wc -l`, ou um script que resume).

## 3. Saídas de comando curtas
```bash
npm test 2>&1 | tail -40                 # não o log inteiro
npm run build 2>&1 | grep -iE "error|warn" | head -30
git diff --stat                          # antes de git diff completo
rg -n "padrao" src | head -50
```
Prefira flags silenciosas: `--silent`, `-q`, `--reporter=dot`.

## 4. Subagentes como "isolamento de contexto"
- Exploração ampla ("onde está X?", "como funciona Y?") → subagente **Explore** — só a conclusão volta para você.
- Tarefas de implementação → `implementador` (ver `fluxo-dev`), retorno em formato curto (STATUS/ARQUIVOS/TESTES/NOTAS).
- Peça sempre: "responda em ≤ 10 linhas" / "não cole o código, só caminhos e linhas".

## 5. Modelo certo para cada coisa
| Tarefa | Modelo |
|---|---|
| busca, leitura, conferência simples, formatação | haiku |
| implementação de cartão, testes, refatoração | sonnet |
| arquitetura, plano, bug difícil, julgamento final | opus |
Os agentes desta base já vêm com `model:` definido no frontmatter. Na sessão: `/model`.

## 6. Sessões curtas, estado em arquivo
- Uma tarefa por sessão. Terminou → atualize `docs/PROGRESSO.md` → `/clear`.
- Sessão longa e ainda no mesmo assunto → `/compact` com foco: `/compact mantenha só o plano T05–T08 e os erros pendentes`.
- Retomar: ler `docs/PROGRESSO.md` + cartões abertos do `docs/PLANO.md`, nada mais.

## 7. CLAUDE.md enxuto
- < ~80 linhas: stack, comandos, convenções, mapa de pastas, regras específicas.
- Detalhe vai em skill (carregada sob demanda) ou em `docs/` (lido só quando preciso).
- Sem texto motivacional, sem repetir o que o código mostra.

## 8. Bloquear o que não deve ser lido
No `.claude/settings.json` do projeto (o template já traz):
```json
{ "permissions": { "deny": [
  "Read(./node_modules/**)", "Read(./.next/**)", "Read(./dist/**)", "Read(./build/**)",
  "Read(./coverage/**)", "Read(./.env)", "Read(./.env.local)", "Read(./.env.production)", "Read(./**/*.lock)", "Read(./package-lock.json)"
] } }
```

## 9. Pedidos e respostas
- Pedido específico com arquivo/função/erro exato > "dá uma olhada no projeto".
- Cole só o trecho do erro (primeira e última linhas úteis), não o terminal inteiro.
- Peça diffs/edições pontuais, não reescrita do arquivo inteiro.
- Respostas do agente: o que fez + prova + próximo passo. Sem recapitular.

## 10. MCPs e skills
- Cada MCP conectado adiciona definição de ferramentas ao contexto: deixe ligados só os que o projeto usa (`/mcp`).
- Skills custam pouco até serem usadas (só `name`+`description` ficam no contexto) — prefira skill a colar instrução no CLAUDE.md.

## Diagnóstico rápido
`/context` mostra o que está ocupando a janela. `/cost` mostra o gasto da sessão. Se > 50% da janela antes de começar a tarefa: corte MCPs, CLAUDE.md ou comece sessão nova.

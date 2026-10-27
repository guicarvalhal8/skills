## Complemento skills-base — práticas da base

**Duas camadas:** o modo Caveman acima corta tokens de **saída** e só liga quando o usuário pedir ("caveman", "seja breve", "menos tokens") — sem pedido, responda normal. As práticas abaixo cortam tokens de **contexto** (o maior gasto) e valem **sempre**.

> As regras abaixo vêm da base skills-base e complementam a skill original acima. Em conflito, siga a skill original na **metodologia** e esta seção nos **padrões do projeto** (stack, caminhos `docs/`, formatos).

O maior gasto não é a resposta — é **contexto**: arquivos lidos, logs, saídas de comando e histórico longo. Toda regra abaixo reduz o que entra no contexto. Vale para qualquer IA; os comandos específicos estão na tabela do fim.

### 1. Mapa antes de ler
- Repo com código: `graphify-out/GRAPH_REPORT.md` primeiro; perguntas de arquitetura → `/graphify query "..."` (ver `usar-graphify`).
- Sem grafo: `git ls-files | head -100`, `tree -L 2 -I node_modules`, e o `AGENTS.md`.

### 2. Ler o mínimo
- Procure (`rg -n`, busca da ferramenta) antes de abrir arquivo.
- Abra só o trecho relevante (faixa de linhas); não releia arquivo que já está no contexto.
- Nunca leia: lockfiles, `dist/`, `build/`, `.next/`, `node_modules/`, `target/`, `*.min.js`, dumps, CSV grande (use `head`, `wc -l`, ou um script que resume).

### 3. Saídas de comando curtas
```bash
npm test 2>&1 | tail -40                 # não o log inteiro
npm run build 2>&1 | grep -iE "error|warn" | head -30
git diff --stat                          # antes de git diff completo
rg -n "padrao" src | head -50
```
Prefira flags silenciosas: `--silent`, `-q`, `--reporter=dot`.

### 4. Subagentes como "isolamento de contexto"
- Exploração ampla ("onde está X?", "como funciona Y?") → subagente de busca — só a conclusão volta para você.
- Implementação → papel `implementador` (ver `subagent-driven-development`), retorno curto (STATUS/ARQUIVOS/TESTES/NOTAS).
- Peça sempre: "responda em ≤ 10 linhas" / "não cole o código, só caminhos e linhas".
- Ferramenta sem subagente: faça uma tarefa por vez e limpe/compacte o contexto entre elas.

### 5. Modelo certo para cada coisa
| Tarefa | Nível de modelo |
|---|---|
| busca, leitura, conferência simples, formatação | barato/rápido |
| implementação de cartão, testes, refatoração | médio |
| arquitetura, plano, bug difícil, julgamento final | o mais forte |
Os agentes `agents/*.md` desta base já sugerem o nível (no Claude Code, pelo campo `model:`).

### 6. Sessões curtas, estado em arquivo
- Uma tarefa por sessão. Terminou → atualize `docs/PROGRESSO.md` → limpe o contexto / abra sessão nova.
- Sessão longa no mesmo assunto → compacte com foco ("mantenha só o plano T05–T08 e os erros pendentes").
- Retomar: ler `docs/PROGRESSO.md` + cartões abertos do `docs/PLANO.md`, nada mais.

### 7. AGENTS.md enxuto
- Um só arquivo de instruções (`AGENTS.md`) lido por todas as IAs — nada de manter CLAUDE.md, GEMINI.md e regras do Cursor duplicados.
- < ~80 linhas: stack, comandos, convenções, mapa de pastas, regras específicas.
- Detalhe vai em skill (carregada sob demanda) ou em `docs/` (lido só quando preciso).

### 8. Bloquear o que não deve ser lido
- `.gitignore` bem feito já evita boa parte (várias ferramentas respeitam).
- Claude Code: `deny` no `.claude/settings.json` (o template já traz):
  ```json
  { "permissions": { "deny": ["Read(./node_modules/**)", "Read(./.next/**)", "Read(./dist/**)", "Read(./.env)", "Read(./package-lock.json)"] } }
  ```
- Cursor: `.cursorignore`. Outras: veja o equivalente de "ignore" da ferramenta.

### 9. Pedidos e respostas
- Pedido específico com arquivo/função/erro exato > "dá uma olhada no projeto".
- Cole só o trecho do erro, não o terminal inteiro.
- Peça edições pontuais, não reescrita do arquivo inteiro.
- Respostas do agente: o que fez + prova + próximo passo. Sem recapitular.

### 10. MCPs e skills
- Cada MCP conectado adiciona definições de ferramentas ao contexto: deixe ligados só os que o projeto usa.
- Skills custam pouco até serem usadas (só `name`+`description` ficam no contexto) — prefira skill a colar instrução no AGENTS.md.

### Comandos por ferramenta (confira o `/help` da sua versão)
| Ação | Claude Code | Codex | Gemini CLI |
|---|---|---|---|
| limpar contexto | `/clear` | `/new` | `/clear` |
| compactar | `/compact` | `/compact` | `/compress` |
| ver uso de contexto | `/context` | `/status` | `/stats` |
Antigravity, Cursor e outras: use "nova conversa/agente" para limpar e o resumo da ferramenta para compactar.

Se o contexto estiver > 50% cheio antes de começar a tarefa: corte MCPs, enxugue o AGENTS.md ou comece sessão nova.

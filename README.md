# skills-base

Base de skills **universal** para iniciar qualquer projeto com IA (Claude Code, Codex, Antigravity, Gemini CLI, Cursor, Copilot…): regras, fluxo de desenvolvimento por agentes, revisão por esquadrão de juízes, economia de tokens e uma biblioteca de templates e efeitos.

> Comece todo projeto pedindo à IA: **"use a skill iniciar-projeto"** (ou `/iniciar-projeto`)

## Por que é universal
| Arquivo | Padrão | Quem lê |
|---|---|---|
| `skills/<nome>/SKILL.md` | **Agent Skills** (agentskills.io) — padrão aberto | Claude Code, Codex, Antigravity, Gemini CLI, Cursor, Copilot e 30+ ferramentas |
| `AGENTS.md` (no projeto) | **AGENTS.md** (agents.md) — padrão aberto | Codex, Antigravity, Cursor, Copilot, Gemini CLI (configurável) e Claude Code (v2.1.277+) |
| `agents/*.md` | prompts de papéis em Markdown | qualquer IA; no Claude Code viram subagentes nativos |

O nome `SKILL.md` **é** o padrão — não renomeie. O que muda entre ferramentas é só a **pasta** onde elas procuram, e o instalador resolve isso.

---

## Estrutura

```
skills-base/
├── skills/                      # cada pasta = 1 skill (uma "parte")
│   ├── iniciar-projeto/         # ⭐ ponto de entrada: monta o projeto novo usando todo o resto
│   ├── regras/                  # regras inegociáveis do agente e do projeto
│   ├── fluxo-dev/               # separação de tarefas por agentes, conferência, fluxo de desenvolvimento
│   ├── esquadrao-julgamento/    # painel de juízes que aprova/reprova entregas
│   ├── frontend/                # padrões de front (Next.js/React/TS/Tailwind), a11y, performance
│   ├── backend/                 # APIs, camadas, banco, filas, integrações, IA/LLM
│   ├── seguranca/               # OWASP, auth, segredos, webhooks, LGPD, prompt injection
│   ├── boas-praticas/           # git, commits, testes, CI, docs, Definition of Done
│   ├── clean-code/              # nomes, funções, erros, refatoração, diretrizes Karpathy
│   ├── efeitos/                 # catálogo de efeitos/animações (usa templates/efeitos)
│   ├── economia-tokens/         # como gastar o mínimo de contexto/tokens
│   ├── usar-superpowers/        # instalação + como o Superpowers encaixa no fluxo
│   └── usar-graphify/           # instalação + uso do grafo de conhecimento do código
├── agents/                      # papéis: planejador, implementador, conferente, juízes
├── templates/
│   ├── projeto/                 # copiado para todo projeto novo (AGENTS.md, docs/, .github/…)
│   └── efeitos/                 # efeitos prontos: vanilla (CSS/JS) + React (TSX) + galeria index.html
├── scripts/novo-projeto.sh      # aplica o template de projeto sem precisar da IA
├── install.sh / install.ps1     # instala as skills em todas as IAs encontradas
└── .claude-plugin/              # (opcional) instalar como plugin do Claude Code
```

## Instalação

### Linux / macOS / WSL / Git Bash
```bash
git clone https://github.com/guicarvalhal8/skills.git ~/skills-base
cd ~/skills-base && ./install.sh          # detecta as IAs e cria links (git pull atualiza tudo)
```

### Windows (PowerShell)
```powershell
git clone https://github.com/guicarvalhal8/skills.git $HOME\skills-base
cd $HOME\skills-base; .\install.ps1        # junctions, não precisa de admin
```

O instalador liga cada skill nas pastas de cada ferramenta encontrada:

| Destino | Pasta (global) | Ferramentas |
|---|---|---|
| `agents` (sempre) | `~/.agents/skills/` | Codex, Gemini CLI, Antigravity 2.0 e outras que seguem o padrão |
| `claude` | `~/.claude/skills/` + `~/.claude/agents/` | Claude Code |
| `antigravity` | `~/.gemini/antigravity/skills/` | Antigravity IDE (versões antigas) |
| `cursor` | `~/.cursor/skills/` | Cursor |
| `copilot` | `~/.copilot/skills/` | GitHub Copilot |

Opções: `--alvos agents,claude` (forçar destinos) · `--projeto` (instala só no repo atual) · `--copy` · `--remover`. No PowerShell: `-Alvos`, `-Projeto`, `-Copiar`, `-Remover`.

Também grava o caminho do repo em `~/.agents/.skills-base-path` — a skill `iniciar-projeto` usa isso para achar os templates. Depois **reinicie a IA**.

### Alternativas
- **CLI universal de skills:** `npx skills add guicarvalhal8/skills` (escolhe as IAs interativamente). Não copia `templates/`, então para usar `iniciar-projeto` mantenha também o clone.
- **Plugin do Claude Code:** `/plugin marketplace add guicarvalhal8/skills` → `/plugin install skills-base@skills-base`.

### Dependências externas (o `iniciar-projeto` confere)
| Ferramenta | Instalação |
|---|---|
| Superpowers | `npx skills add obra/superpowers` (Claude Code: também via `/plugin`) |
| Graphify | `uv tool install graphifyy` (ou `pipx install graphifyy`) → `graphify install` |

## Uso no dia a dia
Na maioria das IAs basta pedir pelo nome ("use a skill fluxo-dev"); no Claude Code também funciona `/nome`, no Codex `$nome`.

| Quero… | Skill |
|---|---|
| Começar um projeto novo | `iniciar-projeto` |
| Planejar e executar uma feature com agentes | `fluxo-dev` |
| Revisar antes de mergear | `esquadrao-julgamento` |
| Auditar segurança | `seguranca` |
| Colocar animação/efeito numa página | `efeitos` |
| Projeto ficou caro em tokens | `economia-tokens` |

As demais (frontend, backend, clean-code, boas-praticas, regras) a IA carrega **sozinha** quando o assunto aparece.

## Fluxo padrão (resumo)
```
graphify (mapa) → brainstorm → SPEC.md → PLANO.md (tarefas atômicas)
   → implementador por tarefa (paralelo quando independente)
   → conferente por tarefa
   → esquadrão de julgamento no fim do marco
   → commit/PR + PROGRESSO.md atualizado
```
IA sem subagentes? O fluxo é o mesmo: ela executa cada papel em sequência, um cartão por vez.

## Instruções do projeto: só AGENTS.md
O template cria **um único `AGENTS.md`** por projeto. Não mantenha `CLAUDE.md`/`GEMINI.md` duplicados. Se alguma ferramenta não ler AGENTS.md:
- **Claude Code < 2.1.277** (ou com a opção desligada em `/config`): crie `CLAUDE.md` contendo só `@AGENTS.md`.
- **Gemini CLI:** em `.gemini/settings.json` → `{ "context": { "fileName": ["AGENTS.md", "GEMINI.md"] } }` (versões antigas: `"contextFileName"`).

## Como evoluir este repo
- Skill nova = pasta `skills/<nome>/SKILL.md` com `name` (igual ao nome da pasta, minúsculas e hífens) e `description` no frontmatter. Só use campos do padrão; extras de uma ferramenta são ignorados pelas outras.
- `SKILL.md` curto (< ~200 linhas); detalhes em `references/` dentro da skill — a IA só lê quando precisa.
- A `description` é o que faz a skill disparar: diga **o que faz e quando usar**.
- Aprendeu algo num projeto? Atualize a skill e faça commit — o `git pull` leva para todas as IAs.

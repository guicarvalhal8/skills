# skills-base

Base de skills **universal** para iniciar qualquer projeto com IA (Claude Code, Codex, Antigravity, Gemini CLI, Cursor, Copilot…).

Cada parte parte da **skill mais estrelada do GitHub para aquele tema**, mantida intacta, mais um **complemento com as práticas da base** (stack, fluxo, caminhos `docs/`, LGPD, efeitos prontos…).

> Comece todo projeto pedindo à IA: **"use a skill iniciar-projeto"** (ou `/iniciar-projeto`)

## As partes e de onde vêm

| Parte | Skill | Base (GitHub) | ⭐ repo | Licença | + práticas da base |
|---|---|---|---|---|---|
| Regras | `regras` | `karpathy-guidelines` — forrestchang/andrej-karpathy-skills | ~210 mil | MIT | escopo, verificação, ações perigosas, segredos, git |
| Front | `frontend` | `frontend-patterns` — affaan-m/everything-claude-code | ~285 mil | MIT | Next.js/TS/Tailwind/shadcn, estrutura, a11y, CWV |
| Front (visual) | `frontend-design` | `frontend-design` — anthropics/skills | ~182 mil | Apache-2.0 | direção visual, checagem 360/768/1280 |
| Back | `backend` | `backend-patterns` (+ `api-design`) — everything-claude-code | ~285 mil | MIT | camadas, RFC 9457, banco, filas, webhooks, LLM/RAG, stacks |
| Segurança | `seguranca` | `security-review` — everything-claude-code | ~285 mil | MIT | IDOR, webhooks, Electron, LGPD, prompt injection, auditoria |
| Boas práticas | `boas-praticas` | `git-workflow` — everything-claude-code | ~285 mil | MIT | testes, CI, docs, ADR, Definition of Done |
| Clean code | `clean-code` | `coding-standards` — everything-claude-code | ~285 mil | MIT | regras + exemplos antes/depois |
| Efeitos | `efeitos` | `animate` — emilkowalski/skills | ~23 mil | MIT | catálogo de efeitos prontos (`templates/efeitos`) |
| Economia de tokens | `economia-tokens` | `caveman` — JuliusBrussee/caveman | ~111 mil | Apache-2.0 | práticas de contexto para qualquer IA |
| Superpowers | 15 skills (`brainstorming`, `writing-plans`, `test-driven-development`…) | obra/superpowers | ~303 mil | MIT | mapa fase → skill em `using-superpowers` |
| Agentes / fluxo / conferência | `subagent-driven-development`, `dispatching-parallel-agents`, `verification-before-completion` | obra/superpowers | ~303 mil | MIT | cartões em `docs/PLANO.md`, papéis, conferente, paralelismo |
| Esquadrão de julgamento | `esquadrao-julgamento` | `council` — everything-claude-code | ~285 mil | MIT | painel de 5 juízes, P0–P3, sentença |
| Graphify | `usar-graphify` | — (própria) | — | — | a skill oficial vem do `graphify install` |
| Início | `iniciar-projeto` | — (própria) | — | — | monta o projeto usando tudo acima |

Critério de escolha: para cada tema, a skill específica do repositório mais estrelado. Quando o tema não tem repositório dedicado forte (back, segurança, boas práticas, clean code, julgamento), vale a skill do repositório geral mais estrelado (everything-claude-code). Estrelas aproximadas, out/2026. Detalhes e commits fixados: `fontes.json` e `skills/<nome>/ORIGEM.md`.

## Estrutura

```
skills-base/
├── skills/            # ⚙️ GERADO — é o que as IAs leem e o que o instalador liga. Não edite à mão.
├── vendor/            # cópias intactas das skills de terceiros (fixadas por commit) + licenças
├── complementos/      # SUAS práticas: complementos/<skill>.md é anexado ao fim da skill original
│   └── <skill>/references/   # arquivos de referência extras daquela skill
├── proprias/          # skills 100% da base (iniciar-projeto, usar-graphify)
├── agents/            # papéis: planejador, implementador, conferente, 5 juízes
├── templates/
│   ├── projeto/       # copiado para todo projeto novo (AGENTS.md, docs/, .github/…)
│   └── efeitos/       # efeitos prontos: vanilla (CSS/JS) + React (TSX) + galeria index.html
├── fontes.json        # de onde vem cada skill (repo, pasta, commit, licença, estrelas)
├── scripts/
│   ├── atualizar_fontes.py   # baixa as versões novas das skills de terceiros para vendor/
│   ├── montar.py             # gera skills/ = vendor + complementos + proprias
│   └── novo-projeto.sh       # aplica o template de projeto sem precisar da IA
└── install.sh / install.ps1  # instala as skills em todas as IAs encontradas
```

### Como uma skill é montada
```
skills/seguranca/SKILL.md =
    frontmatter (name: seguranca, description em PT + EN)
  + texto original do security-review (intacto)
  + ---
  + <!-- skills-base:complemento -->  conteúdo de complementos/seguranca.md
```
Mais `LICENSE`/`NOTICE` do projeto original e um `ORIGEM.md` com link e commit.

## Instalação

### Linux / macOS / WSL / Git Bash
```bash
git clone https://github.com/guicarvalhal8/skills.git ~/skills-base
cd ~/skills-base && ./install.sh
```

### Windows (PowerShell)
```powershell
git clone https://github.com/guicarvalhal8/skills.git $HOME\skills-base
cd $HOME\skills-base; .\install.ps1
```

O instalador liga `skills/*` nas pastas de cada IA encontrada:

| Destino | Pasta global | Ferramentas |
|---|---|---|
| `agents` (sempre) | `~/.agents/skills/` | Codex, Gemini CLI, Antigravity 2.0 e outras do padrão |
| `claude` | `~/.claude/skills/` + `~/.claude/agents/` | Claude Code |
| `antigravity` | `~/.gemini/antigravity/skills/` | Antigravity IDE (versões antigas) |
| `cursor` | `~/.cursor/skills/` | Cursor |
| `copilot` | `~/.copilot/skills/` | GitHub Copilot |

Opções: `--alvos agents,claude` · `--projeto` · `--copy` · `--remover` (PowerShell: `-Alvos`, `-Projeto`, `-Copiar`, `-Remover`). Reinicie a IA depois.

> Já tem o plugin oficial do Superpowers instalado? Desinstale — esta base já inclui as skills dele, e ter as duas duplica.

### Dependência externa
| Ferramenta | Instalação |
|---|---|
| Graphify | `uv tool install graphifyy` (ou `pipx install graphifyy`) → `graphify install` (instala a skill oficial `graphify` na sua IA) |

## Uso no dia a dia
Peça pelo nome ("use a skill esquadrao-julgamento"); no Claude Code também `/nome`, no Codex `$nome`.

| Quero… | Skill |
|---|---|
| Começar um projeto novo | `iniciar-projeto` |
| Ideia → especificação | `brainstorming` |
| Especificação → plano em cartões | `writing-plans` |
| Executar o plano com agentes | `subagent-driven-development` |
| Revisar antes de mergear | `esquadrao-julgamento` |
| Depurar um bug difícil | `systematic-debugging` |
| Auditar segurança | `seguranca` |
| Colocar animação/efeito | `efeitos` |
| Gastar menos tokens | `economia-tokens` (modo curto: "caveman") |

As demais (frontend, backend, clean-code, boas-praticas, regras, test-driven-development…) a IA carrega **sozinha** quando o assunto aparece.

## Fluxo padrão
```
graphify (mapa) → brainstorming → docs/SPEC.md → writing-plans → docs/PLANO.md (cartões)
   → subagent-driven-development: implementador por cartão (paralelo se independente) + conferente
   → esquadrao-julgamento no fim do marco
   → finishing-a-development-branch + docs/PROGRESSO.md
```

## Por que é universal
- `SKILL.md` é o padrão aberto **Agent Skills** — Claude Code, Codex, Antigravity, Gemini CLI, Cursor, Copilot e 30+ ferramentas leem. Não renomeie.
- O projeto usa **um único `AGENTS.md`** (padrão aberto). Claude Code lê desde a v2.1.277 (versões antigas: crie `CLAUDE.md` com `@AGENTS.md`). Gemini CLI: `.gemini/settings.json` → `{ "context": { "fileName": ["AGENTS.md", "GEMINI.md"] } }`.

## Manutenção

**Mudar uma prática sua:** edite `complementos/<skill>.md` (ou `proprias/…`) → `python3 scripts/montar.py` → commit.

**Atualizar as skills de terceiros:**
```bash
python3 scripts/atualizar_fontes.py --ultima   # baixa as versões novas e atualiza os commits em fontes.json
git diff --stat vendor/                         # REVISE: é conteúdo de terceiros
python3 scripts/montar.py                       # suas práticas são reaplicadas por cima
```

**Trocar a base de uma parte** (ex.: achou uma skill de backend melhor): mude `repo`/`caminho` daquela entrada em `fontes.json` e rode os dois scripts.

**Segurança:** skills de terceiros são instruções que a IA segue. Antes de atualizar, revise o diff de `vendor/` (instruções escondidas em comentários HTML, caracteres invisíveis, `curl | sh`). Na montagem inicial, a varredura não achou nada suspeito. Os únicos scripts incluídos são do Superpowers (servidor local do brainstorming visual e um utilitário de debug), e só rodam se você pedir.

## Créditos e licenças
O texto original de cada skill pertence aos autores: Jesse Vincent (Superpowers, MIT), Affaan Mustafa (everything-claude-code, MIT), Forrest Chang (andrej-karpathy-skills, MIT), Anthropic (frontend-design, Apache-2.0), Julius Brussee (Caveman, Apache-2.0; "Caveman" é marca registrada dele, e esta base **não** é o Caveman oficial), Emil Kowalski (skills, MIT). Cada pasta em `skills/` traz a licença e o `ORIGEM.md` do original. As modificações estão marcadas com `skills-base:complemento`.

# skills-base

Base de skills do Claude Code para **iniciar qualquer projeto** já com regras, fluxo de desenvolvimento por agentes, revisão por esquadrão de juízes, economia de tokens e uma biblioteca de templates e efeitos.

> Comece todo projeto com: `/iniciar-projeto`

---

## Estrutura

```
skills-base/
├── skills/                      # cada pasta = 1 skill (uma "parte")
│   ├── iniciar-projeto/         # ⭐ ponto de entrada: monta o projeto novo usando todo o resto
│   ├── regras/                  # regras inegociáveis do agente e do projeto
│   ├── fluxo-dev/               # separação de tarefas por agentes, conferência, fluxo de desenvolvimento
│   ├── esquadrao-julgamento/    # painel de juízes (subagentes) que aprova/reprova entregas
│   ├── frontend/                # padrões de front (Next.js/React/TS/Tailwind), a11y, performance
│   ├── backend/                 # APIs, camadas, banco, filas, integrações, IA/LLM
│   ├── seguranca/               # OWASP, auth, segredos, webhooks, LGPD, prompt injection
│   ├── boas-praticas/           # git, commits, testes, CI, docs, Definition of Done
│   ├── clean-code/              # nomes, funções, erros, refatoração, diretrizes Karpathy
│   ├── efeitos/                 # catálogo de efeitos/animações (usa templates/efeitos)
│   ├── economia-tokens/         # como gastar o mínimo de contexto/tokens
│   ├── usar-superpowers/        # instalação + como o Superpowers encaixa no fluxo
│   └── usar-graphify/           # instalação + uso do grafo de conhecimento do código
├── agents/                      # subagentes do Claude Code (planejador, implementador, conferente, juízes)
├── templates/
│   ├── projeto/                 # arquivos copiados para todo projeto novo (CLAUDE.md, docs/, .github/…)
│   └── efeitos/                 # efeitos prontos: vanilla (CSS/JS) + React (TSX) + galeria index.html
├── scripts/novo-projeto.sh      # copia o template de projeto sem precisar do Claude
├── install.sh / install.ps1     # instala skills + agentes no ~/.claude
└── .claude-plugin/              # (alternativa) instalar como plugin do Claude Code
```

## Instalação

### Linux / macOS / WSL / Git Bash
```bash
git clone https://github.com/guicarvalhal8/skills.git ~/skills-base
cd ~/skills-base && ./install.sh          # cria links simbólicos (git pull atualiza tudo)
./install.sh --copy                        # ou copia em vez de linkar
```

### Windows (PowerShell)
```powershell
git clone https://github.com/guicarvalhal8/skills.git $HOME\skills-base
cd $HOME\skills-base; .\install.ps1        # usa junctions (não precisa de admin)
```

O instalador:
1. liga cada `skills/<nome>` em `~/.claude/skills/<nome>`
2. liga cada `agents/*.md` em `~/.claude/agents/`
3. grava o caminho do repo em `~/.claude/.skills-base-path` (o `/iniciar-projeto` usa isso para achar os templates)

Depois **reinicie o Claude Code**.

### Alternativa: como plugin
```
/plugin marketplace add guicarvalhal8/skills
/plugin install skills-base@skills-base
```
(Como plugin as skills ficam com prefixo: `/skills-base:iniciar-projeto`.)

### Dependências externas (o `/iniciar-projeto` confere e instala)
| Ferramenta | Instalação |
|---|---|
| Superpowers | dentro do Claude Code: `/plugin marketplace add obra/superpowers-marketplace` e `/plugin install superpowers@superpowers-marketplace` |
| Graphify | `uv tool install graphifyy` (ou `pipx install graphifyy`) → `graphify install` |

## Uso no dia a dia

| Quero… | Comando |
|---|---|
| Começar um projeto novo | `/iniciar-projeto` |
| Planejar e executar uma feature com agentes | `/fluxo-dev` |
| Revisar antes de mergear | `/esquadrao-julgamento` |
| Auditar segurança | `/seguranca` |
| Colocar animação/efeito numa página | `/efeitos` |
| Projeto ficou caro em tokens | `/economia-tokens` |

As demais (frontend, backend, clean-code, boas-praticas, regras) são carregadas **automaticamente** pelo Claude quando o assunto aparece — não precisa chamar.

## Fluxo padrão (resumo)

```
graphify (mapa) → brainstorm → SPEC.md → PLANO.md (tarefas atômicas)
   → implementador por tarefa (paralelo quando independente)
   → conferente por tarefa
   → esquadrão de julgamento no fim do marco
   → commit/PR + PROGRESSO.md atualizado
```

## Como evoluir este repo
- Uma skill nova = uma pasta em `skills/<nome>/SKILL.md` com `name` e `description` no frontmatter.
- `SKILL.md` curto (< ~200 linhas); detalhes vão em `references/` dentro da skill — o Claude só lê quando precisa (economiza tokens).
- A `description` é o que faz a skill disparar: diga **o que faz e quando usar**.
- Rodou um projeto e aprendeu algo? Atualize a skill correspondente e faça commit.

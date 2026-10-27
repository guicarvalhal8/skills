---
name: usar-superpowers
description: Como instalar, conferir e combinar o plugin Superpowers (obra/superpowers) com o fluxo desta base — brainstorming, writing-plans, executing-plans, subagent-driven-development, test-driven-development, systematic-debugging, using-git-worktrees, requesting/receiving-code-review, finishing-a-development-branch. Use ao configurar um projeto, quando o usuário mencionar "superpowers", ou para decidir qual skill do Superpowers usar em cada fase.
---

# Superpowers na base

Superpowers (Jesse Vincent, MIT) é a **camada de metodologia**: brainstorm → plano → TDD → subagentes → review → merge. Esta base usa o Superpowers como motor e acrescenta regras, padrões de stack, o esquadrão de julgamento e a economia de tokens.

## Instalar
Dentro do Claude Code (comandos de barra — peça ao usuário para rodar; você não executa no shell):
```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```
Reinicie o Claude Code. Conferir: `/plugin` deve listar `superpowers`; as skills aparecem como `superpowers:<nome>`.

Alternativa sem plugin (outros agentes ou cópia local): `npx skills add obra/superpowers`.

## Mapa: fase da base → skill do Superpowers
| Fase (`fluxo-dev`) | Superpowers | Observação da base |
|---|---|---|
| 1 SPEC | `brainstorming` | resultado vai para `docs/SPEC.md` |
| 2 PLANO | `writing-plans` | use o **formato de cartão** do `fluxo-dev` (arquivos + aceite verificável) |
| 3 EXECUÇÃO | `subagent-driven-development` ou `executing-plans` | um subagente por cartão; retorno curto |
| 3 paralelo | `dispatching-parallel-agents` | só cartões sem arquivo em comum |
| 3 isolamento | `using-git-worktrees` | quando dois cartões tocam a mesma área |
| 3 código | `test-driven-development` | obrigatório para lógica e bugs |
| bug | `systematic-debugging` | reproduzir → isolar → hipótese → 1 variável por vez |
| 4 CONFERÊNCIA | `verification-before-completion` | se disponível na versão instalada |
| 5 JULGAMENTO | `requesting-code-review` + **`esquadrao-julgamento`** | esquadrão para marcos; review do Superpowers para tarefas |
| feedback | `receiving-code-review` | verificar antes de aceitar sugestão |
| 6 ENTREGA | `finishing-a-development-branch` | + atualizar `docs/PROGRESSO.md` |

## Regras de convivência
- Se o Superpowers e esta base divergirem em **formato** (ex.: onde salvar o plano), use os caminhos da base (`docs/SPEC.md`, `docs/PLANO.md`, `docs/PROGRESSO.md`).
- Em **metodologia** (TDD, debugging, brainstorm), siga o Superpowers.
- Spike/protótipo descartável: pode pular brainstorm e TDD — diga explicitamente que é spike.
- Os nomes exatos das skills mudam entre versões: confira com `/plugin` ou na lista de skills antes de citar uma.

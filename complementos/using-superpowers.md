## Complemento skills-base — práticas da base

> As regras abaixo vêm da base skills-base e complementam a skill original acima. Em conflito, siga a skill original na **metodologia** e esta seção nos **padrões do projeto** (stack, caminhos `docs/`, formatos).

O Superpowers (Jesse Vincent, MIT) é a **camada de metodologia**: brainstorm → plano → TDD → subagentes → review → merge. Esta base usa o Superpowers como motor e acrescenta regras, padrões de stack, o esquadrão de julgamento e a economia de tokens. As skills dele seguem o mesmo padrão `SKILL.md`, então funcionam nas IAs compatíveis.

### Nesta base o Superpowers já vem incluído
As skills do Superpowers estão copiadas neste repo (pasta `vendor/` → `skills/`) e são instaladas junto com o resto pelo `install.sh`. **Não instale o plugin oficial também** — duplicaria as skills. Para atualizar: `python3 scripts/atualizar_fontes.py --ultima && python3 scripts/montar.py`.

### Mapa: fase da base → skill do Superpowers
| Fase do fluxo | Superpowers | Observação da base |
|---|---|---|
| 1 SPEC | `brainstorming` | resultado vai para `docs/SPEC.md` |
| 2 PLANO | `writing-plans` | use o **formato de cartão** do `subagent-driven-development` (arquivos + aceite verificável) |
| 3 EXECUÇÃO | `subagent-driven-development` ou `executing-plans` | um subagente por cartão; retorno curto |
| 3 paralelo | `dispatching-parallel-agents` | só cartões sem arquivo em comum |
| 3 isolamento | `using-git-worktrees` | quando dois cartões tocam a mesma área |
| 3 código | `test-driven-development` | obrigatório para lógica e bugs |
| bug | `systematic-debugging` | reproduzir → isolar → hipótese → 1 variável por vez |
| 4 CONFERÊNCIA | `verification-before-completion` | se disponível na versão instalada |
| 5 JULGAMENTO | `requesting-code-review` + **`esquadrao-julgamento`** | esquadrão para marcos; review do Superpowers para tarefas |
| feedback | `receiving-code-review` | verificar antes de aceitar sugestão |
| 6 ENTREGA | `finishing-a-development-branch` | + atualizar `docs/PROGRESSO.md` |

### Regras de convivência
- Se o Superpowers e esta base divergirem em **formato** (ex.: onde salvar o plano), use os caminhos da base (`docs/SPEC.md`, `docs/PLANO.md`, `docs/PROGRESSO.md`).
- Em **metodologia** (TDD, debugging, brainstorm), siga o Superpowers.
- Spike/protótipo descartável: pode pular brainstorm e TDD — diga explicitamente que é spike.
- Os nomes exatos das skills mudam entre versões: confira na lista de skills da ferramenta antes de citar uma.

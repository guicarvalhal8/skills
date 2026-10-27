---
name: using-superpowers
description: 'Use when starting any conversation - establishes how to find and use skills, requiring skill invocation before ANY response including clarifying questions | PT: inclui o mapa de qual skill do Superpowers usar em cada fase do fluxo da base.'
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, ignore this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.

This is not negotiable. You cannot rationalize your way out of this.
</EXTREMELY-IMPORTANT>

## The Rule

**Invoke relevant or requested skills BEFORE any response or action** — including clarifying questions, exploring the codebase, or checking files. If it turns out wrong for the situation, you don't have to use it.

**Before entering plan mode:** if you haven't already brainstormed, invoke the brainstorming skill first.

Then announce "Using [skill] to [purpose]" and follow the skill exactly. If it has a checklist, create a todo per item.

## Skill Priority

When multiple skills apply, process skills come first — they set the approach, then implementation skills (frontend-design, etc.) carry it out. Brainstorming and systematic-debugging are Superpowers' most common process skills, but the rule holds for any of them.

- "Let's build X" → superpowers:brainstorming first, then implementation skills.
- "Fix this bug" → superpowers:systematic-debugging first, then domain skills.

## Red Flags

These thoughts mean STOP—you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "I can check git/files quickly" | Files lack conversation context. Check for skills. |
| "Let me gather information first" | Skills tell you HOW to gather information. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "I remember this skill" | Skills evolve. Read current version. |
| "This doesn't count as a task" | Action = task. Check for skills. |
| "The skill is overkill" | Simple things become complex. Use it. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |
| "I know what that means" | Knowing the concept ≠ using the skill. Invoke it. |

## Platform Adaptation

If your harness appears here, read its reference file for special instructions:

- Claude Code: `references/claude-code-tools.md`
- Codex: `references/codex-tools.md`
- Pi: `references/pi-tools.md`
- Antigravity: `references/antigravity-tools.md`
- Hermes Agent: `references/hermes-tools.md`
- Muse: `references/muse-tools.md`

## User Instructions

User instructions (CLAUDE.md, AGENTS.md, GEMINI.md, etc, direct requests) take precedence over skills, which in turn override default behavior. Only skip skill workflows or instructions when your human partner has explicitly told you to.

---

<!-- skills-base:complemento -->
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

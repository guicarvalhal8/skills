---
name: esquadrao-julgamento
description: 'Esquadrão de julgamento: conselho de vozes independentes para decisões ambíguas (council do ECC) + painel de juízes da base (especificação, segurança, qualidade, performance, UX) que julga diff/PR/marco com veredito APROVADO/REPROVADO e achados P0–P3 verificados. Use antes de merge/deploy, ao fechar um marco, em decisões go/no-go, ou quando pedirem "revisa", "julga", "review", "tá bom pra subir?", "esquadrão", "conselho".'
metadata:
  origin: ECC
---

# Council

Convene four advisors for ambiguous decisions:
- the in-context Claude voice
- a Skeptic subagent
- a Pragmatist subagent
- a Critic subagent

This is for **decision-making under ambiguity**, not code review, implementation planning, or architecture design.

## When to Use

Use council when:
- a decision has multiple credible paths and no obvious winner
- you need explicit tradeoff surfacing
- the user asks for second opinions, dissent, or multiple perspectives
- conversational anchoring is a real risk
- a go / no-go call would benefit from adversarial challenge

Examples:
- monorepo vs polyrepo
- ship now vs hold for polish
- feature flag vs full rollout
- simplify scope vs keep strategic breadth

## When NOT to Use

| Instead of council | Use |
| --- | --- |
| Verifying whether output is correct | `santa-method` |
| Breaking a feature into implementation steps | `planner` |
| Designing system architecture | `architect` |
| Reviewing code for bugs or security | `code-reviewer` or `santa-method` |
| Straight factual questions | just answer directly |
| Obvious execution tasks | just do the task |

## Roles

| Voice | Lens |
| --- | --- |
| Architect | correctness, maintainability, long-term implications |
| Skeptic | premise challenge, simplification, assumption breaking |
| Pragmatist | shipping speed, user impact, operational reality |
| Critic | edge cases, downside risk, failure modes |

The three external voices should be launched as fresh subagents with **only the question and relevant context**, not the full ongoing conversation. That is the anti-anchoring mechanism.

## Workflow

### 1. Extract the real question

Reduce the decision to one explicit prompt:
- what are we deciding?
- what constraints matter?
- what counts as success?

If the question is vague, ask one clarifying question before convening the council.

### 2. Gather only the necessary context

If the decision is codebase-specific:
- collect the relevant files, snippets, issue text, or metrics
- keep it compact
- include only the context needed to make the decision

If the decision is strategic/general:
- skip repo snippets unless they materially change the answer

### 3. Form the Architect position first

Before reading other voices, write down:
- your initial position
- the three strongest reasons for it
- the main risk in your preferred path

Do this first so the synthesis does not simply mirror the external voices.

### 4. Launch three independent voices in parallel

Each subagent gets:
- the decision question
- compact context if needed
- a strict role
- no unnecessary conversation history

Prompt shape:

```text
You are the [ROLE] on a four-voice decision council.

Question:
[decision question]

Context:
[only the relevant snippets or constraints]

Respond with:
1. Position — 1-2 sentences
2. Reasoning — 3 concise bullets
3. Risk — biggest risk in your recommendation
4. Surprise — one thing the other voices may miss

Be direct. No hedging. Keep it under 300 words.
```

Role emphasis:
- Skeptic: challenge framing, question assumptions, propose the simplest credible alternative
- Pragmatist: optimize for speed, simplicity, and real-world execution
- Critic: surface downside risk, edge cases, and reasons the plan could fail

### 5. Synthesize with bias guardrails

You are both a participant and the synthesizer, so use these rules:
- do not dismiss an external view without explaining why
- if an external voice changed your recommendation, say so explicitly
- always include the strongest dissent, even if you reject it
- if two voices align against your initial position, treat that as a real signal
- keep the raw positions visible before the verdict

### 6. Present a compact verdict

Use this output shape:

```markdown
## Council: [short decision title]

**Architect:** [1-2 sentence position]
[1 line on why]

**Skeptic:** [1-2 sentence position]
[1 line on why]

**Pragmatist:** [1-2 sentence position]
[1 line on why]

**Critic:** [1-2 sentence position]
[1 line on why]

### Verdict
- **Consensus:** [where they align]
- **Strongest dissent:** [most important disagreement]
- **Premise check:** [did the Skeptic challenge the question itself?]
- **Recommendation:** [the synthesized path]
```

Keep it scannable on a phone screen.

## Persistence Rule

Do **not** write ad-hoc notes to `~/.claude/notes` or other shadow paths from this skill.

If the council materially changes the recommendation:
- use `knowledge-ops` to store the lesson in the right durable location
- or use `/save-session` if the outcome belongs in session memory
- or update the relevant GitHub / Linear issue directly if the decision changes active execution truth

Only persist a decision when it changes something real.

## Multi-Round Follow-up

Default is one round.

If the user wants another round:
- keep the new question focused
- include the previous verdict only if it is necessary
- keep the Skeptic as clean as possible to preserve anti-anchoring value

## Anti-Patterns

- using council for code review
- using council when the task is just implementation work
- feeding the subagents the entire conversation transcript
- hiding disagreement in the final verdict
- persisting every decision as a note regardless of importance

## Related Skills

- `santa-method` — adversarial verification
- `knowledge-ops` — persist durable decision deltas correctly
- `search-first` — gather external reference material before the council if needed
- `architecture-decision-records` — formalize the outcome when the decision becomes long-lived system policy

## Example

Question:

```text
Should we ship ECC 2.0 as alpha now, or hold until the control-plane UI is more complete?
```

Likely council shape:
- Architect pushes for structural integrity and avoiding a confused surface
- Skeptic questions whether the UI is actually the gating factor
- Pragmatist asks what can be shipped now without harming trust
- Critic focuses on support burden, expectation debt, and rollout confusion

The value is not unanimity. The value is making the disagreement legible before choosing.

---

<!-- skills-base:complemento -->
## Complemento skills-base — práticas da base

**Quando usar o quê:** o *council* acima é para **decisões** (arquitetura, go/no-go, trade-offs). Para **julgar código** (diff, PR, marco) use o painel de juízes abaixo. Os dois podem rodar em sequência: o painel encontra os problemas, o council decide o que fazer quando há trade-off.

> As regras abaixo vêm da base skills-base e complementam a skill original acima. Em conflito, siga a skill original na **metodologia** e esta seção nos **padrões do projeto** (stack, caminhos `docs/`, formatos).

Você é o **juiz-presidente**: monta o processo, dispara os juízes em paralelo, **verifica** cada achado e dá o veredito. Os juízes só reportam; ninguém corrige durante o julgamento.

### 1. Montar o processo
Defina o objeto do julgamento e gere o "autos" (contexto mínimo que todo juiz recebe):
```bash
BASE=${BASE:-main}
git diff --stat "$BASE"...HEAD
git diff "$BASE"...HEAD > /tmp/autos.diff      # juízes leem este arquivo, não o repo todo
```
Autos = caminho do diff + cartões/SPEC relevantes (`docs/SPEC.md`, cartões do marco) + comandos de teste do `AGENTS.md`.

### 2. Escolher a composição
| Modo | Quando | Juízes |
|---|---|---|
| **rápido** | diff pequeno, sem auth/dados/UI | `juiz-especificacao`, `juiz-qualidade` |
| **padrão** (default) | feature normal | + `juiz-seguranca` |
| **completo** | antes de produção, auth, pagamento, dado pessoal, UI pública | + `juiz-performance`, `juiz-ux` (só se houver front) |

O usuário pode forçar: `/esquadrao-julgamento completo`.

### 3. Disparar (todos de uma vez = paralelo)
Com subagentes: dispare os juízes juntos. Sem subagentes: rode cada juiz em sequência, um por vez, cada um lendo só os autos.
Prompt para cada juiz:
```
Você é <juiz>. Julgue os autos abaixo SOMENTE pela sua especialidade.
Autos: diff em /tmp/autos.diff; requisitos: <cartões/SPEC>; testes: <comando>.
Leia só o diff e, se precisar, os arquivos tocados por ele.
Responda no formato:
VEREDITO: APROVADO | REPROVADO
ACHADOS:
- [P0|P1|P2|P3] arquivo:linha — problema — por que importa — correção sugerida (1 linha)
(máx. 10 achados, os mais graves primeiro; nenhum achado = "nenhum")
```

### 4. Verificar (passo que separa julgamento de opinião)
Para cada achado P0/P1: abra o trecho citado e confirme. Se possível, prove (teste, curl, entrada maliciosa). Classifique:
- **confirmado** → fica
- **plausível** → fica com nota "não provado"
- **improcedente** → descarte e diga por quê em ½ linha
Junte duplicados (dois juízes, mesmo problema → um item, maior severidade).

### 5. Severidade
| Nível | Significa | Efeito |
|---|---|---|
| **P0** | quebra, perda/vazamento de dado, falha de segurança explorável, requisito central ausente | bloqueia |
| **P1** | bug provável em caso real, falta de validação/autorização, teste do aceite ausente | bloqueia |
| **P2** | manutenção, legibilidade, performance não crítica, UX ruim | vira cartão |
| **P3** | estilo, sugestão | opcional |

**Veredito final:** REPROVADO se houver qualquer P0/P1 confirmado ou plausível; senão APROVADO (com P2/P3 listados).

### 6. Sentença (formato de saída para o usuário)
```markdown
## Sentença — <objeto> — <APROVADO|REPROVADO>
Composição: <modo> (<juízes>) · Testes: <comando> → <resultado>

### Bloqueadores
1. [P0] src/auth/login.ts:42 — senha comparada com `==` sem hash … → usar bcrypt.compare  *(confirmado)*

### Para o plano (P2)
- …

### Sugestões (P3)
- …

### Improcedentes
- juiz-performance: "N+1 em listar" — já usa include, descartado.
```
Depois: P0/P1 viram cartões no topo de `docs/PLANO.md`; após corrigir, rejulgue **só** com os juízes que reprovaram.

Rubricas detalhadas de cada juiz: `references/rubricas.md`. Os prompts dos juízes ficam em `agents/juiz-*.md` do repo skills-base (servem para qualquer IA).

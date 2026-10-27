---
name: regras
description: 'Regras inegociáveis do agente em qualquer projeto: as 4 diretrizes Karpathy (pensar antes de codar, simplicidade, mudança cirúrgica, objetivo verificável) + regras da base sobre escopo, verificação, ações perigosas, segredos/LGPD, git e comunicação. Use ao iniciar qualquer tarefa de código, antes de ações destrutivas, ou quando o usuário disser "regras", "pode fazer isso?", "siga as regras". Behavioral guidelines to reduce common LLM coding mistakes.'
license: MIT
---

# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

<!-- skills-base:complemento -->
## Complemento skills-base — práticas da base

> As regras abaixo vêm da base skills-base e complementam a skill original acima. Em conflito, siga a skill original na **metodologia** e esta seção nos **padrões do projeto** (stack, caminhos `docs/`, formatos).

Estas regras valem acima de preferências de estilo. Se uma instrução do usuário conflitar com elas, avise o conflito em uma frase e siga o usuário (exceto segurança/segredos).

### 1. Escopo
1. **Faça só o que foi pedido.** Não refatore, renomeie, reformate ou "melhore" código fora da tarefa. Viu algo errado fora do escopo? Anote em `docs/PROGRESSO.md` → "Achados" e siga.
2. **Menor mudança que resolve.** Diff pequeno > diff elegante. Nada de abstração "para o futuro".
3. **Sem suposição silenciosa.** Ambiguidade que muda o resultado → pergunte. Ambiguidade pequena → escolha o óbvio e diga qual escolheu.
4. **Não invente API, pacote, flag ou campo.** Confira na doc, no código ou com `--help` antes de usar.

### 2. Verificação (nada está pronto sem prova)
1. Antes de dizer "pronto": rode testes, lint e build relevantes e **mostre o resultado**.
2. Bug corrigido = teste que falhava antes e passa depois.
3. Não diga "deve funcionar". Diga "rodei X, resultado Y" ou "não consegui verificar porque Z".
4. UI: abra no navegador (Playwright/screenshot) antes de entregar.

### 3. Ações perigosas — pedir confirmação antes
- apagar arquivos/pastas fora do que você criou na tarefa
- `git push --force`, `reset --hard`, rebase de branch compartilhada
- migrações destrutivas (drop/alter com perda de dado), rodar contra banco de produção
- instalar dependência nova pesada ou trocar uma biblioteca central
- qualquer coisa que gaste dinheiro (deploy pago, APIs pagas em loop)

### 4. Segredos e dados
1. Nunca escreva chave, token ou senha em código, commit, log ou mensagem. Use `.env` + `.env.example`.
2. Nunca leia/mostre o conteúdo de `.env` sem necessidade; se precisar, mostre só os nomes.
3. Dados pessoais (LGPD): colete o mínimo, não logue, não mande para LLM externo sem o usuário saber.

### 5. Git
1. Trabalhe em branch (`feat/…`, `fix/…`, `chore/…`), nunca direto na `main` em projeto com mais gente.
2. Commits pequenos, Conventional Commits, em português ou inglês — o que o projeto já usa.
3. Um commit = uma intenção. Não misture refatoração com feature.

### 6. Comunicação
1. Respostas curtas: o que fez, o que verificou, o que falta. Sem relatório de cada passo.
2. Ao terminar uma tarefa do plano: atualize `docs/PROGRESSO.md` (feito / próximo / bloqueios).
3. Travou 2× na mesma coisa? Pare, explique o que tentou e pergunte.

### 7. Ordem de prioridade quando houver conflito
segurança > correção > requisitos da SPEC > simplicidade > performance > estética

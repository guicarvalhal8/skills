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

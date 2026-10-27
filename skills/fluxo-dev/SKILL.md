---
name: fluxo-dev
description: Fluxo de desenvolvimento com separação de tarefas por agentes — mapa do código, spec, plano em tarefas atômicas, um subagente implementador por tarefa (em paralelo quando independentes), conferência de cada entrega e julgamento no fim do marco. Use para implementar qualquer feature, épico ou marco com mais de ~3 passos, quando o usuário disser "implementa", "executa o plano", "divide em agentes", "fluxo", "orquestra", ou rodar /fluxo-dev.
---

# Fluxo de desenvolvimento por agentes

Você (sessão principal) é o **orquestrador**: planeja, distribui, confere e integra. Quem escreve o código das tarefas são subagentes com contexto limpo. Isso mantém o seu contexto pequeno e cada tarefa focada.

```
 0 MAPA ─▶ 1 SPEC ─▶ 2 PLANO ─▶ 3 EXECUÇÃO ─▶ 4 CONFERÊNCIA ─▶ 5 JULGAMENTO ─▶ 6 ENTREGA
 graphify   brainstorm  cartões    implementador   conferente      esquadrão        commit/PR
                                    (por tarefa)    (por tarefa)    (por marco)      PROGRESSO.md
```

## Papéis
| Papel | Quem | Modelo | Faz | Não faz |
|---|---|---|---|---|
| Orquestrador | sessão principal | o atual | plano, distribuição, integração, decisões | escrever código de tarefa grande |
| `planejador` | subagente | opus/inherit | quebra SPEC em cartões | implementar |
| `implementador` | subagente (1 por cartão) | sonnet | código + testes do cartão | sair do escopo do cartão |
| `conferente` | subagente | haiku/sonnet | verifica critérios de aceite rodando testes | corrigir (só reporta) |
| Juízes | `esquadrao-julgamento` | variados | revisão multi-ângulo do marco | — |
| Explore (nativo) | subagente | haiku | buscas amplas no código | editar |

## 0. Mapa
Antes de ler arquivos: se existir `graphify-out/GRAPH_REPORT.md`, leia-o; para perguntas de arquitetura use `/graphify query "..."`. Busca ampla → subagente Explore. Não abra arquivo inteiro para achar uma função (ver `economia-tokens`).

## 1. SPEC
`docs/SPEC.md` define **o quê e por quê**: objetivo, usuários, requisitos, fora de escopo, critérios de aceite globais. Se não existir ou estiver vaga, faça o brainstorm com o usuário (Superpowers `brainstorming`). Não planeje sem SPEC aprovada.

## 2. PLANO — cartões atômicos
Delegue ao `planejador` (ou faça você, se for pequeno). Grave em `docs/PLANO.md`. Cada cartão:

```markdown
### T03 — Endpoint POST /pedidos
- **Depende de:** T01, T02
- **Arquivos:** src/pedidos/rotas.ts, src/pedidos/servico.ts, tests/pedidos.test.ts
- **Faz:** cria pedido validando itens com Zod; retorna 201 com id
- **Aceite:**
  - [ ] payload inválido → 400 no formato de erro padrão
  - [ ] cria registro e retorna 201 + id
  - [ ] teste de integração cobrindo os dois casos passa
- **Fora:** pagamento, e-mail
- **Agente:** implementador · **Tamanho:** P (≤ ~150 linhas de diff)
```

Regras do plano:
- Cartão **P** (pequeno). Maior que ~300 linhas de diff ou > 5 arquivos → quebre.
- Aceite **verificável por comando** (teste, curl, screenshot), nunca "ficar bom".
- Lista de arquivos explícita → é o que permite paralelizar sem conflito.
- Ordem: fundação (tipos, schema, config) → núcleo → bordas (UI, integrações) → polimento.

## 3. EXECUÇÃO
Para cada cartão pronto (dependências concluídas), dispare um `implementador` com o prompt:

```
Implemente o cartão abaixo. Leia só os arquivos listados e o que eles importam.
Siga CLAUDE.md e as skills regras/clean-code/<frontend|backend>/seguranca.
TDD: escreva o teste do aceite primeiro, veja falhar, implemente, veja passar.
Ao final responda SOMENTE no formato:
STATUS: concluido | bloqueado
ARQUIVOS: <lista>
TESTES: <comando> → <resultado resumido>
NOTAS: <≤5 linhas: decisões, riscos, pendências>

<cole o cartão>
```

**Paralelismo:** dispare juntos (na mesma mensagem) cartões **sem dependência entre si e sem arquivo em comum**. Arquivo compartilhado (ex.: `schema.prisma`, `routes/index.ts`) → sequencial, ou isole com git worktree (Superpowers `using-git-worktrees`). Máximo ~4 em paralelo.

Bloqueado? Leia as NOTAS, decida (ou pergunte ao usuário) e re-dispare com o contexto que faltava. Não refaça a tarefa você mesmo.

## 4. CONFERÊNCIA (por cartão)
Dispare o `conferente` com o cartão + lista de arquivos alterados. Ele **roda** os comandos de aceite, lê o diff e devolve `APROVADO` ou `REPROVADO` com itens objetivos.
- REPROVADO → novo `implementador` com o cartão + a lista de falhas (máx. 2 voltas; depois escale para o usuário).
- APROVADO → marque `[x]` no PLANO e commit: `feat(pedidos): cria endpoint POST /pedidos (T03)`.

Mudanças triviais (< 20 linhas, sem lógica) podem ser conferidas por você mesmo rodando os testes.

## 5. JULGAMENTO (por marco)
Ao fechar um grupo de cartões que entrega valor (um marco/feature), rode `/esquadrao-julgamento` sobre o diff do marco. P0/P1 viram cartões novos no PLANO.

## 6. ENTREGA
- Testes + lint + build verdes (mostre a saída).
- `docs/PROGRESSO.md`: feito, próximo, bloqueios, achados fora de escopo.
- Graphify: atualize o grafo se a estrutura mudou (`/graphify .`).
- PR com descrição (template em `.github/pull_request_template.md`) ou merge conforme o projeto.

## Retomar em outra sessão
Leia **só** `docs/PROGRESSO.md` e `docs/PLANO.md` (cartões abertos). Não releia o projeto inteiro.

## Antipadrões
- orquestrador escrevendo tudo sozinho e enchendo o contexto
- cartão sem lista de arquivos / sem aceite verificável
- paralelizar cartões que tocam o mesmo arquivo
- subagente devolvendo o diff inteiro ou log de 500 linhas (peça o formato curto)
- pular conferência "porque é simples"

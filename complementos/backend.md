## Complemento skills-base — práticas da base

> As regras abaixo vêm da base skills-base e complementam a skill original acima. Em conflito, siga a skill original na **metodologia** e esta seção nos **padrões do projeto** (stack, caminhos `docs/`, formatos).

### Arquitetura em camadas (qualquer linguagem)
```
rota/controller  →  serviço (regra de negócio)  →  repositório (banco)  →  db
     ↑ valida entrada (schema)      ↑ não conhece HTTP      ↑ não conhece regra
```
1. **Controller** fino: parse + validação + chama serviço + mapeia resposta. Zero regra de negócio.
2. **Serviço**: regras, orquestração, transações. Testável sem HTTP e sem banco real (injete o repositório).
3. **Repositório**: única camada que fala SQL/ORM.
4. Integrações externas (WhatsApp, pagamento, LLM) atrás de um **client** próprio (`clients/whatsapp.ts`) com timeout, retry e tipos — nunca `fetch` espalhado.
5. Organize por **feature** (`pedidos/{rotas,servico,repositorio,schema}`), não por tipo técnico, quando passar de ~5 entidades.

### API
- REST com substantivos no plural: `GET /pedidos`, `POST /pedidos`, `GET /pedidos/{id}`, `PATCH /pedidos/{id}`.
- Status certos: 200, 201 (+Location), 204, 400 validação, 401 sem auth, 403 sem permissão, 404, 409 conflito, 422 regra de negócio, 429, 500.
- **Erro sempre no mesmo formato** (RFC 9457 `application/problem+json`): `{ type, title, status, detail, errors? }`.
- Paginação em toda listagem (`?limit=20&cursor=…`), limite máximo no servidor.
- Versione quando houver cliente externo: `/v1/...`.
Detalhes e exemplos: `references/api.md`.

### Validação e erros
- Valide na borda com schema (Zod · Bean Validation · Pydantic · FluentValidation). Dentro do serviço, confie no tipo.
- Erros de domínio como classes/tipos (`PedidoNaoEncontrado`) → handler global converte para HTTP. Nada de `try/catch` em todo controller.
- Nunca devolva stack trace ou mensagem do banco ao cliente.

### Banco de dados
- Migrações versionadas (Prisma/Drizzle/Flyway/Alembic/EF). Nunca alterar schema à mão em produção.
- Índice em toda FK e coluna usada em `WHERE`/`ORDER BY` frequente.
- Transação quando 2+ escritas precisam ser atômicas.
- Evite N+1 (include/join/batch). `SELECT` só das colunas necessárias em tabela grande.
- Dinheiro em centavos (inteiro) ou `DECIMAL`, nunca float. Datas em UTC (`timestamptz`).
Detalhes: `references/banco-de-dados.md`.

### Assíncrono, jobs e webhooks
- Trabalho > ~2s ou que pode falhar externamente → fila/job (BullMQ, Celery, @Async+fila, Hangfire), com retry exponencial e dead-letter.
- **Idempotência**: webhooks e jobs podem chegar 2×. Use chave de idempotência / id do evento com unique constraint.
- Webhook: verificar assinatura (ex.: `X-Hub-Signature-256` da Meta) **antes** de processar; responder 200 rápido e processar na fila.

### Config e observabilidade
- Config só por variáveis de ambiente, validadas no boot (falhar cedo).
- Log estruturado (JSON) com `requestId`; nível info para eventos de negócio, nunca dados sensíveis.
- `GET /health` (vivo) e `GET /ready` (dependências ok).
- Timeouts em toda chamada externa (padrão 10s), inclusive banco.

### IA / LLM no servidor
Chave só no servidor · timeout + retry · limite de tokens por requisição · saída estruturada validada por schema · log de custo/latência · cache de prompt · RAG com chunking e citação de fonte. Ver `references/ia-llm.md`.

### Por stack
Comandos, libs e estrutura para Node/TS, Spring, FastAPI e .NET: `references/stacks.md`.

### Testes de back
- Unitário no serviço (repositório falso).
- Integração por endpoint com banco real descartável (Testcontainers ou SQLite/Postgres de teste) cobrindo: sucesso, validação, sem auth, sem permissão.

# Banco de dados — referência

## Modelagem
- PK: `uuid` (v7 se disponível, ordenável) ou `bigint identity`. Não exponha id sequencial se ele revelar volume de negócio.
- Colunas padrão: `criado_em timestamptz default now()`, `atualizado_em timestamptz`.
- Soft delete (`excluido_em`) só se houver necessidade real (auditoria, restaurar); senão delete de verdade (LGPD agradece).
- Enum de status como `text` + `CHECK` ou enum do banco; nunca número mágico.
- Unique constraints para regras de unicidade (e-mail, id de evento de webhook) — não confie só no código.

## Migrações
- Uma migração por mudança lógica; nome descritivo (`20261027_add_status_pedidos`).
- Mudança destrutiva em 2 passos: (1) adicionar novo + escrever nos dois, (2) migrar leitura, (3) remover antigo em outro deploy.
- `NOT NULL` em coluna nova de tabela grande: adicione com default ou em etapas.

## Consultas
- Use `EXPLAIN ANALYZE` quando a consulta passar de ~100ms.
- Índice composto na ordem: igualdade → intervalo → ordenação.
- Busca textual: `pg_trgm` / full-text do Postgres antes de pensar em Elastic.
- Vetores (RAG): `pgvector` com índice HNSW; guarde `fonte`, `trecho`, `metadados` junto do embedding.

## Transações
- Curtas. Nada de chamada HTTP externa dentro de transação.
- Padrão "outbox": grave o evento numa tabela na mesma transação e um worker publica depois.

## Conexões
- Pool configurado (serverless: use pooler — PgBouncer/Neon/Supabase pooler).
- Timeout de statement (`statement_timeout`) para evitar consulta presa.

## Seeds e dados de teste
- `seed` idempotente para dev; nunca dados reais de cliente em dev/teste.

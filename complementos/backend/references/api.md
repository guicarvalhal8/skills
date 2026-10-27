# API — referência

## Formato de erro (RFC 9457)
```json
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "https://api.exemplo.com/erros/validacao",
  "title": "Dados inválidos",
  "status": 400,
  "detail": "Um ou mais campos são inválidos.",
  "errors": { "email": ["formato inválido"], "itens": ["mínimo 1 item"] }
}
```

## Listagem paginada (cursor)
```
GET /pedidos?limit=20&cursor=eyJpZCI6MTIzfQ
200 { "data": [...], "nextCursor": "eyJpZCI6MTQzfQ" | null }
```
Offset (`?page=2`) só para tabelas pequenas ou quando o usuário precisa pular páginas.

## Filtros e ordenação
`GET /pedidos?status=pago&ordem=-criadoEm` — whitelist dos campos de filtro/ordem no servidor (evita injection e query lenta).

## Idempotência em POST sensível
Cliente manda `Idempotency-Key: <uuid>`; servidor guarda (chave → resposta) por 24h e devolve a mesma resposta em repetição.

## Rate limit
Responder `429` com `Retry-After`. Limites mais duros em login, cadastro, envio de mensagem e endpoints que chamam LLM.

## Documentação
OpenAPI gerado do código (zod-openapi, springdoc, FastAPI nativo, Swashbuckle). Rota `/docs` só fora de produção ou protegida.

## Checklist de endpoint novo
- [ ] schema de entrada e saída
- [ ] autenticação e **autorização por recurso**
- [ ] status codes corretos e erro no formato padrão
- [ ] paginação (se lista)
- [ ] teste de integração: ok, 400, 401, 403/404
- [ ] log do evento de negócio sem dado sensível

# Stacks — padrões por linguagem

## Node / TypeScript
- Framework: **Fastify** (API enxuta) ou **NestJS** (app grande, DI) · Next.js route handlers/Server Actions para app full-stack.
- Validação: Zod · ORM: Prisma ou Drizzle · Testes: Vitest + Supertest · Fila: BullMQ (Redis).
- Lint/format: ESLint + Prettier (ou Biome).
- Estrutura: `src/{modules/<feature>/{routes,service,repository,schema}.ts, clients/, lib/, config/env.ts}`.

## Java / Spring Boot
- Spring Boot 3, Java 21 · Web + Validation + Data JPA + Flyway · Testes: JUnit 5 + Testcontainers.
- Pacotes por feature: `com.app.pedidos.{PedidoController, PedidoService, PedidoRepository, dto/, domain/}`.
- DTOs como `record`; nunca expor entidade JPA na API.
- `@ControllerAdvice` + `ProblemDetail` (nativo) para erros RFC 9457.
- `@Transactional` no serviço, nunca no controller. `spring.jpa.open-in-view=false`.

## Python / FastAPI
- FastAPI + Pydantic v2 · SQLAlchemy 2 + Alembic · Testes: pytest + httpx · Fila: Celery/RQ/arq.
- Gerenciador: **uv** (`uv init`, `uv add`, `uv run`). Lint/format: Ruff. Tipos: mypy/pyright.
- Estrutura: `app/{routers/, services/, repositories/, schemas/, models/, core/config.py}`.
- `async` de ponta a ponta ou síncrono de ponta a ponta — não misture driver síncrono em rota async.

## C# / .NET
- ASP.NET Core Minimal APIs ou Controllers · EF Core + migrations · FluentValidation · xUnit.
- `ProblemDetails` nativo · `HttpClientFactory` + Polly para clients externos · Hangfire para jobs.
- Conector/serviço Windows: `Worker Service` com logs estruturados (Serilog) e config em `appsettings` + env.

## Comandos que o CLAUDE.md do projeto deve listar
`dev`, `test`, `lint`, `format`, `build`, `migrate`, `seed` — com o comando exato da stack.

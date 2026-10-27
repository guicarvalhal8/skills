---
name: boas-praticas
description: Boas práticas de engenharia para projetos da base — git (branches, Conventional Commits, PRs pequenos), testes (pirâmide, TDD, o que testar), CI, versionamento, README e documentação, gestão de dependências e ambientes, e Definition of Done. Use ao configurar um repositório, escrever commits/PRs, montar CI, decidir o que testar, documentar, atualizar dependências, ou quando o usuário perguntar "como devo organizar", "qual o padrão", "está pronto?".
---

# Boas práticas

## Git
- **Branches:** `main` sempre deployável · `feat/<assunto>` · `fix/<assunto>` · `chore/…` · `docs/…`.
- **Commits (Conventional Commits):** `tipo(escopo): resumo no imperativo`
  - tipos: `feat` `fix` `refactor` `test` `docs` `chore` `perf` `style` `ci` `build`
  - ex.: `feat(auth): adiciona login com Google`, `fix(pedidos): corrige total com desconto`
  - quebra de compatibilidade: `feat!:` ou rodapé `BREAKING CHANGE:`
- **PR:** pequeno (< ~400 linhas), uma intenção, descrição com *o quê / por quê / como testar / prints*. Template em `.github/pull_request_template.md`.
- Nunca commitar: `.env`, build (`dist/`, `.next/`), dependências, arquivos de IDE pessoais, dados reais.

## Testes
Pirâmide: muitos **unitários** (regra de negócio) · alguns de **integração** (endpoint + banco) · poucos **E2E** (fluxos críticos: login, compra, cadastro).
- **TDD** para lógica e bugs: teste falhando → código mínimo → refatorar.
- Teste comportamento, não implementação (entrada → saída/efeito). Evite mock de tudo.
- Nome do teste diz o cenário: `"retorna 403 quando o pedido é de outro usuário"`.
- Bug corrigido sempre ganha teste de regressão.
- Ferramentas padrão: Vitest/Jest + Testing Library · Playwright (E2E) · pytest · JUnit 5 + Testcontainers · xUnit.

## Qualidade automática
- Lint + format no editor **e** no CI (ESLint+Prettier/Biome · Ruff · Checkstyle/Spotless · dotnet format).
- Hook de pre-commit leve (lint-staged) — rápido, senão vão desligar.
- Typecheck no CI (`tsc --noEmit`, mypy).

## CI (mínimo)
Em todo PR: install → lint → typecheck → test → build. Template: `.github/workflows/ci.yml`. CI vermelho bloqueia merge.

## Dependências
- Lockfile commitado. Versões exatas para libs críticas.
- Antes de adicionar lib: precisa mesmo? É mantida (último release, issues)? Tamanho? Licença?
- Atualizações via Renovate/Dependabot, em PRs separados.

## Ambientes
`local` → `staging/preview` → `produção`. Mesma build, config diferente por env vars. `.env.example` sempre atualizado com **todas** as variáveis (sem valores).

## Documentação que vale a pena
- **README:** o que é, como rodar em 3 comandos, variáveis de ambiente, como testar, como fazer deploy.
- **AGENTS.md:** curto, para o agente (stack, comandos, convenções, onde fica o quê).
- **docs/SPEC.md, docs/PLANO.md, docs/PROGRESSO.md:** produto, tarefas e estado.
- **ADR** (`docs/adr/NNNN-titulo.md`) para decisões difíceis de reverter (banco, auth, arquitetura).
- Comentário no código explica **por quê**, nunca o quê.

## Versionamento e releases
SemVer (`MAJOR.MINOR.PATCH`) para libs/APIs públicas; tags `vX.Y.Z`; CHANGELOG gerado dos commits.

## Definition of Done
- [ ] critérios de aceite atendidos e testados
- [ ] lint, typecheck, testes e build verdes
- [ ] sem segredo/console.log/código morto
- [ ] docs atualizadas (README/.env.example/PROGRESSO) se algo mudou
- [ ] revisado (conferente ou esquadrão) e PR descrito

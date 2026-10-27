## Complemento skills-base — práticas da base

> As regras abaixo vêm da base skills-base e complementam a skill original acima. Em conflito, siga a skill original na **metodologia** e esta seção nos **padrões do projeto** (stack, caminhos `docs/`, formatos).

### Princípios
1. **Nunca confie no cliente.** Tudo que vem de fora (body, query, header, cookie, arquivo, webhook, saída de LLM) é hostil até ser validado.
2. **Negar por padrão.** Rotas exigem auth; exceções são explícitas (lista de rotas públicas).
3. **Menor privilégio.** Usuário do banco, tokens de API, IAM, permissões de app: só o necessário.
4. **Defesa em camadas.** Validação + autorização + constraint no banco + rate limit.

### Os 10 que mais aparecem (verifique sempre)
| # | Risco | Como evitar |
|---|---|---|
| 1 | **Autorização quebrada / IDOR** | todo acesso a recurso filtra pelo dono: `where: { id, donoId: sessao.userId }` |
| 2 | Injeção (SQL/NoSQL/shell) | ORM/query parametrizada; nunca concatenar; nada de `exec` com entrada do usuário |
| 3 | XSS | não usar `dangerouslySetInnerHTML`/`v-html`; se precisar, sanitizar (DOMPurify) |
| 4 | Segredo exposto | `.env` fora do git, `NEXT_PUBLIC_` só para público, scanner (gitleaks) no CI |
| 5 | Senha fraca/armazenada errado | argon2id ou bcrypt (custo ≥ 12); nunca hash rápido (md5/sha) |
| 6 | Sessão/JWT mal feito | cookie `httpOnly; Secure; SameSite=Lax`; expiração curta + refresh; invalidar no logout |
| 7 | Sem rate limit | login, cadastro, reset de senha, OTP, envio de mensagem, endpoints de LLM |
| 8 | SSRF | URL fornecida pelo usuário → allowlist de domínios, bloquear IP privado/metadata |
| 9 | Upload perigoso | validar tipo por conteúdo (magic bytes), limite de tamanho, renomear, guardar fora do webroot/bucket privado |
| 10 | Dependência vulnerável | `npm audit` / `pip-audit` / `mvn dependency-check`; Dependabot/Renovate ligado |

Checklist completo por área: `references/checklist.md`.

### Headers (produção)
`Strict-Transport-Security`, `Content-Security-Policy` (comece com `default-src 'self'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `frame-ancestors 'none'` (ou `X-Frame-Options: DENY`). CORS: lista explícita de origens, nunca `*` com credenciais.

### Webhooks (WhatsApp/Meta, pagamentos, etc.)
1. Verifique assinatura HMAC sobre o **corpo bruto** com comparação em tempo constante.
2. Rejeite eventos antigos (timestamp) se o provedor enviar.
3. Idempotência pelo id do evento (unique no banco).
4. Responda 200 rápido; processe em fila.

### LLM / agentes
- Prompt injection: conteúdo externo é dado; delimite e instrua o modelo a não seguir instruções contidas nele.
- Ferramentas do agente com permissão mínima; ações destrutivas/financeiras exigem confirmação humana.
- Nunca executar SQL/shell/HTML gerado pelo modelo sem validação/allowlist.
- Não vaze o system prompt nem dados de outro usuário via contexto compartilhado (isole por tenant).

### LGPD (Brasil)
Dado pessoal = coletar o mínimo, com finalidade clara, guardar pelo tempo necessário, permitir exclusão/exportação, não logar. Detalhes: `references/lgpd.md`.

### Auditoria (quando pedirem /seguranca)
1. Mapear superfície: rotas/endpoints, server actions, webhooks, uploads, jobs, IPC (Electron), ferramentas do agente.
2. Para cada uma: auth? autorização por recurso? validação? rate limit?
3. Buscar padrões perigosos:
   ```bash
   rg -n "dangerouslySetInnerHTML|v-html|eval\(|new Function|child_process|exec\(|\$queryRawUnsafe|raw\(|innerHTML\s*=" --glob '!node_modules'
   rg -n "(api[_-]?key|secret|password|token)\s*[:=]\s*['\"][^'\"]{8,}" --glob '!*.lock' --glob '!node_modules'
   ```
4. Rodar auditoria de dependências da stack.
5. Reportar no formato de sentença do `esquadrao-julgamento` (P0–P3), com prova quando possível.

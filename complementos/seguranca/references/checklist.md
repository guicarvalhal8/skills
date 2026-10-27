# Checklist de segurança por área

## Autenticação
- [ ] Senha: argon2id/bcrypt; mínimo 8 caracteres; checar contra senhas vazadas se possível
- [ ] Login com mensagem genérica ("e-mail ou senha inválidos")
- [ ] Rate limit + bloqueio progressivo em login/OTP/reset
- [ ] Reset de senha: token aleatório (≥ 32 bytes), uso único, expira em ≤ 1h, guardado como hash
- [ ] Sessão regenerada após login; logout invalida no servidor
- [ ] OAuth: validar `state`, usar PKCE; não confiar em e-mail não verificado do provedor
- [ ] Preferir lib madura (Auth.js, Lucia, Spring Security, Clerk/Supabase Auth) a auth caseira

## Autorização
- [ ] Middleware exige sessão em todas as rotas exceto allowlist pública
- [ ] Cada consulta/alteração de recurso confere dono/tenant/papel
- [ ] Papéis checados no servidor, nunca só escondendo botão no front
- [ ] Multi-tenant: `tenant_id` em toda tabela e em todo `WHERE` (ou RLS no Postgres)

## Entrada e saída
- [ ] Schema em todo input (incluindo query e headers usados)
- [ ] Limite de tamanho de body e de arrays
- [ ] Saída não inclui campos internos (hash de senha, tokens, flags)
- [ ] Mensagens de erro sem stack trace/SQL

## Dados
- [ ] TLS em tudo; banco não exposto na internet
- [ ] Backups automáticos e testados
- [ ] Dados sensíveis criptografados em repouso quando aplicável (tokens de terceiros)
- [ ] Logs sem senha, token, CPF, cartão, conteúdo de mensagens privadas

## Infra / deploy
- [ ] Variáveis de ambiente pelo provedor (Vercel/Render/…), não em arquivo no servidor
- [ ] Modo debug desligado em produção
- [ ] Rotas de admin/docs protegidas
- [ ] Dependabot/Renovate + `gitleaks` no CI

## Electron
- [ ] `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- [ ] CSP no HTML; não carregar conteúdo remoto em janela com preload privilegiado
- [ ] IPC: validar canal e payload; nada de expor `ipcRenderer` inteiro
- [ ] Auto-update assinado

## Front-end
- [ ] Sem segredo no bundle (procure por chaves no build: `rg -n "sk-|AKIA|AIza" .next/ dist/`)
- [ ] Links externos com `rel="noopener noreferrer"`
- [ ] CSRF: Server Actions/SameSite cobrem a maioria; formulários tradicionais precisam de token

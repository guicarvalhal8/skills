# Rubricas dos juízes

Cada juiz responde **só** pela própria especialidade. Se notar algo fora dela que seja P0, pode citar em 1 linha com o prefixo `[fora-da-área]`.

## juiz-especificacao — "faz o que foi pedido?"
- Cada critério de aceite do cartão/SPEC tem implementação **e** teste?
- Algo pedido ficou de fora? Algo **não pedido** entrou (scope creep)?
- Casos de borda da SPEC: vazio, limite, duplicado, sem permissão, falha de rede.
- Mensagens/erros visíveis ao usuário batem com a SPEC?
- Os testes testam comportamento (entrada → saída) ou só que "a função foi chamada"?

## juiz-seguranca — "dá para abusar?"
- Entrada validada na borda (schema) — body, query, params, headers, arquivos.
- Autorização por recurso (o usuário X pode mexer no objeto Y?) — IDOR.
- SQL/NoSQL/command injection, XSS (dangerouslySetInnerHTML, v-html), SSRF (fetch de URL do usuário), path traversal.
- Segredo hardcoded, log com token/senha/dado pessoal, `.env` commitado.
- Auth: hash de senha (bcrypt/argon2), sessão/JWT (expiração, httpOnly, secure, sameSite), rate limit em login.
- Webhooks: assinatura verificada? Idempotência?
- LLM: entrada do usuário/documento pode mudar instruções (prompt injection)? Saída do modelo é executada/renderizada sem filtro?
- Dependência nova com vulnerabilidade conhecida (`npm audit`, `pip-audit`).

## juiz-qualidade — "dá para manter?"
- Nomes revelam intenção; funções fazem uma coisa; arquivos < ~300 linhas.
- Duplicação real (3+ vezes) ou abstração prematura (1 uso).
- Tratamento de erro: nada engolido em `catch {}`; erros com contexto.
- Tipos: `any`/casts desnecessários; nulos tratados.
- Código morto, console.log/print esquecido, TODO sem cartão.
- Segue o padrão já existente do projeto (estrutura, libs, convenções).
- Diff mínimo: mudanças sem relação com a tarefa?

## juiz-performance — "aguenta uso real?"
- N+1 em banco; consulta sem índice em coluna filtrada; `SELECT *` em tabela grande; falta paginação.
- Trabalho pesado em loop/render; recomputação sem memo onde custa.
- Front: bundle (import de lib inteira), imagens sem otimização, fontes bloqueando, layout shift, client component sem necessidade.
- Chamadas externas sem timeout/retry/limite; LLM sem cache nem limite de tokens.
- Memória: listas sem limite, listeners/intervals não limpos.

## juiz-ux — "a pessoa consegue usar?" (só com front)
- Estados: carregando, vazio, erro, sucesso — todos existem?
- Acessibilidade: rótulos em inputs, contraste, foco visível, navegação por teclado, `alt`, `prefers-reduced-motion`.
- Responsivo em 360px, 768px, 1280px.
- Textos claros, em português correto, sem jargão técnico para o usuário final.
- Feedback de ação (botão desabilita ao enviar, toast/confirm).
- Hierarquia visual e consistência com o design system do projeto.

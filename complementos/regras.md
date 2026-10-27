## Complemento skills-base — práticas da base

> As regras abaixo vêm da base skills-base e complementam a skill original acima. Em conflito, siga a skill original na **metodologia** e esta seção nos **padrões do projeto** (stack, caminhos `docs/`, formatos).

Estas regras valem acima de preferências de estilo. Se uma instrução do usuário conflitar com elas, avise o conflito em uma frase e siga o usuário (exceto segurança/segredos).

### 1. Escopo
1. **Faça só o que foi pedido.** Não refatore, renomeie, reformate ou "melhore" código fora da tarefa. Viu algo errado fora do escopo? Anote em `docs/PROGRESSO.md` → "Achados" e siga.
2. **Menor mudança que resolve.** Diff pequeno > diff elegante. Nada de abstração "para o futuro".
3. **Sem suposição silenciosa.** Ambiguidade que muda o resultado → pergunte. Ambiguidade pequena → escolha o óbvio e diga qual escolheu.
4. **Não invente API, pacote, flag ou campo.** Confira na doc, no código ou com `--help` antes de usar.

### 2. Verificação (nada está pronto sem prova)
1. Antes de dizer "pronto": rode testes, lint e build relevantes e **mostre o resultado**.
2. Bug corrigido = teste que falhava antes e passa depois.
3. Não diga "deve funcionar". Diga "rodei X, resultado Y" ou "não consegui verificar porque Z".
4. UI: abra no navegador (Playwright/screenshot) antes de entregar.

### 3. Ações perigosas — pedir confirmação antes
- apagar arquivos/pastas fora do que você criou na tarefa
- `git push --force`, `reset --hard`, rebase de branch compartilhada
- migrações destrutivas (drop/alter com perda de dado), rodar contra banco de produção
- instalar dependência nova pesada ou trocar uma biblioteca central
- qualquer coisa que gaste dinheiro (deploy pago, APIs pagas em loop)

### 4. Segredos e dados
1. Nunca escreva chave, token ou senha em código, commit, log ou mensagem. Use `.env` + `.env.example`.
2. Nunca leia/mostre o conteúdo de `.env` sem necessidade; se precisar, mostre só os nomes.
3. Dados pessoais (LGPD): colete o mínimo, não logue, não mande para LLM externo sem o usuário saber.

### 5. Git
1. Trabalhe em branch (`feat/…`, `fix/…`, `chore/…`), nunca direto na `main` em projeto com mais gente.
2. Commits pequenos, Conventional Commits, em português ou inglês — o que o projeto já usa.
3. Um commit = uma intenção. Não misture refatoração com feature.

### 6. Comunicação
1. Respostas curtas: o que fez, o que verificou, o que falta. Sem relatório de cada passo.
2. Ao terminar uma tarefa do plano: atualize `docs/PROGRESSO.md` (feito / próximo / bloqueios).
3. Travou 2× na mesma coisa? Pare, explique o que tentou e pergunte.

### 7. Ordem de prioridade quando houver conflito
segurança > correção > requisitos da SPEC > simplicidade > performance > estética

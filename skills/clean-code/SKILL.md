---
name: clean-code
description: Regras de código limpo e de comportamento do agente ao escrever código — nomes, funções pequenas, early return, tratamento de erros, tipos, comentários, duplicação vs abstração, refatoração segura e as diretrizes Karpathy (sem suposição silenciosa, solução mínima, não mexer no que não foi pedido, verificar). Use sempre que escrever, revisar ou refatorar código em qualquer linguagem, ou quando o usuário pedir "limpa esse código", "refatora", "deixa legível", "clean code".
---

# Clean code

## Diretrizes de comportamento (Karpathy)
1. **Pense antes de codar** — declare suposições; se há duas leituras do pedido, pergunte.
2. **Simplicidade primeiro** — o mínimo de código que resolve. Sem feature, flag ou abstração especulativa.
3. **Mudança cirúrgica** — toque só no necessário. Não "aproveite" para reformatar ou renomear o resto.
4. **Objetivo verificável** — defina como provar que funciona (teste/comando) e prove.

## Nomes
- Revelam intenção: `diasAteVencer`, não `d` / `data2` / `tmp`.
- Booleano como pergunta: `estaAtivo`, `temPermissao`, `podeEditar`.
- Função = verbo: `calcularFrete`, `buscarPedidoPorId`. Classe/tipo = substantivo.
- Mesmo conceito, mesmo nome no projeto inteiro (não alterne `cliente`/`usuario`/`user` para a mesma coisa).
- Idioma: siga o projeto. Misturar `getPedidos` é aceitável se for o padrão existente; não crie um terceiro estilo.

## Funções
- Fazem **uma coisa**; cabem na tela (~30 linhas como alerta, não lei).
- ≤ 3 parâmetros; mais que isso → objeto nomeado.
- **Early return** em vez de `if` aninhado.
- Sem efeito colateral escondido (`validarX` não deve salvar nada).
- Pura quando possível (mesma entrada → mesma saída) — fácil de testar.

## Erros
- Nunca engula: `catch {}` vazio é proibido. Trate, enriqueça com contexto ou propague.
- Falhe cedo e alto na borda (validação); dentro, confie nos tipos.
- Erros de domínio com tipo/nome próprio; mensagens úteis para quem vai depurar.
- Não use exceção para fluxo normal.

## Tipos e dados
- Sem `any` (TS) / tipos crus; modele estados impossíveis como impossíveis (union discriminada > vários booleanos).
- Constantes nomeadas no lugar de números/strings mágicos (`LIMITE_TENTATIVAS = 5`).
- Imutabilidade por padrão (`const`, `readonly`, `record`, `frozen`).

## Duplicação vs abstração
- **Regra de três:** duplicou uma vez, tudo bem; na terceira, extraia.
- Abstração errada custa mais que duplicação. Se a abstração precisa de `if (tipo === …)` para cada uso, desfaça.
- Composição > herança.

## Comentários
- Explique **por quê** (regra de negócio, workaround, link do bug), nunca o quê.
- Código comentado = apague (o git guarda).
- `TODO` só com referência a cartão/issue.

## Estrutura
- Arquivo com uma responsabilidade; > ~300 linhas é sinal para dividir.
- Dependências apontam para dentro (UI → serviço → domínio), nunca o contrário.
- Siga o padrão que o projeto já usa, mesmo que você prefira outro.

## Refatoração segura
1. Garanta testes cobrindo o comportamento atual (escreva se não houver).
2. Passos pequenos, rodando testes a cada um.
3. Refatoração e mudança de comportamento em **commits separados**.
4. Renomear/mover → use a ferramenta do editor/LSP ou busca exaustiva (`rg`), confira todos os usos.

Exemplos antes/depois: `references/exemplos.md`.

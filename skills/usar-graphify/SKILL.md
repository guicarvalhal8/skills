---
name: usar-graphify
description: Como instalar e usar o Graphify (pacote graphifyy) para transformar o repositório — código, schemas SQL, docs, PDFs — num grafo de conhecimento consultável, para o agente navegar pelo grafo em vez de ler arquivo por arquivo (economia de tokens). Use ao entrar num repo existente, antes de perguntas de arquitetura ("o que liga X a Y?", "onde é usado Z?"), depois de mudanças estruturais, ou quando o usuário mencionar "graphify", "grafo", "mapa do código".
---

# Graphify na base

Graphify indexa a pasta num grafo (AST local com tree-sitter para código — sem chamada de LLM; docs/PDF/imagens usam o modelo da sessão). O agente consulta o grafo em vez de dar grep e abrir dezenas de arquivos.

## Instalar (uma vez por máquina)
```bash
uv tool install graphifyy      # atenção: dois "y" no nome do pacote
# ou: pipx install graphifyy
graphify install               # registra a skill /graphify na sua IA (Claude Code, Codex, Cursor, Gemini CLI, Antigravity… — ver --help)
```
Extras por stack quando precisar (ex.: Terraform): `uv tool install "graphifyy[terraform]"`.
Reinicie a IA depois do `graphify install`.

## Usar no projeto
```
/graphify .                                   # constrói o grafo da pasta atual
/graphify query "o que conecta auth ao banco?" # pergunta ao grafo
```
Saída em `graphify-out/`:
- `GRAPH_REPORT.md` — resumo da arquitetura (leia **isto** no início da sessão em vez de explorar o repo)
- `graph.json` — o grafo consultável
- `graph.html` — visualização interativa (abrir no navegador)

## Regras da base
1. **Commite `graphify-out/`** — quem clonar (pessoa ou agente) já tem o mapa sem custo de reconstrução.
2. Rode de novo depois de mudanças estruturais (novo módulo, renomeação grande, nova integração) — é passo do fim de marco no `fluxo-dev`.
3. Ordem de consulta: `GRAPH_REPORT.md` → `/graphify query` → `Grep` dirigido → abrir trecho do arquivo.
4. O grafo pode estar desatualizado: se a resposta do grafo e o código divergirem, o código manda — e reconstrua o grafo.
5. Projeto vazio: só rode depois do primeiro scaffold.
6. Não indexe segredos: confira que `.env` e dados reais estão fora (gitignore) antes de rodar em pasta com documentos.

Comandos e flags mudam entre versões: `graphify --help` antes de usar algo além do básico.

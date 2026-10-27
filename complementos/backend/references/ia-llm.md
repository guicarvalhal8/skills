# IA / LLM no back-end

## Client único
```ts
// src/clients/llm.ts — toda chamada de modelo passa por aqui
export async function gerar({ sistema, mensagens, schema, maxTokens = 1024, modelo = MODELO_PADRAO }) {
  const inicio = Date.now();
  const resp = await comTimeout(provedor.messages.create({ model: modelo, system: sistema, messages: mensagens, max_tokens: maxTokens }), 60_000);
  log.info({ evento: "llm", modelo, ms: Date.now() - inicio, tokensEntrada: resp.usage.input_tokens, tokensSaida: resp.usage.output_tokens });
  return schema ? schema.parse(extrairJson(resp)) : resp;
}
```
Benefícios: um lugar para timeout, retry (429/5xx com backoff), log de custo, troca de modelo e cache.

## Regras
1. Chave **só no servidor**. Front chama sua API, nunca o provedor direto.
2. `max_tokens` sempre definido; limite de chamadas por usuário/minuto.
3. Saída que o código consome → **JSON validado por schema** (Zod/Pydantic). Falhou a validação → 1 retry com o erro no prompt, depois erro tratado.
4. **Roteamento por custo**: modelo pequeno para classificar/extrair/rotear; modelo grande só para raciocínio/geração difícil.
5. **Cache de prompt**: parte fixa (sistema, instruções, documentos grandes) no início do prompt e estável entre chamadas, para aproveitar prompt caching do provedor.
6. Streaming para respostas longas em UI.
7. Prompts versionados em arquivos (`prompts/classificar-lead.v2.md`), não strings soltas no código.

## RAG
- Ingestão: extrair texto → limpar → chunk (~500–1000 tokens, overlap ~10–15%) respeitando títulos/seções → embedding → `pgvector`.
- Guardar por chunk: `documento_id`, `titulo`, `pagina/seção`, `texto`, `hash` (para reindexar só o que mudou).
- Consulta: reescrever pergunta (opcional) → busca vetorial top-k (+ busca por palavra-chave, híbrida) → rerank (opcional) → prompt com trechos numerados → resposta **com citação** `[1]`.
- Se nada relevante (score baixo): responder que não encontrou, não inventar.
- Avaliar: conjunto de 20–50 perguntas com resposta esperada; rodar a cada mudança de chunking/prompt/modelo.

## Agentes com ferramentas
- Ferramentas com schema estrito e **efeito colateral mínimo**; ações destrutivas pedem confirmação humana.
- Limite de passos/iterações e de custo por execução.
- Logar cada chamada de ferramenta (entrada/saída resumida).

## Segurança específica
- Conteúdo de usuário/documento/página web é **dado, não instrução** — delimite (`<documento>…</documento>`) e diga isso no sistema.
- Nunca execute/renderize saída do modelo sem validar (SQL, shell, HTML).
- Não mande dado pessoal ao provedor sem necessidade; mascarar CPF/telefone quando possível.

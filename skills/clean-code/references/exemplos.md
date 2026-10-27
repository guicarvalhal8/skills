# Clean code — antes e depois

## Early return
```ts
// antes
function podeComprar(u?: Usuario) {
  if (u) {
    if (u.ativo) {
      if (u.saldo > 0) return true;
    }
  }
  return false;
}
// depois
function podeComprar(u?: Usuario) {
  if (!u?.ativo) return false;
  return u.saldo > 0;
}
```

## Estados impossíveis
```ts
// antes: 4 combinações, 2 são inválidas
type Req = { carregando: boolean; erro?: string; dados?: Pedido[] };
// depois
type Req =
  | { status: "carregando" }
  | { status: "erro"; erro: string }
  | { status: "ok"; dados: Pedido[] };
```

## Parâmetros demais
```ts
// antes
criarPedido(clienteId, itens, true, false, "pix", null);
// depois
criarPedido({ clienteId, itens, entrega: true, pagamento: "pix" });
```

## Erro engolido
```ts
// antes
try { await enviarWhatsApp(msg); } catch {}
// depois
try {
  await enviarWhatsApp(msg);
} catch (e) {
  log.error({ evento: "whatsapp_falhou", pedidoId, erro: String(e) });
  throw new FalhaNotificacao("WhatsApp indisponível", { cause: e });
}
```

## Número mágico
```py
# antes
if tentativas > 5: bloquear(usuario, 900)
# depois
MAX_TENTATIVAS = 5
BLOQUEIO_SEGUNDOS = 15 * 60
if tentativas > MAX_TENTATIVAS: bloquear(usuario, BLOQUEIO_SEGUNDOS)
```

## Abstração prematura
```ts
// antes: "genérico" para um único uso
class GerenciadorDeEntidades<T> { /* 120 linhas */ }
const pedidos = new GerenciadorDeEntidades<Pedido>(config);
// depois: o que é usado
export const listarPedidos = (donoId: string) => db.pedido.findMany({ where: { donoId } });
```

## Java — DTO e serviço
```java
// antes: controller com regra e entidade exposta
@PostMapping public Pedido criar(@RequestBody Pedido p) { if (p.getItens().isEmpty()) throw ...; return repo.save(p); }
// depois
public record CriarPedidoRequest(@NotEmpty List<ItemRequest> itens) {}
@PostMapping public ResponseEntity<PedidoResponse> criar(@Valid @RequestBody CriarPedidoRequest req) {
  var pedido = service.criar(req);
  return ResponseEntity.created(URI.create("/pedidos/" + pedido.id())).body(pedido);
}
```

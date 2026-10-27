#!/usr/bin/env bash
# Instala as skills e os agentes do skills-base no Claude Code.
#   ./install.sh            -> links simbólicos (git pull atualiza tudo)
#   ./install.sh --copy     -> copia os arquivos
#   ./install.sh --projeto  -> instala só no projeto atual (./.claude) em vez do global (~/.claude)
#   ./install.sh --remover  -> remove o que este script instalou
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODO="link"
DESTINO="$HOME/.claude"
REMOVER=0

for arg in "$@"; do
  case "$arg" in
    --copy|--copiar) MODO="copy" ;;
    --projeto) DESTINO="$(pwd)/.claude" ;;
    --remover|--uninstall) REMOVER=1 ;;
    -h|--help) sed -n '2,7p' "$0"; exit 0 ;;
    *) echo "Opção desconhecida: $arg"; exit 1 ;;
  esac
done

mkdir -p "$DESTINO/skills" "$DESTINO/agents"

instalar() { # origem destino
  local origem="$1" alvo="$2"
  if [ -e "$alvo" ] || [ -L "$alvo" ]; then
    if [ -L "$alvo" ] || [ "$MODO" = "copy" ]; then rm -rf "$alvo"
    else echo "  ! $alvo já existe e não é link — pulando (apague ou use --copy)"; return; fi
  fi
  if [ "$MODO" = "copy" ]; then cp -R "$origem" "$alvo"; else ln -s "$origem" "$alvo"; fi
  echo "  + $(basename "$alvo")"
}

if [ "$REMOVER" = 1 ]; then
  for d in "$REPO"/skills/*/; do rm -rf "$DESTINO/skills/$(basename "$d")"; done
  for f in "$REPO"/agents/*.md; do rm -f "$DESTINO/agents/$(basename "$f")"; done
  rm -f "$DESTINO/.skills-base-path"
  echo "Removido de $DESTINO"; exit 0
fi

echo "Skills -> $DESTINO/skills ($MODO)"
for d in "$REPO"/skills/*/; do
  d="${d%/}"; instalar "$d" "$DESTINO/skills/$(basename "$d")"
done

echo "Agentes -> $DESTINO/agents ($MODO)"
for f in "$REPO"/agents/*.md; do
  instalar "$f" "$DESTINO/agents/$(basename "$f")"
done

echo "$REPO" > "$DESTINO/.skills-base-path"
echo "Caminho do repo salvo em $DESTINO/.skills-base-path"

echo
echo "Dependências:"
command -v graphify >/dev/null 2>&1 && echo "  ✓ graphify" || echo "  ✗ graphify  -> uv tool install graphifyy && graphify install"
echo "  ? superpowers -> no Claude Code: /plugin marketplace add obra/superpowers-marketplace"
echo "                                  /plugin install superpowers@superpowers-marketplace"
echo
echo "Pronto. Reinicie o Claude Code e rode /iniciar-projeto num projeto novo."

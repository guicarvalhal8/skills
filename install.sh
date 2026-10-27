#!/usr/bin/env bash
# Instala as skills (padrão aberto Agent Skills / SKILL.md) em todas as IAs encontradas na máquina.
#   ./install.sh                     -> detecta as ferramentas e cria links simbólicos (git pull atualiza tudo)
#   ./install.sh --copy              -> copia em vez de linkar
#   ./install.sh --projeto           -> instala no projeto atual (./.agents/skills, ./.claude/skills) em vez do global
#   ./install.sh --alvos agents,claude,antigravity,cursor,copilot   -> força os destinos
#   ./install.sh --remover           -> remove o que este script instalou
#
# Destinos:
#   agents       ~/.agents/skills              Codex, Gemini CLI, Antigravity 2.0 e outras (padrão universal) — sempre
#   claude       ~/.claude/skills (+ agents)   Claude Code
#   antigravity  ~/.gemini/antigravity/skills  Antigravity IDE (versões antigas)
#   cursor       ~/.cursor/skills              Cursor
#   copilot      ~/.copilot/skills             GitHub Copilot
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODO="link"; RAIZ="$HOME"; REMOVER=0; ALVOS=""

while [ $# -gt 0 ]; do
  case "$1" in
    --copy|--copiar) MODO="copy" ;;
    --projeto) RAIZ="$(pwd)" ;;
    --remover|--uninstall) REMOVER=1 ;;
    --alvos) shift; ALVOS="${1:-}" ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "Opção desconhecida: $1"; exit 1 ;;
  esac
  shift
done

# --- detectar destinos ---
if [ -z "$ALVOS" ]; then
  ALVOS="agents"
  { [ -d "$HOME/.claude" ] || command -v claude >/dev/null 2>&1; } && ALVOS="$ALVOS,claude"
  [ -d "$HOME/.gemini/antigravity" ] && ALVOS="$ALVOS,antigravity"
  { [ -d "$HOME/.cursor" ] || command -v cursor >/dev/null 2>&1; } && ALVOS="$ALVOS,cursor"
  [ -d "$HOME/.copilot" ] && ALVOS="$ALVOS,copilot"
fi

pasta_skills() {
  case "$1" in
    agents) echo "$RAIZ/.agents/skills" ;;
    claude) echo "$RAIZ/.claude/skills" ;;
    antigravity) [ "$RAIZ" = "$HOME" ] && echo "$HOME/.gemini/antigravity/skills" || echo "$RAIZ/.agent/skills" ;;
    cursor) echo "$RAIZ/.cursor/skills" ;;
    copilot) [ "$RAIZ" = "$HOME" ] && echo "$HOME/.copilot/skills" || echo "$RAIZ/.github/skills" ;;
    *) echo "" ;;
  esac
}

instalar() { # origem alvo
  local origem="$1" alvo="$2"
  if [ -e "$alvo" ] || [ -L "$alvo" ]; then
    if [ -L "$alvo" ] || [ "$MODO" = "copy" ]; then rm -rf "$alvo"
    else echo "    ! $(basename "$alvo") já existe e não é link — pulando"; return; fi
  fi
  if [ "$MODO" = "copy" ]; then cp -R "$origem" "$alvo"; else ln -s "$origem" "$alvo"; fi
}

IFS=',' read -ra LISTA <<< "$ALVOS"
for alvo in "${LISTA[@]}"; do
  dst="$(pasta_skills "$alvo")"
  [ -z "$dst" ] && { echo "Alvo desconhecido: $alvo"; continue; }
  if [ "$REMOVER" = 1 ]; then
    for d in "$REPO"/skills/*/; do rm -rf "$dst/$(basename "$d")"; done
    [ "$alvo" = "claude" ] && for f in "$REPO"/agents/*.md; do rm -f "$RAIZ/.claude/agents/$(basename "$f")"; done
    echo "- $alvo: removido de $dst"; continue
  fi
  mkdir -p "$dst"
  n=0; for d in "$REPO"/skills/*/; do d="${d%/}"; instalar "$d" "$dst/$(basename "$d")"; n=$((n+1)); done
  echo "+ $alvo: $n skills -> $dst ($MODO)"
  if [ "$alvo" = "claude" ]; then  # subagentes no formato do Claude Code
    mkdir -p "$RAIZ/.claude/agents"
    for f in "$REPO"/agents/*.md; do instalar "$f" "$RAIZ/.claude/agents/$(basename "$f")"; done
    echo "+ claude: agentes -> $RAIZ/.claude/agents"
  fi
done

if [ "$REMOVER" = 1 ]; then rm -f "$RAIZ/.agents/.skills-base-path"; exit 0; fi

mkdir -p "$RAIZ/.agents"
echo "$REPO" > "$RAIZ/.agents/.skills-base-path"
echo "Caminho do repo salvo em $RAIZ/.agents/.skills-base-path"

echo
echo "Dependências (opcionais):"
command -v graphify >/dev/null 2>&1 && echo "  ✓ graphify" || echo "  ✗ graphify    -> uv tool install graphifyy && graphify install"
echo "  ? superpowers -> npx skills add obra/superpowers   (Claude Code: /plugin install superpowers@superpowers-marketplace)"
echo
echo "Pronto. Reinicie sua IA e peça: \"use a skill iniciar-projeto\" (ou /iniciar-projeto)."

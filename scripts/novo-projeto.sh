#!/usr/bin/env bash
# Copia o template de projeto para uma pasta (nova ou existente) sem sobrescrever nada.
#   scripts/novo-projeto.sh <pasta-do-projeto> [nome-do-projeto]
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ALVO="${1:?uso: novo-projeto.sh <pasta> [nome]}"
NOME="${2:-$(basename "$ALVO")}"
TEMPLATE="$REPO/templates/projeto"

mkdir -p "$ALVO"
cd "$TEMPLATE"
find . -type f | while read -r arq; do
  destino="$ALVO/${arq#./}"
  if [ -e "$destino" ]; then echo "  = mantido  ${arq#./}"; continue; fi
  mkdir -p "$(dirname "$destino")"
  sed "s/{{NOME_PROJETO}}/$NOME/g; s/{{DATA}}/$(date +%Y-%m-%d)/g" "$arq" > "$destino"
  echo "  + criado   ${arq#./}"
done

cd "$ALVO"
[ -d .git ] || { git init -q && echo "  + git init"; }
echo
echo "Template aplicado em $ALVO. Próximo passo: abra o Claude Code ali e rode /iniciar-projeto"

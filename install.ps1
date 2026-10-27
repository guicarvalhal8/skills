# Instala as skills e os agentes do skills-base no Claude Code (Windows).
#   .\install.ps1             -> junctions/links (git pull atualiza tudo, sem admin)
#   .\install.ps1 -Copiar     -> copia os arquivos
#   .\install.ps1 -Projeto    -> instala em .\.claude do diretório atual
#   .\install.ps1 -Remover    -> remove o que foi instalado
param([switch]$Copiar, [switch]$Projeto, [switch]$Remover)
$ErrorActionPreference = "Stop"

$Repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$Destino = if ($Projeto) { Join-Path (Get-Location) ".claude" } else { Join-Path $HOME ".claude" }
$SkillsDst = Join-Path $Destino "skills"
$AgentsDst = Join-Path $Destino "agents"
New-Item -ItemType Directory -Force -Path $SkillsDst, $AgentsDst | Out-Null

if ($Remover) {
  Get-ChildItem (Join-Path $Repo "skills") -Directory | ForEach-Object {
    $a = Join-Path $SkillsDst $_.Name; if (Test-Path $a) { Remove-Item $a -Recurse -Force } }
  Get-ChildItem (Join-Path $Repo "agents") -Filter *.md | ForEach-Object {
    $a = Join-Path $AgentsDst $_.Name; if (Test-Path $a) { Remove-Item $a -Force } }
  Remove-Item (Join-Path $Destino ".skills-base-path") -ErrorAction SilentlyContinue
  Write-Host "Removido de $Destino"; exit 0
}

Write-Host "Skills -> $SkillsDst"
Get-ChildItem (Join-Path $Repo "skills") -Directory | ForEach-Object {
  $alvo = Join-Path $SkillsDst $_.Name
  if (Test-Path $alvo) { Remove-Item $alvo -Recurse -Force }
  if ($Copiar) { Copy-Item $_.FullName $alvo -Recurse }
  else { New-Item -ItemType Junction -Path $alvo -Target $_.FullName | Out-Null }
  Write-Host "  + $($_.Name)"
}

Write-Host "Agentes -> $AgentsDst"
Get-ChildItem (Join-Path $Repo "agents") -Filter *.md | ForEach-Object {
  $src = $_.FullName
  $alvo = Join-Path $AgentsDst $_.Name
  if (Test-Path $alvo) { Remove-Item $alvo -Force }
  if ($Copiar) { Copy-Item $src $alvo }
  else {
    try { New-Item -ItemType HardLink -Path $alvo -Target $src | Out-Null }
    catch { Copy-Item $src $alvo }
  }
  Write-Host "  + $($_.Name)"
}

Set-Content -Path (Join-Path $Destino ".skills-base-path") -Value $Repo -NoNewline
Write-Host "Caminho do repo salvo em $Destino\.skills-base-path"
Write-Host ""
if (Get-Command graphify -ErrorAction SilentlyContinue) { Write-Host "  OK graphify" }
else { Write-Host "  X graphify  -> uv tool install graphifyy; graphify install" }
Write-Host "  ? superpowers -> no Claude Code: /plugin marketplace add obra/superpowers-marketplace"
Write-Host "                                  /plugin install superpowers@superpowers-marketplace"
Write-Host ""
Write-Host "Pronto. Reinicie o Claude Code e rode /iniciar-projeto num projeto novo."

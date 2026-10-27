# Instala as skills (padrão aberto Agent Skills / SKILL.md) em todas as IAs encontradas (Windows).
#   .\install.ps1                         -> detecta as ferramentas e cria junctions (git pull atualiza tudo, sem admin)
#   .\install.ps1 -Copiar                 -> copia em vez de linkar
#   .\install.ps1 -Projeto                -> instala no projeto atual em vez do global
#   .\install.ps1 -Alvos agents,claude    -> força os destinos (agents, claude, antigravity, cursor, copilot)
#   .\install.ps1 -Remover                -> remove o que foi instalado
param([switch]$Copiar, [switch]$Projeto, [switch]$Remover, [string[]]$Alvos)
$ErrorActionPreference = "Stop"

$Repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$Raiz = if ($Projeto) { (Get-Location).Path } else { $HOME }

if (-not $Alvos) {
  $Alvos = @("agents")
  if ((Test-Path "$HOME\.claude") -or (Get-Command claude -ErrorAction SilentlyContinue)) { $Alvos += "claude" }
  if (Test-Path "$HOME\.gemini\antigravity") { $Alvos += "antigravity" }
  if ((Test-Path "$HOME\.cursor") -or (Get-Command cursor -ErrorAction SilentlyContinue)) { $Alvos += "cursor" }
  if (Test-Path "$HOME\.copilot") { $Alvos += "copilot" }
}

function PastaSkills($alvo) {
  $global = ($Raiz -eq $HOME)
  switch ($alvo) {
    "agents"      { return Join-Path $Raiz ".agents\skills" }
    "claude"      { return Join-Path $Raiz ".claude\skills" }
    "antigravity" { if ($global) { return "$HOME\.gemini\antigravity\skills" } else { return Join-Path $Raiz ".agent\skills" } }
    "cursor"      { return Join-Path $Raiz ".cursor\skills" }
    "copilot"     { if ($global) { return "$HOME\.copilot\skills" } else { return Join-Path $Raiz ".github\skills" } }
    default       { return $null }
  }
}

function Instalar($origem, $alvo, [switch]$Arquivo) {
  if (Test-Path $alvo) { Remove-Item $alvo -Recurse -Force }
  if ($Copiar) { Copy-Item $origem $alvo -Recurse; return }
  if ($Arquivo) {
    try { New-Item -ItemType HardLink -Path $alvo -Target $origem | Out-Null } catch { Copy-Item $origem $alvo }
  } else {
    New-Item -ItemType Junction -Path $alvo -Target $origem | Out-Null
  }
}

$skills = Get-ChildItem (Join-Path $Repo "skills") -Directory
$agentes = Get-ChildItem (Join-Path $Repo "agents") -Filter *.md

foreach ($alvo in $Alvos) {
  $dst = PastaSkills $alvo
  if (-not $dst) { Write-Host "Alvo desconhecido: $alvo"; continue }
  if ($Remover) {
    foreach ($s in $skills) { $p = Join-Path $dst $s.Name; if (Test-Path $p) { Remove-Item $p -Recurse -Force } }
    if ($alvo -eq "claude") { foreach ($a in $agentes) { $p = Join-Path $Raiz ".claude\agents\$($a.Name)"; if (Test-Path $p) { Remove-Item $p -Force } } }
    Write-Host "- ${alvo}: removido de $dst"; continue
  }
  New-Item -ItemType Directory -Force -Path $dst | Out-Null
  foreach ($s in $skills) { Instalar $s.FullName (Join-Path $dst $s.Name) }
  Write-Host "+ ${alvo}: $($skills.Count) skills -> $dst"
  if ($alvo -eq "claude") {
    $agDst = Join-Path $Raiz ".claude\agents"
    New-Item -ItemType Directory -Force -Path $agDst | Out-Null
    foreach ($a in $agentes) { Instalar $a.FullName (Join-Path $agDst $a.Name) -Arquivo }
    Write-Host "+ claude: agentes -> $agDst"
  }
}

$pathFile = Join-Path $Raiz ".agents\.skills-base-path"
if ($Remover) { Remove-Item $pathFile -ErrorAction SilentlyContinue; exit 0 }
New-Item -ItemType Directory -Force -Path (Join-Path $Raiz ".agents") | Out-Null
Set-Content -Path $pathFile -Value $Repo -NoNewline
Write-Host "Caminho do repo salvo em $pathFile"
Write-Host ""
if (Get-Command graphify -ErrorAction SilentlyContinue) { Write-Host "  OK graphify" }
else { Write-Host "  X graphify    -> uv tool install graphifyy; graphify install" }
Write-Host "  ? superpowers -> npx skills add obra/superpowers   (Claude Code: /plugin install superpowers@superpowers-marketplace)"
Write-Host ""
Write-Host "Pronto. Reinicie sua IA e peça: 'use a skill iniciar-projeto' (ou /iniciar-projeto)."

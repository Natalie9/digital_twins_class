param(
  [switch]$OpenHotspotSettings,
  [switch]$EnableTailscaleServe
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $projectDir

Write-Host "== Gêmeos Digitais: servidor de apresentação ==" -ForegroundColor Cyan
Write-Host "Projeto: $projectDir"

Write-Host "\n[1/4] Subindo serviço web Docker na porta 8080..." -ForegroundColor Yellow
docker compose up -d web | Out-Host

Write-Host "\n[2/4] Testando porta local 8080..." -ForegroundColor Yellow
$test = Test-NetConnection -ComputerName 127.0.0.1 -Port 8080 -WarningAction SilentlyContinue
if ($test.TcpTestSucceeded) {
  Write-Host "OK: http://localhost:8080 está respondendo." -ForegroundColor Green
} else {
  Write-Host "ERRO: porta 8080 não respondeu localmente." -ForegroundColor Red
}

Write-Host "\n[3/4] Liberando firewall, se este PowerShell estiver como Administrador..." -ForegroundColor Yellow
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
  foreach ($port in 8080, 8501) {
    $ruleName = "GD Demos TCP $port"
    $existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    if (-not $existing) {
      New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort $port -Profile Any | Out-Null
      Write-Host "Firewall liberado: TCP $port" -ForegroundColor Green
    } else {
      Write-Host "Firewall já tinha regra: TCP $port" -ForegroundColor Green
    }
  }
} else {
  Write-Host "Aviso: não está como Administrador. Se o celular não acessar, rode este script como Admin ou libere TCP 8080 no Firewall." -ForegroundColor Yellow
}

Write-Host "\n[4/4] Endereços possíveis para acessar no celular:" -ForegroundColor Yellow
$ips = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike "169.254*" -and $_.IPAddress -ne "127.0.0.1" } |
  Sort-Object InterfaceAlias

foreach ($ip in $ips) {
  Write-Host ("- {0}: http://{1}:8080" -f $ip.InterfaceAlias, $ip.IPAddress) -ForegroundColor White
}

Write-Host "\nRecomendado para Wi-Fi local:" -ForegroundColor Cyan
Write-Host "1. Ative o Hotspot Móvel do Windows."
Write-Host "2. Conecte o celular/tablet nessa rede Wi-Fi."
Write-Host "3. No celular, teste primeiro o IP da interface Wi-Fi mostrado acima."
Write-Host "4. Se o Windows usar o IP padrão do hotspot, tente também: http://192.168.137.1:8080"

if ($OpenHotspotSettings) {
  Write-Host "\nAbrindo configurações de Hotspot Móvel..." -ForegroundColor Cyan
  Start-Process "ms-settings:network-mobilehotspot"
}

if ($EnableTailscaleServe) {
  Write-Host "\nAtivando Tailscale Serve para HTTPS interno da tailnet..." -ForegroundColor Cyan
  tailscale serve --bg 8080 | Out-Host
  tailscale serve status | Out-Host
}

Write-Host "\nLinks úteis:" -ForegroundColor Cyan
Write-Host "- Home: /"
Write-Host "- Slides: /slides/"
Write-Host "- Chart.js: /chartjs/"
Write-Host "- D3.js: /d3/"
Write-Host "- p5.js: /p5/"
Write-Host "- Leaflet: /leaflet/"
Write-Host "\nObservação: a demo 8th Wall/câmera no celular pode exigir HTTPS. Para ela, prefira Tailscale Serve com -EnableTailscaleServe."

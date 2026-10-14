# Agro Based India — one-shot local setup (Windows)
# Run from PowerShell:  Set-ExecutionPolicy -Scope Process Bypass; .\setup-and-run.ps1

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

function Ensure-Node {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if ($node) { return $node.Source }
  Write-Step "Node.js not found. Installing Node.js LTS via winget (you may get a UAC prompt)..."
  winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --disable-interactivity
  $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
    [Environment]::GetEnvironmentVariable("Path", "User")
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) {
    throw "Node still not on PATH. Close this window, open a new PowerShell, and run this script again."
  }
  return $node.Source
}

function Ensure-PostgresUrl {
  $envFile = Join-Path $Backend ".env"
  if (Test-Path $envFile) {
    Write-Step "Using existing backend\.env"
    return
  }
  Copy-Item (Join-Path $Backend ".env.example") $envFile
  $defaultUrl = "postgresql://postgres:postgres@localhost:5432/agro_bihar?schema=public"
  (Get-Content $envFile) -replace 'DATABASE_URL=.*', "DATABASE_URL=`"$defaultUrl`"" | Set-Content $envFile
  Write-Host "Created backend\.env with default DATABASE_URL:"
  Write-Host "  $defaultUrl"
  Write-Host "Change password/user if your PostgreSQL differs."
  Write-Host "If PostgreSQL is not installed, install it (winget install PostgreSQL.PostgreSQL) and create DB agro_bihar."
}

Ensure-Node | Out-Null
Ensure-PostgresUrl

Write-Step "Installing backend dependencies"
Push-Location $Backend
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed in backend" }

Write-Step "Applying database schema"
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) {
  Write-Host "migrate deploy failed — trying prisma db push (fresh DB)..." -ForegroundColor Yellow
  npx prisma db push
}
Write-Step "Seeding Bihar data"
npm run db:seed
Pop-Location

Write-Step "Installing frontend dependencies"
Push-Location $Frontend
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed in frontend" }
Pop-Location

Write-Step "Starting servers (two windows)"
$backendCmd = "Set-Location '$Backend'; npm run dev"
$frontendCmd = "Set-Location '$Frontend'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd

Write-Host "`nDone. Open http://localhost:5173 in your browser." -ForegroundColor Green
Write-Host "API: http://localhost:4000/api/health"

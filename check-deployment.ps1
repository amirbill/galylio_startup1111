# PowerShell script to check deployment readiness for Netlify

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Netlify Deployment Readiness Check" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$allChecks = $true

# Check if we're in the front directory
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] package.json not found. Please run this script from the 'front' directory." -ForegroundColor Red
    exit 1
}

Write-Host "[1/8] Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion) {
    Write-Host "  ✓ Node.js $nodeVersion installed" -ForegroundColor Green
    $majorVersion = [int]($nodeVersion -replace 'v|\..*', '')
    if ($majorVersion -lt 18) {
        Write-Host "  ⚠ Warning: Node.js 18+ recommended for Next.js 16" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✗ Node.js not found" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""
Write-Host "[2/8] Checking required files..." -ForegroundColor Yellow

$requiredFiles = @(
    "package.json",
    "next.config.ts",
    "netlify.toml",
    ".env.example"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file missing" -ForegroundColor Red
        $allChecks = $false
    }
}

Write-Host ""
Write-Host "[3/8] Checking node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[4/8] Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "  ✓ .env.local exists (will be ignored by Git)" -ForegroundColor Green
    Write-Host "  ℹ Remember to set these in Netlify dashboard" -ForegroundColor Cyan
} else {
    Write-Host "  ℹ No .env.local file (optional for development)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "[5/8] Testing local build..." -ForegroundColor Yellow
Write-Host "  Running: npm run build" -ForegroundColor Gray

$buildOutput = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build successful" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build failed. Check errors above." -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""
Write-Host "[6/8] Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status 2>&1
if ($gitStatus -match "fatal") {
    Write-Host "  ⚠ Not a Git repository" -ForegroundColor Yellow
    Write-Host "    Initialize with: git init" -ForegroundColor Gray
} else {
    Write-Host "  ✓ Git repository initialized" -ForegroundColor Green
    
    $hasUncommitted = git status --porcelain 2>&1
    if ($hasUncommitted) {
        Write-Host "  ℹ You have uncommitted changes" -ForegroundColor Cyan
        Write-Host "    Commit before deploying" -ForegroundColor Gray
    } else {
        Write-Host "  ✓ Working directory clean" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "[7/8] Checking backend connectivity..." -ForegroundColor Yellow
$backendUrl = "https://back-27em.onrender.com/api/v1/health"
try {
    $response = Invoke-WebRequest -Uri $backendUrl -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Backend is accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ Could not reach backend at $backendUrl" -ForegroundColor Yellow
    Write-Host "    This may cause issues with API calls" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[8/8] Checking Netlify CLI..." -ForegroundColor Yellow
$netlifyCliVersion = netlify --version 2>&1
if ($netlifyCliVersion -match "netlify-cli") {
    Write-Host "  ✓ Netlify CLI installed ($netlifyCliVersion)" -ForegroundColor Green
} else {
    Write-Host "  ℹ Netlify CLI not installed (optional)" -ForegroundColor Cyan
    Write-Host "    Install with: npm install -g netlify-cli" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
if ($allChecks) {
    Write-Host "  ✓ Ready for deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Push your code to Git" -ForegroundColor White
    Write-Host "  2. Connect repository to Netlify" -ForegroundColor White
    Write-Host "  3. Set environment variables in Netlify" -ForegroundColor White
    Write-Host "  4. Deploy!" -ForegroundColor White
    Write-Host ""
    Write-Host "See NETLIFY_DEPLOYMENT.md for detailed instructions" -ForegroundColor Gray
} else {
    Write-Host "  ⚠ Some checks failed" -ForegroundColor Yellow
    Write-Host "  Please fix the issues above before deploying" -ForegroundColor Yellow
}
Write-Host "=====================================" -ForegroundColor Cyan

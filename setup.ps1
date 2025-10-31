# Sora Video Studio - Local Setup and Testing Script
# Run this script in PowerShell to verify everything is working

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Sora Video Studio - Local Setup & Testing" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
    $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($versionNumber -lt 18) {
        Write-Host "⚠ Warning: Node.js 18+ is recommended. Current: $nodeVersion" -ForegroundColor Red
    }
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 20+" -ForegroundColor Red
    exit 1
}

# Check if .env.local exists
Write-Host ""
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local file found" -ForegroundColor Green
    
    # Check if API key is set
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "OPENAI_API_KEY=sk-") {
        Write-Host "✓ OPENAI_API_KEY is configured" -ForegroundColor Green
        
        # Security warning
        if ($envContent -match "sk-svcacct-DjyHKsB_XNfMYsJHATBKMf9o") {
            Write-Host ""
            Write-Host "⚠ SECURITY WARNING!" -ForegroundColor Red
            Write-Host "The API key in .env.local was exposed in a chat." -ForegroundColor Red
            Write-Host "Please rotate this key before deployment:" -ForegroundColor Red
            Write-Host "1. Go to https://platform.openai.com/api-keys" -ForegroundColor Yellow
            Write-Host "2. Revoke the old key" -ForegroundColor Yellow
            Write-Host "3. Create a new key" -ForegroundColor Yellow
            Write-Host "4. Update .env.local with the new key" -ForegroundColor Yellow
            Write-Host ""
        }
    } else {
        Write-Host "✗ OPENAI_API_KEY not properly configured in .env.local" -ForegroundColor Red
        Write-Host "Please add your OpenAI API key to .env.local" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ .env.local file not found" -ForegroundColor Red
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✓ Created .env.local - Please add your OpenAI API key" -ForegroundColor Green
}

# Check if node_modules exists
Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Dependencies not installed" -ForegroundColor Yellow
    Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Run build test
Write-Host ""
Write-Host "Testing build..." -ForegroundColor Yellow
Write-Host "This may take a minute..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful" -ForegroundColor Green
} else {
    Write-Host "✗ Build failed - please check errors above" -ForegroundColor Red
    exit 1
}

# Final summary
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Setup Complete! ✓" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review QUICK_START.md for fastest deployment" -ForegroundColor White
Write-Host "2. Or run locally: npm run dev" -ForegroundColor White
Write-Host "3. Or deploy to Vercel (recommended)" -ForegroundColor White
Write-Host ""
Write-Host "To start development server:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start production server:" -ForegroundColor Yellow
Write-Host "  npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the app at:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "For deployment help, see:" -ForegroundColor Yellow
Write-Host "  - QUICK_START.md (fastest option)" -ForegroundColor White
Write-Host "  - DEPLOYMENT_GUIDE.md (all options)" -ForegroundColor White
Write-Host ""

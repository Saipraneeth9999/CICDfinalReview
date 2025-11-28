# Budget Planner - Backend Setup Script
# This script adds Maven to PATH and runs the Spring Boot backend

Write-Host "=== Budget Planner Backend Setup ===" -ForegroundColor Cyan

# Add Maven to PATH for this session
$env:Path += ";C:\Program Files\apache-maven-3.9.9\bin"
Write-Host "✓ Maven added to PATH" -ForegroundColor Green

# Check Maven version
Write-Host "`nMaven version:" -ForegroundColor Yellow
mvn --version

Write-Host "`n=== Prerequisites Check ===" -ForegroundColor Cyan

# Check if PostgreSQL is running
Write-Host "`nChecking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgService) {
        Write-Host "✓ PostgreSQL service found: $($pgService.Name) - Status: $($pgService.Status)" -ForegroundColor Green
        if ($pgService.Status -ne "Running") {
            Write-Host "⚠ PostgreSQL is not running. Please start it first." -ForegroundColor Red
        }
    } else {
        Write-Host "⚠ PostgreSQL service not found. Please ensure PostgreSQL is installed and running." -ForegroundColor Red
        Write-Host "  You can install PostgreSQL from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Could not check PostgreSQL status" -ForegroundColor Red
}

# Check if Redis is running (optional)
Write-Host "`nChecking Redis..." -ForegroundColor Yellow
try {
    $redisService = Get-Service -Name "Redis" -ErrorAction SilentlyContinue
    if ($redisService) {
        Write-Host "✓ Redis service found - Status: $($redisService.Status)" -ForegroundColor Green
    } else {
        Write-Host "⚠ Redis service not found (optional - app will work without it)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Redis not installed (optional)" -ForegroundColor Yellow
}

Write-Host "`n=== Database Setup ===" -ForegroundColor Cyan
Write-Host "Make sure you have created a PostgreSQL database named 'budgetplanner'" -ForegroundColor Yellow
Write-Host "You can create it with: CREATE DATABASE budgetplanner;" -ForegroundColor Gray

Write-Host "`n=== Starting Backend ===" -ForegroundColor Cyan
Write-Host "Running: mvn spring-boot:run" -ForegroundColor Yellow
Write-Host "This will take a few minutes on first run..." -ForegroundColor Gray

# Navigate to backend directory and run
Set-Location -Path "c:\Users\Sai Praneeth\Desktop\Budget Planner\backend"
mvn spring-boot:run

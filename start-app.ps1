Write-Host "Starting ContactSync Application..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Compiling project to ensure MapStruct classes are generated..." -ForegroundColor Yellow
mvn compile -q
if ($LASTEXITCODE -ne 0) {
    Write-Host "Compilation failed!" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}
Write-Host "Compilation successful!" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host ""
mvn spring-boot:run 
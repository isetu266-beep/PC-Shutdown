@echo off
setlocal
title Windows PC Auto Shutdown Timer - Desktop Software Builder (.EXE)
color 0b

echo ===============================================================================
echo        Windows PC Auto Shutdown Timer - Desktop Software (.EXE) Builder
echo ===============================================================================
echo.

:: Step 1: Ensure working directory is the script folder
cd /d "%~dp0"
echo [1/5] Working Folder: %CD%
echo.

:: Step 2: Check Node.js / Bun environment
echo [2/5] Checking environment (Node.js / npm)...

set HAS_NODE=0
set HAS_BUN=0

where bun >nul 2>&1
if %ERRORLEVEL% EQU 0 set HAS_BUN=1

where node >nul 2>&1
if %ERRORLEVEL% EQU 0 set HAS_NODE=1

if %HAS_NODE% EQU 0 if %HAS_BUN% EQU 0 goto ERR_NO_NODE

if %HAS_NODE% EQU 1 (
    for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
    echo   [OK] Node.js detected: %NODE_VER%
)

if %HAS_BUN% EQU 1 (
    for /f "tokens=*" %%v in ('bun -v') do set BUN_VER=%%v
    echo   [OK] Bun detected: v%BUN_VER%
)
echo.

:: Step 3: Check / Install dependencies with legacy-peer-deps fallback
echo [3/5] Verifying and installing dependencies...
echo   Running npm install with peer-dependency resolution...

if %HAS_BUN% EQU 1 (
    call bun install
) else (
    call npm install --legacy-peer-deps
)

if %ERRORLEVEL% NEQ 0 (
    echo   [INFO] Retrying with force flag...
    call npm install --force --legacy-peer-deps
)

if %ERRORLEVEL% NEQ 0 goto ERR_INSTALL_FAILED
echo   [OK] Dependencies verified successfully.
echo.

:: Step 4: Build React + Vite production bundle
echo [4/5] Building production web bundle (Vite + React)...
if %HAS_BUN% EQU 1 (
    call bun run build
) else (
    call npm run build
)

if %ERRORLEVEL% NEQ 0 goto ERR_BUILD_FAILED
echo   [OK] Web bundle compiled to "dist" directory.
echo.

:: Step 5: Package Windows .EXE with electron-builder
echo [5/5] Packaging Windows Desktop Software (.EXE)...
echo   - Targets: Setup Installer (.exe) + Portable (.exe)
echo   - Tool: electron-builder
echo.

if %HAS_BUN% EQU 1 (
    call bun x electron-builder --win nsis portable
) else (
    call npx electron-builder --win nsis portable
)

if %ERRORLEVEL% NEQ 0 goto ERR_PACKAGE_FAILED

echo.
echo ===============================================================================
echo   [SUCCESS] Windows Desktop Software (.EXE) built successfully!
echo ===============================================================================
echo.
echo Your generated Windows executables are located in:
echo   %CD%\release\
echo.

if exist "release\" (
    echo Generated files:
    dir /b "release\*.exe" 2>nul
    echo.
    echo Opening release folder in File Explorer...
    start "" explorer "release"
)

echo.
echo ===============================================================================
echo   Press any key to exit this window...
echo ===============================================================================
pause >nul
exit /b 0

:: ===============================================================================
:: Error Handlers (Always pauses to prevent window from closing)
:: ===============================================================================

:ERR_NO_NODE
color 0c
echo.
echo ===============================================================================
echo [ERROR] Node.js is not installed or not found in system PATH!
echo ===============================================================================
echo.
echo Node.js is required to compile this desktop application.
echo.
echo Solution:
echo  1. Download Node.js from: https://nodejs.org/
echo  2. Install the "LTS (Recommended)" version.
echo  3. Re-run "Build windows exe.bat" after installation.
echo.
set /p OPEN_BROWSER="Open Node.js download page in browser now? (Y/N): "
if /i "%OPEN_BROWSER%"=="Y" (
    start https://nodejs.org/en/download
)
echo.
echo Press any key to exit...
pause >nul
exit /b 1

:ERR_INSTALL_FAILED
color 0c
echo.
echo ===============================================================================
echo [ERROR] Dependency installation failed! (npm install failed)
echo ===============================================================================
echo Please check your internet connection and verify npm permissions.
echo.
echo Press any key to exit...
pause >nul
exit /b 1

:ERR_BUILD_FAILED
color 0c
echo.
echo ===============================================================================
echo [ERROR] Production web build failed! (npm run build failed)
echo ===============================================================================
echo Please check the error log above.
echo.
echo Press any key to exit...
pause >nul
exit /b 1

:ERR_PACKAGE_FAILED
color 0c
echo.
echo ===============================================================================
echo [ERROR] Electron packaging failed! (electron-builder failed)
echo ===============================================================================
echo Please check the electron-builder log above.
echo.
echo Press any key to exit...
pause >nul
exit /b 1

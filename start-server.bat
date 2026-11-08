@echo off
title House of Memoir - Local Server
echo ===================================================
echo   Starting House of Memoir Local Server (Port 8000)...
echo ===================================================
echo.
cd /d "%~dp0"
node server.js
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Server stopped with error.
  echo Please make sure Node.js is installed on your computer.
)
pause

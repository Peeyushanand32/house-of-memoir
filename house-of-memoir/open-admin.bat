@echo off
title House of Memoir Admin Portal
cd /d "%~dp0"

echo ========================================================
echo   HOUSE OF MEMOIR - ADMIN PORTAL LAUNCHER
echo ========================================================
echo.

netstat -ano | findstr :8000 >nul
if %errorlevel% neq 0 (
    echo [INFO] Local Node server port 8000 par running nahi tha.
    echo [INFO] Starting Node.js server automatically...
    start "House of Memoir Local Server" /min cmd /c "node server.js"
    timeout /t 2 /nobreak >nul
) else (
    echo [INFO] Local Node server already active on port 8000!
)

echo [INFO] Opening Admin Portal in browser...
start http://localhost:8000/admin.html
echo.
echo Login Credentials:
echo Username: admin
echo Password: admin123
echo ========================================================

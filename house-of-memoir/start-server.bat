@echo off
title House of Memoir - Local Server & Admin Portal
echo =========================================================
echo   HOUSE OF MEMOIR - LOCAL SERVER & ADMIN COMMAND
echo =========================================================
echo.
cd /d "%~dp0"

echo [1/2] Opening Admin Panel in your browser...
start http://localhost:8000/admin.html

echo [2/2] Starting Node.js server on port 8000...
echo.
echo Server URL:  http://localhost:8000/
echo Admin Portal: http://localhost:8000/admin.html
echo.
echo Keep this window open while using the website or admin panel.
echo To stop server, close this window or press Ctrl+C.
echo =========================================================
echo.

node server.js
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Server encountered an error.
  echo Make sure Node.js is installed.
  pause
)

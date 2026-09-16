@echo off
REM Runs the Tangent site locally at http://localhost:8080
cd /d "%~dp0"
echo Serving Tangent at http://localhost:8080
echo Press Ctrl+C to stop.
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8080
) else (
  echo Python not found. Install Python, or just double-click index.html.
  pause
)

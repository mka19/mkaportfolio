@echo off
cd /d "%~dp0"
where node >nul 2>&1
if %errorlevel%==0 (
  node "%~dp0apply-update.cjs" || (pause & exit /b 1)
  node "%~dp0portfolio-server.cjs"
  pause
  exit /b
)
where py >nul 2>&1
if %errorlevel%==0 (
  py "%~dp0apply-update.py" || (pause & exit /b 1)
  start "" "http://localhost:8000/"
  py -m http.server 8000 --bind 127.0.0.1
  pause
  exit /b
)
where python >nul 2>&1
if %errorlevel%==0 (
  python "%~dp0apply-update.py" || (pause & exit /b 1)
  start "" "http://localhost:8000/"
  python -m http.server 8000 --bind 127.0.0.1
  pause
  exit /b
)
echo Install Node.js or Python, then run this file again.
pause

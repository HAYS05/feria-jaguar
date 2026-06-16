@echo off
REM ============================================================
REM   INICIAR.bat - Arranca la Feria Jaguar
REM   Solo haz doble clic en este archivo.
REM ============================================================
title Feria Jaguar - Servidor
cd /d "%~dp0"

echo.
echo   ====================================================
echo      FERIA JAGUAR - Iniciando asistente virtual...
echo   ====================================================
echo.
echo   Abriendo el navegador en unos segundos...
echo   Para CERRAR todo: cierra esta ventana negra.
echo.

REM Abre el navegador en la pagina
start "" http://localhost:8000

REM Arranca el servidor local con Python
python -m http.server 8000

pause

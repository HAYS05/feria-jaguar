@echo off
REM ============================================================
REM   PUBLICAR.bat - Sube la Feria Jaguar a internet
REM   Solo haz doble clic en este archivo.
REM   Publica en: https://hays05.github.io/feria-jaguar/
REM ============================================================
title Feria Jaguar - Publicar
cd /d "%~dp0"

echo.
echo   ====================================================
echo      FERIA JAGUAR - Publicando en internet...
echo   ====================================================
echo.

REM 1) Revisar si hay cambios para subir
git diff --quiet && git diff --cached --quiet
if not errorlevel 1 (
  echo   No hay cambios nuevos para publicar.
  echo   La pagina ya esta al dia.
  echo.
  pause
  exit /b 0
)

REM 2) Guardar todos los cambios con la fecha y hora
echo   Guardando los cambios...
git add -A
git commit -m "Publicar cambios desde PUBLICAR.bat (%date% %time%)"
if errorlevel 1 (
  echo.
  echo   [ERROR] No se pudo guardar. Revisa el mensaje de arriba.
  echo.
  pause
  exit /b 1
)

REM 3) Subir a GitHub (GitHub Pages se actualiza solo)
echo.
echo   Subiendo a internet...
git push
if errorlevel 1 (
  echo.
  echo   [ERROR] No se pudo subir. Quiza falta tu usuario/clave de GitHub
  echo   o no hay internet. Revisa el mensaje de arriba.
  echo.
  pause
  exit /b 1
)

echo.
echo   ====================================================
echo      LISTO. Cambios publicados con exito.
echo   ====================================================
echo.
echo   La pagina tarda 1 o 2 minutos en actualizarse en:
echo   https://hays05.github.io/feria-jaguar/
echo.
pause

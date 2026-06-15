@echo off
title SEATTLE TRACKER - Servidor Activo
mode con: cols=60 lines=15
color 0b

echo ===========================================
echo    INICIANDO MOTOR DE SEATTLE TRACKER
echo ===========================================
echo.
echo [1/2] Entrando a la carpeta del proyecto...
cd /d "C:\Users\erikm\MisProyectos\seattle-tracker"

echo [2/2] Encendiendo el servidor de Next.js...
echo.
echo -- LA APP SE ABRIRA EN TU NAVEGADOR EN BREVE --
echo.

:: Abre el navegador automáticamente
start http://localhost:3000

:: Inicia el proceso de Next.js
npx next dev

pause
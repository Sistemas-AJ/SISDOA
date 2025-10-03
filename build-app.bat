@echo off
title SISDOA - Empaquetador de Aplicación
color 0B

echo ===============================================
echo     SISDOA - Empaquetador de Aplicación
echo ===============================================
echo.
echo Este script creará un ejecutable completo de SISDOA
echo que incluye tanto el backend (puerto 9050) como el frontend.
echo.
pause

echo.
echo 📋 Verificando requisitos...

REM Verificar Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    echo    Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

REM Verificar Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Python no está instalado
    echo    Por favor instala Python desde https://python.org
    pause
    exit /b 1
)

REM Verificar npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: npm no está instalado
    pause
    exit /b 1
)

echo ✅ Todos los requisitos están instalados
echo.

echo 🔄 Cambiando al directorio Frontend...
cd /d "%~dp0Frontend"

if not exist "package.json" (
    echo ❌ ERROR: No se encontró package.json en el directorio Frontend
    pause
    exit /b 1
)

echo 📦 Instalando/actualizando dependencias del frontend...
call npm install
if %errorlevel% neq 0 (
    echo ❌ ERROR: Falló la instalación de dependencias
    pause
    exit /b 1
)

echo 🔨 Compilando frontend para producción...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ ERROR: Falló la compilación del frontend
    pause
    exit /b 1
)

echo 📦 Empaquetando aplicación completa...
call npm run package-win
if %errorlevel% neq 0 (
    echo ❌ ERROR: Falló el empaquetado de la aplicación
    pause
    exit /b 1
)

echo.
echo ✅ ¡EMPAQUETADO COMPLETADO EXITOSAMENTE!
echo.
echo 📁 Los archivos de instalación están en:
echo    %cd%\dist
echo.
echo 📋 Archivos generados:
dir /b dist\*.exe 2>nul
echo.
echo 🚀 Puedes instalar la aplicación ejecutando el instalador .exe
echo.
pause
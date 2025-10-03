#!/usr/bin/env python3
"""
Script para preparar el backend para empaquetado con Electron
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

def main():
    print("🚀 Preparando SISDOA para empaquetado...")
    
    # Rutas
    backend_dir = Path(__file__).parent
    frontend_dir = backend_dir.parent / "Frontend"
    
    print(f"📁 Backend: {backend_dir}")
    print(f"📁 Frontend: {frontend_dir}")
    
    # Verificar que estamos en el directorio correcto
    if not (backend_dir / "main.py").exists():
        print("❌ Error: No se encontró main.py en el directorio backend")
        sys.exit(1)
    
    if not (frontend_dir / "package.json").exists():
        print("❌ Error: No se encontró package.json en el directorio frontend")
        sys.exit(1)
    
    # Crear requirements mínimo para producción
    print("📦 Creando requirements de producción...")
    requirements_prod = [
        "fastapi==0.110.2",
        "uvicorn[standard]==0.29.0",
        "pydantic==2.7.1",
        "python-multipart==0.0.9",
        "sqlalchemy==2.0.20"
    ]
    
    with open(backend_dir / "requirements-prod.txt", "w") as f:
        f.write("\n".join(requirements_prod))
    
    # Limpiar archivos de desarrollo
    print("🧹 Limpiando archivos de desarrollo...")
    cleanup_dirs = ["__pycache__", ".pytest_cache", ".venv"]
    cleanup_files = ["*.pyc", "*.pyo", "*.pyd"]
    
    for root, dirs, files in os.walk(backend_dir):
        # Eliminar directorios de caché
        for cleanup_dir in cleanup_dirs:
            if cleanup_dir in dirs:
                shutil.rmtree(os.path.join(root, cleanup_dir), ignore_errors=True)
                dirs.remove(cleanup_dir)
        
        # Eliminar archivos compilados
        for file in files:
            if any(file.endswith(pattern.replace("*", "")) for pattern in cleanup_files):
                os.remove(os.path.join(root, file))
    
    # Verificar configuración del puerto
    print("🔧 Verificando configuración del backend...")
    main_py = backend_dir / "main.py"
    with open(main_py, "r", encoding="utf-8") as f:
        content = f.read()
        if "port=9050" not in content and "PORT=9050" not in content:
            print("⚠️  Advertencia: No se detectó configuración del puerto 9050")
    
    # Cambiar al directorio frontend
    os.chdir(frontend_dir)
    
    # Instalar dependencias del frontend si no existen
    if not (frontend_dir / "node_modules").exists():
        print("📦 Instalando dependencias del frontend...")
        subprocess.run(["npm", "install"], check=True)
    
    # Compilar el frontend
    print("🔨 Compilando frontend...")
    subprocess.run(["npm", "run", "build"], check=True)
    
    # Empaquetar la aplicación
    print("📦 Empaquetando aplicación completa...")
    subprocess.run(["npm", "run", "package-win"], check=True)
    
    print("✅ ¡Empaquetado completado!")
    print(f"📁 Los archivos empaquetados están en: {frontend_dir / 'dist'}")

if __name__ == "__main__":
    main()
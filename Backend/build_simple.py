#!/usr/bin/env python3
"""
Script simplificado para crear ejecutable del backend
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

def main():
    print("🚀 Creando ejecutable del backend SISDOA (método simplificado)...")
    
    backend_dir = Path(__file__).parent
    
    # Limpiar builds anteriores
    build_dir = backend_dir / "build"
    dist_dir = backend_dir / "dist"
    spec_files = list(backend_dir.glob("*.spec"))
    
    if build_dir.exists():
        print("🧹 Limpiando build anterior...")
        shutil.rmtree(build_dir, ignore_errors=True)
    
    if dist_dir.exists():
        print("🧹 Limpiando dist anterior...")
        shutil.rmtree(dist_dir, ignore_errors=True)
    
    # Eliminar archivos .spec anteriores
    for spec_file in spec_files:
        spec_file.unlink(missing_ok=True)
    
    # Ejecutar PyInstaller directamente
    print("🔨 Compilando backend con PyInstaller...")
    
    try:
        cmd = [
            sys.executable, '-m', 'PyInstaller',
            '--onefile',
            '--noconsole',
            '--name', 'sisdoa-backend',
            '--collect-all', 'fastapi',
            '--collect-all', 'uvicorn',
            '--collect-all', 'starlette', 
            '--collect-all', 'pydantic',
            '--collect-all', 'sqlalchemy',
            '--add-data', 'db;db',
            '--add-data', 'features;features',
            '--add-data', 'models;models',
            '--add-data', '.env;.',
            'main.py'
        ]
        
        print(f"Ejecutando: {' '.join(cmd)}")
        
        result = subprocess.run(cmd, cwd=backend_dir, check=True)
        
        print("✅ Backend compilado exitosamente!")
        
        # Verificar que se creó el ejecutable
        exe_path = dist_dir / "sisdoa-backend.exe"
        if exe_path.exists():
            print(f"📁 Ejecutable creado: {exe_path}")
            print(f"📏 Tamaño: {exe_path.stat().st_size / (1024*1024):.1f} MB")
            return True
        else:
            print("❌ Error: No se encontró el ejecutable")
            return False
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Error durante la compilación: {e}")
        return False
    
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("🎉 ¡Backend empaquetado exitosamente!")
    else:
        print("💥 Falló el empaquetado del backend")
        sys.exit(1)
#!/usr/bin/env python3
"""
Script para crear un ejecutable del backend SISDOA
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

def main():
    print("🚀 Creando ejecutable del backend SISDOA...")
    
    backend_dir = Path(__file__).parent
    
    # Limpiar builds anteriores
    build_dir = backend_dir / "build"
    dist_dir = backend_dir / "dist"
    
    if build_dir.exists():
        print("🧹 Limpiando build anterior...")
        shutil.rmtree(build_dir)
    
    if dist_dir.exists():
        print("🧹 Limpiando dist anterior...")
        shutil.rmtree(dist_dir)
    
    # Crear archivo spec personalizado para PyInstaller
    spec_content = '''
# -*- mode: python ; coding: utf-8 -*-
import os

block_cipher = None

# Incluir todos los archivos de datos necesarios
datas = [
    ('db', 'db'),
    ('features', 'features'),
    ('models', 'models'),
    ('.env', '.'),
]

# Incluir archivos específicos si existen
if os.path.exists('requirements.txt'):
    datas.append(('requirements.txt', '.'))

a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=[
        'uvicorn.loops.auto',
        'uvicorn.protocols.http.auto',
        'uvicorn.protocols.websockets.auto',
        'uvicorn.lifespan.on',
        'pydantic',
        'fastapi',
        'fastapi.routing',
        'fastapi.applications',
        'fastapi.middleware',
        'fastapi.middleware.cors',
        'sqlalchemy',
        'sqlalchemy.dialects.sqlite',
        'sqlalchemy.orm',
        'sqlalchemy.pool',
        'starlette',
        'starlette.applications',
        'starlette.routing',
        'starlette.middleware',
        'starlette.middleware.cors',
        'multipart',
        'python_multipart',
        're',
        'os',
        'datetime',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='sisdoa-backend',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,
)
'''
    
    spec_file = backend_dir / "sisdoa-backend.spec"
    with open(spec_file, 'w', encoding='utf-8') as f:
        f.write(spec_content)
    
    print("📄 Archivo .spec creado")
    
    # Ejecutar PyInstaller con más opciones para capturar dependencias
    print("🔨 Compilando backend con PyInstaller...")
    
    try:
        result = subprocess.run([
            sys.executable, '-m', 'PyInstaller',
            '--clean',
            '--collect-all', 'fastapi',
            '--collect-all', 'uvicorn',
            '--collect-all', 'starlette',
            '--collect-all', 'pydantic',
            '--collect-all', 'sqlalchemy',
            str(spec_file)
        ], cwd=backend_dir, check=True, capture_output=True, text=True)
        
        print("✅ Backend compilado exitosamente!")
        
        # Verificar que se creó el ejecutable
        exe_path = dist_dir / "sisdoa-backend.exe"
        if exe_path.exists():
            print(f"📁 Ejecutable creado: {exe_path}")
            print(f"📏 Tamaño: {exe_path.stat().st_size / (1024*1024):.1f} MB")
        else:
            print("❌ Error: No se encontró el ejecutable")
            return False
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Error durante la compilación: {e}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("🎉 ¡Backend empaquetado exitosamente!")
    else:
        print("💥 Falló el empaquetado del backend")
        sys.exit(1)
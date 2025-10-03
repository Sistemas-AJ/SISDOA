#!/usr/bin/env python3
"""
Script para empaquetar el frontend de SISDOA como ejecutable
"""
import PyInstaller.__main__ as pyi_main
import os
import sys
import shutil

def build_frontend():
    """Empaquetar el servidor frontend como ejecutable"""
    
    # Configuración de PyInstaller
    pyi_args = [
        'serve_frontend.py',
        '--onefile',
        '--name=sisdoa-frontend',
        '--icon=favicon.ico',
        '--add-data=build;build',  # Incluir toda la carpeta build
        '--noconsole',  # No mostrar consola
        '--clean',
        '--noconfirm',
        '--distpath=dist',
        '--workpath=build_temp',
        '--specpath=.',
    ]
    
    print("Empaquetando frontend de SISDOA...")
    print("Argumentos de PyInstaller:", pyi_args)
    
    try:
        # Ejecutar PyInstaller
        pyi_main.run(pyi_args)
        
        print("\n✅ Frontend empaquetado exitosamente!")
        print(f"Ejecutable creado en: {os.path.abspath('dist/sisdoa-frontend.exe')}")
        
        # Mostrar información del archivo
        exe_path = 'dist/sisdoa-frontend.exe'
        if os.path.exists(exe_path):
            size = os.path.getsize(exe_path) / (1024 * 1024)  # MB
            print(f"Tamaño del ejecutable: {size:.1f} MB")
        
        return True
        
    except Exception as e:
        print(f"❌ Error durante el empaquetado: {e}")
        return False

def clean_build():
    """Limpiar archivos de build anteriores"""
    dirs_to_clean = ['build_temp', 'dist', '__pycache__']
    files_to_clean = ['sisdoa-frontend.spec']
    
    for dir_name in dirs_to_clean:
        if os.path.exists(dir_name):
            shutil.rmtree(dir_name)
            print(f"Eliminado directorio: {dir_name}")
    
    for file_name in files_to_clean:
        if os.path.exists(file_name):
            os.remove(file_name)
            print(f"Eliminado archivo: {file_name}")

if __name__ == '__main__':
    print("=== SISDOA Frontend Packager ===")
    
    # Verificar que existe el directorio build
    if not os.path.exists('build'):
        print("❌ Error: No se encontró el directorio 'build'")
        print("Ejecuta 'npm run build' primero para generar los archivos React")
        sys.exit(1)
    
    # Limpiar builds anteriores
    clean_build()
    
    # Empaquetar
    success = build_frontend()
    
    if success:
        print("\n🎉 ¡Empaquetado completado!")
    else:
        print("\n💥 Empaquetado falló")
        sys.exit(1)
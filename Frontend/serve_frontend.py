#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import webbrowser
import time
from threading import Timer

# Puerto para el frontend
PORT = 3000
BACKEND_PORT = 9050

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=self.get_build_directory(), **kwargs)
    
    @staticmethod
    def get_build_directory():
        # Obtener el directorio donde están los archivos React compilados
        if getattr(sys, 'frozen', False):
            # Si está empaquetado como exe, los archivos están en el directorio del exe
            return os.path.join(os.path.dirname(sys.executable), 'build')
        else:
            # Si está en desarrollo, usar el build directory normal
            return os.path.join(os.path.dirname(__file__), 'build')
    
    def end_headers(self):
        # Agregar headers CORS para permitir conexiones con el backend
        self.send_header('Access-Control-Allow-Origin', f'http://localhost:{BACKEND_PORT}')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_GET(self):
        # Para rutas de React Router, servir index.html
        if not os.path.exists(self.get_build_directory() + self.path):
            if not self.path.startswith('/static/') and not self.path.endswith('.ico'):
                self.path = '/index.html'
        super().do_GET()

def open_browser():
    """Abrir el navegador después de un pequeño delay"""
    time.sleep(2)
    webbrowser.open(f'http://localhost:{PORT}')

def start_server():
    """Iniciar el servidor web"""
    build_dir = CustomHTTPRequestHandler.get_build_directory()
    
    if not os.path.exists(build_dir):
        print(f"Error: No se encontró el directorio build en {build_dir}")
        return False
    
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"SISDOA Frontend ejecutándose en http://localhost:{PORT}")
            print(f"Sirviendo archivos desde: {build_dir}")
            print("Presiona Ctrl+C para detener el servidor")
            
            # Abrir el navegador automáticamente
            Timer(1.0, open_browser).start()
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
        return True
    except OSError as e:
        if e.errno == 10048:  # Puerto en uso
            print(f"Error: El puerto {PORT} ya está en uso.")
        else:
            print(f"Error al iniciar el servidor: {e}")
        return False

if __name__ == '__main__':
    start_server()
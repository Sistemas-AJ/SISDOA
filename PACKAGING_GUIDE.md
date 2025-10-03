# 📦 Guía de Empaquetado SISDOA

Esta guía te ayudará a crear un ejecutable completo de SISDOA que incluya tanto el backend como el frontend en una sola aplicación.

## 🎯 Resultado Final

Al completar el empaquetado tendrás:
- ✅ Un instalador `.exe` para Windows
- ✅ Backend integrado (puerto 9050) que se ejecuta automáticamente
- ✅ Frontend en Electron con interfaz nativa
- ✅ Base de datos SQLite incluida
- ✅ No requiere instalaciones adicionales para el usuario final

## 📋 Requisitos Previos

Antes de empaquetar, asegúrate de tener instalado:

- **Node.js** (v14 o superior) - [Descargar](https://nodejs.org)
- **Python** (v3.8 o superior) - [Descargar](https://python.org)
- **npm** (incluido con Node.js)

## 🚀 Proceso de Empaquetado

### Opción 1: Script Automático (Recomendado)

```batch
# Ejecutar desde la raíz del proyecto
build-app.bat
```

### Opción 2: Manual

#### Paso 1: Preparar el Frontend
```bash
cd Frontend
npm install
npm run build
```

#### Paso 2: Empaquetar la Aplicación
```bash
npm run package-win
```

#### Paso 3: Verificar el Resultado
Los archivos empaquetados estarán en `Frontend/dist/`

## 📁 Estructura del Empaquetado

```
dist/
├── win-unpacked/           # Aplicación desempaquetada
│   ├── SISDOA.exe         # Ejecutable principal
│   ├── resources/
│   │   ├── app.asar       # Frontend empaquetado
│   │   └── backend/       # Backend completo
│   │       ├── main.py
│   │       ├── requirements.txt
│   │       ├── db/
│   │       ├── features/
│   │       └── models/
│   └── ...
└── SISDOA Setup.exe       # Instalador para distribución
```

## ⚙️ Configuración Específica

### Puerto del Backend
- **Configurado**: Puerto 9050 (fijo)
- **Razón**: Evita conflictos con otros servicios
- **Ubicación**: `Backend/main.py` y `Backend/.env`

### Configuración de Electron
- **Archivo**: `Frontend/public/electron.js`
- **Función**: Inicia automáticamente el backend al abrir la app
- **Ventana**: 1200x800 píxeles por defecto

### Archivos Incluidos
- ✅ Todo el código del backend
- ✅ Base de datos SQLite
- ✅ Archivos estáticos del frontend
- ❌ Archivos de desarrollo (`__pycache__`, `.venv`, etc.)

## 🔧 Solución de Problemas

### Error: "Python no encontrado"
```bash
# Verificar instalación de Python
python --version

# Si no está instalado, descargar de:
# https://python.org/downloads
```

### Error: "npm no encontrado"
```bash
# Verificar instalación de Node.js
node --version
npm --version

# Si no está instalado, descargar de:
# https://nodejs.org
```

### Error: "electron-builder failed"
```bash
# Limpiar caché e reinstalar
cd Frontend
rm -rf node_modules
rm package-lock.json
npm install
npm run package-win
```

### Error: "Backend no inicia"
- Verificar que `Backend/main.py` existe
- Verificar que el puerto 9050 no esté ocupado
- Revisar logs en la consola de Electron (F12)

## 📦 Distribución

### Para Usuarios Finales
1. Ejecutar `SISDOA Setup.exe`
2. Seguir el asistente de instalación
3. La aplicación se instalará en `Program Files`
4. Se creará acceso directo en el escritorio

### Para Desarrollo
1. Usar la carpeta `win-unpacked`
2. Ejecutar directamente `SISDOA.exe`
3. No requiere instalación

## 🎨 Personalización

### Cambiar Icono
- Reemplazar `Frontend/public/favicon.ico`
- El icono debe ser `.ico` para Windows

### Cambiar Nombre
- Modificar `productName` en `Frontend/package.json`
- Sección `build` → `productName`

### Cambiar Versión
- Modificar `version` en `Frontend/package.json`

## 📊 Tamaños Aproximados

- **Instalador**: ~150-200 MB
- **Aplicación instalada**: ~300-400 MB
- **Tiempo de empaquetado**: 2-5 minutos

## 🔐 Certificación (Opcional)

Para distribución comercial, considera:
- Firmar digitalmente el ejecutable
- Configurar certificado en electron-builder
- Evita advertencias de Windows Defender

## 📝 Notas Importantes

1. **Antivirus**: Algunos antivirus pueden marcar el ejecutable como sospechoso (falso positivo)
2. **Permisos**: La aplicación requiere permisos de escritura para la base de datos
3. **Actualizaciones**: Cada nueva versión requiere re-empaquetado completo
4. **Compatibilidad**: Empaquetado en Windows funciona solo en Windows

## 🆘 Soporte

Si encuentras problemas:
1. Verificar logs de la consola (F12 en la app)
2. Revisar archivos de log del backend
3. Verificar que el puerto 9050 esté disponible
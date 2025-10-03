const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { spawn } = require('child_process');

const path = require('path');
const isDev = require('electron-is-dev');

// Detección más robusta de desarrollo vs producción
const isReallyDev = isDev && process.env.NODE_ENV !== 'production' && !app.isPackaged;

let mainWindow;
let backendProcess;

function startBackend() {
  const backendExe = isReallyDev 
    ? path.join(__dirname, '../../Backend/dist/sisdoa-backend.exe')
    : path.join(process.cwd(), 'backend', 'dist', 'sisdoa-backend.exe');
  
  console.log('Iniciando backend ejecutable:', backendExe);
  console.log('Directorio de recursos:', process.resourcesPath);
  console.log('Es desarrollo:', isReallyDev);
  console.log('isDev:', isDev);
  console.log('app.isPackaged:', app.isPackaged);
  console.log('Ruta completa del backend:', path.resolve(backendExe));
  
  // Verificar que el ejecutable existe
  const fs = require('fs');
  if (!fs.existsSync(backendExe)) {
    console.error('❌ No se encontró el ejecutable del backend:', backendExe);
    // Intentar rutas alternativas
    const alternativePaths = [
      path.join(process.cwd(), 'backend', 'dist', 'sisdoa-backend.exe'),
      path.join(__dirname, 'backend', 'dist', 'sisdoa-backend.exe'),
      path.join(process.resourcesPath, 'backend', 'dist', 'sisdoa-backend.exe'),
      path.join(path.dirname(process.execPath), 'backend', 'dist', 'sisdoa-backend.exe')
    ];
    
    console.log('Buscando en rutas alternativas:');
    for (const altPath of alternativePaths) {
      console.log(`Verificando: ${altPath} - ${fs.existsSync(altPath) ? '✅ ENCONTRADO' : '❌ No existe'}`);
    }
    return;
  }
  
  backendProcess = spawn(backendExe, [], {
    env: {
      ...process.env,
      PORT: '9050',
      HOST: '0.0.0.0',
      UVICORN_PORT: '9050',
      UVICORN_HOST: '0.0.0.0'
    }
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend proceso cerrado con código ${code}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Permite carga de archivos locales
      allowRunningInsecureContent: true,
      experimentalFeatures: true
    },
    icon: path.join(__dirname, 'favicon.ico'),
    show: false
  });

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Cargar la aplicación
  if (isReallyDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // En producción, cargar el archivo HTML desde el directorio correcto
    const htmlPath = path.join(__dirname, 'index.html');
    console.log('Cargando archivo HTML desde:', htmlPath);
    console.log('__dirname:', __dirname);
    console.log('process.resourcesPath:', process.resourcesPath);
    
    const fs = require('fs');
    console.log('Verificando si existe:', htmlPath);
    console.log('¿Existe?:', fs.existsSync(htmlPath));
    
    // Verificar también archivos JavaScript y CSS
    const jsPath = path.join(__dirname, 'static', 'js');
    const cssPath = path.join(__dirname, 'static', 'css');
    console.log('Verificando archivos JavaScript:', fs.existsSync(jsPath));
    console.log('Verificando archivos CSS:', fs.existsSync(cssPath));
    if (fs.existsSync(jsPath)) {
      const jsFiles = fs.readdirSync(jsPath);
      console.log('Archivos JS encontrados:', jsFiles);
    }
    
    if (fs.existsSync(htmlPath)) {
      console.log('✅ Archivo HTML encontrado, cargando...');
      mainWindow.loadFile(htmlPath);
    } else {
      console.log('❌ Archivo HTML no encontrado. Intentando rutas alternativas...');
      const alternativePaths = [
        path.join(__dirname, '..', 'build', 'index.html'),
        path.join(process.resourcesPath, 'app', 'build', 'index.html'),
        path.join(process.resourcesPath, 'build', 'index.html'),
        path.join(__dirname, 'build', 'index.html')
      ];
      
      let loaded = false;
      for (const altPath of alternativePaths) {
        console.log(`Probando: ${altPath} - ${fs.existsSync(altPath) ? '✅ ENCONTRADO' : '❌ No existe'}`);
        if (fs.existsSync(altPath)) {
          mainWindow.loadFile(altPath);
          loaded = true;
          break;
        }
      }
      
      if (!loaded) {
        console.error('❌ No se pudo encontrar index.html en ninguna ruta');
      }
    }
  }

  // Herramientas de desarrollo comentadas - se pueden abrir manualmente con F12 o Ctrl+Shift+I
  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (backendProcess) {
      backendProcess.kill();
    }
  });
}
app.on('ready', () => {
  // Iniciar backend primero
  startBackend();
  
  // Esperar un momento antes de crear la ventana
  setTimeout(() => {
    createWindow();
  }, 2000);
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
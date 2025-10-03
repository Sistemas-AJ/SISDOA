const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { spawn } = require('child_process');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let backendProcess;

function startBackend() {
  const backendExe = isDev 
    ? path.join(__dirname, '../../Backend/dist/sisdoa-backend.exe')
    : path.join(process.resourcesPath, 'backend', 'sisdoa-backend.exe');
  
  console.log('Iniciando backend ejecutable:', backendExe);
  
  // Verificar que el ejecutable existe
  const fs = require('fs');
  if (!fs.existsSync(backendExe)) {
    console.error('❌ No se encontró el ejecutable del backend:', backendExe);
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
      contextIsolation: false
    },
    icon: path.join(__dirname, 'favicon.ico'),
    show: false
  });

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Cargar la aplicación
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
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
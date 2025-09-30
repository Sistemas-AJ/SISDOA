const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

const SISDOA_PATH = path.join(__dirname, '..') // Carpeta SISDOA

function getFolders(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  } catch (e) {
    return []
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  win.loadFile('html/index.html')

  // Cuando el renderer pide carpetas, responde con la lista
  ipcMain.handle('get-folders', async (event, dir) => {
    const baseDir = dir || SISDOA_PATH
    return getFolders(baseDir)
  })
}

app.whenReady().then(() => {
  createWindow()
})
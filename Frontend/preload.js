
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	getFolders: (dir) => ipcRenderer.invoke('get-folders', dir)
})

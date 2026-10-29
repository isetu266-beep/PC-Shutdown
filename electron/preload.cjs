const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// IPC channels without exposing the entire Node.js/Electron API
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  // Power actions
  executeShutdown: (options) => ipcRenderer.invoke('shutdown:execute', options),
  abortShutdown: () => ipcRenderer.invoke('shutdown:abort'),

  // Window management
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window:maximize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:is-maximized'),

  // System & notifications
  getSystemInfo: () => ipcRenderer.invoke('system:get-info'),
  getSystemIdleTime: () => ipcRenderer.invoke('system:get-idle-time'),
  showNotification: (payload) => ipcRenderer.invoke('notification:show', payload),

  // Event listeners
  onWindowStateChanged: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('window:state-changed', subscription);
    return () => ipcRenderer.removeListener('window:state-changed', subscription);
  }
});

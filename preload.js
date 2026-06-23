const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  hideToTray: () => ipcRenderer.invoke('hide-to-tray'),
  resizeWindow: (w, h) => ipcRenderer.invoke('resize-window', w, h),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
  openNotifSettings: () => ipcRenderer.invoke('open-notif-settings'),
  updateTrayTip: (text) => ipcRenderer.invoke('update-tray-tip', text),
  exportData: (json) => ipcRenderer.invoke('export-data', json),
  importData: () => ipcRenderer.invoke('import-data')
});

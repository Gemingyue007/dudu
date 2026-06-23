const { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain, Notification, dialog } = require('electron');
const path = require('path');

// ========== 便携数据目录 ==========
const appPath = app.isPackaged ? path.dirname(process.execPath) : __dirname;
const fs = require('fs');

function ensureDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    fs.accessSync(dirPath, fs.constants.W_OK);
    return dirPath;
  } catch { return null; }
}

let dataPath = path.join(appPath, 'data');
let cachePath = path.join(appPath, 'cache');

if (!ensureDirectory(dataPath) || !ensureDirectory(cachePath)) {
  const fallbackDir = path.join(app.getPath('appData'), '吨吨吨');
  dataPath = path.join(fallbackDir, 'data');
  cachePath = path.join(fallbackDir, 'cache');
  ensureDirectory(dataPath);
  ensureDirectory(cachePath);
}
app.setPath('userData', cachePath);

// ========== 单实例锁 ==========
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) { app.quit(); }
app.setAppUserModelId('com.drinkwater.helper');

// ========== 全局变量 ==========
let mainWindow = null;
let tray = null;
app.isQuiting = false;

// ========== 创建窗口 ==========
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 500,
    resizable: false,
    frame: false,
    transparent: true,
    icon: app.isPackaged ? path.join(process.resourcesPath, 'icon.ico') : path.join(__dirname, 'icon.ico'),
    title: '吨吨吨',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.setMenu(null);

  // 关闭 → 隐藏到托盘
  mainWindow.on('close', (e) => {
    if (!app.isQuiting && tray) {
      e.preventDefault();
      mainWindow.hide();
      if (tray && !tray.isDestroyed()) {
        tray.displayBalloon({ title: '吨吨吨', content: '已最小化到托盘，点击恢复窗口' });
      }
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ========== 托盘 ==========
function createTray() {
  try {
    const iconPath = app.isPackaged ? path.join(process.resourcesPath, 'icon.ico') : path.join(__dirname, 'icon.ico');
    const icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) throw new Error('图标缺失');

    tray = new Tray(icon);
    tray.setToolTip('💧 吨吨吨\n启动中…');

    const contextMenu = Menu.buildFromTemplate([
      { label: '📋 显示主窗口', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } } },
      { type: 'separator' },
      { label: '🚪 退出程序', click: () => {
        app.isQuiting = true;
        if (tray && !tray.isDestroyed()) { tray.destroy(); tray = null; }
        if (mainWindow && !mainWindow.isDestroyed()) { mainWindow.close(); }
        app.exit(0);
      }}
    ]);
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      if (!mainWindow || mainWindow.isDestroyed()) return;
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      if (mainWindow.isVisible()) mainWindow.focus();
    });
  } catch (err) {
    console.error('托盘创建失败:', err);
  }
}

// ========== IPC ==========
ipcMain.handle('update-tray-tip', (e, text) => {
  if (tray && !tray.isDestroyed()) tray.setToolTip(text);
});
ipcMain.handle('window-minimize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.minimize();
});
ipcMain.handle('hide-to-tray', () => {
  if (mainWindow && !mainWindow.isDestroyed()) { mainWindow.hide(); }
});
ipcMain.handle('export-data', async (e, json) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: '导出数据',
    defaultPath: '吨吨吨_数据_' + new Date().toISOString().slice(0,10) + '.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (filePath) {
    try {
      require('fs').writeFileSync(filePath, json, 'utf-8');
      return true;
    } catch(err) { return false; }
  }
  return false;
});
ipcMain.handle('import-data', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: '导入数据',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (filePaths && filePaths[0]) {
    try {
      return require('fs').readFileSync(filePaths[0], 'utf-8');
    } catch(err) { return null; }
  }
  return null;
});
ipcMain.handle('show-notification', (e, title, body) => {
  if (Notification.isSupported()) {
    const n = new Notification({ title: title, body: body });
    n.on('click', () => { if (mainWindow && !mainWindow.isDestroyed()) { mainWindow.show(); mainWindow.focus(); } });
  }
});
ipcMain.handle('open-notif-settings', () => {
  const { shell } = require('electron');
  shell.openExternal('ms-settings:notifications');
});
ipcMain.handle('resize-window', (e, w, h) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.setSize(w, h);
  }
});
ipcMain.handle('quit-app', () => {
  app.isQuiting = true;
  if (tray && !tray.isDestroyed()) { tray.destroy(); tray = null; }
  if (mainWindow && !mainWindow.isDestroyed()) { mainWindow.close(); }
  app.exit(0); // 强制杀干净所有进程
});

// ========== 生命周期 ==========
app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => { /* 不退出，常驻托盘 */ });

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', () => {
  if (tray && !tray.isDestroyed()) { tray.destroy(); tray = null; }
});

app.on('second-instance', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
});

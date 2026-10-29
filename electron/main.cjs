const { app, BrowserWindow, ipcMain, dialog, Notification, Tray, Menu, powerMonitor } = require('electron');
const path = require('path');
const { execFile } = require('child_process');

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Resolve absolute System32 path on Windows to prevent any PATH environment variable issues
function getWindowsExePath(exeName) {
  if (process.platform === 'win32') {
    const windir = process.env.WINDIR || process.env.SystemRoot || 'C:\\Windows';
    return path.join(windir, 'System32', exeName);
  }
  return exeName;
}

// Fixed, strictly whitelist-controlled commands for Windows
const WINDOWS_COMMANDS = {
  shutdown: { exe: 'shutdown.exe', args: ['/s', '/t', '0'] },
  shutdownForce: { exe: 'shutdown.exe', args: ['/s', '/f', '/t', '0'] },
  restart: { exe: 'shutdown.exe', args: ['/r', '/t', '0'] },
  hibernate: { exe: 'shutdown.exe', args: ['/h'] },
  sleep: { exe: 'rundll32.exe', args: ['powrprof.dll,SetSuspendState', '0,1,0'] },
  lock: { exe: 'rundll32.exe', args: ['user32.dll,LockWorkStation'] },
  abort: { exe: 'shutdown.exe', args: ['/a'] }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 720,
    minWidth: 840,
    minHeight: 620,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#020617', // slate-950
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // Load either Vite dev server or built production files
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null);

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting && app.userSettingsCloseToTray) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:state-changed', { isMaximized: true });
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:state-changed', { isMaximized: false });
  });
}

// Setup IPC handlers
function setupIpcHandlers() {
  // Window controls
  ipcMain.handle('window:minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (!mainWindow) return false;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      return false;
    } else {
      mainWindow.maximize();
      return true;
    }
  });

  ipcMain.handle('window:close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.handle('window:is-maximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  // System info
  ipcMain.handle('system:get-info', () => {
    return {
      platform: process.platform,
      arch: process.arch,
      isElectron: true,
      isWindows: process.platform === 'win32',
      appVersion: app.getVersion(),
      electronVersion: process.versions.electron,
      nodeVersion: process.versions.node,
      isPackaged: app.isPackaged
    };
  });

  // Get system idle time in seconds using native Windows GetLastInputInfo via powerMonitor
  ipcMain.handle('system:get-idle-time', () => {
    try {
      if (powerMonitor && typeof powerMonitor.getSystemIdleTime === 'function') {
        return powerMonitor.getSystemIdleTime();
      }
      return 0;
    } catch {
      return 0;
    }
  });

  // Native notification
  ipcMain.handle('notification:show', (event, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({
        title: title || 'Windows Auto Shutdown Timer',
        body: body || '',
        silent: false
      }).show();
      return true;
    }
    return false;
  });

  // Execute system shutdown / power action
  ipcMain.handle('shutdown:execute', async (event, payload = {}) => {
    const { action = 'shutdown', force = false, isDryRun = false } = payload;
    const isWin = process.platform === 'win32';

    // Dry Run / Safe testing mode
    if (isDryRun) {
      const targetConfig = action === 'shutdown' && force
        ? WINDOWS_COMMANDS.shutdownForce
        : (WINDOWS_COMMANDS[action] || WINDOWS_COMMANDS.shutdown);
      const simulatedCommand = `${targetConfig.exe} ${targetConfig.args.join(' ')}`;

      return {
        success: true,
        dryRun: true,
        command: simulatedCommand,
        action,
        timestamp: new Date().toISOString(),
        message: `[TEST / DRY RUN] Command simulated: ${simulatedCommand}`
      };
    }

    // Windows OS real execution
    if (isWin) {
      let cmdConfig;
      if (action === 'restart') cmdConfig = WINDOWS_COMMANDS.restart;
      else if (action === 'hibernate') cmdConfig = WINDOWS_COMMANDS.hibernate;
      else if (action === 'sleep') cmdConfig = WINDOWS_COMMANDS.sleep;
      else if (action === 'lock') cmdConfig = WINDOWS_COMMANDS.lock;
      else if (force) cmdConfig = WINDOWS_COMMANDS.shutdownForce;
      else cmdConfig = WINDOWS_COMMANDS.shutdown;

      const fullCommandLine = `${cmdConfig.exe} ${cmdConfig.args.join(' ')}`;
      const targetExePath = getWindowsExePath(cmdConfig.exe);

      return new Promise((resolve) => {
        execFile(targetExePath, cmdConfig.args, { windowsHide: true }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Execution failed for ${action}: ${error.message}`);
            let friendlyError = error.message;
            const errText = ((stderr ? stderr.toString() : '') + ' ' + error.message).toLowerCase();

            if (action === 'hibernate' && (errText.includes('not supported') || errText.includes('not enabled') || errText.includes('hibernation') || errText.includes('disabled') || errText.includes('1124'))) {
              friendlyError = 'Windows-এ Hibernate বন্ধ আছে। চালু করতে Administrator CMD-তে চালান: powercfg.exe /h on (অথবা শাটডাউন/স্লিপ ব্যবহার করুন)';
            }

            resolve({
              success: false,
              error: friendlyError,
              stderr: stderr ? stderr.toString() : '',
              command: fullCommandLine,
              action,
              timestamp: new Date().toISOString()
            });
          } else {
            resolve({
              success: true,
              command: fullCommandLine,
              action,
              stdout: stdout ? stdout.toString() : '',
              timestamp: new Date().toISOString(),
              message: `System action '${action}' initiated successfully via Windows OS.`
            });
          }
        });
      });
    }

    // Non-Windows environment (e.g. Linux development / testing environment)
    return {
      success: true,
      nonWindowsDev: true,
      platform: process.platform,
      action,
      command: `[Non-Windows ${process.platform}] Simulating ${action} command`,
      timestamp: new Date().toISOString(),
      message: `Active on ${process.platform}. Real shutdown calls shutdown.exe on Windows OS.`
    };
  });

  // Abort any scheduled OS shutdown
  ipcMain.handle('shutdown:abort', async () => {
    if (process.platform === 'win32') {
      const cmd = WINDOWS_COMMANDS.abort;
      const targetAbortPath = getWindowsExePath(cmd.exe);
      return new Promise((resolve) => {
        execFile(targetAbortPath, cmd.args, { windowsHide: true }, (error, stdout, stderr) => {
          if (error) {
            // Error code 1116 means no shutdown was in progress, which is safe
            resolve({
              success: true,
              command: `${cmd.exe} ${cmd.args.join(' ')}`,
              noPendingShutdown: true,
              message: 'No pending OS shutdown was queued or shutdown was cancelled.'
            });
          } else {
            resolve({
              success: true,
              command: `${cmd.exe} ${cmd.args.join(' ')}`,
              message: 'Pending Windows shutdown request aborted successfully (shutdown /a).'
            });
          }
        });
      });
    }

    return {
      success: true,
      message: 'Shutdown timer cancelled (no OS request pending).'
    };
  });
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});

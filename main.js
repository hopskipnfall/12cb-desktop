const {
  app,
  BrowserWindow,
  protocol,
} = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 667,
    height: 627,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'electron-client/dist/electron-client/index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Open the DevTools.
  win.webContents.openDevTools();
}

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow);

app.whenReady().then(() => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    let url = request.url.substr('file://'.length); /* all urls start with 'file://' */
    console.error(`request for file=${url}. current path is ${__dirname}`);

    if (url.startsWith(__dirname)) {
      url = url.substring(__dirname.length);
    }

    // Kinda works.
    if (url === '/electron-client/dist/' || url.indexOf('electron-client/g/') != -1) {
      url = 'electron-client/dist/electron-client/index.html';
    }

    console.error(`repaired ${path.join(__dirname, url)}`);
    callback({ path: path.join(__dirname, url)});
  });
  createWindow();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Launch child process to run the local server.
const {
  fork
} = require('child_process');
const expressServerProcess = fork(path.join(__dirname, '/server/bin/www'));

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    expressServerProcess.kill();
    app.quit();
  }
});

app.on('quit', () => {
  expressServerProcess.kill();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

import { join } from 'path';
import { format } from 'url';

import { App } from 'browser-core';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as WebSocket from 'ws';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;
let cliqzApp: any;

function createWindow() {
  try {
    // Run Cliqz in Electron!
    cliqzApp = new App();
    global.CLIQZ = { app: cliqzApp };
    cliqzApp.start();
  } catch (ex) {
    console.error('exception', ex, ex.stack);
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: process.platform === 'darwin',
    height: 600,
    titleBarStyle: 'hidden-inset', // macOS only
    width: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(format({
    pathname: join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    app.quit();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Listen for async message from renderer process
ipcMain.on('getCliqzInfo', (event: any) => {
  const info = cliqzApp.modules['proxy-peer'].background.proxyPeer.httpLifeCycleHijack.socksProxy.server.address();
  event.sender.send('cliqzInfo', {
    proxyHost: info.address,
    proxyPort: info.port,
  });
});

// Listen for sync message from renderer process
// ipcMain.on('sync', (event, arg) => {
//   console.log('SYNC MESSAGE', arg);
//   // Send value synchronously back to renderer process
//   event.returnValue = 4;
//   // Send async message to renderer process
//   mainWindow.webContents.send('ping', 5);
// });

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {

    const message = JSON.parse(data);
    console.log('received: ', message);

    if (message.functionName === 'onBeforeRequest') {
      const response = CLIQZ.app.modules['webrequest-pipeline'].background.onBeforeRequest(...message.args);

      ws.send(JSON.stringify({
        response,
        responseId: message.uuid,
      }));
    }

  });

});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

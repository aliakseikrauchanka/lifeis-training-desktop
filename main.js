const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('node:path');

const { systemPreferences } = require('electron');


let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // win.loadFile('index.html')
  win.loadURL('https://lifeis-training.vercel.app/');
  // win.webContents.openDevTools();
  win.on('close', (e) => {
    e.preventDefault();
    win.hide();
  });
  // prevent from closing on Cmd + W
  win.setMenu(null);
}

async function requestMicAccess() {
  // Request access to the microphone
  const granted = await systemPreferences.askForMediaAccess('microphone');
  if (granted) {
    console.log('Microphone access granted.');
  } else {
    console.log('Microphone access denied.');
  }
}

app.whenReady().then(async () => {
  await requestMicAccess(); 

  globalShortcut.register('Alt+CommandOrControl+T', () => {
    win.show();
  });
  globalShortcut.register('Shift+CommandOrControl+W', () => {
    app.exit();
  });
}).then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
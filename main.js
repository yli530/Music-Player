const { app, BrowserWindow } = require('electron');
require("@electron/remote/main").initialize();

app.whenReady().then(() => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        width: 1280,
        height: 720,
        resizable: false,
        autoHideMenuBar: true
    })

    win.loadFile('index.html');

    // win.webContents.openDevTools();
})

app.on('browser-window-created', (_, window) => {
    require("@electron/remote/main").enable(window.webContents);
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})
const { app, BrowserWindow, ipcMain, autoUpdater, dialog } = require('electron');
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })
    win.webContents.openDevTools();
    win.loadFile('index.html')
}

let tasks = []
ipcMain.on("save-task", (event, task) => {
    tasks.push(task);
})

ipcMain.on("get-tasks", (event) => {
    event.sender.send("load-tasks", tasks);
})

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});


// **CHECK FOR UPDATES**
const server = "https://update.electronjs.org";
const feed = `${server}/jayram833/electron/${process.platform}-${process.arch}/${app.getVersion()}`;

autoUpdater.setFeedURL(feed);
autoUpdater.checkForUpdates();

// **EVENT LISTENERS**
autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new update is available. Downloading now...'
    });
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. The app will restart now to apply the update.'
    }).then(() => {
        autoUpdater.quitAndInstall();
    });
});



app.whenReady().then(() => {
    createWindow()
})
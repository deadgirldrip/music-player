const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 222,
        height: 365,
        resizable: false,
        frame: false,
        transparent: true,
        show: false,
        icon: path.join(__dirname, "assets/app-icon.png"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true
        }
    });

    win.loadFile("index.html");

    win.once("ready-to-show", () => {
    win.show();
});
}


ipcMain.on("resize-window", (event, {width, height}) => {
    if (!win) return;
    win.setSize(width, height, true);
});

ipcMain.on("close-app", () => {
    if (win) win.close();
});

ipcMain.on("minimize-app", () => {
    if (win) win.minimize();
});

app.whenReady().then(createWindow);

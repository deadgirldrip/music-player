const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
    resizeWindow: (width, height) => ipcRenderer.send("resize-window", {width, height}),
    closeApp: () => ipcRenderer.send("close-app"),
    minimizeApp: () => ipcRenderer.send("minimize-app")
});


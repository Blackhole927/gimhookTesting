const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

if (process.env.HTTP_PROXY) {
	app.commandLine.appendSwitch("proxy-server", process.env.HTTP_PROXY);
}

if (process.env.HTTPS_PROXY) {
	app.commandLine.appendSwitch("proxy-server", process.env.HTTPS_PROXY);
}

const createWindow = () => {
	const window = new BrowserWindow({
		width: 1280,
		height: 720,
		title: "Gimhook",
		webPreferences: {
			contextIsolation: false, // We need to disable context isolation so that gimhook will actually work
			preload: path.join(__dirname, "modloader.js")
		}
	});

	window.on("page-title-updated", (e) => {
		e.preventDefault();
	});

	window.removeMenu();

	window.openDevTools();

	window.loadURL("https://gimkit.com/me");
};

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
import { app, BrowserWindow } from 'electron';
import path from 'node:path';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
	? process.env.DIST
	: path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const isMac = process.platform !== 'darwin';

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
		title: 'Image Resizer',
		width: 500,
		height: 600,
	});

	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		win.loadFile(path.join(process.env.DIST, 'index.html'));
	}
}

app.on('window-all-closed', () => {
	if (isMac) {
		app.quit();
		win = null;
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);

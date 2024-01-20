import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
	BrowserWindow,
	Menu,
	MenuItem,
	MenuItemConstructorOptions,
	app,
	ipcMain,
	nativeImage,
	shell,
} from 'electron';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
	? process.env.DIST
	: path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const isMac = process.platform === 'darwin';
const isDev = !!import.meta.env.DEV;

type Options = { filePath: string; width: number; height: number; dest: string; isLast: boolean };

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			webSecurity: true,
			contextIsolation: true,
		},
		title: 'Image Resizer',
		width: isDev ? 1000 : 500,
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

// Menu template
const menu: (MenuItemConstructorOptions | MenuItem)[] = [{ role: 'fileMenu' }];

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

app.whenReady().then(() => {
	createWindow();

	const mainMenu = Menu.buildFromTemplate(menu);
	Menu.setApplicationMenu(mainMenu);

	if (isDev) {
		win?.webContents.openDevTools();
	}
});

async function resizeImage({ dest, filePath, height, width, isLast }: Options) {
	const fileName = path.basename(filePath);

	try {
		const newFile = nativeImage.createFromPath(filePath).resize({ height, width }).toPNG();

		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}

		fs.writeFileSync(path.join(dest, fileName), newFile);

		win?.webContents.send('image:done', isLast);

		if (isLast) {
			shell.openPath(dest);
		}
	} catch (error) {
		console.log('error:', error);
		win?.webContents.send('image:done', false, error, fileName);
	}
}

ipcMain.on('image:resize', (_, options) => {
	options.dest = path.join(os.homedir(), 'image-resizer');

	resizeImage({ ...options });
});

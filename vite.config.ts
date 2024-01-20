import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import viteTsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		viteTsConfigPaths(),
		electron({
			main: {
				entry: 'electron/main.ts',
			},
			preload: {
				input: path.join(__dirname, 'electron/preload.ts'),
			},
			renderer: {},
		}),
	],
});

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	root: resolve(here, 'src/web'),
	plugins: [react(), tailwindcss()],
	build: {
		outDir: resolve(here, 'dist/web'),
		emptyOutDir: true,
		sourcemap: true,
	},
	server: {
		port: 4318,
		proxy: {
			'/api/': {
				target: 'http://127.0.0.1:4317',
				changeOrigin: true,
			},
		},
	},
});

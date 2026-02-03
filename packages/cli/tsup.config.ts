import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: false,
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	bundle: true,
	splitting: false,
	outDir: 'dist',
	external: ['dotenv'],
	entry: ['index.ts'],
	banner: {
		js: '#!/usr/bin/env node',
	},
});

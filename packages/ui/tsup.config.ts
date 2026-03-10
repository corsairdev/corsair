import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	dts: true,
	clean: true,
	outDir: 'dist',
	external: [],
});

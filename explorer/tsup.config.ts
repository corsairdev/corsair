import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/cli.ts'],
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	dts: false,
	clean: true,
	outDir: 'dist',
});

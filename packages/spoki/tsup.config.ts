import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['index.ts'],
	format: ['esm'],
	dts: true,
	clean: true,
	target: 'esnext',
});

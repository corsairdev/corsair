import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['index.ts'],
	format: ['esm'],
	dts: false,
	clean: false,
	external: ['corsair', 'corsair/core', 'zod'],
});

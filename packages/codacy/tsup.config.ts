import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['index.ts'],
	format: ['esm'],
	dts: true,
	clean: true,
	external: ['corsair/*', 'zod'],
});

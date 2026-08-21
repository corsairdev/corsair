import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['index.ts'],
	format: ['esm'],
	dts: false,
	clean: false,
	sourcemap: true,
	external: ['corsair', 'corsair/core', 'corsair/http', 'zod'],
});

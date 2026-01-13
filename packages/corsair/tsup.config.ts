import { defineConfig } from 'tsup';

/**
 * Build strategy (Better Auth-style):
 * - Keep TS source imports extensionless (`moduleResolution: "bundler"`)
 * - Use a bundler to emit Node-compatible ESM in `dist/`
 * - Drive runtime resolution via `package.json#exports`
 */
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
	entry: [
		'index.ts',
		'core.ts',
		'orm.ts',
		'adapters/index.ts',
		'adapters/drizzle/index.ts',
		'adapters/kysely/index.ts',
		'adapters/prisma/index.ts',
		'plugins/slack/index.ts',
	],
});

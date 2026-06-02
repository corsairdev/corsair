import { defineConfig } from 'tsup';

export default defineConfig({
	clean: false,
	dts: false,
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	bundle: true,
	splitting: false,
	outDir: 'dist/server',
	entry: { index: 'src/server/index.ts' },
	external: [
		'corsair',
		'@corsair-dev/cli',
		'better-sqlite3',
		'kysely',
		'postgres',
	],
});

import { readFileSync } from 'node:fs';
import { load as parseYaml } from 'js-yaml';
import { defineConfig } from 'tsup';

// Esbuild plugin that inlines *.yaml files as plain JS objects at build time.
// This means no YAML parser is shipped to end-users at runtime.
const yamlPlugin = {
	name: 'yaml-loader',
	setup(build: any) {
		build.onLoad({ filter: /\.yaml$/ }, ({ path }: { path: string }) => {
			const src = readFileSync(path, 'utf-8');
			const parsed = parseYaml(src);
			return {
				contents: `export default ${JSON.stringify(parsed)}`,
				loader: 'js',
			};
		});
	},
};

export default defineConfig({
	clean: true,
	dts: { compilerOptions: { composite: false, incremental: false } },
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	bundle: true,
	splitting: true,
	minify: true,
	outDir: 'dist',
	external: [
		'kysely',
		'zod',
		'dotenv',
		'@modelcontextprotocol/sdk',
		'@ngrok/ngrok',
		'jiti',
		'better-sqlite3',
	],
	esbuildPlugins: [yamlPlugin],
	entry: [
		'index.ts',
		'core.ts',
		'db.ts',
		'mcp.ts',
		'orm.ts',
		'setup.ts',
		'http.ts',
		'tests.ts',
	],
});

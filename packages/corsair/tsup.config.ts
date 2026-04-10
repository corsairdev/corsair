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
		'convex',
	],
	esbuildPlugins: [yamlPlugin],
	entry: {
		'index': 'index.ts',
		'core': 'core.ts',
		'db': 'db.ts',
		'orm': 'orm.ts',
		'setup': 'setup.ts',
		'http': 'http.ts',
		'tests': 'tests.ts',
		'convex/schema': 'db/convex/schema.ts',
		'convex/integrations': 'db/convex/functions/integrations.ts',
		'convex/accounts': 'db/convex/functions/accounts.ts',
		'convex/entities': 'db/convex/functions/entities.ts',
		'convex/events': 'db/convex/functions/events.ts',
		'convex/permissions': 'db/convex/functions/permissions.ts',
	},
});

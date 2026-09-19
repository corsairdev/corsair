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

export default defineConfig([
	// Node build — the server SDK. Ships the __filename/__dirname shim so
	// frpc-binary.ts's createRequire(__filename) resolves. Neither build cleans:
	// they run concurrently, so a clean here would race and wipe the other's
	// output. The build script clears dist once up front.
	{
		clean: false,
		dts: { compilerOptions: { composite: false, incremental: false } },
		shims: true,
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
			'react',
			'@modelcontextprotocol/sdk',
			'@ngrok/ngrok',
			'jiti',
			'better-sqlite3',
			/^@corsair-dev\//,
		],
		esbuildPlugins: [yamlPlugin],
		entry: [
			'index.ts',
			'core.ts',
			'db.ts',
			'mcp.ts',
			'oauth.ts',
			'tunnel.ts',
			'hub.ts',
			'hub/tunnel/run-tunnel.ts',
			'orm.ts',
			'setup.ts',
			'http.ts',
			'tests.ts',
		],
	},
	// Browser build — the React client. Built on its own so it never shares a
	// chunk with the Node shim (fileURLToPath(import.meta.url) crashes in the
	// browser). shims:false + platform:browser keep the bundle Node-free; the
	// banner restores the 'use client' directive tsup would otherwise strip.
	{
		clean: false,
		dts: { compilerOptions: { composite: false, incremental: false } },
		shims: false,
		format: ['esm'],
		target: 'esnext',
		platform: 'browser',
		bundle: true,
		splitting: false,
		minify: true,
		// Single entry → tsup flattens to <outDir>/index.js, so target the nested
		// dir directly to land dist/client/react/index.js (matches package exports).
		outDir: 'dist/client/react',
		banner: { js: '"use client";' },
		external: ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
		esbuildPlugins: [yamlPlugin],
		entry: ['client/react/index.ts'],
	},
]);

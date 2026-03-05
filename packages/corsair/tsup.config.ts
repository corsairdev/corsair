import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: false,
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	bundle: true,
	splitting: false,
	outDir: 'dist',
	external: [
		'dotenv',
		'@modelcontextprotocol/sdk',
		'@ngrok/ngrok',
		'jiti',
		'better-sqlite3',
	],
	entry: [
		'index.ts',
		'core.ts',
		'db.ts',
		'mcp.ts',
		'orm.ts',
		'plugins/index.ts',
		'plugins/slack/index.ts',
		'plugins/linear/index.ts',
		'plugins/resend/index.ts',
		'plugins/posthog/index.ts',
		'plugins/github/index.ts',
		'plugins/spotify/index.ts',
		'plugins/cal/index.ts',
	],
});

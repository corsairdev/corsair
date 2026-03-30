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
		'plugins/airtable/index.ts',
		'plugins/amplitude/index.ts',
		'plugins/asana/index.ts',
		'plugins/box/index.ts',
		'plugins/cal/index.ts',
		'plugins/calendly/index.ts',
		'plugins/discord/index.ts',
		'plugins/dropbox/index.ts',
		'plugins/exa/index.ts',
		'plugins/fireflies/index.ts',
		'plugins/github/index.ts',
		'plugins/gmail/index.ts',
		'plugins/googlecalendar/index.ts',
		'plugins/googledrive/index.ts',
		'plugins/googlesheets/index.ts',
		'plugins/hackernews/index.ts',
		'plugins/hubspot/index.ts',
		'plugins/intercom/index.ts',
		'plugins/jira/index.ts',
		'plugins/linear/index.ts',
		'plugins/monday/index.ts',
		'plugins/notion/index.ts',
		'plugins/oura/index.ts',
		'plugins/pagerduty/index.ts',
		'plugins/posthog/index.ts',
		'plugins/resend/index.ts',
		'plugins/sentry/index.ts',
		'plugins/slack/index.ts',
		'plugins/spotify/index.ts',
		'plugins/stripe/index.ts',
		'plugins/tavily/index.ts',
		'plugins/telegram/index.ts',
		'plugins/todoist/index.ts',
		'plugins/trello/index.ts',
		'plugins/twitter/index.ts',
		'plugins/twitterapiio/index.ts',
		'plugins/zoom/index.ts',
	],
});

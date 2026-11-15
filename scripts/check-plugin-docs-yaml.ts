import path from 'node:path';
import {
	listPluginDirs,
	pluginDocsProblemsIn,
} from './plugin-docs-requirements.ts';

// The plugin-docs.yaml rule from validate:plugins, on its own. PR checks run it
// on the docs-only lane, which skips the install and so skips validate:plugins,
// while a docs-only PR is exactly the one that edits these files.
// Usage: node --experimental-strip-types scripts/check-plugin-docs-yaml.ts [plugin...]

const packagesDir = path.join(process.cwd(), 'packages');
const requested = process.argv.slice(2);
const plugins = requested.length > 0 ? requested : listPluginDirs(packagesDir);

let failed = 0;
for (const plugin of plugins) {
	for (const problem of pluginDocsProblemsIn(path.join(packagesDir, plugin))) {
		console.error(`[ERROR] [${plugin}] ${problem}`);
		failed++;
	}
}
if (failed > 0) {
	console.error(
		'Fix: give each plugin a displayName and description (see packages/slack/plugin-docs.yaml).',
	);
	process.exit(1);
}
console.log(`plugin-docs.yaml OK for ${plugins.length} plugin(s).`);

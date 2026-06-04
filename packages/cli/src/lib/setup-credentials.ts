import type { SetupCredentials } from 'corsair/setup';

const SETUP_FLAGS_WITH_VALUE = new Set(['--tenant', '-t', '--plugin', '-p']);

/**
 * Parses `corsair setup --<plugin> field=value ...` from argv (after "setup").
 * Supports `--plugin=<id>`, `--plugin <id>`, and `--<pluginId>` plugin selectors.
 */
export function parseSetupCredentials(
	rawArgs: readonly string[],
	pluginIds: readonly string[],
): SetupCredentials {
	const pluginSet = new Set(pluginIds);
	const result: SetupCredentials = {};
	let currentPlugin: string | null = null;

	for (let i = 0; i < rawArgs.length; i++) {
		const arg = rawArgs[i]!;

		if (arg === '--backfill' || arg === '-b' || arg === '-backfill') {
			continue;
		}

		if (SETUP_FLAGS_WITH_VALUE.has(arg)) {
			const value = rawArgs[++i];
			if (arg === '--plugin' || arg === '-p') {
				if (value && pluginSet.has(value)) {
					currentPlugin = value;
					result[value] ??= {};
				}
			}
			continue;
		}

		if (arg.startsWith('--tenant=') || arg.startsWith('-t=')) {
			continue;
		}

		if (arg.startsWith('--plugin=')) {
			const pluginId = arg.slice('--plugin='.length);
			if (pluginSet.has(pluginId)) {
				currentPlugin = pluginId;
				result[pluginId] ??= {};
			}
			continue;
		}

		if (arg.startsWith('--')) {
			const flagBody = arg.slice(2);
			const eqIdx = flagBody.indexOf('=');
			if (eqIdx > 0) {
				const name = flagBody.slice(0, eqIdx);
				const value = flagBody.slice(eqIdx + 1);
				if (name === 'plugin' && pluginSet.has(value)) {
					currentPlugin = value;
					result[value] ??= {};
				}
				continue;
			}
			if (pluginSet.has(flagBody)) {
				currentPlugin = flagBody;
				result[flagBody] ??= {};
			}
			continue;
		}

		const eqIdx = arg.indexOf('=');
		if (eqIdx <= 0) continue;

		const field = arg.slice(0, eqIdx);
		const value = arg.slice(eqIdx + 1);
		if (!field || !value || !currentPlugin) continue;

		const bucket = (result[currentPlugin] ??= {});
		bucket[field] = value;
	}

	return result;
}

export function getSetupRawArgs(argv: string[] = process.argv): string[] {
	const setupIdx = argv.indexOf('setup');
	return setupIdx >= 0 ? argv.slice(setupIdx + 1) : [];
}

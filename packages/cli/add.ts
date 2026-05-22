import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Source of truth: packages/corsair/core/constants.ts
// Kept in sync with BaseProviders from corsair/core.
const KNOWN_PLUGINS = [
	'ably',
	'airtable',
	'amplitude',
	'asana',
	'box',
	'cal',
	'calendly',
	'cloudflare',
	'cursor',
	'discord',
	'dodopayments',
	'dropbox',
	'exa',
	'figma',
	'firecrawl',
	'fireflies',
	'github',
	'gitlab',
	'gmail',
	'googlecalendar',
	'googledrive',
	'googlesheets',
	'hackernews',
	'hubspot',
	'intercom',
	'jira',
	'linear',
	'monday',
	'notion',
	'onedrive',
	'openweathermap',
	'oura',
	'outlook',
	'pagerduty',
	'posthog',
	'razorpay',
	'reddit',
	'resend',
	'sentry',
	'sharepoint',
	'slack',
	'spotify',
	'strava',
	'stripe',
	'tavily',
	'teams',
	'telegram',
	'todoist',
	'trello',
	'twitter',
	'twitterapiio',
	'typeform',
	'vapi',
	'xquik',
	'youtube',
	'zoom',
] as const;

type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun';

export type AddOptions = {
	plugin: string;
	dryRun?: boolean;
	skipInstall?: boolean;
	skipConfig?: boolean;
};

type ResolvedPlugin = {
	package: string;
	id: string;
};

function detectPackageManager(cwd: string): PackageManager {
	if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
	if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
	if (
		fs.existsSync(path.join(cwd, 'bun.lockb')) ||
		fs.existsSync(path.join(cwd, 'bun.lock'))
	)
		return 'bun';
	if (fs.existsSync(path.join(cwd, 'package-lock.json'))) return 'npm';
	return 'pnpm';
}

function installCommand(pm: PackageManager, pkg: string): string {
	switch (pm) {
		case 'pnpm':
			return `pnpm add ${pkg}`;
		case 'yarn':
			return `yarn add ${pkg}`;
		case 'npm':
			return `npm install ${pkg}`;
		case 'bun':
			return `bun add ${pkg}`;
	}
}

function resolvePluginPackage(pluginId: string): ResolvedPlugin | null {
	const normalised = pluginId.toLowerCase().replace(/^@corsair-dev\//, '');
	if (KNOWN_PLUGINS.includes(normalised as (typeof KNOWN_PLUGINS)[number])) {
		return { package: `@corsair-dev/${normalised}`, id: normalised };
	}
	return null;
}

const configPaths = [
	'corsair.ts',
	'corsair.tsx',
	'src/corsair.ts',
	'src/corsair.tsx',
	'lib/corsair.ts',
	'lib/corsair.tsx',
	'server/corsair.ts',
	'server/corsair.tsx',
];

function findConfigPath(cwd: string): string | null {
	for (const p of configPaths) {
		const full = path.join(cwd, p);
		if (fs.existsSync(full)) return full;
	}
	return null;
}

function findClosingBracket(source: string, openIndex: number): number {
	let depth = 0;
	for (let i = openIndex; i < source.length; i++) {
		if (source[i] === '[') depth++;
		else if (source[i] === ']') {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

function updateConfig(
	configPath: string,
	pluginId: string,
): { updated: boolean; reason?: string } {
	const source = fs.readFileSync(configPath, 'utf-8');
	const importName = pluginId;
	const packageName = `@corsair-dev/${pluginId}`;

	// Already registered? Use word-boundary-aware match to avoid false positives
	// (e.g. 'cal' matching 'local(' or 'box' matching 'sandbox(')
	const registeredRegex = new RegExp(`\\b${importName}\\s*\\(`);
	if (registeredRegex.test(source)) {
		return {
			updated: false,
			reason: `Plugin '${pluginId}' is already registered in ${path.basename(configPath)}`,
		};
	}

	// Check if import already exists
	const importRegex = new RegExp(
		`import\\s+\\{([^}]*?)\\}\\s+from\\s+['"]${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
	);
	const hasImport = importRegex.test(source);

	let newSource = source;

	// Add import if missing
	if (!hasImport) {
		// Try adding after the last import line
		const importLines = source.match(/^import\s+.+$/gm);
		if (importLines && importLines.length > 0) {
			const lastImport = importLines[importLines.length - 1];
			const lastImportIndex = source.lastIndexOf(lastImport!);
			const insertPos = lastImportIndex + lastImport!.length;
			newSource = `${newSource.slice(0, insertPos)}\nimport { ${importName} } from '${packageName}';${newSource.slice(insertPos)}`;
		} else {
			// No imports found — add at top
			newSource = `import { ${importName} } from '${packageName}';\n${newSource}`;
		}
	}

	// Add to plugins array using bracket-counting to handle nested brackets
	// (e.g. vapi({ scopes: ['a', 'b'] }) won't break the parser)
	const pluginsKey = newSource.indexOf('plugins:');
	if (pluginsKey === -1) {
		return {
			updated: false,
			reason: 'Could not find plugins key in config. Add it manually.',
		};
	}

	const bracketStart = newSource.indexOf('[', pluginsKey);
	if (bracketStart === -1) {
		return {
			updated: false,
			reason: 'Could not find plugins array opening bracket. Add it manually.',
		};
	}

	const bracketEnd = findClosingBracket(newSource, bracketStart);
	if (bracketEnd === -1) {
		return {
			updated: false,
			reason: 'Could not find plugins array closing bracket. Add it manually.',
		};
	}

	const arrayContent = newSource.slice(bracketStart + 1, bracketEnd);
	const trimmedContent = arrayContent.trim();

	let newContent: string;
	if (!trimmedContent) {
		newContent = `${importName}()`;
	} else if (trimmedContent.endsWith(',')) {
		newContent = `${arrayContent} ${importName}()`;
	} else {
		newContent = `${arrayContent}, ${importName}()`;
	}

	newSource = `${newSource.slice(0, bracketStart + 1)}${newContent}${newSource.slice(bracketEnd)}`;

	fs.writeFileSync(configPath, newSource, 'utf-8');
	return { updated: true };
}

export async function runAdd(options: AddOptions): Promise<void> {
	const { plugin, dryRun, skipInstall, skipConfig } = options;
	const cwd = process.cwd();

	// Validate plugin id
	const resolved = resolvePluginPackage(plugin);
	if (!resolved) {
		console.error(`[#corsair]: Unknown plugin '${plugin}'.`);
		console.error(`[#corsair]: Known plugins: ${KNOWN_PLUGINS.join(', ')}`);
		process.exit(1);
	}

	const { package: pkg, id: pluginId } = resolved;
	const pm = detectPackageManager(cwd);
	const installCmd = installCommand(pm, pkg);
	const configPath = findConfigPath(cwd);

	// Summary
	console.log(`[#corsair]: Plugin: ${pluginId}`);
	console.log(`[#corsair]: Package: ${pkg}`);
	console.log(`[#corsair]: Package manager: ${pm}`);
	if (configPath) {
		console.log(`[#corsair]: Config: ${path.relative(cwd, configPath)}`);
	}

	if (dryRun) {
		console.log('');
		console.log('[#corsair]: Dry run — no changes made.');
		console.log('');
		if (!skipInstall) {
			console.log('  Would run:');
			console.log(`    ${installCmd}`);
		}
		if (!skipConfig && configPath) {
			console.log(`  Would update: ${path.relative(cwd, configPath)}`);
			console.log(`    - Add import: import { ${pluginId} } from '${pkg}';`);
			console.log(`    - Add to plugins: ${pluginId}()`);
		}
		console.log('');
		return;
	}

	// Install
	if (!skipInstall) {
		console.log('');
		console.log(`[#corsair]: Installing ${pkg}...`);
		try {
			execSync(installCmd, { cwd, stdio: 'inherit' });
			console.log(`[#corsair]: Installed ${pkg}.`);
		} catch {
			console.error(`[#corsair]: Failed to install ${pkg}.`);
			console.error(`[#corsair]: Try running manually: ${installCmd}`);
			process.exit(1);
		}
	}

	// Update config
	if (!skipConfig) {
		if (!configPath) {
			console.log('');
			console.log('[#corsair]: No corsair.ts found. Create one manually:');
			console.log('');
			console.log(`  import { createCorsair } from 'corsair';`);
			console.log(`  import { ${pluginId} } from '${pkg}';`);
			console.log('');
			console.log(`  export const corsair = createCorsair({`);
			console.log(`    plugins: [${pluginId}()],`);
			console.log(`  });`);
			console.log('');
		} else {
			const result = updateConfig(configPath, pluginId);
			if (result.updated) {
				console.log(
					`[#corsair]: Updated ${path.relative(cwd, configPath)} with ${pluginId} plugin.`,
				);
			} else {
				console.log(`[#corsair]: ${result.reason}`);
			}
		}
	}

	// Next steps
	console.log('');
	console.log('[#corsair]: Next steps:');
	console.log(
		`  1. Run 'corsair auth --plugin=${pluginId}' to set up credentials.`,
	);
	console.log(
		`  2. Visit https://docs.corsair.dev/plugins/${pluginId} for setup guide.`,
	);
	console.log('');
}

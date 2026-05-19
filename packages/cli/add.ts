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

function resolvePluginPackage(pluginId: string): string | null {
	const normalised = pluginId.toLowerCase().replace(/^@corsair-dev\//, '');
	if (KNOWN_PLUGINS.includes(normalised as (typeof KNOWN_PLUGINS)[number])) {
		return `@corsair-dev/${normalised}`;
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

function updateConfig(
	configPath: string,
	pluginId: string,
): { updated: boolean; reason?: string } {
	const source = fs.readFileSync(configPath, 'utf-8');
	const importName = pluginId;
	const packageName = `@corsair-dev/${pluginId}`;

	// Already registered?
	if (
		source.includes(`${importName}(`) ||
		source.includes(`${importName} ()`)
	) {
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

	// Add to plugins array
	// Match: plugins: [ ... ] or plugins:[ ... ]
	const pluginsRegex = /(plugins\s*:\s*\[)([^\]]*)(\])/;
	const pluginsMatch = newSource.match(pluginsRegex);

	if (pluginsMatch) {
		const existing = pluginsMatch[2] ?? '';
		const trimmedExisting = existing.trim();
		let newPlugins: string;

		if (!trimmedExisting) {
			newPlugins = `${importName}()`;
		} else if (trimmedExisting.endsWith(',')) {
			newPlugins = `${existing} ${importName}()`;
		} else {
			newPlugins = `${existing}, ${importName}()`;
		}

		newSource = newSource.replace(pluginsRegex, `$1${newPlugins}$3`);
	} else {
		return {
			updated: false,
			reason: 'Could not find plugins array in config. Add it manually.',
		};
	}

	fs.writeFileSync(configPath, newSource, 'utf-8');
	return { updated: true };
}

export async function runAdd(options: AddOptions): Promise<void> {
	const { plugin, dryRun, skipInstall, skipConfig } = options;
	const cwd = process.cwd();

	// Validate plugin id
	const pkg = resolvePluginPackage(plugin);
	if (!pkg) {
		console.error(`[#corsair]: Unknown plugin '${plugin}'.`);
		console.error(`[#corsair]: Known plugins: ${KNOWN_PLUGINS.join(', ')}`);
		process.exit(1);
	}

	const pm = detectPackageManager(cwd);
	const installCmd = installCommand(pm, pkg);
	const configPath = findConfigPath(cwd);

	// Summary
	console.log(`[#corsair]: Plugin: ${plugin}`);
	console.log(`[#corsair]: Package: ${pkg}`);
	console.log(`[#corsair]: Package manager: ${pm}`);
	if (configPath) {
		console.log(`[#corsair]: Config: ${path.relative(cwd, configPath)}`);
	}

	if (dryRun) {
		console.log('');
		console.log('[#corsair]: Dry run — no changes made.');
		console.log('');
		console.log('  Would run:');
		console.log(`    ${installCmd}`);
		if (configPath) {
			console.log(`  Would update: ${path.relative(cwd, configPath)}`);
			console.log(`    - Add import: import { ${plugin} } from '${pkg}';`);
			console.log(`    - Add to plugins: ${plugin}()`);
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
			console.log(`  import { ${plugin} } from '${pkg}';`);
			console.log('');
			console.log(`  export const corsair = createCorsair({`);
			console.log(`    plugins: [${plugin}()],`);
			console.log(`  });`);
			console.log('');
		} else {
			const result = updateConfig(configPath, plugin);
			if (result.updated) {
				console.log(
					`[#corsair]: Updated ${path.relative(cwd, configPath)} with ${plugin} plugin.`,
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
		`  1. Run 'corsair auth --plugin=${plugin}' to set up credentials.`,
	);
	console.log(
		`  2. Visit https://docs.corsair.dev/plugins/${plugin} for setup guide.`,
	);
	console.log('');
}

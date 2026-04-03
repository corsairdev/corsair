import fs, { existsSync } from 'node:fs';
import path from 'node:path';
// @ts-expect-error
import babelPresetReact from '@babel/preset-react';
// @ts-expect-error
import babelPresetTypeScript from '@babel/preset-typescript';
import { loadConfig } from 'c12';
import type { JitiOptions } from 'jiti';
import { getTsconfigInfo } from './get-tsconfig-info';

// Possible locations for corsair.ts
const possiblePaths = [
	'corsair.ts',
	'corsair.tsx',
	'corsair.js',
	'corsair.jsx',
	'src/corsair.ts',
	'src/corsair.tsx',
	'src/corsair.js',
	'src/corsair.jsx',
	'lib/corsair.ts',
	'lib/corsair.tsx',
	'lib/corsair.js',
	'lib/corsair.jsx',
	'server/corsair.ts',
	'server/corsair.tsx',
	'server/corsair.js',
	'server/corsair.jsx',
	'src/server/corsair.ts',
	'src/server/corsair.tsx',
	'src/server/corsair.js',
	'src/server/corsair.jsx',
	'app/corsair.ts',
	'app/corsair.tsx',
	'app/corsair.js',
	'app/corsair.jsx',
	'corsair/index.ts',
	'corsair/index.tsx',
	'corsair/index.js',
	'corsair/index.jsx',
];

function resolveReferencePath(configDir: string, refPath: string): string {
	const resolvedPath = path.resolve(configDir, refPath);

	// If it ends with .json, treat as direct file reference
	if (refPath.endsWith('.json')) {
		return resolvedPath;
	}

	// If the exact path exists and is a file, use it
	if (fs.existsSync(resolvedPath)) {
		try {
			const stats = fs.statSync(resolvedPath);
			if (stats.isFile()) {
				return resolvedPath;
			}
		} catch {
			// Fall through to directory handling
		}
	}

	// Otherwise, assume directory reference
	return path.resolve(configDir, refPath, 'tsconfig.json');
}

function getPathAliasesRecursive(
	tsconfigPath: string,
	visited = new Set<string>(),
): Record<string, string> {
	if (visited.has(tsconfigPath)) {
		return {};
	}
	visited.add(tsconfigPath);

	if (!fs.existsSync(tsconfigPath)) {
		console.warn(`Referenced tsconfig not found: ${tsconfigPath}`);
		return {};
	}

	try {
		const tsConfig = getTsconfigInfo(undefined, tsconfigPath);
		const { paths = {}, baseUrl = '.' } = tsConfig.compilerOptions || {};
		const result: Record<string, string> = {};

		const configDir = path.dirname(tsconfigPath);
		const obj = Object.entries(paths) as [string, string[]][];
		for (const [alias, aliasPaths] of obj) {
			for (const aliasedPath of aliasPaths) {
				const resolvedBaseUrl = path.resolve(configDir, baseUrl);
				const finalAlias = alias.slice(-1) === '*' ? alias.slice(0, -1) : alias;
				const finalAliasedPath =
					aliasedPath.slice(-1) === '*'
						? aliasedPath.slice(0, -1)
						: aliasedPath;

				result[finalAlias || ''] = path.join(resolvedBaseUrl, finalAliasedPath);
			}
		}

		if (tsConfig.references) {
			for (const ref of tsConfig.references) {
				const refPath = resolveReferencePath(configDir, ref.path);
				const refAliases = getPathAliasesRecursive(refPath, visited);
				for (const [alias, aliasPath] of Object.entries(refAliases)) {
					if (!(alias in result)) {
						result[alias] = aliasPath;
					}
				}
			}
		}

		return result;
	} catch (error) {
		console.warn(`Error parsing tsconfig at ${tsconfigPath}: ${error}`);
		return {};
	}
}

function getPathAliases(cwd: string): Record<string, string> | null {
	const tsConfigPath = path.join(cwd, 'tsconfig.json');
	if (!fs.existsSync(tsConfigPath)) {
		return null;
	}
	try {
		const result = getPathAliasesRecursive(tsConfigPath);
		return result;
	} catch (error) {
		console.error(error);
		throw new Error('Error parsing tsconfig.json');
	}
}

/**
 * Configure jiti options for TypeScript/TSX support
 */
const jitiOptions = (cwd: string): JitiOptions => {
	const alias = getPathAliases(cwd) || {};
	return {
		transformOptions: {
			babel: {
				presets: [
					[
						babelPresetTypeScript,
						{
							isTSX: true,
							allExtensions: true,
						},
					],
					[babelPresetReact, { runtime: 'automatic' }],
				],
			},
		},
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias,
	};
};

/**
 * Check if the exported object is a Corsair instance
 * A CorsairTenantWrapper has a `withTenant` method
 * A CorsairClient has plugin namespaces as properties
 */
const isCorsairInstance = (object: unknown): boolean => {
	if (typeof object !== 'object' || object === null || Array.isArray(object)) {
		return false;
	}

	// Check for CorsairTenantWrapper (has withTenant method)
	if ('withTenant' in object && typeof object.withTenant === 'function') {
		return true;
	}

	// Check for CorsairClient (has plugin properties)
	// A CorsairClient will have at least one plugin namespace
	return Object.keys(object).length > 0;
};

type CorsairInstance = {
	multiTenancy: boolean;
};

/**
 * Find the corsair config file path
 */
export function findCorsairConfigPath(cwd: string): string | null {
	for (const possiblePath of possiblePaths) {
		const fullPath = path.join(cwd, possiblePath);
		if (existsSync(fullPath)) {
			return fullPath;
		}
	}
	return null;
}

/**
 * Get the Corsair instance from the developer's codebase.
 * Searches for corsair.ts in common locations and loads it using c12.
 *
 * @example
 * ```ts
 * const instance = await getCorsairInstance({
 *   cwd: process.cwd(),
 * });
 *
 * // For multi-tenant setups
 * if ('withTenant' in instance) {
 *   const tenant = instance.withTenant('tenant_123');
 *   // Use tenant...
 * }
 * ```
 *
 * @param options - Configuration options
 * @param options.cwd - Current working directory to search from
 * @param options.configPath - Optional explicit path to corsair.ts file
 * @param options.shouldThrowOnError - If true, throws errors instead of exiting process
 * @returns The Corsair instance (CorsairClient or CorsairTenantWrapper)
 */
export async function getCorsairInstance({
	cwd,
	configPath,
	shouldThrowOnError = false,
}: {
	cwd: string;
	configPath?: string;
	shouldThrowOnError?: boolean;
}) {
	try {
		let corsairInstance: unknown | null = null;

		if (configPath) {
			let resolvedPath: string = path.join(cwd, configPath);
			if (existsSync(configPath)) {
				resolvedPath = configPath; // If the configPath is a file, use it as is
			}
			const { config } = await loadConfig<
				| {
						corsair: unknown;
				  }
				| {
						default: unknown;
				  }
			>({
				configFile: resolvedPath,
				dotenv: true,
				jitiOptions: jitiOptions(cwd),
				cwd,
			});

			if ('corsair' in config && isCorsairInstance(config.corsair)) {
				corsairInstance = config.corsair;
			} else if ('default' in config && isCorsairInstance(config.default)) {
				corsairInstance = config.default;
			} else {
				if (shouldThrowOnError) {
					throw new Error(
						`Couldn't read your Corsair instance in ${resolvedPath}. Make sure to export your Corsair instance as a variable named 'corsair' or as the default export.`,
					);
				}
				console.error(
					`[#corsair]: Couldn't read your Corsair instance in ${resolvedPath}. Make sure to export your Corsair instance as a variable named 'corsair' or as the default export.`,
				);
				process.exit(1);
			}
		}

		if (!corsairInstance) {
			for (const possiblePath of possiblePaths) {
				try {
					const { config } = await loadConfig<{
						corsair?: unknown;
						default?: unknown;
					}>({
						configFile: possiblePath,
						jitiOptions: jitiOptions(cwd),
						cwd,
					});

					const hasConfig = Object.keys(config).length > 0;
					if (hasConfig) {
						if ('corsair' in config && isCorsairInstance(config.corsair)) {
							corsairInstance = config.corsair;
						} else if (
							'default' in config &&
							isCorsairInstance(config.default)
						) {
							corsairInstance = config.default;
						}

						if (!corsairInstance) {
							if (shouldThrowOnError) {
								throw new Error(
									"Couldn't read your Corsair instance. Make sure to export your Corsair instance as a variable named 'corsair' or as the default export.",
								);
							}
							console.error("[#corsair]: Couldn't read your Corsair instance.");
							console.log('');
							console.log(
								"[#corsair]: Make sure to export your Corsair instance as a variable named 'corsair' or as the default export.",
							);
							process.exit(1);
						}
						break;
					}
				} catch (e) {
					if (
						typeof e === 'object' &&
						e &&
						'message' in e &&
						typeof e.message === 'string' &&
						e.message.includes(
							'This module cannot be imported from a Client Component module',
						)
					) {
						if (shouldThrowOnError) {
							throw new Error(
								`Please remove import 'server-only' from your corsair.ts file temporarily. The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
							);
						}
						console.error(
							`Please remove import 'server-only' from your corsair.ts file temporarily. The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
						);
						process.exit(1);
					}
					// c12 returns empty config (no throw) when a file doesn't exist,
					// so any exception here means the file was found but failed to load.
					const msg =
						typeof e === 'object' && e && 'message' in e && typeof e.message === 'string'
							? e.message
							: String(e);
					if (
						msg.includes('Could not locate the bindings file') ||
						msg.includes('NODE_MODULE_VERSION') ||
						msg.includes('.node')
					) {
						if (shouldThrowOnError) {
							throw new Error(
								`Native module error in ${possiblePath}: ${msg}\n\nThis is likely because a native Node.js addon (e.g. better-sqlite3) needs to be rebuilt for your current Node.js version. Try running:\n  npm rebuild\nor reinstall your dependencies:\n  rm -rf node_modules && npm install`,
							);
						}
						console.error(`[#corsair]: Error loading ${possiblePath}: Native module binding not found.`);
						console.log('');
						console.log('[#corsair]: A native Node.js addon (e.g. better-sqlite3) needs to be rebuilt for your current Node.js version.');
						console.log('[#corsair]: Try running:');
						console.log('  npm rebuild');
						console.log('[#corsair]: Or reinstall your dependencies:');
						console.log('  rm -rf node_modules && npm install');
						process.exit(1);
					}
					if (shouldThrowOnError) {
						throw e;
					}
					console.error(`[#corsair]: Error loading ${possiblePath}:`, msg);
					process.exit(1);
				}
			}
		}

		if (!corsairInstance) {
			if (shouldThrowOnError) {
				throw new Error(
					"Couldn't find corsair.ts in your project. Make sure you have a corsair.ts file in your project root or in src/, lib/, or server/ directories.",
				);
			}
			console.error("[#corsair]: Couldn't find corsair.ts in your project.");
			console.log('');
			console.log(
				'[#corsair]: Make sure you have a corsair.ts file in your project root or in src/, lib/, or server/ directories.',
			);
			process.exit(1);
		}

		return corsairInstance;
	} catch (e) {
		if (
			typeof e === 'object' &&
			e &&
			'message' in e &&
			typeof e.message === 'string' &&
			e.message.includes(
				'This module cannot be imported from a Client Component module',
			)
		) {
			if (shouldThrowOnError) {
				throw new Error(
					`Please remove import 'server-only' from your corsair.ts file temporarily. The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
				);
			}
			console.error(
				`Please remove import 'server-only' from your corsair.ts file temporarily. The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
			);
			process.exit(1);
		}
		if (shouldThrowOnError) {
			throw e;
		}

		console.error("Couldn't read your Corsair instance.", e);
		process.exit(1);
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Arg parsing
// ─────────────────────────────────────────────────────────────────────────────

const RESERVED_FLAGS = new Set(['backfill', 'help', 'h']);

// ─────────────────────────────────────────────────────────────────────────────
// Instance helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves a corsair instance to a concrete client.
 * For multi-tenant instances, requires a tenant ID.
 */
function resolveClient(
	instance: unknown,
	tenant: string | undefined,
): Record<string, unknown> {
	const obj = instance as Record<string, unknown>;
	if ('withTenant' in obj && typeof obj.withTenant === 'function') {
		if (!tenant) {
			console.error('[#corsair]: This is a multi-tenant instance. Pass --tenant=<id>.');
			process.exit(1);
		}
		return obj.withTenant(tenant) as Record<string, unknown>;
	}
	return obj;
}

/**
 * Navigates a dot-notation path on the corsair client and returns the function.
 * Strips the 'api' namespace marker that list_operations adds (e.g. slack.api.messages.post → slack.messages.post).
 */
function navigateToEndpoint(
	client: Record<string, unknown>,
	path: string,
): ((...args: unknown[]) => Promise<unknown>) | undefined {
	const parts = path.split('.');
	let current: unknown = client;
	for (const part of parts) {
		if (current === null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[part];
	}
	return typeof current === 'function'
		? (current as (...args: unknown[]) => Promise<unknown>)
		: undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Arg parsers
// ─────────────────────────────────────────────────────────────────────────────

function parseListArgs(args: string[]): {
	plugin?: string;
	type?: 'api' | 'webhooks' | 'db';
} {
	let plugin: string | undefined;
	let type: 'api' | 'webhooks' | 'db' | undefined;

	for (const arg of args) {
		const eqIdx = arg.indexOf('=');
		if (arg.startsWith('--') && eqIdx !== -1) {
			const key = arg.slice(2, eqIdx);
			const value = arg.slice(eqIdx + 1);
			if (key === 'plugin') { plugin = value; continue; }
			if (key === 'type' && (value === 'api' || value === 'webhooks' || value === 'db')) {
				type = value;
				continue;
			}
		}
	}

	return { plugin, type };
}

function parseAuthArgs(args: string[]): {
	pluginId?: string;
	tenantId?: string;
	code?: string;
	credentials?: boolean;
} {
	let pluginId: string | undefined;
	let tenantId: string | undefined;
	let code: string | undefined;
	let credentials = false;

	for (const arg of args) {
		if (arg === '--credentials') { credentials = true; continue; }

		const eqIdx = arg.indexOf('=');
		if (arg.startsWith('--') && eqIdx !== -1) {
			const key = arg.slice(2, eqIdx);
			const value = arg.slice(eqIdx + 1);
			if (key === 'plugin') { pluginId = value; continue; }
			if (key === 'tenant') { tenantId = value; continue; }
			if (key === 'code') { code = value; continue; }
		}
	}

	return { pluginId, tenantId, code, credentials };
}

function parseSetupArgs(args: string[]): {
	backfill: boolean;
	credentials: Record<string, Record<string, string>>;
} {
	let backfill = false;
	const credentials: Record<string, Record<string, string>> = {};
	let currentPlugin: string | null = null;

	for (const arg of args) {
		if (arg === '--backfill' || arg === '-backfill') {
			backfill = true;
			currentPlugin = null;
			continue;
		}

		if (arg.startsWith('--')) {
			const name = arg.slice(2);
			if (RESERVED_FLAGS.has(name)) continue;
			currentPlugin = name;
			credentials[currentPlugin] = {};
			continue;
		}

		if (currentPlugin && arg.includes('=')) {
			const eqIdx = arg.indexOf('=');
			const field = arg.slice(0, eqIdx);
			const value = arg.slice(eqIdx + 1);
			credentials[currentPlugin]![field] = value;
		}
	}

	return { backfill, credentials };
}

function parseRunArgs(args: string[]): {
	path: string | undefined;
	input: string | undefined;
	tenant: string | undefined;
} {
	let endpointPath: string | undefined;
	let input: string | undefined;
	let tenant: string | undefined;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]!;
		if (arg === '--tenant' && args[i + 1]) {
			tenant = args[++i];
		} else if (arg.startsWith('--tenant=')) {
			tenant = arg.slice('--tenant='.length);
		} else if (arg === '--input' && args[i + 1]) {
			input = args[++i];
		} else if (arg.startsWith('--input=')) {
			input = arg.slice('--input='.length);
		} else if (!arg.startsWith('-')) {
			if (!endpointPath) endpointPath = arg;
			else if (!input) input = arg;
		}
	}

	return { path: endpointPath, input, tenant };
}

function parseScriptArgs(args: string[]): {
	code: string | undefined;
	tenant: string | undefined;
} {
	let code: string | undefined;
	let tenant: string | undefined;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]!;
		if (arg === '--code' && args[i + 1]) {
			code = args[++i];
		} else if (arg.startsWith('--code=')) {
			code = arg.slice('--code='.length);
		} else if (arg === '--tenant' && args[i + 1]) {
			tenant = args[++i];
		} else if (arg.startsWith('--tenant=')) {
			tenant = arg.slice('--tenant='.length);
		}
	}

	return { code, tenant };
}

// ─────────────────────────────────────────────────────────────────────────────
// Help
// ─────────────────────────────────────────────────────────────────────────────

function printHelp() {
	console.log('[#corsair]: Corsair CLI\n');
	console.log('Commands:');
	console.log('  corsair setup                                   Initialize your Corsair instance');
	console.log('  corsair setup -backfill                         Initialize and backfill initial data');
	console.log('  corsair setup --<plugin> <field>=VALUE ...      Set credentials for a plugin');
	console.log('');
	console.log('  corsair auth --plugin=<id>                      Start OAuth flow (outputs auth URL as JSON)');
	console.log('  corsair auth --plugin=<id> --code=<code>        Exchange OAuth code for tokens');
	console.log('  corsair auth --plugin=<id> --credentials        Show current credential status');
	console.log('');
	console.log('  corsair list                                     List all API endpoint paths across all plugins');
	console.log('  corsair list --plugin=<id>                      List paths for a specific plugin');
	console.log('  corsair list --type=api|webhooks|db             Filter by operation type (default: api)');
	console.log('  corsair list --plugin=<id> --type=<type>        Combine plugin + type filters');
	console.log('');
	console.log('  corsair schema <path>                           Show schema for an endpoint, webhook, or DB entity');
	console.log('  corsair schema slack.api.messages.post          Example: API endpoint schema');
	console.log('  corsair schema slack.webhooks.messages.message  Example: webhook schema');
	console.log('  corsair schema slack.db.messages.search         Example: DB search schema');
	console.log('');
	console.log('  corsair run <path> [input-json]                 Call an API endpoint and print the result');
	console.log('  corsair run slack.api.channels.list             Example: no input needed');
	console.log('  corsair run slack.api.messages.post \'{"channel":"C123","text":"hi"}\'');
	console.log('  corsair run <path> [input-json] --tenant=<id>   Multi-tenant variant');
	console.log('');
	console.log('  corsair script --code "<js>"                    Run a sandboxed script with corsair injected');
	console.log('  corsair script --code "<js>" --tenant=<id>      Multi-tenant variant');
	console.log('  # corsair is pre-injected; use return to output a value:');
	console.log('  # --code "const r = await corsair.slack.api.channels.list(); return r.channels.find(c => c.name === \'general\')?.id"');
	console.log('');
	console.log('  corsair watch-renew                             Renew Google webhook watch (Gmail/Drive/Calendar)');
	console.log('  corsair help                                    Show this help message\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI entry point
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
	const cwd = process.cwd();
	const args = process.argv.slice(2);
	const command = args[0];

	if (command === 'help' || command === '--help' || command === '-h') {
		printHelp();
		return;
	}

	if (command === 'setup') {
		const { backfill, credentials } = parseSetupArgs(args.slice(1));
		const { setupCorsair } = await import('corsair/setup');
		const instance = await getCorsairInstance({ cwd });
		await setupCorsair(instance as Parameters<typeof setupCorsair>[0], {
			backfill,
			credentials,
			caller: 'cli',
		});
		return;
	}

	if (command === 'auth') {
		const { runAuth } = await import('./auth');
		const authArgs = parseAuthArgs(args.slice(1));
		await runAuth({ cwd, ...authArgs });
		return;
	}

	if (command === 'watch-renew') {
		const { runWatchRenew } = await import('./watch-renew');
		await runWatchRenew({ cwd });
		return;
	}

	if (command === 'list') {
		const { plugin, type } = parseListArgs(args.slice(1));
		const instance = await getCorsairInstance({ cwd });
		const corsair = instance as Record<string, unknown>;
		if (typeof corsair.list_operations !== 'function') {
			console.error('[#corsair]: list_operations not available on this Corsair instance.');
			process.exit(1);
		}
		const result = corsair.list_operations({ plugin, type }) as unknown;
		if (typeof result === 'string') {
			console.log(result);
		} else if (Array.isArray(result)) {
			for (const path of result) {
				console.log(path);
			}
			console.log('');
			console.log('Run `pnpm corsair schema <path>` to get the schema for any of the above.');
		} else if (result && typeof result === 'object') {
			const grouped = result as Record<string, string[]>;
			for (const [pluginId, paths] of Object.entries(grouped)) {
				console.log(`${pluginId}:`);
				for (const path of paths) {
					console.log(`  ${path}`);
				}
			}
			console.log('');
			console.log('Run `pnpm corsair schema <path>` to get the schema for any of the above.');
		}
		return;
	}

	if (command === 'run') {
		const { path: endpointPath, input, tenant } = parseRunArgs(args.slice(1));
		if (!endpointPath) {
			console.error('[#corsair]: Usage: corsair run <path> [input-json]');
			console.error('[#corsair]: Example: corsair run slack.api.messages.post \'{"channel":"C123","text":"hi"}\'');
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd });
		const client = resolveClient(instance, tenant);
		const fn = navigateToEndpoint(client, endpointPath);
		if (!fn) {
			console.error(`[#corsair]: Could not find endpoint "${endpointPath}".`);
			console.error('[#corsair]: Run `pnpm corsair list` to see available paths.');
			process.exit(1);
		}
		let parsedInput: unknown = {};
		if (input) {
			try {
				parsedInput = JSON.parse(input);
			} catch {
				console.error('[#corsair]: Invalid JSON input. Make sure to quote the JSON string.');
				process.exit(1);
			}
		}
		try {
			const result = await fn(parsedInput);
			console.log(JSON.stringify(result, null, 2));
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			console.error(`[#corsair]: ${msg.slice(0, 500)}`);
			process.exit(1);
		}
		return;
	}

	if (command === 'script') {
		const { code, tenant } = parseScriptArgs(args.slice(1));
		if (!code) {
			console.error('[#corsair]: Usage: corsair script --code "<js>"');
			console.error('[#corsair]: Example: corsair script --code "const r = await corsair.slack.channels.list(); return r.channels.find(c => c.name === \'general\')?.id"');
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd });
		const client = resolveClient(instance, tenant);
		// Run the script body as an async function with `corsair` injected
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
			...args: string[]
		) => (...fnArgs: unknown[]) => Promise<unknown>;
		const fn = new AsyncFunction('corsair', code);
		try {
			const result = await fn(client);
			if (result !== undefined) {
				console.log(JSON.stringify(result, null, 2));
			}
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			console.error(`[#corsair]: ${msg.slice(0, 500)}`);
			process.exit(1);
		}
		return;
	}

	if (command === 'schema') {
		const schemaPath = args[1];
		if (!schemaPath) {
			console.error('[#corsair]: Usage: corsair schema <path>');
			console.error('[#corsair]: Example: corsair schema slack.api.messages.post');
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd });
		const corsair = instance as Record<string, unknown>;
		if (typeof corsair.get_schema !== 'function') {
			console.error('[#corsair]: get_schema not available on this Corsair instance.');
			process.exit(1);
		}
		const result = corsair.get_schema(schemaPath) as unknown;
		console.log(JSON.stringify(result, null, 2));
		return;
	}

	// Default behavior: print help + inspect corsair instance
	printHelp();
	console.log('');
	console.log(`[#corsair]: Looking for Corsair instance in ${cwd}...\n`);

	try {
		const instance = await getCorsairInstance({ cwd });
		console.log('[#corsair]: ✅ Successfully loaded Corsair instance!');
		if (instance && typeof instance === 'object' && 'withTenant' in instance) {
			console.log(
				'[#corsair]: Multi-tenant setup detected (has withTenant method)',
			);
		} else {
			console.log('[#corsair]: Single-tenant setup detected (direct client)');
		}
		if (instance && typeof instance === 'object') {
			console.log(
				`[#corsair]: Instance keys: ${Object.keys(instance).join(', ')}`,
			);
		}
	} catch (error) {
		console.error('[#corsair]: Error:', error);
		process.exit(1);
	}
}

// Run if this file is executed directly
// Check if we're running as a script (not imported as a module)
const isMainModule =
	import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
	process.argv[1]?.includes('index.ts') ||
	process.argv[1]?.includes('index.js') ||
	import.meta.url.endsWith('/index.ts') ||
	import.meta.url.endsWith('/index.js');

if (isMainModule) {
	main();
}

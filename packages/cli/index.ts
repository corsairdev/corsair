import fs, { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error
import babelPresetReact from '@babel/preset-react';
// @ts-expect-error
import babelPresetTypeScript from '@babel/preset-typescript';
import { loadConfig } from 'c12';
import type { AnyCorsairInstance } from 'corsair';
import { getSchema, listOperations } from 'corsair';
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
						typeof e === 'object' &&
						e &&
						'message' in e &&
						typeof e.message === 'string'
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
						console.error(
							`[#corsair]: Error loading ${possiblePath}: Native module binding not found.`,
						);
						console.log('');
						console.log(
							'[#corsair]: A native Node.js addon (e.g. better-sqlite3) needs to be rebuilt for your current Node.js version.',
						);
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
			console.error(
				'[#corsair]: This is a multi-tenant instance. Pass --tenant=<id>.',
			);
			process.exit(1);
		}
		return obj.withTenant(tenant) as Record<string, unknown>;
	}
	return obj;
}

/**
 * Set to true to re-enable the `corsair run` command.
 * Disabled by default — prefer `corsair script` to avoid dumping full API
 * responses into the agent's context window.
 */
const SHOW_RUN = false;

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
			if (key === 'plugin') {
				plugin = value;
				continue;
			}
			if (
				key === 'type' &&
				(value === 'api' || value === 'webhooks' || value === 'db')
			) {
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
	webhook?: boolean;
	listen?: boolean;
	collect?: boolean;
	sessionId?: string;
} {
	let pluginId: string | undefined;
	let tenantId: string | undefined;
	let code: string | undefined;
	let credentials = false;
	let webhook = false;
	let listen = false;
	let collect = false;
	let sessionId: string | undefined;

	for (const arg of args) {
		if (arg === '--credentials') {
			credentials = true;
			continue;
		}
		if (arg === '--webhook') {
			webhook = true;
			continue;
		}
		if (arg === '--listen') {
			listen = true;
			continue;
		}
		if (arg === '--collect') {
			collect = true;
			continue;
		}

		const eqIdx = arg.indexOf('=');
		if (arg.startsWith('--') && eqIdx !== -1) {
			const key = arg.slice(2, eqIdx);
			const value = arg.slice(eqIdx + 1);
			if (key === 'plugin') {
				pluginId = value;
				continue;
			}
			if (key === 'tenant') {
				tenantId = value;
				continue;
			}
			if (key === 'code') {
				code = value;
				continue;
			}
			if (key === 'session') {
				sessionId = value;
				continue;
			}
		}
	}

	return {
		pluginId,
		tenantId,
		code,
		credentials,
		webhook,
		listen,
		collect,
		sessionId,
	};
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

		if (arg.startsWith('--plugin=')) {
			currentPlugin = arg.slice('--plugin='.length);
			if (!credentials[currentPlugin]) credentials[currentPlugin] = {};
			continue;
		}

		if (arg.startsWith('--')) {
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

function parseExploreArgs(args: string[]): {
	plugin?: string;
	type?: 'api' | 'webhooks' | 'db';
	json: boolean;
}{
	let plugin: string | undefined;
	let type: 'api' | 'webhooks' | 'db' | undefined;
	let json = false;

	for (let i = 0; i < args.length; i++){
		const arg = args[i]!;
		if (arg === '--json') {
			json = true;
			continue;
		}
		if (arg === '--type' && args[i + 1]) {
			const value = args[++i];
			if (value === 'api' || value === 'webhooks' || value === 'db') {
				type = value;
			}
			continue;
		}
		if (arg.startsWith('--type=')) {
			const value = arg.slice('--type='.length);
			if (value === 'api' || value === 'webhooks' || value === 'db') {
				type = value;
			}
			continue;
		}

		if (!arg.startsWith('-') && !plugin) {
			plugin = arg;
		}
	}
	return { plugin, type, json };
}

function parseUiArgs(args: string[]): { port?: number; open?: boolean } {
	let port: number | undefined;
	let open: boolean | undefined;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]!;
		if (arg === '--no-open') {
			open = false;
			continue;
		}
		if (arg === '--open') {
			open = true;
			continue;
		}
		if (arg === '--port' && args[i + 1]) {
			const next = args[++i];
			if (next) {
				const parsed = Number.parseInt(next, 10);
				if (Number.isFinite(parsed)) port = parsed;
			}
			continue;
		}
		if (arg.startsWith('--port=')) {
			const parsed = Number.parseInt(arg.slice('--port='.length), 10);
			if (Number.isFinite(parsed)) port = parsed;
		}
	}

	return { port, open };
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
	const lines = [
		'Corsair CLI',
		'',
		'pnpm corsair setup                              Init (add -backfill to seed data)',
		'pnpm corsair setup --plugin=<id> <field>=VALUE  Set plugin credentials',
		'pnpm corsair auth --plugin=<id>                 Start OAuth flow',
		'pnpm corsair auth --plugin=<id> --code=<code>   Exchange OAuth code for tokens',
		'pnpm corsair auth --plugin=<id> --credentials   Show credential status',
		'pnpm corsair auth --plugin=<id> --webhook       Set up webhook subscription',
		'  `pnpm corsair list --type=webhooks` to see webhook plugins',
		'pnpm corsair list [--plugin=<id>] [--type=api|webhooks|db]  List endpoint paths (tip: pipe to grep to filter)',
		'pnpm corsair explore [provider] [--type=api|webhooks|db]  Discover official providers before installing them',
		'pnpm corsair schema <path>                      Show schema for an endpoint/webhook/DB entity',
		'pnpm corsair ui [--port=4317] [--no-open]       Open the Corsair Studio dashboard (requires @corsair-dev/studio)',
		'pnpm corsair script --code "<js>" [--tenant=<id>]',
		'  corsair is injected; use return to output a value.',
		'  IMPORTANT: Always filter results inline — you are the consumer of the return value, so returning full list responses wastes tokens.',
		'  Bad:  return await corsair.slack.api.users.list({})',
		"  Good: return (await corsair.slack.api.users.list({})).members.find(u => u.name === 'bob')?.id",
		...(SHOW_RUN
			? ['  run <path> [input-json] [--tenant=<id>]  Call an endpoint directly']
			: []),
	];
	console.log(lines.join('\n'));
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI entry point
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
	const cwd = process.cwd();
	const args = process.argv.slice(2);
	const command = args[0];

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
		const authArgs = parseAuthArgs(args.slice(1));

		if (authArgs.webhook) {
			const pluginId = authArgs.pluginId;
			if (!pluginId) {
				console.error('[#corsair]: --webhook requires --plugin=<id>.');
				process.exit(1);
			}
			if (pluginId === 'outlook') {
				const { runOutlookSubscribe } = await import('./subscribe-microsoft');
				await runOutlookSubscribe({ cwd });
			} else if (pluginId === 'sharepoint') {
				const { runSharepointSubscribe } = await import(
					'./subscribe-microsoft'
				);
				await runSharepointSubscribe({ cwd });
			} else if (pluginId === 'teams') {
				const { runTeamsSubscribe } = await import('./subscribe-microsoft');
				await runTeamsSubscribe({ cwd });
			} else if (pluginId === 'onedrive') {
				const { runOnedriveSubscribe } = await import('./subscribe-microsoft');
				await runOnedriveSubscribe({ cwd });
			} else if (
				['gmail', 'googledrive', 'googlecalendar', 'googlesheets'].includes(
					pluginId,
				)
			) {
				const { runGoogleSubscribe } = await import('./subscribe-google');
				await runGoogleSubscribe({ cwd, pluginId });
			} else {
				console.error(
					`[#corsair]: Webhook subscription not supported for plugin '${pluginId}'.`,
				);
				console.error(
					'[#corsair]: Supported: outlook, sharepoint, teams, onedrive, gmail, googledrive, googlecalendar, googlesheets',
				);
				process.exit(1);
			}
			return;
		}

		const { runAuth } = await import('./auth');
		await runAuth({ cwd, ...authArgs });
		return;
	}

	if (command === 'watch-renew') {
		const { runGoogleSubscribe } = await import('./subscribe-google');
		await runGoogleSubscribe({ cwd });
		return;
	}

	if (command === 'sharepoint-subscribe') {
		const { runSharepointSubscribe } = await import('./subscribe-microsoft');
		await runSharepointSubscribe({ cwd });
		return;
	}

	if (command === 'subscribe') {
		const pluginArg = args.slice(1).find((a) => a.startsWith('--plugin='));
		const pluginId = pluginArg
			? pluginArg.slice('--plugin='.length)
			: undefined;
		if (pluginId === 'outlook') {
			const { runOutlookSubscribe } = await import('./subscribe-microsoft');
			await runOutlookSubscribe({ cwd });
			return;
		}
		console.error(
			`[#corsair]: Unknown plugin for subscribe: '${pluginId ?? '(none)'}'. Supported: outlook`,
		);
		process.exit(1);
	}

	if (command === 'teams-subscribe') {
		const { runTeamsSubscribe } = await import('./subscribe-microsoft');
		await runTeamsSubscribe({ cwd });
		return;
	}

	if (command === 'list') {
		const { plugin, type } = parseListArgs(args.slice(1));
		const instance = await getCorsairInstance({ cwd });
		const result = listOperations(instance as AnyCorsairInstance, {
			plugin,
			type,
		});
		if (type === 'db') {
			console.log(
				'[#corsair]: NOTE: Every DB query listed here has both .search() and .list() methods available.',
			);
			console.log('');
		}
		console.log(result);
		return;
	}

	if (command === 'explore') {
		const { plugin, type, json } = parseExploreArgs(args.slice(1));
		const baseUrl = process.env.CORSAIR_EXPLORER_URL ?? 'http://localhost:4319';

		const typePath = plugin && type ? `/${type}` : '';
		const url = plugin 
		? `${baseUrl}/v1/plugins/${encodeURIComponent(plugin)}${typePath}`
			: `${baseUrl}/v1/plugins`;
		
		try {
			const response = await fetch(url);
			if (!response.ok) {
				if (response.status === 404 && plugin) {
					console.error(`[#corsair]: Unknown provider "${plugin}".`);
					console.error('[#corsair]: Run `pnpm corsair explore` to see available providers.');
					process.exit(1);
				}

				console.error(
					`[#corsair]: Explore request failed with HTTP ${response.status}.`,
				);
				process.exit(1);
			}
			const data = await response.json();
			console.log(JSON.stringify(data, null, 2));
			return;
		}
		catch (error) {
			const message = error instanceof Error ? error.message : String(error);

			console.error('[#corsair]: Could not reach the Corsair explorer registry.');
			console.error(`[#corsair]: Tried: ${url}`);
			console.error(`[#corsair]: ${message}`);
			console.error('');
			console.error(
				'[#corsair]: Start the explorer server locally or set CORSAIR_EXPLORER_URL.',
			);

			process.exit(1);
		}
	}

	if (SHOW_RUN && command === 'run') {
		const { path: endpointPath, input, tenant } = parseRunArgs(args.slice(1));
		if (!endpointPath) {
			console.error('[#corsair]: Usage: corsair run <path> [input-json]');
			console.error(
				'[#corsair]: Example: corsair run slack.api.messages.post \'{"channel":"C123","text":"hi"}\'',
			);
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd });
		const client = resolveClient(instance, tenant);
		const fn = navigateToEndpoint(client, endpointPath);
		if (!fn) {
			console.error(`[#corsair]: Could not find endpoint "${endpointPath}".`);
			console.error(
				'[#corsair]: Run `pnpm corsair list` to see available paths.',
			);
			process.exit(1);
		}
		let parsedInput: unknown = {};
		if (input) {
			try {
				parsedInput = JSON.parse(input);
			} catch {
				console.error(
					'[#corsair]: Invalid JSON input. Make sure to quote the JSON string.',
				);
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
			console.error(
				'[#corsair]: Example: corsair script --code "const r = await corsair.slack.channels.list(); return r.channels.find(c => c.name === \'general\')?.id"',
			);
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd });
		const client = resolveClient(instance, tenant);
		// Run the script body as an async function with `corsair` injected
		// eslint-disable-next-line @typescript-eslint/no-implied-eval
		const AsyncFunction = Object.getPrototypeOf(async function () {})
			.constructor as new (
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

	if (command === 'ui' || command === 'studio') {
		const { port, open } = parseUiArgs(args.slice(1));
		type StartStudio = (opts: {
			cwd: string;
			port?: number;
			open?: boolean;
		}) => Promise<unknown>;
		// Resolve @corsair-dev/studio from the USER's project cwd, not the CLI's
		// own location. In pnpm workspaces the CLI lives in an isolated
		// node_modules/.pnpm store that can't see peer packages unless they're
		// declared as deps of the CLI itself. Using createRequire(cwd) + import()
		// of a file:// URL sidesteps that and matches where the user installed it.
		let startStudio: StartStudio;
		try {
			const { createRequire } = await import('node:module');
			const { pathToFileURL } = await import('node:url');
			const req = createRequire(path.join(cwd, 'package.json'));
			const resolvedPath = req.resolve('@corsair-dev/studio/server');
			const mod = (await import(pathToFileURL(resolvedPath).href)) as {
				start?: StartStudio;
				startStudio?: StartStudio;
			};
			const candidate = mod.start ?? mod.startStudio;
			if (!candidate) {
				throw new Error('@corsair-dev/studio/server did not export `start`.');
			}
			startStudio = candidate;
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			if (
				msg.includes('Cannot find package') ||
				msg.includes('Cannot find module') ||
				msg.includes('ERR_MODULE_NOT_FOUND') ||
				msg.includes('MODULE_NOT_FOUND')
			) {
				console.error('[#corsair]: Corsair Studio is not installed.');
				console.error('[#corsair]: Install it with:');
				console.error('');
				console.error('  pnpm add -D @corsair-dev/studio');
				console.error('');
				process.exit(1);
			}
			throw err;
		}
		await startStudio({ cwd, port, open });
		// startStudio resolves once the server is listening; keep the process
		// alive until the user stops it (Ctrl+C) so the HTTP server stays up.
		await new Promise<void>((resolve) => {
			const shutdown = () => resolve();
			process.once('SIGINT', shutdown);
			process.once('SIGTERM', shutdown);
		});
		return;
	}

	if (command === 'schema') {
		const schemaPath = args[1];
		if (!schemaPath) {
			console.error('[#corsair]: Usage: corsair schema <path>');
			console.error(
				'[#corsair]: Example: corsair schema slack.api.messages.post',
			);
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd });
		const result = getSchema(instance as AnyCorsairInstance, schemaPath);
		console.log(result);
		return;
	}

	printHelp();
}

// Run if this file is executed directly (not imported as a module).
// We resolve symlinks on both sides because the CLI is typically invoked via
// a `node_modules/.bin/corsair` symlink — argv[1] is the symlink, while
// import.meta.url is the realpath'd target.
function detectIsMainModule(): boolean {
	const argv1 = process.argv[1];
	if (!argv1) return false;
	try {
		const argvResolved = realpathSync(argv1);
		const selfResolved = realpathSync(fileURLToPath(import.meta.url));
		return argvResolved === selfResolved;
	} catch {
		return import.meta.url === `file://${argv1.replace(/\\/g, '/')}`;
	}
}

if (detectIsMainModule()) {
	main()
		.then(() => process.exit(0))
		.catch((e) => {
			console.error(e);
			process.exit(1);
		});
}

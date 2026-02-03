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
					if (shouldThrowOnError) {
						throw e;
					}
					// Continue to next path if this one fails
					continue;
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

// CLI entry point
async function main() {
	const cwd = process.cwd();
	const args = process.argv.slice(2);
	const command = args[0];

	if (command === 'help' || command === '--help' || command === '-h') {
		console.log('[#corsair]: Corsair CLI\n');
		console.log('Commands:');
		console.log('  corsair                    Inspect your Corsair instance');
		console.log('  corsair migrate            Create a data migration script');
		console.log('  corsair migrate help       Show migration help\n');
		return;
	}

	// Default behavior: inspect corsair instance
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

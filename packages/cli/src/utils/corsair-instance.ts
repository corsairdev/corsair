import fs, { existsSync } from 'node:fs'
import path from 'node:path'
// @ts-expect-error
import babelPresetReact from '@babel/preset-react'
// @ts-expect-error
import babelPresetTypeScript from '@babel/preset-typescript'
import { loadConfig } from 'c12'
import type { JitiOptions } from 'jiti'
import { getTsconfigInfo } from '@/get-tsconfig-info'

const POSSIBLE_PATHS = [
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
] as const;

function isCorsairInstance(value: unknown): boolean {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return false;
	}
	if ('withTenant' in value && typeof value.withTenant === 'function') {
		return true;
	}
	return Object.keys(value).length > 0;
}

function resolveReferencePath(configDir: string, refPath: string): string {
	const resolvedPath = path.resolve(configDir, refPath);
	if (refPath.endsWith('.json')) return resolvedPath;
	if (existsSync(resolvedPath)) {
		const stats = fs.statSync(resolvedPath);
		if (stats.isFile()) return resolvedPath;
	}
	return path.resolve(configDir, refPath, 'tsconfig.json');
}

function getPathAliasesRecursive(
	tsconfigPath: string,
	visited = new Set<string>(),
): Record<string, string> {
	if (visited.has(tsconfigPath)) return {};
	visited.add(tsconfigPath);
	if (!existsSync(tsconfigPath)) return {};
	const tsConfig = getTsconfigInfo(undefined, tsconfigPath);
	const { paths = {}, baseUrl = '.' } = tsConfig.compilerOptions || {};
	const configDir = path.dirname(tsconfigPath);
	const resolvedBaseUrl = path.resolve(configDir, baseUrl);
	const aliases: Record<string, string> = {};

	for (const [alias, aliasPaths] of Object.entries(paths) as [string, string[]][]) {
		for (const aliasPath of aliasPaths) {
			const aliasKey = alias.endsWith('*') ? alias.slice(0, -1) : alias;
			const aliasValue = aliasPath.endsWith('*')
				? aliasPath.slice(0, -1)
				: aliasPath;
			aliases[aliasKey] = path.join(resolvedBaseUrl, aliasValue);
		}
	}

	for (const ref of tsConfig.references || []) {
		const refPath = resolveReferencePath(configDir, ref.path);
		const refAliases = getPathAliasesRecursive(refPath, visited);
		for (const [alias, aliasPath] of Object.entries(refAliases)) {
			if (!(alias in aliases)) aliases[alias] = aliasPath;
		}
	}

	return aliases;
}

function getPathAliases(cwd: string): Record<string, string> {
	const tsConfigPath = path.join(cwd, 'tsconfig.json');
	return existsSync(tsConfigPath) ? getPathAliasesRecursive(tsConfigPath) : {};
}

function jitiOptions(cwd: string): JitiOptions {
	return {
		transformOptions: {
			babel: {
				presets: [
					[babelPresetTypeScript, { isTSX: true, allExtensions: true }],
					[babelPresetReact, { runtime: 'automatic' }],
				],
			},
		},
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias: getPathAliases(cwd),
	};
}

function fail(message: string, shouldThrowOnError: boolean): never {
	if (shouldThrowOnError) throw new Error(message);
	console.error(`[#corsair]: ${message}`);
	process.exit(1);
}

function parseLoadError(error: unknown): string {
	const msg = error instanceof Error ? error.message : String(error);
	if (msg.includes('This module cannot be imported from a Client Component module')) {
		return "Please remove import 'server-only' from your corsair.ts file temporarily.";
	}
	if (
		msg.includes('Could not locate the bindings file') ||
		msg.includes('NODE_MODULE_VERSION') ||
		msg.includes('.node')
	) {
		return 'Native module binding not found. Run `npm rebuild` or reinstall dependencies.';
	}
	return msg;
}

export function findCorsairConfigPath(cwd: string): string | null {
	for (const possiblePath of POSSIBLE_PATHS) {
		const fullPath = path.join(cwd, possiblePath);
		if (existsSync(fullPath)) return fullPath;
	}
	return null;
}

export async function getCorsairInstance({
	cwd,
	configPath,
	shouldThrowOnError = false,
}: {
	cwd: string;
	configPath?: string;
	shouldThrowOnError?: boolean;
}) {
	const candidatePaths = configPath
		? [existsSync(configPath) ? configPath : path.join(cwd, configPath)]
		: [...POSSIBLE_PATHS];

	for (const candidatePath of candidatePaths) {
		try {
			const { config } = await loadConfig<{ corsair?: unknown; default?: unknown }>({
				configFile: candidatePath,
				dotenv: true,
				jitiOptions: jitiOptions(cwd),
				cwd,
			});
			if ('corsair' in config && isCorsairInstance(config.corsair)) {
				return config.corsair;
			}
			if ('default' in config && isCorsairInstance(config.default)) {
				return config.default;
			}
			if (Object.keys(config).length > 0) {
				fail(
					`Couldn't read your Corsair instance in ${candidatePath}. Export it as 'corsair' or default.`,
					shouldThrowOnError,
				);
			}
		} catch (error) {
			fail(`Error loading ${candidatePath}: ${parseLoadError(error)}`, shouldThrowOnError);
		}
	}

	fail(
		"Couldn't find corsair.ts in your project. Add it in root or src/lib/server/app.",
		shouldThrowOnError,
	);
}

export function resolveClient(instance: unknown, tenant?: string): Record<string, unknown> {
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

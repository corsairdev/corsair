import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// @ts-expect-error - babel presets are JS modules
import babelPresetReact from '@babel/preset-react';
// @ts-expect-error - babel presets are JS modules
import babelPresetTypeScript from '@babel/preset-typescript';
import type { CorsairConfig } from '@corsair-ai/core/config';
import { loadConfig as loadConfigFile } from 'c12';
import type { JitiOptions } from 'jiti';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possiblePaths = [
	'corsair.config.ts',
	'corsair.config.js',
];

function getPathAliases(cwd: string): Record<string, string> {
	const tsConfigPath = path.join(cwd, 'tsconfig.json');
	if (!fs.existsSync(tsConfigPath)) return {};
	try {
		const raw = fs.readFileSync(tsConfigPath, 'utf8');
		const json = JSON.parse(raw) as any;
		const compilerOptions = json?.compilerOptions ?? {};
		const baseUrl = compilerOptions.baseUrl ?? '.';
		const paths = compilerOptions.paths ?? {};

		const aliases: Record<string, string> = {};
		for (const [alias, targets] of Object.entries(paths) as Array<
			[string, string[]]
		>) {
			const target = targets?.[0];
			if (!target) continue;
			const finalAlias = alias.endsWith('*') ? alias.slice(0, -1) : alias;
			const finalTarget = target.endsWith('*') ? target.slice(0, -1) : target;
			aliases[finalAlias] = path.resolve(cwd, baseUrl, finalTarget);
		}
		return aliases;
	} catch {
		return {};
	}
}

const jitiOptions = (cwd: string): JitiOptions => ({
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
	extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts'],
	alias: {
		...getPathAliases(cwd),
		'server-only': path.resolve(__dirname, 'server-only-stub.js'),
	},
	interopDefault: true,
});

function isCorsairConfig(obj: any): obj is CorsairConfig<any> {
	if (!obj || typeof obj !== 'object') return false;
	return 'orm' in obj || 'dbType' in obj || 'plugins' in obj;
}

function extractCorsairConfig(obj: any): CorsairConfig<any> | undefined {
	if (!obj || typeof obj !== 'object') return undefined;
	
	if ('config' in obj && obj.config) {
		const config = obj.config;
		if (config && typeof config === 'object') {
			if (isCorsairConfig(config)) {
				return config;
			}
			if ('options' in config && config.options && isCorsairConfig(config.options)) {
				return config.options;
			}
		}
	}
	
	if ('default' in obj && obj.default) {
		const defaultExport = obj.default;
		if (defaultExport && typeof defaultExport === 'object') {
			if (isCorsairConfig(defaultExport)) {
				return defaultExport;
			}
			if ('options' in defaultExport && defaultExport.options && isCorsairConfig(defaultExport.options)) {
				return defaultExport.options;
			}
		}
	}
	
	if (isCorsairConfig(obj)) {
		return obj;
	}
	
	return undefined;
}

export async function loadCorsairConfig({
	cwd,
	configPath,
}: {
	cwd?: string;
	configPath?: string;
}): Promise<CorsairConfig<any>> {
	const workingDir = cwd ?? process.cwd();

		if (configPath) {
			const resolvedPath = path.isAbsolute(configPath)
				? configPath
				: path.resolve(workingDir, configPath);

			try {
				const { config } = await loadConfigFile<Record<string, any>>({
					cwd: workingDir,
					configFile: resolvedPath,
					dotenv: true,
					jitiOptions: jitiOptions(workingDir),
				});

				const extracted = extractCorsairConfig(config);
				if (!extracted) {
					throw new Error(
						`Couldn't read your Corsair config in ${resolvedPath}. Export a CorsairConfig object (default export or named 'config' export).`,
					);
				}

				return extracted;
			} catch (error: any) {
				if (
					error?.message?.includes('server-only') ||
					error?.message?.includes('Client Component')
				) {
					throw new Error(
						`Please temporarily remove 'server-only' import from your corsair config file (${resolvedPath}) or any files it imports (like db/index.ts). The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
					);
				}
				throw error;
			}
		}

	for (const p of possiblePaths) {
		try {
			const { config } = await loadConfigFile<Record<string, any>>({
				cwd: workingDir,
				configFile: p,
				dotenv: true,
				jitiOptions: jitiOptions(workingDir),
			});

			const extracted = extractCorsairConfig(config);
			if (extracted) {
				return extracted;
			}
		} catch (error: any) {
			const candidatePath = path.resolve(workingDir, p);
			if (fs.existsSync(candidatePath)) {
				if (
					error?.message?.includes('server-only') ||
					error?.message?.includes('Client Component')
				) {
					throw new Error(
						`Please temporarily remove 'server-only' import from your corsair config file (${candidatePath}). The CLI cannot resolve the configuration with it included. You can re-add it after running the CLI.`,
					);
				}
				console.error(`Failed to load config from ${candidatePath}:`, error.message);
			}
			continue;
		}
	}

	throw new Error(
		`Couldn't find a Corsair config. Expected one of: ${possiblePaths.join(
			', ',
		)} exporting \`config\` (or default export).`,
	);
}


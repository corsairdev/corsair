<<<<<<< HEAD
import type { CorsairConfig, SchemaOutput } from '@corsair-ai/core/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import { schemaLoaderCLI } from '../utils/schema-loader-cli.js';

// i can't figure out if this is the smartest or dumbest code i've ever written

export type Config = Omit<CorsairConfig<any>, 'db'> & {
	db: SchemaOutput;
};

const execAsync = promisify(exec);

const body = schemaLoaderCLI
	.toString()
	.slice(
		schemaLoaderCLI.toString().indexOf('{') + 1,
		schemaLoaderCLI.toString().lastIndexOf('}'),
	)
	.trim();

export const loadConfig = async () => {
	try {
		const code = `
import { config } from './corsair.config.js'

${body}

const formattedConfig = {
  ...config,
  db: dbSchema,
}

console.log('<output>')
console.log(JSON.stringify(formattedConfig, null, 2))
console.log('</output>')
`;

		const result = await execAsync(
			`tsx --conditions=react-server -e "${code.replace(/"/g, '\\"')}"`,
			{
				cwd: process.cwd(),
			},
		);

		const response =
			result.stdout.match(/<output>(.*?)<\/output>/s)?.[1]?.trim() || '';

		const object = JSON.parse(response) as Config;

		return object;
=======
import fs from 'node:fs';
import path from 'node:path';
// @ts-expect-error - babel presets are JS modules
import babelPresetReact from '@babel/preset-react';
// @ts-expect-error - babel presets are JS modules
import babelPresetTypeScript from '@babel/preset-typescript';
import type { CorsairConfig, SchemaOutput } from '@corsair-ai/core/config';
import { getSchema, toSchemaOutput } from '@corsair-ai/core/db';
import { loadConfig as loadConfigFile } from 'c12';
import type { JitiOptions } from 'jiti';

export type Config = CorsairConfig<any> & {
	db: SchemaOutput;
};

const possiblePaths = [
	'corsair.config.ts',
	'corsair.config.tsx',
	'corsair.config.js',
	'corsair.config.jsx',
	'corsair.config.mjs',
	'corsair.config.cjs',
	'corsair.config.mts',
	'corsair.config.cts',
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
	/**
	 * Mirrors Better Auth's approach: enable Babel so TSX works.
	 *
	 * Note: `.tsx` support requires Babel transform; plain Jiti won't parse TSX.
	 */
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
	alias: getPathAliases(cwd),
});

function extractCorsairConfig(obj: any): CorsairConfig<any> | undefined {
	if (!obj || typeof obj !== 'object') return undefined;
	if ('config' in obj && obj.config && typeof obj.config === 'object')
		return obj.config;
	if ('default' in obj && obj.default && typeof obj.default === 'object')
		return obj.default;
	return undefined;
}

function drizzleSchemaToOutput(config: CorsairConfig<any>): SchemaOutput {
	const dbSchema: SchemaOutput = {};
	const schema = (config as any).db?._?.schema;
	if (!schema) throw new Error('No schema found in drizzle instance');

	for (const [tableName, table] of Object.entries(
		schema as Record<string, any>,
	)) {
		const tableSchema: Record<string, { type: string }> = {};
		const columns = (table as any).columns ?? {};
		for (const [columnName, column] of Object.entries(
			columns as Record<string, any>,
		)) {
			tableSchema[columnName] = { type: column?.dataType ?? 'unknown' };
		}
		const actualTableName = (table as any).dbName || tableName;
		dbSchema[actualTableName] = tableSchema;
	}
	return dbSchema;
}

export const loadConfig: () => Promise<Config | undefined> = async () => {
	try {
		const cwd = process.cwd();

		let loadedConfig: CorsairConfig<any> | undefined;

		for (const p of possiblePaths) {
			try {
				const { config } = await loadConfigFile<Record<string, any>>({
					cwd,
					configFile: p,
					dotenv: true,
					jitiOptions: jitiOptions(cwd),
				});
				const extracted = extractCorsairConfig(config);
				if (extracted) {
					loadedConfig = extracted;
					break;
				}
			} catch {
				// try next candidate
			}
		}

		if (!loadedConfig) {
			console.error(
				`Couldn't read your Corsair config. Expected one of: ${possiblePaths.join(
					', ',
				)} exporting \`config\` (or default export).`,
			);
			return undefined;
		}

		let db: SchemaOutput;
		if (
			(loadedConfig as any).dbPlugins &&
			Array.isArray((loadedConfig as any).dbPlugins) &&
			(loadedConfig as any).dbPlugins.length > 0
		) {
			const normalized = getSchema({
				plugins: (loadedConfig as any).dbPlugins,
			});
			db = toSchemaOutput(normalized);
		} else if (loadedConfig.orm === 'drizzle') {
			db = drizzleSchemaToOutput(loadedConfig);
		} else {
			db = {};
		}

		return {
			...loadedConfig,
			db,
		};
>>>>>>> 33bf9966433faae8ddad38429e736a996a04c6cd
	} catch (error: any) {
		console.error('Error extracting config:', error);
		return undefined;
	}
};

import path from 'node:path';
import { loadConfig } from 'c12';
import type { CorsairOptions } from '../../../src/core/options';
import { logger } from '../logger';

const possiblePaths = [
	'corsair.config.ts',
	'corsair.config.js',
	'corsair.config.mjs',
	'corsair.config.cjs',
];

function isCorsairOptions(value: unknown): value is CorsairOptions {
	if (!value || typeof value !== 'object') return false;
	const v = value as Record<string, unknown>;
	return 'db' in v || 'plugins' in v;
}

function extractOptions(
	config: Record<string, unknown>,
): CorsairOptions | null {
	// Support: default export options object
	if ('default' in config && isCorsairOptions(config.default))
		return config.default;

	// Support: `export const config = { ... }`
	if ('config' in config && isCorsairOptions(config.config))
		return config.config;

	// Support: `export const options = { ... }`
	if ('options' in config && isCorsairOptions(config.options))
		return config.options;

	// Support: user exports an instance (e.g. `export default corsair({...})`)
	const maybeInstance = config.default;
	if (
		maybeInstance &&
		typeof maybeInstance === 'object' &&
		'options' in (maybeInstance as any) &&
		isCorsairOptions((maybeInstance as any).options)
	) {
		return (maybeInstance as any).options;
	}

	// Support: module exports are themselves the options object
	if (isCorsairOptions(config)) return config as unknown as CorsairOptions;

	return null;
}

export async function getConfig({
	cwd,
	configPath,
	shouldThrowOnError = false,
}: {
	cwd: string;
	configPath?: string | undefined;
	shouldThrowOnError?: boolean;
}): Promise<CorsairOptions> {
	try {
		if (configPath) {
			const resolvedPath = path.isAbsolute(configPath)
				? configPath
				: path.resolve(cwd, configPath);

			const { config } = await loadConfig<Record<string, unknown>>({
				configFile: resolvedPath,
				dotenv: true,
				jitiOptions: {
					// Allow TS configs without relying on `tsx`.
					extensions: [
						'.ts',
						'.js',
						'.mjs',
						'.cjs',
						'.mts',
						'.cts',
						'.tsx',
						'.jsx',
					],
					interopDefault: true,
				},
			});

			const options = extractOptions(config);
			if (!options) {
				const msg = `Couldn't read your corsair config in ${resolvedPath}. Export a CorsairOptions object (default export recommended).`;
				if (shouldThrowOnError) throw new Error(msg);
				logger.error(msg);
				process.exit(1);
			}
			return options;
		}

		for (const possiblePath of possiblePaths) {
			try {
				const candidate = path.resolve(cwd, possiblePath);
				const { config } = await loadConfig<Record<string, unknown>>({
					configFile: candidate,
					dotenv: true,
					jitiOptions: {
						extensions: [
							'.ts',
							'.js',
							'.mjs',
							'.cjs',
							'.mts',
							'.cts',
							'.tsx',
							'.jsx',
						],
						interopDefault: true,
					},
				});

				const options = extractOptions(config);
				if (options) return options;
			} catch {
				// continue probing
			}
		}

		const msg =
			"Couldn't find a corsair config. Create corsair.config.ts (default export) or pass --config <path>.";
		if (shouldThrowOnError) throw new Error(msg);
		logger.error(msg);
		process.exit(1);
	} catch (e) {
		if (shouldThrowOnError) throw e;
		logger.error(
			`Couldn't read your corsair config. ${(e as any)?.message ?? ''}`,
		);
		process.exit(1);
	}
}

export { possiblePaths };

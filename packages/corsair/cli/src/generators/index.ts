import type { CorsairOptions } from '../../../src/core/options';
import type { CorsairDBAdapter } from '../../../src/core/db/adapter';
import { logger } from '../logger';
import { generateDrizzleSchema } from './drizzle';

type SchemaGenResult = {
	code: string;
	fileName: string;
	overwrite?: boolean | undefined;
};

// Mirrors Better Auth’s generator registry shape.
export const adapters = {
	drizzle: generateDrizzleSchema,
};

export const generateSchema = (opts: {
	adapter: CorsairDBAdapter;
	file?: string;
	options: CorsairOptions;
}): Promise<SchemaGenResult> => {
	const adapter = opts.adapter;
	const generator =
		adapter.id in adapters
			? adapters[adapter.id as keyof typeof adapters]
			: null;

	if (generator) {
		return generator(opts);
	}

	if (adapter.createSchema) {
		return adapter.createSchema(opts.options, opts.file).then(
			(res): SchemaGenResult => ({
				code: res.code,
				fileName: res.path,
				overwrite: res.overwrite,
			}),
		);
	}

	logger.error(
		`${adapter.id} is not supported. If it is a custom adapter, please implement createSchema on the DB adapter.`,
	);
	process.exit(1);
};

/**
 * @deprecated Back-compat: matches Better Auth’s naming.
 */
export const getGenerator = generateSchema;

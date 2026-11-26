import { z } from 'zod';
import type {
	ScrapeCreatorsOperationDefinition,
	ScrapeCreatorsOutputFieldKind,
	ScrapeCreatorsParamDefinition,
} from './manifest';
import { scrapeCreatorsOperations } from './manifest';

const operationsById = new Map(
	scrapeCreatorsOperations.map((operation) => [operation.id, operation]),
);

export function scrapeCreatorsOperationFor(
	id: string,
): ScrapeCreatorsOperationDefinition {
	const operation = operationsById.get(id);
	if (!operation) throw new Error('ScrapeCreators operation is unavailable');
	return operation;
}

function paramSchema(param: ScrapeCreatorsParamDefinition): z.ZodType {
	let schema: z.ZodType;
	if (param.enum) {
		// A zod enum, so get_schema and the docs show the allowed values.
		schema = z.enum(param.enum as [string, ...string[]]);
	} else if (param.type === 'integer') {
		schema = z.number().int();
	} else if (param.type === 'number') {
		schema = z.number();
	} else if (param.type === 'boolean') {
		schema = z.boolean();
	} else {
		schema = z.string();
	}
	if (param.description) schema = schema.describe(param.description);
	return param.required ? schema : schema.optional();
}

/**
 * The response spec is one example per route, so each top-level field it shows
 * is checked for its kind only, and every field is optional and nullable.
 * Strings and numbers accept each other: ids, counts and cursors switch between
 * the two across ScrapeCreators' sources. Unknown fields pass through.
 *
 * One schema per kind, shared by every operation: zod schemas are immutable,
 * and building a fresh union per field cost ~30 MB across the 198 operations.
 */
const stringOrNumber = z.union([z.string(), z.number()]).nullish();
const outputFieldSchemas: Record<ScrapeCreatorsOutputFieldKind, z.ZodType> = {
	string: stringOrNumber,
	number: stringOrNumber,
	boolean: z.boolean().nullish(),
	// `unknown` is necessary because list items have per-platform shapes the spec documents only by example.
	array: z.array(z.unknown()).nullish(),
	// `unknown` is necessary because nested objects have per-platform shapes the spec documents only by example.
	object: z.record(z.string(), z.unknown()).nullish(),
	// `unknown` is necessary because the example shows this field as null, so its type is unknown.
	unknown: z.unknown().optional(),
};

/** Fields every data response carries. */
const envelopeShape = {
	success: z.boolean().nullish(),
	credits_remaining: z
		.number()
		.nullish()
		.describe(
			"Credits left on the account. Removed under managed pricing (Corsair's account).",
		),
	credits_charged: z
		.number()
		.nullish()
		.describe(
			'Credits this call cost (0 for cache hits, empty pages and errors).',
		),
	cached: z
		.boolean()
		.nullish()
		.describe('True when `cache_max_age` returned a cached response.'),
	cached_at: z.string().nullish(),
};

// Built on first use, one operation at a time: building all ~200 at import
// would cost memory for an instance that calls two.
// `unknown` is necessary because each cached input schema has its own fields.
const inputSchemaCache = new Map<string, z.ZodType<Record<string, unknown>>>();
const outputSchemaCache = new Map<string, z.ZodType>();

// `unknown` is necessary because each operation's query has its own fields.
export function getScrapeCreatorsInputSchema(
	id: string,
): z.ZodType<Record<string, unknown>> {
	let schema = inputSchemaCache.get(id);
	if (!schema) {
		const operation = scrapeCreatorsOperationFor(id);
		const shape: Record<string, z.ZodType> = {};
		for (const param of operation.params)
			shape[param.name] = paramSchema(param);
		// Unknown fields are refused: the API ignores them silently, so a typo
		// would spend a credit on the wrong request.
		schema = z
			.object(shape)
			.strict()
			.describe(operation.description) as z.ZodType<Record<string, unknown>>;
		inputSchemaCache.set(id, schema);
	}
	return schema;
}

export function getScrapeCreatorsOutputSchema(id: string): z.ZodType {
	let schema = outputSchemaCache.get(id);
	if (!schema) {
		const operation = scrapeCreatorsOperationFor(id);
		if (operation.output.kind === 'array') {
			// `unknown` is necessary because the route answers with a list whose items the spec shows only by example.
			schema = z.array(z.unknown());
		} else {
			const shape: Record<string, z.ZodType> = { ...envelopeShape };
			for (const [name, kind] of Object.entries(operation.output.fields)) {
				shape[name] = outputFieldSchemas[kind];
			}
			schema = z.object(shape).passthrough();
		}
		outputSchemaCache.set(id, schema);
	}
	return schema;
}

/** `input` and `output` are getters, so a schema is built only when something reads it. */
export function scrapeCreatorsSchemaEntry(id: string): {
	readonly input: z.ZodType;
	readonly output: z.ZodType;
} {
	return {
		get input() {
			return getScrapeCreatorsInputSchema(id);
		},
		get output() {
			return getScrapeCreatorsOutputSchema(id);
		},
	};
}

function lazyRecord(
	build: (id: string) => z.ZodType,
): Readonly<Record<string, z.ZodType>> {
	const record: Record<string, z.ZodType> = {};
	for (const { id } of scrapeCreatorsOperations) {
		Object.defineProperty(record, id, {
			enumerable: true,
			get: () => build(id),
		});
	}
	return record;
}

/** Every operation's schemas by id. Reading a key builds that schema (then cached). */
export const scrapeCreatorsInputSchemas = lazyRecord(
	getScrapeCreatorsInputSchema,
);
export const scrapeCreatorsOutputSchemas = lazyRecord(
	getScrapeCreatorsOutputSchema,
);

import { z } from 'zod';
import type {
	LitescrapeOpenApiSchema,
	LitescrapeOperationDefinition,
} from './manifest';
import { litescrapeDefinitions, litescrapeOperations } from './manifest';

// `unknown` is necessary because raw OpenAPI documents contain arbitrary provider schema keywords.
type OpenApiDocument = Record<string, unknown>;

// `unknown` is necessary because OpenAPI JSON values are untrusted until narrowed by this guard.
function isRecord(value: unknown): value is OpenApiDocument {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * `request` keeps the published contract: required fields, closed enums,
 * length and number limits, and no unknown fields where the spec says
 * `additionalProperties: false` (every Litescrape request body does).
 *
 * `response` parses what Litescrape sends: every field is optional and
 * nullable, enums are open and unknown fields pass through, so a field the
 * provider adds or leaves empty doesn't fail a read. Types the spec declares
 * (string, number, array, object) are still checked.
 */
type SchemaMode = 'request' | 'response';

/**
 * An open enum for responses: any value of the declared type, so a status
 * Litescrape adds later still parses, but never a value of another type (a
 * number where the spec and the exported types say string). Without a declared
 * type, the members' own types decide.
 */
// `unknown` is necessary because enum and const members are provider JSON scalars of any type.
function openScalarSchema(type: unknown, members: unknown[]): z.ZodType {
	const kinds = new Set<string>();
	if (type === 'string') kinds.add('string');
	else if (type === 'integer' || type === 'number') kinds.add('number');
	else if (type === 'boolean') kinds.add('boolean');
	else for (const member of members) kinds.add(typeof member);
	const options: z.ZodType[] = [];
	if (kinds.has('string')) options.push(z.string());
	if (kinds.has('number')) options.push(z.number());
	if (kinds.has('boolean')) options.push(z.boolean());
	return options.length > 0 ? unionOf(options) : z.unknown();
}

function withDescription(schema: z.ZodType, value: OpenApiDocument) {
	return typeof value.description === 'string'
		? schema.describe(value.description)
		: schema;
}

function unionOf(options: z.ZodType[]): z.ZodType {
	const [first, second, ...rest] = options;
	if (!first) return z.never();
	if (!second) return first;
	return z.union([first, second, ...rest]);
}

// `unknown` is necessary because enum members are provider JSON scalars of any type.
function enumSchema(members: unknown[]): z.ZodType {
	const strings = members.filter(
		(member): member is string => typeof member === 'string',
	);
	if (strings.length > 0 && strings.length === members.length) {
		// A zod enum, so get_schema and the docs show the allowed values.
		return z.enum(strings as [string, ...string[]]);
	}
	return unionOf(
		members
			.filter(
				(member): member is string | number | boolean | null =>
					member === null ||
					typeof member === 'string' ||
					typeof member === 'number' ||
					typeof member === 'boolean',
			)
			.map((member) => z.literal(member)),
	);
}

// `unknown` is necessary because anyOf members are provider JSON Schema values of any shape.
function isNullSchema(value: unknown): boolean {
	return isRecord(value) && value.type === 'null';
}

// `unknown` is necessary because schema conversion starts with untrusted provider JSON.
function schemaFromOpenApi(
	value: unknown,
	mode: SchemaMode,
	cache: Map<string, z.ZodType>,
): z.ZodType {
	const strict = mode === 'request';
	if (!isRecord(value) || Object.keys(value).length === 0) {
		// `unknown` is necessary because the spec leaves this JSON value untyped.
		return z.unknown();
	}

	const reference = value.$ref;
	if (typeof reference === 'string') {
		const cacheKey = `${mode}:${reference}`;
		const existing = cache.get(cacheKey);
		if (existing) return existing;
		const lazySchema = z.lazy(() =>
			schemaFromOpenApi(litescrapeDefinitions[reference], mode, cache),
		);
		cache.set(cacheKey, lazySchema);
		return lazySchema;
	}

	if (Array.isArray(value.anyOf)) {
		// pydantic writes `Optional[X]` as anyOf [X, null].
		const members = value.anyOf.filter((member) => !isNullSchema(member));
		const nullable = members.length !== value.anyOf.length;
		const schema = unionOf(
			members.map((member) => schemaFromOpenApi(member, mode, cache)),
		);
		return withDescription(nullable ? schema.nullable() : schema, value);
	}

	const type = value.type;
	let schema: z.ZodType;
	if ('const' in value) {
		schema = strict
			? z.literal(value.const as string | number | boolean)
			: openScalarSchema(type, [value.const]);
	} else if (Array.isArray(value.enum)) {
		schema = strict
			? enumSchema(value.enum)
			: openScalarSchema(type, value.enum);
	} else if (type === 'string') {
		let stringSchema = z.string();
		if (strict && typeof value.minLength === 'number') {
			stringSchema = stringSchema.min(value.minLength);
		}
		if (strict && typeof value.maxLength === 'number') {
			stringSchema = stringSchema.max(value.maxLength);
		}
		schema = stringSchema;
	} else if (type === 'integer' || type === 'number') {
		let numberSchema = z.number();
		if (strict && type === 'integer') numberSchema = numberSchema.int();
		if (strict && typeof value.minimum === 'number') {
			numberSchema = numberSchema.min(value.minimum);
		}
		if (strict && typeof value.exclusiveMinimum === 'number') {
			numberSchema = numberSchema.gt(value.exclusiveMinimum);
		}
		if (strict && typeof value.maximum === 'number') {
			numberSchema = numberSchema.max(value.maximum);
		}
		schema = numberSchema;
	} else if (type === 'boolean') {
		schema = z.boolean();
	} else if (type === 'null') {
		schema = z.null();
	} else if (type === 'array') {
		if (Array.isArray(value.prefixItems)) {
			const [first, ...rest] = value.prefixItems.map((item) =>
				schemaFromOpenApi(item, mode, cache),
			);
			schema = first ? z.tuple([first, ...rest]) : z.tuple([]);
		} else {
			let arraySchema = z.array(schemaFromOpenApi(value.items, mode, cache));
			if (strict && typeof value.minItems === 'number') {
				arraySchema = arraySchema.min(value.minItems);
			}
			if (strict && typeof value.maxItems === 'number') {
				arraySchema = arraySchema.max(value.maxItems);
			}
			schema = arraySchema;
		}
	} else if (type === 'object' || isRecord(value.properties)) {
		const properties = isRecord(value.properties) ? value.properties : {};
		const required = Array.isArray(value.required)
			? value.required.filter(
					// `unknown` is necessary because JSON Schema required entries are parsed from provider JSON.
					(name: unknown): name is string => typeof name === 'string',
				)
			: [];
		const shape: Record<string, z.ZodType> = {};
		for (const [name, property] of Object.entries(properties)) {
			const propertySchema = schemaFromOpenApi(property, mode, cache);
			shape[name] =
				strict && required.includes(name)
					? propertySchema
					: strict
						? propertySchema.optional()
						: propertySchema.nullish();
		}
		const objectSchema = z.object(shape);
		if (strict && value.additionalProperties === false) {
			schema = objectSchema.strict();
		} else if (
			Object.keys(properties).length === 0 &&
			isRecord(value.additionalProperties)
		) {
			// A map (`{ [day]: PopularTime[] }`): check the values, keep any key.
			schema = z.record(
				z.string(),
				schemaFromOpenApi(value.additionalProperties, mode, cache),
			);
		} else {
			// OpenAPI defaults additionalProperties to true; keep provider extensions.
			schema = objectSchema.passthrough();
		}
	} else {
		// `unknown` is necessary because the spec leaves this JSON value untyped.
		schema = z.unknown();
	}
	return withDescription(schema, value);
}

// Built on first use, one operation at a time: converting all 200 operations at
// import would build every response model for an instance that may call two.
const definitionCache = new Map<string, z.ZodType>();
// `unknown` is necessary because each cached request schema has its own fields.
const inputSchemaCache = new Map<string, z.ZodType<Record<string, unknown>>>();
const outputSchemaCache = new Map<string, z.ZodType>();
const operationsById = new Map(
	litescrapeOperations.map((operation) => [operation.id, operation]),
);

export function litescrapeOperationFor(
	id: string,
): LitescrapeOperationDefinition {
	const operation = operationsById.get(id);
	if (!operation) throw new Error('Litescrape operation is unavailable');
	return operation;
}

// `unknown` is necessary because each operation's request body has its own fields.
export function getLitescrapeInputSchema(
	id: string,
): z.ZodType<Record<string, unknown>> {
	let schema = inputSchemaCache.get(id);
	if (!schema) {
		schema = schemaFromOpenApi(
			litescrapeOperationFor(id).input,
			'request',
			new Map(),
		) as z.ZodType<Record<string, unknown>>;
		inputSchemaCache.set(id, schema);
	}
	return schema;
}

export function getLitescrapeOutputSchema(id: string): z.ZodType {
	let schema = outputSchemaCache.get(id);
	if (!schema) {
		const operation = litescrapeOperationFor(id);
		// The top-level response stays non-null: a null or empty body is malformed.
		schema = schemaFromOpenApi(
			litescrapeDefinitions[operation.output.$ref],
			'response',
			definitionCache,
		);
		outputSchemaCache.set(id, schema);
	}
	return schema;
}

/** `input` and `output` are getters, so a schema is built only when something reads it. */
export function litescrapeSchemaEntry(id: string): {
	readonly input: z.ZodType;
	readonly output: z.ZodType;
} {
	return {
		get input() {
			return getLitescrapeInputSchema(id);
		},
		get output() {
			return getLitescrapeOutputSchema(id);
		},
	};
}

function lazyRecord(
	build: (id: string) => z.ZodType,
): Readonly<Record<string, z.ZodType>> {
	const record: Record<string, z.ZodType> = {};
	for (const { id } of litescrapeOperations) {
		Object.defineProperty(record, id, {
			enumerable: true,
			get: () => build(id),
		});
	}
	return record;
}

/** Every manifest operation's schemas by id. Reading a key builds that schema (then cached). */
export const litescrapeInputSchemas = lazyRecord(getLitescrapeInputSchema);
export const litescrapeOutputSchemas = lazyRecord(getLitescrapeOutputSchema);

/** Names of input fields the API reads from the query string (`timeout`). */
export function litescrapeQueryFields(id: string): string[] {
	const properties = litescrapeOperationFor(id).input.properties;
	if (!isRecord(properties)) return [];
	return Object.entries(properties)
		.filter(
			([, property]) =>
				isRecord(property) && property['x-corsair-in'] === 'query',
		)
		.map(([name]) => name);
}

export type { LitescrapeOpenApiSchema, LitescrapeOperationDefinition };

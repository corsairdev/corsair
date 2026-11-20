import { FileInputSchema, FileOutputSchema } from 'corsair/http';
import { z } from 'zod';
import type {
	KernelOpenApiSchema,
	KernelOperationDefinition,
} from './manifest';
import { kernelDefinitions, kernelOperations } from './manifest';

// `unknown` is necessary because raw OpenAPI documents contain arbitrary provider schema keywords.
type OpenApiDocument = Record<string, unknown>;

// `unknown` is necessary because OpenAPI JSON values are untrusted until narrowed by this guard.
function isRecord(value: unknown): value is OpenApiDocument {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * `request` keeps the published contract for what a caller sends: required
 * fields, closed enums, and length and number limits. Objects keep keys the
 * spec doesn't list, so a field Kernel adds before this plugin is regenerated
 * still reaches it; the API itself rejects a key it doesn't know.
 *
 * `response` parses what Kernel sends: every field is optional and nullable,
 * enums are open and unknown fields pass through, so a field the provider adds
 * or leaves empty doesn't fail a read. Types the spec declares (string, number,
 * array, object) are still checked.
 */
type SchemaMode = 'request' | 'response';

/** A file field: a public URL, `{ url }`, `{ base64 }`, or (in TypeScript) a Blob. */
export const KernelFileInputSchema = z
	.union([FileInputSchema, z.instanceof(Blob)])
	.describe(FileInputSchema.description ?? 'A file');

function unionOf(options: z.ZodType[]): z.ZodType {
	const [first, second, ...rest] = options;
	if (!first) return z.never();
	if (!second) return first;
	return z.union([first, second, ...rest]);
}

function withDescription(schema: z.ZodType, value: OpenApiDocument) {
	return typeof value.description === 'string'
		? schema.describe(value.description)
		: schema;
}

/**
 * An open enum for responses: any value of the declared type, so a status
 * Kernel adds later still parses, but never a value of another type.
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

// `unknown` is necessary because union members are provider JSON Schema values of any shape.
function isNullSchema(value: unknown): boolean {
	return isRecord(value) && value.type === 'null';
}

/** `{ required: [...] }` alone: "provide either id or name", not a shape of its own. */
// `unknown` is necessary because union members are provider JSON Schema values of any shape.
function isConstraintOnly(value: unknown): boolean {
	return (
		isRecord(value) && Object.keys(value).every((key) => key === 'required')
	);
}

// `unknown` is necessary because a reference resolves to a provider schema document.
function resolve(value: unknown): unknown {
	let current = value;
	for (let depth = 0; depth < 20; depth++) {
		if (!isRecord(current) || typeof current.$ref !== 'string') return current;
		current = kernelDefinitions[current.$ref];
	}
	return current;
}

/**
 * allOf members that are all objects merge into one object (Kernel uses allOf
 * to extend a request, as process.spawn extends process.exec). Returns
 * undefined when a member is not a plain object.
 */
function mergeAllOf(members: unknown[]): OpenApiDocument | undefined {
	// `unknown` is necessary because merged property schemas are provider JSON Schema values.
	const properties: Record<string, unknown> = {};
	const required: string[] = [];
	for (const member of members) {
		let part = resolve(member);
		if (isRecord(part) && Array.isArray(part.allOf)) {
			part = mergeAllOf(part.allOf);
		}
		if (!isRecord(part)) return undefined;
		if (Array.isArray(part.oneOf) || Array.isArray(part.anyOf)) {
			return undefined;
		}
		// A string or number member (allOf used to attach a description to a $ref).
		if (part.type !== 'object' && !isRecord(part.properties)) return undefined;
		if (isRecord(part.properties)) Object.assign(properties, part.properties);
		if (Array.isArray(part.required)) {
			for (const name of part.required) {
				if (typeof name === 'string') required.push(name);
			}
		}
	}
	return { type: 'object', properties, required };
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
		let schema = cache.get(cacheKey);
		if (!schema) {
			schema = z.lazy(() =>
				schemaFromOpenApi(kernelDefinitions[reference], mode, cache),
			);
			cache.set(cacheKey, schema);
		}
		return value.nullable === true ? schema.nullable() : schema;
	}

	let nullable = value.nullable === true;
	let type = value.type;
	if (Array.isArray(type)) {
		// OpenAPI 3.1 writes a nullable field as type: [X, "null"].
		nullable = nullable || type.includes('null');
		const rest = type.filter((entry) => entry !== 'null');
		type = rest.length === 1 ? rest[0] : undefined;
	}

	for (const key of ['oneOf', 'anyOf'] as const) {
		const list = value[key];
		if (!Array.isArray(list)) continue;
		const members = list.filter((member) => !isNullSchema(member));
		if (members.length > 0 && members.every(isConstraintOnly)) break;
		const schema = unionOf(
			members.map((member) => schemaFromOpenApi(member, mode, cache)),
		);
		const isNullable = nullable || members.length !== list.length;
		return withDescription(isNullable ? schema.nullable() : schema, value);
	}

	if (Array.isArray(value.allOf)) {
		const merged = mergeAllOf(value.allOf);
		const schema = merged
			? schemaFromOpenApi(
					{
						...merged,
						properties: {
							...(isRecord(merged.properties) ? merged.properties : {}),
							...(isRecord(value.properties) ? value.properties : {}),
						},
					},
					mode,
					cache,
				)
			: value.allOf
					.map((member) => schemaFromOpenApi(member, mode, cache))
					.reduce((left, right) => z.intersection(left, right));
		return withDescription(nullable ? schema.nullable() : schema, value);
	}

	let schema: z.ZodType;
	if (value.format === 'binary') {
		schema = strict ? KernelFileInputSchema : z.string();
	} else if ('const' in value) {
		schema = strict
			? z.literal(value.const as string | number | boolean)
			: openScalarSchema(type, [value.const]);
	} else if (Array.isArray(value.enum)) {
		if (value.enum.includes(null)) nullable = true;
		const members = value.enum.filter((member) => member !== null);
		schema = strict ? enumSchema(members) : openScalarSchema(type, members);
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
		if (strict && typeof value.exclusiveMaximum === 'number') {
			numberSchema = numberSchema.lt(value.exclusiveMaximum);
		}
		schema = numberSchema;
	} else if (type === 'boolean') {
		schema = z.boolean();
	} else if (type === 'null') {
		schema = z.null();
	} else if (type === 'array') {
		let arraySchema = z.array(schemaFromOpenApi(value.items, mode, cache));
		if (strict && typeof value.minItems === 'number') {
			arraySchema = arraySchema.min(value.minItems);
		}
		if (strict && typeof value.maxItems === 'number') {
			arraySchema = arraySchema.max(value.maxItems);
		}
		schema = arraySchema;
	} else if (
		type === 'object' ||
		isRecord(value.properties) ||
		isRecord(value.additionalProperties)
	) {
		const properties = isRecord(value.properties) ? value.properties : {};
		const required = Array.isArray(value.required)
			? value.required.filter(
					// `unknown` is necessary because JSON Schema required entries are parsed from provider JSON.
					(name: unknown): name is string => typeof name === 'string',
				)
			: [];
		if (
			Object.keys(properties).length === 0 &&
			isRecord(value.additionalProperties)
		) {
			// A map (`tags`, `env_vars`): check the values, keep any key.
			schema = z.record(
				z.string(),
				schemaFromOpenApi(value.additionalProperties, mode, cache),
			);
		} else {
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
			// Unknown keys are kept in both modes (see SchemaMode).
			schema = z.object(shape).passthrough();
		}
	} else {
		// `unknown` is necessary because the spec leaves this JSON value untyped.
		schema = z.unknown();
	}
	return withDescription(nullable ? schema.nullable() : schema, value);
}

/** What a call that answers 2xx with no body returns. */
export const KernelEmptyResponseSchema = z
	.object({
		success: z
			.literal(true)
			.describe('Kernel accepted the call; it answers with no body.'),
	})
	.strict();

const pagingFields = {
	offset: 'next_offset',
	page_token: 'next_page_token',
	cursor: 'next_cursor',
} as const;

export function kernelPagingField(
	operation: KernelOperationDefinition,
): (typeof pagingFields)[keyof typeof pagingFields] | undefined {
	return operation.paging ? pagingFields[operation.paging] : undefined;
}

// Built on first use, one operation at a time: converting all 200 operations at
// import would build every response model for an instance that may call two.
const definitionCache = new Map<string, z.ZodType>();
// `unknown` is necessary because each cached request schema has its own fields.
const inputSchemaCache = new Map<string, z.ZodType<Record<string, unknown>>>();
const outputSchemaCache = new Map<string, z.ZodType>();
const operationsById = new Map(
	kernelOperations.map((operation) => [operation.id, operation]),
);

export function kernelOperationFor(id: string): KernelOperationDefinition {
	const operation = operationsById.get(id);
	if (!operation) throw new Error('Kernel operation is unavailable');
	return operation;
}

function buildInputSchema(operation: KernelOperationDefinition): z.ZodType {
	const input = operation.input;
	if (Array.isArray(input.allOf)) {
		// Parameters plus a body that is one of several shapes (vault items,
		// vault provider configs): both must hold.
		const [params, body] = input.allOf;
		return z.intersection(
			schemaFromOpenApi(params, 'request', new Map()),
			schemaFromOpenApi(body, 'request', new Map()),
		);
	}
	const schema = schemaFromOpenApi(input, 'request', new Map());
	// With no body every field is a path, query or header parameter, so an
	// unknown key can only be a mistake (it would be dropped silently).
	return operation.request === 'none' && schema instanceof z.ZodObject
		? schema.strict()
		: schema;
}

// `unknown` is necessary because each operation's input has its own fields.
export function getKernelInputSchema(
	id: string,
): z.ZodType<Record<string, unknown>> {
	let schema = inputSchemaCache.get(id);
	if (!schema) {
		schema = buildInputSchema(kernelOperationFor(id)) as z.ZodType<
			Record<string, unknown>
		>;
		inputSchemaCache.set(id, schema);
	}
	return schema;
}

function buildOutputSchema(operation: KernelOperationDefinition): z.ZodType {
	if (operation.response === 'empty') return KernelEmptyResponseSchema;
	if (operation.response === 'file') {
		return operation.paging === 'cursor'
			? FileOutputSchema.extend({
					has_more: z
						.boolean()
						.describe(
							'True when another chunk follows; pass next_cursor as cursor to read it.',
						),
					next_cursor: z
						.string()
						.nullable()
						.describe('Pass as cursor to read the next chunk.'),
				})
			: FileOutputSchema;
	}
	// The top-level response stays non-null: a null or empty body is malformed.
	const body = schemaFromOpenApi(operation.output, 'response', definitionCache);
	const field = kernelPagingField(operation);
	if (field) {
		const output = resolve(operation.output);
		const items =
			isRecord(output) && output.type === 'array'
				? schemaFromOpenApi(output.items, 'response', definitionCache)
				: z.unknown();
		return z.object({
			items: z.array(items).describe('This page of results.'),
			has_more: z
				.boolean()
				.describe(
					`True when more results follow; pass ${field} as ${operation.paging} to read them.`,
				),
			[field]: (operation.paging === 'offset' ? z.number() : z.string())
				.nullable()
				.describe(
					`Value for \`${operation.paging}\` that reads the next page, or null on the last page.`,
				),
		});
	}
	return operation.emptyMeansNone ? body.nullable() : body;
}

export function getKernelOutputSchema(id: string): z.ZodType {
	let schema = outputSchemaCache.get(id);
	if (!schema) {
		schema = buildOutputSchema(kernelOperationFor(id));
		outputSchemaCache.set(id, schema);
	}
	return schema;
}

/** `input` and `output` are getters, so a schema is built only when something reads it. */
export function kernelSchemaEntry(id: string): {
	readonly input: z.ZodType;
	readonly output: z.ZodType;
} {
	return {
		get input() {
			return getKernelInputSchema(id);
		},
		get output() {
			return getKernelOutputSchema(id);
		},
	};
}

function lazyRecord(
	build: (id: string) => z.ZodType,
): Readonly<Record<string, z.ZodType>> {
	const record: Record<string, z.ZodType> = {};
	for (const { id } of kernelOperations) {
		Object.defineProperty(record, id, {
			enumerable: true,
			get: () => build(id),
		});
	}
	return record;
}

/** Every operation's schemas by id. Reading a key builds that schema (then cached). */
export const kernelInputSchemas = lazyRecord(getKernelInputSchema);
export const kernelOutputSchemas = lazyRecord(getKernelOutputSchema);

export type KernelFieldLocation = 'path' | 'query' | 'header' | 'body';

export type KernelInputField = {
	name: string;
	in: KernelFieldLocation;
	/** The HTTP header a header field is sent as (`Idempotency-Key`). */
	header?: string;
	/** A query array sent as one comma-separated value (`explode: false`). */
	commaSeparated?: boolean;
};

const fieldCache = new Map<string, readonly KernelInputField[]>();

/** Where each named input goes. Body fields are whatever is left over. */
export function kernelInputFields(id: string): readonly KernelInputField[] {
	let fields = fieldCache.get(id);
	if (fields) return fields;
	const operation = kernelOperationFor(id);
	const input = Array.isArray(operation.input.allOf)
		? operation.input.allOf[0]
		: operation.input;
	const properties =
		isRecord(input) && isRecord(input.properties) ? input.properties : {};
	fields = Object.entries(properties).map(([name, property]) => {
		const location =
			isRecord(property) && typeof property['x-corsair-in'] === 'string'
				? (property['x-corsair-in'] as KernelFieldLocation)
				: 'body';
		return {
			name,
			in: location,
			...(isRecord(property) && typeof property['x-corsair-header'] === 'string'
				? { header: property['x-corsair-header'] }
				: {}),
			...(isRecord(property) && property['x-corsair-explode'] === false
				? { commaSeparated: true }
				: {}),
		};
	});
	fieldCache.set(id, fields);
	return fields;
}

export type { KernelOpenApiSchema, KernelOperationDefinition };

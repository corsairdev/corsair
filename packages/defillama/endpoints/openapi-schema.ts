import { z } from 'zod';
import type {
	DefillamaOpenApiSchema,
	DefillamaOperationDefinition,
} from './manifest';
import { defillamaDefinitions, defillamaOperations } from './manifest';

// `unknown` is necessary because raw OpenAPI documents contain arbitrary provider schema keywords.
type OpenApiDocument = Record<string, unknown>;

// `unknown` is necessary because OpenAPI JSON values are untrusted until narrowed by this guard.
function isRecord(value: unknown): value is OpenApiDocument {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** `format: uri` on a request field: an absolute URL. */
function isAbsoluteUrl(value: string): boolean {
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}

/** `format: email` on a request field: one @ with text on both sides and a dotted domain. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * `request` keeps the published contract for what a caller sends: required
 * fields, closed enums, patterns, and length and number limits. Objects keep
 * keys the spec doesn't list, so a field DefiLlama adds before this plugin is
 * regenerated still reaches it; DefiLlama ignores or refuses a key it doesn't know.
 * Objects the spec closes (`additionalProperties: false`) refuse extra keys.
 *
 * `response` parses what DefiLlama sends: every field is optional and nullable,
 * enums are open and unknown fields pass through, so a field the provider adds
 * or leaves empty doesn't fail a read. Types the spec declares (string, number,
 * array, object) are still checked.
 */
/** `request`: strict checks on what is sent. `response`: lenient (optional, nullable, unknown keys kept). */
type SchemaMode = 'request' | 'response';

function unionOf(options: z.ZodType[]): z.ZodType {
	const [first, second, ...rest] = options;
	if (!first) return z.never();
	if (!second) return first;
	return z.union([first, second, ...rest]);
}

/**
 * The spec's `pattern` as a RegExp (an E.164 number, a hex hash, a handle).
 * A pattern JavaScript can't compile is skipped rather than failing the whole
 * schema: DefiLlama still checks it.
 */
// `unknown` is necessary because the keyword comes from provider JSON.
function patternOf(value: unknown): RegExp | undefined {
	if (typeof value !== 'string') return undefined;
	try {
		return new RegExp(value);
	} catch {
		return undefined;
	}
}

function withDescription(schema: z.ZodType, value: OpenApiDocument) {
	return typeof value.description === 'string'
		? schema.describe(value.description)
		: schema;
}

/**
 * An open enum for responses: any value of the declared type, so a status
 * DefiLlama adds later still parses, but never a value of another type.
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

/** The field sets of an `anyOf` made only of `{ required: [...] }` members. */
// `unknown` because the anyOf list is raw provider JSON Schema.
function requiredAlternatives(list: unknown): string[][] {
	if (!Array.isArray(list) || list.length === 0) return [];
	if (!list.every(isConstraintOnly)) return [];
	return list.map((member) =>
		(Array.isArray(member.required) ? member.required : []).filter(
			// `unknown` because required entries are parsed from provider JSON.
			(name: unknown): name is string => typeof name === 'string',
		),
	);
}

// `unknown` is necessary because a reference resolves to a provider schema document.
function resolve(value: unknown): unknown {
	let current = value;
	for (let depth = 0; depth < 20; depth++) {
		if (!isRecord(current) || typeof current.$ref !== 'string') return current;
		current = defillamaDefinitions[current.$ref];
	}
	return current;
}

/**
 * allOf members that are all objects merge into one object (a schema uses allOf
 * to attach a description to a $ref, or to build one object from its parts). Returns undefined
 * when a member is not a plain object.
 */
// `unknown` because allOf members are raw provider JSON Schema documents, resolved and checked below.
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
		if (isRecord(part.properties)) {
			for (const [name, schema] of Object.entries(part.properties)) {
				// A property two members both declare must satisfy both, so neither
				// member's constraints (a minimum, an enum) are lost.
				properties[name] =
					name in properties ? { allOf: [properties[name], schema] } : schema;
			}
		}
		if (Array.isArray(part.required)) {
			for (const name of part.required) {
				if (typeof name === 'string') required.push(name);
			}
		}
	}
	return { type: 'object', properties, required };
}

/** References being built right now (conversion is synchronous). */
const building = new Set<string>();

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
			if (building.has(cacheKey)) {
				// A schema that contains itself: only this inner use is lazy.
				return z.lazy(() => cache.get(cacheKey) ?? z.unknown());
			}
			// Built in place, not behind z.lazy: Studio's form builder doesn't
			// unwrap ZodLazy, so a referenced object (an order's billing
			// address) would show as a disabled field.
			building.add(cacheKey);
			try {
				schema = schemaFromOpenApi(
					defillamaDefinitions[reference],
					mode,
					cache,
				);
			} finally {
				building.delete(cacheKey);
			}
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
		if (rest.length > 1) {
			// A field typed `["string", "integer"]`: one member per type, each
			// with the field's own limits (a digit pattern, a range).
			const schema = unionOf(
				rest.map((entry) =>
					schemaFromOpenApi(
						{ ...value, type: entry, nullable: false, description: undefined },
						mode,
						cache,
					),
				),
			);
			return withDescription(nullable ? schema.nullable() : schema, value);
		}
		type = rest[0];
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
	if ('const' in value) {
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
		const pattern = strict ? patternOf(value.pattern) : undefined;
		if (pattern) stringSchema = stringSchema.regex(pattern);
		if (strict && value.format === 'uri') {
			stringSchema = stringSchema.refine(isAbsoluteUrl, {
				message: 'Invalid URL',
			});
		}
		if (strict && value.format === 'email') {
			stringSchema = stringSchema.regex(EMAIL, 'Invalid email address');
		}
		schema = stringSchema;
	} else if (type === 'integer' || type === 'number') {
		let numberSchema = z.number();
		// A cursor or count that comes back fractional would be refused when sent back.
		if (type === 'integer') numberSchema = numberSchema.int();
		// OpenAPI 3.0 writes an exclusive bound as `exclusiveMinimum: true` next to
		// `minimum`; 3.1 writes the bound itself as `exclusiveMinimum: 0`. The spec
		// uses both.
		if (strict && typeof value.minimum === 'number') {
			numberSchema =
				value.exclusiveMinimum === true
					? numberSchema.gt(value.minimum)
					: numberSchema.min(value.minimum);
		}
		if (strict && typeof value.exclusiveMinimum === 'number') {
			numberSchema = numberSchema.gt(value.exclusiveMinimum);
		}
		if (strict && typeof value.maximum === 'number') {
			numberSchema =
				value.exclusiveMaximum === true
					? numberSchema.lt(value.maximum)
					: numberSchema.max(value.maximum);
		}
		if (strict && typeof value.exclusiveMaximum === 'number') {
			numberSchema = numberSchema.lt(value.exclusiveMaximum);
		}
		schema = numberSchema;
	} else if (type === 'boolean') {
		schema = z.boolean();
	} else if (type === 'null') {
		schema = z.null();
	} else if (type === 'array' && Array.isArray(value.items)) {
		// Positional rows ([timestamp, open, high, low, close, volume]): a tuple.
		// A response row takes null in any column and extra trailing columns, so
		// a column DefiLlama adds or leaves empty doesn't fail a read.
		const columns: z.ZodType[] = value.items.map((item) => {
			const column = schemaFromOpenApi(item, mode, cache);
			return strict ? column : column.nullable();
		});
		const [first, ...others] = columns;
		const tuple = first ? z.tuple([first, ...others]) : z.tuple([]);
		schema = strict ? tuple : tuple.rest(z.unknown());
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
			// A map (custom field values by key): check the values, keep any key.
			schema = z.record(
				z.string(),
				schemaFromOpenApi(value.additionalProperties, mode, cache),
			);
		} else {
			const shape: Record<string, z.ZodType> = {};
			for (const [name, property] of Object.entries(properties)) {
				// Server-set fields (an id, a sync status) are never part of a request.
				if (strict && isRecord(property) && property.readOnly === true)
					continue;
				const propertySchema = schemaFromOpenApi(property, mode, cache);
				shape[name] =
					strict && required.includes(name)
						? propertySchema
						: strict
							? propertySchema.optional()
							: propertySchema.nullish();
			}
			// Unknown keys are kept (see SchemaMode), except in a request object the
			// spec closes with `additionalProperties: false` (`{ mode: "none" }` for
			// an empty quote request takes nothing at all).
			let objectSchema =
				strict && value.additionalProperties === false
					? z.object(shape).strict()
					: z.object(shape).passthrough();
			// `anyOf: [{required: [a]}, {required: [b]}]` on a request: at least one
			// of those fields must be set.
			const alternatives = strict ? requiredAlternatives(value.anyOf) : [];
			if (alternatives.length > 0) {
				objectSchema = objectSchema.superRefine((input, ctx) => {
					const given = input as Record<string, unknown>;
					const met = alternatives.some((names) =>
						names.every((name) => given[name] !== undefined),
					);
					if (!met) {
						ctx.addIssue({
							code: 'custom',
							message: `DefiLlama needs at least one of: ${alternatives
								.map((names) => names.join(' + '))
								.join(', ')}`,
						});
					}
				});
			}
			schema = objectSchema;
		}
	} else {
		// `unknown` is necessary because the spec leaves this JSON value untyped.
		schema = z.unknown();
	}
	return withDescription(nullable ? schema.nullable() : schema, value);
}

// Built on first use, one operation at a time: converting all 66 operations at
// import would build every response model for a site that may call two.
const definitionCache = new Map<string, z.ZodType>();
// `unknown` is necessary because each cached request schema has its own fields.
const inputSchemaCache = new Map<string, z.ZodType<Record<string, unknown>>>();
const outputSchemaCache = new Map<string, z.ZodType>();
const operationsById = new Map(
	defillamaOperations.map((operation) => [operation.id, operation]),
);

export function defillamaOperationFor(
	id: string,
): DefillamaOperationDefinition {
	const operation = operationsById.get(id);
	if (!operation) throw new Error('DefiLlama operation is unavailable');
	return operation;
}

function buildInputSchema(operation: DefillamaOperationDefinition): z.ZodType {
	const schema = schemaFromOpenApi(operation.input, 'request', new Map());
	// Every field is a path or query parameter, so an unknown key can only
	// be a mistake (it would be dropped silently).
	return schema instanceof z.ZodObject ? schema.strict() : schema;
}

// `unknown` is necessary because each operation's input has its own fields.
export function getDefillamaInputSchema(
	id: string,
): z.ZodType<Record<string, unknown>> {
	let schema = inputSchemaCache.get(id);
	if (!schema) {
		schema = buildInputSchema(defillamaOperationFor(id)) as z.ZodType<
			// `unknown` because each cached request schema has its own fields.
			Record<string, unknown>
		>;
		inputSchemaCache.set(id, schema);
	}
	return schema;
}

function buildOutputSchema(operation: DefillamaOperationDefinition): z.ZodType {
	// The top-level response stays non-null: a null or empty body is malformed.
	const schema = schemaFromOpenApi(
		operation.output,
		'response',
		definitionCache,
	);
	// A route the spec leaves untyped still answers some JSON value: a missing
	// body (a 204) or null is an error, while 0, false or [] pass.
	return schema instanceof z.ZodUnknown
		? schema.refine((value) => value !== undefined && value !== null, {
				message: 'DefiLlama answered without a body',
			})
		: schema;
}

/** Whether the documented response is a list (a JSON array). */
export function defillamaOutputIsList(id: string): boolean {
	const output = resolve(defillamaOperationFor(id).output);
	return isRecord(output) && output.type === 'array';
}

export function getDefillamaOutputSchema(id: string): z.ZodType {
	let schema = outputSchemaCache.get(id);
	if (!schema) {
		schema = buildOutputSchema(defillamaOperationFor(id));
		outputSchemaCache.set(id, schema);
	}
	return schema;
}

/** `input` and `output` are getters, so a schema is built only when something reads it. */
export function defillamaSchemaEntry(id: string): {
	readonly input: z.ZodType;
	readonly output: z.ZodType;
} {
	return {
		get input() {
			return getDefillamaInputSchema(id);
		},
		get output() {
			return getDefillamaOutputSchema(id);
		},
	};
}

function lazyRecord(
	build: (id: string) => z.ZodType,
): Readonly<Record<string, z.ZodType>> {
	const record: Record<string, z.ZodType> = {};
	for (const { id } of defillamaOperations) {
		Object.defineProperty(record, id, {
			enumerable: true,
			get: () => build(id),
		});
	}
	return record;
}

/** Every operation's schemas by id. Reading a key builds that schema (then cached). */
export const defillamaInputSchemas = lazyRecord(getDefillamaInputSchema);
export const defillamaOutputSchemas = lazyRecord(getDefillamaOutputSchema);

/** `path` or `query`: the named parameter. */
export type DefillamaFieldLocation = 'path' | 'query';

const LOCATIONS: readonly string[] = ['path', 'query'];

export type DefillamaInputField = {
	/** The input field's name. */
	name: string;
	in: DefillamaFieldLocation;
	/** The name DefiLlama reads. */
	wire: string;
};

const fieldCache = new Map<string, readonly DefillamaInputField[]>();

/** Where each named input goes. */
export function defillamaInputFields(
	id: string,
): readonly DefillamaInputField[] {
	let fields = fieldCache.get(id);
	if (fields) return fields;
	const operation = defillamaOperationFor(id);
	const properties = isRecord(operation.input.properties)
		? operation.input.properties
		: {};
	fields = Object.entries(properties).map(([name, property]) => {
		const record = isRecord(property) ? property : {};
		const marked = record['x-corsair-in'];
		const location =
			typeof marked === 'string' && LOCATIONS.includes(marked)
				? (marked as DefillamaFieldLocation)
				: 'query';
		return {
			name,
			in: location,
			wire:
				typeof record['x-corsair-wire'] === 'string'
					? record['x-corsair-wire']
					: name,
		};
	});
	fieldCache.set(id, fields);
	return fields;
}

/** Shown in place of a map key (a metadata key, a header name) in an issue path. */
export const MASKED_KEY = '<key>';

/** The schemas a value may match: the schema itself, or each union member. */
// `unknown` is necessary because the walk covers raw JSON Schema documents.
function alternatives(value: unknown, depth = 0): OpenApiDocument[] {
	const schema = resolve(value);
	if (!isRecord(schema) || depth > 10) return [];
	const members = [
		...(Array.isArray(schema.anyOf) ? schema.anyOf : []),
		...(Array.isArray(schema.oneOf) ? schema.oneOf : []),
		...(Array.isArray(schema.allOf) ? schema.allOf : []),
	];
	return members.length > 0
		? [schema, ...members.flatMap((member) => alternatives(member, depth + 1))]
		: [schema];
}

/**
 * A zod issue path with every map key masked: `<field>.<key>` rather than
 * the key the caller sent. Field names the spec declares and list
 * indexes stay, so the message still says which field is wrong.
 */
export function maskedIssuePath(
	id: string,
	path: readonly PropertyKey[],
	mode: 'input' | 'output',
): string {
	const operation = defillamaOperationFor(id);
	// `unknown` is necessary because the walk covers raw JSON Schema documents.
	let current: unknown = mode === 'input' ? operation.input : operation.output;
	const parts: string[] = [];
	for (const segment of path) {
		const options = alternatives(current);
		if (typeof segment === 'number') {
			parts.push(String(segment));
			current = options.find((option) => option.items !== undefined)?.items;
			continue;
		}
		const key = String(segment);
		const declared = options.find(
			(option) => isRecord(option.properties) && key in option.properties,
		);
		if (declared && isRecord(declared.properties)) {
			parts.push(key);
			current = declared.properties[key];
			continue;
		}
		parts.push(MASKED_KEY);
		current = options.find((option) =>
			isRecord(option.additionalProperties),
		)?.additionalProperties;
	}
	return parts.join('.');
}

export type { DefillamaOpenApiSchema, DefillamaOperationDefinition };

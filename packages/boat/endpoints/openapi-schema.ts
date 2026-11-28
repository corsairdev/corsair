import { FileInputSchema, FileOutputSchema } from 'corsair/http';
import { z } from 'zod';
import type { BoatOpenApiSchema, BoatOperationDefinition } from './manifest';
import { boatDefinitions, boatOperations } from './manifest';

// `unknown` is necessary because raw OpenAPI documents contain arbitrary provider schema keywords.
type OpenApiDocument = Record<string, unknown>;

// `unknown` is necessary because OpenAPI JSON values are untrusted until narrowed by this guard.
function isRecord(value: unknown): value is OpenApiDocument {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * `request` keeps the published contract for what a caller sends: required
 * fields, closed enums, patterns, and length and number limits. Objects keep
 * keys the spec doesn't list, so a field Boat adds before this plugin is
 * regenerated still reaches it; Boat ignores or refuses a key it doesn't know.
 * Objects the spec closes (`additionalProperties: false`) refuse extra keys.
 *
 * `response` parses what Boat sends: every field is optional and nullable,
 * enums are open and unknown fields pass through, so a field the provider adds
 * or leaves empty doesn't fail a read. Types the spec declares (string, number,
 * array, object) are still checked.
 */
type SchemaMode = 'request' | 'response';

/** A file field: a public URL, `{ url }`, `{ base64 }`, or (in TypeScript) a Blob. */
export const BoatFileInputSchema = z
	.union([FileInputSchema, z.instanceof(Blob)])
	.describe(FileInputSchema.description ?? 'A file');

function unionOf(options: z.ZodType[]): z.ZodType {
	const [first, second, ...rest] = options;
	if (!first) return z.never();
	if (!second) return first;
	return z.union([first, second, ...rest]);
}

/**
 * The spec's `pattern` as a RegExp (an E.164 number, a hex hash, a handle).
 * A pattern JavaScript can't compile is skipped rather than failing the whole
 * schema: Boat still checks it.
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

/** A number written as a digit string ("100", "9.5"). */
const NUMERIC_STRING = /^-?\d+(\.\d+)?$/;

function withDescription(schema: z.ZodType, value: OpenApiDocument) {
	return typeof value.description === 'string'
		? schema.describe(value.description)
		: schema;
}

/**
 * An open enum for responses: any value of the declared type, so a status
 * Boat adds later still parses, but never a value of another type.
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
		current = boatDefinitions[current.$ref];
	}
	return current;
}

/**
 * allOf members that are all objects merge into one object (a spec uses allOf
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
			// unwrap ZodLazy, so a referenced object (a nested request
			// fields) would show as a disabled field.
			building.add(cacheKey);
			try {
				schema = schemaFromOpenApi(boatDefinitions[reference], mode, cache);
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
			// with the field's own limits (a pattern, a range).
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
	if (value.format === 'binary') {
		schema = strict ? BoatFileInputSchema : z.string();
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
		// JSON Schema counts characters (code points), not UTF-16 units: an emoji is one.
		const minLength = value.minLength;
		const maxLength = value.maxLength;
		if (strict && typeof minLength === 'number') {
			stringSchema = stringSchema.refine(
				(text) => [...text].length >= minLength,
				{
					message: `Too short: expected at least ${minLength} characters`,
				},
			);
		}
		if (strict && typeof maxLength === 'number') {
			stringSchema = stringSchema.refine(
				(text) => [...text].length <= maxLength,
				{
					message: `Too long: expected at most ${maxLength} characters`,
				},
			);
		}
		const pattern = strict ? patternOf(value.pattern) : undefined;
		if (pattern) stringSchema = stringSchema.regex(pattern);
		schema = stringSchema;
		// The string member of a `["integer", "string"]` field (a page size) carries
		// the field's range too: a digit string gets the same bounds as the number.
		if (strict && hasNumericBounds(value)) {
			schema = stringSchema.refine(
				(text) =>
					!NUMERIC_STRING.test(text) || withinBounds(Number(text), value),
				{ message: 'Number out of range' },
			);
		}
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
			// A map (metadata by key): check the values, keep any key.
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
			// spec closes with `additionalProperties: false`.
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
							message: `Boat needs at least one of: ${alternatives
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

/** What a route that answers with text (Markdown, plain text) returns. */
export const BoatTextResponseSchema = z
	.object({
		text: z.string().describe('The response body as text.'),
		contentType: z
			.string()
			.nullable()
			.describe('The content type Boat answered with.'),
	})
	.strict();

/** What a call that answers 2xx with no body returns. */
export const BoatEmptyResponseSchema = z
	.object({
		success: z
			.literal(true)
			.describe('Boat accepted the call; it answered with no body.'),
	})
	.strict();

// Built on first use, one operation at a time: converting every operation at
// import would build every response model for an instance that may call two.
const definitionCache = new Map<string, z.ZodType>();
// `unknown` is necessary because each cached request schema has its own fields.
const inputSchemaCache = new Map<string, z.ZodType<Record<string, unknown>>>();
const outputSchemaCache = new Map<string, z.ZodType>();
const operationsById = new Map(
	boatOperations.map((operation) => [operation.id, operation]),
);

export function boatOperationFor(id: string): BoatOperationDefinition {
	const operation = operationsById.get(id);
	if (!operation) throw new Error('Boat operation is unavailable');
	return operation;
}

function buildInputSchema(operation: BoatOperationDefinition): z.ZodType {
	const schema = schemaFromOpenApi(operation.input, 'request', new Map());
	// With no body every field is a path, query or header parameter, so an
	// unknown key can only be a mistake (it would be dropped silently).
	return operation.request === 'none' && schema instanceof z.ZodObject
		? schema.strict()
		: schema;
}

// `unknown` is necessary because each operation's input has its own fields.
export function getBoatInputSchema(
	id: string,
): z.ZodType<Record<string, unknown>> {
	let schema = inputSchemaCache.get(id);
	if (!schema) {
		schema = buildInputSchema(boatOperationFor(id)) as z.ZodType<
			// `unknown` because each cached request schema has its own fields.
			Record<string, unknown>
		>;
		inputSchemaCache.set(id, schema);
	}
	return schema;
}

function buildOutputSchema(operation: BoatOperationDefinition): z.ZodType {
	if (operation.response === 'empty') return BoatEmptyResponseSchema;
	if (operation.response === 'file') return FileOutputSchema;
	// The top-level response stays non-null: a null or empty body is malformed,
	// unless the spec documents a bodiless 2xx for the route (`emptyOk`).
	if (operation.response === 'text') return BoatTextResponseSchema;
	const schema = schemaFromOpenApi(
		operation.output,
		'response',
		definitionCache,
	);
	const paging = operation.headerCursor;
	if (paging) {
		return z.object({
			[paging.items]: schema.describe('This page of results.'),
			nextCursor: z
				.string()
				.nullable()
				.describe(
					`Pass as ${paging.input} to read the next page; null on the last page.`,
				),
		});
	}
	return operation.emptyOk
		? z.union([schema, BoatEmptyResponseSchema])
		: schema;
}

export function getBoatOutputSchema(id: string): z.ZodType {
	let schema = outputSchemaCache.get(id);
	if (!schema) {
		schema = buildOutputSchema(boatOperationFor(id));
		outputSchemaCache.set(id, schema);
	}
	return schema;
}

/** `input` and `output` are getters, so a schema is built only when something reads it. */
export function boatSchemaEntry(id: string): {
	readonly input: z.ZodType;
	readonly output: z.ZodType;
} {
	return {
		get input() {
			return getBoatInputSchema(id);
		},
		get output() {
			return getBoatOutputSchema(id);
		},
	};
}

function lazyRecord(
	build: (id: string) => z.ZodType,
): Readonly<Record<string, z.ZodType>> {
	const record: Record<string, z.ZodType> = {};
	for (const { id } of boatOperations) {
		Object.defineProperty(record, id, {
			enumerable: true,
			get: () => build(id),
		});
	}
	return record;
}

/** Every operation's schemas by id. Reading a key builds that schema (then cached). */
export const boatInputSchemas = lazyRecord(getBoatInputSchema);
export const boatOutputSchemas = lazyRecord(getBoatOutputSchema);

/**
 * - `path`, `query`, `header`: the named parameter.
 * - `body`: one field of the JSON body (the default).
 * - `rawBody`: the whole body (a JSON array or a file the route takes as-is).
 */
export type BoatFieldLocation =
	| 'path'
	| 'query'
	| 'header'
	| 'body'
	| 'rawBody';

export type BoatInputField = {
	name: string;
	in: BoatFieldLocation;
	/** The name on the wire when the input renames it (a body field that clashes with a path id). */
	wire: string;
	/** The HTTP header a header field is sent as. */
	header?: string;
	/** A query list sent as one joined value (`include=chunks,memories`). */
	join?: string;
	/** A path value that may hold slashes (a file path): each segment is encoded on its own. */
	slashes?: boolean;
};

const fieldCache = new Map<string, readonly BoatInputField[]>();

/** Where each named input goes. Body fields are whatever is left over. */
export function boatInputFields(id: string): readonly BoatInputField[] {
	let fields = fieldCache.get(id);
	if (fields) return fields;
	const operation = boatOperationFor(id);
	const properties = isRecord(operation.input.properties)
		? operation.input.properties
		: {};
	fields = Object.entries(properties).map(([name, property]) => {
		const record = isRecord(property) ? property : {};
		const location =
			typeof record['x-corsair-in'] === 'string'
				? (record['x-corsair-in'] as BoatFieldLocation)
				: 'body';
		return {
			name,
			in: location,
			wire:
				typeof record['x-corsair-name'] === 'string'
					? record['x-corsair-name']
					: name,
			...(typeof record['x-corsair-header'] === 'string'
				? { header: record['x-corsair-header'] }
				: {}),
			...(typeof record['x-corsair-join'] === 'string'
				? { join: record['x-corsair-join'] }
				: {}),
			...(record['x-corsair-slashes'] === true ? { slashes: true } : {}),
		};
	});
	fieldCache.set(id, fields);
	return fields;
}

/**
 * The keys a caller chose inside map-shaped fields (metadata, filters by
 * key): customer data the transport can't tell from field names, so the
 * client scrubs them from error bodies too. Declared field names are not
 * collected.
 */
// `unknown` because the walk pairs a validated value with its raw JSON Schema.
export function customerMapKeys(
	schema: unknown,
	value: unknown,
	depth = 0,
): string[] {
	if (depth > 10 || value === null || typeof value !== 'object') return [];
	const options = alternatives(schema);
	if (Array.isArray(value)) {
		const items = options.find((option) => option.items !== undefined)?.items;
		return value.flatMap((item) => customerMapKeys(items, item, depth + 1));
	}
	const keys: string[] = [];
	for (const [key, inner] of Object.entries(value)) {
		const declared = options.find(
			(option) => isRecord(option.properties) && key in option.properties,
		);
		if (declared && isRecord(declared.properties)) {
			keys.push(...customerMapKeys(declared.properties[key], inner, depth + 1));
			continue;
		}
		keys.push(key);
		const map = options.find((option) =>
			isRecord(option.additionalProperties),
		)?.additionalProperties;
		keys.push(...customerMapKeys(map, inner, depth + 1));
	}
	return keys;
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
	const operation = boatOperationFor(id);
	// `unknown` is necessary because the walk covers raw JSON Schema documents.
	let current: unknown = mode === 'input' ? operation.input : operation.output;
	const parts: string[] = [];
	let rest = path;
	// A header-paged output wraps the documented list in `{ <items>, nextCursor }`.
	const paging = mode === 'output' ? operation.headerCursor : undefined;
	if (paging && (path[0] === paging.items || path[0] === 'nextCursor')) {
		parts.push(String(path[0]));
		if (path[0] === 'nextCursor') return parts.join('.');
		rest = path.slice(1);
	}
	for (const segment of rest) {
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

export type { BoatOpenApiSchema, BoatOperationDefinition };

function hasNumericBounds(value: OpenApiDocument): boolean {
	return (
		typeof value.minimum === 'number' ||
		typeof value.maximum === 'number' ||
		typeof value.exclusiveMinimum === 'number' ||
		typeof value.exclusiveMaximum === 'number'
	);
}

/** The same bounds the number branch of schemaFromOpenApi applies. */
function withinBounds(number: number, value: OpenApiDocument): boolean {
	const { minimum, maximum, exclusiveMinimum, exclusiveMaximum } = value;
	if (typeof minimum === 'number') {
		if (exclusiveMinimum === true ? number <= minimum : number < minimum)
			return false;
	}
	if (typeof exclusiveMinimum === 'number' && number <= exclusiveMinimum)
		return false;
	if (typeof maximum === 'number') {
		if (exclusiveMaximum === true ? number >= maximum : number > maximum)
			return false;
	}
	if (typeof exclusiveMaximum === 'number' && number >= exclusiveMaximum)
		return false;
	return true;
}

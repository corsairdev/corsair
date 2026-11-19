import { z } from 'zod';
import type { OpenseoJsonSchema, OpenseoOperationDefinition } from './manifest';
import { openseoOperations } from './manifest';

// `unknown` is necessary because raw JSON Schema documents contain arbitrary provider keywords.
type JsonSchemaDocument = Record<string, unknown>;

// `unknown` is necessary because JSON Schema values are untrusted until narrowed by this guard.
function isRecord(value: unknown): value is JsonSchemaDocument {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * `request` keeps the published contract: required fields, closed enums,
 * length and number limits, and no unknown fields where the tool schema says
 * `additionalProperties: false`.
 *
 * `response` parses what OpenSEO sends: every field is optional and nullable,
 * enums are open and unknown fields pass through, so a field the server adds
 * or leaves out doesn't fail a read. Types the schema declares (string,
 * number, array, object) are still checked.
 */
type SchemaMode = 'request' | 'response';

/**
 * An open enum for responses: any value of the declared type, so a status
 * OpenSEO adds later still parses, but never a value of another type. Without
 * a declared type, the members' own types decide.
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

function withDescription(schema: z.ZodType, value: JsonSchemaDocument) {
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

function stringSchema(value: JsonSchemaDocument, strict: boolean): z.ZodType {
	let schema = z.string();
	if (strict && typeof value.minLength === 'number') {
		schema = schema.min(value.minLength);
	}
	if (strict && typeof value.maxLength === 'number') {
		schema = schema.max(value.maxLength);
	}
	return schema;
}

function numberSchema(
	value: JsonSchemaDocument,
	integer: boolean,
	strict: boolean,
): z.ZodType {
	let schema = z.number();
	if (strict && integer) schema = schema.int();
	if (strict && typeof value.minimum === 'number') {
		schema = schema.min(value.minimum);
	}
	if (strict && typeof value.exclusiveMinimum === 'number') {
		schema = schema.gt(value.exclusiveMinimum);
	}
	if (strict && typeof value.maximum === 'number') {
		schema = schema.max(value.maximum);
	}
	if (strict && typeof value.exclusiveMaximum === 'number') {
		schema = schema.lt(value.exclusiveMaximum);
	}
	return schema;
}

// `unknown` is necessary because schema conversion starts with untrusted provider JSON.
function schemaFromJsonSchema(value: unknown, mode: SchemaMode): z.ZodType {
	const strict = mode === 'request';
	if (!isRecord(value) || Object.keys(value).length === 0) {
		// `unknown` is necessary because the tool schema leaves this JSON value untyped.
		return z.unknown();
	}

	if (Array.isArray(value.anyOf)) {
		// zod writes `X | null` as anyOf [X, { type: 'null' }].
		const members = value.anyOf.filter((member) => !isNullSchema(member));
		const nullable = members.length !== value.anyOf.length;
		const schema = unionOf(
			members.map((member) => schemaFromJsonSchema(member, mode)),
		);
		return withDescription(nullable ? schema.nullable() : schema, value);
	}

	const type = value.type;
	if (Array.isArray(type)) {
		// `type: ['string', 'null']` and `type: ['number', 'string']`.
		const kinds = type.filter(
			// `unknown` is necessary because a type list is parsed from provider JSON.
			(kind: unknown): kind is string => typeof kind === 'string',
		);
		const nullable = kinds.includes('null');
		const schema = unionOf(
			kinds
				.filter((kind) => kind !== 'null')
				.map((kind) =>
					schemaFromJsonSchema(
						{ ...value, type: kind, description: undefined },
						mode,
					),
				),
		);
		return withDescription(nullable ? schema.nullable() : schema, value);
	}

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
		schema = stringSchema(value, strict);
	} else if (type === 'integer' || type === 'number') {
		schema = numberSchema(value, type === 'integer', strict);
	} else if (type === 'boolean') {
		schema = z.boolean();
	} else if (type === 'null') {
		schema = z.null();
	} else if (type === 'array') {
		let arraySchema = z.array(schemaFromJsonSchema(value.items, mode));
		if (strict && typeof value.minItems === 'number') {
			arraySchema = arraySchema.min(value.minItems);
		}
		if (strict && typeof value.maxItems === 'number') {
			arraySchema = arraySchema.max(value.maxItems);
		}
		schema = arraySchema;
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
			const propertySchema = schemaFromJsonSchema(property, mode);
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
			isRecord(value.additionalProperties) &&
			Object.keys(value.additionalProperties).length > 0
		) {
			// A map: check the values, keep any key.
			schema = z.record(
				z.string(),
				schemaFromJsonSchema(value.additionalProperties, mode),
			);
		} else {
			// JSON Schema defaults additionalProperties to true; keep extra fields.
			schema = objectSchema.passthrough();
		}
	} else {
		// `unknown` is necessary because the tool schema leaves this JSON value untyped.
		schema = z.unknown();
	}
	return withDescription(schema, value);
}

// Built on first use, one operation at a time: converting all 85 tools at
// import would build every schema for an instance that may call two.
// `unknown` is necessary because each cached input schema has its own fields.
const inputSchemaCache = new Map<string, z.ZodType<Record<string, unknown>>>();
const outputSchemaCache = new Map<string, z.ZodType>();
const operationsById = new Map(
	openseoOperations.map((operation) => [operation.id, operation]),
);

export function openseoOperationFor(id: string): OpenseoOperationDefinition {
	const operation = operationsById.get(id);
	if (!operation) throw new Error('OpenSEO operation is unavailable');
	return operation;
}

// `unknown` is necessary because each tool's arguments have their own fields.
export function getOpenseoInputSchema(
	id: string,
): z.ZodType<Record<string, unknown>> {
	let schema = inputSchemaCache.get(id);
	if (!schema) {
		schema = schemaFromJsonSchema(
			openseoOperationFor(id).input,
			'request',
		) as z.ZodType<Record<string, unknown>>;
		inputSchemaCache.set(id, schema);
	}
	return schema;
}

export function getOpenseoOutputSchema(id: string): z.ZodType {
	let schema = outputSchemaCache.get(id);
	if (!schema) {
		// The top-level result stays non-null: a missing structured result is malformed.
		schema = schemaFromJsonSchema(openseoOperationFor(id).output, 'response');
		outputSchemaCache.set(id, schema);
	}
	return schema;
}

/** `input` and `output` are getters, so a schema is built only when something reads it. */
export function openseoSchemaEntry(id: string): {
	readonly input: z.ZodType;
	readonly output: z.ZodType;
} {
	return {
		get input() {
			return getOpenseoInputSchema(id);
		},
		get output() {
			return getOpenseoOutputSchema(id);
		},
	};
}

function lazyRecord(
	build: (id: string) => z.ZodType,
): Readonly<Record<string, z.ZodType>> {
	const record: Record<string, z.ZodType> = {};
	for (const { id } of openseoOperations) {
		Object.defineProperty(record, id, {
			enumerable: true,
			get: () => build(id),
		});
	}
	return record;
}

/** Every operation's schemas by id. Reading a key builds that schema (then cached). */
export const openseoInputSchemas = lazyRecord(getOpenseoInputSchema);
export const openseoOutputSchemas = lazyRecord(getOpenseoOutputSchema);

export type { OpenseoJsonSchema, OpenseoOperationDefinition };

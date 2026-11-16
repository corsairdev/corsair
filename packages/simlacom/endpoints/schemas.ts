import { z } from 'zod';
import { operationData } from '../operation-data';
import type { SimlaComEndpointInputs } from './operation-io-types';
import type {
	JsonSchema,
	JsonValue,
	SimlaComOperation,
} from './operation-types';

type SimlaComEndpointInput =
	SimlaComEndpointInputs[keyof SimlaComEndpointInputs];

const operations = operationData.operations;
const openApiSchemas = new Map<string, JsonSchema>(
	Object.entries(operationData.schemas),
);

function isJsonValue(value: unknown): value is JsonValue {
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'boolean'
	) {
		return true;
	}
	if (typeof value === 'number') return Number.isFinite(value);
	if (Array.isArray(value)) return value.every(isJsonValue);
	if (typeof value !== 'object') return false;
	return Object.values(value).every(isJsonValue);
}

const allowJsonValue = z.custom<JsonValue>(isJsonValue);

function referencedSchema(reference: string): JsonSchema {
	const name = reference.replace(/^#\/components\/schemas\//, '');
	const schema = openApiSchemas.get(name);
	if (!schema)
		throw new Error(`Unknown Simla.com OpenAPI schema reference: ${name}`);
	return schema;
}

function regexForPattern(pattern: string): RegExp {
	const datePatterns: Record<string, string> = {
		'Y-m-d': '^\\d{4}-\\d{2}-\\d{2}$',
		'Y-m-d H:i': '^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}$',
		'Y-m-d H:i:s': '^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$',
		'Y-m-d H:i:sP':
			'^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:\\d{2}$',
		'Y-m-d\\TH:i:sP':
			'^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[+-]\\d{2}:\\d{2}$',
		'm.d': '^\\d{2}\\.\\d{2}$',
		'H:i': '^(?:[01]\\d|2[0-3]):[0-5]\\d$',
	};
	const normalized = datePatterns[pattern] ?? pattern;
	return new RegExp(normalized.replace(/^\\A/, '^').replace(/\\z$/, '$'));
}

function mergeAllOfObjectSchemas(
	parts: readonly JsonSchema[],
): JsonSchema | undefined {
	const properties: Record<string, JsonSchema> = {};
	const required = new Set<string>();
	const referenced = new Set<string>();
	let objectPartCount = 0;
	let incompatiblePart = false;
	let allowsAdditionalProperties = false;
	let forbidsAdditionalProperties = false;
	let additionalPropertiesSchema: JsonSchema | undefined;

	const collect = (part: JsonSchema): void => {
		if (part.$ref) {
			const name = part.$ref.replace(/^#\/components\/schemas\//, '');
			if (referenced.has(name)) return;
			referenced.add(name);
			collect(referencedSchema(part.$ref));
			return;
		}
		if (part.allOf?.length) {
			for (const nested of part.allOf) collect(nested);
			return;
		}
		if (part.oneOf || part.anyOf) {
			incompatiblePart = true;
			return;
		}
		if (part.type !== 'object' && !part.properties && !part.required) {
			incompatiblePart = true;
			return;
		}

		objectPartCount += 1;
		for (const [name, property] of Object.entries(part.properties ?? {})) {
			const previous = properties[name];
			if (!previous) {
				properties[name] = property;
			} else if (JSON.stringify(previous) !== JSON.stringify(property)) {
				properties[name] = { allOf: [previous, property] };
			}
		}
		for (const name of part.required ?? []) required.add(name);
		if (part.additionalProperties === false) {
			forbidsAdditionalProperties = true;
		} else if (part.additionalProperties === true) {
			allowsAdditionalProperties = true;
		} else if (part.additionalProperties) {
			additionalPropertiesSchema = part.additionalProperties;
		}
	};

	for (const part of parts) collect(part);
	if (objectPartCount === 0 || incompatiblePart) return undefined;
	const merged: JsonSchema = {
		type: 'object',
		properties,
		...(required.size === 0 ? {} : { required: [...required] }),
	};
	if (forbidsAdditionalProperties) merged.additionalProperties = false;
	else if (additionalPropertiesSchema) {
		merged.additionalProperties = additionalPropertiesSchema;
	} else if (allowsAdditionalProperties) {
		merged.additionalProperties = true;
	}
	return merged;
}

// The provider publishes recursive and extensible objects; unknown here is narrowed by each generated OpenAPI schema.
function schemaToZod(schema: JsonSchema): z.ZodType<unknown> {
	if (schema.$ref) {
		return z.lazy(() => schemaToZod(referencedSchema(schema.$ref ?? '')));
	}

	const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
	// This dynamic output type is narrowed at runtime by the concrete OpenAPI-derived Zod schema.
	let result: z.ZodType<unknown>;

	if (schema.enum) {
		const enumValues = schema.enum;
		result = z.custom<unknown>(
			(value) =>
				enumValues.some(
					(entry) => JSON.stringify(entry) === JSON.stringify(value),
				),
			{ message: 'Value is not in the documented Simla.com enum.' },
		);
	} else if (schema.oneOf?.length || schema.anyOf?.length) {
		// The published spec carries a few empty `oneOf: []` lists next to a real
		// type; those fall through to the type below instead of accepting anything.
		const choices = schema.oneOf?.length ? schema.oneOf : (schema.anyOf ?? []);
		// Variant outputs differ by endpoint; each branch is runtime-validated before use.
		result = choices.reduce<z.ZodType<unknown>>(
			(combined, choice) => z.union([combined, schemaToZod(choice)]),
			schemaToZod(choices[0] ?? {}),
		);
	} else if (schema.allOf && schema.allOf.length > 0) {
		const merged = mergeAllOfObjectSchemas(schema.allOf);
		if (merged) {
			result = schemaToZod(merged);
		} else {
			// Non-object intersections retain both OpenAPI validators at runtime.
			result = schema.allOf
				.slice(1)
				.reduce<z.ZodType<unknown>>(
					(combined, part) => z.intersection(combined, schemaToZod(part)),
					schemaToZod(schema.allOf?.[0] ?? {}),
				);
		}
	} else if (type === 'string') {
		let stringSchema = z.string();
		if (schema.minLength !== undefined)
			stringSchema = stringSchema.min(schema.minLength);
		if (schema.maxLength !== undefined)
			stringSchema = stringSchema.max(schema.maxLength);
		if (schema.pattern)
			stringSchema = stringSchema.regex(regexForPattern(schema.pattern));
		result = stringSchema;
	} else if (type === 'integer' || type === 'number') {
		let numberSchema = z.number();
		if (type === 'integer') numberSchema = numberSchema.int();
		if (schema.minimum !== undefined)
			numberSchema = numberSchema.min(schema.minimum);
		if (schema.maximum !== undefined)
			numberSchema = numberSchema.max(schema.maximum);
		result = numberSchema;
	} else if (type === 'boolean') {
		result = z.boolean();
	} else if (type === 'array') {
		let arraySchema = z.array(
			schema.items ? schemaToZod(schema.items) : allowJsonValue,
		);
		if (schema.minItems !== undefined)
			arraySchema = arraySchema.min(schema.minItems);
		if (schema.maxItems !== undefined)
			arraySchema = arraySchema.max(schema.maxItems);
		result = arraySchema;
	} else if (type === 'null') {
		result = z.null();
	} else if (type === 'object' || schema.properties) {
		// Field types vary across provider models; each field is recursively validated before output.
		const fields: Record<string, z.ZodType<unknown>> = {};
		for (const [name, property] of Object.entries(schema.properties ?? {})) {
			const field = schemaToZod(property);
			fields[name] = schema.required?.includes(name) ? field : field.optional();
		}
		for (const requiredName of schema.required ?? []) {
			if (!(requiredName in (schema.properties ?? {}))) {
				// Simla.com's OpenAPI marks this field required but publishes no type or constraints for it.
				fields[requiredName] = allowJsonValue;
			}
		}
		const objectSchema = z.object(fields);
		if (
			schema.additionalProperties &&
			typeof schema.additionalProperties === 'object'
		) {
			result = objectSchema.catchall(schemaToZod(schema.additionalProperties));
		} else if (schema.additionalProperties === true) {
			result = objectSchema.catchall(allowJsonValue);
		} else {
			result = objectSchema.strict();
		}
	} else {
		result = allowJsonValue;
	}

	if (schema.nullable) result = result.nullable();
	if (schema.description) result = result.describe(schema.description);
	return result;
}

function objectSchema(
	fields: Record<string, z.ZodType<unknown>>,
): z.ZodObject<Record<string, z.ZodType<unknown>>> {
	return z.object(fields).strict();
}

export function createOperationInputSchema(
	operation: SimlaComOperation,
): z.ZodType<SimlaComEndpointInput> {
	const pathFields: Record<string, z.ZodType<unknown>> = {};
	const queryFields: Record<string, z.ZodType<unknown>> = {};
	const requiredQuery: string[] = [];
	for (const parameter of operation.parameters) {
		const field = schemaToZod(parameter.schema);
		if (parameter.in === 'path') {
			const type = Array.isArray(parameter.schema.type)
				? parameter.schema.type[0]
				: parameter.schema.type;
			// Some numeric record ids are documented as digit strings; accept the
			// number a create call returned as well.
			pathFields[parameter.name] =
				type === 'string'
					? z.preprocess(
							(value) =>
								typeof value === 'number' && Number.isSafeInteger(value)
									? String(value)
									: value,
							field,
						)
					: field;
		} else {
			queryFields[parameter.name] = field;
			if (parameter.required && parameter.default === undefined) {
				requiredQuery.push(parameter.name);
			}
		}
	}
	for (const name of Object.keys(queryFields)) {
		if (!requiredQuery.includes(name))
			queryFields[name] = queryFields[name]?.optional() ?? allowJsonValue;
	}

	const pathSchema = objectSchema(pathFields);
	const querySchema = objectSchema(queryFields);
	const pathField =
		Object.keys(pathFields).length > 0 ? pathSchema : pathSchema.optional();
	const queryField =
		requiredQuery.length > 0 ? querySchema : querySchema.optional();
	const bodyField = operation.request?.schema
		? schemaToZod(operation.request.schema)
		: z.never();
	const bodySchema = operation.request?.required
		? bodyField
		: bodyField.optional();

	return z
		.object({ path: pathField, query: queryField, body: bodySchema })
		.strict();
}

// The full output type varies by operation; this runtime schema comes from that operation's OpenAPI response model.
export function createOperationOutputSchema(
	operation: SimlaComOperation,
): z.ZodType<unknown> {
	if (operation.response.kind === 'binary') {
		return z
			.object({
				kind: z.literal('binary'),
				contentType: z.string(),
				base64: z.string(),
			})
			.strict();
	}
	const schema = operation.response.schema
		? Object.keys(operation.response.schema).length === 0
			? z.record(z.string(), allowJsonValue)
			: schemaToZod(operation.response.schema)
		: z.record(z.string(), allowJsonValue);
	return schema;
}

export const SIMLACOM_INPUT_SCHEMAS = new Map(
	operations.map((operation) => [
		operation.id,
		createOperationInputSchema(operation),
	]),
);

// Live Simla.com responses drift from the published response models: ids and
// amounts arrive as strings, dates miss the documented pattern, enums gain
// values, optional fields come back null and PHP sends an empty object as `[]`.
// Runtime parsing therefore checks only the structure (objects stay objects,
// lists stay lists) and lets every documented scalar through. The strict models
// above still describe the outputs in the docs and the generated types.
const lenientCache = new Map<string, z.ZodType<unknown>>();
// The provider value is untrusted JSON; each branch below narrows its structure.
const anyJson: z.ZodType<unknown> = allowJsonValue;

function lenientSchemaToZod(schema: JsonSchema): z.ZodType<unknown> {
	if (schema.$ref) {
		const ref = schema.$ref;
		const cached = lenientCache.get(ref);
		if (cached) return cached;
		const lazy = z.lazy(() => lenientSchemaToZod(referencedSchema(ref)));
		lenientCache.set(ref, lazy);
		return lazy;
	}
	if (schema.allOf?.length) {
		const merged = mergeAllOfObjectSchemas(schema.allOf);
		return merged ? lenientSchemaToZod(merged) : anyJson;
	}
	if (schema.enum || schema.oneOf?.length || schema.anyOf?.length) {
		return anyJson;
	}
	const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
	if (type === 'array') {
		const item = schema.items ? lenientSchemaToZod(schema.items) : anyJson;
		// PHP encodes a list with non-sequential keys as an object.
		return z.union([z.array(item), z.record(z.string(), item)]).nullable();
	}
	if (type === 'object' || schema.properties) {
		const fields: Record<string, z.ZodType<unknown>> = {};
		for (const [name, property] of Object.entries(schema.properties ?? {})) {
			fields[name] = lenientSchemaToZod(property).nullable().optional();
		}
		const objectSchema = z.object(fields).catchall(anyJson);
		// PHP encodes a map with sequential keys (or an empty one) as a list:
		// user groups send `breakdownSites: ["main"]` where the model has an object.
		return z.union([objectSchema, z.array(anyJson)]).nullable();
	}
	return anyJson;
}

export function createLenientOperationOutputSchema(
	operation: SimlaComOperation,
): z.ZodType<unknown> {
	if (operation.response.kind === 'binary') {
		return createOperationOutputSchema(operation);
	}
	const schema = operation.response.schema;
	if (!schema || Object.keys(schema).length === 0) {
		return z.record(z.string(), anyJson);
	}
	// Every documented response is a JSON object with a `success` flag.
	return z.intersection(
		z.record(z.string(), anyJson),
		lenientSchemaToZod(schema),
	);
}

export const SIMLACOM_OUTPUT_SCHEMAS = new Map(
	operations.map((operation) => [
		operation.id,
		createLenientOperationOutputSchema(operation),
	]),
);

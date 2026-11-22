import { z } from 'zod';
import { openApiSchemas, zohoBooksOperations } from '../openapi';
import type {
	JsonValue,
	ZohoBooksBinaryOutput,
	ZohoBooksOperationDefinition,
	ZohoBooksOperationInput,
	ZohoBooksOperationOutput,
} from './openapi-types';
import type {
	ZohoBooksOperationFor,
	ZohoBooksOperationId,
	ZohoBooksOperationInputFor,
	ZohoBooksOperationOutputFor,
} from './operation-types';

type JsonObject = { [key: string]: JsonValue };

const MAX_SCHEMA_DEPTH = 64;

// `unknown` because caller input and provider responses are untrusted until checked.
export function isJsonValue(value: unknown, depth = 0): value is JsonValue {
	if (depth > MAX_SCHEMA_DEPTH) return false;
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'boolean' ||
		typeof value === 'number'
	) {
		return typeof value !== 'number' || Number.isFinite(value);
	}
	if (Array.isArray(value)) {
		return value.every((item) => isJsonValue(item, depth + 1));
	}
	if (typeof value !== 'object') return false;
	return Object.values(value).every((item) => isJsonValue(item, depth + 1));
}

function isJsonObject(value: JsonValue | undefined): value is JsonObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getString(value: JsonValue | undefined): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

function getNumber(value: JsonValue | undefined): number | undefined {
	return typeof value === 'number' ? value : undefined;
}

function getArray(value: JsonValue | undefined): JsonValue[] | undefined {
	return Array.isArray(value) ? value : undefined;
}

function getObject(value: JsonValue | undefined): JsonObject | undefined {
	return isJsonObject(value) ? value : undefined;
}

function resolveSchema(
	operation: ZohoBooksOperationDefinition,
	schema: JsonValue,
): JsonValue | undefined {
	if (!isJsonObject(schema)) return schema;
	const reference = getString(schema.$ref);
	if (!reference) return schema;
	const match = reference.match(/^#\/components\/schemas\/([^/]+)$/);
	const name = match?.[1];
	if (!name) return undefined;
	return openApiSchemas[operation.group]?.[name];
}

function equalJson(left: JsonValue, right: JsonValue): boolean {
	return JSON.stringify(left) === JSON.stringify(right);
}

function validateSchema(
	operation: ZohoBooksOperationDefinition,
	schemaInput: JsonValue,
	value: JsonValue,
	strictRequestObjects: boolean,
	depth = 0,
): boolean {
	if (depth > MAX_SCHEMA_DEPTH) return false;
	if (typeof schemaInput === 'boolean') return schemaInput;
	const schema = resolveSchema(operation, schemaInput);
	if (schema === undefined) return false;
	if (typeof schema === 'boolean') return schema;
	const record = getObject(schema);
	if (!record) return true;
	if (record.nullable === true && value === null) return true;
	if (record.format === 'binary')
		return typeof value === 'string' || isBinaryFile(value);

	const constant = record.const;
	if (
		constant !== undefined &&
		isJsonValue(constant) &&
		!equalJson(value, constant)
	)
		return false;
	const enumValues = getArray(record.enum);
	if (enumValues && !enumValues.some((option) => equalJson(value, option)))
		return false;

	const allOf = getArray(record.allOf);
	if (
		allOf &&
		!allOf.every((part) =>
			validateSchema(operation, part, value, strictRequestObjects, depth + 1),
		)
	)
		return false;
	const anyOf = getArray(record.anyOf);
	if (
		anyOf &&
		!anyOf.some((part) =>
			validateSchema(operation, part, value, strictRequestObjects, depth + 1),
		)
	)
		return false;
	const oneOf = getArray(record.oneOf);
	if (
		oneOf &&
		oneOf.filter((part) =>
			validateSchema(operation, part, value, strictRequestObjects, depth + 1),
		).length !== 1
	)
		return false;
	if (
		isJsonValue(record.not) &&
		validateSchema(
			operation,
			record.not,
			value,
			strictRequestObjects,
			depth + 1,
		)
	)
		return false;

	const declaredType = record.type;
	const acceptedTypes = Array.isArray(declaredType)
		? declaredType.filter((entry): entry is string => typeof entry === 'string')
		: typeof declaredType === 'string'
			? [declaredType]
			: [];
	if (acceptedTypes.length > 0) {
		const matches = acceptedTypes.some((type) => {
			if (type === 'null') return value === null;
			if (type === 'object') return isJsonObject(value);
			if (type === 'array') return Array.isArray(value);
			if (type === 'string') return typeof value === 'string';
			if (type === 'boolean') return typeof value === 'boolean';
			if (type === 'integer')
				return typeof value === 'number' && Number.isInteger(value);
			if (type === 'number') return typeof value === 'number';
			return true;
		});
		if (!matches) return false;
	}

	if (typeof value === 'string') {
		const minLength = getNumber(record.minLength);
		const maxLength = getNumber(record.maxLength);
		if (minLength !== undefined && value.length < minLength) return false;
		if (maxLength !== undefined && value.length > maxLength) return false;
		const pattern = getString(record.pattern);
		if (pattern) {
			try {
				if (!new RegExp(pattern).test(value)) return false;
			} catch {
				return false;
			}
		}
		const format = getString(record.format);
		if (format === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
		if (format === 'date-time' && !Number.isFinite(Date.parse(value)))
			return false;
	}

	if (typeof value === 'number') {
		const minimum = getNumber(record.minimum);
		const maximum = getNumber(record.maximum);
		const exclusiveMinimum = getNumber(record.exclusiveMinimum);
		const exclusiveMaximum = getNumber(record.exclusiveMaximum);
		if (minimum !== undefined && value < minimum) return false;
		if (maximum !== undefined && value > maximum) return false;
		if (exclusiveMinimum !== undefined && value <= exclusiveMinimum)
			return false;
		if (exclusiveMaximum !== undefined && value >= exclusiveMaximum)
			return false;
		const multipleOf = getNumber(record.multipleOf);
		if (
			multipleOf &&
			Math.abs(value / multipleOf - Math.round(value / multipleOf)) > 1e-10
		)
			return false;
	}

	if (Array.isArray(value)) {
		const minItems = getNumber(record.minItems);
		const maxItems = getNumber(record.maxItems);
		if (minItems !== undefined && value.length < minItems) return false;
		if (maxItems !== undefined && value.length > maxItems) return false;
		const itemSchema = record.items;
		if (
			isJsonValue(itemSchema) &&
			!value.every((item) =>
				validateSchema(
					operation,
					itemSchema,
					item,
					strictRequestObjects,
					depth + 1,
				),
			)
		)
			return false;
		if (record.uniqueItems === true) {
			const encoded = value.map((item) => JSON.stringify(item));
			if (new Set(encoded).size !== encoded.length) return false;
		}
	}

	if (isJsonObject(value)) {
		const properties = getObject(record.properties);
		const required = getArray(record.required)?.filter(
			(entry): entry is string => typeof entry === 'string',
		);
		if (required?.some((key) => value[key] === undefined)) return false;
		if (properties) {
			for (const [key, propertySchema] of Object.entries(properties)) {
				const propertyValue = value[key];
				if (
					propertyValue !== undefined &&
					!validateSchema(
						operation,
						propertySchema,
						propertyValue,
						strictRequestObjects,
						depth + 1,
					)
				)
					return false;
			}
		}
		const additionalProperties = record.additionalProperties;
		const patternProperties = getObject(record.patternProperties);
		for (const [key, propertyValue] of Object.entries(value)) {
			if (properties?.[key] !== undefined || required?.includes(key)) continue;
			const matchingPatterns = Object.entries(patternProperties ?? {}).filter(
				([pattern]) => {
					try {
						return new RegExp(pattern).test(key);
					} catch {
						return false;
					}
				},
			);
			if (matchingPatterns.length > 0) {
				if (
					matchingPatterns.some(
						([, patternSchema]) =>
							!validateSchema(
								operation,
								patternSchema,
								propertyValue,
								strictRequestObjects,
								depth + 1,
							),
					)
				)
					return false;
				continue;
			}
			if (additionalProperties === false) return false;
			if (isJsonValue(additionalProperties)) {
				if (
					!validateSchema(
						operation,
						additionalProperties,
						propertyValue,
						strictRequestObjects,
						depth + 1,
					)
				)
					return false;
			} else if (strictRequestObjects && properties) {
				return false;
			}
		}
		const minProperties = getNumber(record.minProperties);
		const maxProperties = getNumber(record.maxProperties);
		if (
			minProperties !== undefined &&
			Object.keys(value).length < minProperties
		)
			return false;
		if (
			maxProperties !== undefined &&
			Object.keys(value).length > maxProperties
		)
			return false;
	}
	return true;
}

function isBinaryFile(value: JsonValue): boolean {
	if (!isJsonObject(value)) return false;
	const base64 = value.base64;
	return (
		Object.keys(value).every((key) =>
			['filename', 'contentType', 'base64'].includes(key),
		) &&
		typeof value.filename === 'string' &&
		value.filename.length > 0 &&
		typeof value.contentType === 'string' &&
		value.contentType.length > 0 &&
		typeof base64 === 'string' &&
		base64.length > 0 &&
		/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
			base64,
		)
	);
}

function validateRequestSchema(
	operation: ZohoBooksOperationDefinition,
	schema: JsonValue,
	value: JsonValue,
): boolean {
	if (isJsonObject(schema) && schema.format === 'binary') {
		return isBinaryFile(value) || typeof value === 'string';
	}
	if (
		isJsonObject(schema) &&
		isJsonObject(schema.properties) &&
		isJsonObject(value)
	) {
		for (const [key, propertySchema] of Object.entries(schema.properties)) {
			if (
				isJsonObject(propertySchema) &&
				propertySchema.format === 'binary' &&
				value[key] !== undefined &&
				!isBinaryFile(value[key]) &&
				typeof value[key] !== 'string'
			)
				return false;
		}
	}
	return validateSchema(operation, schema, value, true);
}

function validateOperationInput(
	operation: ZohoBooksOperationDefinition,
	input: ZohoBooksOperationInput,
): boolean {
	const groups = {
		path: input.pathParams ?? {},
		query: input.query ?? {},
		header: input.headers ?? {},
	};
	for (const [location, values] of Object.entries(groups)) {
		const parameters = operation.parameters.filter(
			(parameter) => parameter.in === location,
		);
		const allowed = new Set(parameters.map((parameter) => parameter.name));
		if (Object.keys(values).some((key) => !allowed.has(key))) return false;
		for (const parameter of parameters) {
			const value = values[parameter.name];
			if (parameter.required && value === undefined) return false;
			if (
				value !== undefined &&
				parameter.schema &&
				!validateRequestSchema(operation, parameter.schema, value)
			)
				return false;
		}
	}
	if (!operation.request) return input.body === undefined;
	if (operation.request.required && input.body === undefined) return false;
	if (input.body === undefined || !operation.request.schema) return true;
	return validateRequestSchema(operation, operation.request.schema, input.body);
}

function validateOperationOutput(
	operation: ZohoBooksOperationDefinition,
	value: ZohoBooksOperationOutput,
): boolean {
	if (isJsonObject(value) && value.kind === 'binary') {
		const contentType = getString(value.contentType);
		const base64 = getString(value.base64);
		const byteLength = getNumber(value.byteLength);
		const mediaType = contentType?.split(';', 1)[0]?.trim().toLowerCase();
		return (
			contentType !== undefined &&
			base64 !== undefined &&
			byteLength !== undefined &&
			operation.responses.some(
				(response) =>
					response.contentType === '*/*' ||
					response.contentType.toLowerCase() === mediaType,
			)
		);
	}
	if (!isJsonValue(value)) return false;
	const jsonResponses = operation.responses.filter((response) =>
		response.contentType.includes('json'),
	);
	if (jsonResponses.length === 0) {
		return operation.responses.some(
			(response) => response.contentType === 'application/x-empty',
		);
	}
	// Any JSON body is accepted: Zoho's published response schemas disagree with
	// the live API (11-22: list `page_context` is documented as an array but is an
	// object, `creditnotes` as an object but is an array, chart-of-accounts `depth`
	// as a string but is a number), so checking them failed every invoice,
	// estimate, expense and project list.
	return true;
}

// Input schemas name each path, query and header parameter and the request
// body's fields, so `inspect` and the docs show agents what to send. The
// operation's full OpenAPI check still runs as a refinement.
const MAX_DISPLAY_DEPTH = 3;
const MAX_DESCRIPTION_LENGTH = 300;

// `unknown` is narrowed by `isJsonValue`; any JSON value is a valid untyped field.
const jsonValueSchema = z.custom<JsonValue>(isJsonValue, {
	message: 'Value must be JSON-compatible.',
});

const binaryFileSchema = z
	.object({
		filename: z.string().min(1),
		contentType: z.string().min(1),
		base64: z.string().min(1),
	})
	.strict();

function cleanDescription(text: JsonValue | undefined): string | undefined {
	if (typeof text !== 'string') return undefined;
	const plain = text
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	if (!plain) return undefined;
	return plain.length > MAX_DESCRIPTION_LENGTH
		? `${plain.slice(0, MAX_DESCRIPTION_LENGTH - 1)}…`
		: plain;
}

function describe<T extends z.ZodType>(
	schema: T,
	description: string | undefined,
): T {
	return description ? schema.describe(description) : schema;
}

function displaySchema(
	operation: ZohoBooksOperationDefinition,
	schemaInput: JsonValue | undefined,
	depth: number,
): z.ZodType {
	if (schemaInput === undefined || depth > MAX_DISPLAY_DEPTH)
		return jsonValueSchema;
	const schema = resolveSchema(operation, schemaInput);
	const record = getObject(schema);
	if (!record) return jsonValueSchema;
	const description = cleanDescription(record.description);
	let result: z.ZodType;
	const enumValues = getArray(record.enum);
	if (record.format === 'binary') {
		result = z.union([binaryFileSchema, z.string()]);
	} else if (
		enumValues &&
		enumValues.length > 0 &&
		enumValues.every((value) => typeof value === 'string')
	) {
		const [first, ...rest] = enumValues.filter(
			(value): value is string => typeof value === 'string',
		);
		result = z.enum([first ?? '', ...rest]);
	} else if (record.type === 'string') {
		result = z.string();
	} else if (record.type === 'integer') {
		result = z.number().int();
	} else if (record.type === 'number') {
		result = z.number();
	} else if (record.type === 'boolean') {
		result = z.boolean();
	} else if (record.type === 'array') {
		const items = record.items;
		result = z.array(
			isJsonValue(items)
				? displaySchema(operation, items, depth + 1)
				: jsonValueSchema,
		);
	} else if (getObject(record.properties)) {
		result = objectDisplaySchema(operation, record, depth);
	} else if (record.type === 'object') {
		result = z.record(z.string(), jsonValueSchema);
	} else {
		result = jsonValueSchema;
	}
	if (record.nullable === true) result = result.nullable();
	return describe(result, description);
}

function objectDisplaySchema(
	operation: ZohoBooksOperationDefinition,
	record: JsonObject,
	depth: number,
): z.ZodType {
	const properties = getObject(record.properties) ?? {};
	const required = new Set(
		(getArray(record.required) ?? []).filter(
			(entry): entry is string => typeof entry === 'string',
		),
	);
	const shape: Record<string, z.ZodType> = {};
	for (const [key, propertySchema] of Object.entries(properties)) {
		const field = displaySchema(operation, propertySchema, depth + 1);
		shape[key] = required.has(key) ? field : field.optional();
	}
	// Loose: the OpenAPI refinement decides which extra keys (such as cf_ fields) are allowed.
	return z.object(shape).loose();
}

function parameterGroupSchema(
	operation: ZohoBooksOperationDefinition,
	location: ZohoBooksOperationDefinition['parameters'][number]['in'],
): { schema: z.ZodType; required: boolean } {
	const parameters = operation.parameters.filter(
		(parameter) => parameter.in === location,
	);
	const shape: Record<string, z.ZodType> = {};
	for (const parameter of parameters) {
		const field = describe(
			displaySchema(operation, parameter.schema, 1),
			cleanDescription(parameter.description),
		);
		shape[parameter.name] = parameter.required ? field : field.optional();
	}
	return {
		schema: z.object(shape).strict(),
		required: parameters.some((parameter) => parameter.required),
	};
}

function createInputSchema(
	operation: ZohoBooksOperationDefinition,
): z.ZodType<ZohoBooksOperationInput> {
	const shape: Record<string, z.ZodType> = {};
	for (const [key, location] of [
		['pathParams', 'path'],
		['query', 'query'],
		['headers', 'header'],
	] as const) {
		const group = parameterGroupSchema(operation, location);
		shape[key] = group.required ? group.schema : group.schema.optional();
	}
	if (operation.request) {
		const body = operation.request.schema
			? displaySchema(operation, operation.request.schema, 0)
			: jsonValueSchema;
		shape.body = operation.request.required ? body : body.optional();
	}
	return z
		.object(shape)
		.strict()
		.superRefine((input, context) => {
			if (
				!isJsonValue(input) ||
				!isJsonObject(input) ||
				!validateOperationInput(operation, input)
			) {
				context.addIssue({
					code: 'custom',
					message: `Input does not match the documented ${operation.method} ${operation.path} contract.`,
				});
			}
		}) as z.ZodType<ZohoBooksOperationInput>;
}

function createOutputSchema(
	operation: ZohoBooksOperationDefinition,
): z.ZodType<ZohoBooksOperationOutput> {
	return z.custom<ZohoBooksOperationOutput>(
		// `unknown` because Zod checks provider response data before returning it.
		(value): value is ZohoBooksOperationOutput =>
			isJsonValue(value) && validateOperationOutput(operation, value),
		{
			message: `Response does not match the documented ${operation.method} ${operation.path} contract.`,
		},
	);
}

// Built on first use, one operation at a time: building all 884 at import
// held ~9 MB of heap for an instance that may call two operations.
const operationsById = new Map(
	zohoBooksOperations.map((operation) => [operation.id, operation]),
);
const inputSchemaCache = new Map<string, z.ZodType<ZohoBooksOperationInput>>();
const outputSchemaCache = new Map<
	string,
	z.ZodType<ZohoBooksOperationOutput>
>();

function operationFor(id: string): ZohoBooksOperationDefinition {
	const operation = operationsById.get(id);
	if (!operation) throw new Error(`Unknown Zoho Books operation: ${id}`);
	return operation;
}

export function getZohoBooksInputSchema(
	id: string,
): z.ZodType<ZohoBooksOperationInput> {
	let schema = inputSchemaCache.get(id);
	if (!schema) {
		schema = createInputSchema(operationFor(id));
		inputSchemaCache.set(id, schema);
	}
	return schema;
}

export function getZohoBooksOutputSchema(
	id: string,
): z.ZodType<ZohoBooksOperationOutput> {
	let schema = outputSchemaCache.get(id);
	if (!schema) {
		schema = createOutputSchema(operationFor(id));
		outputSchemaCache.set(id, schema);
	}
	return schema;
}

/** `input` and `output` are getters, so a schema is built only when something reads it. */
export function zohoBooksSchemaEntry(id: string): {
	readonly input: z.ZodType<ZohoBooksOperationInput>;
	readonly output: z.ZodType<ZohoBooksOperationOutput>;
} {
	return {
		get input() {
			return getZohoBooksInputSchema(id);
		},
		get output() {
			return getZohoBooksOutputSchema(id);
		},
	};
}

function lazyRecord<T>(build: (id: string) => T): Readonly<Record<string, T>> {
	const record: Record<string, T> = {};
	for (const { id } of zohoBooksOperations) {
		Object.defineProperty(record, id, {
			enumerable: true,
			get: () => build(id),
		});
	}
	return record;
}

/** Every operation's schemas by id. Reading a key builds that schema (then cached). */
export const ZohoBooksEndpointInputSchemas: Readonly<
	Record<string, z.ZodType<ZohoBooksOperationInput>>
> = lazyRecord(getZohoBooksInputSchema);
export const ZohoBooksEndpointOutputSchemas: Readonly<
	Record<string, z.ZodType<ZohoBooksOperationOutput>>
> = lazyRecord(getZohoBooksOutputSchema);

export function parseZohoBooksInput(
	operation: ZohoBooksOperationDefinition,
	input: ZohoBooksOperationInput,
): ZohoBooksOperationInput {
	const schema = ZohoBooksEndpointInputSchemas[operation.id];
	if (!schema) throw new Error(`Missing input schema for ${operation.id}`);
	return schema.parse(input);
}

export function parseZohoBooksTypedInput<Id extends ZohoBooksOperationId>(
	operation: ZohoBooksOperationFor<Id>,
	input: ZohoBooksOperationInputFor<Id>,
): ZohoBooksOperationInputFor<Id> {
	const schema = ZohoBooksEndpointInputSchemas[operation.id];
	if (!schema) throw new Error(`Missing input schema for ${operation.id}`);
	schema.parse(input);
	return input;
}

export function parseZohoBooksOutput(
	operation: ZohoBooksOperationDefinition,
	output: ZohoBooksOperationOutput,
): ZohoBooksOperationOutput {
	const schema = ZohoBooksEndpointOutputSchemas[operation.id];
	if (!schema) throw new Error(`Missing output schema for ${operation.id}`);
	return schema.parse(output);
}

export function parseZohoBooksTypedOutput<Id extends ZohoBooksOperationId>(
	operation: ZohoBooksOperationFor<Id>,
	output: ZohoBooksOperationOutput,
): ZohoBooksOperationOutputFor<Id> {
	const schema = z.custom<ZohoBooksOperationOutputFor<Id>>(
		// `unknown` is narrowed by the provider operation's response contract.
		(value): value is ZohoBooksOperationOutputFor<Id> =>
			isJsonValue(value) && validateOperationOutput(operation, value),
		{
			message: `Response does not match the documented ${operation.method} ${operation.path} contract.`,
		},
	);
	return schema.parse(output);
}

export function isZohoBooksBinaryOutput(
	value: ZohoBooksOperationOutput,
): value is ZohoBooksBinaryOutput {
	return isJsonObject(value) && value.kind === 'binary';
}

export function isZohoBooksJsonObject(value: JsonValue): value is JsonObject {
	return isJsonObject(value);
}

import { z } from 'zod';
import type {
	TeamworkOpenApiSchema,
	TeamworkOperationDefinition,
} from './manifest';
import { teamworkDefinitions, teamworkOperations } from './manifest';

// `unknown` is necessary because raw OpenAPI documents contain arbitrary provider schema keywords.
type OpenApiDocument = Record<string, unknown>;

// `unknown` is necessary because OpenAPI JSON values are untrusted until narrowed by this guard.
function isRecord(value: unknown): value is OpenApiDocument {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * `request` keeps the published contract strict. `response` and `v1Response`
 * parse what Teamwork really sends: the live run on 11-16 got null for most
 * unset V3 fields the spec types as string, number, object or array, and V1
 * booleans where the spec says string. So in a response every field is
 * optional and nullable, enums are open and min/max limits are dropped;
 * `v1Response` also accepts any JSON scalar where the spec names one.
 * `v1Request` and `v3Request` (request bodies) check the documented fields but
 * let other keys through: both specs leave out fields Teamwork's reference
 * documents and the API takes (a V1 milestone's `title`, a task list's `name`,
 * a V3 time entry's `description`), so a strict body could not send them.
 * `v3Request` also ignores the spec's generated `required` lists, which name
 * fields the API does not need (a V3 time entry without `taskId`, `tags` or
 * `timelogOptions` is accepted live); only `x-corsair-required`, set by the
 * task overlay below, is enforced.
 */
type SchemaMode =
	| 'request'
	| 'v1Request'
	| 'v3Request'
	| 'response'
	| 'v1Response';

// A JSON scalar of any type, for V1 response fields whose published type doesn't match the wire.
const looseScalar = z.union([z.string(), z.number(), z.boolean()]);

// `unknown` is necessary because schema conversion starts with untrusted provider JSON.
function schemaFromOpenApi(
	value: unknown,
	definitions: Record<string, TeamworkOpenApiSchema>,
	mode: SchemaMode,
	cache: Map<string, z.ZodType>,
): z.ZodType {
	const strictRequests =
		mode === 'request' || mode === 'v1Request' || mode === 'v3Request';
	const openBody = mode === 'v1Request' || mode === 'v3Request';
	const looseScalars = mode === 'v1Response';
	if (!isRecord(value)) {
		// `unknown` is necessary because the provider omitted a schema for this JSON value.
		return z.unknown();
	}

	const reference = value.$ref;
	if (typeof reference === 'string') {
		const name = reference.replace(/^#\/definitions\//, '');
		const cacheKey = `${mode}:${name}`;
		const existing = cache.get(cacheKey);
		if (existing) return existing;
		const lazySchema = z.lazy(() =>
			schemaFromOpenApi(definitions[name], definitions, mode, cache),
		);
		cache.set(cacheKey, lazySchema);
		return lazySchema;
	}

	const nullable =
		!strictRequests || value.nullable === true || value['x-nullable'] === true;
	const type = value.type;
	let schema: z.ZodType;

	if (
		!strictRequests &&
		(Array.isArray(value.enum) ||
			(looseScalars &&
				(type === 'string' ||
					type === 'integer' ||
					type === 'number' ||
					type === 'boolean')))
	) {
		// Open enums and loose V1 scalars: a value Teamwork adds later must not fail a read.
		// V3 enums stay open but keep their declared type, which the public output types promise.
		schema =
			looseScalars || !Array.isArray(value.enum)
				? looseScalar
				: type === 'string'
					? z.string()
					: type === 'integer' || type === 'number'
						? z.number()
						: type === 'boolean'
							? z.boolean()
							: looseScalar;
	} else if (Array.isArray(value.enum)) {
		// zod enums and literals rather than a custom check, so get_schema and the docs show the allowed values.
		// The V3 spec lists some integer enums as strings (projectHealths: "0".."3"); take the numbers too.
		const numeric = type === 'integer' || type === 'number';
		const values: unknown[] = [
			...value.enum,
			...(numeric
				? value.enum
						.filter(
							(allowed: unknown): allowed is string =>
								typeof allowed === 'string' && /^-?\d+(\.\d+)?$/.test(allowed),
						)
						.map(Number)
				: []),
		];
		const strings = values.filter(
			(allowed): allowed is string => typeof allowed === 'string',
		);
		if (strings.length > 0 && strings.length === values.length) {
			schema = z.enum(strings as [string, ...string[]]);
		} else {
			const literals = values
				.filter(
					(allowed): allowed is number | boolean | null =>
						allowed === null ||
						typeof allowed === 'number' ||
						typeof allowed === 'boolean',
				)
				.map((allowed) => z.literal(allowed));
			const stringLiterals =
				strings.length > 0 ? [z.enum(strings as [string, ...string[]])] : [];
			const [first, ...rest] = [...stringLiterals, ...literals];
			schema = first
				? rest.length > 0
					? z.union([first, ...rest])
					: first
				: z.never();
		}
	} else if (Array.isArray(value.allOf)) {
		// `unknown` is necessary because allOf members are arbitrary OpenAPI schema objects.
		const members = value.allOf.map((member: unknown) =>
			schemaFromOpenApi(member, definitions, mode, cache),
		);
		// `unknown` is necessary because candidates are provider response/request JSON values.
		schema = z.custom<unknown>((candidate: unknown) =>
			members.every((member) => member.safeParse(candidate).success),
		);
	} else if (Array.isArray(value.oneOf) || Array.isArray(value.anyOf)) {
		// `unknown` is necessary because OpenAPI oneOf/anyOf members are provider JSON Schema values.
		const choicesInput: unknown[] = Array.isArray(value.oneOf)
			? value.oneOf
			: Array.isArray(value.anyOf)
				? value.anyOf
				: [];
		const choices: z.ZodType[] = choicesInput.map((choice: unknown) =>
			schemaFromOpenApi(choice, definitions, mode, cache),
		);
		// A zod union passes when any member does, the same as anyOf, and get_schema can render it.
		const [first, ...rest] = choices;
		schema = first
			? rest.length > 0
				? z.union([first, ...rest])
				: first
			: z.never();
	} else if (type === 'string') {
		let stringSchema = z.string();
		if (strictRequests && typeof value.minLength === 'number') {
			stringSchema = stringSchema.min(value.minLength);
		}
		if (strictRequests && typeof value.maxLength === 'number') {
			stringSchema = stringSchema.max(value.maxLength);
		}
		schema = stringSchema;
	} else if (type === 'integer' || type === 'number') {
		let numberSchema = z.number();
		if (strictRequests && type === 'integer') {
			numberSchema = numberSchema.int();
		}
		if (strictRequests && typeof value.minimum === 'number') {
			numberSchema = numberSchema.min(value.minimum);
		}
		if (strictRequests && typeof value.maximum === 'number') {
			numberSchema = numberSchema.max(value.maximum);
		}
		schema = numberSchema;
	} else if (type === 'boolean') {
		schema = z.boolean();
	} else if (type === 'array') {
		const itemSchema = schemaFromOpenApi(value.items, definitions, mode, cache);
		schema = z.array(itemSchema);
	} else if (type === 'object' || isRecord(value.properties)) {
		const properties = isRecord(value.properties) ? value.properties : {};
		const requiredList =
			mode === 'v3Request' ? value['x-corsair-required'] : value.required;
		const requiredNames = Array.isArray(requiredList)
			? requiredList.filter(
					// `unknown` is necessary because JSON Schema required entries are parsed from provider JSON.
					(name: unknown): name is string => typeof name === 'string',
				)
			: [];
		const shape: Record<string, z.ZodType> = {};
		for (const [name, property] of Object.entries(properties)) {
			const propertySchema = schemaFromOpenApi(
				property,
				definitions,
				mode,
				cache,
			);
			shape[name] =
				strictRequests && requiredNames.includes(name)
					? propertySchema
					: propertySchema.optional();
		}
		const objectSchema = z.object(shape);
		if (isRecord(value.additionalProperties)) {
			schema = objectSchema.catchall(
				schemaFromOpenApi(value.additionalProperties, definitions, mode, cache),
			);
		} else if (strictRequests && value.additionalProperties === true) {
			// `unknown` is necessary because OpenAPI explicitly permits arbitrary JSON map values here.
			schema = objectSchema.catchall(z.unknown());
		} else if (openBody) {
			// `unknown` is necessary because the specs omit documented body fields (see SchemaMode).
			schema = objectSchema.catchall(z.unknown());
		} else if (strictRequests) {
			schema = objectSchema.strict();
		} else {
			// OpenAPI defaults additionalProperties to true for response objects, so preserve provider extensions.
			schema = objectSchema.passthrough();
		}
	} else {
		// `unknown` is necessary because the provider schema uses an unsupported JSON Schema keyword.
		schema = z.unknown();
	}

	return nullable ? schema.nullable() : schema;
}

// `unknown` is necessary because query parameter enums and values differ by operation.
function parameterSchema(
	parameter: TeamworkOperationDefinition['parameters'][number],
	definitions: Record<string, TeamworkOpenApiSchema>,
): z.ZodType {
	const parameterDocument: Record<string, unknown> = {
		type: parameter.type,
		format: parameter.format,
		enum: parameter.enum,
		items: parameter.items,
		minimum: parameter.minimum,
		maximum: parameter.maximum,
		minLength: parameter.minLength,
		maxLength: parameter.maxLength,
	};
	return schemaFromOpenApi(
		parameterDocument,
		definitions,
		'request',
		new Map(),
	);
}

const v3TaskRequestOperationIds = new Set([
	'tasks.create',
	'tasks.update',
	'tasks.createSubtask',
	'personalTasks.create',
]);

// Teamwork's official V3 task examples use compact arrays and strings; keep these request-only compatibility shapes limited to task.Request operations.
function v3TaskRequestDefinitions(
	definitions: Record<string, TeamworkOpenApiSchema>,
	requireTaskName: boolean,
): Record<string, TeamworkOpenApiSchema> {
	const userGroups = definitions['payload.UserGroups'];
	const userGroupProperties = isRecord(userGroups?.properties)
		? userGroups.properties
		: {};
	const customFields = definitions['task.CustomFields'];
	const taskRequest = definitions['task.Request'];
	const task = definitions['task.Task'];
	const taskOptions = definitions['task.Options'];
	const customFieldValue = definitions['value.CustomFieldValue'];
	const nullableInt64Slice = definitions['payload.NullableInt64Slice'];
	const nullableTaskPriority = definitions['payload.NullableTaskPriority'];
	const arrayOfIntegers = { type: 'array', items: { type: 'integer' } };
	return {
		...definitions,
		'payload.NullableInt64Slice': {
			oneOf: [nullableInt64Slice, arrayOfIntegers],
		},
		'payload.NullableTaskPriority': {
			oneOf: [
				nullableTaskPriority,
				{ type: 'string', enum: ['none', '', 'low', 'medium', 'high'] },
			],
		},
		'payload.UserGroups': {
			...userGroups,
			required: [],
			'x-corsair-required': [],
			properties: Object.fromEntries(
				Object.keys(userGroupProperties).map((name) => [
					name,
					{
						oneOf: [
							{ $ref: '#/definitions/payload.NullableInt64Slice' },
							arrayOfIntegers,
						],
					},
				]),
			),
		},
		'task.CustomFields': {
			oneOf: [
				customFields,
				{
					type: 'array',
					items: { $ref: '#/definitions/value.CustomFieldValue' },
				},
			],
		},
		'value.CustomFieldValue': {
			...customFieldValue,
			required: ['customfieldId', 'value'],
			'x-corsair-required': ['customfieldId', 'value'],
		},
		'task.Task': {
			...task,
			properties: {
				...(isRecord(task?.properties) ? task.properties : {}),
				description: { type: 'string' },
			},
			required: requireTaskName ? ['name'] : [],
			'x-corsair-required': requireTaskName ? ['name'] : [],
		},
		'task.Options': {
			...taskOptions,
			required: ['notify'],
			'x-corsair-required': ['notify'],
		},
		'task.Request': {
			...taskRequest,
			properties: {
				...(isRecord(taskRequest?.properties) ? taskRequest.properties : {}),
				card: {
					type: 'object',
					properties: { columnId: { type: 'integer' } },
				},
			},
			required: ['task', 'taskOptions'],
			'x-corsair-required': ['task', 'taskOptions'],
		},
	};
}

// `unknown` is necessary because each generated operation schema has distinct nested request fields.
function createInputSchema(
	operation: TeamworkOperationDefinition,
): z.ZodType<Record<string, unknown>> {
	const baseDefinitions = teamworkDefinitions[operation.version] ?? {};
	const definitions =
		operation.version === 'v3' && v3TaskRequestOperationIds.has(operation.id)
			? v3TaskRequestDefinitions(baseDefinitions, operation.method === 'POST')
			: baseDefinitions;
	const pathShape: Record<string, z.ZodType> = {};
	const queryShape: Record<string, z.ZodType> = {};
	for (const parameter of operation.parameters) {
		const shape = parameter.in === 'path' ? pathShape : queryShape;
		const field = parameterSchema(parameter, definitions);
		shape[parameter.name] = parameter.required ? field : field.optional();
	}
	// A map with a required parameter is itself required, so leaving it out
	// can't skip the check; a map with none may be left out (sent as {}).
	const requiredIn = (place: 'path' | 'query') =>
		operation.parameters.some(
			(parameter) => parameter.in === place && parameter.required,
		);
	const pathSchema = z.object(pathShape).strict();
	const querySchema = z.object(queryShape).strict();
	const inputShape: Record<string, z.ZodType> = {
		path: requiredIn('path') ? pathSchema : pathSchema.optional(),
		query: requiredIn('query') ? querySchema : querySchema.optional(),
	};
	if (operation.body !== undefined) {
		const bodySchema = schemaFromOpenApi(
			operation.body,
			definitions,
			operation.version === 'v1' ? 'v1Request' : 'v3Request',
			new Map(),
		);
		inputShape.body = operation.bodyRequired
			? bodySchema
			: bodySchema.optional();
	}
	return z.object(inputShape).strict();
}

// The documented top-level response stays non-null: a null or empty body is still malformed.
function responseSchema(
	operation: TeamworkOperationDefinition,
	cache: Map<string, z.ZodType>,
): z.ZodType {
	const definitions = teamworkDefinitions[operation.version] ?? {};
	// `unknown` is necessary because the response document is provider OpenAPI JSON.
	let document: unknown = operation.response;
	while (isRecord(document) && typeof document.$ref === 'string') {
		document = definitions[document.$ref.replace(/^#\/definitions\//, '')];
	}
	const schema = schemaFromOpenApi(
		document,
		definitions,
		// V2 custom-field values are text or numbers whatever the spec says, like V1's scalars.
		operation.version === 'v3' ? 'response' : 'v1Response',
		cache,
	);
	return schema instanceof z.ZodNullable
		? (schema.unwrap() as z.ZodType)
		: schema;
}

// Documented as 204 with no body, but a V3 task delete answers 200 with
// `{ affected: { taskIds: [] } }` (live run 11-16). Accept no body or a JSON object.
const noContentResponse = z.union([z.undefined(), z.object({}).passthrough()]);

// Built on first use, one operation at a time: building all of them at import
// took ~150 MB of heap and ~0.7 s for an instance that may call two operations.
const responseDefinitionCache = new Map<string, z.ZodType>();
const inputSchemaCache = new Map<string, z.ZodType<Record<string, unknown>>>();
const outputSchemaCache = new Map<string, z.ZodType>();
const operationsById = new Map(
	teamworkOperations.map((operation) => [operation.id, operation]),
);

function operationFor(id: string): TeamworkOperationDefinition {
	const operation = operationsById.get(id);
	if (!operation) throw new Error('Teamwork operation is unavailable');
	return operation;
}

// `unknown` is necessary because each operation's path, query and body shapes differ.
export function getTeamworkInputSchema(
	id: string,
): z.ZodType<Record<string, unknown>> {
	let schema = inputSchemaCache.get(id);
	if (!schema) {
		schema = createInputSchema(operationFor(id));
		inputSchemaCache.set(id, schema);
	}
	return schema;
}

export function getTeamworkOutputSchema(id: string): z.ZodType {
	let schema = outputSchemaCache.get(id);
	if (!schema) {
		const operation = operationFor(id);
		schema =
			operation.response === null
				? noContentResponse
				: responseSchema(operation, responseDefinitionCache);
		outputSchemaCache.set(id, schema);
	}
	return schema;
}

/** `input` and `output` are getters, so a schema is built only when something reads it. */
export function teamworkSchemaEntry(id: string): {
	readonly input: z.ZodType;
	readonly output: z.ZodType;
} {
	return {
		get input() {
			return getTeamworkInputSchema(id);
		},
		get output() {
			return getTeamworkOutputSchema(id);
		},
	};
}

function lazyRecord(
	build: (id: string) => z.ZodType,
): Readonly<Record<string, z.ZodType>> {
	const record: Record<string, z.ZodType> = {};
	for (const { id } of teamworkOperations) {
		Object.defineProperty(record, id, {
			enumerable: true,
			get: () => build(id),
		});
	}
	return record;
}

/** Every operation's schemas by id. Reading a key builds that schema (then cached). */
export const teamworkInputSchemas = lazyRecord(getTeamworkInputSchema);
export const teamworkOutputSchemas = lazyRecord(getTeamworkOutputSchema);

export type { TeamworkOperationDefinition };

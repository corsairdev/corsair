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

// `unknown` is necessary because schema conversion starts with untrusted provider JSON.
function schemaFromOpenApi(
	value: unknown,
	definitions: Record<string, TeamworkOpenApiSchema>,
	strictRequests: boolean,
	cache: Map<string, z.ZodType>,
): z.ZodType {
	if (!isRecord(value)) {
		// `unknown` is necessary because the provider omitted a schema for this JSON value.
		return z.unknown();
	}

	const reference = value.$ref;
	if (typeof reference === 'string') {
		const name = reference.replace(/^#\/definitions\//, '');
		const cacheKey = `${strictRequests ? 'request' : 'response'}:${name}`;
		const existing = cache.get(cacheKey);
		if (existing) return existing;
		const lazySchema = z.lazy(() =>
			schemaFromOpenApi(definitions[name], definitions, strictRequests, cache),
		);
		cache.set(cacheKey, lazySchema);
		return lazySchema;
	}

	const nullable = value.nullable === true || value['x-nullable'] === true;
	const type = value.type;
	let schema: z.ZodType;

	if (Array.isArray(value.enum)) {
		const values = value.enum;
		// `unknown` is necessary because enum values may use any JSON scalar type.
		schema = z.custom<unknown>((candidate: unknown) =>
			// `unknown` is necessary because the candidate is untrusted until matched against the enum.
			values.some((allowed: unknown) => Object.is(allowed, candidate)),
		);
	} else if (Array.isArray(value.allOf)) {
		// `unknown` is necessary because allOf members are arbitrary OpenAPI schema objects.
		const members = value.allOf.map((member: unknown) =>
			schemaFromOpenApi(member, definitions, strictRequests, cache),
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
			schemaFromOpenApi(choice, definitions, strictRequests, cache),
		);
		// `unknown` is necessary because union candidates are untrusted JSON values.
		schema = z.custom<unknown>((candidate: unknown) =>
			choices.some((choice) => choice.safeParse(candidate).success),
		);
	} else if (type === 'string') {
		let stringSchema = z.string();
		if (typeof value.minLength === 'number') {
			stringSchema = stringSchema.min(value.minLength);
		}
		if (typeof value.maxLength === 'number') {
			stringSchema = stringSchema.max(value.maxLength);
		}
		schema = stringSchema;
	} else if (type === 'integer' || type === 'number') {
		let numberSchema = z.number();
		if (type === 'integer') numberSchema = numberSchema.int();
		if (typeof value.minimum === 'number') {
			numberSchema = numberSchema.min(value.minimum);
		}
		if (typeof value.maximum === 'number') {
			numberSchema = numberSchema.max(value.maximum);
		}
		schema = numberSchema;
	} else if (type === 'boolean') {
		schema = z.boolean();
	} else if (type === 'array') {
		const itemSchema = schemaFromOpenApi(
			value.items,
			definitions,
			strictRequests,
			cache,
		);
		schema = z.array(itemSchema);
	} else if (type === 'object' || isRecord(value.properties)) {
		const properties = isRecord(value.properties) ? value.properties : {};
		const requiredNames = Array.isArray(value.required)
			? value.required.filter(
					// `unknown` is necessary because JSON Schema required entries are parsed from provider JSON.
					(name: unknown): name is string => typeof name === 'string',
				)
			: [];
		const shape: Record<string, z.ZodType> = {};
		for (const [name, property] of Object.entries(properties)) {
			const propertySchema = schemaFromOpenApi(
				property,
				definitions,
				strictRequests,
				cache,
			);
			shape[name] = requiredNames.includes(name)
				? propertySchema
				: propertySchema.optional();
		}
		const objectSchema = z.object(shape);
		if (isRecord(value.additionalProperties)) {
			schema = objectSchema.catchall(
				schemaFromOpenApi(
					value.additionalProperties,
					definitions,
					strictRequests,
					cache,
				),
			);
		} else if (strictRequests && value.additionalProperties === true) {
			// `unknown` is necessary because OpenAPI explicitly permits arbitrary JSON map values here.
			schema = objectSchema.catchall(z.unknown());
		} else if (strictRequests || value.additionalProperties === false) {
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
	return schemaFromOpenApi(parameterDocument, definitions, true, new Map());
}

const v3TaskRequestOperationIds = new Set([
	'v3_post_projects_api_v3_me_personaltasks_json',
	'v3_post_projects_api_v3_taskgroups_taskgroupid_tasks_json',
	'v3_post_projects_api_v3_tasklists_tasklistid_tasks_json',
	'v3_patch_projects_api_v3_tasks_taskid_json',
	'v3_put_projects_api_v3_tasks_taskid_json',
	'v3_post_projects_api_v3_tasks_taskid_subtasks_json',
]);

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
		},
		'task.Task': {
			...task,
			properties: {
				...(isRecord(task?.properties) ? task.properties : {}),
				description: { type: 'string' },
			},
			required: requireTaskName ? ['name'] : [],
		},
		'task.Options': {
			...taskOptions,
			required: ['notify'],
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
	const inputShape: Record<string, z.ZodType> = {
		path: z.object(pathShape).strict().default({}),
		query: z.object(queryShape).strict().default({}),
	};
	if (operation.body !== undefined) {
		const bodySchema = schemaFromOpenApi(
			operation.body,
			definitions,
			true,
			new Map(),
		);
		inputShape.body = operation.bodyRequired
			? bodySchema
			: bodySchema.optional();
	}
	return z.object(inputShape).strict();
}

const schemaCache = new Map<string, z.ZodType>();
export const teamworkInputSchemas = Object.fromEntries(
	teamworkOperations.map((operation) => [
		operation.id,
		createInputSchema(operation),
	]),
);
export const teamworkOutputSchemas = Object.fromEntries(
	teamworkOperations.map((operation) => [
		operation.id,
		operation.response === null
			? z.undefined()
			: schemaFromOpenApi(
					operation.response,
					teamworkDefinitions[operation.version] ?? {},
					false,
					schemaCache,
				),
	]),
);

export function teamworkOutputSchemaFor(
	operation: TeamworkOperationDefinition,
	// `unknown` is necessary because this shared helper accepts query maps from operations with different parameter types.
	query: Record<string, unknown>,
): z.ZodType {
	const selectedProjectFields = query['fields[projects]'];
	if (
		!Array.isArray(selectedProjectFields) ||
		selectedProjectFields.length === 0
	) {
		return teamworkOutputSchemas[operation.id] ?? z.never();
	}
	const baseDefinitions = teamworkDefinitions[operation.version] ?? {};
	const projectSchema = baseDefinitions['view.ProjectV205'];
	if (!isRecord(projectSchema)) {
		return teamworkOutputSchemas[operation.id] ?? z.never();
	}
	const properties = projectSchema.properties;
	if (!isRecord(properties))
		return teamworkOutputSchemas[operation.id] ?? z.never();
	const selectedFields = selectedProjectFields.filter(
		(name): name is string => typeof name === 'string' && name in properties,
	);
	if (selectedFields.length === 0) {
		return teamworkOutputSchemas[operation.id] ?? z.never();
	}
	const definitions = {
		...baseDefinitions,
		'view.ProjectV205': {
			...projectSchema,
			required: selectedFields,
		},
	};
	return operation.response === null
		? z.undefined()
		: schemaFromOpenApi(operation.response, definitions, false, new Map());
}

export type { TeamworkOperationDefinition };

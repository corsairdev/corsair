import * as core from 'corsair/core';
import * as client from './client';
import { createZohoBooksOperationEndpoint } from './endpoints/factory';
import { zohoBooksEndpointMeta } from './endpoints/generated';
import { zohobooks } from './index';
import { openApiSchemas, zohoBooksOperations } from './openapi';
import type {
	JsonValue,
	ZohoBooksOperationDefinition,
	ZohoBooksOperationInput,
	ZohoBooksOperationOutput,
} from './schema/openapi-types';
import { ZohoBooksEndpointInputSchemas } from './schema/openapi-validation';

type JsonRecord = { [key: string]: JsonValue };

const requestSpy = jest.spyOn(client, 'makeZohoBooksRequest');
const eventSpy = jest.spyOn(core, 'logEventFromContext');

function objectValue(value: JsonValue | undefined): JsonRecord | undefined {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? value
		: undefined;
}

function stringValue(value: JsonValue | undefined): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

function arrayValue(value: JsonValue | undefined): JsonValue[] | undefined {
	return Array.isArray(value) ? value : undefined;
}

function resolveSchema(
	operation: ZohoBooksOperationDefinition,
	schema: JsonValue | undefined,
): JsonValue | undefined {
	const object = objectValue(schema);
	const reference = stringValue(object?.$ref);
	const name = reference?.match(/^#\/components\/schemas\/([^/]+)$/)?.[1];
	return name ? openApiSchemas[operation.group]?.[name] : schema;
}

function sampleValue(
	operation: ZohoBooksOperationDefinition,
	schemaInput: JsonValue | undefined,
	field = '',
	depth = 0,
): JsonValue {
	if (depth > 12) return null;
	const schema = resolveSchema(operation, schemaInput);
	const object = objectValue(schema);
	if (!object) return null;
	const enumValues = arrayValue(object.enum);
	if (enumValues?.length) return enumValues[0] ?? null;
	if (object.const !== undefined) return object.const;
	const allOf = arrayValue(object.allOf);
	const combined: JsonRecord = {};
	for (const part of allOf ?? []) {
		const sample = sampleValue(operation, part, field, depth + 1);
		const sampleObject = objectValue(sample);
		if (sampleObject) Object.assign(combined, sampleObject);
	}
	const variants = arrayValue(object.oneOf) ?? arrayValue(object.anyOf);
	if (variants?.length) {
		const variant = sampleValue(operation, variants[0], field, depth + 1);
		const variantObject = objectValue(variant);
		if (variantObject) Object.assign(combined, variantObject);
		else return variant;
	}
	const type = stringValue(object.type);
	const properties = objectValue(object.properties);
	if (type === 'object' || properties) {
		const required = new Set(
			(arrayValue(object.required) ?? []).filter(
				(value): value is string => typeof value === 'string',
			),
		);
		for (const key of required) {
			if (properties?.[key] === undefined)
				combined[key] = sampleValue(
					operation,
					{ type: 'string' },
					key,
					depth + 1,
				);
		}
		for (const [key, propertySchema] of Object.entries(properties ?? {})) {
			if (required.has(key)) {
				combined[key] = sampleValue(operation, propertySchema, key, depth + 1);
			}
		}
		return combined;
	}
	if (type === 'array') {
		const minItems = typeof object.minItems === 'number' ? object.minItems : 0;
		return Array.from({ length: Math.min(minItems, 3) }, () =>
			sampleValue(operation, object.items, field, depth + 1),
		);
	}
	if (type === 'boolean') return false;
	if (type === 'integer' || type === 'number') {
		if (typeof object.minimum === 'number') return object.minimum;
		if (typeof object.exclusiveMinimum === 'number')
			return object.exclusiveMinimum + 1;
		return 1;
	}
	if (type === 'string' || type === undefined) {
		if (
			arrayValue(object.allOf)?.length ||
			arrayValue(object.anyOf)?.length ||
			arrayValue(object.oneOf)?.length
		)
			return combined;
		const format = stringValue(object.format);
		const lower = field.toLowerCase();
		const pattern = stringValue(object.pattern);
		if (pattern && /\\d|0-9/.test(pattern)) {
			const minimum =
				typeof object.minLength === 'number' ? object.minLength : 1;
			return '1'.repeat(Math.max(1, minimum));
		}
		if (format === 'date') return '2026-01-15';
		if (format === 'date-time') return '2026-01-15T12:00:00Z';
		if (format === 'email' || lower.includes('email'))
			return 'agent@sample.invalid';
		if (lower.includes('phone')) return '+15555550100';
		if (lower === 'organization_id' || lower === 'id' || lower.endsWith('_id'))
			return '999999999999999';
		if (lower.includes('date')) return '2026-01-15';
		if (lower.includes('name')) return 'Sample record';
		const minLength =
			typeof object.minLength === 'number' ? object.minLength : 0;
		return minLength > 6 ? 's'.repeat(minLength) : 'sample';
	}
	return Object.keys(combined).length > 0 ? combined : null;
}

function makeInput(
	operation: ZohoBooksOperationDefinition,
): ZohoBooksOperationInput {
	const input: ZohoBooksOperationInput = {};
	for (const location of ['path', 'query', 'header'] as const) {
		const parameters = operation.parameters.filter(
			(parameter) => parameter.in === location && parameter.required,
		);
		if (parameters.length === 0) continue;
		const target =
			location === 'path'
				? 'pathParams'
				: location === 'header'
					? 'headers'
					: 'query';
		input[target] = Object.fromEntries(
			parameters.map((parameter) => [
				parameter.name,
				sampleValue(operation, parameter.schema, parameter.name),
			]),
		);
	}
	if (operation.request?.schema) {
		const body = sampleValue(operation, operation.request.schema, 'body');
		const bodyObject = objectValue(body);
		if (operation.request.mediaType === 'multipart/form-data' && bodyObject) {
			const requestSchema = objectValue(
				resolveSchema(operation, operation.request.schema),
			);
			for (const [name, propertySchema] of Object.entries(
				objectValue(requestSchema?.properties) ?? {},
			)) {
				if (objectValue(propertySchema)?.format === 'binary') {
					bodyObject[name] = {
						filename: 'receipt.pdf',
						contentType: 'application/pdf',
						base64: 'JVBERi0xLjQK',
					};
				}
			}
		}
		input.body = body;
	}
	return input;
}

function makeOutput(
	operation: ZohoBooksOperationDefinition,
): ZohoBooksOperationOutput {
	const binary = operation.responses.find(
		(response) =>
			response.contentType !== 'application/json' &&
			response.contentType !== 'application/x-empty',
	);
	if (binary) {
		return {
			kind: 'binary',
			contentType:
				binary.contentType === '*/*'
					? 'application/octet-stream'
					: binary.contentType,
			base64: 'JVBERi0xLjQK',
			byteLength: 9,
		};
	}
	const json = operation.responses.find((response) =>
		response.contentType.includes('json'),
	);
	if (json?.schema) return sampleValue(operation, json.schema);
	if (json) return { code: 0, message: 'success' };
	return null;
}

const context = {
	key: 'test-access-token',
	options: { region: 'us' as const },
	$getAccountId: async () => 'test-account',
};

beforeAll(() => {
	eventSpy.mockResolvedValue(null);
});

afterAll(() => {
	requestSpy.mockRestore();
	eventSpy.mockRestore();
});

describe('Zoho Books operation endpoints', () => {
	it('registers OAuth, the full operation scope set, and no webhook handlers', () => {
		const plugin = zohobooks({ region: 'eu' });
		const scopes = plugin.oauthConfig?.scopes ?? [];
		expect(plugin).toHaveProperty('options.authType', 'oauth_2');
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://accounts.zoho.eu/oauth/v2/token',
		);
		expect(scopes).toHaveLength(1);
		expect(String(scopes[0]).split(',')).toHaveLength(81);
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(0);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(884);
	});

	it('validates, dispatches, parses, and safely logs every documented operation', async () => {
		for (const operation of zohoBooksOperations) {
			const input = makeInput(operation);
			const parsedInput =
				ZohoBooksEndpointInputSchemas[operation.id]?.safeParse(input);
			if (!parsedInput?.success) {
				const issues =
					parsedInput && !parsedInput.success ? parsedInput.error.issues : [];
				throw new Error(
					`Input fixture failed for ${operation.id}: ${JSON.stringify({ issues, input })}`,
				);
			}

			const output = makeOutput(operation);
			requestSpy.mockResolvedValueOnce(output);
			const endpoint = createZohoBooksOperationEndpoint(operation.id);
			await expect(endpoint(context, parsedInput.data)).resolves.toEqual(
				output,
			);
			expect(requestSpy).toHaveBeenLastCalledWith(context, operation, input);
			const eventCall = eventSpy.mock.calls.at(-1);
			expect(eventCall?.[1]).toBe(
				`zohobooks.${operation.group}.${operation.name}`,
			);
			expect(eventCall?.[2]).toEqual({
				method: operation.method,
				path: operation.path,
			});
			expect(JSON.stringify(eventCall?.[2])).not.toContain('test-access-token');

			requestSpy.mockClear();
			const invalidInput = Object.assign(
				{},
				{ body: { undocumented: true }, undocumented: true },
			);
			await expect(endpoint(context, invalidInput)).rejects.toThrow();
			expect(requestSpy).not.toHaveBeenCalled();
		}
	});

	it('marks irreversible financial actions as destructive', () => {
		const destructive = zohoBooksOperations.filter(
			(operation) =>
				operation.method !== 'GET' &&
				/void|refund|delete|email|send|sms|force.?pay|write.?off|merge/i.test(
					`${operation.id} ${operation.summary}`,
				),
		);
		expect(destructive.length).toBeGreaterThan(0);
		for (const operation of destructive) {
			const key = `${operation.group}.${operation.name}`;
			const metadata = Object.entries(zohoBooksEndpointMeta).find(
				([registeredKey]) => registeredKey === key,
			)?.[1];
			expect(metadata?.riskLevel).toBe('destructive');
		}
	});
});

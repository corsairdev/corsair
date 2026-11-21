import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as core from 'corsair/core';
import { parse as parseYaml } from 'yaml';
import * as client from './client';
import { createZohoBooksRuntimeOperationEndpoint } from './endpoints/factory';
import { zohoBooksEndpointMeta } from './endpoints/generated';
import type { ZohoBooksEndpoints } from './index';
import { zohobooks } from './index';
import {
	openApiSchemas,
	zohoBooksExcludedOperations,
	zohoBooksOperations,
} from './openapi';
import type {
	JsonValue,
	ZohoBooksOperationDefinition,
	ZohoBooksOperationInput,
	ZohoBooksOperationOutput,
} from './schema/openapi-types';
import {
	isJsonValue,
	ZohoBooksEndpointInputSchemas,
} from './schema/openapi-validation';
import type {
	ZohoBooksOperationInputFor,
	ZohoBooksOperationOutputFor,
} from './schema/operation-types';

type JsonRecord = { [key: string]: JsonValue };

const requestSpy = jest.spyOn(client, 'makeZohoBooksRequest');
const eventSpy = jest.spyOn(core, 'logEventFromContext');

type CreateBankAccountInput = Parameters<
	ZohoBooksEndpoints['bankAccounts']['createBankAccount']
>[0];
const validBankAccountInput: CreateBankAccountInput = {
	query: { organization_id: '999999999999999' },
	body: { account_name: 'Operating', account_type: 'bank' },
};
void validBankAccountInput;
const invalidBankAccountInput: CreateBankAccountInput = {
	query: { organization_id: '999999999999999' },
	body: {
		account_name: 'Operating',
		account_type: 'bank',
		// @ts-expect-error createBankAccount rejects undocumented body fields at compile time.
		unrecognized_field: true,
	},
};
void invalidBankAccountInput;

type BillAttachmentInput = ZohoBooksOperationInputFor<'get_bill_attachment'>;
const validBillAttachmentInput: BillAttachmentInput = {
	pathParams: { bill_id: '460000000098765' },
	query: { organization_id: '999999999999999' },
};
void validBillAttachmentInput;

type CreateBillInput = ZohoBooksOperationInputFor<'create_bill'>;
const validCreateBillInput: CreateBillInput = {
	query: {
		organization_id: '999999999999999',
		attachment: {
			filename: 'bill.pdf',
			contentType: 'application/pdf',
			base64: 'JVBERi0xLjQK',
		},
	},
	body: { vendor_id: '999999999999999', bill_number: 'BILL-42' },
};
void validCreateBillInput;
const invalidCreateBillInput: CreateBillInput = {
	query: { organization_id: '999999999999999' },
	// @ts-expect-error create_bill requires both vendor_id and bill_number when body is supplied.
	body: { vendor_id: '999999999999999' },
};
void invalidCreateBillInput;

type BillAttachmentOutput = ZohoBooksOperationOutputFor<'get_bill_attachment'>;
function readBillAttachmentOutput(output: BillAttachmentOutput): string {
	if (typeof output !== 'object' || output === null) return '';
	if (
		'kind' in output &&
		output.kind === 'binary' &&
		typeof output.contentType === 'string'
	)
		return output.contentType;
	return 'message' in output && typeof output.message === 'string'
		? output.message
		: '';
}
void readBillAttachmentOutput;

type CreateCustomModuleRecordInput = Parameters<
	ZohoBooksEndpoints['customModules']['createCustomModuleRecord']
>[0];
const validCustomModuleRecordInput: CreateCustomModuleRecordInput = {
	pathParams: { module_name: 'cm_assets' },
	query: { organization_id: '999999999999999' },
	body: {
		record_name: 'Laptop',
		cf_serial_number: 'SN-42',
		cf_purchase_price: 1500,
		cf_is_leased: false,
	},
};
void validCustomModuleRecordInput;
const invalidCustomModuleRecordInput: CreateCustomModuleRecordInput = {
	pathParams: { module_name: 'cm_assets' },
	query: { organization_id: '999999999999999' },
	body: {
		record_name: 'Laptop',
		// @ts-expect-error module-defined fields must use Zoho's cf_ API-name prefix.
		serial_number: 'SN-42',
	},
};
void invalidCustomModuleRecordInput;
const invalidCustomModuleValue: CreateCustomModuleRecordInput = {
	pathParams: { module_name: 'cm_assets' },
	query: { organization_id: '999999999999999' },
	body: {
		record_name: 'Laptop',
		// @ts-expect-error custom-module fields only accept scalar values.
		cf_extended_data: { nested: true },
	},
};
void invalidCustomModuleValue;

function isJsonRecord(value: JsonValue | undefined): value is JsonRecord {
	return (
		value !== undefined &&
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value)
	);
}

function objectValue(value: JsonValue | undefined): JsonRecord | undefined {
	return isJsonRecord(value) ? value : undefined;
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

function isBinarySchema(
	operation: ZohoBooksOperationDefinition,
	schemaInput: JsonValue | undefined,
	depth = 0,
): boolean {
	if (depth > 12 || schemaInput === undefined) return false;
	const schema = objectValue(resolveSchema(operation, schemaInput));
	if (!schema) return false;
	if (schema.format === 'binary') return true;
	if (isBinarySchema(operation, schema.items, depth + 1)) return true;
	for (const key of ['oneOf', 'anyOf', 'allOf']) {
		if (
			arrayValue(schema[key])?.some((part) =>
				isBinarySchema(operation, part, depth + 1),
			)
		)
			return true;
	}
	return false;
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
	includeOptionalBinaryInputs = true,
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
	const binaryQueryParameters = operation.parameters.filter(
		(parameter) =>
			parameter.in === 'query' &&
			isBinarySchema(operation, parameter.schema) &&
			(includeOptionalBinaryInputs || parameter.required),
	);
	if (binaryQueryParameters.length > 0) {
		input.query = {
			...(input.query ?? {}),
			...Object.fromEntries(
				binaryQueryParameters.map((parameter) => [
					parameter.name,
					{
						filename: 'receipt.pdf',
						contentType: 'application/pdf',
						base64: 'JVBERi0xLjQK',
					},
				]),
			),
		};
	}
	if (operation.request?.schema) {
		const body = sampleValue(operation, operation.request.schema, 'body');
		const bodyObject = objectValue(body);
		if (bodyObject) {
			const requestSchema = objectValue(
				resolveSchema(operation, operation.request.schema),
			);
			const requiredBodyFields = new Set(
				(arrayValue(requestSchema?.required) ?? []).filter(
					(value): value is string => typeof value === 'string',
				),
			);
			for (const [name, propertySchema] of Object.entries(
				objectValue(requestSchema?.properties) ?? {},
			)) {
				if (
					isBinarySchema(operation, propertySchema) &&
					(includeOptionalBinaryInputs || requiredBodyFields.has(name))
				) {
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
		expect(zohoBooksOperations).toHaveLength(884);
		expect(zohoBooksExcludedOperations).toHaveLength(1);
		expect(zohoBooksExcludedOperations[0]?.id).toBe('all_tag_options');
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(884);
		expect(Object.keys(zohoBooksEndpointMeta).sort()).toEqual(
			zohoBooksOperations
				.map((operation) => `${operation.group}.${operation.name}`)
				.sort(),
		);
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
			const endpoint = createZohoBooksRuntimeOperationEndpoint(operation.id);
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

	it('keeps every published API example valid against its operation input schema', () => {
		// The YAML parser returns untyped data; validate it as JSON before reading example fields.
		const parsedDocs = parseYaml(
			readFileSync(join(__dirname, 'plugin-docs.yaml'), 'utf8'),
		);
		if (!isJsonValue(parsedDocs))
			throw new Error('plugin-docs.yaml contains non-JSON values.');
		const docsConfig = objectValue(parsedDocs);
		const apiExamples = objectValue(docsConfig?.apiExamples);
		if (!apiExamples)
			throw new Error('plugin-docs.yaml has no API examples map.');

		const operationsByName = new Map(
			zohoBooksOperations.map((operation) => [
				`${operation.group}.${operation.name}`,
				operation,
			]),
		);
		const invalidExamples: string[] = [];
		for (const [name, exampleValue] of Object.entries(apiExamples)) {
			const operation = operationsByName.get(name);
			const rawExample = objectValue(exampleValue);
			if (!operation || !rawExample) {
				invalidExamples.push(`${name}: unknown operation or malformed example`);
				continue;
			}
			let args = rawExample.args;
			if (typeof rawExample.call === 'string') {
				try {
					args = JSON.parse(rawExample.call);
				} catch {
					invalidExamples.push(`${name}: call must contain valid JSON`);
					continue;
				}
			}
			const schema = ZohoBooksEndpointInputSchemas[operation.id];
			if (!schema || !schema.safeParse(args).success)
				invalidExamples.push(`${name}: args do not match ${operation.id}`);
		}
		expect(invalidExamples).toEqual([]);
	});

	it('accepts module-defined cf_ fields while keeping custom-module records strict', () => {
		const pathParams = { module_name: 'cm_assets' };
		const query = { organization_id: '999999999999999' };
		const create = ZohoBooksEndpointInputSchemas.create_custom_module_record;
		const update = ZohoBooksEndpointInputSchemas.update_custom_module_record;
		const bulkUpdate =
			ZohoBooksEndpointInputSchemas.bulk_update_custom_module_records;
		if (!create || !update || !bulkUpdate)
			throw new Error('Custom module record input schemas are missing.');
		const recordBody = {
			record_name: 'Laptop',
			cf_debt_amount: 250,
			cf_serial_number: 'SN-42',
			cf_is_leased: false,
		};

		expect(
			create.safeParse({ pathParams, query, body: recordBody }).success,
		).toBe(true);
		expect(
			update.safeParse({
				pathParams: { ...pathParams, module_id: '123' },
				query,
				body: recordBody,
			}).success,
		).toBe(true);
		expect(
			bulkUpdate.safeParse({ pathParams, query, body: recordBody }).success,
		).toBe(true);
		expect(
			create.safeParse({
				pathParams,
				query,
				body: { record_name: 'Laptop', serial_number: 'SN-42' },
			}).success,
		).toBe(false);
		expect(
			create.safeParse({
				pathParams,
				query,
				body: { record_name: 'Laptop', cf_serial_number: { invalid: true } },
			}).success,
		).toBe(false);
		expect(
			create.safeParse({
				pathParams,
				query,
				body: { record_name: 'Laptop', cf_debt_amount: 'not-a-number' },
			}).success,
		).toBe(false);
	});

	it('accepts JSON metadata when Zoho returns it from a bill attachment read', async () => {
		const operation = zohoBooksOperations.find(
			(candidate) => candidate.id === 'get_bill_attachment',
		);
		if (!operation) throw new Error('The bill attachment read is missing.');
		requestSpy.mockResolvedValueOnce({ code: 0, message: 'success' });
		const endpoint = createZohoBooksRuntimeOperationEndpoint(operation.id);
		await expect(
			endpoint(context, {
				pathParams: { bill_id: '999999999999999' },
				query: { organization_id: '999999999999999' },
			}),
		).resolves.toEqual({ code: 0, message: 'success' });
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

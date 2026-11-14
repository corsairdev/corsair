import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { ElorusEndpoints, ElorusRegisteredHandlers } from './endpoints';
import { elorusEndpointMeta } from './endpoints/meta';
import { elorusOperationSpecs } from './endpoints/specs';
import type { ElorusOperationKey } from './endpoints/types';
import { elorusOperationSchemas } from './endpoints/types';
import type { ElorusContext } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

type FixtureJson =
	| null
	| boolean
	| number
	| string
	| FixtureJson[]
	| { [key: string]: FixtureJson };

type HandlerFixture = FixtureJson | Blob | { [key: string]: HandlerFixture };

type JsonSchemaFixture = z.core.JSONSchema.JSONSchema;
type SampleSchema = JsonSchemaFixture | JsonSchemaFixture[] | boolean;

function isHandlerObject(
	value: HandlerFixture,
): value is { [key: string]: HandlerFixture } {
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value) &&
		!(value instanceof Blob)
	);
}

function sampleFromJsonSchema(schema: SampleSchema): FixtureJson {
	if (typeof schema === 'boolean') return {};
	if (Array.isArray(schema)) {
		return sampleFromJsonSchema(schema[0] ?? {});
	}
	if (schema.const !== undefined) return schema.const;
	const firstEnumValue = schema.enum?.find((value) => value !== null);
	if (firstEnumValue !== undefined) return firstEnumValue;
	const alternatives = schema.anyOf ?? schema.oneOf;
	if (alternatives?.length) {
		const nonNullAlternative = alternatives.find(
			(item) => !('type' in item) || item.type !== 'null',
		);
		const alternative = nonNullAlternative ?? alternatives[0];
		if (alternative) return sampleFromJsonSchema(alternative);
	}
	const schemaType = schema.type;
	if (schemaType === 'object' || schema.properties) {
		const result: { [key: string]: FixtureJson } = {};
		for (const key of schema.required ?? []) {
			const property = schema.properties?.[key];
			if (property) result[key] = sampleFromJsonSchema(property);
		}
		return result;
	}
	if (schemaType === 'array') {
		const items = Array.isArray(schema.items)
			? (schema.items[0] ?? {})
			: (schema.items ?? {});
		return Array.from({ length: schema.minItems ?? 0 }, () =>
			sampleFromJsonSchema(items),
		);
	}
	if (schemaType === 'integer' || schemaType === 'number') {
		let value = Math.max(0, schema.minimum ?? 0);
		if (schemaType === 'integer') value = Math.ceil(value);
		if (schema.maximum !== undefined && value > schema.maximum) {
			value = schema.maximum;
		}
		return value;
	}
	if (schemaType === 'boolean') return false;
	if (schemaType === 'string') {
		let value =
			schema.format === 'date'
				? '2026-01-01'
				: schema.format === 'date-time'
					? '2026-01-01T00:00:00Z'
					: schema.format === 'email'
						? 'agent@example.com'
						: schema.pattern?.includes('a-fA-F0-9')
							? '000000'
							: 'demo';
		if (schema.minLength !== undefined && value.length < schema.minLength) {
			value = value.padEnd(schema.minLength, 'x');
		}
		if (schema.maxLength !== undefined && value.length > schema.maxLength) {
			value = value.slice(0, schema.maxLength);
		}
		return value;
	}
	return {};
}

const operationKeys = Object.keys(elorusOperationSpecs).sort();
const endpointKeys = [
	...Object.keys(ElorusEndpoints.v11).map((key) => `v11.${key}`),
	...Object.keys(ElorusEndpoints.v12).map((key) => `v12.${key}`),
].sort();
const registeredHandlerCases = ElorusRegisteredHandlers.map((handler) => ({
	operationKey: handler.operationKey,
	handler,
}));

describe('Elorus REST operation coverage', () => {
	it('registers every official v1.1 and v1.2 operation exactly once', () => {
		expect(Object.keys(ElorusEndpoints.v11)).toHaveLength(124);
		expect(Object.keys(ElorusEndpoints.v12)).toHaveLength(333);
		expect(operationKeys).toEqual(endpointKeys);
		expect(Object.keys(elorusOperationSchemas).sort()).toEqual(operationKeys);
		expect(Object.keys(elorusEndpointMeta).sort()).toEqual(operationKeys);
	});

	it('pins every operation to its documented version, method, and route', () => {
		for (const [key, spec] of Object.entries(elorusOperationSpecs)) {
			expect(
				spec.route.startsWith(`/${spec.version === 'v11' ? 'v1.1' : 'v1.2'}/`),
			).toBe(true);
			expect(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).toContain(spec.method);
			expect(key).toBe(`${spec.version}.${spec.operationId}`);
			expect(Object.hasOwn(elorusOperationSchemas, key)).toBe(true);
		}
	});

	it('classifies reads, writes, destructive calls, and response modes', () => {
		for (const spec of Object.values(elorusOperationSpecs)) {
			if (spec.method === 'GET') expect(spec.riskLevel).toBe('read');
			if (spec.method === 'DELETE') expect(spec.riskLevel).toBe('destructive');
			if (spec.mode === 'binary') {
				expect(
					spec.route.includes('/pdf/') || spec.route.includes('/file/'),
				).toBe(true);
			}
		}
		expect(
			Object.values(elorusOperationSpecs).filter((x) => x.mode === 'multipart'),
		).toHaveLength(11);
		expect(
			Object.values(elorusOperationSpecs).filter((x) => x.mode === 'binary'),
		).toHaveLength(27);
		expect(
			Object.values(elorusOperationSpecs).filter((x) => x.mode === 'empty'),
		).toHaveLength(75);
		expect(elorusOperationSpecs['v12.timeentries_mark_billed'].riskLevel).toBe(
			'write',
		);
		expect(
			elorusOperationSpecs['v12.timeentries_mark_unbilled'].riskLevel,
		).toBe('write');
		// R8: an operation that sends a message is destructive.
		const sends = Object.entries(elorusOperationSpecs).filter(
			([, spec]) =>
				spec.operationId.endsWith('_email_create') ||
				spec.operationId.endsWith('_email_from_template'),
		);
		expect(sends).toHaveLength(24);
		for (const [key, spec] of sends) {
			expect([key, spec.riskLevel]).toEqual([key, 'destructive']);
			expect([
				key,
				elorusEndpointMeta[key as ElorusOperationKey].riskLevel,
			]).toEqual([key, 'destructive']);
		}
		expect(elorusOperationSpecs['v12.invoices_mark_void'].riskLevel).toBe(
			'destructive',
		);
	});

	it.each(registeredHandlerCases)(
		'invokes $operationKey with schema-matched inputs and provider responses',
		async ({ handler }) => {
			jest.clearAllMocks();
			const getOrganizationId = jest.fn(async () => 'fixture-organization');
			const context = {
				endpoints: {},
				db: {},
				$getAccountId: async () => 'fixture-account',
				key: 'fixture-token',
				options: { demo: true },
				keys: {
					get_dek: async () => 'fixture-dek',
					issue_new_dek: async () => 'fixture-dek',
					get_api_key: async () => 'fixture-token',
					set_api_key: async (_value: string | null) => undefined,
					get_webhook_signature: async () => 'fixture-signature',
					set_webhook_signature: async (_value: string | null) => undefined,
					get_organization_id: getOrganizationId,
					set_organization_id: async (_value: string | null) => undefined,
				},
			} satisfies ElorusContext;
			let nextResponse = new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
			const fetchSpy = jest
				.spyOn(globalThis, 'fetch')
				.mockImplementation(async () => nextResponse);
			try {
				const spec = elorusOperationSpecs[handler.operationKey];
				const schemaPair = elorusOperationSchemas[handler.operationKey];
				let expectedRequestCount = 0;
				expect(handler.operationKey.startsWith(`${spec.version}.`)).toBe(true);
				expect(handler.inputSchema).toBe(schemaPair.input);
				expect(handler.outputSchema).toBe(schemaPair.output);

				let input: HandlerFixture;
				if (spec.mode === 'multipart') {
					const path = Object.fromEntries(
						Array.from(spec.route.matchAll(/\{([^}]+)\}/g), ([, key]) => [
							key,
							'fixture-id',
						]),
					);
					input = {
						path,
						form: { file: new Blob(['fixture attachment']) },
					};
				} else {
					const generated = sampleFromJsonSchema(
						handler.inputSchema.toJSONSchema(),
					);
					if (!isHandlerObject(generated)) {
						throw new Error(`${handler.operationKey} input must be an object`);
					}
					const path = Object.fromEntries(
						Array.from(spec.route.matchAll(/\{([^}]+)\}/g), ([, key]) => [
							key,
							'fixture-id',
						]),
					);
					input = {
						...generated,
						...(Object.keys(path).length ? { path } : {}),
					};
				}

				const invalidInput = handler.invoke(context, {
					unrecognized_field: 'must fail before transport',
				});
				await expect(invalidInput).rejects.toMatchObject({ name: 'ZodError' });
				expect(fetchSpy).not.toHaveBeenCalled();

				const providerPayload =
					spec.mode === 'empty' || spec.mode === 'binary'
						? undefined
						: sampleFromJsonSchema(handler.outputSchema.toJSONSchema());
				if (
					spec.mode === 'json' &&
					!schemaPair.output.safeParse(null).success
				) {
					nextResponse = new Response('null', {
						status: spec.successStatus,
						headers: { 'content-type': 'application/json' },
					});
					await expect(handler.invoke(context, input)).rejects.toMatchObject({
						name: 'ZodError',
					});
					expectedRequestCount += 1;
					expect(fetchSpy).toHaveBeenCalledTimes(expectedRequestCount);
					expect(logEventFromContext).not.toHaveBeenCalled();
				}
				if (spec.mode === 'empty') {
					nextResponse = new Response(null, { status: 204 });
				} else if (spec.mode === 'binary') {
					nextResponse = new Response(new Uint8Array([37, 80, 68, 70]), {
						status: spec.successStatus,
						headers: { 'content-type': 'application/pdf' },
					});
				} else {
					nextResponse = new Response(JSON.stringify(providerPayload), {
						status: spec.successStatus,
						headers: { 'content-type': 'application/json' },
					});
				}
				expectedRequestCount += 1;
				const result = await handler.invoke(context, input);
				expect(handler.outputSchema.safeParse(result).success).toBe(true);

				const call = fetchSpy.mock.calls.at(-1);
				expect(call).toBeDefined();
				if (!call) {
					throw new Error(`Expected ${handler.operationKey} to call fetch.`);
				}
				const [url, init] = call;
				expect(new URL(String(url)).pathname).toBe(
					spec.route.replace(/\{[^}]+\}/g, 'fixture-id'),
				);
				expect(init?.method).toBe(spec.method);
				const headers = new Headers(init?.headers);
				expect(headers.get('Authorization')).toBe('Token fixture-token');
				expect(headers.get('X-Elorus-Organization')).toBe(
					'fixture-organization',
				);
				expect(headers.get('X-Elorus-Demo')).toBe('1');
				expect(getOrganizationId).toHaveBeenCalledTimes(expectedRequestCount);
				expect(logEventFromContext).toHaveBeenCalledTimes(1);
				expect(fetchSpy).toHaveBeenCalledTimes(expectedRequestCount);
			} finally {
				fetchSpy.mockRestore();
			}
		},
	);
});

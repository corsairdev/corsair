import { createCorsair } from 'corsair/core';
import { z } from 'zod';
import { nutshell, nutshellEndpointSchemas } from './index';
import type { NutshellOperationKey } from './operations';
import { getNutshellOperation, NUTSHELL_OPERATIONS } from './operations';
import { NUTSHELL_DOCUMENTED_ROUTES } from './routes-fixture';

type JsonSchema = z.core.JSONSchema.JSONSchema;
type SampleSchema = JsonSchema | JsonSchema[] | boolean;
// unknown: handlers are walked out of the bound public tree at runtime, so
// their precise per-operation input/output types cannot be recovered here;
// each call is schema-validated separately before the handler runs.
type Handler = (input: unknown) => Promise<unknown>;
type CapturedRequest = {
	url: URL;
	method: string;
	headers: Headers;
	// unknown: the captured body is whatever the transport serialized for the
	// operation under test (JSON object, array, or none); assertions compare
	// it structurally rather than by a single type.
	body: unknown;
};

function endpointHandlers(tree: object, prefix = ''): Map<string, Handler> {
	return new Map(
		Object.entries(tree).flatMap(([name, value]) => {
			const key = prefix ? `${prefix}.${name}` : name;
			if (typeof value === 'function') {
				// The public endpoint tree is bound to a one-argument handler by
				// createCorsair, even though the plugin implementation takes context.
				return [[key, value as Handler]];
			}
			if (value && typeof value === 'object') {
				return [...endpointHandlers(value, key)];
			}
			return [];
		}),
	);
}

function sample(
	schema: SampleSchema,
	defs: Record<string, JsonSchema>,
	includeOptional = false,
	// unknown: the generator maps arbitrary JSON Schema fragments to fixtures,
	// and JSON Schema can describe values of any shape, so no narrower return
	// type is possible.
): unknown {
	if (typeof schema === 'boolean') return {};
	if (Array.isArray(schema))
		return sample(schema[0] ?? {}, defs, includeOptional);
	if ('$ref' in schema && typeof schema.$ref === 'string') {
		const name = schema.$ref.split('/').at(-1) ?? '';
		return sample(defs[name] ?? {}, defs, includeOptional);
	}
	if ('const' in schema && schema.const !== undefined) return schema.const;
	if ('enum' in schema && Array.isArray(schema.enum))
		return schema.enum.find((value) => value !== null) ?? null;
	if ('allOf' in schema && Array.isArray(schema.allOf)) {
		return Object.assign(
			{},
			...schema.allOf.map((child) => sample(child, defs, includeOptional)),
		);
	}
	const alternatives =
		'anyOf' in schema
			? schema.anyOf
			: 'oneOf' in schema
				? schema.oneOf
				: undefined;
	if (Array.isArray(alternatives)) {
		const candidate =
			alternatives.find(
				(child) =>
					typeof child === 'object' &&
					child !== null &&
					(!('type' in child) || child.type !== 'null'),
			) ?? alternatives[0];
		return sample(candidate ?? {}, defs, includeOptional);
	}
	const types = 'type' in schema ? schema.type : undefined;
	const type = Array.isArray(types)
		? types.find((value) => value !== 'null')
		: types;
	if (type === 'object' || ('properties' in schema && schema.properties)) {
		const properties =
			'properties' in schema &&
			schema.properties &&
			typeof schema.properties === 'object'
				? schema.properties
				: {};
		const required = new Set(
			'required' in schema && Array.isArray(schema.required)
				? schema.required
				: [],
		);
		const object = Object.fromEntries(
			Object.entries(properties).flatMap(([key, child]) => {
				if (!includeOptional && !required.has(key)) return [];
				return [[key, sample(child, defs, false)]];
			}),
		);
		if (Object.keys(object).length > 0) return object;
		if (
			'additionalProperties' in schema &&
			schema.additionalProperties &&
			typeof schema.additionalProperties === 'object'
		) {
			return {
				sample: sample(schema.additionalProperties as SampleSchema, defs),
			};
		}
		return object;
	}
	if (type === 'array') {
		const itemSchema = 'items' in schema ? schema.items : undefined;
		const minItems =
			'minItems' in schema && typeof schema.minItems === 'number'
				? schema.minItems
				: 0;
		// JSON Schema permits tuple-style arrays, while these operation schemas
		// use ordinary item schemas. Selecting the first tuple schema keeps the
		// generated test value representative without relying on Zod internals.
		return Array.from({ length: Math.max(minItems, 1) }, () =>
			sample((itemSchema ?? {}) as SampleSchema, defs),
		);
	}
	if (type === 'string') {
		if ('example' in schema && typeof schema.example === 'string')
			return schema.example;
		if (
			'examples' in schema &&
			Array.isArray(schema.examples) &&
			typeof schema.examples[0] === 'string'
		)
			return schema.examples[0];
		if ('format' in schema && schema.format === 'email')
			return 'owner@example.com';
		if ('format' in schema && schema.format === 'date-time')
			return '2026-01-01T00:00:00Z';
		if ('pattern' in schema && typeof schema.pattern === 'string') {
			const candidate = schema.pattern
				.replace(/^\^/, '')
				.replace(/\$$/, '')
				.replace(
					/\(([^()]+)\)/g,
					(_match, alternatives: string) => alternatives.split('|')[0] ?? '',
				)
				.replace(/\[0-9\]\+/g, '1')
				.replace(/\\d\+/g, '1');
			if (new RegExp(schema.pattern).test(candidate)) return candidate;
		}
		return 'sample';
	}
	if (type === 'integer' || type === 'number') return 1;
	if (type === 'boolean') return true;
	return {};
}

function sampleForOperationSchema(
	schema: z.ZodType,
	includeOptional = false,
	io: 'input' | 'output' = 'input',
	// unknown: the fixture mirrors whatever the operation's JSON Schema allows;
	// callers validate it against the same schema before use.
): unknown {
	// Zod 4 emits its generic JSON Schema contract for test data generation.
	const json = z.toJSONSchema(schema, {
		io,
		unrepresentable: 'any',
	}) as JsonSchema;
	const defs =
		'$defs' in json && json.$defs && typeof json.$defs === 'object'
			? json.$defs
			: {};
	return sample(json, defs, includeOptional);
}

const corsair = createCorsair({
	plugins: [nutshell({ key: 'owner@example.com:api-key' })],
});
// Corsair's database/API result is a union; this assertion selects the API
// branch because the test invokes the public HTTP endpoints only.
const publicApi = (corsair.nutshell as unknown as { api: object }).api;
const handlers = endpointHandlers(publicApi);

describe('Nutshell REST endpoint contract', () => {
	// No test here may reach the network: a call that a test did not mock
	// throws instead of going to Nutshell.
	beforeEach(() => {
		jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
			throw new Error(`unmocked fetch: ${String(url)}`);
		});
	});

	it('matches the checked-in official route inventory', () => {
		const catalog = Object.fromEntries(
			NUTSHELL_OPERATIONS.map(({ key, method, path }) => [
				key,
				`${method} ${path}`,
			]),
		);
		expect(catalog).toEqual(NUTSHELL_DOCUMENTED_ROUTES);
		expect(NUTSHELL_OPERATIONS).toHaveLength(114);
		expect(handlers.size).toBe(114);
		expect([...handlers.keys()].sort()).toEqual(
			Object.keys(NUTSHELL_DOCUMENTED_ROUTES).sort(),
		);
	});

	it.each(Object.entries(NUTSHELL_DOCUMENTED_ROUTES))(
		'%s sends its documented request',
		async (key) => {
			// The separate checked-in route manifest is keyed by valid operation IDs.
			const operation = getNutshellOperation(key as NutshellOperationKey);
			const schema = nutshellEndpointSchemas[key as NutshellOperationKey];
			const input = sampleForOperationSchema(schema.input, true);
			const parsed = schema.input.safeParse(input);
			expect(parsed.success).toBe(true);

			const captures: CapturedRequest[] = [];
			const mockFetch = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async (url, init) => {
					captures.push({
						url: new URL(String(url)),
						method: init?.method ?? 'GET',
						headers: new Headers(init?.headers),
						body: init?.body,
					});
					const responseSchema = schema.output;
					const response = sampleForOperationSchema(
						responseSchema,
						false,
						'output',
					);
					if (operation.responseEncoding === 'text') {
						return new Response('csv-data', {
							status: 200,
							headers: { 'content-type': 'text/csv' },
						});
					}
					return new Response(
						operation.hasResponseBody ? JSON.stringify(response) : null,
						{
							status: operation.hasResponseBody ? 200 : 204,
							headers: {
								'content-type':
									operation.responseEncoding === 'json-from-text'
										? 'application/schema+json'
										: 'application/json',
							},
						},
					);
				});

			try {
				const handler = handlers.get(operation.key);
				expect(handler).toBeDefined();
				const result = await handler?.(input);
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(captures).toHaveLength(1);
				const request = captures[0];
				if (!request)
					throw new Error(`No request captured for ${operation.key}`);
				expect(request.method).toBe(operation.method);
				expect(request.url.pathname).toBe(
					`/rest${operation.path.replace(/\{([^}]+)\}/g, 'sample')}`,
				);
				expect(request.headers.get('authorization')).toBe(
					`Basic ${Buffer.from('owner@example.com:api-key').toString('base64')}`,
				);

				// The operation input schema was parsed above as an object.
				const inputRecord = input as Record<string, unknown>;
				for (const name of operation.queryParams) {
					if (inputRecord[name] !== undefined) {
						const encodedNames = [...request.url.searchParams.keys()];
						expect(
							encodedNames.some(
								(encoded) => encoded === name || encoded.startsWith(`${name}[`),
							),
						).toBe(true);
					}
				}
				if (operation.hasBody) {
					expect(request.body).toBeDefined();
					expect(JSON.parse(String(request.body))).toEqual(inputRecord.body);
					if (operation.mediaType)
						expect(request.headers.get('content-type')).toContain(
							operation.mediaType,
						);
				} else {
					expect(request.body).toBeUndefined();
				}
				expect(schema.output.safeParse(result).success).toBe(true);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	it.each(
		NUTSHELL_OPERATIONS.filter(
			(operation) => operation.pathParams.length > 0 || operation.bodyRequired,
		),
	)(
		'%s rejects missing required path/body values before sending a request',
		async (operation) => {
			const schema = nutshellEndpointSchemas[operation.key];
			const input = sampleForOperationSchema(schema.input);
			// The schema-generated sample is an object; omit required fields without mutating it.
			const record = input as Record<string, unknown>;
			const missing = new Set([
				...operation.pathParams,
				...(operation.bodyRequired ? ['body'] : []),
			]);
			const invalidInput = Object.fromEntries(
				Object.entries(record).filter(([name]) => !missing.has(name)),
			);
			expect(schema.input.safeParse(invalidInput).success).toBe(false);

			// Prove the rejection happens at the public boundary: the bound
			// handler must throw before any HTTP request is attempted.
			const fetchSpy = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async () => {
					throw new Error(
						`fetch must not be called for invalid ${operation.key} input`,
					);
				});
			try {
				const handler = handlers.get(operation.key);
				expect(handler).toBeDefined();
				await expect(handler?.(invalidInput)).rejects.toThrow();
				expect(fetchSpy).not.toHaveBeenCalled();
			} finally {
				fetchSpy.mockRestore();
			}
		},
	);
});

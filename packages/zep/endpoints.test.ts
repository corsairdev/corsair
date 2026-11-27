import { ApiError } from 'corsair/http';
import {
	baseUrlOf,
	withoutRequestData,
	ZEP_API_BASE,
	zepErrorMessage,
} from './client';
import { zepEndpointsNested } from './endpoints/catalog';
import { zepDefinitions, zepOperations } from './endpoints/manifest';
import { queryValue } from './endpoints/operations';
import type { ZepContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string, a FormData or a Blob.
	body: unknown;
};

let calls: Captured[] = [];

function reply(
	status: number,
	// `unknown` because each case answers its own JSON body.
	body: unknown,
	contentType = 'application/json',
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const payload =
			body instanceof Uint8Array
				? body
				: body === undefined
					? null
					: typeof body === 'string' && contentType !== 'application/json'
						? body
						: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: body === undefined ? {} : { 'content-type': contentType },
		});
	});
}

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

const KEY = 'z_test_key';

function ctx(options: Record<string, string> = {}): ZepContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: KEY,
		options,
		keys: { get_api_key: () => Promise.resolve(KEY) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as ZepContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: ZepContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = zepEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

// `unknown` because the schema is raw JSON Schema from the manifest.
function resolveSchema(schema: unknown): Record<string, unknown> {
	let current = schema as Record<string, unknown> | undefined;
	for (let i = 0; i < 10 && typeof current?.$ref === 'string'; i++) {
		current = zepDefinitions[current.$ref];
	}
	return current ?? {};
}

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('every operation', () => {
	it.each(zepOperations.map((o) => [o.id, o] as const))(
		'%s sends its documented method, route and auth',
		async (id, operation) => {
			const output = resolveSchema(operation.output);
			if (operation.response === 'file') {
				reply(200, new Uint8Array([80, 75, 3, 4]), 'application/octet-stream');
			} else if (operation.response === 'text') {
				reply(200, '# profile', 'text/markdown');
			} else if (operation.response === 'empty') {
				reply(204, undefined);
			} else {
				reply(
					200,
					output.type === 'array'
						? []
						: output.type === 'string'
							? 'ok'
							: output.type === 'integer' || output.type === 'number'
								? 1
								: output.type === 'boolean'
									? true
									: {},
				);
			}
			const args = docs.apiExamples[id]?.args ?? {};
			const result = await endpointFor(id)(ctx(), args);
			expect(calls).toHaveLength(1);
			if (operation.response === 'empty') {
				expect(result).toEqual({ success: true });
			}
			const url = new URL(String(calls[0]?.url));
			const base = new URL(ZEP_API_BASE);
			const properties = (operation.input.properties ?? {}) as Record<
				string,
				// `unknown` because property schemas are raw JSON Schema documents.
				Record<string, unknown>
			>;
			const byWire = new Map(
				Object.entries(properties).map(([name, schema]) => [
					(schema['x-corsair-name'] as string | undefined) ?? name,
					name,
				]),
			);
			const route = operation.path.replace(/\{(\w+)\}/g, (_, wire: string) =>
				encodeURIComponent(String(args[byWire.get(wire) ?? wire])),
			);
			expect(url.host).toBe(base.host);
			expect(decodeURIComponent(url.pathname)).toBe(
				decodeURIComponent(`${base.pathname.replace(/\/$/, '')}${route}`),
			);
			expect(calls[0]?.method).toBe(operation.method);
			expect(calls[0]?.headers['authorization']).toBe(`Api-Key ${KEY}`);
			if (operation.request === 'json' && !operation.bodyField) {
				const body = JSON.parse(String(calls[0]?.body ?? '{}'));
				for (const [name, value] of Object.entries(args)) {
					const where = properties[name]?.['x-corsair-in'] ?? 'body';
					const wire =
						(properties[name]?.['x-corsair-name'] as string | undefined) ??
						name;
					if (where === 'body') {
						// Every body field of the example goes out as sent.
						expect([wire, body[wire]]).toEqual([wire, value]);
					} else {
						expect(body).not.toHaveProperty(name);
					}
				}
			}
			if (operation.request === 'json' && operation.bodyField) {
				const body = JSON.parse(String(calls[0]?.body ?? 'null'));
				expect(body).toEqual(args[operation.bodyField]);
			}
			if (operation.request === 'multipart') {
				expect(calls[0]?.body).toBeInstanceOf(FormData);
			}
			// Every query field of the example reaches the URL.
			for (const [name, value] of Object.entries(args)) {
				if (properties[name]?.['x-corsair-in'] !== 'query') continue;
				const wire =
					(properties[name]?.['x-corsair-name'] as string | undefined) ?? name;
				const join = properties[name]?.['x-corsair-join'] as string | undefined;
				const sent = queryValue(value, join);
				expect([wire, url.searchParams.getAll(wire)]).toEqual([
					wire,
					(Array.isArray(sent) ? sent : [sent]).map(String),
				]);
			}
		},
	);
});

describe('requests', () => {
	it('encodes path values so they stay one segment', async () => {
		// A GET whose path field takes free text (no pattern or format).
		let found: [string, string] | undefined;
		for (const o of zepOperations) {
			if (o.method !== 'GET') continue;
			const free = Object.entries(
				(o.input.properties ?? {}) as Record<
					string,
					// `unknown` because property schemas are raw JSON Schema documents.
					Record<string, unknown>
				>,
			).find(
				([, schema]) =>
					schema['x-corsair-in'] === 'path' &&
					schema.type === 'string' &&
					!schema.pattern &&
					!schema.format &&
					!schema.enum,
			);
			if (free) {
				found = [o.id, free[0]];
				break;
			}
		}
		if (!found) return;
		const [id, field] = found;
		reply(200, {});
		const args = { ...(docs.apiExamples[id]?.args ?? {}) };
		args[field] = 'a/../b c';
		await endpointFor(id)(ctx(), args).catch(() => undefined);
		expect(calls[0]?.url).toContain('a%2F..%2Fb%20c');
	});

	it('uses the baseUrl option for a self-hosted server or proxy', async () => {
		expect(baseUrlOf({ key: KEY, options: {} })).toBe(ZEP_API_BASE);
		expect(
			baseUrlOf({
				key: KEY,
				options: { baseUrl: 'https://proxy.example.com/' },
			}),
		).toBe('https://proxy.example.com');
		expect(() =>
			baseUrlOf({ key: KEY, options: { baseUrl: 'file:///etc/passwd' } }),
		).toThrow('http(s)');
	});

	it('rejects bad input before sending anything', async () => {
		const operation = zepOperations.find(
			(o) => (o.input.required as string[] | undefined)?.length,
		);
		if (!operation) return;
		reply(200, {});
		await expect(endpointFor(operation.id)(ctx(), {})).rejects.toThrow(
			/Invalid input/,
		);
		expect(calls).toHaveLength(0);
	});
});

describe('responses', () => {
	it('refuses a JSON route that answers something other than JSON', async () => {
		const operation = zepOperations.find(
			(o) => o.response === 'json' && o.emptyOk,
		);
		if (!operation) return;
		reply(200, '<html>proxy</html>', 'text/html');
		await expect(
			endpointFor(operation.id)(
				ctx(),
				docs.apiExamples[operation.id]?.args ?? {},
			),
		).rejects.toThrow(/not JSON/);
	});

	it('refuses an object route that answers a list', async () => {
		const operation = zepOperations.find(
			(o) =>
				o.response === 'json' &&
				!o.emptyOk &&
				resolveSchema(o.output).type === 'object',
		);
		if (!operation) return;
		reply(200, [1, 2]);
		await expect(
			endpointFor(operation.id)(
				ctx(),
				docs.apiExamples[operation.id]?.args ?? {},
			),
		).rejects.toThrow(/did not match its documented schema/);
	});
});

describe('errors', () => {
	it('keeps the status and reason and drops the request data', async () => {
		const operation = zepOperations.find((o) => o.request === 'json');
		if (!operation) return;
		reply(400, { message: 'bad thing', input: 'echoed secret' });
		const error = await endpointFor(operation.id)(
			ctx(),
			docs.apiExamples[operation.id]?.args ?? {},
		).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const api = error as ApiError;
		expect(api.status).toBe(400);
		expect(api.message).toBe('Zep 400: bad thing');
		expect(JSON.stringify(api.body)).not.toContain('echoed secret');
		expect(api.request.headers).toBeUndefined();
		expect(JSON.stringify(api.request)).not.toContain(KEY);
	});

	it('scrubs sent strings and the key from the error body', () => {
		const error = new ApiError(
			{
				method: 'POST',
				url: '/things/{id}',
				path: { id: 'thing-42' },
				body: { content: 'my private memory about Ada' },
			},
			{
				url: `${ZEP_API_BASE}/things/thing-42`,
				ok: false,
				status: 422,
				statusText: 'Unprocessable',
				body: {
					detail: `bad content my private memory about Ada for thing-42 with ${KEY}`,
				},
			},
			'x',
		);
		const clean = withoutRequestData(error, KEY);
		const text = JSON.stringify(clean.body);
		expect(text).not.toContain('my private memory');
		expect(text).not.toContain('thing-42');
		expect(text).not.toContain(KEY);
		expect(clean.url).toBe(`${ZEP_API_BASE}/things/{id}`);
		expect(clean.status).toBe(422);
	});

	it('reads the common error body shapes', () => {
		expect(zepErrorMessage(404, 'Not Found', { message: 'gone' })).toBe(
			'Zep 404: gone',
		);
		expect(zepErrorMessage(400, 'Bad', { error: 'nope' })).toBe(
			'Zep 400: nope',
		);
		expect(zepErrorMessage(400, 'Bad', { error: { message: 'nested' } })).toBe(
			'Zep 400: nested',
		);
		expect(
			zepErrorMessage(422, 'Bad', {
				detail: [{ loc: ['body', 'name'], msg: 'field required' }],
			}),
		).toBe('Zep 422: name: field required');
		expect(zepErrorMessage(502, 'Bad Gateway', '<html></html>')).toBe(
			'Zep 502: Bad Gateway',
		);
	});
});

import { ApiError } from 'corsair/http';
import {
	baseFor,
	baseUrlOf,
	CHARGEBEE_API_BASE,
	chargebeeApiBase,
	chargebeeErrorMessage,
	makeChargebeeRequest,
	retryAfterMs,
	withoutRequestData,
} from './client';
import { chargebeeEndpointsNested } from './endpoints/catalog';
import {
	chargebeeDefinitions,
	chargebeeOperations,
} from './endpoints/manifest';
import { customerMapKeys } from './endpoints/openapi-schema';
import {
	chargebeeForm,
	freeFormFields,
	queryValue,
	withStringOffsets,
} from './endpoints/operations';
import type { ChargebeeContext } from './index';

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

const KEY = 'test_cb_key';

function ctx(options: Record<string, string> = {}): ChargebeeContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: KEY,
		options,
		keys: {
			get_api_key: () => Promise.resolve(KEY),
			get_site: () => Promise.resolve('acme-test'),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as ChargebeeContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: ChargebeeContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = chargebeeEndpointsNested;
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
		current = chargebeeDefinitions[current.$ref];
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
	it.each(chargebeeOperations.map((o) => [o.id, o] as const))(
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
			const base = new URL(chargebeeApiBase('acme-test'));
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
			const route = operation.path.replace(/\{([\w-]+)\}/g, (_, wire: string) =>
				encodeURIComponent(String(args[byWire.get(wire) ?? wire])),
			);
			expect(url.host).toBe(base.host);
			expect(decodeURIComponent(url.pathname)).toBe(
				decodeURIComponent(`${base.pathname.replace(/\/$/, '')}${route}`),
			);
			expect(calls[0]?.method).toBe(operation.method);
			expect(calls[0]?.headers['authorization']).toBe(
				`Basic ${btoa(`${KEY}:`)}`,
			);
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
				// Maps go out as name[key]=value; vendor tests check those.
				if (
					typeof value === 'object' &&
					value !== null &&
					!Array.isArray(value)
				)
					continue;
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
		for (const o of chargebeeOperations) {
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
		expect(baseUrlOf({ key: KEY, options: {} }, 'acme-test')).toBe(
			'https://acme-test.chargebee.com/api/v2',
		);
		expect(chargebeeApiBase('Acme.chargebee.com')).toBe(
			'https://acme.chargebee.com/api/v2',
		);
		expect(() => chargebeeApiBase('evil.com/x')).toThrow('site name only');
		// No site anywhere: core asks the tenant to connect.
		expect(() => baseUrlOf({ key: KEY, options: {} })).toThrow();
		expect(
			baseUrlOf({
				key: KEY,
				options: { baseUrl: 'https://proxy.example.com/' },
			}),
		).toBe('https://proxy.example.com');
		expect(() =>
			baseUrlOf({ key: KEY, options: { baseUrl: 'file:///etc/passwd' } }),
		).toThrow('https URL');
		// The key goes in a header: never over plain http to another host.
		expect(() =>
			baseUrlOf({ key: KEY, options: { baseUrl: 'http://proxy.example.com' } }),
		).toThrow('https URL');
		expect(
			baseUrlOf({ key: KEY, options: { baseUrl: 'http://localhost:8283/' } }),
		).toBe('http://localhost:8283');
	});

	it('skips the stored site when a baseUrl is set', async () => {
		const getSite = jest.fn(() => Promise.reject(new Error('store down')));
		await expect(
			baseFor({
				key: KEY,
				options: { baseUrl: 'https://proxy.example.com' },
				keys: { get_site: getSite },
			}),
		).resolves.toBe('https://proxy.example.com');
		expect(getSite).not.toHaveBeenCalled();
	});

	it('sends a multi-value list filter in its bracketed form', async () => {
		reply(200, { list: [] });
		await endpointFor('invoices.list')(ctx(), {
			status: { in: '[paid,posted]' },
		});
		expect(decodeURIComponent(String(calls[0]?.url))).toContain(
			'status[in]=[paid,posted]',
		);
		await expect(
			endpointFor('invoices.list')(ctx(), { status: { in: '[paid,nope]' } }),
		).rejects.toThrow();
	});

	it('reads Retry-After as seconds or an HTTP date', () => {
		const now = Date.parse('2026-11-28T10:00:00Z');
		expect(retryAfterMs('7', now)).toBe(7000);
		expect(retryAfterMs('Sat, 28 Nov 2026 10:00:05 GMT', now)).toBe(5000);
		expect(retryAfterMs('Sat, 28 Nov 2026 09:00:00 GMT', now)).toBe(0);
		expect(retryAfterMs('soon', now)).toBeUndefined();
		expect(retryAfterMs(null, now)).toBeUndefined();
	});

	it('reads the site from the plugin option before the stored field', async () => {
		reply(200, { list: [] });
		await endpointFor('customers.list')(ctx({ site: 'other-test' }), {});
		expect(String(calls[0]?.url)).toContain(
			'https://other-test.chargebee.com/api/v2/',
		);
	});

	it('form-encodes nested fields the Chargebee way', () => {
		const form = chargebeeForm(
			{
				first_name: 'Ada',
				auto_collection: 'off',
				consolidated_invoicing: false,
				billing_address: { city: 'Pune', line1: '1 Main St' },
				coupon_ids: ['A10', 'B20'],
				subscription_items: {
					item_price_id: ['plan-USD', 'addon-USD'],
					quantity: [1, 3],
				},
				meta_data: { team: 'ops', seats: 3 },
				vat_number: null,
			},
			new Set(['meta_data']),
		);
		expect([...form.entries()]).toEqual([
			['first_name', 'Ada'],
			['auto_collection', 'off'],
			['consolidated_invoicing', 'false'],
			['billing_address[city]', 'Pune'],
			['billing_address[line1]', '1 Main St'],
			['coupon_ids[0]', 'A10'],
			['coupon_ids[1]', 'B20'],
			['subscription_items[item_price_id][0]', 'plan-USD'],
			['subscription_items[item_price_id][1]', 'addon-USD'],
			['subscription_items[quantity][0]', '1'],
			['subscription_items[quantity][1]', '3'],
			['meta_data', '{"team":"ops","seats":3}'],
		]);
	});

	it('finds the free-form JSON fields from the schema', () => {
		expect(
			freeFormFields({
				properties: {
					meta_data: { type: 'object' },
					billing_address: {
						type: 'object',
						properties: { city: { type: 'string' } },
					},
					limit: { type: 'integer', 'x-corsair-in': 'query' },
				},
			}),
		).toEqual(new Set(['meta_data']));
	});

	it('rejects bad input before sending anything', async () => {
		const operation = chargebeeOperations.find(
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
		const operation = chargebeeOperations.find(
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

	it('turns an array or number next_offset into the string offset takes', async () => {
		expect(
			withStringOffsets({ list: [], next_offset: ['1795842313000', '74209'] }),
		).toEqual({ list: [], next_offset: '["1795842313000","74209"]' });
		expect(withStringOffsets({ list: [], next_offset: 3 })).toEqual({
			list: [],
			next_offset: '3',
		});
		const plain = { list: [], next_offset: 'abc' };
		expect(withStringOffsets(plain)).toBe(plain);

		reply(200, { list: [], next_offset: ['1795842313000', '74209'] });
		const page = (await endpointFor('customers.list')(ctx(), {
			limit: 1,
		})) as { next_offset?: string };
		expect(page.next_offset).toBe('["1795842313000","74209"]');
		// The string goes back as offset unchanged.
		reply(200, { list: [] });
		await endpointFor('customers.list')(ctx(), {
			limit: 1,
			offset: page.next_offset,
		});
		expect(new URL(String(calls.at(-1)?.url)).searchParams.get('offset')).toBe(
			'["1795842313000","74209"]',
		);
		reply(200, { list: [], next_offset: 1 });
		const items = (await endpointFor('items.list')(ctx(), {})) as {
			next_offset?: string;
		};
		expect(items.next_offset).toBe('1');
		reply(200, { list: [] });
		await endpointFor('items.list')(ctx(), { offset: items.next_offset });
		expect(new URL(String(calls.at(-1)?.url)).searchParams.get('offset')).toBe(
			'1',
		);
	});

	it('takes the empty 202 of an async email send', async () => {
		reply(202, undefined);
		await expect(
			endpointFor('invoices.sendEmail')(ctx(), {
				invoiceId: 'inv_1',
				prefer: 'respond-async',
			}),
		).resolves.toEqual({ success: true });
	});

	it('refuses an object route that answers a list', async () => {
		const operation = chargebeeOperations.find(
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
		const operation = chargebeeOperations.find((o) => o.request === 'json');
		if (!operation) return;
		reply(400, { message: 'bad thing', input: 'echoed secret' });
		const error = await endpointFor(operation.id)(
			ctx(),
			docs.apiExamples[operation.id]?.args ?? {},
		).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const api = error as ApiError;
		expect(api.status).toBe(400);
		expect(api.message).toBe('Chargebee 400: bad thing');
		expect(JSON.stringify(api.body)).not.toContain('echoed secret');
		expect(api.request.headers).toBeUndefined();
		expect(JSON.stringify(api.request)).not.toContain(KEY);
	});

	it('scrubs values sent in a form body', () => {
		const error = new ApiError(
			{
				method: 'POST',
				url: '/customers',
				body: new URLSearchParams({
					email: 'ada@example.test',
					company: 'Acme Labs',
				}),
			},
			{
				url: `${CHARGEBEE_API_BASE}/customers`,
				ok: false,
				status: 400,
				// A proxy that writes the request into its reason phrase.
				statusText: 'Rejected ada@example.test',
				body: { message: 'Invalid email ada@example.test for Acme Labs' },
			},
			'x',
		);
		const clean = withoutRequestData(error, KEY);
		const text = JSON.stringify(clean.body);
		expect(text).not.toContain('ada@example.test');
		expect(text).not.toContain('Acme Labs');
		expect(clean.statusText).not.toContain('ada@example.test');
		expect(clean.statusText).toContain('Rejected');
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
				url: `${CHARGEBEE_API_BASE}/things/thing-42`,
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
		expect(clean.url).toBe(`${CHARGEBEE_API_BASE}/things/{id}`);
		expect(clean.status).toBe(422);
	});

	it('scrubs file names and map keys the caller chose', () => {
		const form = new FormData();
		form.append('note', 'quarterly plan');
		form.append(
			'file',
			new File([new Uint8Array([1])], 'alice@example.test.pdf'),
		);
		const error = new ApiError(
			{ method: 'POST', url: '/upload', formData: undefined, body: form },
			{
				url: `${CHARGEBEE_API_BASE}/upload`,
				ok: false,
				status: 400,
				statusText: 'Bad',
				body: {
					message:
						'alice@example.test.pdf rejected; key bob@example.test unknown; quarterly plan',
				},
			},
			'x',
		);
		const clean = withoutRequestData(error, KEY, CHARGEBEE_API_BASE, [
			'bob@example.test',
		]);
		expect(clean.message).not.toContain('alice@example.test');
		expect(clean.message).not.toContain('bob@example.test');
		expect(clean.message).not.toContain('quarterly plan');
	});

	it('finds the keys a caller chose inside map fields', () => {
		const schema = {
			type: 'object',
			properties: {
				name: { type: 'string' },
				metadata: { type: 'object', additionalProperties: { type: 'string' } },
			},
		};
		expect(
			customerMapKeys(schema, {
				name: 'x',
				metadata: { 'carol@example.test': 'y' },
			}),
		).toEqual(['carol@example.test']);
		// A key 12 levels down in free-form metadata is still found.
		const free = {
			type: 'object',
			properties: { meta: { type: 'object', additionalProperties: {} } },
		};
		let deep: Record<string, unknown> = { 'dave@example.test': 1 };
		for (let i = 0; i < 11; i++) deep = { [`k${i}`]: deep };
		expect(customerMapKeys(free, { meta: deep })).toContain(
			'dave@example.test',
		);
	});

	it('sends a single-attempt request once, even on a 429', async () => {
		reply(429, { message: 'daily limit reached' });
		const error = await makeChargebeeRequest(
			{ key: 'k', options: { site: 'acme-test' } },
			{ method: 'GET', path: '/single-attempt', singleAttempt: true },
		).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(429);
		expect(calls).toHaveLength(1);
	});

	it('marks every single-attempt route in the manifest', async () => {
		const operation = chargebeeOperations.find((o) => o.singleAttempt);
		if (!operation) return;
		reply(429, { message: 'daily limit reached' });
		const error = await endpointFor(operation.id)(
			ctx(),
			docs.apiExamples[operation.id]?.args ?? {},
		).catch((e: unknown) => e);
		expect((error as ApiError).status).toBe(429);
		expect(calls).toHaveLength(1);
	});

	it('refuses an HTML page on a text route', async () => {
		const operation = chargebeeOperations.find((o) => o.response === 'text');
		if (!operation) return;
		reply(200, '<html>login</html>', 'text/html');
		await expect(
			endpointFor(operation.id)(
				ctx(),
				docs.apiExamples[operation.id]?.args ?? {},
			),
		).rejects.toThrow(/not text/);
	});

	it('reads the common error body shapes', () => {
		expect(chargebeeErrorMessage(404, 'Not Found', { message: 'gone' })).toBe(
			'Chargebee 404: gone',
		);
		expect(chargebeeErrorMessage(400, 'Bad', { error: 'nope' })).toBe(
			'Chargebee 400: nope',
		);
		expect(
			chargebeeErrorMessage(400, 'Bad', { error: { message: 'nested' } }),
		).toBe('Chargebee 400: nested');
		expect(
			chargebeeErrorMessage(422, 'Bad', {
				detail: [{ loc: ['body', 'name'], msg: 'field required' }],
			}),
		).toBe('Chargebee 422: name: field required');
		// Chargebee: the error code and the field it concerns lead the message.
		expect(
			chargebeeErrorMessage(400, 'Bad Request', {
				message: 'email : invalid email',
				type: 'invalid_request',
				api_error_code: 'param_wrong_value',
				param: 'email',
				http_status_code: 400,
			}),
		).toBe('Chargebee 400: param_wrong_value (email): email : invalid email');
		expect(chargebeeErrorMessage(502, 'Bad Gateway', '<html></html>')).toBe(
			'Chargebee 502: Bad Gateway',
		);
	});
});

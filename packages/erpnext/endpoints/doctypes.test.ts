import { createCorsair } from 'corsair/core';
import { erpnext, erpnextEndpointSchemas } from '../index';
import type { ErpnextOperationKey } from '../operations';
import { ERPNEXT_OPERATIONS } from '../operations';

const BASE_URL = 'https://test.example.com';
const AUTH_HEADER = 'token test-key:test-secret';

// The doctypes family under test; the dotted keys look up the shared schema
// registry and the bound public tree.
type DoctypesOperationKey = Extract<ErpnextOperationKey, `doctypes.${string}`>;

const DOCTYPES_OPERATIONS = ERPNEXT_OPERATIONS.filter(
	(
		operation,
	): operation is (typeof ERPNEXT_OPERATIONS)[number] & {
		key: DoctypesOperationKey;
	} => operation.key.startsWith('doctypes.'),
);

const DOCTYPES_ACTIONS = ['list', 'getMeta'] as const;

type Handler = (
	// unknown: handlers are walked out of the bound public tree at runtime, so
	// their precise per-operation input/output types cannot be recovered here;
	// each call is schema-validated separately before the handler runs.
	input: unknown,
) => Promise<unknown>;

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
				return [[key, value as Handler]];
			}
			if (value && typeof value === 'object') {
				return [...endpointHandlers(value, key)];
			}
			return [];
		}),
	);
}

const corsair = createCorsair({
	plugins: [erpnext({ key: 'test-key:test-secret', baseUrl: BASE_URL })],
	// No database in API-only tests; the config type requires a KEK and the
	// runtime only uses it alongside a database for envelope encryption.
	kek: 'test-kek',
});
// Corsair's database/API result is a union; this assertion selects the API
// branch because the test invokes the public HTTP endpoints only.
// unknown: the bound client exposes the plugin namespaces only at runtime.
const publicApi = (corsair.erpnext as unknown as { api: object }).api;
const handlers = endpointHandlers(publicApi);

// Spec-derived input fixtures: the minimal valid request each Frappe source
// signature shows. Written by hand so a mistaken schema can never bend the
// fixture into passing itself.
const INPUT_FIXTURES: Record<DoctypesOperationKey, unknown> = {
	'doctypes.list': {
		filters: '[["module","=","Core"]]',
		limit_start: 0,
		limit_page_length: 10,
	},
	'doctypes.getMeta': {
		doctype: 'Customer',
		with_parent: true,
	},
};

// Spec-derived response fixtures: the envelope the Frappe sources return.
// /api/resource list answers nest the rows under `data`; every /api/method
// answer nests the result under `message` (frappe/handler.py).
const RESPONSE_FIXTURES: Record<DoctypesOperationKey, unknown> = {
	'doctypes.list': {
		data: [{ name: 'Customer' }, { name: 'Sales Order' }],
	},
	// frappe/desk/form/load.py getdoctype answers { meta, docs } under the
	// message wrapper.
	'doctypes.getMeta': {
		message: {
			meta: {
				name: 'Customer',
				module: 'Selling',
				fields: [{ fieldname: 'customer_name', fieldtype: 'Data' }],
			},
			docs: [{ doctype: 'DocType', name: 'Customer' }],
		},
	},
};

// Independently written expected requests, transcribed by hand from the
// Frappe wire contract (the /api/resource/DocType list route and the
// frappe.desk.form.load.getdoctype method) and paired with the hand-written
// INPUT_FIXTURES above. They are deliberately NOT derived from
// ERPNEXT_OPERATIONS: a wrong catalog entry must change the wire request
// without also rewriting the expectation, or the test could never catch it.
type ExpectedRequest = {
	method: 'GET';
	url: string;
	query?: Record<string, string>;
	authHeader: string;
};

const EXPECTED_REQUESTS: Record<DoctypesOperationKey, ExpectedRequest> = {
	'doctypes.list': {
		method: 'GET',
		url: 'https://test.example.com/api/resource/DocType',
		query: {
			filters: '[["module","=","Core"]]',
			limit_start: '0',
			limit_page_length: '10',
		},
		authHeader: AUTH_HEADER,
	},
	'doctypes.getMeta': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.desk.form.load.getdoctype',
		query: {
			doctype: 'Customer',
			// Boolean query values reach Frappe as strings; the provider reads
			// with_parent with Python truthiness (load.py `if with_parent`),
			// so the factory sends a true as "1".
			with_parent: '1',
		},
		authHeader: AUTH_HEADER,
	},
};

describe('ERPNext doctypes endpoint contract', () => {
	it('binds exactly the 2 documented doctypes handlers', () => {
		expect(DOCTYPES_OPERATIONS).toHaveLength(2);
		expect(DOCTYPES_OPERATIONS.map(({ key }) => key).sort()).toEqual(
			DOCTYPES_ACTIONS.map((action) => `doctypes.${action}`).sort(),
		);
		// The bound public tree exposes exactly the documented action keys;
		// these define the dotted operation ids with the `doctypes` prefix.
		// unknown: the bound tree is walked by group name at runtime; the
		// doctypes group must exist once the family is registered.
		const doctypesApi = (publicApi as Record<string, unknown>).doctypes;
		expect(doctypesApi).toBeDefined();
		expect(Object.keys(doctypesApi as object).sort()).toEqual(
			[...DOCTYPES_ACTIONS].sort(),
		);
		// And the bound public tree carries one schema-wrapped handler per action.
		expect([...endpointHandlers(doctypesApi as object).keys()].sort()).toEqual(
			[...DOCTYPES_ACTIONS].sort(),
		);
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const operationKey = key as DoctypesOperationKey;
			const expected = EXPECTED_REQUESTS[operationKey];
			const schema = erpnextEndpointSchemas[operationKey];
			const input = INPUT_FIXTURES[operationKey];
			const response = RESPONSE_FIXTURES[operationKey];

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
					return new Response(JSON.stringify(response), {
						status: 200,
						headers: { 'content-type': 'application/json' },
					});
				});

			try {
				const expectedUrl = new URL(expected.url);
				// The registry schema must accept the fixture at the boundary.
				const parsedInput = schema.input.parse(input);
				const handler = handlers.get(operationKey);
				expect(handler).toBeDefined();
				const result = await handler?.(parsedInput);
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(captures).toHaveLength(1);
				const request = captures[0];
				if (!request) {
					throw new Error(`No request captured for ${operationKey}`);
				}
				expect(request.method).toBe(expected.method);
				expect(request.url.origin).toBe(expectedUrl.origin);
				expect(request.url.pathname).toBe(expectedUrl.pathname);
				expect(request.headers.get('authorization')).toBe(expected.authHeader);
				expect(Object.fromEntries(request.url.searchParams)).toEqual(
					expected.query ?? {},
				);
				// Every doctypes operation is a GET without a request body.
				expect(request.body).toBeUndefined();

				expect(schema.output.safeParse(result).success).toBe(true);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	// A false with_parent must ride the provider default: load.py reads the
	// query string with Python truthiness, where a "false" string would load
	// the parents the caller asked to leave out. The factory therefore omits
	// the key entirely, and the wire request carries only the doctype.
	it('omits a false with_parent from the query before sending a request', async () => {
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
				return new Response(
					JSON.stringify(RESPONSE_FIXTURES['doctypes.getMeta']),
					{
						status: 200,
						headers: { 'content-type': 'application/json' },
					},
				);
			});
		try {
			const handler = handlers.get('doctypes.getMeta');
			expect(handler).toBeDefined();
			const result = await handler?.({
				doctype: 'Customer',
				with_parent: false,
			});
			expect(mockFetch).toHaveBeenCalledTimes(1);
			const request = captures[0];
			if (!request) {
				throw new Error('No request captured');
			}
			expect(Object.fromEntries(request.url.searchParams)).toEqual({
				doctype: 'Customer',
			});
			expect(
				erpnextEndpointSchemas['doctypes.getMeta'].output.safeParse(result)
					.success,
			).toBe(true);
		} finally {
			mockFetch.mockRestore();
		}
	});

	// getMeta needs the doctype; both schemas are strict, so unknown keys are
	// rejected before the handler touches fetch.
	it.each([
		{
			key: 'doctypes.getMeta' as DoctypesOperationKey,
			name: 'a query without doctype',
			input: { with_parent: true },
		},
		{
			key: 'doctypes.getMeta' as DoctypesOperationKey,
			name: 'a non-boolean with_parent',
			input: { doctype: 'Customer', with_parent: 'yes' },
		},
		{
			key: 'doctypes.list' as DoctypesOperationKey,
			name: 'an unknown query key',
			input: { fields: '["name"]' },
		},
		{
			key: 'doctypes.list' as DoctypesOperationKey,
			name: 'a negative limit_page_length',
			input: { limit_page_length: -1 },
		},
	])(
		'rejects $key with $name before sending a request',
		async ({ key, input }) => {
			const fetchSpy = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async () => {
					throw new Error(`fetch must not be called for invalid ${key} input`);
				});
			try {
				const schema = erpnextEndpointSchemas[key];
				expect(schema.input.safeParse(input).success).toBe(false);
				// Prove the rejection happens at the public boundary: the bound
				// handler must throw before any HTTP request is attempted.
				const handler = handlers.get(key);
				expect(handler).toBeDefined();
				await expect(handler?.(input)).rejects.toThrow();
				expect(fetchSpy).not.toHaveBeenCalled();
			} finally {
				fetchSpy.mockRestore();
			}
		},
	);
});

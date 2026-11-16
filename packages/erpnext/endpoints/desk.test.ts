import { createCorsair } from 'corsair/core';
import { erpnext, erpnextEndpointSchemas } from '../index';
import type { ErpnextOperationKey } from '../operations';
import { ERPNEXT_OPERATIONS } from '../operations';

const BASE_URL = 'https://test.example.com';
const AUTH_HEADER = 'token test-key:test-secret';

// The desk family under test; the dotted keys look up the shared schema
// registry and the bound public tree.
type DeskOperationKey = Extract<ErpnextOperationKey, `desk.${string}`>;

const DESK_OPERATIONS = ERPNEXT_OPERATIONS.filter(
	(
		operation,
	): operation is (typeof ERPNEXT_OPERATIONS)[number] & {
		key: DeskOperationKey;
	} => operation.key.startsWith('desk.'),
);

const DESK_ACTIONS = ['addComment', 'addTag', 'searchGlobal'] as const;

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
const INPUT_FIXTURES: Record<DeskOperationKey, unknown> = {
	// frappe/desk/form/utils.py: def add_comment(reference_doctype,
	// reference_name, content, comment_email, comment_by) — all five required.
	'desk.addComment': {
		body: {
			reference_doctype: 'Customer',
			reference_name: 'CUST-00001',
			content: 'Called the customer about the quote',
			comment_email: 'admin@example.com',
			comment_by: 'Administrator',
		},
	},
	// frappe/desk/doctype/tag/tag.py: def add_tag(tag, dt, dn, color=None).
	'desk.addTag': {
		body: {
			tag: 'priority',
			dt: 'Customer',
			dn: 'CUST-00001',
		},
	},
	// frappe/desk/search.py: def search_widget(doctype, txt, query, ...,
	// page_length, filters, ...) — all five catalog params exist in the
	// Python signature (get_newargs filters by name).
	'desk.searchGlobal': {
		doctype: 'Customer',
		txt: 'Acme',
		query: 'erpnext.controllers.queries.customer_query',
		filters: '[["customer_type","=","Company"]]',
		page_length: 5,
	},
};

// Spec-derived response fixtures: the envelope the Frappe sources return.
// Every /api/method answer nests the result under `message`
// (frappe/handler.py).
const RESPONSE_FIXTURES: Record<DeskOperationKey, unknown> = {
	// add_comment returns the inserted Comment document (form/utils.py).
	'desk.addComment': {
		message: {
			doctype: 'Comment',
			name: 'a3fdf51e72',
			reference_doctype: 'Customer',
			reference_name: 'CUST-00001',
			content: 'Called the customer about the quote',
			comment_email: 'admin@example.com',
			comment_by: 'Administrator',
		},
	},
	// add_tag returns the tag it just added (tag.py ends with `return tag`).
	'desk.addTag': { message: 'priority' },
	// search_widget answers the matched result rows; on the default
	// as_dict=False path the rows are positional value lists.
	'desk.searchGlobal': { message: [['CUST-00001', 'Acme GmbH']] },
};

// Independently written expected requests, transcribed by hand from the
// Frappe wire contract (the whitelisted frappe.desk.* method paths and the
// POST bodies their Python signatures accept) and paired with the
// hand-written INPUT_FIXTURES above. They are deliberately NOT derived from
// ERPNEXT_OPERATIONS: a wrong catalog entry must change the wire request
// without also rewriting the expectation, or the test could never catch it.
type ExpectedRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	url: string;
	query?: Record<string, string>;
	// unknown: the expected JSON body is an open record for provider payloads;
	// assertions compare it structurally against the captured body.
	body?: unknown;
	authHeader: string;
};

const EXPECTED_REQUESTS: Record<DeskOperationKey, ExpectedRequest> = {
	'desk.addComment': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.desk.form.utils.add_comment',
		body: {
			reference_doctype: 'Customer',
			reference_name: 'CUST-00001',
			content: 'Called the customer about the quote',
			comment_email: 'admin@example.com',
			comment_by: 'Administrator',
		},
		authHeader: AUTH_HEADER,
	},
	'desk.addTag': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.desk.doctype.tag.tag.add_tag',
		body: {
			tag: 'priority',
			dt: 'Customer',
			dn: 'CUST-00001',
		},
		authHeader: AUTH_HEADER,
	},
	'desk.searchGlobal': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.desk.search.search_widget',
		query: {
			doctype: 'Customer',
			txt: 'Acme',
			query: 'erpnext.controllers.queries.customer_query',
			filters: '[["customer_type","=","Company"]]',
			page_length: '5',
		},
		authHeader: AUTH_HEADER,
	},
};

describe('ERPNext desk endpoint contract', () => {
	it('binds exactly the 3 documented desk handlers', () => {
		expect(DESK_OPERATIONS).toHaveLength(3);
		expect(DESK_OPERATIONS.map(({ key }) => key).sort()).toEqual(
			DESK_ACTIONS.map((action) => `desk.${action}`).sort(),
		);
		// The bound public tree exposes exactly the documented action keys;
		// these define the dotted operation ids with the `desk` prefix.
		// unknown: the bound tree is walked by group name at runtime; the
		// desk group must exist once the family is registered.
		const deskApi = (publicApi as Record<string, unknown>).desk;
		expect(deskApi).toBeDefined();
		expect(Object.keys(deskApi as object).sort()).toEqual(
			[...DESK_ACTIONS].sort(),
		);
		// And the bound public tree carries one schema-wrapped handler per action.
		expect([...endpointHandlers(deskApi as object).keys()].sort()).toEqual(
			[...DESK_ACTIONS].sort(),
		);
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const operationKey = key as DeskOperationKey;
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

				if (expected.body !== undefined) {
					expect(request.body).toBeDefined();
					expect(JSON.parse(String(request.body))).toEqual(expected.body);
					expect(request.headers.get('content-type')).toContain(
						'application/json',
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

	// Every desk operation carries required wire fields: the five add_comment
	// positionals, the three add_tag positionals, and the search_widget
	// doctype/txt pair. The strict schemas must reject their absence at the
	// public boundary before the handler touches fetch.
	it.each([
		{
			key: 'desk.addComment' as DeskOperationKey,
			name: 'a body without reference_doctype',
			input: {
				body: {
					reference_name: 'CUST-00001',
					content: 'Follow-up',
					comment_email: 'admin@example.com',
					comment_by: 'Administrator',
				},
			},
		},
		{
			key: 'desk.addComment' as DeskOperationKey,
			name: 'a body without content',
			input: {
				body: {
					reference_doctype: 'Customer',
					reference_name: 'CUST-00001',
					comment_email: 'admin@example.com',
					comment_by: 'Administrator',
				},
			},
		},
		{
			key: 'desk.addComment' as DeskOperationKey,
			name: 'no body at all',
			input: {},
		},
		{
			key: 'desk.addTag' as DeskOperationKey,
			name: 'a body without the tag',
			input: { body: { dt: 'Customer', dn: 'CUST-00001' } },
		},
		{
			key: 'desk.addTag' as DeskOperationKey,
			name: 'a body without dn',
			input: { body: { tag: 'priority', dt: 'Customer' } },
		},
		{
			key: 'desk.addTag' as DeskOperationKey,
			name: 'no body at all',
			input: {},
		},
		{
			key: 'desk.searchGlobal' as DeskOperationKey,
			name: 'a query without doctype',
			input: { txt: 'Acme' },
		},
		{
			key: 'desk.searchGlobal' as DeskOperationKey,
			name: 'a query without txt',
			input: { doctype: 'Customer' },
		},
		{
			key: 'desk.addComment' as DeskOperationKey,
			name: 'an unknown top-level key',
			input: { document: {}, body: INPUT_FIXTURES['desk.addComment'] },
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

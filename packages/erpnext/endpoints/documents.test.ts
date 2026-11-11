
import { createCorsair } from 'corsair/core';
import { erpnext, erpnextEndpointSchemas } from '../index';
import type { ErpnextOperationKey } from '../operations';
import { ERPNEXT_OPERATIONS } from '../operations';
import { endpoints as documentsEndpoints } from './documents';

const BASE_URL = 'https://test.example.com';
const AUTH_HEADER = 'token test-key:test-secret';

// The documents family under test; the dotted keys look up the shared schema
// registry and the bound public tree.
type DocumentsOperationKey = Extract<
	ErpnextOperationKey,
	`documents.${string}`
>;

const DOCUMENTS_OPERATIONS = ERPNEXT_OPERATIONS.filter(
	(
		operation,
	): operation is (typeof ERPNEXT_OPERATIONS)[number] & {
		key: DocumentsOperationKey;
	} => operation.key.startsWith('documents.'),
);

const DOCUMENTS_ACTIONS = [
	'create',
	'insert',
	'saveDocument',
	'saveDocs',
	'insertMany',
	'get',
	'getClient',
	'getWithMeta',
	'list',
	'getList',
	'update',
	'delete',
	'setValue',
	'getValue',
	'getCount',
	'renameDoc',
	'searchLink',
	'submit',
	'cancel',
] as const;

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
const INPUT_FIXTURES: Record<DocumentsOperationKey, unknown> = {
	'documents.create': {
		doctype: 'Customer',
		body: {
			customer_name: 'Acme GmbH',
			customer_type: 'Company',
		},
	},
	'documents.insert': {
		body: {
			doc: {
				doctype: 'Customer',
				customer_name: 'Acme GmbH',
			},
		},
	},
	'documents.saveDocument': {
		body: {
			doc: {
				doctype: 'Customer',
				name: 'CUST-00001',
				customer_group: 'Commercial',
			},
		},
	},
	'documents.saveDocs': {
		body: {
			doc: {
				doctype: 'Sales Invoice',
				name: 'ACC-SINV-2026-00001',
				docstatus: 1,
			},
		},
	},
	'documents.insertMany': {
		body: {
			docs: [
				{ doctype: 'ToDo', description: 'Call the customer' },
				{ doctype: 'ToDo', description: 'Send the quote' },
			],
		},
	},
	'documents.get': { doctype: 'Customer', name: 'CUST-00001' },
	'documents.getClient': { doctype: 'Customer', name: 'CUST-00001' },
	'documents.getWithMeta': { doctype: 'Customer', name: 'CUST-00001' },
	'documents.list': {
		doctype: 'Customer',
		fields: '["name","customer_name"]',
		filters: '[["customer_type","=","Company"]]',
		order_by: 'creation desc',
		limit_start: 0,
		limit_page_length: 20,
	},
	'documents.getList': {
		doctype: 'Customer',
		fields: '["name","customer_name"]',
		limit_page_length: 20,
	},
	'documents.update': {
		doctype: 'Customer',
		name: 'CUST-00001',
		body: { customer_group: 'Commercial' },
	},
	'documents.delete': { doctype: 'Customer', name: 'CUST-00001' },
	'documents.setValue': {
		body: {
			doctype: 'Customer',
			name: 'CUST-00001',
			fieldname: 'customer_group',
			value: 'Commercial',
		},
	},
	'documents.getValue': {
		doctype: 'Customer',
		fieldname: 'customer_name',
		filters: '{"name":"CUST-00001"}',
	},
	'documents.getCount': {
		doctype: 'ToDo',
		filters: '[["status","=","Open"]]',
	},
	'documents.renameDoc': {
		body: {
			doctype: 'Customer',
			old_name: 'Acme GmbH',
			new_name: 'Acme Corporation',
			merge: false,
		},
	},
	'documents.searchLink': { doctype: 'Customer', txt: 'Acme' },
	'documents.submit': {
		body: {
			doc: {
				doctype: 'Sales Invoice',
				name: 'ACC-SINV-2026-00001',
			},
		},
	},
	'documents.cancel': {
		body: {
			doctype: 'Sales Invoice',
			name: 'ACC-SINV-2026-00001',
		},
	},
};

// Spec-derived response fixtures: the envelope the Frappe sources return,
// trimmed to a representative document. /api/resource answers nest the
// document under `data`; every /api/method answer nests the result under
// `message` (frappe/handler.py).
const RESPONSE_FIXTURES: Record<DocumentsOperationKey, unknown> = {
	'documents.create': {
		data: {
			doctype: 'Customer',
			name: 'CUST-00001',
			customer_name: 'Acme GmbH',
			customer_type: 'Company',
			docstatus: 0,
			owner: 'admin@example.com',
			creation: '2026-01-01 12:00:00.000000',
			modified: '2026-01-01 12:00:00.000000',
		},
	},
	'documents.insert': {
		message: {
			doctype: 'Customer',
			name: 'CUST-00001',
			customer_name: 'Acme GmbH',
			docstatus: 0,
			owner: 'admin@example.com',
		},
	},
	'documents.saveDocument': {
		message: {
			doctype: 'Customer',
			name: 'CUST-00001',
			customer_name: 'Acme GmbH',
			customer_group: 'Commercial',
		},
	},
	'documents.saveDocs': {
		message: {
			doctype: 'Sales Invoice',
			name: 'ACC-SINV-2026-00001',
			docstatus: 1,
		},
	},
	// frappe/client.py insert_many answers the created document names.
	'documents.insertMany': { message: ['TD-I-2026-00001', 'TD-I-2026-00002'] },
	'documents.get': {
		data: {
			doctype: 'Customer',
			name: 'CUST-00001',
			customer_name: 'Acme GmbH',
		},
	},
	'documents.getClient': {
		message: {
			doctype: 'Customer',
			name: 'CUST-00001',
			customer_name: 'Acme GmbH',
		},
	},
	'documents.getWithMeta': {
		docs: [
			{
				doctype: 'Customer',
				name: 'CUST-00001',
				customer_name: 'Acme GmbH',
			},
		],
		docinfo: { attachments: [], comments: [] },
		user_info: { 'admin@example.com': { fullname: 'Administrator' } },
	},
	'documents.list': {
		data: [{ name: 'CUST-00001', customer_name: 'Acme GmbH' }],
	},
	'documents.getList': {
		message: [{ name: 'CUST-00001', customer_name: 'Acme GmbH' }],
	},
	'documents.update': {
		data: {
			doctype: 'Customer',
			name: 'CUST-00001',
			customer_group: 'Commercial',
		},
	},
	// The resource DELETE route answers {"message": "ok"} with HTTP 200.
	'documents.delete': { message: 'ok' },
	// frappe/client.py set_value answers the updated document.
	'documents.setValue': {
		message: {
			doctype: 'Customer',
			name: 'CUST-00001',
			customer_group: 'Commercial',
		},
	},
	// frappe/client.py get_value answers a field-to-value dict (as_dict).
	'documents.getValue': { message: { customer_name: 'Acme GmbH' } },
	// frappe/client.py get_count answers the row count as a number.
	'documents.getCount': { message: 42 },
	// frappe/client.py rename_doc answers the new name.
	'documents.renameDoc': { message: 'Acme Corporation' },
	// frappe/desk/search.py search_link answers the autosuggest rows.
	'documents.searchLink': {
		message: [
			{ value: 'CUST-00001', description: 'Acme GmbH', label: 'Acme GmbH' },
		],
	},
	// frappe/client.py submit answers the submitted document (docstatus 1).
	'documents.submit': {
		message: {
			doctype: 'Sales Invoice',
			name: 'ACC-SINV-2026-00001',
			docstatus: 1,
		},
	},
	// frappe/client.py cancel answers the cancelled document (docstatus 2).
	'documents.cancel': {
		message: {
			doctype: 'Sales Invoice',
			name: 'ACC-SINV-2026-00001',
			docstatus: 2,
		},
	},
};

// Independently written expected requests, transcribed by hand from the
// Frappe wire contract (the /api/resource routes and the whitelisted
// frappe.client.* / frappe.desk.* methods) and paired with the hand-written
// INPUT_FIXTURES above. They are deliberately NOT derived from
// ERPNEXT_OPERATIONS: a wrong catalog entry must change the wire request
// without also rewriting the expectation, or the test could never catch it.
type ExpectedRequest = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	url: string;
	query?: Record<string, string>;
	// unknown: the expected JSON body is an open record for document payloads
	// and a provider envelope for the RPC methods; assertions compare it
	// structurally against the captured body.
	body?: unknown;
	authHeader: string;
};

const EXPECTED_REQUESTS: Record<DocumentsOperationKey, ExpectedRequest> = {
	'documents.create': {
		method: 'POST',
		url: 'https://test.example.com/api/resource/Customer',
		body: { customer_name: 'Acme GmbH', customer_type: 'Company' },
		authHeader: AUTH_HEADER,
	},
	'documents.insert': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.client.insert',
		body: { doc: { doctype: 'Customer', customer_name: 'Acme GmbH' } },
		authHeader: AUTH_HEADER,
	},
	'documents.saveDocument': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.client.save',
		body: {
			doc: {
				doctype: 'Customer',
				name: 'CUST-00001',
				customer_group: 'Commercial',
			},
		},
		authHeader: AUTH_HEADER,
	},
	'documents.saveDocs': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.client.save',
		body: {
			doc: {
				doctype: 'Sales Invoice',
				name: 'ACC-SINV-2026-00001',
				docstatus: 1,
			},
		},
		authHeader: AUTH_HEADER,
	},
	'documents.insertMany': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.client.insert_many',
		body: {
			docs: [
				{ doctype: 'ToDo', description: 'Call the customer' },
				{ doctype: 'ToDo', description: 'Send the quote' },
			],
		},
		authHeader: AUTH_HEADER,
	},
	'documents.get': {
		method: 'GET',
		url: 'https://test.example.com/api/resource/Customer/CUST-00001',
		authHeader: AUTH_HEADER,
	},
	'documents.getClient': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.client.get',
		query: { doctype: 'Customer', name: 'CUST-00001' },
		authHeader: AUTH_HEADER,
	},
	'documents.getWithMeta': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.desk.form.load.getdoc',
		query: { doctype: 'Customer', name: 'CUST-00001' },
		authHeader: AUTH_HEADER,
	},
	'documents.list': {
		method: 'GET',
		url: 'https://test.example.com/api/resource/Customer',
		query: {
			fields: '["name","customer_name"]',
			filters: '[["customer_type","=","Company"]]',
			order_by: 'creation desc',
			limit_start: '0',
			limit_page_length: '20',
		},
		authHeader: AUTH_HEADER,
	},
	'documents.getList': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.client.get_list',
		query: {
			doctype: 'Customer',
			fields: '["name","customer_name"]',
			limit_page_length: '20',
		},
		authHeader: AUTH_HEADER,
	},
	'documents.update': {
		method: 'PUT',
		url: 'https://test.example.com/api/resource/Customer/CUST-00001',
		body: { customer_group: 'Commercial' },
		authHeader: AUTH_HEADER,
	},
	'documents.delete': {
		method: 'DELETE',
		url: 'https://test.example.com/api/resource/Customer/CUST-00001',
		authHeader: AUTH_HEADER,
	},
	'documents.setValue': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.client.set_value',
		body: {
			doctype: 'Customer',
			name: 'CUST-00001',
			fieldname: 'customer_group',
			value: 'Commercial',
		},
		authHeader: AUTH_HEADER,
	},
	'documents.getValue': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.client.get_value',
		query: {
			doctype: 'Customer',
			fieldname: 'customer_name',
			filters: '{"name":"CUST-00001"}',
		},
		authHeader: AUTH_HEADER,
	},
	'documents.getCount': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.client.get_count',
		query: { doctype: 'ToDo', filters: '[["status","=","Open"]]' },
		authHeader: AUTH_HEADER,
	},
	'documents.renameDoc': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.client.rename_doc',
		body: {
			doctype: 'Customer',
			old_name: 'Acme GmbH',
			new_name: 'Acme Corporation',
			merge: false,
		},
		authHeader: AUTH_HEADER,
	},
	'documents.searchLink': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.desk.search.search_link',
		query: { doctype: 'Customer', txt: 'Acme' },
		authHeader: AUTH_HEADER,
	},
	'documents.submit': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.client.submit',
		body: {
			doc: {
				doctype: 'Sales Invoice',
				name: 'ACC-SINV-2026-00001',
			},
		},
		authHeader: AUTH_HEADER,
	},
	'documents.cancel': {
		method: 'POST',
		url: 'https://test.example.com/api/method/frappe.client.cancel',
		body: {
			doctype: 'Sales Invoice',
			name: 'ACC-SINV-2026-00001',
		},
		authHeader: AUTH_HEADER,
	},
};

describe('ERPNext documents endpoint contract', () => {
	it('binds exactly the 19 documented documents handlers', () => {
		expect(DOCUMENTS_OPERATIONS).toHaveLength(19);
		expect(DOCUMENTS_OPERATIONS.map(({ key }) => key).sort()).toEqual(
			DOCUMENTS_ACTIONS.map((action) => `documents.${action}`).sort(),
		);
		// The bound public tree exposes exactly the documented action keys;
		// these define the dotted operation ids with the `documents` prefix.
		// unknown: the bound tree is walked by group name at runtime; the
		// documents group must exist once the family is registered.
		const documentsApi = (publicApi as Record<string, unknown>).documents;
		expect(documentsApi).toBeDefined();
		expect(Object.keys(documentsApi as object).sort()).toEqual(
			[...DOCUMENTS_ACTIONS].sort(),
		);
		// And the bound public tree carries one schema-wrapped handler per action.
		expect([...endpointHandlers(documentsApi as object).keys()].sort()).toEqual(
			[...DOCUMENTS_ACTIONS].sort(),
		);
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const operationKey = key as DocumentsOperationKey;
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

	it.each(
		DOCUMENTS_OPERATIONS.filter(
			({ pathParams, bodyRequired }) => pathParams.length > 0 || bodyRequired,
		),
	)(
		'%s rejects invalid path parameters and missing bodies before sending a request',
		async (operation) => {
			const schema = erpnextEndpointSchemas[operation.key];
			// unknown: fixtures are hand-written open values; the negative cases
			// mutate them by parameter name before the schema runs.
			const base = INPUT_FIXTURES[operation.key] as Record<string, unknown>;
			const withoutKeys = (keys: string[]) =>
				Object.fromEntries(
					Object.entries(base).filter(([name]) => !keys.includes(name)),
				);
			const invalidCases: Array<{
				input: Record<string, unknown>;
				// Empty and missing ids fail the input schema; '..' passes it and
				// is rejected by the factory's path guard instead.
				schemaRejects: boolean;
			}> = [];
			for (const param of operation.pathParams) {
				invalidCases.push({
					input: withoutKeys([param]),
					schemaRejects: true,
				});
				invalidCases.push({
					input: { ...base, [param]: '' },
					schemaRejects: true,
				});
				invalidCases.push({
					input: { ...base, [param]: '..' },
					schemaRejects: false,
				});
			}
			if (operation.bodyRequired) {
				invalidCases.push({
					input: withoutKeys(['body']),
					schemaRejects: true,
				});
			}

			const fetchSpy = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async () => {
					throw new Error(
						`fetch must not be called for invalid ${operation.key} input`,
					);
				});
			try {
				for (const invalidCase of invalidCases) {
					const parsed = schema.input.safeParse(invalidCase.input);
					if (invalidCase.schemaRejects) {
						expect(parsed.success).toBe(false);
					} else {
						expect(parsed.success).toBe(true);
					}
					// Prove the rejection happens at the public boundary: the bound
					// handler must throw before any HTTP request is attempted.
					const handler = handlers.get(operation.key);
					expect(handler).toBeDefined();
					await expect(handler?.(invalidCase.input)).rejects.toThrow();
					expect(fetchSpy).not.toHaveBeenCalled();
					fetchSpy.mockClear();
				}
			} finally {
				fetchSpy.mockRestore();
			}
		},
	);

	// submit and cancel carry no path parameters, so the per-op table above
	// generates no '..'/'/' guard cases for them; their boundary lives inside
	// the body, where the strict inner schemas (and the doctype refinement on
	// submit's doc) must reject an incomplete document reference before the
	// handler touches fetch.
	it.each([
		{
			key: 'documents.submit' as DocumentsOperationKey,
			name: 'a body without its doc object',
			input: { body: {} },
		},
		{
			key: 'documents.submit' as DocumentsOperationKey,
			name: 'a doc object without its doctype',
			input: { body: { doc: { name: 'ACC-SINV-2026-00001' } } },
		},
		{
			key: 'documents.cancel' as DocumentsOperationKey,
			name: 'a body without its doctype',
			input: { body: { name: 'ACC-SINV-2026-00001' } },
		},
		{
			key: 'documents.cancel' as DocumentsOperationKey,
			name: 'a body without its document name',
			input: { body: { doctype: 'Sales Invoice' } },
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

	it.each([
		{ name: 'CUST/00001', encoded: 'CUST%2F00001' },
		{ name: 'Acme GmbH', encoded: 'Acme%20GmbH' },
	])(
		'percent-encodes reserved characters in document names ($name)',
		async ({ name, encoded }) => {
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
						JSON.stringify(RESPONSE_FIXTURES['documents.get']),
						{
							status: 200,
							headers: { 'content-type': 'application/json' },
						},
					);
				});
			try {
				const handler = handlers.get('documents.get');
				expect(handler).toBeDefined();
				await handler?.({ doctype: 'Customer', name });
				const request = captures[0];
				if (!request) {
					throw new Error('No request captured');
				}
				// The guard is percent-encoding: reserved characters stay inside
				// the resource path instead of escaping it.
				expect(request.url.pathname).toBe(`/api/resource/Customer/${encoded}`);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);
});

// ── Greptile round-2 regressions ─────────────────────────────────────────────

describe('ERPNext tenant host and local document sync', () => {
	it('resolves a tenant-stored base_url over the plugin option so tokens never cross sites', async () => {
		const captures: Array<{ url: URL; method: string }> = [];
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async (url, init) => {
				captures.push({
					url: new URL(String(url)),
					method: init?.method ?? 'GET',
				});
				return new Response(
					JSON.stringify({
						data: { doctype: 'Customer', name: 'CUST-001' },
					}),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				);
			});
		try {
			// Raw handler call with a tenant-bound context: the stored base_url
			// must win over the plugin option (unvalidated unit seam; the
			// schema walk above covers parsing).
			const result = await documentsEndpoints.get(
				{
					key: 'tenant-b-key:secret',
					options: { baseUrl: 'https://tenant-a.example.com' },
					keys: { get_base_url: async () => 'https://tenant-b.example.com' },
				},
				{ doctype: 'Customer', name: 'CUST-001' },
			);
			expect(result).toEqual({
				data: { doctype: 'Customer', name: 'CUST-001' },
			});
			expect(captures).toHaveLength(1);
			expect(captures[0]?.url.origin).toBe('https://tenant-b.example.com');
			expect(captures[0]?.url.pathname).toBe('/api/resource/Customer/CUST-001');
		} finally {
			mockFetch.mockRestore();
		}
	});

	it('mirrors fetched documents into the stored documents entity', async () => {
		const upsertByEntityId = jest.fn();
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => {
				return new Response(
					JSON.stringify({
						data: {
							doctype: 'Customer',
							name: 'CUST-002',
							customer_name: 'Acme',
						},
					}),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				);
			});
		try {
			await documentsEndpoints.get(
				{
					key: 'test-key:test-secret',
					options: { baseUrl: BASE_URL },
					db: { documents: { upsertByEntityId, deleteByEntityId: jest.fn() } },
				},
				{ doctype: 'Customer', name: 'CUST-002' },
			);
			expect(upsertByEntityId).toHaveBeenCalledTimes(1);
			expect(upsertByEntityId).toHaveBeenCalledWith('Customer:CUST-002', {
				doctype: 'Customer',
				name: 'CUST-002',
				customer_name: 'Acme',
			});
		} finally {
			mockFetch.mockRestore();
		}
	});

	it('removes the stored row when a document is deleted', async () => {
		const deleteByEntityId = jest.fn();
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => {
				return new Response(JSON.stringify({ message: 'ok' }), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				});
			});
		try {
			await documentsEndpoints.delete(
				{
					key: 'test-key:test-secret',
					options: { baseUrl: BASE_URL },
					db: { documents: { upsertByEntityId: jest.fn(), deleteByEntityId } },
				},
				{ doctype: 'Customer', name: 'CUST-003' },
			);
			expect(deleteByEntityId).toHaveBeenCalledWith('Customer:CUST-003');
		} finally {
			mockFetch.mockRestore();
		}
	});
});
// Greptile round-3: explicit credentials and the site host must come from
// the same source — an explicitly configured key pair never travels to a
// tenant-stored base_url from another account.
describe('ERPNext same-source host and credential pairing', () => {
	it('pairs explicit credentials with the explicit baseUrl even when a tenant base_url is stored', async () => {
		const captures: Array<{ url: URL }> = [];
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async (url) => {
				captures.push({ url: new URL(String(url)) });
				return new Response(
					JSON.stringify({ data: { doctype: 'Customer', name: 'CUST-004' } }),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				);
			});
		try {
			await documentsEndpoints.get(
				{
					key: 'explicit-key:explicit-secret',
					options: {
						baseUrl: 'https://explicit.example.com',
						key: 'explicit-key:explicit-secret',
					},
					keys: {
						get_base_url: async () => 'https://tenant-stored.example.com',
					},
				},
				{ doctype: 'Customer', name: 'CUST-004' },
			);
			expect(captures).toHaveLength(1);
			expect(captures[0]?.url.origin).toBe('https://explicit.example.com');
		} finally {
			mockFetch.mockRestore();
		}
	});

	it('pairs a bare key plus apiSecret with the explicit baseUrl', async () => {
		const captures: Array<{ url: URL }> = [];
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async (url) => {
				captures.push({ url: new URL(String(url)) });
				return new Response(
					JSON.stringify({ data: { doctype: 'Customer', name: 'CUST-007' } }),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				);
			});
		try {
			await documentsEndpoints.get(
				{
					key: 'split-key:split-secret',
					options: {
						baseUrl: 'https://split.example.com',
						key: 'split-key',
						apiSecret: 'split-secret',
					},
					keys: {
						get_base_url: async () => 'https://tenant-stored.example.com',
					},
				},
				{ doctype: 'Customer', name: 'CUST-007' },
			);
			expect(captures).toHaveLength(1);
			expect(captures[0]?.url.origin).toBe('https://split.example.com');
		} finally {
			mockFetch.mockRestore();
		}
	});

	it('pairs stored credentials with the stored tenant base_url when no explicit credentials are set', async () => {
		const captures: Array<{ url: URL }> = [];
		const mockFetch = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async (url) => {
				captures.push({ url: new URL(String(url)) });
				return new Response(
					JSON.stringify({ data: { doctype: 'Customer', name: 'CUST-005' } }),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				);
			});
		try {
			await documentsEndpoints.get(
				{
					key: 'stored-key:stored-secret',
					options: { baseUrl: 'https://shared-fallback.example.com' },
					keys: {
						get_base_url: async () => 'https://tenant-stored.example.com',
					},
				},
				{ doctype: 'Customer', name: 'CUST-005' },
			);
			expect(captures).toHaveLength(1);
			expect(captures[0]?.url.origin).toBe('https://tenant-stored.example.com');
		} finally {
			mockFetch.mockRestore();
		}
	});

	it('refuses to fall back to the shared option when a bound tenant has no stored base_url', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch');
		try {
			await expect(
				documentsEndpoints.get(
					{
						key: 'stored-key:stored-secret',
						options: { baseUrl: 'https://shared-fallback.example.com' },
						keys: { get_base_url: async () => null },
					},
					{ doctype: 'Customer', name: 'CUST-008' },
				),
			).rejects.toThrow(/missing tenant base_url/);
			// The token never leaves for the shared fallback host.
			expect(fetchSpy).not.toHaveBeenCalled();
		} finally {
			fetchSpy.mockRestore();
		}
	});

	it('propagates a failure to read the stored tenant base_url instead of falling back', async () => {
		const fetchSpy = jest.spyOn(global, 'fetch');
		try {
			await expect(
				documentsEndpoints.get(
					{
						key: 'stored-key:stored-secret',
						options: { baseUrl: 'https://shared-fallback.example.com' },
						keys: {
							get_base_url: async () => {
								throw new Error('key manager unavailable');
							},
						},
					},
					{ doctype: 'Customer', name: 'CUST-009' },
				),
			).rejects.toThrow('key manager unavailable');
			expect(fetchSpy).not.toHaveBeenCalled();
		} finally {
			fetchSpy.mockRestore();
		}
	});
});

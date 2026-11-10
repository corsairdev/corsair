import { createCorsair } from 'corsair/core';
import { erpnext, erpnextEndpointSchemas } from '../index';
import type { ErpnextOperationKey } from '../operations';
import { ERPNEXT_OPERATIONS } from '../operations';

const BASE_URL = 'https://test.example.com';
const AUTH_HEADER = 'token test-key:test-secret';

// The people family under test; the dotted keys look up the shared schema
// registry and the bound public tree.
type PeopleOperationKey = Extract<ErpnextOperationKey, `people.${string}`>;

const PEOPLE_OPERATIONS = ERPNEXT_OPERATIONS.filter(
	(
		operation,
	): operation is (typeof ERPNEXT_OPERATIONS)[number] & {
		key: PeopleOperationKey;
	} => operation.key.startsWith('people.'),
);

const PEOPLE_ACTIONS = ['listEmployees', 'listProjects'] as const;

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

// Spec-derived input fixtures: the shared /api/resource list query. Written
// by hand so a mistaken schema can never bend the fixture into passing
// itself. order_by is part of the catalog query — the schema must keep it so
// pickQuery does not silently drop the caller's ordering.
const INPUT_FIXTURES: Record<PeopleOperationKey, unknown> = {
	'people.listEmployees': {
		fields: '["name","employee_name","department"]',
		filters: '[["status","=","Active"]]',
		order_by: 'employee_name asc',
		limit_start: 0,
		limit_page_length: 20,
	},
	'people.listProjects': {
		fields: '["name","project_name","status"]',
		filters: '[["status","=","Open"]]',
		order_by: 'modified desc',
		limit_start: 0,
		limit_page_length: 20,
	},
};

// Spec-derived response fixtures: /api/resource list answers nest the rows
// under `data` (frappe/handler.py resource envelope).
const RESPONSE_FIXTURES: Record<PeopleOperationKey, unknown> = {
	'people.listEmployees': {
		data: [
			{
				name: 'EMP-00001',
				employee_name: 'Anna Admin',
				department: 'Administration',
			},
		],
	},
	'people.listProjects': {
		data: [
			{
				name: 'PROJ-00001',
				project_name: 'ERP rollout',
				status: 'Open',
			},
		],
	},
};

// Independently written expected requests, transcribed by hand from the
// Frappe wire contract (the /api/resource/Employee and /api/resource/Project
// list routes) and paired with the hand-written INPUT_FIXTURES above. They
// are deliberately NOT derived from ERPNEXT_OPERATIONS: a wrong catalog
// entry must change the wire request without also rewriting the expectation,
// or the test could never catch it.
type ExpectedRequest = {
	method: 'GET';
	url: string;
	query?: Record<string, string>;
	authHeader: string;
};

const EXPECTED_REQUESTS: Record<PeopleOperationKey, ExpectedRequest> = {
	'people.listEmployees': {
		method: 'GET',
		url: 'https://test.example.com/api/resource/Employee',
		query: {
			fields: '["name","employee_name","department"]',
			filters: '[["status","=","Active"]]',
			order_by: 'employee_name asc',
			limit_start: '0',
			limit_page_length: '20',
		},
		authHeader: AUTH_HEADER,
	},
	'people.listProjects': {
		method: 'GET',
		url: 'https://test.example.com/api/resource/Project',
		query: {
			fields: '["name","project_name","status"]',
			filters: '[["status","=","Open"]]',
			order_by: 'modified desc',
			limit_start: '0',
			limit_page_length: '20',
		},
		authHeader: AUTH_HEADER,
	},
};

describe('ERPNext people endpoint contract', () => {
	it('binds exactly the 2 documented people handlers', () => {
		expect(PEOPLE_OPERATIONS).toHaveLength(2);
		expect(PEOPLE_OPERATIONS.map(({ key }) => key).sort()).toEqual(
			PEOPLE_ACTIONS.map((action) => `people.${action}`).sort(),
		);
		// The bound public tree exposes exactly the documented action keys;
		// these define the dotted operation ids with the `people` prefix.
		// unknown: the bound tree is walked by group name at runtime; the
		// people group must exist once the family is registered.
		const peopleApi = (publicApi as Record<string, unknown>).people;
		expect(peopleApi).toBeDefined();
		expect(Object.keys(peopleApi as object).sort()).toEqual(
			[...PEOPLE_ACTIONS].sort(),
		);
		// And the bound public tree carries one schema-wrapped handler per action.
		expect([...endpointHandlers(peopleApi as object).keys()].sort()).toEqual(
			[...PEOPLE_ACTIONS].sort(),
		);
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const operationKey = key as PeopleOperationKey;
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
				// Both people operations are GETs without a request body.
				expect(request.body).toBeUndefined();

				expect(schema.output.safeParse(result).success).toBe(true);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	// The shared /api/resource list query pins its non-negative pagination
	// bounds and the strict object shape at the public boundary.
	it.each([
		{
			key: 'people.listEmployees' as PeopleOperationKey,
			name: 'a negative limit_page_length',
			input: { limit_page_length: -1 },
		},
		{
			key: 'people.listEmployees' as PeopleOperationKey,
			name: 'a negative limit_start',
			input: { limit_start: -10 },
		},
		{
			key: 'people.listEmployees' as PeopleOperationKey,
			name: 'an unknown query key',
			input: { page: 2 },
		},
		{
			key: 'people.listProjects' as PeopleOperationKey,
			name: 'a negative limit_page_length',
			input: { limit_page_length: -1 },
		},
		{
			key: 'people.listProjects' as PeopleOperationKey,
			name: 'an unknown query key',
			input: { page: 2 },
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

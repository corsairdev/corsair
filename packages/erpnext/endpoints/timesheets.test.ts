import { createCorsair } from 'corsair/core';
import { erpnext, erpnextEndpointSchemas } from '../index';
import type { ErpnextOperationKey } from '../operations';
import { ERPNEXT_OPERATIONS } from '../operations';

const BASE_URL = 'https://test.example.com';
const AUTH_HEADER = 'token test-key:test-secret';

// The timesheets family under test; the dotted keys look up the shared
// schema registry and the bound public tree.
type TimesheetsOperationKey = Extract<
	ErpnextOperationKey,
	`timesheets.${string}`
>;

const TIMESHEETS_OPERATIONS = ERPNEXT_OPERATIONS.filter(
	(
		operation,
	): operation is (typeof ERPNEXT_OPERATIONS)[number] & {
		key: TimesheetsOperationKey;
	} => operation.key.startsWith('timesheets.'),
);

const TIMESHEETS_ACTIONS = ['list', 'create'] as const;

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

// Spec-derived input fixtures: the shared /api/resource list query and the
// Timesheet document body. Written by hand so a mistaken schema can never
// bend the fixture into passing itself. order_by is part of the catalog
// query — the schema must keep it so pickQuery does not silently drop the
// caller's ordering.
const INPUT_FIXTURES: Record<TimesheetsOperationKey, unknown> = {
	'timesheets.list': {
		fields: '["name","employee","total_hours"]',
		filters: '[["docstatus","=",0]]',
		order_by: 'modified desc',
		limit_start: 0,
		limit_page_length: 20,
	},
	// POST /api/resource/Timesheet — the body is the Timesheet document's
	// field values; time_logs is the key child table.
	'timesheets.create': {
		body: {
			employee: 'EMP-00001',
			time_logs: [
				{
					activity_type: 'Execution',
					from_time: '2026-01-02 09:00:00',
					to_time: '2026-01-02 11:00:00',
					hours: 2,
				},
			],
		},
	},
};

// Spec-derived response fixtures: /api/resource answers nest their results
// under `data` (frappe/handler.py resource envelope).
const RESPONSE_FIXTURES: Record<TimesheetsOperationKey, unknown> = {
	'timesheets.list': {
		data: [
			{
				name: 'TS-2026-00001',
				employee: 'EMP-00001',
				total_hours: 2,
			},
		],
	},
	'timesheets.create': {
		data: {
			name: 'TS-2026-00002',
			employee: 'EMP-00001',
			time_logs: [
				{
					activity_type: 'Execution',
					from_time: '2026-01-02 09:00:00',
					to_time: '2026-01-02 11:00:00',
					hours: 2,
				},
			],
		},
	},
};

// Independently written expected requests, transcribed by hand from the
// Frappe wire contract (the /api/resource/Timesheet list and create routes)
// and paired with the hand-written INPUT_FIXTURES above. They are
// deliberately NOT derived from ERPNEXT_OPERATIONS: a wrong catalog entry
// must change the wire request without also rewriting the expectation, or
// the test could never catch it.
type ExpectedRequest = {
	method: 'GET' | 'POST';
	url: string;
	query?: Record<string, string>;
	// unknown: the expected JSON body is an open record for provider payloads;
	// assertions compare it structurally against the captured body.
	body?: unknown;
	authHeader: string;
};

const EXPECTED_REQUESTS: Record<TimesheetsOperationKey, ExpectedRequest> = {
	'timesheets.list': {
		method: 'GET',
		url: 'https://test.example.com/api/resource/Timesheet',
		query: {
			fields: '["name","employee","total_hours"]',
			filters: '[["docstatus","=",0]]',
			order_by: 'modified desc',
			limit_start: '0',
			limit_page_length: '20',
		},
		authHeader: AUTH_HEADER,
	},
	'timesheets.create': {
		method: 'POST',
		url: 'https://test.example.com/api/resource/Timesheet',
		body: {
			employee: 'EMP-00001',
			time_logs: [
				{
					activity_type: 'Execution',
					from_time: '2026-01-02 09:00:00',
					to_time: '2026-01-02 11:00:00',
					hours: 2,
				},
			],
		},
		authHeader: AUTH_HEADER,
	},
};

describe('ERPNext timesheets endpoint contract', () => {
	it('binds exactly the 2 documented timesheets handlers', () => {
		expect(TIMESHEETS_OPERATIONS).toHaveLength(2);
		expect(TIMESHEETS_OPERATIONS.map(({ key }) => key).sort()).toEqual(
			TIMESHEETS_ACTIONS.map((action) => `timesheets.${action}`).sort(),
		);
		// The bound public tree exposes exactly the documented action keys;
		// these define the dotted operation ids with the `timesheets` prefix.
		// unknown: the bound tree is walked by group name at runtime; the
		// timesheets group must exist once the family is registered.
		const timesheetsApi = (publicApi as Record<string, unknown>).timesheets;
		expect(timesheetsApi).toBeDefined();
		expect(Object.keys(timesheetsApi as object).sort()).toEqual(
			[...TIMESHEETS_ACTIONS].sort(),
		);
		// And the bound public tree carries one schema-wrapped handler per action.
		expect(
			[...endpointHandlers(timesheetsApi as object).keys()].sort(),
		).toEqual([...TIMESHEETS_ACTIONS].sort());
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const operationKey = key as TimesheetsOperationKey;
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

	// The list query pins its non-negative pagination bounds; create requires
	// a body and the strict outer object rejects unknown top-level keys.
	it.each([
		{
			key: 'timesheets.list' as TimesheetsOperationKey,
			name: 'a negative limit_page_length',
			input: { limit_page_length: -1 },
		},
		{
			key: 'timesheets.list' as TimesheetsOperationKey,
			name: 'an unknown query key',
			input: { page: 2 },
		},
		{
			key: 'timesheets.create' as TimesheetsOperationKey,
			name: 'no body at all',
			input: {},
		},
		{
			key: 'timesheets.create' as TimesheetsOperationKey,
			name: 'an unknown top-level key',
			input: { doc: {}, body: { employee: 'EMP-00001' } },
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

import { createCorsair } from 'corsair/core';
import { erpnext, erpnextEndpointSchemas, erpnextEndpoints } from '../index';
import type { ErpnextOperationKey } from '../operations';
import { ERPNEXT_OPERATIONS } from '../operations';

const BASE_URL = 'https://test.example.com';
const AUTH_HEADER = 'token test-key:test-secret';

// The system family under test; the dotted keys look up the shared schema
// registry and the bound public tree.
type SystemOperationKey = Extract<ErpnextOperationKey, `system.${string}`>;

const SYSTEM_OPERATIONS = ERPNEXT_OPERATIONS.filter(
	(
		operation,
	): operation is (typeof ERPNEXT_OPERATIONS)[number] & {
		key: SystemOperationKey;
	} => operation.key.startsWith('system.'),
);

const SYSTEM_ACTIONS = [
	'getLoggedUser',
	'ping',
	'getFrameworkVersion',
	'getAllLanguages',
	'getAllRoles',
	'getUserRoles',
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
const INPUT_FIXTURES: Record<SystemOperationKey, unknown> = {
	'system.getLoggedUser': {},
	'system.ping': {},
	'system.getFrameworkVersion': {},
	'system.getAllLanguages': {
		fields: '["language_code","language_name"]',
		// 0 is Frappe's "no page limit" sentinel; the fixture pins the boundary.
		limit_page_length: 0,
	},
	'system.getAllRoles': {
		fields: '["name","desk_access"]',
		filters: '[["desk_access","=",1]]',
		limit_start: 0,
		limit_page_length: 20,
	},
	'system.getUserRoles': {
		fields: '["parent","role"]',
		filters: '[["parenttype","=","User"]]',
		limit_start: 0,
		limit_page_length: 50,
	},
};

// Spec-derived response fixtures: the envelope the Frappe sources return.
// Every /api/method answer nests the result under `message`
// (frappe/handler.py); every /api/resource list answer nests rows under
// `data`.
const RESPONSE_FIXTURES: Record<SystemOperationKey, unknown> = {
	// frappe.auth.get_logged_user answers frappe.session.user.
	'system.getLoggedUser': { message: 'admin@example.com' },
	// frappe/__init__.py ping() answers "pong".
	'system.ping': { message: 'pong' },
	// frappe/utils/change_log.py get_versions answers one app-name-keyed
	// entry per installed app.
	'system.getFrameworkVersion': {
		message: {
			frappe: { version: '16.0.0-dev', branch: 'develop' },
			erpnext: { version: '16.0.0-dev', branch: 'develop' },
		},
	},
	'system.getAllLanguages': {
		data: [
			{ name: 'en', language_code: 'en', language_name: 'English' },
			{ name: 'de', language_code: 'de', language_name: 'German' },
		],
	},
	'system.getAllRoles': {
		data: [
			{ name: 'System Manager', desk_access: 1 },
			{ name: 'Guest', desk_access: 0 },
		],
	},
	'system.getUserRoles': {
		data: [
			{
				name: 'a3fdf51e72',
				parent: 'admin@example.com',
				parenttype: 'User',
				parentfield: 'roles',
				role: 'System Manager',
			},
		],
	},
};

// Independently written expected requests, transcribed by hand from the
// Frappe wire contract (the /api/resource routes and the whitelisted
// frappe.auth / top-level methods) and paired with the hand-written
// INPUT_FIXTURES above. They are deliberately NOT derived from
// ERPNEXT_OPERATIONS: a wrong catalog entry must change the wire request
// without also rewriting the expectation, or the test could never catch it.
type ExpectedRequest = {
	method: 'GET';
	url: string;
	query?: Record<string, string>;
	authHeader: string;
};

const EXPECTED_REQUESTS: Record<SystemOperationKey, ExpectedRequest> = {
	'system.getLoggedUser': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.auth.get_logged_user',
		authHeader: AUTH_HEADER,
	},
	'system.ping': {
		method: 'GET',
		url: 'https://test.example.com/api/method/ping',
		authHeader: AUTH_HEADER,
	},
	'system.getFrameworkVersion': {
		method: 'GET',
		url: 'https://test.example.com/api/method/frappe.utils.change_log.get_versions',
		authHeader: AUTH_HEADER,
	},
	'system.getAllLanguages': {
		method: 'GET',
		url: 'https://test.example.com/api/resource/Language',
		query: {
			fields: '["language_code","language_name"]',
			limit_page_length: '0',
		},
		authHeader: AUTH_HEADER,
	},
	'system.getAllRoles': {
		method: 'GET',
		url: 'https://test.example.com/api/resource/Role',
		query: {
			fields: '["name","desk_access"]',
			filters: '[["desk_access","=",1]]',
			limit_start: '0',
			limit_page_length: '20',
		},
		authHeader: AUTH_HEADER,
	},
	'system.getUserRoles': {
		method: 'GET',
		// The raw space is intentional: it is a literal part of the resource
		// path and the URL parser normalizes it to %20 on the wire.
		url: 'https://test.example.com/api/resource/Has Role',
		query: {
			fields: '["parent","role"]',
			filters: '[["parenttype","=","User"]]',
			limit_start: '0',
			limit_page_length: '50',
		},
		authHeader: AUTH_HEADER,
	},
};

// The three /api/resource list operations share the pagination query; the
// boundary tests below pin its non-negative bounds.
const LIST_OPERATION_KEYS: readonly SystemOperationKey[] = [
	'system.getAllLanguages',
	'system.getAllRoles',
	'system.getUserRoles',
];

describe('ERPNext system endpoint contract', () => {
	it('binds exactly the 6 documented system handlers', () => {
		expect(SYSTEM_OPERATIONS).toHaveLength(6);
		// The family tree exposes exactly the documented action keys; these
		// define the dotted operation ids with the `system` prefix.
		expect(Object.keys(erpnextEndpoints.system).sort()).toEqual(
			[...SYSTEM_ACTIONS].sort(),
		);
		expect(SYSTEM_OPERATIONS.map(({ key }) => key).sort()).toEqual(
			SYSTEM_ACTIONS.map((action) => `system.${action}`).sort(),
		);
		// And the bound public tree carries one handler per action.
		// unknown: the bound tree is walked by group name at runtime; the
		// system group must exist once the family is registered.
		const systemApi = (publicApi as Record<string, unknown>).system;
		expect(systemApi).toBeDefined();
		expect([...endpointHandlers(systemApi as object).keys()].sort()).toEqual(
			[...SYSTEM_ACTIONS].sort(),
		);
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const operationKey = key as SystemOperationKey;
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
				// URL normalization also encodes the literal space in the
				// `Has Role` resource path, so the pathname comparison pins
				// the wire form to /api/resource/Has%20Role.
				expect(request.url.pathname).toBe(expectedUrl.pathname);
				expect(request.headers.get('authorization')).toBe(expected.authHeader);
				expect(Object.fromEntries(request.url.searchParams)).toEqual(
					expected.query ?? {},
				);
				// Every system operation is a GET without a request body.
				expect(request.body).toBeUndefined();

				expect(schema.output.safeParse(result).success).toBe(true);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	it.each(LIST_OPERATION_KEYS)(
		'%s rejects a negative limit_page_length before sending a request',
		async (operationKey) => {
			const schema = erpnextEndpointSchemas[operationKey];
			const invalidInput = {
				...(INPUT_FIXTURES[operationKey] as Record<string, unknown>),
				limit_page_length: -1,
			};
			expect(schema.input.safeParse(invalidInput).success).toBe(false);

			// Prove the rejection happens at the public boundary: the bound
			// handler must throw before any HTTP request is attempted.
			const fetchSpy = jest
				.spyOn(global, 'fetch')
				.mockImplementation(async () => {
					throw new Error(
						`fetch must not be called for invalid ${operationKey} input`,
					);
				});
			try {
				const handler = handlers.get(operationKey);
				expect(handler).toBeDefined();
				await expect(handler?.(invalidInput)).rejects.toThrow();
				expect(fetchSpy).not.toHaveBeenCalled();
			} finally {
				fetchSpy.mockRestore();
			}
		},
	);

	it('URL-normalizes the literal space in the Has Role resource path', async () => {
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
					JSON.stringify(RESPONSE_FIXTURES['system.getUserRoles']),
					{
						status: 200,
						headers: { 'content-type': 'application/json' },
					},
				);
			});
		try {
			const handler = handlers.get('system.getUserRoles');
			expect(handler).toBeDefined();
			await handler?.(INPUT_FIXTURES['system.getUserRoles']);
			const request = captures[0];
			if (!request) {
				throw new Error('No request captured');
			}
			// The DocType name `Has Role` is a literal path section, not a path
			// parameter, so the factory's encodeURIComponent guard never runs;
			// the URL parser encodes the space to %20 and Frappe answers the
			// same resource.
			expect(request.url.pathname).toBe('/api/resource/Has%20Role');
		} finally {
			mockFetch.mockRestore();
		}
	});
});

import { createCorsair } from 'corsair/core';
import { MISSIVE_BASE_URL } from './client';
import { missive, missiveEndpointSchemas } from './index';
import type { MissiveOperationKey } from './operations';
import { getMissiveOperation, MISSIVE_OPERATIONS } from './operations';

const TOKEN = 'missive_pat-test-token';

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
	plugins: [missive({ key: TOKEN })],
});
// Corsair's database/API result is a union; this assertion selects the API
// branch because the test invokes the public HTTP endpoints only.
const publicApi = (corsair.missive as unknown as { api: object }).api;
const handlers = endpointHandlers(publicApi);

// Spec-derived input fixtures: the minimal valid request each reference-page
// example shows. Written by hand so a mistaken schema can never bend the
// fixture into passing itself.
const INPUT_FIXTURES: Record<MissiveOperationKey, unknown> = {
	'analytics.createReport': {
		body: {
			organization: '0d9bab85-a74f-4ece-9142-0f9b9f36ff92',
			start: 1691812800,
			end: 1692371867,
			time_zone: 'America/Montreal',
		},
	},
	'analytics.getReport': { id: '8441d4a0-a0ad-4f0f-aa9c-1cc881057e42' },
	'contacts.create': {
		body: [
			{
				contact_book: '551b8675-11e9-49c3-aac0-01fb8510d862',
				first_name: 'Philippe',
				last_name: 'Lehoux',
				infos: [
					{
						kind: 'email',
						label: 'home',
						value: 'philippe@missiveapp.com',
					},
				],
			},
		],
	},
	'contacts.update': {
		ids: ['ee31f156-db95-4158-923f-b26450e0dbf7'],
		body: [{ id: 'ee31f156-db95-4158-923f-b26450e0dbf7', last_name: 'Lehoux' }],
	},
	'contacts.list': {
		contact_book: '487bc080-6631-4edc-830e-1d114eef4ab0',
		limit: 50,
		search: 'Lehoux',
	},
	'contacts.get': { id: '5960dcd2-3382-4430-aa70-955a2c62040a' },
	'contactBooks.list': {},
	'contactGroups.list': {
		contact_book: '487bc080-6631-4edc-830e-1d114eef4ab0',
		kind: 'organization',
	},
	'conversations.list': { inbox: true, limit: 25 },
	'conversations.get': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.update': {
		ids: ['6d3c9b1c-7067-4a28-8ea6-ea91340b67cc'],
		body: [
			{
				id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
				subject: 'Refund approved',
				close: true,
			},
		],
	},
	'conversations.listMessages': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
		limit: 10,
	},
	'conversations.listComments': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.listDrafts': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.listPosts': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
	},
	'conversations.merge': {
		id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
		body: { target: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e' },
	},
};

// Spec-derived response fixtures: the envelope each reference-page example
// returns, trimmed to its documented top-level shape.
const RESPONSE_FIXTURES: Record<MissiveOperationKey, unknown> = {
	'analytics.createReport': {
		reports: { id: '8441d4a0-a0ad-4f0f-aa9c-1cc881057e42' },
	},
	'analytics.getReport': {
		conversations_created: { total: 10 },
	},
	'contacts.create': {
		contacts: [
			{
				id: '5960dcd2-3382-4430-aa70-955a2c62040a',
				first_name: 'Philippe',
				last_name: 'Lehoux',
			},
		],
	},
	'contacts.update': {
		contacts: [
			{ id: 'ee31f156-db95-4158-923f-b26450e0dbf7', last_name: 'Lehoux' },
		],
	},
	'contacts.list': {
		contacts: [{ id: '183382b8-fb70-4a35-bf22-4ebae1450553' }],
	},
	'contacts.get': {
		contacts: [{ id: '5960dcd2-3382-4430-aa70-955a2c62040a' }],
	},
	'contactBooks.list': {
		contact_books: [{ id: '6a012cec-c2e2-4e21-91e3-a36dba6930e7', name: 'HR' }],
	},
	'contactGroups.list': {
		contact_groups: [
			{ id: '6a012cec-c2e2-4e21-91e3-a36dba6930e7', name: 'VIPs' },
		],
	},
	'conversations.list': {
		conversations: [
			{
				id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
				created_at: 1654544954,
				last_activity_at: 1654544954,
			},
		],
	},
	'conversations.get': {
		conversations: [
			{ id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc', created_at: 1654544954 },
		],
	},
	'conversations.update': {
		conversations: [
			{
				id: '6d3c9b1c-7067-4a28-8ea6-ea91340b67cc',
				subject: 'Refund approved',
			},
		],
	},
	'conversations.listMessages': {
		messages: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				type: 'email',
				delivered_at: 1563806347,
			},
		],
	},
	'conversations.listComments': {
		comments: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				body: 'This is a comment',
				created_at: 1563806347,
			},
		],
	},
	'conversations.listDrafts': {
		drafts: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				draft: true,
			},
		],
	},
	'conversations.listPosts': {
		posts: [
			{
				id: 'ee31f156-db95-4158-923f-b26450e0dbf7',
				created_at: 1563806347,
			},
		],
	},
	'conversations.merge': {
		conversations: [
			{
				id: '3fa4bcf5-e57e-47a4-9422-de2cce5f802e',
				created_at: 1654544954,
			},
		],
	},
};

const AUTH_HEADER = `Bearer ${TOKEN}`;

describe('Missive REST endpoint contract', () => {
	it('matches the shipped operation catalog', () => {
		expect(MISSIVE_OPERATIONS).toHaveLength(16);
		expect(handlers.size).toBe(16);
		expect([...handlers.keys()].sort()).toEqual(
			MISSIVE_OPERATIONS.map(({ key }) => key).sort(),
		);
		expect(new Set(MISSIVE_OPERATIONS.map(({ key }) => key)).size).toBe(16);
		expect(
			new Set(MISSIVE_OPERATIONS.map(({ method, path }) => `${method} ${path}`))
				.size,
		).toBe(16);
	});

	it.each(Object.entries(INPUT_FIXTURES))(
		'%s sends its documented request',
		async (key) => {
			const operation = getMissiveOperation(key as MissiveOperationKey);
			const schema = missiveEndpointSchemas[key as MissiveOperationKey];
			const input = INPUT_FIXTURES[key as MissiveOperationKey];
			const response = RESPONSE_FIXTURES[key as MissiveOperationKey];

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
				const handler = handlers.get(operation.key);
				expect(handler).toBeDefined();
				const result = await handler?.(input);
				expect(mockFetch).toHaveBeenCalledTimes(1);
				expect(captures).toHaveLength(1);
				const request = captures[0];
				if (!request) {
					throw new Error(`No request captured for ${operation.key}`);
				}
				expect(request.method).toBe(operation.method);
				const expectedPath = operation.path.replace(
					/\{([^}]+)\}/g,
					(_match, name: string) => {
						const value = (input as Record<string, unknown>)[name];
						if (operation.joinIds && Array.isArray(value)) {
							return value
								.map((id) => encodeURIComponent(String(id)))
								.join(',');
						}
						return encodeURIComponent(String(value));
					},
				);
				expect(`${request.url.origin}${request.url.pathname}`).toBe(
					`${MISSIVE_BASE_URL}${expectedPath}`,
				);
				expect(request.url.pathname).toBe(`/v1${expectedPath}`);
				expect(request.headers.get('authorization')).toBe(AUTH_HEADER);

				if (operation.hasBody) {
					const rawBody = (input as Record<string, unknown>).body;
					const expectedBody = operation.bodyWrapper
						? { [operation.bodyWrapper]: rawBody }
						: rawBody;
					expect(request.body).toBeDefined();
					expect(JSON.parse(String(request.body))).toEqual(expectedBody);
					expect(request.headers.get('content-type')).toContain(
						'application/json',
					);
				} else {
					expect(request.body).toBeUndefined();
				}

				// Declared query params that the fixture sets must reach the wire.
				const inputRecord = input as Record<string, unknown>;
				for (const name of operation.queryParams) {
					if (inputRecord[name] !== undefined) {
						expect(request.url.searchParams.get(name)).toBe(
							String(inputRecord[name]),
						);
					}
				}

				expect(schema.output.safeParse(result).success).toBe(true);
			} finally {
				mockFetch.mockRestore();
			}
		},
	);

	it.each(
		MISSIVE_OPERATIONS.filter(
			(operation) => operation.pathParams.length > 0 || operation.bodyRequired,
		),
	)(
		'%s rejects missing required path/body values before sending a request',
		async (operation) => {
			const schema = missiveEndpointSchemas[operation.key];
			const input = INPUT_FIXTURES[operation.key];
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

	it('encodes reserved characters and traversal in path ids', async () => {
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
				return new Response(JSON.stringify(RESPONSE_FIXTURES['contacts.get']), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				});
			});
		try {
			const handler = handlers.get('contacts.get');
			expect(handler).toBeDefined();
			await handler?.({ id: '../../users' });
			const request = captures[0];
			if (!request) throw new Error('No request captured');
			// The guard is percent-encoding: traversal segments stay inside the
			// contacts path instead of escaping it.
			expect(request.url.pathname).toBe('/v1/contacts/..%2F..%2Fusers');
		} finally {
			mockFetch.mockRestore();
		}
	});
});

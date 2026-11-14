import {
	MemberstackEndpointInputSchemas,
	MemberstackEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { MemberstackContext } from './index';
import { memberstack, memberstackEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue('event'),
	};
});

const api = memberstack().endpoints!;
const context = {
	key: 'test-key',
	options: {},
	db: {},
	endpoints: {},
} as MemberstackContext;
const member = {
	id: 'mem_1',
	auth: { email: 'member@example.com' },
	lastLogin: null,
	stripeCustomerId: null,
	profileImage: null,
	planConnections: [],
};
const table = {
	id: 'tbl_1',
	key: 'products',
	name: 'Products',
	createRule: 'AUTHENTICATED',
	readRule: 'PUBLIC',
	updateRule: 'ADMIN_ONLY',
	deleteRule: 'ADMIN_ONLY',
	createdAt: '2024-01-01',
	updatedAt: '2024-01-01',
	fields: [
		{
			id: 'f1',
			key: 'name',
			name: 'Name',
			type: 'TEXT',
			required: true,
			defaultValue: null,
			tableOrder: 0,
			referencedTableId: null,
		},
	],
};
const record = {
	id: 'rec_1',
	tableKey: 'products',
	data: { price: '29.99' },
	createdAt: '2024-01-01',
	updatedAt: '2024-01-01',
	internalOrder: 123,
};
let fetchMock: jest.SpyInstance;
beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('Unexpected network request');
	});
});
afterEach(() => jest.restoreAllMocks());
// Fixtures represent different endpoint responses, including malformed payloads
// and empty bodies, so a single narrower response type would hide test cases.
function respond(body: unknown) {
	fetchMock.mockResolvedValueOnce(
		body === undefined
			? new Response(null, { status: 200 })
			: new Response(JSON.stringify(body), {
					status: 200,
					headers: { 'content-type': 'application/json' },
				}),
	);
}
function request() {
	const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
	return {
		url: new URL(url),
		init,
		body: init.body == null ? undefined : JSON.parse(String(init.body)),
	};
}

describe('Memberstack public request seam', () => {
	it('exports the schemas used by each registered endpoint', () => {
		const schemas = Object.values(memberstackEndpointSchemas);
		expect(Object.values(MemberstackEndpointInputSchemas)).toHaveLength(
			schemas.length,
		);
		expect(Object.values(MemberstackEndpointOutputSchemas)).toHaveLength(
			schemas.length,
		);
		for (const { input, output } of schemas) {
			expect(Object.values(MemberstackEndpointInputSchemas)).toContain(input);
			expect(Object.values(MemberstackEndpointOutputSchemas)).toContain(output);
		}
	});
	const cases = [
		{
			name: 'list members',
			run: () =>
				api.members.list(context, {
					after: 456,
					first: 10,
					includeJSON: 'true',
				}),
			method: 'GET',
			path: '/members',
			query: { after: '456', first: '10', includeJSON: 'true' },
			response: {
				data: [member],
				totalCount: 1,
				endCursor: 456,
				hasNextPage: false,
			},
		},
		{
			name: 'get member by email',
			run: () =>
				api.members.get(context, {
					id_or_email: 'a+b@example.com',
					include: 'teams',
				}),
			method: 'GET',
			path: '/members/a%2Bb%40example.com',
			query: { include: 'teams' },
			response: { data: null },
		},
		{
			name: 'create member',
			run: () =>
				api.members.create(context, {
					email: 'member@example.com',
					plans: [{ planId: 'pln_1' }],
				}),
			method: 'POST',
			path: '/members',
			body: { email: 'member@example.com', plans: [{ planId: 'pln_1' }] },
			response: { data: member },
		},
		{
			name: 'update member',
			run: () =>
				api.members.update(context, {
					id: 'mem_1',
					customFields: { city: 'Paris' },
				}),
			method: 'PATCH',
			path: '/members/mem_1',
			body: { customFields: { city: 'Paris' } },
			response: { data: member },
		},
		{
			name: 'delete member',
			run: () =>
				api.members.delete(context, {
					id: 'mem_1',
					cancelStripeSubscriptions: true,
				}),
			method: 'DELETE',
			path: '/members/mem_1',
			body: { cancelStripeSubscriptions: true },
			response: { data: { id: 'mem_1' } },
		},
		{
			name: 'add free plan',
			run: () => api.members.addPlan(context, { id: 'mem_1', planId: 'pln_1' }),
			method: 'POST',
			path: '/members/mem_1/add-plan',
			body: { planId: 'pln_1' },
			response: undefined,
		},
		{
			name: 'remove free plan',
			run: () =>
				api.members.removePlan(context, { id: 'mem_1', planId: 'pln_1' }),
			method: 'POST',
			path: '/members/mem_1/remove-plan',
			body: { planId: 'pln_1' },
			response: undefined,
		},
		{
			name: 'verify token',
			run: () => api.members.verifyToken(context, { token: 'jwt' }),
			method: 'POST',
			path: '/members/verify-token',
			body: { token: 'jwt' },
			response: {
				data: {
					id: 'mem_1',
					type: 'member',
					iat: 1,
					exp: 2,
					aud: 'app_1',
					iss: 'https://api.memberstack.com',
				},
			},
		},
		{
			name: 'list tables',
			run: () => api.tables.list(context, {}),
			method: 'GET',
			path: '/v2/data-tables',
			response: { data: { tables: [table] } },
		},
		{
			name: 'get table',
			run: () => api.tables.get(context, { tableKey: 'products' }),
			method: 'GET',
			path: '/v2/data-tables/products',
			response: { data: table },
		},
		{
			name: 'create record',
			run: () =>
				api.records.create(context, {
					tableKey: 'products',
					data: { price: 29.99 },
					memberId: 'mem_1',
				}),
			method: 'POST',
			path: '/v2/data-tables/products/records',
			body: { data: { price: 29.99 }, memberId: 'mem_1' },
			response: { data: record },
		},
		{
			name: 'query records page two',
			run: () =>
				api.records.query(context, {
					tableKey: 'products',
					query: {
						findMany: {
							after: 123,
							take: 20,
							orderBy: { internalOrder: 'asc' },
						},
					},
				}),
			method: 'POST',
			path: '/v2/data-tables/products/records/query',
			body: {
				query: {
					findMany: { after: 123, take: 20, orderBy: { internalOrder: 'asc' } },
				},
			},
			response: {
				data: {
					records: [record],
					pagination: { hasMore: true, limit: 20, endCursor: 123 },
				},
			},
		},
		{
			name: 'update record',
			run: () =>
				api.records.update(context, {
					tableKey: 'products',
					recordId: 'rec_1',
					data: { price: 39.99 },
				}),
			method: 'PUT',
			path: '/v2/data-tables/products/records/rec_1',
			body: { data: { price: 39.99 } },
			response: { data: record },
		},
		{
			name: 'delete record',
			run: () =>
				api.records.delete(context, {
					tableKey: 'products',
					recordId: 'rec_1',
				}),
			method: 'DELETE',
			path: '/v2/data-tables/products/records/rec_1',
			response: { data: record },
		},
	] as const;
	it.each(cases)('$name', async (test) => {
		respond(test.response);
		const result = await test.run();
		const sent = request();
		expect(sent.url.origin).toBe('https://admin.memberstack.com');
		expect(sent.url.pathname).toBe(test.path);
		expect(sent.init.method).toBe(test.method);
		expect(new Headers(sent.init.headers).get('x-api-key')).toBe('test-key');
		expect(sent.body).toEqual('body' in test ? test.body : undefined);
		if ('query' in test)
			expect(Object.fromEntries(sent.url.searchParams)).toEqual(test.query);
		expect(result).toEqual(test.response);
	});
	it('sends no body for a basic member delete', async () => {
		respond({ data: { id: 'mem_1' } });
		await api.members.delete(context, { id: 'mem_1' });
		expect(request().body).toBeUndefined();
	});
	it.each(['', '.', '..', 'bad/path', 'bad\\path', 'bad"path', "bad'path"])(
		'rejects unsafe route segment %s',
		async (id) => {
			await expect(
				api.members.get(context, { id_or_email: id }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
	it('rejects missing credentials before any request', async () => {
		await expect(
			api.tables.list({ ...context, key: '' }, {}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('does not replay writes on 429 and preserves Retry-After', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					code: 'generic-message',
					message: 'Too many requests',
				}),
				{
					status: 429,
					headers: { 'content-type': 'application/json', 'retry-after': '2' },
				},
			),
		);
		// Rejections can contain any thrown value; the assertions narrow its shape.
		const error = await api.members
			.create(context, { email: 'member@example.com' })
			.catch((e: unknown) => e);
		expect(error).toMatchObject({ status: 429, retryAfter: 2000 });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error as Error)).toBe(true);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
	it('rejects malformed output instead of inventing a member', async () => {
		respond({ data: {} });
		await expect(
			api.members.get(context, { id_or_email: 'mem_1' }),
		).rejects.toThrow();
	});
	it('validates both query styles and prevents invalid pagination', () => {
		const schema = memberstackEndpointSchemas['records.query'].input;
		expect(
			schema.safeParse({
				tableKey: 'products',
				query: { findUnique: { where: { id: 'rec_1' } } },
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				tableKey: 'products',
				query: { findMany: { skip: 1, after: 5 } },
			}).success,
		).toBe(false);
		expect(
			schema.safeParse({
				tableKey: 'products',
				query: { findMany: {}, findUnique: { where: { id: 'rec_1' } } },
			}).success,
		).toBe(false);
	});
});

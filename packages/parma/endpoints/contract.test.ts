import { ApiError } from 'corsair/http';
import { errorHandlers } from '../error-handlers';
import type { ParmaContext } from '../index';
import { parma } from '../index';

const plugin = parma({ key: 'secret-token' });
if (!plugin.endpoints) throw new Error('Missing Parma endpoints');
const endpoints = plugin.endpoints;
const ctx = { key: 'secret-token' } as ParmaContext;
const time = '2025-06-17T00:09:41.408Z';
const timestamps = { created_at: time, updated_at: time };
const deal = {
	id: 197,
	name: 'Deal',
	amount: null,
	status: 'open',
	relationship_id: 1002,
	pipeline_id: 575,
	stage_id: 1091,
	owned_by_id: 3430,
	...timestamps,
	closed_at: null,
};
const group = {
	id: 601,
	name: 'Group B',
	properties: [{ id: 452, name: 'Field 3', type: 'text' }],
};
const note = {
	id: 134,
	body: 'Note body one',
	datetime: time,
	relationship_ids: [1013],
	...timestamps,
};
const pipeline = { id: 584, name: 'pipeline', position: 1, ...timestamps };
const stage = { ...pipeline, pipeline_id: 590 };
const membership = { id: 322, group_id: 630, ...timestamps };
const relationship = {
	id: 1156,
	name: 'Relationship',
	type: 'person',
	about: '',
	company_id: null,
	group_ids: [],
	contact_details: [],
	properties: [],
	...timestamps,
};
const user = { id: 4079, name: 'Tad Haley', email: 'deloris@hammes.example' };
const one = (data: unknown) => ({ data });
const list = (data: unknown) => ({ data: [data] });

type Case = {
	name: string;
	run: () => Promise<unknown>;
	method: string;
	path: string;
	body?: unknown;
	result?: unknown;
	status?: number;
};
const cases: Case[] = [
	{
		name: 'deals.list',
		run: () => endpoints.deals.list(ctx, { page: '2' }),
		method: 'GET',
		path: '/api/v1/deals?page=2',
		result: list(deal),
	},
	{
		name: 'deals.get',
		run: () => endpoints.deals.get(ctx, { id: 'a b' }),
		method: 'GET',
		path: '/api/v1/deals/a%20b',
		result: one(deal),
	},
	{
		name: 'groups.list',
		run: () => endpoints.groups.list(ctx, { query: 'Team A' }),
		method: 'GET',
		path: '/api/v1/groups?query=Team%20A',
		result: list(group),
	},
	{
		name: 'notes.list',
		run: () => endpoints.notes.list(ctx, { page: '2' }),
		method: 'GET',
		path: '/api/v1/notes?page=2',
		result: list(note),
	},
	{
		name: 'notes.create',
		run: () =>
			endpoints.notes.create(ctx, { body: 'text', relationship_ids: [1] }),
		method: 'POST',
		path: '/api/v1/notes',
		body: { body: 'text', relationship_ids: [1] },
		result: one(note),
		status: 201,
	},
	{
		name: 'notes.update',
		run: () => endpoints.notes.update(ctx, { id: '1', body: 'new' }),
		method: 'PATCH',
		path: '/api/v1/notes/1',
		body: { body: 'new' },
		result: one(note),
		status: 201,
	},
	{
		name: 'pipelines.list',
		run: () => endpoints.pipelines.list(ctx, {}),
		method: 'GET',
		path: '/api/v1/pipelines',
		result: list(pipeline),
	},
	{
		name: 'pipelines.get',
		run: () => endpoints.pipelines.get(ctx, { id: '1' }),
		method: 'GET',
		path: '/api/v1/pipelines/1',
		result: one(pipeline),
	},
	{
		name: 'relationships.list',
		run: () =>
			endpoints.relationships.list(ctx, {
				page: '2',
				email: 'a+b@example.com',
			}),
		method: 'GET',
		path: '/api/v1/relationships?page=2&email=a%2Bb%40example.com',
		result: list(relationship),
	},
	{
		name: 'relationships.create',
		run: () =>
			endpoints.relationships.create(ctx, {
				name: 'Test',
				group_ids: [1],
				type: 'person',
			}),
		method: 'POST',
		path: '/api/v1/relationships',
		body: { name: 'Test', type: 'person', group_ids: [1] },
		result: one(relationship),
		status: 201,
	},
	{
		name: 'relationships.get',
		run: () => endpoints.relationships.get(ctx, { id: '1' }),
		method: 'GET',
		path: '/api/v1/relationships/1',
		result: one(relationship),
	},
	{
		name: 'relationships.update',
		run: () =>
			endpoints.relationships.update(ctx, {
				id: '1',
				properties: [{ id: 2, value: 'value' }],
			}),
		method: 'PATCH',
		path: '/api/v1/relationships/1',
		body: { properties: [{ id: 2, value: 'value' }] },
		result: one(relationship),
	},
	{
		name: 'relationships.delete',
		run: () => endpoints.relationships.delete(ctx, { id: '1' }),
		method: 'DELETE',
		path: '/api/v1/relationships/1',
		status: 204,
	},
	{
		name: 'relationships.listGroups',
		run: () =>
			endpoints.relationships.listGroups(ctx, { relationship_id: '1' }),
		method: 'GET',
		path: '/api/v1/relationships/1/groups',
		result: list(membership),
	},
	{
		name: 'relationships.addGroup',
		run: () =>
			endpoints.relationships.addGroup(ctx, {
				relationship_id: '1',
				group_id: 2,
			}),
		method: 'POST',
		path: '/api/v1/relationships/1/groups',
		body: { group_id: 2 },
		result: one(membership),
		status: 201,
	},
	{
		name: 'relationships.removeGroup',
		run: () =>
			endpoints.relationships.removeGroup(ctx, {
				relationship_id: '1',
				relationship_group_id: '2',
			}),
		method: 'DELETE',
		path: '/api/v1/relationships/1/groups/2',
		status: 204,
	},
	{
		name: 'relationships.listNotes',
		run: () =>
			endpoints.relationships.listNotes(ctx, {
				relationship_id: '1',
				page: '2',
			}),
		method: 'GET',
		path: '/api/v1/relationships/1/notes?page=2',
		result: list(note),
	},
	{
		name: 'stages.list',
		run: () => endpoints.stages.list(ctx, {}),
		method: 'GET',
		path: '/api/v1/stages',
		result: list(stage),
	},
	{
		name: 'stages.get',
		run: () => endpoints.stages.get(ctx, { id: '1' }),
		method: 'GET',
		path: '/api/v1/stages/1',
		result: one(stage),
	},
	{
		name: 'users.list',
		run: () => endpoints.users.list(ctx, {}),
		method: 'GET',
		path: '/api/v1/users',
		result: list(user),
	},
	{
		name: 'users.get',
		run: () => endpoints.users.get(ctx, { id: '1' }),
		method: 'GET',
		path: '/api/v1/users/1',
		result: one(user),
	},
	{
		name: 'users.me',
		run: () => endpoints.users.me(ctx, {}),
		method: 'GET',
		path: '/api/v1/users/me',
		result: one({ user, account: { id: 454, name: 'Workspace' } }),
	},
];

afterEach(() => jest.restoreAllMocks());

test.each(cases)(
	'$name forwards the documented request and parses the result',
	async ({ run, method, path, body, result, status = 200 }) => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(status === 204 ? null : JSON.stringify(result), {
				status,
				headers: { 'content-type': 'application/json' },
			}),
		);
		await expect(run()).resolves.toEqual(result);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, options] = fetchMock.mock.calls[0]!;
		expect(url).toBe(`https://app.parma.ai${path}`);
		expect(options?.method).toBe(method);
		expect(new Headers(options?.headers).get('authorization')).toBe(
			'Bearer secret-token',
		);
		expect(options?.body).toEqual(
			body === undefined ? undefined : JSON.stringify(body),
		);
	},
);

test.each(['', '.', '..', '/', '\\', "'", '"', 'abc/def'])(
	'rejects unsafe route ID %s before transport',
	async (id) => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(endpoints.deals.get(ctx, { id })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	},
);

test('rejects missing credentials and invalid request bodies', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch');
	await expect(
		endpoints.users.me({ key: '' } as ParmaContext, {}),
	).rejects.toThrow('token is required');
	await expect(
		endpoints.notes.create(ctx, { body: 'note' } as never),
	).rejects.toThrow();
	expect(fetchMock).not.toHaveBeenCalled();
});

test('preserves rate-limit headers without replaying writes', async () => {
	const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
		new Response(JSON.stringify({ error: 'limited' }), {
			status: 429,
			headers: { 'content-type': 'application/json', 'retry-after': '7' },
		}),
	);
	let thrown: unknown;
	try {
		await endpoints.notes.create(ctx, { body: 'text', relationship_ids: [1] });
	} catch (error) {
		thrown = error;
	}
	expect(thrown).toBeInstanceOf(ApiError);
	expect((thrown as ApiError).retryAfter).toBe(7000);
	expect(fetchMock).toHaveBeenCalledTimes(1);
	const handler = errorHandlers.RATE_LIMIT_ERROR;
	expect(handler.match(thrown as Error)).toBe(true);
	await expect(handler.handler(thrown as Error)).resolves.toEqual({
		maxRetries: 0,
		headersRetryAfterMs: 7000,
	});
});

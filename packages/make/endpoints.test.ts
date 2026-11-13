import { createCorsair, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { make } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

type Endpoint = (ctx: never, input: never) => Promise<unknown>;
const endpoints = make({ zone: 'eu1', key: 'test-token' }).endpoints!.scenarios;
const id = { scenarioId: 123 };
const scenario = { scenario: { id: 123, name: 'Example', folderId: null } };
const cases: Array<
	[keyof typeof endpoints, unknown, string, string, unknown, unknown?]
> = [
	[
		'list',
		{ teamId: 7, 'pg[offset]': 20, 'cols[]': ['id', 'name'] },
		'GET',
		'/scenarios',
		{ scenarios: [scenario.scenario], pg: { offset: 20 } },
	],
	[
		'create',
		{ body: { blueprint: '{}', teamId: 7, scheduling: '{}' } },
		'POST',
		'/scenarios',
		scenario,
		{ blueprint: '{}', teamId: 7, scheduling: '{}' },
	],
	[
		'countTrash',
		{ teamId: 7 },
		'GET',
		'/scenarios/trash/count',
		{ scenariosTrashedTotal: 1 },
	],
	[
		'moveToTrash',
		{ body: { teamId: 7, scenarioIds: [123] } },
		'POST',
		'/scenarios/move-to-trash',
		{
			trashedScenarioIds: [123],
			rejectedScenarios: [],
			summary: { total: 1, trashed: 1, rejected: 0 },
		},
		{ teamId: 7, scenarioIds: [123] },
	],
	['get', id, 'GET', '/scenarios/123', scenario],
	['delete', id, 'DELETE', '/scenarios/123', { scenario: 123 }],
	[
		'update',
		{ ...id, body: { folderId: null } },
		'PATCH',
		'/scenarios/123',
		scenario,
		{ folderId: null },
	],
	[
		'getTriggers',
		id,
		'GET',
		'/scenarios/123/triggers',
		{ id: 1, name: 'hook' },
	],
	[
		'clone',
		{
			...id,
			organizationId: 9,
			body: { name: 'Copy', teamId: 7, states: false },
		},
		'POST',
		'/scenarios/123/clone',
		scenario,
		{ name: 'Copy', teamId: 7, states: false },
	],
	[
		'restore',
		id,
		'POST',
		'/scenarios/123/restore',
		{
			scenario: { id: 123, deleted: false, deletedAt: null },
			strippedModules: [],
		},
	],
	[
		'getModuleData',
		{ ...id, moduleId: 2 },
		'GET',
		'/scenarios/123/data/2',
		{ exists: true },
	],
	[
		'activate',
		id,
		'POST',
		'/scenarios/123/start',
		{ scenario: { id: 123, isActive: true } },
	],
	[
		'deactivate',
		id,
		'POST',
		'/scenarios/123/stop',
		{ scenario: { id: 123, isActive: false } },
	],
	[
		'run',
		{ ...id, body: { responsive: false } },
		'POST',
		'/scenarios/123/run',
		{ executionId: 'abc' },
		{ responsive: false },
	],
	[
		'replay',
		{ ...id, body: { executionIds: ['a'.repeat(32)] } },
		'POST',
		'/scenarios/123/replay',
		{ executionId: 'next', replayed: [], failed: [] },
		{ executionIds: ['a'.repeat(32)] },
	],
	[
		'getInterface',
		id,
		'GET',
		'/scenarios/123/interface',
		{ interface: { input: [] } },
	],
	[
		'updateInterface',
		{ ...id, body: { interface: { input: [] } } },
		'PATCH',
		'/scenarios/123/interface',
		{ interface: { input: [] } },
		{ interface: { input: [] } },
	],
	[
		'getUsage',
		id,
		'GET',
		'/scenarios/123/usage',
		{ data: [{ date: '2026-01-01', operations: 3 }] },
	],
	[
		'listBuildVariables',
		id,
		'GET',
		'/scenarios/123/build-variables',
		{ variables: { foo: 'bar' } },
	],
	[
		'addBuildVariables',
		{ ...id, body: { input: [{ name: 'x', value: 'TAC_1' }] } },
		'POST',
		'/scenarios/123/build-variables',
		{ ok: 1 },
		{ input: [{ name: 'x', value: 'TAC_1' }] },
	],
	[
		'updateBuildVariables',
		{ ...id, body: { input: [{ name: 'x', value: 'TAC_2' }] } },
		'PUT',
		'/scenarios/123/build-variables',
		{ ok: 1 },
		{ input: [{ name: 'x', value: 'TAC_2' }] },
	],
	[
		'deleteBuildVariable',
		{ ...id, value: 'TAC_1' },
		'DELETE',
		'/scenarios/123/build-variables',
		{ ok: 1 },
	],
	[
		'listAiAgents',
		{ teamId: 7, 'pg[offset]': 10 },
		'GET',
		'/scenarios/ai-agents',
		{ scenarios: [{ id: 1, description: null }], pg: { offset: 10 } },
	],
	[
		'getAiAgentModules',
		{ teamId: 7, body: { scenarioIds: [123] } },
		'POST',
		'/scenarios/ai-agents/modules',
		{ agentModules: [{ id: 1, userLabel: null }] },
		{ scenarioIds: [123] },
	],
];

describe('Make scenario public endpoints', () => {
	let fetchMock: jest.SpyInstance;
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});
	// Keep six columns even for bodyless requests, so Jest does not inject a done callback.
	it.each(
		cases.map(
			([name, input, method, path, response, body]) =>
				[name, input, method, path, response, body] as const,
		),
	)(
		'%s sends and parses the documented request',
		async (name, input, method, path, response, body) => {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(response), {
					status: name === 'replay' ? 202 : 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			const endpoint: Endpoint = endpoints[name];
			const result = await endpoint(
				{ key: 'test-token', options: { zone: 'eu1' } } as never,
				input as never,
			);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const parsed = new URL(url);
			expect(parsed.origin).toBe('https://eu1.make.com');
			expect(parsed.pathname).toBe(`/api/v2${path}`);
			expect(init.method).toBe(method);
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Token test-token',
			);
			expect(init.body ? JSON.parse(String(init.body)) : undefined).toEqual(
				body,
			);
			expect(result).toEqual(response);
			if (name === 'list') {
				expect(parsed.searchParams.get('pg[offset]')).toBe('20');
				expect(parsed.searchParams.getAll('cols[]')).toEqual(['id', 'name']);
			}
		},
	);
	it('rejects invalid paths and missing credentials', async () => {
		await expect(
			endpoints.get(
				{ key: 'test-token', options: { zone: 'eu1' } } as never,
				{ scenarioId: '../' } as never,
			),
		).rejects.toThrow();
		await expect(
			endpoints.get({ key: '', options: { zone: 'eu1' } } as never, {
				scenarioId: 1,
			}),
		).rejects.toThrow('token');
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('rejects duplicate IDs and extra trash fields before sending', async () => {
		const ctx = { key: 'test-token', options: { zone: 'eu1' } } as never;
		await expect(
			endpoints.moveToTrash(ctx, { body: { teamId: 7, scenarioIds: [1, 1] } }),
		).rejects.toThrow();
		await expect(
			endpoints.moveToTrash(ctx, {
				body: { teamId: 7, scenarioIds: [1], unexpected: true },
			} as never),
		).rejects.toThrow();
		await expect(
			endpoints.replay(ctx, {
				...id,
				body: { executionIds: ['a'.repeat(32), 'a'.repeat(32)] },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('requires a supported zone before sending credentials', async () => {
		await expect(
			endpoints.get({ key: 'test-token', options: {} } as never, id),
		).rejects.toThrow('zone');
		await expect(
			endpoints.get(
				{ key: 'test-token', options: { zone: 'evil.example' } } as never,
				id,
			),
		).rejects.toThrow('zone');
		await expect(
			endpoints.get(
				{ key: 'test-token', options: { zone: 'constructor' } } as never,
				id,
			),
		).rejects.toThrow('zone');
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('forwards later AI-agent pages and build-variable values', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ scenarios: [] }), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await endpoints.listAiAgents(
			{ key: 'test-token', options: { zone: 'us2' } } as never,
			{ teamId: 7, 'pg[offset]': 20, 'pg[limit]': 10 },
		);
		const first = new URL(fetchMock.mock.calls[0][0] as string);
		expect(first.origin).toBe('https://us2.make.com');
		expect(first.searchParams.get('pg[offset]')).toBe('20');
		expect(first.searchParams.get('pg[limit]')).toBe('10');
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ ok: 1 }), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await endpoints.deleteBuildVariable(
			{ key: 'test-token', options: { zone: 'eu1' } } as never,
			{ ...id, value: 'TAC_1' },
		);
		expect(
			new URL(fetchMock.mock.calls[1][0] as string).searchParams.get('value'),
		).toBe('TAC_1');
	});
	it('binds credentials and zone through the public Corsair API', async () => {
		const corsair = createCorsair({
			plugins: [make({ key: 'bound-token', zone: 'eu2' })],
		});
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(scenario), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(corsair.make.api.scenarios.get(id)).resolves.toEqual(scenario);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new URL(url).origin).toBe('https://eu2.make.com');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Token bound-token',
		);
	});
	it('does not retry a quota error through the bound Corsair API', async () => {
		const corsair = createCorsair({
			plugins: [make({ key: 'bound-token', zone: 'eu1' })],
		});
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ code: 'IM310' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '7' },
			}),
		);
		await expect(corsair.make.api.scenarios.run(id)).rejects.toMatchObject({
			status: 429,
			retryAfter: 7000,
			body: { code: 'IM310' },
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
	it('does not retry quota errors and preserves Retry-After', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({ code: 'IM310', message: 'Quota exceeded' }),
				{
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '7' },
				},
			),
		);
		let caught: unknown;
		try {
			await endpoints.run(
				{ key: 'test-token', options: { zone: 'eu1' } } as never,
				id,
			);
		} catch (error) {
			caught = error;
		}
		expect(caught).toBeInstanceOf(ApiError);
		expect(caught).toMatchObject({
			status: 429,
			retryAfter: 7000,
			body: { code: 'IM310' },
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
	it('passes provider errors through without replaying writes', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ code: 'SC409' }), {
				status: 409,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await expect(
			endpoints.update(
				{ key: 'test-token', options: { zone: 'eu1' } } as never,
				{ ...id, body: { name: 'changed' } },
			),
		).rejects.toMatchObject({ status: 409, body: { code: 'SC409' } });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
	it('logs no input or output data', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(scenario), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await endpoints.get(
			{ key: 'test-token', options: { zone: 'eu1' } } as never,
			id,
		);
		expect(logEventFromContext).toHaveBeenCalledWith(
			expect.anything(),
			'make.scenarios.get',
			{},
			'completed',
		);
	});
});

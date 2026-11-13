import { createCorsair, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { MakeContext, MakePluginOptions } from './index';
import {
	MakeEndpointInputSchemas,
	MakeEndpointOutputSchemas,
	make,
	makeEndpointSchemas,
} from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const endpoints = make({ zone: 'eu1', key: 'test-token' }).endpoints!.scenarios;
const context = (
	options: MakePluginOptions = { zone: 'eu1' },
	key = 'test-token',
): MakeContext => ({
	key,
	options,
	endpoints: {},
	db: {},
	keys: {
		get_dek: async () => 'test-dek',
		issue_new_dek: async () => 'test-dek',
		get_api_key: async () => key,
		set_api_key: async () => {},
		get_webhook_signature: async () => null,
		set_webhook_signature: async () => {},
	},
	$getAccountId: async () => 'test-account',
});
const id = { scenarioId: 123 };
const scenario = { scenario: { id: 123, name: 'Example', folderId: null } };
// Responses and bodies differ by operation and are compared as JSON fixtures;
// their concrete shape cannot be represented by one common endpoint type.
type TestCase = {
	name: keyof typeof endpoints;
	run: () => Promise<unknown>;
	method: string;
	path: string;
	response: unknown;
	body?: unknown;
};
function testCase<K extends keyof typeof endpoints>(
	name: K,
	input: Parameters<(typeof endpoints)[K]>[1],
	method: string,
	path: string,
	response: unknown,
	body?: unknown,
): TestCase {
	// This closure preserves each endpoint/input pairing when heterogeneous cases
	// enter the table; the generic call is checked against that endpoint's input.
	const run = () => {
		// TypeScript cannot correlate a generic indexed function with its argument;
		// the generic parameter above enforces the matching pair at every call site.
		const endpoint = endpoints[name] as (
			ctx: MakeContext,
			value: Parameters<(typeof endpoints)[K]>[1],
		) => Promise<unknown>;
		return endpoint(context(), input);
	};
	return { name, run, method, path, response, body };
}
const cases: TestCase[] = [
	testCase(
		'list',
		{ teamId: 7, 'pg[offset]': 20, 'cols[]': ['id', 'name'] },
		'GET',
		'/scenarios',
		{ scenarios: [scenario.scenario], pg: { offset: 20 } },
	),
	testCase(
		'create',
		{ body: { blueprint: '{}', teamId: 7, scheduling: '{}' } },
		'POST',
		'/scenarios',
		scenario,
		{ blueprint: '{}', teamId: 7, scheduling: '{}' },
	),
	testCase('countTrash', { teamId: 7 }, 'GET', '/scenarios/trash/count', {
		scenariosTrashedTotal: 1,
	}),
	testCase(
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
	),
	testCase('get', id, 'GET', '/scenarios/123', scenario),
	testCase('delete', id, 'DELETE', '/scenarios/123', { scenario: 123 }),
	testCase(
		'update',
		{ ...id, body: { folderId: null } },
		'PATCH',
		'/scenarios/123',
		scenario,
		{ folderId: null },
	),
	testCase('getTriggers', id, 'GET', '/scenarios/123/triggers', {
		id: 1,
		name: 'hook',
	}),
	testCase(
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
	),
	testCase('restore', id, 'POST', '/scenarios/123/restore', {
		scenario: { id: 123, deleted: false, deletedAt: null },
		strippedModules: [],
	}),
	testCase(
		'getModuleData',
		{ ...id, moduleId: 2 },
		'GET',
		'/scenarios/123/data/2',
		{ exists: true },
	),
	testCase('activate', id, 'POST', '/scenarios/123/start', {
		scenario: { id: 123, isActive: true },
	}),
	testCase('deactivate', id, 'POST', '/scenarios/123/stop', {
		scenario: { id: 123, isActive: false },
	}),
	testCase(
		'run',
		{ ...id, body: { responsive: false } },
		'POST',
		'/scenarios/123/run',
		{ executionId: 'abc' },
		{ responsive: false },
	),
	testCase(
		'replay',
		{ ...id, body: { executionIds: ['a'.repeat(32)] } },
		'POST',
		'/scenarios/123/replay',
		{ executionId: 'next', replayed: [], failed: [] },
		{ executionIds: ['a'.repeat(32)] },
	),
	testCase('getInterface', id, 'GET', '/scenarios/123/interface', {
		interface: { input: [] },
	}),
	testCase(
		'updateInterface',
		{ ...id, body: { interface: { input: [] } } },
		'PATCH',
		'/scenarios/123/interface',
		{ interface: { input: [] } },
		{ interface: { input: [] } },
	),
	testCase('getUsage', id, 'GET', '/scenarios/123/usage', {
		data: [{ date: '2026-01-01', operations: 3 }],
	}),
	testCase('listBuildVariables', id, 'GET', '/scenarios/123/build-variables', {
		variables: { foo: 'bar' },
	}),
	testCase(
		'addBuildVariables',
		{ ...id, body: { input: [{ name: 'x', value: 'TAC_1' }] } },
		'POST',
		'/scenarios/123/build-variables',
		{ ok: 1 },
		{ input: [{ name: 'x', value: 'TAC_1' }] },
	),
	testCase(
		'updateBuildVariables',
		{ ...id, body: { input: [{ name: 'x', value: 'TAC_2' }] } },
		'PUT',
		'/scenarios/123/build-variables',
		{ ok: 1 },
		{ input: [{ name: 'x', value: 'TAC_2' }] },
	),
	testCase(
		'deleteBuildVariable',
		{ ...id, value: 'TAC_1' },
		'DELETE',
		'/scenarios/123/build-variables',
		{ ok: 1 },
	),
	testCase(
		'listAiAgents',
		{ teamId: 7, 'pg[offset]': 10 },
		'GET',
		'/scenarios/ai-agents',
		{ scenarios: [{ id: 1, description: null }], pg: { offset: 10 } },
	),
	testCase(
		'getAiAgentModules',
		{ teamId: 7, body: { scenarioIds: [123] } },
		'POST',
		'/scenarios/ai-agents/modules',
		{ agentModules: [{ id: 1, userLabel: null }] },
		{ scenarioIds: [123] },
	),
];

describe('Make scenario public endpoints', () => {
	it('exports schema maps that match every registered scenario endpoint', () => {
		const names = Object.keys(endpoints).sort();
		expect(names).toHaveLength(24);
		expect(Object.keys(MakeEndpointInputSchemas).sort()).toEqual(names);
		expect(Object.keys(MakeEndpointOutputSchemas).sort()).toEqual(names);
		expect(Object.keys(makeEndpointSchemas).sort()).toEqual(
			names.map((name) => `scenarios.${name}`).sort(),
		);
		for (const [path, registered] of Object.entries(makeEndpointSchemas)) {
			const name = path.slice('scenarios.'.length);
			expect(Object.entries(MakeEndpointInputSchemas)).toContainEqual([
				name,
				registered.input,
			]);
			expect(Object.entries(MakeEndpointOutputSchemas)).toContainEqual([
				name,
				registered.output,
			]);
		}
	});
	let fetchMock: jest.SpyInstance;
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});
	it.each(cases)(
		'$name sends and parses the documented request',
		async ({ name, run, method, path, response, body }) => {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(response), {
					status: name === 'replay' ? 202 : 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			const result = await run();
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
				context(),
				// @ts-expect-error Exercise validation of an invalid untyped caller's input.
				{ scenarioId: '../' },
			),
		).rejects.toThrow();
		await expect(
			endpoints.get(context({ zone: 'eu1' }, ''), {
				scenarioId: 1,
			}),
		).rejects.toThrow('token');
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('rejects duplicate IDs and extra trash fields before sending', async () => {
		const ctx = context();
		await expect(
			endpoints.moveToTrash(ctx, { body: { teamId: 7, scenarioIds: [1, 1] } }),
		).rejects.toThrow();
		await expect(
			endpoints.moveToTrash(ctx, {
				// @ts-expect-error Exercise strict parsing for an untyped caller.
				body: { teamId: 7, scenarioIds: [1], unexpected: true },
			}),
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
		await expect(endpoints.get(context({}), id)).rejects.toThrow('zone');
		await expect(
			endpoints.get(
				context({
					// @ts-expect-error Exercise runtime rejection of an unsupported zone.
					zone: 'evil.example',
				}),
				id,
			),
		).rejects.toThrow('zone');
		await expect(
			endpoints.get(
				context({
					// @ts-expect-error Exercise runtime rejection of inherited object keys.
					zone: 'constructor',
				}),
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
		await endpoints.listAiAgents(context({ zone: 'us2' }), {
			teamId: 7,
			'pg[offset]': 20,
			'pg[limit]': 10,
		});
		const first = new URL(fetchMock.mock.calls[0][0] as string);
		expect(first.origin).toBe('https://us2.make.com');
		expect(first.searchParams.get('pg[offset]')).toBe('20');
		expect(first.searchParams.get('pg[limit]')).toBe('10');
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ ok: 1 }), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await endpoints.deleteBuildVariable(context(), { ...id, value: 'TAC_1' });
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
		// JavaScript can throw any value; narrow the caught value via Jest's assertions.
		let caught: unknown;
		try {
			await endpoints.run(context(), id);
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
			endpoints.update(context(), { ...id, body: { name: 'changed' } }),
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
		await endpoints.get(context(), id);
		expect(logEventFromContext).toHaveBeenCalledWith(
			expect.anything(),
			'make.scenarios.get',
			{},
			'completed',
		);
	});
});

import {
	AuthMissingError,
	createCorsair,
	logEventFromContext,
} from 'corsair/core';
import { ApiError } from 'corsair/http';
import type {
	MakeContext,
	MakeKeyBuilderContext,
	MakePluginOptions,
} from './index';
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
	storedZone: string | null = null,
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
		get_zone: async () => storedZone,
		set_zone: async () => {},
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
	it("uses the connected account's stored zone when no zone option is set", async () => {
		for (const [stored, origin] of [
			['us1', 'https://us1.make.com'],
			[' EU2 ', 'https://eu2.make.com'],
			['https://us2.make.com/', 'https://us2.make.com'],
			['eu1.make.celonis.com', 'https://eu1.make.celonis.com'],
		] as const) {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(scenario), {
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			await endpoints.get(context({}, 'test-token', stored), id);
			expect(new URL(fetchMock.mock.calls.at(-1)![0] as string).origin).toBe(
				origin,
			);
		}
	});
	it('lets the zone option override the stored zone', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(scenario), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		await endpoints.get(context({ zone: 'us2' }, 'test-token', 'eu1'), id);
		expect(new URL(fetchMock.mock.calls[0][0] as string).origin).toBe(
			'https://us2.make.com',
		);
	});
	it('rejects a missing or unknown stored zone before sending credentials', async () => {
		await expect(endpoints.get(context({}), id)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		await expect(
			endpoints.get(context({}, 'test-token', 'evil.example'), id),
		).rejects.toThrow('zone');
		await expect(
			endpoints.get(context({}, 'test-token', 'eu1.make.com.evil.example'), id),
		).rejects.toThrow('zone');
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('asks for a connect link in the key builder when the account has no zone', async () => {
		// A key-builder auth error is the one core turns into a connect link, so
		// a token without a zone must fail there, not later in the endpoint.
		const keyBuilder = make().keyBuilder!;
		const keyCtx = (storedZone: string | null): MakeKeyBuilderContext => ({
			authType: 'api_key',
			options: {},
			tenantId: 'default',
			// The account key manager also has setters and key-rotation methods
			// the key builder never calls, so only the two getters it reads are
			// stubbed and the cast is limited to `keys`.
			keys: {
				get_api_key: async () => 'stored-token',
				get_zone: async () => storedZone,
			} as unknown as MakeKeyBuilderContext['keys'],
		});
		await expect(keyBuilder(keyCtx(null), 'endpoint')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		await expect(keyBuilder(keyCtx('eu1'), 'endpoint')).resolves.toBe(
			'stored-token',
		);
		const zoned: MakePluginOptions = { zone: 'us2' };
		await expect(
			make(zoned).keyBuilder!(keyCtx(null), 'endpoint'),
		).resolves.toBe('stored-token');
	});
	it('declares zone as an account field of the api_key auth', () => {
		expect(make().authConfig).toEqual({ api_key: { account: ['zone'] } });
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

describe('Make responses and settings from the API reference', () => {
	let fetchMock: jest.SpyInstance;
	const reply = (body: object) =>
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		jest.restoreAllMocks();
	});
	// Trimmed from the "Get scenario details" example in Make's reference.
	const documented = {
		id: 925,
		name: 'New scenario',
		teamId: 215,
		hookId: null,
		devices: [],
		deviceId: null,
		deviceScope: null,
		concept: false,
		description: '',
		folderId: null,
		folderPath: null,
		isActive: false,
		nextExec: null,
		type: 'scenario',
		chainingRole: null,
	};
	it('parses the null hookId, deviceId, deviceScope and nextExec Make returns', async () => {
		reply({ scenario: documented });
		await expect(endpoints.get(context(), id)).resolves.toEqual({
			scenario: documented,
		});
		reply({ scenarios: [documented], pg: { offset: 0, limit: 10 } });
		await expect(endpoints.list(context(), { teamId: 215 })).resolves.toEqual({
			scenarios: [documented],
			pg: { offset: 0, limit: 10 },
		});
	});
	it('accepts enum values Make adds later in responses', async () => {
		const later = {
			...documented,
			type: 'agent',
			labels: [{ id: 1, colour: 'teal', scope: 'organization' }],
		};
		reply({ scenario: later });
		await expect(endpoints.get(context(), id)).resolves.toEqual({
			scenario: later,
		});
		reply({ agentModules: [{ id: 1, evaluationMode: 'sampled' }] });
		await expect(
			endpoints.getAiAgentModules(context(), { teamId: 7 }),
		).resolves.toEqual({
			agentModules: [{ id: 1, evaluationMode: 'sampled' }],
		});
	});
	it('waits past the 40 s window for responsive runs and for replays', async () => {
		const timeout = jest.spyOn(AbortSignal, 'timeout');
		reply({ executionId: 'a'.repeat(32), status: '1' });
		await endpoints.run(context(), { ...id, body: { responsive: true } });
		expect(timeout).toHaveBeenLastCalledWith(60_000);
		reply({ executionId: 'a'.repeat(32) });
		await endpoints.run(context(), { ...id, body: { responsive: false } });
		expect(timeout).toHaveBeenLastCalledWith(20_000);
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					executionId: 'b'.repeat(32),
					replayed: [],
					failed: [],
				}),
				{ status: 202, headers: { 'Content-Type': 'application/json' } },
			),
		);
		await endpoints.replay(context(), {
			...id,
			body: { executionIds: ['a'.repeat(32)] },
		});
		expect(timeout).toHaveBeenLastCalledWith(60_000);
	});
	it('parses a live clone response with null updatedByUser and isShared', async () => {
		// Trimmed from a live clone on a Make free plan (eu1, 11-15).
		const cloned = {
			scenario: {
				id: 8578883,
				name: 'corsair-plugin-test-clone',
				teamId: 3625807,
				hookId: null,
				devices: [],
				deviceId: null,
				deviceScope: null,
				description: '',
				folderId: null,
				slots: null,
				usedPackages: ['util'],
				scheduling: { type: 'on-demand' },
				createdByUser: { id: 1, name: 'Test User' },
				updatedByUser: null,
				nextExec: null,
				chainingRole: 'none',
				type: 'scenario',
				isShared: null,
				isActive: false,
			},
		};
		reply(cloned);
		await expect(
			endpoints.clone(context(), {
				...id,
				organizationId: 9,
				body: { name: 'corsair-plugin-test-clone', teamId: 7, states: false },
			}),
		).resolves.toEqual(cloned);
	});
	it('parses the numeric status a live responsive run returns', async () => {
		// Live response from a responsive run on a Make free plan (eu1, 11-15).
		const live = { executionId: 'd5ace0f5ff754d34a393a4c558499019', status: 1 };
		reply(live);
		await expect(
			endpoints.run(context(), { ...id, body: { responsive: true } }),
		).resolves.toEqual(live);
	});
	it('marks replace-all and delete of build variables as destructive', () => {
		const meta = make({ zone: 'eu1' }).endpointMeta!;
		expect(meta['scenarios.updateBuildVariables']?.riskLevel).toBe(
			'destructive',
		);
		expect(meta['scenarios.deleteBuildVariable']?.riskLevel).toBe(
			'destructive',
		);
		expect(meta['scenarios.run']?.riskLevel).toBe('destructive');
		expect(meta['scenarios.getUsage']?.riskLevel).toBe('read');
	});
});

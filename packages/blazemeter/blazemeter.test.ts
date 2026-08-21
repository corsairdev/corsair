import type { ErrorHandler } from 'corsair/core';
import {
	BLAZEMETER_BASE_URLS,
	BlazemeterAPIError,
	basicAuthorization,
	compactRecord,
	parseBlazemeterCredentials,
} from './client';
import {
	blazemeterEndpointMeta,
	blazemeterEndpointSchemas,
	blazemeterEndpointsNested,
} from './endpoints';
import {
	BlazemeterEndpointInputSchemas,
	BlazemeterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { blazemeter, blazemeterAuthConfig } from './index';
import {
	BLAZEMETER_OPERATIONS,
	buildBlazemeterBody,
	buildBlazemeterFormData,
	buildBlazemeterQuery,
	resolveBlazemeterPath,
} from './operations';

function sampleValue(type: string): unknown {
	switch (type) {
		case 'integer':
		case 'number':
			return 1;
		case 'boolean':
			return false;
		case 'object':
			return {};
		case 'array':
			return [];
		case 'unknown':
			return 'value';
		default:
			return 'value';
	}
}

function requiredInput(params: readonly string[]): Record<string, unknown> {
	return Object.fromEntries(
		params
			.filter((token) => !token.split(':')[0]?.endsWith('?'))
			.map((token) => {
				const [name, type] = token.split(':');
				return [name, sampleValue(type ?? 'string')];
			}),
	);
}

function endpointCount(value: unknown): number {
	if (typeof value === 'function') return 1;
	if (!value || typeof value !== 'object') return 0;
	return Object.values(value).reduce(
		(total, child) => total + endpointCount(child),
		0,
	);
}

describe('BlazeMeter operation catalog', () => {
	it('exposes all 92 unique catalog operations', () => {
		expect(BLAZEMETER_OPERATIONS).toHaveLength(92);
		expect(new Set(BLAZEMETER_OPERATIONS.map(({ key }) => key)).size).toBe(92);
		expect(new Set(BLAZEMETER_OPERATIONS.map(({ slug }) => slug)).size).toBe(
			92,
		);
		expect(endpointCount(blazemeterEndpointsNested)).toBe(92);
		expect(Object.keys(blazemeterEndpointSchemas)).toHaveLength(92);
		expect(Object.keys(blazemeterEndpointMeta)).toHaveLength(92);
	});

	it('covers every API family and risk class', () => {
		const byApi = Object.groupBy(BLAZEMETER_OPERATIONS, ({ api }) => api);
		expect(
			Object.fromEntries(
				Object.entries(byApi).map(([key, value]) => [key, value?.length]),
			),
		).toEqual({
			mock: 7,
			core: 51,
			asset: 26,
			tdm: 8,
		});

		const byRisk = Object.groupBy(
			BLAZEMETER_OPERATIONS,
			({ riskLevel }) => riskLevel,
		);
		expect(
			Object.fromEntries(
				Object.entries(byRisk).map(([key, value]) => [key, value?.length]),
			),
		).toEqual({
			read: 45,
			write: 32,
			destructive: 15,
		});
	});

	it.each(BLAZEMETER_OPERATIONS)(
		'$slug has a valid schema and complete path mapping',
		(definition) => {
			const input = requiredInput(definition.params);
			expect(
				BlazemeterEndpointInputSchemas[definition.key].safeParse(input).success,
			).toBe(true);

			const placeholders = [...definition.path.matchAll(/\{([^}]+)\}/g)].map(
				(match) => match[1],
			);
			expect('pathParams' in definition ? definition.pathParams : []).toEqual(
				placeholders,
			);
			expect(resolveBlazemeterPath(definition, input)).not.toMatch(/[{}]/);
			expect(blazemeterEndpointSchemas[definition.key]).toBeDefined();
			expect(blazemeterEndpointMeta[definition.key]).toMatchObject({
				riskLevel: definition.riskLevel,
				description: definition.description,
			});
		},
	);

	it.each(
		BLAZEMETER_OPERATIONS.filter(({ params }) =>
			params.some((token) => !token.split(':')[0]?.endsWith('?')),
		),
	)('$slug rejects a missing required input', (definition) => {
		const input = requiredInput(definition.params);
		const requiredName = definition.params
			.find((token) => !token.split(':')[0]?.endsWith('?'))
			?.split(':')[0];
		delete input[requiredName ?? ''];
		expect(
			BlazemeterEndpointInputSchemas[definition.key].safeParse(input).success,
		).toBe(false);
	});
});

describe('BlazeMeter request mapping', () => {
	it('encodes path parameters and rejects missing values', () => {
		const operation = BLAZEMETER_OPERATIONS.find(
			({ key }) => key === 'assets.get',
		)!;
		expect(
			resolveBlazemeterPath(operation, {
				workspaceId: 42,
				assetId: 'asset/with space',
			}),
		).toBe('/workspaces/42/assets/asset%2Fwith%20space');
		expect(() => resolveBlazemeterPath(operation, { workspaceId: 42 })).toThrow(
			'missing required path parameter: assetId',
		);
	});

	it('resolves path placeholders by name, not position', () => {
		const operation = {
			...BLAZEMETER_OPERATIONS.find(({ key }) => key === 'assets.get')!,
			pathParams: ['assetId', 'workspaceId'],
		};
		expect(
			resolveBlazemeterPath(operation, {
				workspaceId: 42,
				assetId: 'asset-1',
			}),
		).toBe('/workspaces/42/assets/asset-1');
	});

	it('separates path, query, and body fields without dropping false', () => {
		const operation = BLAZEMETER_OPERATIONS.find(
			({ key }) => key === 'tests.start',
		)!;
		const input = {
			testId: 7,
			isDebugRun: false,
			delayedStart: true,
		};
		expect(buildBlazemeterQuery(operation, input)).toEqual({
			isDebugRun: false,
			delayedStart: true,
		});
		expect(buildBlazemeterBody(operation, input)).toBeUndefined();
		expect(compactRecord({ enabled: false, absent: undefined })).toEqual({
			enabled: false,
		});
	});

	it('converts base64 upload content to a Blob', async () => {
		const operation = BLAZEMETER_OPERATIONS.find(
			({ key }) => key === 'tests.uploadFile',
		)!;
		const form = buildBlazemeterFormData(operation, {
			testId: 1,
			fileContent: {
				content: Buffer.from('hello').toString('base64'),
				contentType: 'text/plain',
			},
		});
		expect(form?.file).toBeInstanceOf(Blob);
		expect(await (form?.file as Blob).text()).toBe('hello');
	});
});

describe('BlazeMeter authentication', () => {
	it('uses API key ID and secret as HTTP Basic credentials', () => {
		expect(parseBlazemeterCredentials('key-id:key:secret')).toEqual({
			apiKeyId: 'key-id',
			apiKeySecret: 'key:secret',
		});
		expect(basicAuthorization('key-id:key-secret')).toBe(
			`Basic ${Buffer.from('key-id:key-secret').toString('base64')}`,
		);
		expect(() => basicAuthorization('missing-secret')).toThrow(
			'both API key ID and secret',
		);
	});

	it('declares the secret as an account-level API-key field', () => {
		expect(blazemeterAuthConfig.api_key.account).toEqual(['api_key_secret']);
		expect(Object.keys(BLAZEMETER_BASE_URLS).sort()).toEqual([
			'asset',
			'core',
			'mock',
			'tdm',
		]);
	});

	it('builds credentials from explicit options or connected keys', async () => {
		const explicit = blazemeter({
			credentials: { apiKeyId: 'id', apiKeySecret: 'secret' },
		});
		await expect(explicit.keyBuilder?.({} as never, 'endpoint')).resolves.toBe(
			'id:secret',
		);

		const connected = blazemeter();
		await expect(
			connected.keyBuilder?.(
				{
					authType: 'api_key',
					keys: {
						get_api_key: async () => 'connected-id',
						get_api_key_secret: async () => 'connected-secret',
					},
				} as never,
				'endpoint',
			),
		).resolves.toBe('connected-id:connected-secret');
	});
});

type TestEndpoint = (
	ctx: Record<string, unknown>,
	input: Record<string, unknown>,
) => Promise<unknown>;

type FetchCall = { url: string; init: RequestInit };

const TEST_KEY = 'key-id:key-secret';
const TEST_CTX = {
	key: TEST_KEY,
	$getAccountId: async () => 'account-1',
};

function endpointFor(key: string): TestEndpoint {
	const resolved = key
		.split('.')
		.reduce<unknown>(
			(node, part) => (node as Record<string, unknown>)?.[part],
			blazemeterEndpointsNested,
		);
	if (typeof resolved !== 'function') {
		throw new Error(`no bound endpoint at path: ${key}`);
	}
	return resolved as TestEndpoint;
}

describe('BlazeMeter endpoint execution', () => {
	const realFetch = globalThis.fetch;
	let calls: FetchCall[] = [];

	function stubFetch(respond: () => Response): void {
		calls = [];
		globalThis.fetch = (async (
			input: string | URL | Request,
			init?: RequestInit,
		) => {
			calls.push({ url: String(input), init: init ?? {} });
			return respond();
		}) as typeof fetch;
	}

	function jsonResponse(body: unknown, status = 200): Response {
		return new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	afterEach(() => {
		globalThis.fetch = realFetch;
	});

	it.each(BLAZEMETER_OPERATIONS)(
		'$slug issues an authenticated request to its documented route',
		async (definition) => {
			stubFetch(() => jsonResponse({ result: { ok: true } }));

			const input = requiredInput(definition.params);
			const result = await endpointFor(definition.key)(TEST_CTX, input);

			expect(calls).toHaveLength(1);
			const call = calls[0]!;
			const url = new URL(call.url);
			const base = new URL(BLAZEMETER_BASE_URLS[definition.api]);

			expect(url.origin).toBe(base.origin);
			expect(url.pathname).toBe(
				`${base.pathname}${resolveBlazemeterPath(definition, input)}`,
			);
			expect(url.pathname).not.toMatch(/[{}]/);
			expect(call.init.method).toBe(definition.method);

			const headers = new Headers(call.init.headers);
			expect(headers.get('Authorization')).toBe(basicAuthorization(TEST_KEY));
			expect(headers.get('Accept')).toBe('application/json');

			// GET and DELETE never carry a serialized JSON body.
			if (definition.method === 'GET' || definition.method === 'DELETE') {
				expect(call.init.body).toBeUndefined();
			}
			expect(result).toEqual({ result: { ok: true } });
		},
	);

	it('sends a JSON body for writes and keeps path params out of it', async () => {
		stubFetch(() => jsonResponse({ result: { id: 9 } }));

		await endpointFor('tests.update')(TEST_CTX, {
			test_id: 42,
			name: 'renamed',
		});

		const call = calls[0]!;
		expect(new URL(call.url).pathname).toMatch(/\/tests\/42$/);
		expect(new Headers(call.init.headers).get('Content-Type')).toMatch(
			/^application\/json/,
		);
		expect(JSON.parse(call.init.body as string)).toEqual({ name: 'renamed' });
	});

	it('sends multipart form data for file uploads', async () => {
		stubFetch(() => jsonResponse({ result: {} }));

		await endpointFor('tests.uploadFile')(TEST_CTX, {
			testId: 3,
			fileContent: {
				content: Buffer.from('jmx').toString('base64'),
				contentType: 'text/xml',
			},
		});

		const call = calls[0]!;
		expect(call.init.body).toBeInstanceOf(FormData);
		expect((call.init.body as FormData).get('file')).toBeInstanceOf(Blob);
		// Content-Type is left to fetch so the multipart boundary is set.
		expect(new Headers(call.init.headers).get('Content-Type')).not.toBe(
			'application/json',
		);
	});

	it('appends query parameters instead of a body on GET', async () => {
		stubFetch(() => jsonResponse({ result: [] }));

		await endpointFor('tests.list')(TEST_CTX, { projectId: 5 });

		const call = calls[0]!;
		expect(new URL(call.url).searchParams.get('projectId')).toBe('5');
		expect(call.init.body).toBeUndefined();
	});

	it('surfaces API failures as BlazemeterAPIError with the status attached', async () => {
		stubFetch(() => jsonResponse({ error: { message: 'boom' } }, 500));

		const thrown = await endpointFor('tests.get')(TEST_CTX, {
			test_id: 1,
		}).catch((error: unknown) => error);

		expect(thrown).toBeInstanceOf(BlazemeterAPIError);
		expect((thrown as BlazemeterAPIError).status).toBe(500);
	});

	it('does not retry a destructive request at the transport layer', async () => {
		stubFetch(() => jsonResponse({ error: { message: 'slow down' } }, 429));

		await expect(
			endpointFor('tests.remove')(TEST_CTX, { testId: 1 }),
		).rejects.toBeInstanceOf(BlazemeterAPIError);
		expect(calls).toHaveLength(1);
	});

	it('accepts numeric test IDs for file list and delete', () => {
		expect(
			BlazemeterEndpointInputSchemas['tests.files'].safeParse({
				testId: 1234567,
			}).success,
		).toBe(true);
		expect(
			BlazemeterEndpointInputSchemas['tests.files'].safeParse({
				testId: '1234567',
			}).success,
		).toBe(false);
		expect(
			BlazemeterEndpointInputSchemas['tests.removeFile'].safeParse({
				testId: 1234567,
				fileName: 'MyTest.jmx',
			}).success,
		).toBe(true);
	});

	it('calls GET /user, not /user/user', async () => {
		stubFetch(() => jsonResponse({ result: { id: 1 } }));

		await endpointFor('user.get')(TEST_CTX, {});

		expect(new URL(calls[0]!.url).pathname).toBe('/api/v4/user');
	});

	it('omits JSON Content-Type when a write has no body', async () => {
		stubFetch(() => jsonResponse({ result: { id: 2 } }));

		await endpointFor('tests.duplicate')(TEST_CTX, { test_id: 9 });

		expect(calls[0]!.init.body).toBeUndefined();
		expect(new Headers(calls[0]!.init.headers).get('Content-Type')).toBeNull();
	});

	it('mirrors list results into the local store', async () => {
		const upsertByEntityId = jest.fn(async () => undefined);
		stubFetch(() =>
			jsonResponse({
				api_version: 4,
				error: null,
				result: [
					{
						id: 11,
						name: 'Default project',
						userId: 1,
						description: null,
						created: 1,
						updated: 1,
						workspaceId: 2,
						testsCount: 0,
					},
				],
			}),
		);

		await endpointFor('projects.list')(
			{ ...TEST_CTX, db: { projects: { upsertByEntityId } } },
			{ workspaceId: 2 },
		);

		expect(upsertByEntityId).toHaveBeenCalledWith(
			'11',
			expect.objectContaining({ id: 11, name: 'Default project' }),
		);
	});

	it('keys workspace memberships by workspace and user', async () => {
		const upsertByEntityId = jest.fn(async () => undefined);
		const member = {
			id: 9,
			email: 'a@b.com',
			displayName: 'A',
			firstName: 'A',
			lastName: 'B',
			login: 1,
			access: 1,
			roles: ['tester'],
			enabled: true,
			lastAccess: 1,
			type: 'user',
		};
		stubFetch(() => jsonResponse({ result: [member] }));
		const ctx = {
			...TEST_CTX,
			db: { workspaceUsers: { upsertByEntityId } },
		};

		await endpointFor('workspaces.users')(ctx, { workspaceId: 1 });
		await endpointFor('workspaces.users')(ctx, { workspaceId: 2 });

		expect(upsertByEntityId).toHaveBeenNthCalledWith(
			1,
			'1:9',
			expect.objectContaining({ id: 9, workspaceId: 1 }),
		);
		expect(upsertByEntityId).toHaveBeenNthCalledWith(
			2,
			'2:9',
			expect.objectContaining({ id: 9, workspaceId: 2 }),
		);
	});

	it('evicts a deleted project from the local store', async () => {
		const deleteByEntityId = jest.fn(async () => undefined);
		stubFetch(() => jsonResponse({ result: true }));

		await endpointFor('projects.remove')(
			{
				...TEST_CTX,
				db: { projects: { upsertByEntityId: jest.fn(), deleteByEntityId } },
			},
			{ id: 11 },
		);

		expect(deleteByEntityId).toHaveBeenCalledWith('11');
	});
});

const BOOLEAN_CORE_RESULTS = new Set([
	'schedules.remove',
	'privateLocations.removeWorkspace',
	'projects.remove',
	'tests.removeFile',
	'tests.remove',
	'workspaces.removeLogs',
	'workspaces.removeManagers',
	'masters.stop',
	'tests.stop',
	'user.terminateSessions',
]);

function sampleCoreResult(key: string): unknown {
	if (BOOLEAN_CORE_RESULTS.has(key)) return true;
	if (key === 'workspaces.terminateMasters') return [21509126];
	if (key === 'tests.validate') return { success: true, files: {} };
	if (key.startsWith('schedules.') || key.startsWith('privateLocations.')) {
		return key.endsWith('.list') ? [{ id: 'id-1' }] : { id: 'id-1' };
	}
	if (
		key === 'regions.list' ||
		key === 'sharedFolders.list' ||
		key === 'user.activeSessions' ||
		key === 'user.invites' ||
		key === 'tests.files' ||
		key === 'tests.validations' ||
		key === 'search.execute'
	) {
		return [{ id: 'id-1' }];
	}
	if (
		key.endsWith('.list') ||
		key === 'user.projects' ||
		key === 'workspaces.users'
	) {
		return [{ id: 1 }];
	}
	return { id: 1 };
}

describe('BlazeMeter response contracts', () => {
	it('types core API responses with the documented v4 envelope', () => {
		const coreOperations = BLAZEMETER_OPERATIONS.filter(
			({ api }) => api === 'core',
		);
		expect(coreOperations).not.toHaveLength(0);

		for (const definition of coreOperations) {
			expect(
				BlazemeterEndpointOutputSchemas[definition.key].safeParse({
					api_version: 4,
					error: null,
					result: sampleCoreResult(definition.key),
					request_id: 'req-1',
				}).success,
			).toBe(true);
		}

		expect(
			BlazemeterEndpointOutputSchemas['tests.get'].safeParse('not-an-envelope')
				.success,
		).toBe(false);
	});

	it('types tdm and mock responses with documented envelopes', () => {
		expect(
			BlazemeterEndpointOutputSchemas['testData.getModel'].safeParse({
				api_version: 1,
				error: null,
				result: { id: 'datamodel/Pet', title: 'Pet', type: 'object' },
				request_id: 'req-1',
			}).success,
		).toBe(true);
		expect(
			BlazemeterEndpointOutputSchemas['serviceMockTemplates.get'].safeParse({
				apiVersion: 1,
				error: null,
				result: { id: 8, name: 'template' },
				requestId: 'req-1',
			}).success,
		).toBe(true);
	});

	it('accepts an array of converted transaction DSLs', () => {
		const envelope = {
			apiVersion: 1,
			requestId: 'req-1',
			result: [
				{
					nativeId: 'getPet',
					priority: 1,
					requestDsl: { method: 'GET', path: '/pet' },
					responseDsl: { status: 200, contentType: 'JSON' },
				},
			],
		};
		expect(
			BlazemeterEndpointOutputSchemas['transactions.convert'].safeParse(
				envelope,
			).success,
		).toBe(true);
		expect(
			BlazemeterEndpointOutputSchemas['transactions.convert'].safeParse({
				...envelope,
				result: { nativeId: 'getPet' },
			}).success,
		).toBe(false);
	});

	it('rejects a non-envelope payload for every operation', () => {
		for (const definition of BLAZEMETER_OPERATIONS) {
			expect(
				BlazemeterEndpointOutputSchemas[definition.key].safeParse(
					'anything at all',
				).success,
			).toBe(false);
		}
	});

	it('types asset API responses with the documented AR envelope', () => {
		expect(
			BlazemeterEndpointOutputSchemas['assets.get'].safeParse({
				timestamp: '2022-07-22T13:43:47+00:00',
				request_id: 'req-1',
				result: { id: '09af09af-09af-09af-09af-09af09af09af', name: 'Pet' },
			}).success,
		).toBe(true);
		expect(
			BlazemeterEndpointOutputSchemas['assets.get'].safeParse('not-an-envelope')
				.success,
		).toBe(false);
	});
});

describe('BlazeMeter retry policy', () => {
	function contextFor(operation: string) {
		return {
			pluginId: 'blazemeter',
			operation,
			input: {},
			originalError: new Error('x'),
		};
	}

	function apiError(status: number): BlazemeterAPIError {
		const error = new BlazemeterAPIError('failed');
		Object.defineProperty(error, 'status', { value: status });
		return error;
	}

	const readOperation = 'tests.get';

	it.each([429, 500, 502, 503])(
		'retries read operations after %s',
		async (status) => {
			const name = status === 429 ? 'RATE_LIMIT_ERROR' : 'SERVER_ERROR';
			const strategy = await errorHandlers[name].handler(
				apiError(status),
				contextFor(readOperation),
			);
			expect(strategy.maxRetries).toBeGreaterThan(0);
		},
	);

	it.each([
		['write', 'tests.start'],
		['write', 'tests.validate'],
		['destructive', 'tests.remove'],
	])(
		'never replays a %s operation after an ambiguous failure',
		async (_label, operation) => {
			for (const status of [429, 500, 502, 503]) {
				const name = status === 429 ? 'RATE_LIMIT_ERROR' : 'SERVER_ERROR';
				const strategy = await errorHandlers[name].handler(
					apiError(status),
					contextFor(operation),
				);
				expect(strategy.maxRetries).toBe(0);
			}
		},
	);

	it('treats an unknown operation path as unsafe to replay', async () => {
		const strategy = await errorHandlers.SERVER_ERROR.handler(
			apiError(500),
			contextFor('not.an.operation'),
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('never retries auth, permission, not-found, or validation failures', async () => {
		for (const name of [
			'AUTH_ERROR',
			'PERMISSION_ERROR',
			'NOT_FOUND_ERROR',
			'VALIDATION_ERROR',
			'DEFAULT',
		] as const) {
			// These handlers ignore their arguments; the cast keeps the loop uniform.
			const handler = errorHandlers[name].handler as ErrorHandler;
			const strategy = await handler(apiError(401), contextFor(readOperation));
			expect(strategy.maxRetries).toBe(0);
		}
	});
});

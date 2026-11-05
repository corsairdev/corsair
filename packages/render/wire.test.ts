// Wire-level tests: fetch is the only mock, so these cover the bound
// endpoint (schema parsing), the adapter, makeRenderRequest and core request().
import { RenderAPIError } from './client';
import { render } from './index';

type Sent = {
	method: string;
	url: URL;
	body: unknown;
	headers: Headers;
};

const sent: Sent[] = [];
const replies: Array<{ status: number; body?: unknown }> = [];
const originalFetch = global.fetch;

beforeEach(() => {
	sent.length = 0;
	replies.length = 0;
	global.fetch = jest.fn(
		async (url: string | URL | Request, init?: RequestInit) => {
			sent.push({
				method: init?.method ?? 'GET',
				url: new URL(String(url)),
				body:
					typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body,
				headers: new Headers(init?.headers),
			});
			const reply = replies.shift() ?? { status: 200, body: {} };
			if (reply.body === undefined) {
				return new Response(null, { status: reply.status });
			}
			return new Response(JSON.stringify(reply.body), {
				status: reply.status,
				headers: { 'content-type': 'application/json' },
			});
		},
	) as typeof fetch;
});

afterAll(() => {
	global.fetch = originalFetch;
});

const ctx = {
	key: 'rnd_test',
	$getAccountId: async () => 'account-1',
} as never;
const plugin = render({ key: 'rnd_test' });
if (!plugin.endpoints) throw new Error('Render endpoints are missing');
const api = plugin.endpoints;
// The bound endpoint tree is typed per operation; the tests call through a
// loose view so table-driven cases can share one helper.
// unknown: inputs are validated by each operation's schema at runtime.
type Call = (context: never, input: unknown) => Promise<unknown>;

describe('Render replace operations', () => {
	it.each([
		[
			'services.envVars.update',
			api.services.envVars.update,
			{ serviceId: 'srv-1' },
			'/v1/services/srv-1/env-vars',
			[
				{ key: 'DATABASE_URL', value: 'postgres://x' },
				{ key: 'SESSION_SECRET', generateValue: true },
			],
		],
		[
			'services.headers.update',
			api.services.headers.update,
			{ serviceId: 'srv-1' },
			'/v1/services/srv-1/headers',
			[{ path: '/*', name: 'X-Frame-Options', value: 'DENY' }],
		],
		[
			'services.secretFiles.update',
			api.services.secretFiles.update,
			{ serviceId: 'srv-1' },
			'/v1/services/srv-1/secret-files',
			[{ name: 'config.json', content: '{}' }],
		],
		[
			'services.routes.update',
			api.services.routes.update,
			{ serviceId: 'srv-1' },
			'/v1/services/srv-1/routes',
			[{ type: 'rewrite', source: '/app/*', destination: '/index.html' }],
		],
		[
			'buildSources.envVars.update',
			api.buildSources.envVars.update,
			{ buildSourceId: 'bs-1' },
			'/v1/build-sources/bs-1/env-vars',
			[{ key: 'NODE_ENV', value: 'production' }],
		],
		[
			'buildSources.secretFiles.update',
			api.buildSources.secretFiles.update,
			{ buildSourceId: 'bs-1' },
			'/v1/build-sources/bs-1/secret-files',
			[{ name: '.npmrc', content: 'registry=https://example.test' }],
		],
	] as const)(
		'%s PUTs the list as a raw JSON array',
		async (_name, endpoint, ids, path, list) => {
			replies.push({ status: 200, body: [] });
			await (endpoint as unknown as Call)(ctx, { ...ids, body: list });

			expect(sent).toHaveLength(1);
			expect(sent[0]?.method).toBe('PUT');
			expect(sent[0]?.url.pathname).toBe(path);
			expect(sent[0]?.url.search).toBe('');
			expect(sent[0]?.body).toEqual(list);
		},
	);

	it('rejects a replace call without the list before any request is sent', async () => {
		await expect(
			(api.services.envVars.update as unknown as Call)(ctx, {
				serviceId: 'srv-1',
				key: 'A',
				value: 'B',
			}),
		).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});
});

describe('Render list filters', () => {
	it.each([
		[
			'services.list',
			api.services.list,
			{ name: ['web', 'worker'], region: ['oregon', 'frankfurt'] },
			'/v1/services',
			{ name: 'web,worker', region: 'oregon,frankfurt' },
		],
		[
			'services.headers.list',
			api.services.headers.list,
			{ serviceId: 'srv-1', path: ['/a', '/b'], name: ['X-A', 'X-B'] },
			'/v1/services/srv-1/headers',
			{ path: '/a,/b', name: 'X-A,X-B' },
		],
		[
			'services.customDomains.list',
			api.services.customDomains.list,
			{ serviceId: 'srv-1', name: ['a.example.com', 'b.example.com'] },
			'/v1/services/srv-1/custom-domains',
			{ name: 'a.example.com,b.example.com' },
		],
	] as const)(
		'%s sends explode:false filters as one comma-separated value',
		async (_name, endpoint, input, path, expected) => {
			replies.push({ status: 200, body: [] });
			await (endpoint as unknown as Call)(ctx, input);

			expect(sent[0]?.url.pathname).toBe(path);
			for (const [key, value] of Object.entries(expected)) {
				expect(sent[0]?.url.searchParams.getAll(key)).toEqual([value]);
			}
		},
	);

	it('keeps repeated keys for explode:true filters such as deploy status', async () => {
		replies.push({ status: 200, body: [] });
		await (api.services.listDeploys as unknown as Call)(ctx, {
			serviceId: 'srv-1',
			status: ['live', 'build_failed'],
		});

		expect(sent[0]?.url.searchParams.getAll('status')).toEqual([
			'live',
			'build_failed',
		]);
	});
});

describe('Render documented response shapes', () => {
	it('returns the outbound IP object Render sends for a service', async () => {
		const ips = { type: 'shared', ips: ['203.0.113.10', '203.0.113.11'] };
		replies.push({ status: 200, body: ips });

		await expect(
			(api.services.listOutboundIps as unknown as Call)(ctx, {
				serviceId: 'srv-1',
			}),
		).resolves.toEqual(ips);
		expect(sent[0]?.url.pathname).toBe('/v1/services/srv-1/outbound-ips');
	});

	it.each([
		['postgres.processes', api.postgres.processes, 'processes'],
		['postgres.topQueries', api.postgres.topQueries, 'topQueries'],
		['postgres.sizes', api.postgres.sizes, 'sizes'],
		['postgres.tableScans', api.postgres.tableScans, 'tableScans'],
	] as const)(
		'%s returns the wrapped rows object',
		async (_name, endpoint, field) => {
			const body = { [field]: [{ databaseName: 'app' }] };
			replies.push({ status: 200, body });

			await expect(
				(endpoint as unknown as Call)(ctx, { id: 'dpg-1' }),
			).resolves.toEqual(body);
		},
	);

	it.each([
		[
			'postgres.createExport',
			api.postgres.createExport,
			{ id: 'dpg-1' },
			'/v1/postgres/dpg-1/export',
		],
		[
			'postgres.createUser',
			api.postgres.createUser,
			{ id: 'dpg-1', body: { username: 'reporting' } },
			'/v1/postgres/dpg-1/credentials',
		],
		[
			'workflows.versions.create',
			api.workflows.versions.create,
			{ workflowId: 'wfl-1', commit: 'abc123' },
			'/v1/workflowversions',
		],
		[
			'services.customDomains.verify',
			api.services.customDomains.verify,
			{ serviceId: 'srv-1', customDomainNameOrID: 'www.example.com' },
			'/v1/services/srv-1/custom-domains/www.example.com/verify',
		],
	] as const)(
		'%s accepts the empty 202 Accepted reply',
		async (_name, endpoint, input, path) => {
			replies.push({ status: 202 });

			await expect(
				(endpoint as unknown as Call)(ctx, input),
			).resolves.toBeUndefined();
			expect(sent[0]?.method).toBe('POST');
			expect(sent[0]?.url.pathname).toBe(path);
		},
	);
});

describe('Render required request fields', () => {
	it('uploads render.yaml as multipart form data to validate a Blueprint', async () => {
		replies.push({ status: 200, body: { valid: true } });
		const yaml = 'services:\n  - type: web\n    name: api\n';

		await expect(
			(api.blueprints.validate as unknown as Call)(ctx, {
				ownerId: 'tea-1',
				file: yaml,
			}),
		).resolves.toEqual({ valid: true });

		const request = sent[0];
		expect(request?.method).toBe('POST');
		expect(request?.url.pathname).toBe('/v1/blueprints/validate');
		expect(request?.headers.get('content-type')).toBeNull();
		expect(request?.headers.get('authorization')).toBe('Bearer rnd_test');
		const form = request?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(form.get('ownerId')).toBe('tea-1');
		const file = form.get('file') as File;
		expect(file.name).toBe('render.yaml');
		expect(await file.text()).toBe(yaml);
	});

	it('starts a workflow task run with the documented task and input fields', async () => {
		replies.push({ status: 202, body: { id: 'trn-1' } });
		await (api.workflows.taskRuns.create as unknown as Call)(ctx, {
			task: 'my-workflow/hello',
			input: ['world'],
		});

		expect(sent[0]?.url.pathname).toBe('/v1/task-runs');
		expect(sent[0]?.body).toEqual({
			task: 'my-workflow/hello',
			input: ['world'],
		});
	});

	it.each([
		[
			'workflows.taskRuns.create',
			api.workflows.taskRuns.create,
			{ taskId: 't' },
		],
		[
			'workflows.create',
			api.workflows.create,
			{ ownerId: 'tea-1', name: 'flow' },
		],
		[
			'services.routes.add',
			api.services.routes.add,
			{ serviceId: 'srv-1', source: '/a', destination: '/b' },
		],
		[
			'services.customDomains.create',
			api.services.customDomains.create,
			{ serviceId: 'srv-1' },
		],
		[
			'services.environments.list',
			api.services.environments.list,
			{ ownerId: 'tea-1' },
		],
		['logs.list', api.logs.list, { ownerId: 'tea-1' }],
		['dedicatedIps.list', api.dedicatedIps.list, {}],
	] as const)(
		'%s rejects input missing a field Render requires, before any request',
		async (_name, endpoint, input) => {
			await expect((endpoint as unknown as Call)(ctx, input)).rejects.toThrow();
			expect(sent).toHaveLength(0);
		},
	);
});

describe('Render responses seen on a live Hobby workspace', () => {
	it.each([
		['workflows.tasks.list', api.workflows.tasks.list],
		['workflows.list', api.workflows.list],
		['workflows.versions.list', api.workflows.versions.list],
		['logs.resourceStreams', api.logs.resourceStreams],
	] as const)(
		'%s turns an empty `null` reply into []',
		async (_name, endpoint) => {
			replies.push({ status: 200, body: null });
			await expect((endpoint as unknown as Call)(ctx, {})).resolves.toEqual([]);
		},
	);

	it('still rejects null where Render documents an object', async () => {
		replies.push({ status: 200, body: null });
		await expect(
			(api.owners.retrieve as unknown as Call)(ctx, { id: 'tea-1' }),
		).rejects.toThrow();
	});

	it('keeps Render’s explanation in the error message and body', async () => {
		const body = {
			id: 'bad-request',
			message: 'audit logs not available for this plan',
		};
		replies.push({ status: 400, body });

		const error = await (api.owners.auditLogs as unknown as Call)(ctx, {
			id: 'tea-1',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(RenderAPIError);
		expect((error as RenderAPIError).status).toBe(400);
		expect((error as RenderAPIError).message).toBe(
			'Bad Request: audit logs not available for this plan',
		);
		expect((error as RenderAPIError).body).toEqual(body);
	});

	it('accepts an outbound IP kind the plugin does not know yet', async () => {
		const ips = { type: 'regional', ips: ['203.0.113.10'] };
		replies.push({ status: 200, body: ips });
		await expect(
			(api.services.listOutboundIps as unknown as Call)(ctx, {
				serviceId: 'srv-1',
			}),
		).resolves.toEqual(ips);
	});

	it('sends env group name filters as one comma-separated value', async () => {
		replies.push({ status: 200, body: [] });
		await (api.services.envGroups.list as unknown as Call)(ctx, {
			name: ['shared-a', 'shared-b'],
			ownerId: ['tea-1'],
		});
		expect(sent[0]?.url.searchParams.getAll('name')).toEqual([
			'shared-a,shared-b',
		]);
		expect(sent[0]?.url.searchParams.getAll('ownerId')).toEqual(['tea-1']);
	});
});

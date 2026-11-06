// Wire-level tests: fetch is the only mock, and every call goes through the
// typed Corsair client, so these cover the bound endpoint (schema parsing),
// the adapter, makeRenderRequest and core request().
import { createCorsair } from 'corsair/core';
import { RenderAPIError } from './client';
import { render } from './index';

type Sent = {
	method: string;
	url: URL;
	// unknown: the parsed JSON body, or the raw FormData for uploads.
	body: unknown;
	headers: Headers;
};

const sent: Sent[] = [];
// unknown: canned reply bodies are any JSON (objects, arrays, null) by design.
const replies: Array<{ status: number; body?: unknown }> = [];

beforeEach(() => {
	sent.length = 0;
	replies.length = 0;
	jest.spyOn(global, 'fetch').mockImplementation(async (url, init) => {
		sent.push({
			method: init?.method ?? 'GET',
			url: new URL(String(url)),
			body: typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body,
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
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});

const api = createCorsair({ plugins: [render({ key: 'rnd_test' })] }).render
	.api;

describe('Render replace operations', () => {
	it.each([
		[
			'services.envVars.update',
			(list: { key: string; value: string }[]) =>
				api.services.envVars.update({ serviceId: 'srv-1', body: list }),
			'/v1/services/srv-1/env-vars',
			[{ key: 'DATABASE_URL', value: 'postgres://x' }],
		],
		[
			'buildSources.envVars.update',
			(list: { key: string; value: string }[]) =>
				api.buildSources.envVars.update({ buildSourceId: 'bs-1', body: list }),
			'/v1/build-sources/bs-1/env-vars',
			[{ key: 'NODE_ENV', value: 'production' }],
		],
	] as const)(
		'%s PUTs the list as a raw JSON array',
		async (_name, call, path, list) => {
			replies.push({ status: 200, body: [] });
			await call([...list]);

			expect(sent).toHaveLength(1);
			expect(sent[0]?.method).toBe('PUT');
			expect(sent[0]?.url.pathname).toBe(path);
			expect(sent[0]?.url.search).toBe('');
			expect(sent[0]?.body).toEqual(list);
		},
	);

	it.each([
		[
			'services.headers.update',
			() =>
				api.services.headers.update({
					serviceId: 'srv-1',
					body: [{ path: '/*', name: 'X-Frame-Options', value: 'DENY' }],
				}),
			'/v1/services/srv-1/headers',
			[{ path: '/*', name: 'X-Frame-Options', value: 'DENY' }],
		],
		[
			'services.secretFiles.update',
			() =>
				api.services.secretFiles.update({
					serviceId: 'srv-1',
					body: [{ name: 'config.json', content: '{}' }],
				}),
			'/v1/services/srv-1/secret-files',
			[{ name: 'config.json', content: '{}' }],
		],
		[
			'services.routes.update',
			() =>
				api.services.routes.update({
					serviceId: 'srv-1',
					body: [
						{ type: 'rewrite', source: '/app/*', destination: '/index.html' },
					],
				}),
			'/v1/services/srv-1/routes',
			[{ type: 'rewrite', source: '/app/*', destination: '/index.html' }],
		],
		[
			'buildSources.secretFiles.update',
			() =>
				api.buildSources.secretFiles.update({
					buildSourceId: 'bs-1',
					body: [{ name: '.npmrc', content: 'registry=https://example.test' }],
				}),
			'/v1/build-sources/bs-1/secret-files',
			[{ name: '.npmrc', content: 'registry=https://example.test' }],
		],
		[
			'services.envVars.update (generated value)',
			() =>
				api.services.envVars.update({
					serviceId: 'srv-1',
					body: [{ key: 'SESSION_SECRET', generateValue: true }],
				}),
			'/v1/services/srv-1/env-vars',
			[{ key: 'SESSION_SECRET', generateValue: true }],
		],
	] as const)(
		'%s PUTs the list as a raw JSON array',
		async (_name, call, path, list) => {
			replies.push({ status: 200, body: [] });
			await call();

			expect(sent).toHaveLength(1);
			expect(sent[0]?.method).toBe('PUT');
			expect(sent[0]?.url.pathname).toBe(path);
			expect(sent[0]?.body).toEqual(list);
		},
	);

	it('rejects a replace call without the list before any request is sent', async () => {
		await expect(
			api.services.envVars.update({
				serviceId: 'srv-1',
				// @ts-expect-error a single variable instead of the required list
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
			() =>
				api.services.list({
					name: ['web', 'worker'],
					region: ['oregon', 'frankfurt'],
				}),
			'/v1/services',
			{ name: 'web,worker', region: 'oregon,frankfurt' },
		],
		[
			'services.headers.list',
			() =>
				api.services.headers.list({
					serviceId: 'srv-1',
					path: ['/a', '/b'],
					name: ['X-A', 'X-B'],
				}),
			'/v1/services/srv-1/headers',
			{ path: '/a,/b', name: 'X-A,X-B' },
		],
		[
			'services.customDomains.list',
			() =>
				api.services.customDomains.list({
					serviceId: 'srv-1',
					name: ['a.example.com', 'b.example.com'],
				}),
			'/v1/services/srv-1/custom-domains',
			{ name: 'a.example.com,b.example.com' },
		],
		[
			'services.envGroups.list',
			() =>
				api.services.envGroups.list({
					name: ['shared-a', 'shared-b'],
					ownerId: ['tea-1'],
				}),
			'/v1/env-groups',
			{ name: 'shared-a,shared-b', ownerId: 'tea-1' },
		],
	] as const)(
		'%s sends explode:false filters as one comma-separated value',
		async (_name, call, path, expected) => {
			replies.push({ status: 200, body: [] });
			await call();

			expect(sent[0]?.url.pathname).toBe(path);
			for (const [key, value] of Object.entries(expected)) {
				expect(sent[0]?.url.searchParams.getAll(key)).toEqual([value]);
			}
		},
	);

	it('keeps repeated keys for explode:true filters such as deploy status', async () => {
		replies.push({ status: 200, body: [] });
		await api.services.listDeploys({
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
			api.services.listOutboundIps({ serviceId: 'srv-1' }),
		).resolves.toEqual(ips);
		expect(sent[0]?.url.pathname).toBe('/v1/services/srv-1/outbound-ips');
	});

	it.each([
		[
			'postgres.processes',
			() => api.postgres.processes({ id: 'dpg-1' }),
			'processes',
		],
		[
			'postgres.topQueries',
			() => api.postgres.topQueries({ id: 'dpg-1' }),
			'topQueries',
		],
		['postgres.sizes', () => api.postgres.sizes({ id: 'dpg-1' }), 'sizes'],
		[
			'postgres.tableScans',
			() => api.postgres.tableScans({ id: 'dpg-1' }),
			'tableScans',
		],
	] as const)(
		'%s returns the wrapped rows object',
		async (_name, call, field) => {
			const body = { [field]: [{ databaseName: 'app' }] };
			replies.push({ status: 200, body });

			await expect(call()).resolves.toEqual(body);
		},
	);

	it.each([
		[
			'postgres.createExport',
			() => api.postgres.createExport({ id: 'dpg-1' }),
			'/v1/postgres/dpg-1/export',
		],
		[
			'postgres.createUser',
			() =>
				api.postgres.createUser({
					id: 'dpg-1',
					body: { username: 'reporting' },
				}),
			'/v1/postgres/dpg-1/credentials',
		],
		[
			'workflows.versions.create',
			() =>
				api.workflows.versions.create({
					workflowId: 'wfl-1',
					commit: 'abc123',
				}),
			'/v1/workflowversions',
		],
		[
			'services.customDomains.verify',
			() =>
				api.services.customDomains.verify({
					serviceId: 'srv-1',
					customDomainNameOrID: 'www.example.com',
				}),
			'/v1/services/srv-1/custom-domains/www.example.com/verify',
		],
	] as const)(
		'%s accepts the empty 202 Accepted reply',
		async (_name, call, path) => {
			replies.push({ status: 202 });

			await expect(call()).resolves.toBeUndefined();
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
			api.blueprints.validate({ ownerId: 'tea-1', file: yaml }),
		).resolves.toEqual({ valid: true });

		const request = sent[0];
		expect(request?.method).toBe('POST');
		expect(request?.url.pathname).toBe('/v1/blueprints/validate');
		expect(request?.headers.get('content-type')).toBeNull();
		expect(request?.headers.get('authorization')).toBe('Bearer rnd_test');
		const form = request?.body;
		if (!(form instanceof FormData))
			throw new Error('expected a FormData body');
		expect(form.get('ownerId')).toBe('tea-1');
		const file = form.get('file');
		if (!(file instanceof File)) throw new Error('expected a file part');
		expect(file.name).toBe('render.yaml');
		expect(await file.text()).toBe(yaml);
	});

	it('starts a workflow task run with the documented task and input fields', async () => {
		replies.push({ status: 202, body: { id: 'trn-1' } });
		await api.workflows.taskRuns.create({
			task: 'my-workflow/hello',
			input: ['world'],
		});

		expect(sent[0]?.url.pathname).toBe('/v1/task-runs');
		expect(sent[0]?.body).toEqual({
			task: 'my-workflow/hello',
			input: ['world'],
		});
	});

	// Each call below leaves out a field Render requires; the type checker
	// rejects it too, which @ts-expect-error records.
	it.each([
		[
			'workflows.taskRuns.create',
			// @ts-expect-error taskId is not a field; task and input are required
			() => api.workflows.taskRuns.create({ taskId: 't' }),
		],
		[
			'workflows.create',
			// @ts-expect-error region, runCommand and buildConfig are missing
			() => api.workflows.create({ ownerId: 'tea-1', name: 'flow' }),
		],
		[
			'services.routes.add',
			() =>
				// @ts-expect-error type is missing
				api.services.routes.add({
					serviceId: 'srv-1',
					source: '/a',
					destination: '/b',
				}),
		],
		[
			'services.customDomains.create',
			// @ts-expect-error name is missing
			() => api.services.customDomains.create({ serviceId: 'srv-1' }),
		],
		[
			'services.environments.list',
			// @ts-expect-error projectId is missing
			() => api.services.environments.list({ ownerId: 'tea-1' }),
		],
		[
			'logs.list',
			// @ts-expect-error resource is missing
			() => api.logs.list({ ownerId: 'tea-1' }),
		],
		[
			'dedicatedIps.list',
			// @ts-expect-error ownerId is missing
			() => api.dedicatedIps.list({}),
		],
	] as const)(
		'%s rejects input missing a field Render requires, before any request',
		async (_name, call) => {
			await expect(call()).rejects.toThrow();
			expect(sent).toHaveLength(0);
		},
	);
});

describe('Render responses seen on a live Hobby workspace', () => {
	it.each([
		['workflows.tasks.list', () => api.workflows.tasks.list({})],
		['workflows.list', () => api.workflows.list({})],
		['workflows.versions.list', () => api.workflows.versions.list({})],
		['logs.resourceStreams', () => api.logs.resourceStreams({})],
	] as const)('%s turns an empty `null` reply into []', async (_name, call) => {
		replies.push({ status: 200, body: null });
		await expect(call()).resolves.toEqual([]);
	});

	it('still rejects null where Render documents an object', async () => {
		replies.push({ status: 200, body: null });
		await expect(api.owners.retrieve({ id: 'tea-1' })).rejects.toThrow();
	});

	it('keeps Render’s explanation in the error message and body', async () => {
		const body = {
			id: 'bad-request',
			message: 'audit logs not available for this plan',
		};
		replies.push({ status: 400, body });

		const error = await api.owners
			.auditLogs({ id: 'tea-1' })
			// unknown: a rejected promise can carry any value; narrowed below.
			.catch((caught: unknown) => caught);

		if (!(error instanceof RenderAPIError)) throw error;
		expect(error.status).toBe(400);
		expect(error.message).toBe(
			'Bad Request: audit logs not available for this plan',
		);
		expect(error.body).toEqual(body);
	});

	it('accepts an outbound IP kind the plugin does not know yet', async () => {
		const ips = { type: 'regional', ips: ['203.0.113.10'] };
		replies.push({ status: 200, body: ips });
		await expect(
			api.services.listOutboundIps({ serviceId: 'srv-1' }),
		).resolves.toEqual(ips);
	});
});

describe('Render deploy and lifecycle responses', () => {
	const deploy = {
		id: 'dep-1',
		status: 'build_in_progress',
		commit: { id: 'abc123' },
	};

	it.each([
		[
			'services.rollbackDeploy',
			() =>
				api.services.rollbackDeploy({ serviceId: 'srv-1', deployId: 'dep-0' }),
		],
		[
			'services.cancelDeploy',
			() =>
				api.services.cancelDeploy({ serviceId: 'srv-1', deployId: 'dep-1' }),
		],
		[
			'services.triggerDeploy',
			() => api.services.triggerDeploy({ serviceId: 'srv-1' }),
		],
	] as const)('%s returns the deploy Render sends', async (_name, call) => {
		replies.push({ status: 201, body: deploy });
		await expect(call()).resolves.toEqual(deploy);
	});

	it('rejects a deploy reply without an id', async () => {
		replies.push({ status: 201, body: { status: 'created' } });
		await expect(
			api.services.rollbackDeploy({ serviceId: 'srv-1', deployId: 'dep-0' }),
		).rejects.toThrow();
	});

	it('accepts the empty 202 Render sends when a deploy is queued', async () => {
		replies.push({ status: 202 });
		await expect(
			api.services.triggerDeploy({ serviceId: 'srv-1' }),
		).resolves.toBeUndefined();
	});

	it.each([
		['services.restart', () => api.services.restart({ serviceId: 'srv-1' })],
		[
			'services.purgeCache',
			() => api.services.purgeCache({ serviceId: 'srv-1' }),
		],
		['postgres.failover', () => api.postgres.failover({ id: 'dpg-1' })],
		['maintenance.trigger', () => api.maintenance.trigger({ id: 'mrn-1' })],
		['keyValue.suspend', () => api.keyValue.suspend({ id: 'red-1' })],
	] as const)('%s accepts an empty reply', async (_name, call) => {
		replies.push({ status: 202 });
		await expect(call()).resolves.toBeUndefined();
	});

	it('returns a cron job run, including a status the plugin does not know yet', async () => {
		const run = { id: 'crnrun-1', status: 'retrying', startedAt: '2026-11-05' };
		replies.push({ status: 200, body: run });
		await expect(
			api.services.cronJobs.triggerRun({ cronJobId: 'crn-1' }),
		).resolves.toEqual(run);
	});
});

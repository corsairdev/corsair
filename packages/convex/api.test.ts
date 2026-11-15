import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { z } from 'zod';
import { ConvexAPIError, makeConvexRequest } from './client';
import { CustomDomainsEndpoints } from './endpoints/custom-domains';
import { DeployKeysEndpoints } from './endpoints/deploy-keys';
import { DeploymentScopedEndpoints } from './endpoints/deployment-scoped';
import { DeploymentsEndpoints } from './endpoints/deployments';
import { PlatformEndpoints } from './endpoints/platform';
import { ProjectsEndpoints } from './endpoints/projects';
import {
	ConvexEndpointInputSchemas,
	ConvexEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ConvexContext, ConvexKeyBuilderContext } from './index';
import { convex, convexEndpointSchemas } from './index';
import type { ConvexSchema } from './schema';
import {
	ConvexDeployKeySchema,
	ConvexDeploymentSchema,
	ConvexProjectSchema,
} from './schema/database';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = jest.mocked(logEventFromContext);

const MGMT = 'https://api.convex.dev/v1';
const DEPLOYMENT = 'https://acoustic-panther-728.convex.cloud/api';

type Captured = {
	url: string;
	method: string;
	authorization: string | null;
	body: string | null;
};

let calls: Captured[] = [];

function stubFetch(
	payload: object | null,
	init: { status?: number; headers?: Record<string, string> } = {},
) {
	calls = [];
	jest.spyOn(global, 'fetch').mockImplementation(async (input, req) => {
		calls.push({
			url: String(input),
			method: req?.method ?? 'GET',
			authorization: new Headers(req?.headers).get('Authorization'),
			body: typeof req?.body === 'string' ? req.body : null,
		});
		return new Response(payload === null ? null : JSON.stringify(payload), {
			status: init.status ?? 200,
			headers: {
				...(payload === null ? {} : { 'Content-Type': 'application/json' }),
				...init.headers,
			},
		});
	});
}

function stubFetchSequence(payloads: Array<object | null>) {
	calls = [];
	const queue = [...payloads];
	jest.spyOn(global, 'fetch').mockImplementation(async (input, req) => {
		calls.push({
			url: String(input),
			method: req?.method ?? 'GET',
			authorization: new Headers(req?.headers).get('Authorization'),
			body: typeof req?.body === 'string' ? req.body : null,
		});
		const payload = queue.shift() ?? null;
		return new Response(payload === null ? null : JSON.stringify(payload), {
			status: 200,
			headers: payload === null ? {} : { 'Content-Type': 'application/json' },
		});
	});
}

function onlyCall(): Captured {
	expect(calls).toHaveLength(1);
	const call = calls[0];
	if (!call) throw new Error('[test] no fetch call captured');
	return call;
}

function sentJson(call: Captured): object | null {
	return call.body === null ? null : JSON.parse(call.body);
}

type Db = ConvexContext['db'];
type EntityKey = keyof typeof ConvexSchema.entities;
type Table<K extends EntityKey> = NonNullable<Db[K]>;
type CacheMethods<K extends EntityKey> = Pick<
	Table<K>,
	'upsertByEntityId' | 'deleteByEntityId' | 'list'
>;

function fakeTable<S extends z.ZodType>(
	schema: S,
	seed: Array<[string, z.input<S>]> = [],
) {
	const rows = new Map(seed);
	const toEntity = (entityId: string, data: z.input<S>) => ({
		id: `row-${entityId}`,
		created_at: new Date(0),
		updated_at: new Date(0),
		account_id: 'test-account',
		entity_id: entityId,
		entity_type: 'test',
		version: '1.0.0',
		data: schema.parse(data),
	});
	return {
		rows,
		upsertByEntityId: jest.fn(async (entityId: string, data: z.input<S>) => {
			rows.set(entityId, data);
			return toEntity(entityId, data);
		}),
		deleteByEntityId: jest.fn(async (entityId: string) =>
			rows.delete(entityId),
		),
		list: jest.fn(async () =>
			[...rows].map(([entityId, data]) => toEntity(entityId, data)),
		),
	};
}

function makeCtx(
	overrides: {
		subdomain?: string | null;
		deployKey?: string | null;
		db?: { [K in EntityKey]?: CacheMethods<K> };
	} = {},
): ConvexContext {
	const subdomain =
		overrides.subdomain === undefined
			? 'acoustic-panther-728'
			: overrides.subdomain;
	const deployKey =
		overrides.deployKey === undefined ? 'prod:stored-key' : overrides.deployKey;
	// Safe: handlers only read key, options, keys.get_subdomain, keys.get_deploy_key and db, all supplied here.
	// A narrower type is not practical because ConvexContext also carries ORM, tenant and hook members these handlers never touch.
	return {
		key: 'test-token',
		options: {},
		keys: {
			get_subdomain: async () => subdomain,
			get_deploy_key: async () => deployKey,
		},
		db: overrides.db ?? {},
	} as ConvexContext;
}

const project = {
	id: 101,
	name: 'My App',
	slug: 'my-app',
	teamId: 7,
	teamSlug: 'acme',
	createTime: 1700000000000,
	prodDeploymentName: 'happy-otter-123',
	devDeploymentName: null,
};

const deployKeyRecord = {
	id: 9001,
	name: 'ci',
	creationTime: 1700000000002,
	lastUsedTime: null,
	expiresAt: null,
	creator: 7,
	managedBy: null,
	allowedActions: ['deployment:deploy'],
};

const deployment = {
	id: 501,
	name: 'happy-otter-123',
	createTime: 1700000000001,
	lastDeployTime: null,
	deploymentType: 'prod' as const,
	projectId: 101,
	region: 'aws-us-east-1',
	isDefault: true,
	reference: 'production',
	deploymentUrl: 'https://happy-otter-123.convex.cloud',
	class: 's16',
	kind: 'cloud' as const,
};

beforeEach(() => {
	calls = [];
	mockLogEvent.mockClear();
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

describe('plugin shape', () => {
	it('exposes the 19 operations with meta and schemas and defines no webhooks', () => {
		const plugin = convex();
		const paths = Object.keys(convexEndpointSchemas).sort();

		expect(paths).toEqual([
			'customDomains.delete',
			'deployKeys.create',
			'deployKeys.list',
			'deployment.executeQueryBatch',
			'deployment.getQueryTimestamp',
			'deployment.listLogStreams',
			'deployments.create',
			'deployments.delete',
			'deployments.get',
			'deployments.list',
			'deployments.update',
			'platform.getTokenDetails',
			'platform.listDeploymentClasses',
			'platform.listDeploymentRegions',
			'projects.create',
			'projects.delete',
			'projects.getById',
			'projects.getBySlug',
			'projects.list',
		]);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.endpointMeta?.['projects.delete']?.irreversible).toBe(true);
		expect(plugin.endpointMeta?.['deployments.delete']?.irreversible).toBe(
			true,
		);
		expect(plugin.endpointMeta?.['customDomains.delete']?.irreversible).toBe(
			true,
		);
	});
});

describe('projects', () => {
	it('list sends GET /teams/{id}/projects with pagination query', async () => {
		stubFetch({
			items: [project],
			pagination: { hasMore: true, nextCursor: 'c2' },
		});
		const projects = fakeTable(ConvexProjectSchema);
		const result = await ProjectsEndpoints.list(makeCtx({ db: { projects } }), {
			team_id: '7',
			cursor: 'c1',
			limit: 10,
			q: 'my',
		});

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${MGMT}/teams/7/projects?cursor=c1&limit=10&q=my`);
		expect(call.authorization).toBe('Bearer test-token');
		expect(result).toEqual({
			items: [project],
			pagination: { hasMore: true, nextCursor: 'c2' },
		});
		expect(projects.upsertByEntityId).toHaveBeenCalledWith('101', project);
	});

	it('getById sends GET /projects/{id}', async () => {
		stubFetch(project);
		const projects = fakeTable(ConvexProjectSchema);
		const result = await ProjectsEndpoints.getById(
			makeCtx({ db: { projects } }),
			{ project_id: '101' },
		);

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${MGMT}/projects/101`);
		expect(result).toEqual(project);
		expect(projects.upsertByEntityId).toHaveBeenCalledWith('101', project);
	});

	it('getBySlug sends GET /teams/{team}/projects/{slug}', async () => {
		stubFetch(project);
		const projects = fakeTable(ConvexProjectSchema);
		const result = await ProjectsEndpoints.getBySlug(
			makeCtx({ db: { projects } }),
			{ team_id_or_slug: 'acme', project_slug: 'my-app' },
		);

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${MGMT}/teams/acme/projects/my-app`);
		expect(result).toEqual(project);
		expect(projects.upsertByEntityId).toHaveBeenCalledWith('101', project);
	});

	it('create sends POST /teams/{id}/create_project with the body fields', async () => {
		const created = {
			projectId: 101,
			id: 101,
			slug: 'my-app',
			deploymentName: 'happy-otter-123',
			deploymentUrl: 'https://happy-otter-123.convex.cloud',
		};
		stubFetch(created);
		const result = await ProjectsEndpoints.create(makeCtx(), {
			team_id: '7',
			projectName: 'My App',
			deploymentType: 'prod',
			deploymentRegion: 'aws-us-east-1',
		});

		const call = onlyCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(`${MGMT}/teams/7/create_project`);
		expect(sentJson(call)).toEqual({
			projectName: 'My App',
			deploymentType: 'prod',
			deploymentRegion: 'aws-us-east-1',
		});
		expect(result).toEqual(created);
	});

	it('create caches the full project fetched after creation', async () => {
		const created = {
			projectId: 101,
			id: 101,
			slug: 'my-app',
			deploymentName: 'happy-otter-123',
			deploymentUrl: 'https://happy-otter-123.convex.cloud',
		};
		stubFetchSequence([created, project]);
		const projects = fakeTable(ConvexProjectSchema);
		const result = await ProjectsEndpoints.create(
			makeCtx({ db: { projects } }),
			{ team_id: '7', projectName: 'My App', deploymentType: 'prod' },
		);

		expect(result).toEqual(created);
		expect(calls.map((c) => `${c.method} ${c.url}`)).toEqual([
			`POST ${MGMT}/teams/7/create_project`,
			`GET ${MGMT}/projects/101`,
		]);
		expect(projects.upsertByEntityId).toHaveBeenCalledWith('101', project);
	});

	it('delete sends POST /projects/{id}/delete and clears cached children', async () => {
		stubFetch(null);
		const projects = fakeTable(ConvexProjectSchema, [['101', project]]);
		const deployments = fakeTable(ConvexDeploymentSchema, [
			['happy-otter-123', deployment],
			['other-dog-9', { ...deployment, name: 'other-dog-9', projectId: 202 }],
		]);
		const deployKeys = fakeTable(ConvexDeployKeySchema, [
			['k1', { ...deployKeyRecord, deploymentName: 'happy-otter-123' }],
			['k2', { ...deployKeyRecord, deploymentName: 'other-dog-9' }],
		]);
		const result = await ProjectsEndpoints.delete(
			makeCtx({ db: { projects, deployments, deployKeys } }),
			{ project_id: '101' },
		);

		const call = onlyCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(`${MGMT}/projects/101/delete`);
		expect(call.body).toBeNull();
		expect(result).toEqual({ success: true });
		expect([...projects.rows.keys()]).toEqual([]);
		expect([...deployments.rows.keys()]).toEqual(['other-dog-9']);
		expect([...deployKeys.rows.keys()]).toEqual(['k2']);
	});
});

describe('deployments', () => {
	it('list sends GET /projects/{id}/list_deployments with filters and caches rows', async () => {
		stubFetch([deployment]);
		const deployments = fakeTable(ConvexDeploymentSchema);
		const result = await DeploymentsEndpoints.list(
			makeCtx({ db: { deployments } }),
			{ project_id: '101', includeLocal: false, deploymentType: 'prod' },
		);

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(
			`${MGMT}/projects/101/list_deployments?includeLocal=false&deploymentType=prod`,
		);
		expect(result).toEqual([deployment]);
		expect(deployments.upsertByEntityId).toHaveBeenCalledWith(
			'happy-otter-123',
			deployment,
		);
	});

	it('get sends GET /deployments/{name}', async () => {
		stubFetch(deployment);
		const deployments = fakeTable(ConvexDeploymentSchema);
		const result = await DeploymentsEndpoints.get(
			makeCtx({ db: { deployments } }),
			{ deployment_name: 'happy-otter-123' },
		);

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${MGMT}/deployments/happy-otter-123`);
		expect(result).toEqual(deployment);
		expect(deployments.upsertByEntityId).toHaveBeenCalledWith(
			'happy-otter-123',
			deployment,
		);
	});

	it('create sends POST /projects/{id}/create_deployment with the body fields', async () => {
		stubFetch(deployment);
		const deployments = fakeTable(ConvexDeploymentSchema);
		const result = await DeploymentsEndpoints.create(
			makeCtx({ db: { deployments } }),
			{
				project_id: '101',
				type: 'prod',
				reference: 'production',
				isDefault: true,
			},
		);

		const call = onlyCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(`${MGMT}/projects/101/create_deployment`);
		expect(sentJson(call)).toEqual({
			type: 'prod',
			reference: 'production',
			isDefault: true,
		});
		expect(result).toEqual(deployment);
		expect(deployments.upsertByEntityId).toHaveBeenCalledWith(
			'happy-otter-123',
			deployment,
		);
	});

	it('update sends PATCH /deployments/{name} with only the supplied fields', async () => {
		stubFetch(null);
		const result = await DeploymentsEndpoints.update(makeCtx(), {
			deployment_name: 'happy-otter-123',
			reference: 'staging',
			sendLogsToClient: false,
		});

		const call = onlyCall();
		expect(call.method).toBe('PATCH');
		expect(call.url).toBe(`${MGMT}/deployments/happy-otter-123`);
		expect(sentJson(call)).toEqual({
			reference: 'staging',
			sendLogsToClient: false,
		});
		expect(result).toEqual({ success: true });
	});

	it('update refreshes the cached deployment after a successful PATCH', async () => {
		const deployments = fakeTable(ConvexDeploymentSchema);
		calls = [];
		jest.spyOn(global, 'fetch').mockImplementation(async (input, req) => {
			calls.push({
				url: String(input),
				method: req?.method ?? 'GET',
				authorization: null,
				body: null,
			});
			return req?.method === 'PATCH'
				? new Response(null, { status: 200 })
				: new Response(JSON.stringify(deployment), {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					});
		});

		await DeploymentsEndpoints.update(makeCtx({ db: { deployments } }), {
			deployment_name: 'happy-otter-123',
			reference: 'staging',
		});

		expect(calls.map((c) => `${c.method} ${c.url}`)).toEqual([
			`PATCH ${MGMT}/deployments/happy-otter-123`,
			`GET ${MGMT}/deployments/happy-otter-123`,
		]);
		expect(deployments.upsertByEntityId).toHaveBeenCalledWith(
			'happy-otter-123',
			deployment,
		);
	});

	it('delete sends POST /deployments/{name}/delete and clears cached deploy keys', async () => {
		stubFetch(null);
		const deployments = fakeTable(ConvexDeploymentSchema, [
			['happy-otter-123', deployment],
		]);
		const deployKeys = fakeTable(ConvexDeployKeySchema, [
			['k1', { ...deployKeyRecord, deploymentName: 'happy-otter-123' }],
			['k2', { ...deployKeyRecord, deploymentName: 'other-dog-9' }],
		]);
		const result = await DeploymentsEndpoints.delete(
			makeCtx({ db: { deployments, deployKeys } }),
			{ deployment_name: 'happy-otter-123' },
		);

		const call = onlyCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(`${MGMT}/deployments/happy-otter-123/delete`);
		expect(result).toEqual({ success: true });
		expect([...deployments.rows.keys()]).toEqual([]);
		expect([...deployKeys.rows.keys()]).toEqual(['k2']);
	});
});

describe('deploy keys', () => {
	it('create sends POST /deployments/{name}/create_deploy_key and never caches the secret', async () => {
		stubFetch({ deployKey: 'prod:happy-otter-123|secret' });
		const deployKeys = fakeTable(ConvexDeployKeySchema);
		const result = await DeployKeysEndpoints.create(
			makeCtx({ db: { deployKeys } }),
			{
				deployment_name: 'happy-otter-123',
				name: 'ci',
				allowedActions: ['deployment:deploy'],
			},
		);

		const call = onlyCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(
			`${MGMT}/deployments/happy-otter-123/create_deploy_key`,
		);
		expect(sentJson(call)).toEqual({
			name: 'ci',
			allowedActions: ['deployment:deploy'],
		});
		expect(result).toEqual({ deployKey: 'prod:happy-otter-123|secret' });
		expect(deployKeys.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('list sends GET /deployments/{name}/list_deploy_keys', async () => {
		const key = deployKeyRecord;
		stubFetch([key]);
		const deployKeys = fakeTable(ConvexDeployKeySchema);
		const result = await DeployKeysEndpoints.list(
			makeCtx({ db: { deployKeys } }),
			{ deployment_name: 'happy-otter-123' },
		);

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(
			`${MGMT}/deployments/happy-otter-123/list_deploy_keys`,
		);
		expect(result).toEqual([key]);
		expect(deployKeys.upsertByEntityId).toHaveBeenCalledWith('9001', {
			deploymentName: 'happy-otter-123',
			...key,
		});
	});
});

describe('custom domains', () => {
	it('delete sends POST /deployments/{name}/delete_custom_domain', async () => {
		stubFetch(null);
		const result = await CustomDomainsEndpoints.delete(makeCtx(), {
			deployment_name: 'happy-otter-123',
			requestDestination: 'convexSite',
			domain: 'api.example.com',
		});

		const call = onlyCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(
			`${MGMT}/deployments/happy-otter-123/delete_custom_domain`,
		);
		expect(sentJson(call)).toEqual({
			requestDestination: 'convexSite',
			domain: 'api.example.com',
		});
		expect(result).toEqual({ success: true });
	});
});

describe('platform', () => {
	it('getTokenDetails sends GET /token_details', async () => {
		const details = {
			id: 5099424,
			teamId: 7,
			name: 'ci-token',
			createTime: 1700000000003,
			type: 'teamToken',
		};
		stubFetch(details);
		const result = await PlatformEndpoints.getTokenDetails(makeCtx(), {});

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${MGMT}/token_details`);
		expect(result).toEqual(details);
	});

	it('listDeploymentClasses sends GET /teams/{id}/list_deployment_classes', async () => {
		const body = { items: [{ type: 's16', available: true }] };
		stubFetch(body);
		const result = await PlatformEndpoints.listDeploymentClasses(makeCtx(), {
			team_id: '7',
		});

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${MGMT}/teams/7/list_deployment_classes`);
		expect(result).toEqual(body);
	});

	it('listDeploymentRegions sends GET /teams/{id}/list_deployment_regions', async () => {
		const body = {
			items: [
				{
					name: 'aws-us-east-1',
					displayName: 'US East (N. Virginia)',
					available: true,
				},
			],
		};
		stubFetch(body);
		const result = await PlatformEndpoints.listDeploymentRegions(makeCtx(), {
			team_id: '7',
		});

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(`${MGMT}/teams/7/list_deployment_regions`);
		expect(result).toEqual(body);
	});
});

describe('deployment-scoped', () => {
	it('executeQueryBatch sends POST /api/query_batch with Convex auth', async () => {
		const body = {
			results: [
				{ status: 'success', value: [{ text: 'hi' }], logLines: [] },
				{ status: 'error', errorMessage: 'boom', errorData: null },
			],
		};
		stubFetch(body);
		const result = await DeploymentScopedEndpoints.executeQueryBatch(
			makeCtx(),
			{
				deployKey: 'prod:input-key',
				queries: [
					{ path: 'messages:list', args: { channel: 'general' } },
					{ path: 'messages:broken', args: {}, format: 'json' },
				],
			},
		);

		const call = onlyCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(`${DEPLOYMENT}/query_batch`);
		expect(call.authorization).toBe('Convex prod:input-key');
		expect(sentJson(call)).toEqual({
			queries: [
				{ path: 'messages:list', args: { channel: 'general' } },
				{ path: 'messages:broken', args: {}, format: 'json' },
			],
		});
		expect(result).toEqual(body);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'convex.deployment.executeQueryBatch',
			{ queries: ['messages:list', 'messages:broken'] },
			'completed',
		);
	});

	it('getQueryTimestamp sends POST /api/query_ts with the stored deploy key', async () => {
		stubFetch({ ts: '1700000000000000000' });
		const result = await DeploymentScopedEndpoints.getQueryTimestamp(
			makeCtx(),
			{},
		);

		const call = onlyCall();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(`${DEPLOYMENT}/query_ts`);
		expect(call.authorization).toBe('Convex prod:stored-key');
		expect(result).toEqual({ ts: '1700000000000000000' });
	});

	it('listLogStreams sends GET /api/v1/list_log_streams', async () => {
		const streams = [
			{
				id: 'ls_1',
				logStreamType: 'webhook',
				status: { type: 'active' },
				url: 'https://logs.example.com',
				format: 'json',
				hmacSecret: 'whsec',
				topics: null,
			},
		];
		stubFetch(streams);
		const result = await DeploymentScopedEndpoints.listLogStreams(makeCtx(), {
			subdomain: 'calm-cow-456.eu-west-1',
		});

		const call = onlyCall();
		expect(call.method).toBe('GET');
		expect(call.url).toBe(
			'https://calm-cow-456.eu-west-1.convex.cloud/api/v1/list_log_streams',
		);
		expect(call.authorization).toBe('Convex prod:stored-key');
		expect(result).toEqual(streams);
	});

	it('accepts an explicit convex.cloud deployment URL', async () => {
		stubFetch({ ts: '1' });
		await DeploymentScopedEndpoints.getQueryTimestamp(makeCtx(), {
			deploymentUrl: 'https://joyful-capybara-123.convex.cloud/',
		});

		expect(onlyCall().url).toBe(
			'https://joyful-capybara-123.convex.cloud/api/query_ts',
		);
	});

	it.each([
		'https://evil.example.com',
		'http://acoustic-panther-728.convex.cloud',
		'https://user:pw@acoustic-panther-728.convex.cloud',
		'https://acoustic-panther-728.convex.cloud/other',
	])('rejects deployment URL %s without sending a request', async (url) => {
		stubFetch({ ts: '1' });
		await expect(
			DeploymentScopedEndpoints.getQueryTimestamp(makeCtx(), {
				deploymentUrl: url,
			}),
		).rejects.toThrow('Invalid Convex deployment URL');
		expect(calls).toHaveLength(0);
	});

	it('requires a deployment name', async () => {
		stubFetch({ ts: '1' });
		await expect(
			DeploymentScopedEndpoints.getQueryTimestamp(
				makeCtx({ subdomain: null }),
				{},
			),
		).rejects.toThrow('deployment name (subdomain) is required');
		expect(calls).toHaveLength(0);
	});

	it('requires a deploy key', async () => {
		stubFetch({ ts: '1' });
		await expect(
			DeploymentScopedEndpoints.getQueryTimestamp(
				makeCtx({ deployKey: null }),
				{},
			),
		).rejects.toThrow('require a deployment admin deploy key');
		expect(calls).toHaveLength(0);
	});

	it('rejects subdomains that could escape the deployment host', () => {
		const schema = ConvexEndpointInputSchemas.queryTimestamp;
		expect(schema.safeParse({ subdomain: 'evil.com:443/' }).success).toBe(
			false,
		);
		expect(
			schema.safeParse({ subdomain: 'calm-cow-456.eu-west-1' }).success,
		).toBe(true);
	});
});

describe('request client', () => {
	it.each(['../teams', 'a/b', 'a?b', 'a#b', ''])(
		'rejects path segment %p before any request',
		async (segment) => {
			stubFetch({});
			await expect(
				ProjectsEndpoints.getById(makeCtx(), { project_id: segment }),
			).rejects.toThrow('Invalid Convex path parameter');
			expect(calls).toHaveLength(0);
		},
	);

	it('URI-encodes path segments', async () => {
		stubFetch(project);
		await ProjectsEndpoints.getBySlug(makeCtx(), {
			team_id_or_slug: 'acme team',
			project_slug: 'my{app}',
		});

		expect(onlyCall().url).toBe(
			`${MGMT}/teams/acme%20team/projects/my%7Bapp%7D`,
		);
	});

	it('fails Management calls without an access token before any request', async () => {
		stubFetch({});
		await expect(makeConvexRequest('/token_details', '')).rejects.toThrow(
			'No Convex access token',
		);
		expect(calls).toHaveLength(0);
	});

	it('maps a 401 to ConvexAPIError with the provider message', async () => {
		stubFetch(
			{ code: 'Unauthenticated', message: 'Invalid token' },
			{ status: 401 },
		);
		const error = await makeConvexRequest('/token_details', 'bad').catch(
			(e: Error) => e,
		);

		expect(error).toBeInstanceOf(ConvexAPIError);
		if (!(error instanceof ConvexAPIError)) return;
		expect(error.status).toBe(401);
		expect(error.code).toBe('Unauthenticated');
		expect(error.message).toBe('Invalid token');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});

	it('surfaces Retry-After from a 429 to the rate limit handler', async () => {
		jest.useFakeTimers();
		stubFetch(
			{ code: 'RateLimited', message: 'Too many requests' },
			{ status: 429, headers: { 'Retry-After': '7' } },
		);
		const pending = makeConvexRequest('/token_details', 'test-token').catch(
			(e: Error) => e,
		);
		await jest.advanceTimersByTimeAsync(60_000);
		const error = await pending;

		expect(error).toBeInstanceOf(ConvexAPIError);
		if (!(error instanceof ConvexAPIError)) return;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(7000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(error)).toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 7000,
		});
	});

	it('classifies 403, 404 and 5xx errors', () => {
		expect(
			errorHandlers.PERMISSION_ERROR.match(new ConvexAPIError('x', 403)),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(new ConvexAPIError('x', 404)),
		).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(new ConvexAPIError('x', 503))).toBe(
			true,
		);
		expect(errorHandlers.SERVER_ERROR.match(new Error('other'))).toBe(false);
	});

	it('matches raw ApiError 429s', () => {
		const error = new ApiError(
			{ method: 'GET', url: '/token_details' },
			{
				url: `${MGMT}/token_details`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: null,
			},
			'Too Many Requests',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});
});

describe('keyBuilder', () => {
	function keyCtx(keys: {
		api_key?: string | null;
		deploy_key?: string | null;
	}): ConvexKeyBuilderContext {
		// Safe: keyBuilder only reads authType and the two key getters supplied here.
		// A narrower type is not practical because ConvexKeyBuilderContext also exposes setters and account helpers keyBuilder never calls.
		return {
			authType: 'api_key',
			keys: {
				get_api_key: async () => keys.api_key ?? null,
				get_deploy_key: async () => keys.deploy_key ?? null,
			},
		} as ConvexKeyBuilderContext;
	}

	function buildKey(ctx: ConvexKeyBuilderContext) {
		const { keyBuilder } = convex();
		if (!keyBuilder) throw new Error('[test] keyBuilder missing');
		return keyBuilder(ctx, 'endpoint');
	}

	it('returns the access token for Management calls', async () => {
		await expect(buildKey(keyCtx({ api_key: 'tok' }))).resolves.toBe('tok');
	});

	it('lets deploy-key-only connections bind with an empty bearer credential', async () => {
		await expect(buildKey(keyCtx({ deploy_key: 'prod:k' }))).resolves.toBe('');
	});

	it('throws when no credential is stored', async () => {
		await expect(buildKey(keyCtx({}))).rejects.toThrow();
	});
});

describe('output schemas', () => {
	it('parse the official Management API payloads', () => {
		expect(ConvexEndpointOutputSchemas.deploymentGet.parse(deployment)).toEqual(
			deployment,
		);
		expect(ConvexEndpointOutputSchemas.projectGetById.parse(project)).toEqual(
			project,
		);
		expect(
			ConvexEndpointOutputSchemas.deployKeysList.parse([deployKeyRecord]),
		).toEqual([deployKeyRecord]);
		expect(
			ConvexEndpointOutputSchemas.executeQueryBatch.safeParse({
				results: [{ status: 'success' }],
			}).success,
		).toBe(false);
	});
});

import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { ZodError } from 'zod';
import type {
	ExternalNorthflankPlugin,
	NorthflankContext,
	NorthflankKeyBuilderContext,
	NorthflankPluginOptions,
} from './index';
import {
	northflank,
	northflankEndpointMeta,
	northflankEndpointSchemas,
	northflankEndpointsNested,
} from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue('test-event-id'),
	};
});

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLogEvent = jest.mocked(logEventFromContext);

const TEST_API_KEY = 'test-api-token';

function createTestKeys(storedKey: string | null) {
	return {
		get_dek: async (): Promise<string> => 'test-dek',
		issue_new_dek: async (): Promise<string> => 'test-dek',
		get_api_key: async (): Promise<string | null> => storedKey,
		set_api_key: async (): Promise<void> => undefined,
		get_webhook_signature: async (): Promise<string | null> => null,
		set_webhook_signature: async (): Promise<void> => undefined,
	};
}

function createTestContext(apiKey: string): NorthflankContext {
	return {
		key: apiKey,
		$getAccountId: async (): Promise<string> => 'test-account-id',
		endpoints: {},
		db: {},
		options: {},
		keys: createTestKeys(apiKey),
	};
}

function createKeyBuilderContext(
	storedKey: string | null,
): NorthflankKeyBuilderContext {
	return {
		authType: 'api_key',
		options: {},
		keys: createTestKeys(storedKey),
		tenantId: 'test-tenant',
	};
}

const mockCtx = createTestContext(TEST_API_KEY);

async function resolvePluginKey(
	plugin: ExternalNorthflankPlugin<NorthflankPluginOptions>,
	ctx: NorthflankKeyBuilderContext,
): Promise<string> {
	const builder = plugin.keyBuilder;
	if (builder === undefined) throw new Error('keyBuilder is not configured');
	return builder(ctx, 'endpoint');
}

describe('Northflank plugin structure and endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockReset();
	});

	it('exposes all 21 endpoints with meta and schemas', () => {
		const plugin = northflank();
		const metaKeys = Object.keys(plugin.endpointMeta ?? {}).sort();
		const schemaKeys = Object.keys(northflankEndpointSchemas).sort();

		expect(metaKeys).toHaveLength(21);
		expect(Object.keys(northflankEndpointMeta)).toHaveLength(21);
		expect(schemaKeys).toHaveLength(21);
		expect(metaKeys).toEqual(schemaKeys);
		expect(Object.keys(northflankEndpointsNested).sort()).toEqual([
			'addonTypes',
			'cloudProviders',
			'misc',
			'pipelines',
			'plans',
			'projects',
			'regions',
			'secrets',
			'services',
		]);
		expect(Object.keys(northflankEndpointsNested.projects).sort()).toEqual([
			'create',
			'createOrUpdate',
			'delete',
			'get',
			'list',
			'update',
		]);
		expect(Object.keys(northflankEndpointsNested.secrets).sort()).toEqual([
			'create',
			'createOrUpdate',
			'get',
			'getDetails',
			'list',
			'patch',
			'update',
		]);
		expect(Object.keys(northflankEndpointsNested.services)).toEqual(['list']);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('configures api_key auth with no webhook support', () => {
		const plugin = northflank();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});

	it('resolves key from options when provided', async () => {
		const plugin: ExternalNorthflankPlugin<NorthflankPluginOptions> =
			northflank({ key: 'custom-api-token' });
		const key = await resolvePluginKey(plugin, createKeyBuilderContext(null));
		expect(key).toBe('custom-api-token');
	});

	it('treats whitespace-only options.key as missing and uses the stored key', async () => {
		const plugin: ExternalNorthflankPlugin<NorthflankPluginOptions> =
			northflank({ key: '   ' });
		const key = await resolvePluginKey(
			plugin,
			createKeyBuilderContext('stored-api-token'),
		);
		expect(key).toBe('stored-api-token');
	});

	it('throws AuthMissingError for whitespace-only options.key with no stored key', async () => {
		const plugin: ExternalNorthflankPlugin<NorthflankPluginOptions> =
			northflank({ key: '   ' });
		await expect(
			resolvePluginKey(plugin, createKeyBuilderContext(null)),
		).rejects.toThrow(AuthMissingError);
	});

	it('resolves key from keys.get_api_key when options.key is absent', async () => {
		const plugin = northflank();
		const key = await resolvePluginKey(
			plugin,
			createKeyBuilderContext('stored-api-token'),
		);
		expect(key).toBe('stored-api-token');
	});

	it('throws AuthMissingError when key is unavailable', async () => {
		const plugin = northflank();
		await expect(
			resolvePluginKey(plugin, createKeyBuilderContext(null)),
		).rejects.toThrow(AuthMissingError);
	});

	it('rejects invalid caller input at runtime before HTTP', async () => {
		await expect(
			northflankEndpointsNested.projects.get(mockCtx, { projectId: '' }),
		).rejects.toThrow(ZodError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('validates provider response against output schema at runtime', async () => {
		mockRequest.mockResolvedValueOnce({ unexpected: true });
		await expect(
			northflankEndpointsNested.projects.list(mockCtx, {}),
		).rejects.toThrow(ZodError);
		expect(mockLogEvent).not.toHaveBeenCalled();
	});

	it('calls projects.list with pagination query', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { projects: [{ id: 'p1', name: 'Demo' }] },
			pagination: { hasNextPage: false, count: 1 },
		});
		const res = await northflankEndpointsNested.projects.list(mockCtx, {
			page: 1,
			per_page: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: 'projects',
				query: { page: 1, per_page: 10 },
			}),
		);
		expect(res.data.projects).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'northflank.projects.list',
			{},
			'completed',
		);
	});

	it('calls projects.get', async () => {
		mockRequest.mockResolvedValueOnce({ data: { id: 'p1', name: 'Demo' } });
		const res = await northflankEndpointsNested.projects.get(mockCtx, {
			projectId: 'p1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: 'projects/p1' }),
		);
		expect(res.data.id).toBe('p1');
	});

	it('calls projects.create with POST body', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'p1', name: 'New Project' },
		});
		await northflankEndpointsNested.projects.create(mockCtx, {
			name: 'New Project',
			region: 'europe-west',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: 'projects',
				body: { name: 'New Project', region: 'europe-west' },
			}),
		);
	});

	it('calls projects.createOrUpdate with PUT on the collection path', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'p1', name: 'New Project' },
		});
		await northflankEndpointsNested.projects.createOrUpdate(mockCtx, {
			name: 'New Project',
			region: 'europe-west',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: 'projects',
				body: { name: 'New Project', region: 'europe-west' },
			}),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'northflank.projects.createOrUpdate',
			{ name: 'New Project' },
			'completed',
		);
	});

	it('calls projects.update with PATCH body', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'p1', name: 'Demo' },
		});
		await northflankEndpointsNested.projects.update(mockCtx, {
			projectId: 'p1',
			description: 'Updated description',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PATCH',
				url: 'projects/p1',
				body: { description: 'Updated description' },
			}),
		);
	});

	it('calls projects.delete with DELETE and child-object flag', async () => {
		mockRequest.mockResolvedValueOnce({ data: {} });
		await northflankEndpointsNested.projects.delete(mockCtx, {
			projectId: 'p1',
			delete_child_objects: true,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'DELETE',
				url: 'projects/p1',
				query: { delete_child_objects: true },
			}),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'northflank.projects.delete',
			{ projectId: 'p1' },
			'completed',
		);
	});

	it('calls services.list with project ID and pagination', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { services: [{ id: 's1', name: 'web' }] },
			pagination: { hasNextPage: false, count: 1 },
		});
		const res = await northflankEndpointsNested.services.list(mockCtx, {
			projectId: 'p1',
			page: 1,
			per_page: 20,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: 'projects/p1/services',
				query: { page: 1, per_page: 20 },
			}),
		);
		expect(res.data.services).toHaveLength(1);
	});

	it('calls secrets.list with project ID', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { secrets: [{ id: 'sec1', name: 'API_KEY' }] },
			pagination: { hasNextPage: false, count: 1 },
		});
		const res = await northflankEndpointsNested.secrets.list(mockCtx, {
			projectId: 'p1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: 'projects/p1/secrets',
			}),
		);
		expect(res.data.secrets).toHaveLength(1);
	});

	it('calls secrets.get with project and secret IDs', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'sec1', name: 'API_KEY' },
		});
		const res = await northflankEndpointsNested.secrets.get(mockCtx, {
			projectId: 'p1',
			secretId: 'sec1',
			show: 'all',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: 'projects/p1/secrets/sec1',
				query: { show: 'all' },
			}),
		);
		expect(res.data.id).toBe('sec1');
	});

	it('calls secrets.create via POST without logging values', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'sec1', name: 'DB_KEY' },
		});
		await northflankEndpointsNested.secrets.create(mockCtx, {
			projectId: 'p1',
			name: 'DB_KEY',
			secretType: 'environment',
			priority: 10,
			secrets: { variables: { SECRET_VALUE: 'super-sensitive' } },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: 'projects/p1/secrets',
				body: {
					name: 'DB_KEY',
					secretType: 'environment',
					priority: 10,
					secrets: { variables: { SECRET_VALUE: 'super-sensitive' } },
				},
			}),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'northflank.secrets.create',
			{ projectId: 'p1', name: 'DB_KEY' },
			'completed',
		);
	});

	it('calls secrets.createOrUpdate via PUT on the collection path', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'sec1', name: 'DB_KEY' },
		});
		await northflankEndpointsNested.secrets.createOrUpdate(mockCtx, {
			projectId: 'p1',
			name: 'DB_KEY',
			secretType: 'environment',
			priority: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PUT',
				url: 'projects/p1/secrets',
				body: {
					name: 'DB_KEY',
					secretType: 'environment',
					priority: 10,
				},
			}),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'northflank.secrets.createOrUpdate',
			{ projectId: 'p1', name: 'DB_KEY' },
			'completed',
		);
	});

	it('calls secrets.patch via PATCH without logging values', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'sec1', name: 'DB_KEY' },
		});
		await northflankEndpointsNested.secrets.patch(mockCtx, {
			projectId: 'p1',
			secretId: 'sec1',
			description: 'patched description',
			priority: 5,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'PATCH',
				url: 'projects/p1/secrets/sec1',
				body: { description: 'patched description', priority: 5 },
			}),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'northflank.secrets.patch',
			{ projectId: 'p1', secretId: 'sec1' },
			'completed',
		);
	});

	it('calls secrets.update via POST without logging values', async () => {
		mockRequest.mockResolvedValueOnce({ data: {} });
		await northflankEndpointsNested.secrets.update(mockCtx, {
			projectId: 'p1',
			secretId: 'sec1',
			description: 'updated description',
			priority: 7,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: 'projects/p1/secrets/sec1',
				body: { description: 'updated description', priority: 7 },
			}),
		);
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'northflank.secrets.update',
			{ projectId: 'p1', secretId: 'sec1' },
			'completed',
		);
	});

	it('calls secrets.getDetails with linked addon details', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				id: 'sec1',
				name: 'DB',
				addonSecrets: [
					{
						id: 'addon1',
						name: 'Mongo',
						addonType: 'mongodb',
						version: '4.4.1',
					},
				],
			},
		});
		const res = await northflankEndpointsNested.secrets.getDetails(mockCtx, {
			projectId: 'p1',
			secretId: 'sec1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: 'projects/p1/secrets/sec1/details',
			}),
		);
		expect(res.data.addonSecrets).toHaveLength(1);
		expect(mockLogEvent).toHaveBeenCalledWith(
			mockCtx,
			'northflank.secrets.getDetails',
			{ projectId: 'p1', secretId: 'sec1' },
			'completed',
		);
	});

	it('calls pipelines.list with project ID', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { pipelines: [{ id: 'pipe1', name: 'example-pipeline' }] },
			pagination: { hasNextPage: false, count: 1 },
		});
		const res = await northflankEndpointsNested.pipelines.list(mockCtx, {
			projectId: 'p1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: 'projects/p1/pipelines',
			}),
		);
		expect(res.data.pipelines).toHaveLength(1);
	});

	it('calls plans.list', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { plans: [{ id: 'plan1', name: 'Standard' }] },
		});
		const res = await northflankEndpointsNested.plans.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: 'plans' }),
		);
		expect(res.data.plans).toHaveLength(1);
	});

	it('calls regions.list', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { regions: [{ id: 'europe-west', name: 'Europe - West' }] },
		});
		const res = await northflankEndpointsNested.regions.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: 'regions' }),
		);
		expect(res.data.regions).toHaveLength(1);
	});

	it('calls addonTypes.list', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				addonTypes: [
					{
						type: 'postgres',
						name: 'Postgres',
						description: 'PostgreSQL database',
						versions: ['14.1'],
						majors: ['14'],
					},
				],
			},
		});
		const res = await northflankEndpointsNested.addonTypes.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: 'addon-types' }),
		);
		expect(res.data.addonTypes).toHaveLength(1);
		expect(res.data.addonTypes[0]?.type).toBe('postgres');
		expect(res.data.addonTypes[0]?.name).toBe('Postgres');
		expect(res.data.addonTypes[0]?.versions).toEqual(['14.1']);
		expect(res.data.addonTypes[0]?.majors).toEqual(['14']);
	});

	it('calls cloudProviders.listNodeTypes with provider filters', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { nodeTypes: [{ id: 'nt1', name: 'n2-standard-4' }] },
		});
		const res = await northflankEndpointsNested.cloudProviders.listNodeTypes(
			mockCtx,
			{ provider: 'gcp', hasGpu: false },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: 'cloud-providers/node-types',
				query: expect.objectContaining({ provider: 'gcp', hasGpu: false }),
			}),
		);
		expect(res.data.nodeTypes).toHaveLength(1);
	});

	it('calls cloudProviders.listRegions with provider filter', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { regions: [{ id: 'europe-west1', name: 'europe-west1' }] },
		});
		const res = await northflankEndpointsNested.cloudProviders.listRegions(
			mockCtx,
			{ provider: 'gcp' },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'GET',
				url: 'cloud-providers/regions',
				query: expect.objectContaining({ provider: 'gcp' }),
			}),
		);
		expect(res.data.regions).toHaveLength(1);
	});

	it('calls misc.getDnsId', async () => {
		mockRequest.mockResolvedValueOnce({ data: { dns: 'exam-1234' } });
		const res = await northflankEndpointsNested.misc.getDnsId(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({ method: 'GET', url: 'dns-id' }),
		);
		expect(res.data.dns).toBe('exam-1234');
	});
});

import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { ZodError } from 'zod';
import type { NorthflankContext, NorthflankKeyBuilderContext } from './index';
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

const mockRequest = request as jest.Mock;
const mockLogEvent = logEventFromContext as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'test-api-token',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as NorthflankContext & { logEvent: jest.Mock };

describe('Northflank plugin structure and endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockReset();
	});

	it('exposes all 15 endpoints with meta and schemas', () => {
		const plugin = northflank();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(15);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(15);
		expect(Object.keys(northflankEndpointMeta)).toHaveLength(15);
		expect(Object.keys(northflankEndpointSchemas)).toHaveLength(15);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(northflankEndpointMeta).sort()).toEqual(paths);
		expect(Object.keys(northflankEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('configures api_key auth correctly', () => {
		const plugin = northflank();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});

	it('resolves key from options when provided', async () => {
		const plugin = northflank({ key: 'custom-api-token' });
		const keyBuilder = plugin.keyBuilder as (
			ctx: NorthflankKeyBuilderContext,
			source: string,
		) => Promise<string>;
		const key = await keyBuilder(
			{ authType: 'api_key' } as NorthflankKeyBuilderContext,
			'endpoint',
		);
		expect(key).toBe('custom-api-token');
	});

	it('resolves key from keys.get_api_key when options.key is not provided', async () => {
		const plugin = northflank();
		const keyBuilder = plugin.keyBuilder as (
			ctx: NorthflankKeyBuilderContext,
			source: string,
		) => Promise<string>;
		const mockKeysContext = {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue('stored-api-token'),
			},
		} as unknown as NorthflankKeyBuilderContext;

		const key = await keyBuilder(mockKeysContext, 'endpoint');
		expect(key).toBe('stored-api-token');
	});

	it('throws AuthMissingError when key is unavailable', async () => {
		const plugin = northflank();
		const keyBuilder = plugin.keyBuilder as (
			ctx: NorthflankKeyBuilderContext,
			source: string,
		) => Promise<string>;
		const mockKeysContext = {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(undefined),
			},
		} as unknown as NorthflankKeyBuilderContext;

		await expect(keyBuilder(mockKeysContext, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	describe('Runtime Schema Validation', () => {
		it('rejects invalid caller input at runtime before making an HTTP request', async () => {
			// projectId is required and cannot be empty
			await expect(
				northflankEndpointsNested.projects.get(mockCtx, {
					projectId: '',
				}),
			).rejects.toThrow(ZodError);

			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('validates provider response against output schema at runtime', async () => {
			// Provider returns malformed response missing data object
			mockRequest.mockResolvedValueOnce({ unexpected: true });

			await expect(
				northflankEndpointsNested.projects.list(mockCtx, {}),
			).rejects.toThrow(ZodError);
		});
	});

	describe('All 15 Endpoint Invocations and Request Construction', () => {
		// 1. projects.list
		it('calls projects.list and logs audit event', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { projects: [{ id: 'p1', name: 'Demo' }] },
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

		// 2. projects.get
		it('calls projects.get and logs audit event', async () => {
			mockRequest.mockResolvedValueOnce({ data: { id: 'p1' } });
			const res = await northflankEndpointsNested.projects.get(mockCtx, {
				projectId: 'p1',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'GET',
					url: 'projects/p1',
				}),
			);
			expect(res.data).toEqual({ id: 'p1' });
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.projects.get',
				{ projectId: 'p1' },
				'completed',
			);
		});

		// 3. projects.create
		it('calls projects.create with request body', async () => {
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
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.projects.create',
				{ name: 'New Project', region: 'europe-west' },
				'completed',
			);
		});

		// 4. projects.update
		it('calls projects.update with patch body', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { id: 'p1', name: 'Updated' },
			});
			await northflankEndpointsNested.projects.update(mockCtx, {
				projectId: 'p1',
				name: 'Updated',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'PATCH',
					url: 'projects/p1',
					body: { name: 'Updated' },
				}),
			);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.projects.update',
				{ projectId: 'p1' },
				'completed',
			);
		});

		// 5. services.list
		it('calls services.list with project ID and pagination query', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { services: [{ id: 's1', name: 'web' }] },
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
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.services.list',
				{ projectId: 'p1' },
				'completed',
			);
		});

		// 6. services.get
		it('calls services.get with project and service IDs', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { id: 's1', name: 'web' },
			});
			const res = await northflankEndpointsNested.services.get(mockCtx, {
				projectId: 'p1',
				serviceId: 's1',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'GET',
					url: 'projects/p1/services/s1',
				}),
			);
			expect(res.data).toEqual({ id: 's1', name: 'web' });
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.services.get',
				{ projectId: 'p1', serviceId: 's1' },
				'completed',
			);
		});

		// 7. services.createCombined
		it('calls services.createCombined with service payload', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { id: 's1', name: 'my-service' },
			});
			await northflankEndpointsNested.services.createCombined(mockCtx, {
				projectId: 'p1',
				name: 'my-service',
				deployment: { instances: 1 },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'POST',
					url: 'projects/p1/services/combined',
					body: { name: 'my-service', deployment: { instances: 1 } },
				}),
			);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.services.createCombined',
				{ projectId: 'p1', name: 'my-service' },
				'completed',
			);
		});

		// 8. services.updateCombined
		it('calls services.updateCombined with service PATCH payload', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { id: 's1', name: 'updated-service' },
			});
			await northflankEndpointsNested.services.updateCombined(mockCtx, {
				projectId: 'p1',
				serviceId: 's1',
				name: 'updated-service',
				deployment: { instances: 2 },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'PATCH',
					url: 'projects/p1/services/combined/s1',
					body: { name: 'updated-service', deployment: { instances: 2 } },
				}),
			);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.services.updateCombined',
				{ projectId: 'p1', serviceId: 's1' },
				'completed',
			);
		});

		// 9. environments.listPreviews (verifying preview-blueprints/{id}/previews route)
		it('calls environments.listPreviews with correct Northflank previews route', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { previewEnvironments: [{ id: 'pe1' }] },
			});
			const res = await northflankEndpointsNested.environments.listPreviews(
				mockCtx,
				{
					projectId: 'p1',
					previewBlueprintId: 'bp1',
					page: 1,
					per_page: 10,
				},
			);

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'GET',
					url: 'projects/p1/preview-blueprints/bp1/previews',
					query: { page: 1, per_page: 10 },
				}),
			);
			expect(res.data.previewEnvironments).toHaveLength(1);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.environments.listPreviews',
				{ projectId: 'p1', previewBlueprintId: 'bp1' },
				'completed',
			);
		});

		// 10. secrets.list
		it('calls secrets.list with project ID', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { secrets: [{ id: 'sec1', name: 'API_KEY' }] },
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
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.secrets.list',
				{ projectId: 'p1' },
				'completed',
			);
		});

		// 11. secrets.get
		it('calls secrets.get with project and secret IDs', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { id: 'sec1', name: 'API_KEY' },
			});
			const res = await northflankEndpointsNested.secrets.get(mockCtx, {
				projectId: 'p1',
				secretId: 'sec1',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'GET',
					url: 'projects/p1/secrets/sec1',
				}),
			);
			expect(res.data).toEqual({ id: 'sec1', name: 'API_KEY' });
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.secrets.get',
				{ projectId: 'p1', secretId: 'sec1' },
				'completed',
			);
		});

		// 12. secrets.create
		it('calls secrets.create and never exposes secret values in event log', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { id: 'sec1', name: 'DB_KEY' },
			});
			await northflankEndpointsNested.secrets.create(mockCtx, {
				projectId: 'p1',
				name: 'DB_KEY',
				data: { SECRET_VALUE: 'super-sensitive' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'POST',
					url: 'projects/p1/secrets',
					body: {
						name: 'DB_KEY',
						data: { SECRET_VALUE: 'super-sensitive' },
					},
				}),
			);

			// Ensure event log does NOT contain the secret payload
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.secrets.create',
				{ projectId: 'p1', name: 'DB_KEY' },
				'completed',
			);
		});

		// 13. secrets.update (verifying POST method per Northflank API)
		it('calls secrets.update using POST method per Northflank API specification', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { id: 'sec1', name: 'DB_KEY_UPDATED' },
			});
			await northflankEndpointsNested.secrets.update(mockCtx, {
				projectId: 'p1',
				secretId: 'sec1',
				name: 'DB_KEY_UPDATED',
				data: { NEW_SECRET: 'new-value' },
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'POST',
					url: 'projects/p1/secrets/sec1',
					body: {
						name: 'DB_KEY_UPDATED',
						data: { NEW_SECRET: 'new-value' },
					},
				}),
			);

			// Ensure event log does NOT contain the secret payload
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.secrets.update',
				{ projectId: 'p1', secretId: 'sec1' },
				'completed',
			);
		});

		// 14. plans.list
		it('calls plans.list', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { plans: [{ id: 'plan1' }] },
			});
			const res = await northflankEndpointsNested.plans.list(mockCtx, {});
			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'GET',
					url: 'plans',
				}),
			);
			expect(res.data.plans).toHaveLength(1);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.plans.list',
				{},
				'completed',
			);
		});

		// 15. regions.list
		it('calls regions.list', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { regions: [{ id: 'eu-west' }] },
			});
			const res = await northflankEndpointsNested.regions.list(mockCtx, {});
			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'GET',
					url: 'regions',
				}),
			);
			expect(res.data.regions).toHaveLength(1);
			expect(mockLogEvent).toHaveBeenCalledWith(
				mockCtx,
				'northflank.regions.list',
				{},
				'completed',
			);
		});
	});
});

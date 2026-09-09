import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
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

	describe('Endpoint invocations', () => {
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
		});

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
		});

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
		});

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
		});

		it('calls environments.listPreviews with blueprint parameters', async () => {
			mockRequest.mockResolvedValueOnce({
				data: { previewEnvironments: [] },
			});
			await northflankEndpointsNested.environments.listPreviews(mockCtx, {
				projectId: 'p1',
				previewBlueprintId: 'bp1',
			});

			expect(mockRequest).toHaveBeenCalledWith(
				expect.any(Object),
				expect.objectContaining({
					method: 'GET',
					url: 'projects/p1/preview-blueprints/bp1/preview-environments',
				}),
			);
		});

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
		});

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
		});
	});
});

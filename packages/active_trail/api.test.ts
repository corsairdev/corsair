import { request } from 'corsair/http';
import { makeActiveTrailRequest } from './client';
import type { ActiveTrailContext } from './index';
import { active_trail, activeTrailEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

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
	key: 'test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as ActiveTrailContext;

describe('ActiveTrail plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = active_trail();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(159);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(159);
		expect(Object.keys(activeTrailEndpointSchemas)).toHaveLength(159);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(activeTrailEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports api key auth configuration', () => {
		const plugin = active_trail();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
});

describe('ActiveTrail request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends Authorization header and JSON bodies', async () => {
		await makeActiveTrailRequest('/api/account/balance', 'test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://webapi.mymarketing.co.il/api',
				TOKEN: 'test-api-key',
				HEADERS: expect.objectContaining({
					Authorization: 'test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/account/balance',
			}),
		);
	});
});

describe('ActiveTrail endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = active_trail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints> & {
			account: {
				getAccountBalance: (ctx: ActiveTrailContext, input: {}) => Promise<unknown>;
			};
			groups: {
				createANewGroup: (
					ctx: ActiveTrailContext,
					input: { name: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.account.getAccountBalance(mockCtx, {});
		await endpoints.groups.createANewGroup(mockCtx, { name: 'Test Group' });

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/api/account/balance',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/api/groups',
					body: { name: 'Test Group' },
				}),
			]),
		);
	});
});

import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { makeAeroleadsRequest } from './client';
import type { AeroleadsContext, AeroleadsKeyBuilderContext } from './index';
import { aeroleads, aeroleadsEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

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
	keyBuilder: async () => 'test-api-key',
} as unknown as AeroleadsContext;

describe('Aeroleads plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = aeroleads();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(1);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(1);
		expect(Object.keys(aeroleadsEndpointSchemas)).toHaveLength(1);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(aeroleadsEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(typeof plugin.pluginWebhookMatcher).toBe('function');
	});

	it('supports api key auth configuration', () => {
		const plugin = aeroleads();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

describe('Aeroleads request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('adds API key to config TOKEN and request query', async () => {
		await makeAeroleadsRequest('/api/get_linkedin_details', 'test-api-key', {
			method: 'GET',
			query: { linkedin_url: 'https://linkedin.com/in/test' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://aeroleads.com',
				TOKEN: 'test-api-key',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/get_linkedin_details',
				query: {
					api_key: 'test-api-key',
					linkedin_url: 'https://linkedin.com/in/test',
				},
			}),
		);
	});
});

describe('Aeroleads endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue({});
	});

	it('maps representative operations to API routes', async () => {
		const plugin = aeroleads({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			linkedinDetails: {
				get: (
					ctx: AeroleadsContext,
					input: { linkedin_url: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.linkedinDetails.get(mockCtx, {
			linkedin_url: 'https://linkedin.com/in/test',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/api/get_linkedin_details',
					query: {
						api_key: 'test-api-key',
						linkedin_url: 'https://linkedin.com/in/test',
					},
				}),
			]),
		);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'aeroleads.linkedinDetails.get',
			{ linkedin_url: 'https://linkedin.com/in/test' },
			'completed',
		);
	});
});

describe('aeroleads keyBuilder authentication', () => {
	const plugin = aeroleads();

	it('returns options.key for endpoint source', async () => {
		const withOptionsKey = aeroleads({ key: 'test-api-key' });
		const out = await (withOptionsKey.keyBuilder as any)(
			{ authType: 'api_key' } as unknown as AeroleadsKeyBuilderContext,
			'endpoint',
		);
		expect(out).toBe('test-api-key');
	});

	it('throws AuthMissingError when api key is absent', async () => {
		const noKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as AeroleadsKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as any)(noKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('reads api key from key manager', async () => {
		const withKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => 'test-api-key' },
		} as unknown as AeroleadsKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as any)(withKeyCtx, 'endpoint'),
		).resolves.toBe('test-api-key');
	});
});

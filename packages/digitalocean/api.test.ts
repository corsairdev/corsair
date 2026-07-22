import { request } from 'corsair/http';
import { makeDigitalOceanRequest } from './client';
import type { DigitalOceanContext } from './index';
import { digitalOceanEndpointSchemas, digitalocean } from './index';

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

// Partial CorsairContext stub for unit tests; full context is provided at runtime by the plugin host.
const mockCtx = {
	key: 'test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as DigitalOceanContext;

describe('DigitalOcean plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = digitalocean();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(47);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(47);
		expect(Object.keys(digitalOceanEndpointSchemas)).toHaveLength(47);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(digitalOceanEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports api key auth configuration', () => {
		const plugin = digitalocean();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
});

describe('DigitalOcean request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends Bearer Authorization header and JSON bodies', async () => {
		await makeDigitalOceanRequest('/droplets', 'test-api-key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.digitalocean.com/v2',
				TOKEN: 'test-api-key',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/droplets',
			}),
		);
	});
});

describe('DigitalOcean endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = digitalocean({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			droplets: {
				listAllDroplets: (
					ctx: DigitalOceanContext,
					input: {},
				) => Promise<unknown>;
				createNewDroplet: (
					ctx: DigitalOceanContext,
					input: { name: string; region: string; size: string; image: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.droplets.listAllDroplets(mockCtx, {});
		await endpoints.droplets.createNewDroplet(mockCtx, {
			name: 'web-1',
			region: 'nyc3',
			size: 's-1vcpu-1gb',
			image: 'ubuntu-24-04-x64',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'GET',
					url: '/droplets',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/droplets',
					body: {
						name: 'web-1',
						region: 'nyc3',
						size: 's-1vcpu-1gb',
						image: 'ubuntu-24-04-x64',
					},
				}),
			]),
		);
	});
});

import { request } from 'corsair/http';
import { makeAgencyZoomRequest } from './client';
import type { AgencyZoomContext } from './index';
import { agencyzoom, agencyZoomEndpointSchemas } from './index';

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
	key: 'test-jwt-token',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as AgencyZoomContext;

describe('AgencyZoom plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = agencyzoom();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(99);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(99);
		expect(Object.keys(agencyZoomEndpointSchemas)).toHaveLength(99);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(agencyZoomEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports api key auth configuration', () => {
		const plugin = agencyzoom();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});
});

describe('AgencyZoom request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends Bearer Authorization header and JSON bodies', async () => {
		await makeAgencyZoomRequest('/leads/list', 'test-jwt-token', {
			method: 'POST',
			body: { page: 1 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.agencyzoom.com/v1/api',
				TOKEN: 'test-jwt-token',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-jwt-token',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/leads/list',
				body: { page: 1 },
			}),
		);
	});
});

describe('AgencyZoom endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = agencyzoom({ key: 'test-jwt-token' });
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints> & {
			leads: {
				searchLeads: (ctx: AgencyZoomContext, input: {}) => Promise<unknown>;
				createLead: (
					ctx: AgencyZoomContext,
					input: { firstName: string; lastName: string; email: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.leads.searchLeads(mockCtx, {});
		await endpoints.leads.createLead(mockCtx, {
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'POST',
					url: '/leads/list',
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/leads/create',
					body: {
						firstName: 'Jane',
						lastName: 'Doe',
						email: 'jane@example.com',
					},
				}),
			]),
		);
	});
});

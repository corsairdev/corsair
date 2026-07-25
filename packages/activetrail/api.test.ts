import { request } from 'corsair/http';
import { makeActiveTrailRequest } from './client';
import type { ActiveTrailContext } from './index';
import { activeTrailEndpointSchemas, activetrail } from './index';

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
		const plugin = activetrail();
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
		const plugin = activetrail();
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
		const plugin = activetrail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			account: {
				getAccountBalance: (
					ctx: ActiveTrailContext,
					input: {},
				) => Promise<unknown>;
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

	it('createCampaign posts to /api/campaigns without a template Id path', async () => {
		const plugin = activetrail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			campaigns: {
				createCampaign: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
		};

		await endpoints.campaigns.createCampaign(mockCtx, {
			design: { html: '<p>hi</p>' },
			details: { name: 'Launch' },
			scheduling: { send_now: true },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/api/campaigns',
				body: expect.objectContaining({
					details: { name: 'Launch' },
				}),
			}),
		);
	});

	it('uses distinct paths for operational message endpoints', async () => {
		const plugin = activetrail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			external: {
				sendOperationalMessage: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
				sendOperationalMessageEmail: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
		};

		await endpoints.external.sendOperationalMessage(mockCtx, {
			design: { html: '<p>a</p>' },
			details: { subject: 'ops' },
		});
		await endpoints.external.sendOperationalMessageEmail(mockCtx, {
			design: { html: '<p>b</p>' },
			details: { subject: 'email' },
			email_package: [{ email: 'a@b.com', pairs: [] }],
		});

		const urls = mockRequest.mock.calls.map((call) => call[1].url);
		expect(urls).toEqual([
			'/api/external/operational/message',
			'/api/OperationalMessage/Message',
		]);
	});

	it('postTemplatesCampaign requires Id in the path', async () => {
		const plugin = activetrail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			templates: {
				postTemplatesCampaign: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
		};

		await endpoints.templates.postTemplatesCampaign(mockCtx, {
			Id: 42,
			template_id: 42,
			campaign_details: { name: 'From template' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/api/templates/42/campaign',
			}),
		);
	});
});

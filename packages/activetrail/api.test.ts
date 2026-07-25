import { request } from 'corsair/http';
import { makeActiveTrailRequest } from './client';
import { activeTrailRoutes } from './endpoints/routes';
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

	it('has unique method+path pairs for every route', () => {
		const seen = new Map<string, string>();
		for (const route of activeTrailRoutes) {
			const key = `${route.method} ${route.path}`;
			const prev = seen.get(key);
			expect(prev).toBeUndefined();
			seen.set(key, route.name);
		}
		expect(seen.size).toBe(activeTrailRoutes.length);
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

	it('maps corrected report and webhook routes', async () => {
		const plugin = activetrail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			smsCampaignReport: {
				getSmsCampaignDelivered: (
					ctx: ActiveTrailContext,
					input: { id: number },
				) => Promise<unknown>;
			};
			webhooks: {
				postWebhooksParameters: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
			external: {
				getSmsSendingProfiles: (
					ctx: ActiveTrailContext,
					input: {},
				) => Promise<unknown>;
			};
			mailingList: {
				getMailingList: (
					ctx: ActiveTrailContext,
					input: { id: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.smsCampaignReport.getSmsCampaignDelivered(mockCtx, {
			id: 9,
		});
		await endpoints.webhooks.postWebhooksParameters(mockCtx, {
			webhook_id: 3,
			key: 'x',
			value: 'y',
			event_value_type: 'static',
			event_parameter_type: 'header',
		});
		await endpoints.external.getSmsSendingProfiles(mockCtx, {});
		await endpoints.mailingList.getMailingList(mockCtx, { id: 'ml-1' });

		const urls = mockRequest.mock.calls.map((call) => call[1].url);
		expect(urls).toEqual([
			'/api/smscampaignreport/9/Delivered',
			'/api/webhooks/3/parameters',
			'/api/account/sms-sendingprofiles',
			'/api/mailinglist/ml-1',
		]);
		expect(mockRequest.mock.calls[2][1].method).toBe('GET');
	});

	it('forwards pagination query params on list endpoints', async () => {
		const plugin = activetrail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			groups: {
				getAllGroups: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
				getGroupContentsById: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
			contacts: {
				getContactList: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
			landingpage: {
				getLandingPages: (
					ctx: ActiveTrailContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
		};

		await endpoints.groups.getAllGroups(mockCtx, {
			page: 2,
			limit: 25,
			search_term: 'vip',
		});
		await endpoints.contacts.getContactList(mockCtx, {
			page: 1,
			limit: 50,
			customer_states: 'active',
			from_date: '2026-01-01',
			to_date: '2026-07-01',
		});
		await endpoints.groups.getGroupContentsById(mockCtx, {
			group_id: 7,
			page: 3,
			limit: 10,
		});
		await endpoints.landingpage.getLandingPages(mockCtx, {
			page: 1,
			limit: 20,
		});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual([
			expect.objectContaining({
				method: 'GET',
				url: '/api/groups',
				query: expect.objectContaining({
					Page: 2,
					Limit: 25,
					SearchTerm: 'vip',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/contacts',
				query: expect.objectContaining({
					Page: 1,
					Limit: 50,
					CustomerStates: 'active',
					FromDate: '2026-01-01',
					ToDate: '2026-07-01',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/groups/7/members',
				query: expect.objectContaining({
					Page: 3,
					Limit: 10,
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/landingpage',
				query: expect.objectContaining({
					Page: 1,
					Limit: 20,
				}),
			}),
		]);
	});

	it('deleteMailingList resolves path from required id', async () => {
		const plugin = activetrail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			external: {
				deleteMailingList: (
					ctx: ActiveTrailContext,
					input: { id: string },
				) => Promise<unknown>;
			};
		};

		await endpoints.external.deleteMailingList(mockCtx, { id: 'ml-42' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/api/external/mailinglist/ml-42',
			}),
		);
	});

	it('classifies read routes with correct method and risk', async () => {
		const byName = Object.fromEntries(
			activeTrailRoutes.map((route) => [route.name, route]),
		);
		expect(byName.getSmsSendingProfiles).toEqual(
			expect.objectContaining({
				method: 'GET',
				path: '/api/account/sms-sendingprofiles',
				riskLevel: 'read',
			}),
		);
		expect(byName.getUpdateActions).toEqual(
			expect.objectContaining({
				method: 'GET',
				path: '/api/automations/GetUpdateActions',
				riskLevel: 'read',
			}),
		);
		expect(byName.getSendingProfiles).toEqual(
			expect.objectContaining({
				method: 'GET',
				path: '/api/account/sendingprofiles',
				riskLevel: 'read',
			}),
		);

		const plugin = activetrail({ key: 'test-api-key' });
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			external: {
				getSmsSendingProfiles: (
					ctx: ActiveTrailContext,
					input: {},
				) => Promise<unknown>;
				getSendingProfiles: (
					ctx: ActiveTrailContext,
					input: {},
				) => Promise<unknown>;
			};
			automations: {
				getUpdateActions: (
					ctx: ActiveTrailContext,
					input: {},
				) => Promise<unknown>;
			};
		};

		await endpoints.external.getSmsSendingProfiles(mockCtx, {});
		await endpoints.automations.getUpdateActions(mockCtx, {});
		await endpoints.external.getSendingProfiles(mockCtx, {});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual([
			expect.objectContaining({
				method: 'GET',
				url: '/api/account/sms-sendingprofiles',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/automations/GetUpdateActions',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/account/sendingprofiles',
			}),
		]);
	});
});

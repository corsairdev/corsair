import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ZodError } from 'zod';
import * as client from './client';
import { Account, Events, Milestones, Reports, Sites } from './endpoints';
import type { FathomContext } from './index';
import { fathom, fathomEndpointMeta, fathomEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeFathomRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeFathomRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildTestCtx(): FathomContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-token',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-token'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildTestCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Fathom endpoints', () => {
	describe('Account endpoints', () => {
		it('account.get sends GET /account and parses output', async () => {
			const mockAccount = {
				id: 500302232,
				object: 'account' as const,
				name: 'Homer Simpson',
				email: 'homer@example.com',
			};
			mockedRequest.mockResolvedValue(mockAccount);

			const result = await Account.get(ctx, {});
			expect(result).toEqual(mockAccount);
			expect(mockedRequest).toHaveBeenCalledWith('/account', 'test-api-token', {
				method: 'GET',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'fathom.account.get',
				{ has_account: true },
				'completed',
			);
		});

		it('account.getToken sends GET /token and parses metadata', async () => {
			const mockToken = {
				name: 'Prod Token',
				version: 4,
				abilities: ['*'],
				last_used_at: '2024-01-15 09:24:00',
				expires_at: null,
				created_at: '2024-01-01 12:00:00',
				updated_at: '2024-01-15 09:24:00',
			};
			mockedRequest.mockResolvedValue(mockToken);

			const result = await Account.getToken(ctx, {});
			expect(result).toEqual(mockToken);
			expect(mockedRequest).toHaveBeenCalledWith('/token', 'test-api-token', {
				method: 'GET',
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'fathom.account.getToken',
				{ token_name: 'Prod Token' },
				'completed',
			);
		});
	});

	describe('Sites endpoints', () => {
		const mockSite = {
			id: 'CDBUGS',
			object: 'site' as const,
			name: 'Bugs Bunny Portfolio',
			sharing: 'none' as const,
			created_at: '2020-07-27 12:01:01',
			timezone: 'America/New_York',
		};

		it('sites.list sends GET /sites with query params and parses response', async () => {
			const mockList = {
				object: 'list' as const,
				url: '/v1/sites',
				has_more: false,
				data: [mockSite],
			};
			mockedRequest.mockResolvedValue(mockList);

			const result = await Sites.list(ctx, { limit: 10 });
			expect(result).toEqual(mockList);
			expect(mockedRequest).toHaveBeenCalledWith('/sites', 'test-api-token', {
				method: 'GET',
				query: { limit: 10 },
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'fathom.sites.list',
				{ count: 1, has_more: false },
				'completed',
			);
		});

		it('sites.create sends POST /sites with body and encodes site creation', async () => {
			mockedRequest.mockResolvedValue(mockSite);

			const result = await Sites.create(ctx, {
				name: 'Bugs Bunny Portfolio',
				sharing: 'none',
				timezone: 'America/New_York',
			});

			expect(result).toEqual(mockSite);
			expect(mockedRequest).toHaveBeenCalledWith('/sites', 'test-api-token', {
				method: 'POST',
				body: {
					name: 'Bugs Bunny Portfolio',
					sharing: 'none',
					timezone: 'America/New_York',
				},
			});
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'fathom.sites.create',
				{ site_id: 'CDBUGS' },
				'completed',
			);
		});

		it('sites.get sends GET /sites/:id with encoded site_id', async () => {
			mockedRequest.mockResolvedValue(mockSite);

			const result = await Sites.get(ctx, { site_id: 'CDBUGS' });
			expect(result).toEqual(mockSite);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS',
				'test-api-token',
				{ method: 'GET' },
			);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'fathom.sites.get',
				{ site_id: 'CDBUGS' },
				'completed',
			);
		});

		it('sites.update sends POST /sites/:id with updated fields', async () => {
			const updatedSite = { ...mockSite, name: 'Updated Portfolio' };
			mockedRequest.mockResolvedValue(updatedSite);

			const result = await Sites.update(ctx, {
				site_id: 'CDBUGS',
				name: 'Updated Portfolio',
			});

			expect(result).toEqual(updatedSite);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'Updated Portfolio' },
				},
			);
		});

		it('sites.delete sends DELETE /sites/:id', async () => {
			const mockDel = {
				id: 'CDBUGS',
				object: 'site' as const,
				deleted: true as const,
			};
			mockedRequest.mockResolvedValue(mockDel);

			const result = await Sites.delete(ctx, { site_id: 'CDBUGS' });
			expect(result).toEqual(mockDel);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS',
				'test-api-token',
				{ method: 'DELETE' },
			);
		});

		it('sites.wipe sends DELETE /sites/:id/data', async () => {
			const mockWipe = { id: 'CDBUGS', deleted: true };
			mockedRequest.mockResolvedValue(mockWipe);

			const result = await Sites.wipe(ctx, { site_id: 'CDBUGS' });
			expect(result).toEqual(mockWipe);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/data',
				'test-api-token',
				{ method: 'DELETE' },
			);
		});

		it('rejects invalid site input before network call', async () => {
			// `unknown` because rejection value has no static type before caught.
			const error: unknown = await Sites.create(ctx, {
				name: '',
			}).catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ZodError);
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});

	describe('Events endpoints', () => {
		const mockEvent = {
			id: 'IJKLMNOP',
			object: 'event' as const,
			name: 'Purchased product',
			currency: 'pound',
			created_at: '2020-08-21 15:24:00',
		};

		it('events.list sends GET /sites/:id/events', async () => {
			const mockList = {
				object: 'list' as const,
				url: '/v1/sites/CDBUGS/events',
				has_more: false,
				data: [mockEvent],
			};
			mockedRequest.mockResolvedValue(mockList);

			const result = await Events.list(ctx, { site_id: 'CDBUGS' });
			expect(result).toEqual(mockList);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/events',
				'test-api-token',
				{
					method: 'GET',
					query: {},
				},
			);
		});

		it('events.setCurrency sends POST /sites/:id/events/currency', async () => {
			const mockResp = {
				object: 'event' as const,
				name: 'Purchased product',
				currency: 'pound',
				updated: true as const,
			};
			mockedRequest.mockResolvedValue(mockResp);

			const result = await Events.setCurrency(ctx, {
				site_id: 'CDBUGS',
				name: 'Purchased product',
				currency: 'pound',
			});

			expect(result).toEqual(mockResp);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/events/currency',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'Purchased product', currency: 'pound' },
				},
			);
		});

		it('events.deleteByName sends DELETE /sites/:id/events?name=...', async () => {
			const mockResp = {
				object: 'event' as const,
				name: 'Purchased product',
				deleted: true as const,
			};
			mockedRequest.mockResolvedValue(mockResp);

			const result = await Events.deleteByName(ctx, {
				site_id: 'CDBUGS',
				name: 'Purchased product',
			});

			expect(result).toEqual(mockResp);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/events',
				'test-api-token',
				{
					method: 'DELETE',
					query: { name: 'Purchased product' },
				},
			);
		});

		it('deprecated events operations send appropriate requests', async () => {
			mockedRequest.mockResolvedValue({ id: 'EV_1', deleted: true });

			await Events.create(ctx, { site_id: 'CDBUGS', name: 'Legacy' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/events',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'Legacy' },
				},
			);

			await Events.get(ctx, { site_id: 'CDBUGS', event_id: 'EV_1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/events/EV_1',
				'test-api-token',
				{
					method: 'GET',
				},
			);

			await Events.update(ctx, {
				site_id: 'CDBUGS',
				event_id: 'EV_1',
				name: 'Updated',
			});
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/events/EV_1',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'Updated' },
				},
			);

			await Events.delete(ctx, { site_id: 'CDBUGS', event_id: 'EV_1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/events/EV_1',
				'test-api-token',
				{
					method: 'DELETE',
				},
			);

			await Events.wipe(ctx, { site_id: 'CDBUGS', event_id: 'EV_1' });
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/events/EV_1/data',
				'test-api-token',
				{
					method: 'DELETE',
				},
			);
		});
	});

	describe('Milestones endpoints', () => {
		const mockMilestone = {
			id: 'ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
			object: 'milestone' as const,
			name: 'Launch',
			milestone_date: '2024-01-15 00:00:00',
			created_at: '2024-01-10 12:00:00',
			updated_at: '2024-01-10 12:00:00',
		};

		it('milestones.list sends GET /sites/:id/milestones', async () => {
			const mockList = {
				object: 'list' as const,
				url: '/api/v1/CDBUGS/milestones',
				has_more: false,
				data: [mockMilestone],
			};
			mockedRequest.mockResolvedValue(mockList);

			const result = await Milestones.list(ctx, { site_id: 'CDBUGS' });
			expect(result).toEqual(mockList);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/milestones',
				'test-api-token',
				{
					method: 'GET',
					query: {},
				},
			);
		});

		it('milestones.create sends POST /sites/:id/milestones', async () => {
			mockedRequest.mockResolvedValue(mockMilestone);

			const result = await Milestones.create(ctx, {
				site_id: 'CDBUGS',
				name: 'Launch',
				milestone_date: '2024-01-15',
			});

			expect(result).toEqual(mockMilestone);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/milestones',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'Launch', milestone_date: '2024-01-15' },
				},
			);
		});

		it('milestones.get sends GET /sites/:id/milestones/:milestone_id', async () => {
			mockedRequest.mockResolvedValue(mockMilestone);

			const result = await Milestones.get(ctx, {
				site_id: 'CDBUGS',
				milestone_id: 'ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
			});

			expect(result).toEqual(mockMilestone);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/milestones/ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
				'test-api-token',
				{ method: 'GET' },
			);
		});

		it('milestones.update sends POST /sites/:id/milestones/:milestone_id', async () => {
			mockedRequest.mockResolvedValue(mockMilestone);

			const result = await Milestones.update(ctx, {
				site_id: 'CDBUGS',
				milestone_id: 'ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
				name: 'Launch',
				milestone_date: '2024-01-15',
			});

			expect(result).toEqual(mockMilestone);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/milestones/ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
				'test-api-token',
				{
					method: 'POST',
					body: { name: 'Launch', milestone_date: '2024-01-15' },
				},
			);
		});

		it('milestones.delete sends DELETE /sites/:id/milestones/:milestone_id', async () => {
			const mockDel = {
				id: 'ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
				object: 'milestone' as const,
				deleted: true as const,
			};
			mockedRequest.mockResolvedValue(mockDel);

			const result = await Milestones.delete(ctx, {
				site_id: 'CDBUGS',
				milestone_id: 'ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
			});

			expect(result).toEqual(mockDel);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/sites/CDBUGS/milestones/ddc9cdff-ab83-41fa-96c6-dfb276a862e7',
				'test-api-token',
				{ method: 'DELETE' },
			);
		});
	});

	describe('Reports endpoints', () => {
		it('reports.aggregation sends GET /aggregations and parses dynamic rows', async () => {
			const mockRows = [
				{
					browser: 'Chrome',
					device_type: 'Desktop',
					pageviews: '30000',
				},
			];
			mockedRequest.mockResolvedValue(mockRows);

			const result = await Reports.aggregation(ctx, {
				entity: 'pageview',
				entity_id: 'CDBUGS',
				aggregates: 'pageviews',
			});

			expect(result).toEqual(mockRows);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/aggregations',
				'test-api-token',
				{
					method: 'GET',
					query: {
						entity: 'pageview',
						entity_id: 'CDBUGS',
						aggregates: 'pageviews',
					},
				},
			);
		});

		it('reports.currentVisitors sends GET /current_visitors', async () => {
			const mockResp = {
				total: 144,
				content: [{ hostname: 'bugsbunny.com', pathname: '/', total: 100 }],
			};
			mockedRequest.mockResolvedValue(mockResp);

			const result = await Reports.currentVisitors(ctx, {
				site_id: 'CDBUGS',
				detailed: true,
			});

			expect(result).toEqual(mockResp);
			expect(mockedRequest).toHaveBeenCalledWith(
				'/current_visitors',
				'test-api-token',
				{
					method: 'GET',
					query: { site_id: 'CDBUGS', detailed: true },
				},
			);
		});
	});

	describe('Plugin initialization and metadata alignment', () => {
		it('exposes all endpoints in the plugin instance matching schema and metadata maps', () => {
			const plugin = fathom({ key: 'test-key' });
			expect(plugin.id).toBe('fathom');
			expect(plugin.authConfig).toEqual({ api_key: {} });

			const schemaKeys = Object.keys(fathomEndpointSchemas).sort();
			const metaKeys = Object.keys(fathomEndpointMeta).sort();
			expect(schemaKeys).toEqual(metaKeys);
			expect(schemaKeys.length).toBe(23);
		});

		it('keyBuilder throws AuthMissingError when key is absent', async () => {
			const plugin = fathom();
			expect(plugin.keyBuilder).toBeDefined();
			if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
			const emptyCtx = {
				authType: 'api_key' as const,
				options: {},
				tenantId: 'test-tenant',
				keys: {
					get_api_key: () => Promise.resolve(null),
					set_api_key: () => Promise.resolve(),
					get_dek: () => Promise.resolve('dek'),
					issue_new_dek: () => Promise.resolve('dek'),
				},
			};

			await expect(
				plugin.keyBuilder(emptyCtx as never, 'endpoint'),
			).rejects.toThrow(AuthMissingError);
		});

		it('keyBuilder returns static key when provided in options', async () => {
			const plugin = fathom({ key: 'static-key-xyz' });
			expect(plugin.keyBuilder).toBeDefined();
			if (!plugin.keyBuilder) throw new Error('keyBuilder missing');
			const keyBuilderCtx = {
				authType: 'api_key' as const,
				options: { key: 'static-key-xyz' },
				tenantId: 'test-tenant',
				keys: {
					get_api_key: () => Promise.resolve('other-key'),
					set_api_key: () => Promise.resolve(),
					get_dek: () => Promise.resolve('dek'),
					issue_new_dek: () => Promise.resolve('dek'),
				},
			};
			const key = await plugin.keyBuilder(keyBuilderCtx as never, 'endpoint');
			expect(key).toBe('static-key-xyz');
		});
	});
});

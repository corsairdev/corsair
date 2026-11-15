import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Accounts,
	AdSets,
	Ads,
	Audiences,
	Campaigns,
	Creatives,
	Insights,
} from './endpoints';
import type { MetaAdsContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeMetaAdsRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeMetaAdsRequest);
const mockedLog = jest.mocked(logEventFromContext);
const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'meta-test-token',
	options: {},
	keys: {
		get_dek: () => Promise.resolve('test-dek'),
		issue_new_dek: () => Promise.resolve('test-dek'),
		get_access_token: () => Promise.resolve('meta-test-token'),
		get_refresh_token: () => Promise.resolve(null),
		get_expires_at: () => Promise.resolve(null),
		get_scope: () => Promise.resolve(null),
		get_integration_credentials: () =>
			Promise.resolve({
				client_id: null,
				client_secret: null,
				redirect_url: null,
			}),
		set_access_token: (_value: string | null) => Promise.resolve(),
		set_refresh_token: (_value: string | null) => Promise.resolve(),
		set_expires_at: (_value: string | null) => Promise.resolve(),
		set_scope: (_value: string | null) => Promise.resolve(),
		get_webhook_signature: () => Promise.resolve(null),
		set_webhook_signature: () => Promise.resolve(),
	},
	db: {},
} satisfies MetaAdsContext;

// Request bodies can include nested JSON objects defined by the endpoint-specific schemas.
type Case = {
	name: string;
	path: string;
	method: 'GET' | 'POST' | 'DELETE';
	query?: Record<string, string | number | undefined>;
	body?: Record<string, unknown>;
	call: () => Promise<void>;
};

const listResponse = {
	data: [{ id: '100', name: 'Test' }],
	paging: { cursors: { after: 'cursor-2' } },
};
const objectResponse = { id: '100', name: 'Test' };
const createResponse = { id: '100' };
const successResponse = { success: true };

const cases: Case[] = [
	{
		name: 'accounts.list',
		path: '/me/adaccounts',
		method: 'GET',
		query: { fields: 'id,name', limit: 2, after: 'cursor-1' },
		call: async () => {
			await Accounts.list(ctx, {
				fields: 'id,name',
				limit: 2,
				after: 'cursor-1',
			});
		},
	},
	{
		name: 'accounts.get',
		path: '/act_123',
		method: 'GET',
		query: { fields: 'id,name' },
		call: async () => {
			await Accounts.get(ctx, { accountId: 'act_123', fields: 'id,name' });
		},
	},
	{
		name: 'campaigns.list',
		path: '/act_123/campaigns',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Campaigns.list(ctx, {
				accountId: '123',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'campaigns.get',
		path: '/campaign-1',
		method: 'GET',
		query: { fields: 'id,name' },
		call: async () => {
			await Campaigns.get(ctx, { campaignId: 'campaign-1', fields: 'id,name' });
		},
	},
	{
		name: 'campaigns.create',
		path: '/act_123/campaigns',
		method: 'POST',
		body: {
			name: 'Test campaign',
			objective: 'OUTCOME_TRAFFIC',
			special_ad_categories: '[]',
			status: 'PAUSED',
			daily_budget: 500,
		},
		call: async () => {
			await Campaigns.create(ctx, {
				accountId: '123',
				name: 'Test campaign',
				objective: 'OUTCOME_TRAFFIC',
				specialAdCategories: [],
				status: 'PAUSED',
				dailyBudget: 500,
			});
		},
	},
	{
		name: 'campaigns.update',
		path: '/campaign-1',
		method: 'POST',
		body: { name: 'Updated', status: 'PAUSED', daily_budget: 250 },
		call: async () => {
			await Campaigns.update(ctx, {
				campaignId: 'campaign-1',
				name: 'Updated',
				status: 'PAUSED',
				dailyBudget: 250,
			});
		},
	},
	{
		name: 'campaigns.delete',
		path: '/campaign-1',
		method: 'DELETE',
		call: async () => {
			await Campaigns.delete(ctx, { campaignId: 'campaign-1' });
		},
	},
	{
		name: 'adSets.list',
		path: '/act_123/adsets',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await AdSets.list(ctx, {
				accountId: '123',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'adSets.get',
		path: '/adset-1',
		method: 'GET',
		query: { fields: 'id,name' },
		call: async () => {
			await AdSets.get(ctx, { adSetId: 'adset-1', fields: 'id,name' });
		},
	},
	{
		name: 'adSets.create',
		path: '/act_123/adsets',
		method: 'POST',
		body: {
			campaign_id: 'campaign-1',
			name: 'Test set',
			optimization_goal: 'REACH',
			billing_event: 'IMPRESSIONS',
			targeting: { geo_locations: { countries: ['US'] } },
			status: 'PAUSED',
			lifetime_budget: 1000,
			end_time: '2026-12-01T00:00:00Z',
		},
		call: async () => {
			await AdSets.create(ctx, {
				accountId: '123',
				campaignId: 'campaign-1',
				name: 'Test set',
				optimizationGoal: 'REACH',
				billingEvent: 'IMPRESSIONS',
				targeting: { geo_locations: { countries: ['US'] } },
				status: 'PAUSED',
				lifetimeBudget: 1000,
				endTime: '2026-12-01T00:00:00Z',
			});
		},
	},
	{
		name: 'adSets.update',
		path: '/adset-1',
		method: 'POST',
		body: {
			name: 'Updated set',
			status: 'PAUSED',
			end_time: '2026-12-01T00:00:00Z',
		},
		call: async () => {
			await AdSets.update(ctx, {
				adSetId: 'adset-1',
				name: 'Updated set',
				status: 'PAUSED',
				endTime: '2026-12-01T00:00:00Z',
			});
		},
	},
	{
		name: 'adSets.delete',
		path: '/adset-1',
		method: 'DELETE',
		call: async () => {
			await AdSets.delete(ctx, { adSetId: 'adset-1' });
		},
	},
	{
		name: 'ads.list',
		path: '/act_123/ads',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Ads.list(ctx, {
				accountId: '123',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'ads.get',
		path: '/ad-1',
		method: 'GET',
		query: { fields: 'id,name' },
		call: async () => {
			await Ads.get(ctx, { adId: 'ad-1', fields: 'id,name' });
		},
	},
	{
		name: 'ads.create',
		path: '/act_123/ads',
		method: 'POST',
		body: {
			name: 'Test ad',
			adset_id: 'adset-1',
			creative: { creative_id: 'creative-1' },
			status: 'PAUSED',
		},
		call: async () => {
			await Ads.create(ctx, {
				accountId: '123',
				adSetId: 'adset-1',
				name: 'Test ad',
				creativeId: 'creative-1',
				status: 'PAUSED',
			});
		},
	},
	{
		name: 'ads.update',
		path: '/ad-1',
		method: 'POST',
		body: { name: 'Updated ad', status: 'PAUSED' },
		call: async () => {
			await Ads.update(ctx, {
				adId: 'ad-1',
				name: 'Updated ad',
				status: 'PAUSED',
			});
		},
	},
	{
		name: 'ads.delete',
		path: '/ad-1',
		method: 'DELETE',
		call: async () => {
			await Ads.delete(ctx, { adId: 'ad-1' });
		},
	},
	{
		name: 'creatives.list',
		path: '/act_123/adcreatives',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Creatives.list(ctx, {
				accountId: '123',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'creatives.get',
		path: '/creative-1',
		method: 'GET',
		query: { fields: 'id,name' },
		call: async () => {
			await Creatives.get(ctx, { creativeId: 'creative-1', fields: 'id,name' });
		},
	},
	{
		name: 'creatives.create',
		path: '/act_123/adcreatives',
		method: 'POST',
		body: { name: 'Test creative', object_story_id: 'page_post' },
		call: async () => {
			await Creatives.create(ctx, {
				accountId: '123',
				name: 'Test creative',
				objectStoryId: 'page_post',
			});
		},
	},
	{
		name: 'creatives.update',
		path: '/creative-1',
		method: 'POST',
		body: { name: 'Updated creative' },
		call: async () => {
			await Creatives.update(ctx, {
				creativeId: 'creative-1',
				name: 'Updated creative',
			});
		},
	},
	{
		name: 'creatives.delete',
		path: '/creative-1',
		method: 'DELETE',
		call: async () => {
			await Creatives.delete(ctx, { creativeId: 'creative-1' });
		},
	},
	{
		name: 'audiences.list',
		path: '/act_123/customaudiences',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Audiences.list(ctx, {
				accountId: '123',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'audiences.get',
		path: '/audience-1',
		method: 'GET',
		query: { fields: 'id,name' },
		call: async () => {
			await Audiences.get(ctx, { audienceId: 'audience-1', fields: 'id,name' });
		},
	},
	{
		name: 'audiences.create',
		path: '/act_123/customaudiences',
		method: 'POST',
		body: { name: 'Test audience', subtype: 'CUSTOM' },
		call: async () => {
			await Audiences.create(ctx, {
				accountId: '123',
				name: 'Test audience',
				subtype: 'CUSTOM',
			});
		},
	},
	{
		name: 'audiences.update',
		path: '/audience-1',
		method: 'POST',
		body: { name: 'Updated audience' },
		call: async () => {
			await Audiences.update(ctx, {
				audienceId: 'audience-1',
				name: 'Updated audience',
			});
		},
	},
	{
		name: 'audiences.delete',
		path: '/audience-1',
		method: 'DELETE',
		call: async () => {
			await Audiences.delete(ctx, { audienceId: 'audience-1' });
		},
	},
	{
		name: 'insights.list',
		path: '/act_123/insights',
		method: 'GET',
		query: {
			fields: 'impressions,spend',
			date_preset: 'last_7d',
			level: 'account',
			limit: 10,
			after: 'cursor',
		},
		call: async () => {
			await Insights.list(ctx, {
				accountId: '123',
				fields: ['impressions', 'spend'],
				datePreset: 'last_7d',
				level: 'account',
				limit: 10,
				after: 'cursor',
			});
		},
	},
];

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('Meta Ads operations', () => {
	it.each(cases)(
		'$name uses the documented route and request shape',
		async (testCase) => {
			const isList =
				['GET'].includes(testCase.method) &&
				![
					'accounts.get',
					'campaigns.get',
					'adSets.get',
					'ads.get',
					'creatives.get',
					'audiences.get',
				].includes(testCase.name);
			const isCreate = [
				'campaigns.create',
				'adSets.create',
				'ads.create',
				'creatives.create',
				'audiences.create',
			].includes(testCase.name);
			mockedRequest.mockResolvedValue(
				testCase.method === 'DELETE' || testCase.name.endsWith('.update')
					? successResponse
					: isCreate
						? createResponse
						: isList
							? testCase.name === 'insights.list'
								? { data: [{ impressions: '10', spend: '1.00' }] }
								: listResponse
							: objectResponse,
			);

			await testCase.call();

			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedRequest.mock.calls[0]?.[0]).toBe(testCase.path);
			expect(mockedRequest.mock.calls[0]?.[1]).toBe('meta-test-token');
			expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
				method: testCase.method,
				...(testCase.query ? { query: testCase.query } : {}),
				...(testCase.body ? { body: testCase.body } : {}),
			});
			expect(mockedLog).toHaveBeenCalledTimes(1);
			expect(JSON.stringify(mockedLog.mock.calls[0]?.[2])).not.toContain(
				'meta-test-token',
			);
		},
	);

	it('accepts a caller-owned idempotency key only for supported create operations', async () => {
		mockedRequest.mockResolvedValue(createResponse);
		await Campaigns.create(ctx, {
			accountId: '123',
			name: 'Idempotent campaign',
			objective: 'OUTCOME_TRAFFIC',
			specialAdCategories: [],
			idempotencyKey: 'key-123',
		});
		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			idempotencyKey: 'key-123',
		});
	});

	it('rejects invalid input before network access', async () => {
		await expect(
			Campaigns.create(ctx, {
				accountId: '123',
				name: 'Bad',
				objective: 'OUTCOME_TRAFFIC',
				specialAdCategories: [],
				dailyBudget: 100,
				lifetimeBudget: 200,
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLog).not.toHaveBeenCalled();
	});

	it('rejects malformed provider responses instead of fabricating success', async () => {
		mockedRequest.mockResolvedValue({ data: [{ name: 'missing ID' }] });
		await expect(Campaigns.list(ctx, { accountId: '123' })).rejects.toThrow();
		expect(mockedLog).not.toHaveBeenCalled();
	});
});

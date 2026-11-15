import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Accounts,
	AdSets,
	Ads,
	Audiences,
	Campaigns,
	Creatives,
	Images,
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
	encodedBody?: string;
	redactBodyOnError?: boolean;
	sensitiveValues?: string[];
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
		name: 'accounts.usersList',
		path: '/act_123/users',
		method: 'GET',
		query: { limit: 5, after: 'user-cursor' },
		call: async () => {
			await Accounts.usersList(ctx, {
				accountId: '123',
				limit: 5,
				after: 'user-cursor',
			});
		},
	},
	{
		name: 'images.list',
		path: '/act_123/adimages',
		method: 'GET',
		query: {
			name: 'spring',
			hashes: 'hash-1,hash-2',
			minheight: 120,
			minwidth: 240,
			limit: 5,
			after: 'image-cursor',
		},
		call: async () => {
			await Images.list(ctx, {
				accountId: '123',
				name: 'spring',
				hashes: ['hash-1', 'hash-2'],
				minHeight: 120,
				minWidth: 240,
				limit: 5,
				after: 'image-cursor',
			});
		},
	},
	{
		name: 'images.upload',
		path: '/act_123/adimages',
		method: 'POST',
		body: { bytes: 'aGVsbG8=' },
		redactBodyOnError: true,
		sensitiveValues: ['aGVsbG8='],
		call: async () => {
			await Images.upload(ctx, { accountId: '123', bytes: 'aGVsbG8=' });
		},
	},
	{
		name: 'images.upload',
		path: '/act_123/adimages',
		method: 'POST',
		body: { copy_from: { source_account_id: '456', hash: 'image-hash' } },
		redactBodyOnError: true,
		sensitiveValues: [],
		call: async () => {
			await Images.upload(ctx, {
				accountId: '123',
				copyFrom: { sourceAccountId: '456', hash: 'image-hash' },
			});
		},
	},
	{
		name: 'images.delete',
		path: '/act_123/adimages',
		method: 'DELETE',
		query: { hash: 'image-hash', image_id: 'image-1' },
		call: async () => {
			await Images.delete(ctx, {
				accountId: '123',
				hash: 'image-hash',
				imageId: 'image-1',
			});
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
		name: 'ads.create',
		path: '/act_123/ads',
		method: 'POST',
		body: {
			name: 'Inline ad',
			adset_id: 'adset-1',
			creative: {
				creative: {
					name: 'Inline creative',
					authorization_category: 'POLITICAL_WITH_DIGITALLY_CREATED_MEDIA',
					object_story_spec: {
						page_id: 'page-1',
						link_data: { link: 'https://shop.test/landing', message: 'Hello' },
					},
				},
			},
			status: 'PAUSED',
		},
		call: async () => {
			await Ads.create(ctx, {
				accountId: '123',
				adSetId: 'adset-1',
				name: 'Inline ad',
				creativeSpec: {
					name: 'Inline creative',
					authorizationCategory: 'POLITICAL_WITH_DIGITALLY_CREATED_MEDIA',
					objectStorySpec: {
						page_id: 'page-1',
						link_data: { link: 'https://shop.test/landing', message: 'Hello' },
					},
				},
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
		name: 'creatives.create',
		path: '/act_123/adcreatives',
		method: 'POST',
		body: {
			name: 'Link creative',
			authorization_category: 'POLITICAL',
			object_story_spec: {
				page_id: 'page-1',
				link_data: { link: 'https://shop.test/landing', message: 'Hello' },
			},
		},
		call: async () => {
			await Creatives.create(ctx, {
				accountId: '123',
				name: 'Link creative',
				authorizationCategory: 'POLITICAL',
				objectStorySpec: {
					page_id: 'page-1',
					link_data: { link: 'https://shop.test/landing', message: 'Hello' },
				},
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
		name: 'audiences.sessionsList',
		path: '/audience-1/sessions',
		method: 'GET',
		query: {
			session_id: 123,
			limit: 10,
			after: 'session-cursor',
		},
		call: async () => {
			await Audiences.sessionsList(ctx, {
				audienceId: 'audience-1',
				sessionId: 123,
				limit: 10,
				after: 'session-cursor',
			});
		},
	},
	{
		name: 'audiences.usersAdd',
		path: '/audience-1/users',
		method: 'POST',
		body: {
			session: {
				session_id: 123,
				batch_seq: 1,
				last_batch_flag: true,
				estimated_num_total: 1,
			},
			payload: {
				schema: 'EMAIL_SHA256',
				data: [['a'.repeat(64)]],
			},
		},
		redactBodyOnError: true,
		sensitiveValues: ['a'.repeat(64)],
		call: async () => {
			await Audiences.usersAdd(ctx, {
				audienceId: 'audience-1',
				schema: 'EMAIL_SHA256',
				hashes: ['a'.repeat(64)],
				sessionId: 123,
				batchSequence: 1,
				lastBatch: true,
				estimatedTotal: 1,
			});
		},
	},
	{
		name: 'audiences.usersRemove',
		path: '/audience-1/users',
		method: 'DELETE',
		encodedBody: `payload=${encodeURIComponent(JSON.stringify({ schema: 'PHONE_SHA256', data: ['b'.repeat(64)] }))}`,
		redactBodyOnError: true,
		sensitiveValues: ['b'.repeat(64)],
		call: async () => {
			await Audiences.usersRemove(ctx, {
				audienceId: 'audience-1',
				schema: 'PHONE_SHA256',
				hashes: ['b'.repeat(64)],
			});
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
			breakdowns: 'age,gender',
			filtering: '[{"field":"campaign.id","operator":"IN","value":["1","2"]}]',
			action_attribution_windows: '1d_click,7d_click',
			time_increment: 7,
			sort: 'spend_descending',
			limit: 10,
			after: 'cursor',
		},
		call: async () => {
			await Insights.list(ctx, {
				accountId: '123',
				fields: ['impressions', 'spend'],
				datePreset: 'last_7d',
				level: 'account',
				breakdowns: ['age', 'gender'],
				filtering: [
					{
						field: 'campaign.id',
						operator: 'IN',
						value: ['1', '2'],
					},
				],
				actionAttributionWindows: ['1d_click', '7d_click'],
				timeIncrement: 7,
				sort: ['spend_descending'],
				limit: 10,
				after: 'cursor',
			});
		},
	},
	{
		name: 'insights.createAsync',
		path: '/act_123/insights',
		method: 'POST',
		body: {
			fields: 'impressions,spend',
			level: 'campaign',
			time_range: '{"since":"2026-10-01","until":"2026-10-07"}',
		},
		call: async () => {
			await Insights.createAsync(ctx, {
				accountId: '123',
				fields: ['impressions', 'spend'],
				level: 'campaign',
				since: '2026-10-01',
				until: '2026-10-07',
			});
		},
	},
	{
		name: 'insights.getAsyncReport',
		path: '/report-1',
		method: 'GET',
		query: { fields: 'id,async_status,async_percent_completion' },
		call: async () => {
			await Insights.getAsyncReport(ctx, {
				reportRunId: 'report-1',
				fields: ['id', 'async_status', 'async_percent_completion'],
			});
		},
	},
	{
		name: 'insights.getAsyncResults',
		path: '/report-1/insights',
		method: 'GET',
		query: { limit: 10, after: 'report-cursor' },
		call: async () => {
			await Insights.getAsyncResults(ctx, {
				reportRunId: 'report-1',
				limit: 10,
				after: 'report-cursor',
			});
		},
	},
	{
		name: 'insights.listFeatures',
		path: '/act_123/insights/feature-settings/list-features',
		method: 'GET',
		call: async () => {
			await Insights.listFeatures(ctx, { accountId: '123' });
		},
	},
	{
		name: 'insights.listEnabledFeatures',
		path: '/act_123/insights/feature-settings',
		method: 'GET',
		call: async () => {
			await Insights.listEnabledFeatures(ctx, { accountId: '123' });
		},
	},
	{
		name: 'insights.enableFeature',
		path: '/act_123/insights/feature-settings',
		method: 'POST',
		body: { feature_name: 'impression_device' },
		call: async () => {
			await Insights.enableFeature(ctx, {
				accountId: '123',
				featureName: 'impression_device',
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
				'insights.createAsync',
			].includes(testCase.name);
			const response =
				testCase.name === 'images.list'
					? {
							data: [
								{
									hash: 'image-hash',
									name: 'image.jpg',
									width: 640,
									height: 480,
								},
							],
							paging: { cursors: { after: 'image-cursor' } },
							summary: { total_count: 1 },
						}
					: testCase.name === 'images.upload'
						? {
								images: {
									'image-hash': {
										hash: 'image-hash',
										width: 640,
										height: 480,
									},
								},
							}
						: testCase.name === 'audiences.usersAdd' ||
								testCase.name === 'audiences.usersRemove'
							? {
									audience_id: 'audience-1',
									session_id: 123,
									num_received: 1,
									num_invalid_entries: 0,
									invalid_entry_samples: ['sensitive-sample'],
								}
							: testCase.name === 'insights.createAsync'
								? { report_run_id: 'report-1' }
								: testCase.name === 'insights.getAsyncReport'
									? {
											id: 'report-1',
											async_status: 'Job Running',
											async_percent_completion: 50,
										}
									: testCase.name === 'insights.listFeatures'
										? {
												data: [
													{
														feature_name: 'impression_device',
														feature_type: 'breakdown',
													},
												],
											}
										: testCase.name === 'insights.listEnabledFeatures'
											? {
													data: [
														{
															feature_name: 'impression_device',
															status: 'enabled',
														},
													],
												}
											: testCase.name === 'insights.enableFeature'
												? { id: 'act_123' }
												: testCase.name === 'audiences.sessionsList'
													? {
															data: [
																{
																	session_id: '123',
																	stage: 'COMPLETED',
																	num_received: '2',
																},
															],
														}
													: testCase.name === 'accounts.usersList'
														? {
																data: [
																	{
																		id: 'user-1',
																		name: 'Test User',
																		tasks: ['ANALYZE'],
																	},
																],
															}
														: testCase.method === 'DELETE' ||
																testCase.name.endsWith('.update')
															? successResponse
															: isCreate
																? createResponse
																: isList
																	? testCase.name.startsWith('insights.')
																		? {
																				data: [
																					{ impressions: '10', spend: '1.00' },
																				],
																			}
																		: listResponse
																	: objectResponse;
			mockedRequest.mockResolvedValue(response);

			await testCase.call();

			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedRequest.mock.calls[0]?.[0]).toBe(testCase.path);
			expect(mockedRequest.mock.calls[0]?.[1]).toBe('meta-test-token');
			expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
				method: testCase.method,
				...(testCase.query ? { query: testCase.query } : {}),
				...(testCase.body ? { body: testCase.body } : {}),
				...(testCase.encodedBody ? { encodedBody: testCase.encodedBody } : {}),
				...(testCase.redactBodyOnError ? { redactBodyOnError: true } : {}),
				...(testCase.sensitiveValues
					? { sensitiveValues: testCase.sensitiveValues }
					: {}),
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

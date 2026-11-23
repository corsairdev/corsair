import { ApiError } from 'corsair/http';
import * as client from './client';
import {
	Accounts,
	AdSets,
	Ads,
	Campaigns,
	Creatives,
	Images,
	Insights,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import type { MetaAdsContext } from './index';
import { metaAdsEndpointSchemas } from './index';

// Response bodies below come from a read-only live run against one INR ad account
// (Graph API v27.0, 2026-11-23). IDs, names, URLs and money values are replaced.

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeMetaAdsRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeMetaAdsRequest);
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

const paging = {
	cursors: { before: 'cursor-before', after: 'cursor-after' },
	next: 'https://graph.facebook.com/v27.0/act_100/campaigns?after=cursor-after',
};

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('Meta Ads live response fixtures', () => {
	it('parses a campaigns page requested with a rich field list', async () => {
		mockedRequest.mockResolvedValueOnce({
			data: [
				{
					id: '100000000000010',
					account_id: '100000000000002',
					name: 'Example campaign',
					status: 'PAUSED',
					configured_status: 'PAUSED',
					effective_status: 'PAUSED',
					objective: 'OUTCOME_TRAFFIC',
					buying_type: 'AUCTION',
					bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
					daily_budget: '50000',
					budget_remaining: '50000',
					special_ad_categories: [],
					special_ad_category: 'NONE',
					created_time: '2026-09-21T23:29:52+0530',
					start_time: '2026-09-21T23:29:53+0530',
					pacing_type: ['standard'],
					smart_promotion_type: 'GUIDED_CREATION',
					source_campaign_id: '0',
					can_use_spend_cap: true,
					is_budget_schedule_enabled: false,
				},
			],
			paging,
		});
		const result = await Campaigns.list(ctx, {
			accountId: '100000000000002',
			limit: 5,
			fields: 'id,name,status,objective,daily_budget,pacing_type',
		});
		expect(result.data[0]?.effective_status).toBe('PAUSED');
		expect(result.paging).toEqual({
			cursors: { before: 'cursor-before', after: 'cursor-after' },
			hasNextPage: true,
		});
	});

	it('keeps nested ad set targeting and ad tracking specs', async () => {
		mockedRequest.mockResolvedValueOnce({
			data: [
				{
					id: '100000000000013',
					campaign_id: '100000000000010',
					name: 'Example ad set',
					status: 'PAUSED',
					optimization_goal: 'LINK_CLICKS',
					billing_event: 'IMPRESSIONS',
					targeting: {
						age_max: 65,
						age_min: 18,
						age_range: [18, 65],
						geo_locations: {
							countries: ['IN'],
							location_types: ['frequently_in', 'home', 'recent'],
						},
						targeting_automation: { advantage_audience: 1 },
						user_age_unknown: true,
					},
					destination_type: 'UNDEFINED',
					is_dynamic_creative: false,
				},
			],
			paging,
		});
		const adSets = await AdSets.list(ctx, { accountId: '100000000000002' });
		expect(adSets.data[0]).toMatchObject({
			targeting: { geo_locations: { countries: ['IN'] } },
		});

		mockedRequest.mockResolvedValueOnce({
			id: '100000000000016',
			adset_id: '100000000000013',
			status: 'PAUSED',
			creative: { id: '100000000000017' },
			tracking_specs: [
				{
					'action.type': ['onsite_conversion'],
					conversion_id: ['100000000000018'],
				},
			],
			conversion_specs: [
				{ 'action.type': ['link_click'], post: ['100000000000022'] },
			],
		});
		const ad = await Ads.get(ctx, { adId: '100000000000016' });
		expect(ad).toMatchObject({ creative: { id: '100000000000017' } });
	});

	it('parses a video creative with object_story_spec and degrees_of_freedom_spec', async () => {
		mockedRequest.mockResolvedValueOnce({
			id: '100000000000017',
			name: 'Example creative',
			status: 'ACTIVE',
			object_type: 'VIDEO',
			object_story_spec: {
				page_id: '100000000000023',
				video_data: {
					video_id: '100000000000032',
					title: 'Example title',
					message: 'Example message',
					call_to_action: {
						type: 'SIGN_UP',
						value: { link: 'https://example.com/' },
					},
					image_hash: 'a'.repeat(32),
				},
			},
			effective_object_story_id: '100000000000023_100000000000022',
			call_to_action_type: 'SIGN_UP',
			degrees_of_freedom_spec: {
				creative_features_spec: {
					advantage_plus_creative: { enroll_status: 'OPT_OUT' },
				},
			},
		});
		const creative = await Creatives.get(ctx, {
			creativeId: '100000000000017',
		});
		expect(creative.id).toBe('100000000000017');
	});

	it('parses an ad account with a fractional age and numeric status codes', async () => {
		mockedRequest.mockResolvedValueOnce({
			id: 'act_100000000000002',
			account_id: '100000000000002',
			name: 'Example account',
			account_status: 1,
			age: 213.60934027778,
			amount_spent: '0',
			currency: 'INR',
			disable_reason: 0,
			timezone_name: 'Asia/Kolkata',
			min_daily_budget: 89,
			is_prepay_account: false,
			capabilities: ['CAN_CREATE_CALL_ADS'],
		});
		const account = await Accounts.get(ctx, {
			accountId: '100000000000002',
		});
		expect(account).toMatchObject({ account_status: 1, currency: 'INR' });
	});

	it('parses image ids in Graph account:hash form', async () => {
		mockedRequest.mockResolvedValueOnce({
			data: [
				{
					hash: 'a'.repeat(32),
					id: `100000000000002:${'a'.repeat(32)}`,
				},
			],
			paging,
		});
		const images = await Images.list(ctx, { accountId: '100000000000002' });
		expect(images.data[0]?.hash).toHaveLength(32);
	});

	it('parses reach estimates, broad categories with null source and feature rows', async () => {
		mockedRequest.mockResolvedValueOnce({
			data: {
				users_lower_bound: 627500000,
				users_upper_bound: 738200000,
				estimate_ready: true,
			},
		});
		await expect(
			Accounts.reachEstimate(ctx, {
				accountId: '100000000000002',
				targetingSpec: { geo_locations: { countries: ['IN'] } },
			}),
		).resolves.toBeDefined();

		mockedRequest.mockResolvedValueOnce({
			data: [
				{
					id: '100000000000007',
					name: 'Example category',
					parent_category: 'Custom Categories',
					path: ['Custom Categories'],
					size_lower_bound: 579049150,
					size_upper_bound: 680961801,
					source: null,
					type: 6,
					type_name: 'BCT',
				},
			],
		});
		const categories = await Accounts.broadTargetingCategoriesList(ctx, {
			accountId: '100000000000002',
		});
		expect(categories.data).toHaveLength(1);

		mockedRequest.mockResolvedValueOnce({
			data: [{ feature_name: 'comscore', feature_type: 'breakdown' }],
		});
		const features = await Insights.listFeatures(ctx, {
			accountId: '100000000000002',
		});
		expect(features.data[0]?.feature_name).toBe('comscore');
	});
});

describe('Meta Ads insights fields (live 2026-11-23)', () => {
	it('accepts valid AdsInsights fields beyond the common list', async () => {
		mockedRequest.mockResolvedValueOnce({
			data: [
				{
					account_id: '100000000000002',
					account_name: 'Example account',
					account_currency: 'INR',
					attribution_setting: 'multiple',
					objective: 'MULTIPLE',
					date_start: '2023-10-23',
					date_stop: '2026-11-23',
				},
			],
			paging: { cursors: { before: 'b', after: 'a' } },
		});
		const result = await Insights.list(ctx, {
			accountId: '100000000000002',
			fields: [
				'account_currency',
				'purchase_roas',
				'video_p25_watched_actions',
				'social_spend',
			],
			datePreset: 'maximum',
		});
		expect(mockedRequest.mock.calls[0]?.[2]?.query?.fields).toBe(
			'account_currency,purchase_roas,video_p25_watched_actions,social_spend',
		);
		expect(result.data[0]).toMatchObject({ account_currency: 'INR' });
	});

	it('parses an empty insights answer without paging', async () => {
		mockedRequest.mockResolvedValueOnce({ data: [] });
		const result = await Insights.listForAdSet(ctx, {
			adSetId: '100000000000013',
			fields: ['impressions', 'spend'],
			datePreset: 'maximum',
		});
		expect(result.data).toEqual([]);
	});

	it.each([
		'age',
		'country',
		'publisher_platform',
		'device_platform',
		'hourly_stats_aggregated_by_advertiser_time_zone',
	])(
		'rejects the breakdown %s as a field before sending a request',
		async (breakdown) => {
			await expect(
				Insights.list(ctx, {
					accountId: '100000000000002',
					fields: [breakdown, 'impressions'],
					datePreset: 'maximum',
				}),
			).rejects.toThrow(/breakdown, not a field/);
			expect(mockedRequest).not.toHaveBeenCalled();
		},
	);

	it('still accepts breakdowns through the breakdowns parameter', async () => {
		mockedRequest.mockResolvedValueOnce({ data: [] });
		await Insights.list(ctx, {
			accountId: '100000000000002',
			fields: ['impressions'],
			breakdowns: ['age', 'gender'],
			datePreset: 'maximum',
		});
		expect(mockedRequest.mock.calls[0]?.[2]?.query?.breakdowns).toBe(
			'age,gender',
		);
	});
});

describe('Meta Ads edges that Graph v27 does not have', () => {
	it.each([
		'accounts.smartSuggestedAdsList',
		'accounts.suggestedAdsList',
		'accounts.activeAdRulesList',
		'ads.adStudiesList',
	])(
		'does not expose %s (Graph answers "(#100) Tried accessing nonexisting field")',
		(op) => {
			expect(Object.keys(metaAdsEndpointSchemas)).not.toContain(op);
		},
	);
});

describe('Meta Ads live error bodies', () => {
	// `unknown` because Graph error bodies differ by code and subcode; the handlers only read `error.code`.
	function graphError(body: Record<string, unknown>) {
		return new ApiError(
			{ method: 'GET', url: '/act_100/adsets' },
			{
				url: 'https://graph.facebook.com/v27.0/act_100/adsets',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body,
			},
			'Meta API error',
		);
	}

	it('treats the user request limit (code 17, subcode 2446079) as a rate limit', () => {
		const error = graphError({
			error: {
				message: 'User request limit reached',
				type: 'OAuthException',
				is_transient: true,
				code: 17,
				error_subcode: 2446079,
			},
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('treats an unknown object id (code 100, subcode 33) as a bad request, not a rate limit or auth error', () => {
		const error = graphError({
			error: {
				message:
					"Unsupported get request. Object with ID '1' does not exist, cannot be loaded due to missing permissions, or does not support this operation.",
				type: 'GraphMethodException',
				code: 100,
				error_subcode: 33,
			},
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(error)).toBe(true);
	});
});

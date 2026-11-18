import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Accounts,
	AdSets,
	Ads,
	Audiences,
	Campaigns,
	Creatives,
	HighDemandPeriods,
	Images,
	Insights,
	Labels,
	Studies,
	Videos,
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
	query?: Record<string, string | number | boolean | undefined>;
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
		name: 'accounts.activitiesList',
		path: '/act_123/activities',
		method: 'GET',
		call: async () => {
			await Accounts.activitiesList(ctx, { accountId: '123' });
		},
	},
	{
		name: 'accounts.impactingAdStudiesList',
		path: '/act_123/impacting_ad_studies',
		method: 'GET',
		call: async () => {
			await Accounts.impactingAdStudiesList(ctx, { accountId: '123' });
		},
	},
	{
		name: 'accounts.adRulesLibraryList',
		path: '/act_123/adrules_library',
		method: 'GET',
		call: async () => {
			await Accounts.adRulesLibraryList(ctx, { accountId: '123' });
		},
	},
	{
		name: 'accounts.activeAdRulesList',
		path: '/act_123/active_adrules',
		method: 'GET',
		query: { selected_ids: '["campaign-1","adset-1"]', pass_evaluation: true },
		call: async () => {
			await Accounts.activeAdRulesList(ctx, {
				accountId: '123',
				selectedIds: ['campaign-1', 'adset-1'],
				passEvaluation: true,
			});
		},
	},
	{
		name: 'accounts.generatePreviews',
		path: '/act_123/generatepreviews',
		method: 'GET',
		query: {
			ad_format: 'DESKTOP_FEED_STANDARD',
			creative:
				'{"object_story_spec":{"page_id":"page-1","link_data":{"link":"https://shop.test/landing","message":"Sample"}}}',
		},
		call: async () => {
			await Accounts.generatePreviews(ctx, {
				accountId: '123',
				adFormat: 'DESKTOP_FEED_STANDARD',
				creativeSpec: {
					objectStorySpec: {
						page_id: 'page-1',
						link_data: {
							link: 'https://shop.test/landing',
							message: 'Sample',
						},
					},
				},
			});
		},
	},
	{
		name: 'accounts.broadTargetingCategoriesList',
		path: '/act_123/broadtargetingcategories',
		method: 'GET',
		query: { custom_categories_only: true },
		call: async () => {
			await Accounts.broadTargetingCategoriesList(ctx, {
				accountId: '123',
				customCategoriesOnly: true,
			});
		},
	},
	{
		name: 'labels.list',
		path: '/act_123/adlabels',
		method: 'GET',
		call: async () => {
			await Labels.list(ctx, { accountId: '123' });
		},
	},
	{
		name: 'labels.get',
		path: '/label-1',
		method: 'GET',
		query: { fields: 'id,name' },
		call: async () => {
			await Labels.get(ctx, { labelId: 'label-1', fields: 'id,name' });
		},
	},
	{
		name: 'labels.create',
		path: '/act_123/adlabels',
		method: 'POST',
		body: { name: 'Spring campaign' },
		call: async () => {
			await Labels.create(ctx, { accountId: '123', name: 'Spring campaign' });
		},
	},
	{
		name: 'labels.update',
		path: '/label-1',
		method: 'POST',
		body: { name: 'Spring promotion' },
		call: async () => {
			await Labels.update(ctx, {
				labelId: 'label-1',
				name: 'Spring promotion',
			});
		},
	},
	{
		name: 'labels.delete',
		path: '/label-1',
		method: 'DELETE',
		call: async () => {
			await Labels.delete(ctx, { labelId: 'label-1' });
		},
	},
	{
		name: 'labels.adsList',
		path: '/label-1/ads',
		method: 'GET',
		call: async () => {
			await Labels.adsList(ctx, { labelId: 'label-1' });
		},
	},
	{
		name: 'labels.adSetsList',
		path: '/label-1/adsets',
		method: 'GET',
		call: async () => {
			await Labels.adSetsList(ctx, { labelId: 'label-1' });
		},
	},
	{
		name: 'labels.campaignsList',
		path: '/label-1/campaigns',
		method: 'GET',
		call: async () => {
			await Labels.campaignsList(ctx, { labelId: 'label-1' });
		},
	},
	{
		name: 'labels.creativesList',
		path: '/label-1/adcreatives',
		method: 'GET',
		call: async () => {
			await Labels.creativesList(ctx, { labelId: 'label-1' });
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
		name: 'campaigns.adSetsList',
		path: '/campaign-1/adsets',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Campaigns.adSetsList(ctx, {
				campaignId: 'campaign-1',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'campaigns.adsList',
		path: '/campaign-1/ads',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Campaigns.adsList(ctx, {
				campaignId: 'campaign-1',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'campaigns.copiesList',
		path: '/campaign-1/copies',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Campaigns.copiesList(ctx, {
				campaignId: 'campaign-1',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'campaigns.copy',
		path: '/campaign-1/copies',
		method: 'POST',
		body: { status_option: 'PAUSED' },
		call: async () => {
			await Campaigns.copy(ctx, { campaignId: 'campaign-1' });
		},
	},
	{
		name: 'campaigns.labelsAdd',
		path: '/campaign-1/adlabels',
		method: 'POST',
		body: {
			adlabels: '[{"name":"Spring campaign"}]',
			execution_options: undefined,
		},
		call: async () => {
			await Campaigns.labelsAdd(ctx, {
				campaignId: 'campaign-1',
				adlabels: [{ name: 'Spring campaign' }],
			});
		},
	},
	{
		name: 'campaigns.budgetSchedulesList',
		path: '/campaign-1/budget_schedules',
		method: 'GET',
		query: { time_start: 1_800_000_000, time_stop: 1_800_010_800 },
		call: async () => {
			await Campaigns.budgetSchedulesList(ctx, {
				campaignId: 'campaign-1',
				timeStart: 1_800_000_000,
				timeStop: 1_800_010_800,
			});
		},
	},
	{
		name: 'campaigns.budgetScheduleCreate',
		path: '/campaign-1/budget_schedules',
		method: 'POST',
		body: {
			budget_value: 150,
			budget_value_type: 'ABSOLUTE',
			time_start: 1_800_000_000,
			time_end: 1_800_010_800,
		},
		call: async () => {
			await Campaigns.budgetScheduleCreate(ctx, {
				campaignId: 'campaign-1',
				budgetValue: 150,
				budgetValueType: 'ABSOLUTE',
				timeStart: 1_800_000_000,
				timeEnd: 1_800_010_800,
			});
		},
	},
	{
		name: 'campaigns.adStudiesList',
		path: '/campaign-1/ad_studies',
		method: 'GET',
		call: async () => {
			await Campaigns.adStudiesList(ctx, { campaignId: 'campaign-1' });
		},
	},
	{
		name: 'campaigns.adRulesGovernedList',
		path: '/campaign-1/adrules_governed',
		method: 'GET',
		query: { pass_evaluation: false },
		call: async () => {
			await Campaigns.adRulesGovernedList(ctx, {
				campaignId: 'campaign-1',
				passEvaluation: false,
			});
		},
	},
	{
		name: 'highDemandPeriods.get',
		path: '/period-1',
		method: 'GET',
		query: { fields: 'id,budget_value,time_start,time_end' },
		call: async () => {
			await HighDemandPeriods.get(ctx, {
				periodId: 'period-1',
				fields: 'id,budget_value,time_start,time_end',
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
		name: 'adSets.adsList',
		path: '/adset-1/ads',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await AdSets.adsList(ctx, {
				adSetId: 'adset-1',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'adSets.adCreativesList',
		path: '/adset-1/adcreatives',
		method: 'GET',
		call: async () => {
			await AdSets.adCreativesList(ctx, { adSetId: 'adset-1' });
		},
	},
	{
		name: 'adSets.copiesList',
		path: '/adset-1/copies',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await AdSets.copiesList(ctx, {
				adSetId: 'adset-1',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'adSets.copy',
		path: '/adset-1/copies',
		method: 'POST',
		body: { status_option: 'PAUSED' },
		call: async () => {
			await AdSets.copy(ctx, { adSetId: 'adset-1' });
		},
	},
	{
		name: 'adSets.budgetSchedulesList',
		path: '/adset-1/budget_schedules',
		method: 'GET',
		call: async () => {
			await AdSets.budgetSchedulesList(ctx, { adSetId: 'adset-1' });
		},
	},
	{
		name: 'adSets.budgetScheduleCreate',
		path: '/adset-1/budget_schedules',
		method: 'POST',
		body: {
			budget_value: 150,
			budget_value_type: 'MULTIPLIER',
			time_start: 1_800_000_000,
			time_end: 1_800_010_800,
		},
		call: async () => {
			await AdSets.budgetScheduleCreate(ctx, {
				adSetId: 'adset-1',
				budgetValue: 150,
				budgetValueType: 'MULTIPLIER',
				timeStart: 1_800_000_000,
				timeEnd: 1_800_010_800,
			});
		},
	},
	{
		name: 'adSets.activitiesList',
		path: '/adset-1/activities',
		method: 'GET',
		query: {
			business_id: 'business-1',
			category: 'BUDGET',
			limit: 5,
			uid: 123,
		},
		call: async () => {
			await AdSets.activitiesList(ctx, {
				adSetId: 'adset-1',
				businessId: 'business-1',
				category: 'BUDGET',
				limit: 5,
				uid: 123,
			});
		},
	},
	{
		name: 'adSets.adStudiesList',
		path: '/adset-1/ad_studies',
		method: 'GET',
		call: async () => {
			await AdSets.adStudiesList(ctx, { adSetId: 'adset-1' });
		},
	},
	{
		name: 'adSets.adRulesGovernedList',
		path: '/adset-1/adrules_governed',
		method: 'GET',
		query: { pass_evaluation: true },
		call: async () => {
			await AdSets.adRulesGovernedList(ctx, {
				adSetId: 'adset-1',
				passEvaluation: true,
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
		redactBodyOnError: true,
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
		name: 'ads.adCreativesList',
		path: '/ad-1/adcreatives',
		method: 'GET',
		call: async () => {
			await Ads.adCreativesList(ctx, { adId: 'ad-1' });
		},
	},
	{
		name: 'ads.adStudiesList',
		path: '/ad-1/ad_studies',
		method: 'GET',
		call: async () => {
			await Ads.adStudiesList(ctx, { adId: 'ad-1' });
		},
	},
	{
		name: 'ads.adRulesGovernedList',
		path: '/ad-1/adrules_governed',
		method: 'GET',
		query: { pass_evaluation: true },
		call: async () => {
			await Ads.adRulesGovernedList(ctx, {
				adId: 'ad-1',
				passEvaluation: true,
			});
		},
	},
	{
		name: 'ads.previewsList',
		path: '/ad-1/previews',
		method: 'GET',
		query: { ad_format: 'DESKTOP_FEED_STANDARD' },
		call: async () => {
			await Ads.previewsList(ctx, {
				adId: 'ad-1',
				adFormat: 'DESKTOP_FEED_STANDARD',
			});
		},
	},
	{
		name: 'ads.copiesList',
		path: '/ad-1/copies',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Ads.copiesList(ctx, {
				adId: 'ad-1',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'ads.copy',
		path: '/ad-1/copies',
		method: 'POST',
		body: { status_option: 'PAUSED' },
		call: async () => {
			await Ads.copy(ctx, { adId: 'ad-1' });
		},
	},
	{
		name: 'ads.labelsAdd',
		path: '/ad-1/adlabels',
		method: 'POST',
		body: {
			adlabels: '[{"name":"Spring campaign"}]',
			execution_options: undefined,
		},
		call: async () => {
			await Ads.labelsAdd(ctx, {
				adId: 'ad-1',
				adlabels: [{ name: 'Spring campaign' }],
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
		name: 'creatives.insightsList',
		path: '/creative-1/creative_insights',
		method: 'GET',
		call: async () => {
			await Creatives.insightsList(ctx, { creativeId: 'creative-1' });
		},
	},
	{
		name: 'creatives.previewsList',
		path: '/creative-1/previews',
		method: 'GET',
		query: { ad_format: 'INSTAGRAM_STANDARD', width: 400, height: 400 },
		call: async () => {
			await Creatives.previewsList(ctx, {
				creativeId: 'creative-1',
				adFormat: 'INSTAGRAM_STANDARD',
				width: 400,
				height: 400,
			});
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
		name: 'creatives.labelsAdd',
		path: '/creative-1/adlabels',
		method: 'POST',
		body: { adlabels: '[{"id":"label-1"}]' },
		call: async () => {
			await Creatives.labelsAdd(ctx, {
				creativeId: 'creative-1',
				adlabels: [{ id: 'label-1' }],
			});
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
		name: 'audiences.adsList',
		path: '/audience-1/ads',
		method: 'GET',
		query: { fields: 'id,name', limit: 3, after: 'c1' },
		call: async () => {
			await Audiences.adsList(ctx, {
				audienceId: 'audience-1',
				fields: 'id,name',
				limit: 3,
				after: 'c1',
			});
		},
	},
	{
		name: 'audiences.adAccountsList',
		path: '/audience-1/adaccounts',
		method: 'GET',
		query: { permissions: 'targeting' },
		call: async () => {
			await Audiences.adAccountsList(ctx, {
				audienceId: 'audience-1',
				permissions: 'targeting',
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
		body: {
			name: 'Test audience',
			customer_file_source: 'USER_PROVIDED_ONLY',
			subtype: 'CUSTOM',
		},
		call: async () => {
			await Audiences.create(ctx, {
				accountId: '123',
				name: 'Test audience',
				customerFileSource: 'USER_PROVIDED_ONLY',
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
		name: 'audiences.usersReplace',
		path: '/audience-1/usersreplace',
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
			await Audiences.usersReplace(ctx, {
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
		name: 'audiences.adAccountsShare',
		path: '/audience-1/ad_accounts',
		method: 'POST',
		body: {
			adaccounts: '["456"]',
			permissions: 'targeting',
			replace: false,
		},
		call: async () => {
			await Audiences.adAccountsShare(ctx, {
				audienceId: 'audience-1',
				adAccountIds: ['456'],
				permissions: 'targeting',
				replace: false,
			});
		},
	},
	{
		name: 'audiences.adAccountsUnshare',
		path: '/audience-1/ad_accounts',
		method: 'DELETE',
		encodedBody: 'adaccounts=%5B%22456%22%5D',
		call: async () => {
			await Audiences.adAccountsUnshare(ctx, {
				audienceId: 'audience-1',
				adAccountIds: ['456'],
			});
		},
	},
	{
		name: 'studies.get',
		path: '/study-1',
		method: 'GET',
		query: { fields: 'id,name,type,start_time,end_time' },
		call: async () => {
			await Studies.get(ctx, {
				studyId: 'study-1',
				fields: 'id,name,type,start_time,end_time',
			});
		},
	},
	{
		name: 'studies.create',
		path: '/business-1/ad_studies',
		method: 'POST',
		body: {
			name: 'Spring split test',
			description: 'Compare two ad sets',
			start_time: 1_800_000_000,
			end_time: 1_800_086_400,
			type: 'SPLIT_TEST',
			cells:
				'[{"name":"Control","treatment_percentage":50,"adsets":["adset-1"]},{"name":"Variant","treatment_percentage":50,"adsets":["adset-2"]}]',
		},
		call: async () => {
			await Studies.create(ctx, {
				businessId: 'business-1',
				name: 'Spring split test',
				description: 'Compare two ad sets',
				startTime: 1_800_000_000,
				endTime: 1_800_086_400,
				type: 'SPLIT_TEST',
				cells: [
					{ name: 'Control', treatmentPercentage: 50, adSetIds: ['adset-1'] },
					{ name: 'Variant', treatmentPercentage: 50, adSetIds: ['adset-2'] },
				],
			});
		},
	},
	{
		name: 'studies.update',
		path: '/study-1',
		method: 'POST',
		body: { end_time: 1_800_172_800 },
		call: async () => {
			await Studies.update(ctx, { studyId: 'study-1', endTime: 1_800_172_800 });
		},
	},
	{
		name: 'studies.relatedAccountsList',
		path: '/study-1/related_ad_accounts',
		method: 'GET',
		call: async () => {
			await Studies.relatedAccountsList(ctx, { studyId: 'study-1' });
		},
	},
	{
		name: 'studies.viewersList',
		path: '/study-1/viewers',
		method: 'GET',
		call: async () => {
			await Studies.viewersList(ctx, { studyId: 'study-1' });
		},
	},
	{
		name: 'videos.delete',
		path: '/act_123/advideos',
		method: 'DELETE',
		query: { video_id: 'video-1' },
		call: async () => {
			await Videos.delete(ctx, { accountId: '123', videoId: 'video-1' });
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
		name: 'insights.listForCampaign',
		path: '/campaign-1/insights',
		method: 'GET',
		query: { fields: 'impressions,spend', limit: 10, after: 'i1' },
		call: async () => {
			await Insights.listForCampaign(ctx, {
				campaignId: 'campaign-1',
				fields: ['impressions', 'spend'],
				limit: 10,
				after: 'i1',
			});
		},
	},
	{
		name: 'insights.listForAdSet',
		path: '/adset-1/insights',
		method: 'GET',
		query: { fields: 'impressions,spend', limit: 10, after: 'i1' },
		call: async () => {
			await Insights.listForAdSet(ctx, {
				adSetId: 'adset-1',
				fields: ['impressions', 'spend'],
				limit: 10,
				after: 'i1',
			});
		},
	},
	{
		name: 'insights.listForAd',
		path: '/ad-1/insights',
		method: 'GET',
		query: { fields: 'impressions,spend', limit: 10, after: 'i1' },
		call: async () => {
			await Insights.listForAd(ctx, {
				adId: 'ad-1',
				fields: ['impressions', 'spend'],
				limit: 10,
				after: 'i1',
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
	it('defaults audience subtype when callers omit it', async () => {
		mockedRequest.mockResolvedValue(createResponse);

		await Audiences.create(ctx, {
			accountId: '123',
			name: 'Test audience without subtype',
		});

		expect(mockedRequest.mock.calls[0]?.[2]).toMatchObject({
			body: { name: 'Test audience without subtype', subtype: 'CUSTOM' },
		});
	});

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
					'labels.get',
					'studies.get',
					'highDemandPeriods.get',
				].includes(testCase.name);
			const isCreate = [
				'campaigns.create',
				'campaigns.copy',
				'campaigns.budgetScheduleCreate',
				'adSets.create',
				'adSets.copy',
				'adSets.budgetScheduleCreate',
				'ads.create',
				'ads.copy',
				'creatives.create',
				'audiences.create',
				'studies.create',
				'labels.create',
				'insights.createAsync',
			].includes(testCase.name);
			const labelAssociations = [
				'campaigns.labelsAdd',
				'ads.labelsAdd',
				'creatives.labelsAdd',
			].includes(testCase.name);
			let response: Record<string, unknown>;
			if (testCase.name === 'campaigns.copy') {
				response = { copied_campaign_id: 'campaign-copy-1' };
			} else if (testCase.name === 'adSets.copy') {
				response = { copied_adset_id: 'adset-copy-1' };
			} else if (testCase.name === 'ads.copy') {
				response = { copied_ad_id: 'ad-copy-1' };
			} else if (
				testCase.name === 'accounts.activitiesList' ||
				testCase.name === 'adSets.activitiesList'
			) {
				response = {
					data: [
						{ event_type: 'create_ad', actor_id: 'user-1', object_id: 'ad-1' },
					],
				};
			} else if (
				testCase.name === 'audiences.usersAdd' ||
				testCase.name === 'audiences.usersRemove' ||
				testCase.name === 'audiences.usersReplace'
			) {
				response = {
					audience_id: 'audience-1',
					session_id: 123,
					num_received: 1,
					num_invalid_entries: 0,
					invalid_entry_samples: ['sensitive-sample'],
				};
			} else if (testCase.name === 'audiences.adAccountsShare') {
				response = {
					success: true,
					sharing_data: [
						{ ad_acct_id: '456', audience_share_status: 'SHARED' },
					],
				};
			} else if (testCase.name === 'audiences.adAccountsList') {
				response = { data: [{ id: '456' }] };
			} else if (testCase.name === 'images.list') {
				response = {
					data: [
						{ hash: 'image-hash', name: 'image.jpg', width: 640, height: 480 },
					],
					paging: { cursors: { after: 'image-cursor' } },
					summary: { total_count: 1 },
				};
			} else if (testCase.name === 'images.upload') {
				response = {
					images: {
						'image-hash': { hash: 'image-hash', width: 640, height: 480 },
					},
				};
			} else if (testCase.name === 'creatives.insightsList') {
				response = {
					data: [{ aesthetics: [{ key: 'image_quality', value: 'HIGH' }] }],
				};
			} else if (
				testCase.name === 'creatives.previewsList' ||
				testCase.name === 'ads.previewsList' ||
				testCase.name === 'accounts.generatePreviews'
			) {
				response = { data: [{ body: '<iframe>mock preview</iframe>' }] };
			} else if (labelAssociations) {
				response = successResponse;
			} else if (testCase.name === 'insights.createAsync') {
				response = { report_run_id: 'report-1' };
			} else if (testCase.name === 'insights.getAsyncReport') {
				response = {
					id: 'report-1',
					async_status: 'Job Running',
					async_percent_completion: 50,
				};
			} else if (testCase.name === 'insights.listFeatures') {
				response = {
					data: [
						{ feature_name: 'impression_device', feature_type: 'breakdown' },
					],
				};
			} else if (testCase.name === 'insights.listEnabledFeatures') {
				response = {
					data: [{ feature_name: 'impression_device', status: 'enabled' }],
				};
			} else if (testCase.name === 'insights.enableFeature') {
				response = { id: 'act_123' };
			} else if (testCase.name === 'audiences.sessionsList') {
				response = {
					data: [{ session_id: '123', stage: 'COMPLETED', num_received: '2' }],
				};
			} else if (testCase.name === 'accounts.usersList') {
				response = {
					data: [{ id: 'user-1', name: 'Test User', tasks: ['ANALYZE'] }],
				};
			} else if (testCase.name === 'accounts.broadTargetingCategoriesList') {
				response = {
					data: [
						{
							id: 6002714885172,
							name: 'Cooking',
							parent_category: 'Interests',
							size_lower_bound: 1000,
							size_upper_bound: 2000,
							type: 6,
							type_name: 'BCT',
						},
					],
				};
			} else if (
				testCase.method === 'DELETE' ||
				testCase.name.endsWith('.update')
			) {
				response = successResponse;
			} else if (isCreate) {
				response = createResponse;
			} else if (isList) {
				response = testCase.name.startsWith('insights.')
					? { data: [{ impressions: '10', spend: '1.00' }] }
					: listResponse;
			} else {
				response = objectResponse;
			}
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

	it('does not expose a credential-bearing paging URL in parsed list results', async () => {
		const next =
			'https://graph.facebook.com/v27.0/act_123/campaigns?after=cursor&access_token=secret';
		mockedRequest.mockResolvedValue({
			data: [{ id: 'campaign-1' }],
			paging: { cursors: { after: 'cursor-2' }, next },
		});

		const result = await Campaigns.list(ctx, { accountId: '123' });

		expect(result.paging).toEqual({
			cursors: { after: 'cursor-2' },
			hasNextPage: true,
		});
		expect(JSON.stringify(result)).not.toContain(next);
		expect(JSON.stringify(result)).not.toContain('secret');
	});

	it('reports no next page when Graph omits paging.next', async () => {
		mockedRequest.mockResolvedValue({
			data: [{ id: 'campaign-1' }],
			paging: { cursors: { after: 'cursor-2' } },
		});

		const result = await Campaigns.list(ctx, { accountId: '123' });

		expect(result.paging).toEqual({
			cursors: { after: 'cursor-2' },
			hasNextPage: false,
		});
	});

	it('strips credential-bearing paging URLs from nested expanded edge results', async () => {
		const next =
			'https://graph.facebook.com/v27.0/act_123/campaigns?after=cursor&access_token=nested_secret';
		mockedRequest.mockResolvedValue({
			id: 'act_123',
			name: 'Test Account',
			campaigns: {
				data: [{ id: 'campaign-1' }],
				paging: { cursors: { after: 'cursor-2' }, next },
			},
		});

		const result = await Accounts.get(ctx, {
			accountId: '123',
			fields: 'id,name,campaigns.limit(1){id}',
		});

		expect(JSON.stringify(result)).not.toContain(next);
		expect(JSON.stringify(result)).not.toContain('nested_secret');
		// `unknown` because expanded edge response shapes are dynamic open records before assertion.
		const nested = (result as Record<string, unknown>).campaigns as Record<
			string,
			unknown
		>;
		expect(nested.paging).toEqual({
			cursors: { after: 'cursor-2' },
			hasNextPage: true,
		});
	});

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

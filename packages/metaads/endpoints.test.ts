import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Accounts,
	AdSets,
	Ads,
	AsyncCreatives,
	AsyncRequestSets,
	AsyncRequests,
	Audiences,
	Campaigns,
	Creatives,
	CustomConversions,
	HighDemandPeriods,
	Images,
	Insights,
	Labels,
	Pixels,
	PublisherBlockLists,
	ReachFrequencyPredictions,
	Studies,
	Videos,
} from './endpoints';
import type { MetaAdsContext } from './index';
import { metaads } from './index';

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
	redactQueryOnError?: boolean;
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

// `unknown` is needed because expanded Graph edge values are dynamic JSON that must be narrowed before property access.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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
		query: { limit: 3, after: 'activity-cursor' },
		call: async () => {
			await Accounts.activitiesList(ctx, {
				accountId: '123',
				limit: 3,
				after: 'activity-cursor',
			});
		},
	},
	{
		name: 'accounts.assignedUsersList',
		path: '/act_123/assigned_users',
		method: 'GET',
		query: { business: 'business-1', limit: 3, after: 'user-cursor' },
		call: async () => {
			await Accounts.assignedUsersList(ctx, {
				accountId: '123',
				businessId: 'business-1',
				limit: 3,
				after: 'user-cursor',
			});
		},
	},
	{
		name: 'accounts.assignUser',
		path: '/act_123/assigned_users',
		method: 'POST',
		body: { user: 'user-1', tasks: '["ADVERTISE","ANALYZE"]' },
		call: async () => {
			await Accounts.assignUser(ctx, {
				accountId: '123',
				userId: 'user-1',
				tasks: ['ADVERTISE', 'ANALYZE'],
			});
		},
	},
	{
		name: 'accounts.removeUser',
		path: '/act_123/assigned_users',
		method: 'DELETE',
		encodedBody: 'user=user-1',
		call: async () => {
			await Accounts.removeUser(ctx, { accountId: '123', userId: 'user-1' });
		},
	},
	{
		name: 'accounts.controlsCreate',
		path: '/act_123/account_controls',
		method: 'POST',
		body: {
			audience_controls: '{"age_min":18,"geo_locations":{"countries":["US"]}}',
			placement_controls: '{"placement_exclusions":["FACEBOOK_MARKETPLACE"]}',
		},
		redactBodyOnError: true,
		call: async () => {
			await Accounts.controlsCreate(ctx, {
				accountId: '123',
				audienceControls: {
					ageMin: 18,
					geoLocations: { countries: ['US'] },
				},
				placementControls: {
					placementExclusions: ['FACEBOOK_MARKETPLACE'],
				},
			});
		},
	},
	{
		name: 'accounts.agenciesList',
		path: '/act_123/agencies',
		method: 'GET',
		query: { limit: 5, before: 'agency-cursor' },
		call: async () => {
			await Accounts.agenciesList(ctx, {
				accountId: '123',
				limit: 5,
				before: 'agency-cursor',
			});
		},
	},
	{
		name: 'accounts.agencyRemove',
		path: '/act_123/agencies',
		method: 'DELETE',
		encodedBody: 'business=business-1',
		call: async () => {
			await Accounts.agencyRemove(ctx, {
				accountId: '123',
				businessId: 'business-1',
			});
		},
	},
	{
		name: 'accounts.subscribedAppUpdate',
		path: '/act_123/subscribed_apps',
		method: 'POST',
		body: { app_id: 'app-1' },
		call: async () => {
			await Accounts.subscribedAppUpdate(ctx, {
				accountId: '123',
				appId: 'app-1',
			});
		},
	},
	{
		name: 'accounts.subscribedAppRemove',
		path: '/act_123/subscribed_apps',
		method: 'DELETE',
		encodedBody: 'app_id=app-1',
		call: async () => {
			await Accounts.subscribedAppRemove(ctx, {
				accountId: '123',
				appId: 'app-1',
			});
		},
	},
	{
		name: 'accounts.trackingCreate',
		path: '/act_123/tracking',
		method: 'POST',
		body: {
			tracking_specs:
				'{"action.type":["offsite_conversion"],"fb_pixel":["pixel-1"]}',
		},
		redactBodyOnError: true,
		call: async () => {
			await Accounts.trackingCreate(ctx, {
				accountId: '123',
				trackingSpecs: {
					'action.type': ['offsite_conversion'],
					fb_pixel: ['pixel-1'],
				},
			});
		},
	},
	{
		name: 'accounts.pixelsList',
		path: '/act_123/adspixels',
		method: 'GET',
		query: { limit: 5, after: 'pixel-cursor' },
		call: async () => {
			await Accounts.pixelsList(ctx, {
				accountId: '123',
				limit: 5,
				after: 'pixel-cursor',
			});
		},
	},
	{
		name: 'pixels.create',
		path: '/act_123/adspixels',
		method: 'POST',
		body: { name: 'Test pixel' },
		call: async () => {
			await Pixels.create(ctx, { accountId: '123', name: 'Test pixel' });
		},
	},
	{
		name: 'pixels.get',
		path: '/pixel-1',
		method: 'GET',
		query: { fields: 'id,name,data_use_setting' },
		call: async () => {
			await Pixels.get(ctx, {
				pixelId: 'pixel-1',
				fields: ['id', 'name', 'data_use_setting'],
			});
		},
	},
	{
		name: 'pixels.update',
		path: '/pixel-1',
		method: 'POST',
		redactBodyOnError: true,
		body: {
			name: 'Updated pixel',
			data_use_setting: 'ANALYTICS_ONLY',
			enable_automatic_matching: false,
		},
		call: async () => {
			await Pixels.update(ctx, {
				pixelId: 'pixel-1',
				name: 'Updated pixel',
				dataUseSetting: 'ANALYTICS_ONLY',
				enableAutomaticMatching: false,
			});
		},
	},
	{
		name: 'publisherBlockLists.create',
		path: '/act_123/publisher_block_lists',
		method: 'POST',
		body: { name: 'Test block list' },
		call: async () => {
			await PublisherBlockLists.create(ctx, {
				accountId: '123',
				name: 'Test block list',
			});
		},
	},
	{
		name: 'accounts.impactingAdStudiesList',
		path: '/act_123/impacting_ad_studies',
		method: 'GET',
		query: { limit: 5, after: 'study-cursor' },
		call: async () => {
			await Accounts.impactingAdStudiesList(ctx, {
				accountId: '123',
				limit: 5,
				after: 'study-cursor',
			});
		},
	},
	{
		name: 'accounts.adRulesLibraryList',
		path: '/act_123/adrules_library',
		method: 'GET',
		query: { limit: 3, before: 'rule-cursor' },
		call: async () => {
			await Accounts.adRulesLibraryList(ctx, {
				accountId: '123',
				limit: 3,
				before: 'rule-cursor',
			});
		},
	},
	{
		name: 'accounts.adRulesLibraryCreate',
		path: '/act_123/adrules_library',
		method: 'POST',
		redactBodyOnError: true,
		body: {
			name: 'Pause on spend limit',
			evaluation_spec:
				'{"evaluation_type":"SCHEDULE","filters":[{"field":"spend","value":100,"operator":"GREATER_THAN"}]}',
			execution_spec: '{"execution_type":"PAUSE","is_once_off":true}',
			schedule_spec: '{"schedule_type":"DAILY"}',
			status: 'DISABLED',
		},
		call: async () => {
			await Accounts.adRulesLibraryCreate(ctx, {
				accountId: '123',
				name: 'Pause on spend limit',
				evaluationSpec: {
					evaluationType: 'SCHEDULE',
					filters: [{ field: 'spend', value: 100, operator: 'GREATER_THAN' }],
				},
				executionSpec: { executionType: 'PAUSE', isOnceOff: true },
				scheduleSpec: { scheduleType: 'DAILY' },
				status: 'DISABLED',
			});
		},
	},
	{
		name: 'accounts.activeAdRulesList',
		path: '/act_123/active_adrules',
		method: 'GET',
		query: {
			selected_ids: '["campaign-1","adset-1"]',
			pass_evaluation: true,
			limit: 10,
			after: 'rule-cursor',
		},
		call: async () => {
			await Accounts.activeAdRulesList(ctx, {
				accountId: '123',
				selectedIds: ['campaign-1', 'adset-1'],
				passEvaluation: true,
				limit: 10,
				after: 'rule-cursor',
			});
		},
	},
	{
		name: 'accounts.generatePreviews',
		path: '/act_123/generatepreviews',
		method: 'GET',
		redactQueryOnError: true,
		query: {
			ad_format: 'DESKTOP_FEED_STANDARD',
			creative:
				'{"object_story_spec":{"page_id":"page-1","link_data":{"link":"https://shop.test/landing","message":"Sample"}}}',
			limit: 2,
			after: 'preview-cursor',
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
				limit: 2,
				after: 'preview-cursor',
			});
		},
	},
	{
		name: 'accounts.broadTargetingCategoriesList',
		path: '/act_123/broadtargetingcategories',
		method: 'GET',
		query: { custom_categories_only: true, limit: 3, after: 'broad-cursor' },
		call: async () => {
			await Accounts.broadTargetingCategoriesList(ctx, {
				accountId: '123',
				customCategoriesOnly: true,
				limit: 3,
				after: 'broad-cursor',
			});
		},
	},
	{
		name: 'accounts.smartSuggestedAdsList',
		path: '/act_123/smart_suggested_ads',
		method: 'GET',
		query: {
			objective: 'OUTCOME_TRAFFIC',
			optimization_goal: 'LINK_CLICKS',
			pixel_id: 'pixel-1',
			product_set_id: 'product-set-1',
			limit: 5,
			after: 'suggestion-cursor',
		},
		call: async () => {
			await Accounts.smartSuggestedAdsList(ctx, {
				accountId: '123',
				objective: 'OUTCOME_TRAFFIC',
				optimizationGoal: 'LINK_CLICKS',
				pixelId: 'pixel-1',
				productSetId: 'product-set-1',
				limit: 5,
				after: 'suggestion-cursor',
			});
		},
	},
	{
		name: 'accounts.suggestedAdsList',
		path: '/act_123/suggested_ads',
		method: 'GET',
		query: {
			countries: 'US,CA',
			objective: 'OUTCOME_SALES',
			optimization_goal: 'OFFSITE_CONVERSIONS',
			rank_by: 'ads_revenue',
			use_case: 'AUTOMATED_SHOPPING_ADS',
			limit: 20,
		},
		call: async () => {
			await Accounts.suggestedAdsList(ctx, {
				accountId: '123',
				countries: ['US', 'CA'],
				objective: 'OUTCOME_SALES',
				optimizationGoal: 'OFFSITE_CONVERSIONS',
				rankBy: 'ads_revenue',
				useCase: 'AUTOMATED_SHOPPING_ADS',
				limit: 20,
			});
		},
	},
	{
		name: 'accounts.placePageSetsCreate',
		path: '/act_123/ad_place_page_sets',
		method: 'POST',
		body: {
			name: 'Store locations',
			parent_page: 'page-1',
			location_types: '["recent","home"]',
		},
		call: async () => {
			await Accounts.placePageSetsCreate(ctx, {
				accountId: '123',
				name: 'Store locations',
				parentPageId: 'page-1',
				locationTypes: ['recent', 'home'],
			});
		},
	},
	{
		name: 'accounts.reachEstimate',
		path: '/act_123/reachestimate',
		method: 'GET',
		redactQueryOnError: true,
		query: {
			object_store_url: 'https://store.test/app',
			targeting_spec: '{"geo_locations":{"countries":["US"]}}',
		},
		call: async () => {
			await Accounts.reachEstimate(ctx, {
				accountId: '123',
				objectStoreUrl: 'https://store.test/app',
				targetingSpec: { geo_locations: { countries: ['US'] } },
			});
		},
	},
	{
		name: 'labels.list',
		path: '/act_123/adlabels',
		method: 'GET',
		query: { limit: 5, after: 'label-cursor' },
		call: async () => {
			await Labels.list(ctx, {
				accountId: '123',
				limit: 5,
				after: 'label-cursor',
			});
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
		query: { limit: 4, after: 'ad-cursor' },
		call: async () => {
			await Labels.adsList(ctx, {
				labelId: 'label-1',
				limit: 4,
				after: 'ad-cursor',
			});
		},
	},
	{
		name: 'labels.adSetsList',
		path: '/label-1/adsets',
		method: 'GET',
		query: { limit: 4, before: 'adset-cursor' },
		call: async () => {
			await Labels.adSetsList(ctx, {
				labelId: 'label-1',
				limit: 4,
				before: 'adset-cursor',
			});
		},
	},
	{
		name: 'labels.campaignsList',
		path: '/label-1/campaigns',
		method: 'GET',
		query: { limit: 6, after: 'campaign-cursor' },
		call: async () => {
			await Labels.campaignsList(ctx, {
				labelId: 'label-1',
				limit: 6,
				after: 'campaign-cursor',
			});
		},
	},
	{
		name: 'labels.creativesList',
		path: '/label-1/adcreatives',
		method: 'GET',
		query: { limit: 2, after: 'creative-cursor' },
		call: async () => {
			await Labels.creativesList(ctx, {
				labelId: 'label-1',
				limit: 2,
				after: 'creative-cursor',
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
		query: { limit: 5, after: 'study-cursor' },
		call: async () => {
			await Campaigns.adStudiesList(ctx, {
				campaignId: 'campaign-1',
				limit: 5,
				after: 'study-cursor',
			});
		},
	},
	{
		name: 'campaigns.adRulesGovernedList',
		path: '/campaign-1/adrules_governed',
		method: 'GET',
		query: { pass_evaluation: false, limit: 3, after: 'rule-cursor' },
		call: async () => {
			await Campaigns.adRulesGovernedList(ctx, {
				campaignId: 'campaign-1',
				passEvaluation: false,
				limit: 3,
				after: 'rule-cursor',
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
		query: { limit: 2, after: 'creative-cursor' },
		call: async () => {
			await AdSets.adCreativesList(ctx, {
				adSetId: 'adset-1',
				limit: 2,
				after: 'creative-cursor',
			});
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
		query: { limit: 5, after: 'study-cursor' },
		call: async () => {
			await AdSets.adStudiesList(ctx, {
				adSetId: 'adset-1',
				limit: 5,
				after: 'study-cursor',
			});
		},
	},
	{
		name: 'adSets.adRulesGovernedList',
		path: '/adset-1/adrules_governed',
		method: 'GET',
		query: { pass_evaluation: true, limit: 4, before: 'rule-cursor' },
		call: async () => {
			await AdSets.adRulesGovernedList(ctx, {
				adSetId: 'adset-1',
				passEvaluation: true,
				limit: 4,
				before: 'rule-cursor',
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
		query: { limit: 2, before: 'creative-cursor' },
		call: async () => {
			await Ads.adCreativesList(ctx, {
				adId: 'ad-1',
				limit: 2,
				before: 'creative-cursor',
			});
		},
	},
	{
		name: 'ads.adStudiesList',
		path: '/ad-1/ad_studies',
		method: 'GET',
		query: { limit: 5, after: 'study-cursor' },
		call: async () => {
			await Ads.adStudiesList(ctx, {
				adId: 'ad-1',
				limit: 5,
				after: 'study-cursor',
			});
		},
	},
	{
		name: 'ads.adRulesGovernedList',
		path: '/ad-1/adrules_governed',
		method: 'GET',
		query: { pass_evaluation: true, limit: 3, after: 'rule-cursor' },
		call: async () => {
			await Ads.adRulesGovernedList(ctx, {
				adId: 'ad-1',
				passEvaluation: true,
				limit: 3,
				after: 'rule-cursor',
			});
		},
	},
	{
		name: 'ads.previewsList',
		path: '/ad-1/previews',
		method: 'GET',
		query: {
			ad_format: 'DESKTOP_FEED_STANDARD',
			limit: 2,
			after: 'preview-cursor',
		},
		redactQueryOnError: true,
		call: async () => {
			await Ads.previewsList(ctx, {
				adId: 'ad-1',
				adFormat: 'DESKTOP_FEED_STANDARD',
				limit: 2,
				after: 'preview-cursor',
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
			conversion_domain: 'shop.example',
			creative: { creative_id: 'creative-1' },
			status: 'PAUSED',
		},
		call: async () => {
			await Ads.create(ctx, {
				accountId: '123',
				adSetId: 'adset-1',
				name: 'Test ad',
				conversionDomain: 'shop.example',
				creativeId: 'creative-1',
				status: 'PAUSED',
			});
		},
	},
	// Meta's documented inline AdCreative envelope is nested under the creative form field.
	{
		name: 'ads.create',
		path: '/act_123/ads',
		method: 'POST',
		body: {
			name: 'Inline ad',
			adset_id: 'adset-1',
			creative: {
				name: 'Inline creative',
				authorization_category: 'POLITICAL_WITH_DIGITALLY_CREATED_MEDIA',
				object_story_spec: {
					page_id: 'page-1',
					link_data: { link: 'https://shop.test/landing', message: 'Hello' },
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
		query: { limit: 3, after: 'insight-cursor' },
		call: async () => {
			await Creatives.insightsList(ctx, {
				creativeId: 'creative-1',
				limit: 3,
				after: 'insight-cursor',
			});
		},
	},
	{
		name: 'creatives.previewsList',
		path: '/creative-1/previews',
		method: 'GET',
		redactQueryOnError: true,
		query: {
			ad_format: 'INSTAGRAM_STANDARD',
			width: 400,
			height: 400,
			limit: 2,
			before: 'preview-cursor',
		},
		call: async () => {
			await Creatives.previewsList(ctx, {
				creativeId: 'creative-1',
				adFormat: 'INSTAGRAM_STANDARD',
				width: 400,
				height: 400,
				limit: 2,
				before: 'preview-cursor',
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
		name: 'audiences.acceptTerms',
		path: '/act_123/customaudiencestos',
		method: 'POST',
		body: { tos_id: 'terms-1', business_id: 'business-1' },
		call: async () => {
			await Audiences.acceptTerms(ctx, {
				accountId: '123',
				termsId: 'terms-1',
				businessId: 'business-1',
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
		name: 'asyncCreatives.list',
		path: '/act_123/asyncadcreatives',
		method: 'GET',
		query: { is_completed: true, limit: 2, after: 'async-creative-cursor' },
		call: async () => {
			await AsyncCreatives.list(ctx, {
				accountId: '123',
				isCompleted: true,
				limit: 2,
				after: 'async-creative-cursor',
			});
		},
	},
	{
		name: 'asyncCreatives.create',
		path: '/act_123/asyncadcreatives',
		method: 'POST',
		redactBodyOnError: true,
		body: {
			name: 'Creative job',
			creative_spec: '{"name":"Async creative","object_story_id":"post-1"}',
			notification_mode: 'OFF',
		},
		call: async () => {
			await AsyncCreatives.create(ctx, {
				accountId: '123',
				name: 'Creative job',
				creativeSpec: { name: 'Async creative', objectStoryId: 'post-1' },
			});
		},
	},
	{
		name: 'asyncRequestSets.list',
		path: '/act_123/asyncadrequestsets',
		method: 'GET',
		query: { is_completed: false, limit: 5, before: 'set-cursor' },
		call: async () => {
			await AsyncRequestSets.list(ctx, {
				accountId: '123',
				isCompleted: false,
				limit: 5,
				before: 'set-cursor',
			});
		},
	},
	{
		name: 'asyncRequestSets.create',
		path: '/act_123/asyncadrequestsets',
		method: 'POST',
		redactBodyOnError: true,
		body: {
			name: 'Ad request job',
			ad_specs: '[{"name":"Ad 1","adset_id":"adset-1"}]',
			notification_mode: 'OFF',
		},
		call: async () => {
			await AsyncRequestSets.create(ctx, {
				accountId: '123',
				name: 'Ad request job',
				adSpecs: [{ name: 'Ad 1', adset_id: 'adset-1' }],
			});
		},
	},
	{
		name: 'asyncRequestSets.get',
		path: '/request-set-1',
		method: 'GET',
		query: { fields: 'id,name,is_completed,success_count' },
		call: async () => {
			await AsyncRequestSets.get(ctx, {
				requestSetId: 'request-set-1',
				fields: ['id', 'name', 'is_completed', 'success_count'],
			});
		},
	},
	{
		name: 'asyncRequestSets.get',
		path: '/1234567890123',
		method: 'GET',
		query: { fields: 'id,name' },
		call: async () => {
			await AsyncRequestSets.get(ctx, {
				requestSetId: 1_234_567_890_123,
				fields: ['id', 'name'],
			});
		},
	},
	{
		name: 'asyncRequestSets.update',
		path: '/request-set-1',
		method: 'POST',
		body: { name: 'Renamed request job' },
		call: async () => {
			await AsyncRequestSets.update(ctx, {
				requestSetId: 'request-set-1',
				name: 'Renamed request job',
			});
		},
	},
	{
		name: 'asyncRequestSets.update',
		path: '/1234567890123',
		method: 'POST',
		body: { name: 'Renamed numeric request job' },
		call: async () => {
			await AsyncRequestSets.update(ctx, {
				requestSetId: 1_234_567_890_123,
				name: 'Renamed numeric request job',
			});
		},
	},
	{
		name: 'asyncRequestSets.cancel',
		path: '/request-set-1',
		method: 'DELETE',
		call: async () => {
			await AsyncRequestSets.cancel(ctx, { requestSetId: 'request-set-1' });
		},
	},
	{
		name: 'asyncRequestSets.cancel',
		path: '/1234567890123',
		method: 'DELETE',
		call: async () => {
			await AsyncRequestSets.cancel(ctx, {
				requestSetId: 1_234_567_890_123,
			});
		},
	},
	{
		name: 'asyncRequests.listForSet',
		path: '/request-set-1/requests',
		method: 'GET',
		query: {
			status: 'SUCCESS,ERROR',
			fields: 'id,status',
			limit: 10,
			after: 'request-cursor',
		},
		call: async () => {
			await AsyncRequests.listForSet(ctx, {
				requestSetId: 'request-set-1',
				status: ['SUCCESS', 'ERROR'],
				fields: ['id', 'status'],
				limit: 10,
				after: 'request-cursor',
			});
		},
	},
	{
		name: 'asyncRequests.listForSet',
		path: '/1234567890123/requests',
		method: 'GET',
		query: { fields: 'id,status', limit: 5 },
		call: async () => {
			await AsyncRequests.listForSet(ctx, {
				requestSetId: 1_234_567_890_123,
				fields: ['id', 'status'],
				limit: 5,
			});
		},
	},
	{
		name: 'asyncRequests.listForAdSet',
		path: '/adset-1/asyncadrequests',
		method: 'GET',
		query: { statuses: 'IN_PROGRESS', fields: 'id,scope_object_id,status' },
		call: async () => {
			await AsyncRequests.listForAdSet(ctx, {
				adSetId: 'adset-1',
				status: ['IN_PROGRESS'],
				fields: ['id', 'scope_object_id', 'status'],
			});
		},
	},
	{
		name: 'asyncRequests.cancel',
		path: '/request-1',
		method: 'DELETE',
		call: async () => {
			await AsyncRequests.cancel(ctx, { requestId: 'request-1' });
		},
	},
	{
		name: 'asyncRequests.cancel',
		path: '/9876543210987',
		method: 'DELETE',
		call: async () => {
			await AsyncRequests.cancel(ctx, { requestId: 9_876_543_210_987 });
		},
	},
	{
		name: 'reachFrequencyPredictions.get',
		path: '/prediction-1',
		method: 'GET',
		query: { fields: 'id,prediction_mode,prediction_progress' },
		call: async () => {
			await ReachFrequencyPredictions.get(ctx, {
				predictionId: 'prediction-1',
				fields: ['id', 'prediction_mode', 'prediction_progress'],
			});
		},
	},
	{
		name: 'reachFrequencyPredictions.list',
		path: '/act_123/reachfrequencypredictions',
		method: 'GET',
		query: { fields: 'id,name', limit: 5, after: 'prediction-cursor' },
		call: async () => {
			await ReachFrequencyPredictions.list(ctx, {
				accountId: '123',
				fields: ['id', 'name'],
				limit: 5,
				after: 'prediction-cursor',
			});
		},
	},
	{
		name: 'reachFrequencyPredictions.create',
		path: '/act_123/reachfrequencypredictions',
		method: 'POST',
		redactBodyOnError: true,
		body: {
			budget: 500000,
			day_parting_schedule:
				'[{"start_minute":360,"end_minute":1440,"days":[0,1,2,3,4,5,6],"timezone_type":"ADVERTISER"}]',
			objective: 'REACH',
			prediction_mode: 1,
			start_time: 1800000000,
			stop_time: 1800086400,
			target_spec: '{"geo_locations":{"countries":["US"]}}',
		},
		call: async () => {
			await ReachFrequencyPredictions.create(ctx, {
				accountId: '123',
				budget: 500000,
				dayPartingSchedule: [
					{
						startMinute: 360,
						endMinute: 1440,
						days: [0, 1, 2, 3, 4, 5, 6],
						timezoneType: 'ADVERTISER',
					},
				],
				objective: 'REACH',
				predictionMode: 1,
				startTime: 1_800_000_000,
				stopTime: 1_800_086_400,
				targetSpec: { geo_locations: { countries: ['US'] } },
			});
		},
	},
	{
		name: 'customConversions.create',
		path: '/act_123/customconversions',
		method: 'POST',
		redactBodyOnError: true,
		body: {
			action_source_type: 'website',
			custom_event_type: 'PURCHASE',
			default_conversion_value: 0,
			event_source_id: 'pixel-1',
			name: 'Completed checkout',
			rule: 'url contains /checkout',
		},
		call: async () => {
			await CustomConversions.create(ctx, {
				accountId: '123',
				actionSourceType: 'website',
				customEventType: 'PURCHASE',
				defaultConversionValue: 0,
				eventSourceId: 'pixel-1',
				name: 'Completed checkout',
				rule: 'url contains /checkout',
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
		name: 'insights.getAsyncReport',
		path: '/6023920149050',
		method: 'GET',
		query: { fields: 'id,async_status' },
		call: async () => {
			await Insights.getAsyncReport(ctx, {
				reportRunId: 6_023_920_149_050,
				fields: ['id', 'async_status'],
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
		name: 'insights.getAsyncResults',
		path: '/6023920149050/insights',
		method: 'GET',
		query: { limit: 5 },
		call: async () => {
			await Insights.getAsyncResults(ctx, {
				reportRunId: 6_023_920_149_050,
				limit: 5,
			});
		},
	},
	{
		name: 'insights.listFeatures',
		path: '/act_123/insights/feature-settings/list-features',
		method: 'GET',
		query: { limit: 3, after: 'feature-cursor' },
		call: async () => {
			await Insights.listFeatures(ctx, {
				accountId: '123',
				limit: 3,
				after: 'feature-cursor',
			});
		},
	},
	{
		name: 'insights.listEnabledFeatures',
		path: '/act_123/insights/feature-settings',
		method: 'GET',
		query: { limit: 2, before: 'enabled-feature-cursor' },
		call: async () => {
			await Insights.listEnabledFeatures(ctx, {
				accountId: '123',
				limit: 2,
				before: 'enabled-feature-cursor',
			});
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
	it('sends is_adset_budget_sharing_enabled when the campaign has no campaign budget', async () => {
		mockedRequest.mockResolvedValue({ id: 'campaign-1' });

		await Campaigns.create(ctx, {
			accountId: '123',
			name: 'Ad set budget campaign',
			objective: 'OUTCOME_TRAFFIC',
			specialAdCategories: [],
		});
		await Campaigns.create(ctx, {
			accountId: '123',
			name: 'Shared ad set budget campaign',
			objective: 'OUTCOME_TRAFFIC',
			specialAdCategories: [],
			adsetBudgetSharing: true,
		});
		await Campaigns.create(ctx, {
			accountId: '123',
			name: 'Campaign budget campaign',
			objective: 'OUTCOME_TRAFFIC',
			specialAdCategories: [],
			dailyBudget: 500,
		});

		expect(mockedRequest.mock.calls[0]?.[2]?.body).toMatchObject({
			is_adset_budget_sharing_enabled: 'false',
		});
		expect(mockedRequest.mock.calls[1]?.[2]?.body).toMatchObject({
			is_adset_budget_sharing_enabled: 'true',
		});
		expect(
			mockedRequest.mock.calls[2]?.[2]?.body?.is_adset_budget_sharing_enabled,
		).toBeUndefined();
		await expect(
			Campaigns.create(ctx, {
				accountId: '123',
				name: 'Invalid',
				objective: 'OUTCOME_TRAFFIC',
				specialAdCategories: [],
				dailyBudget: 500,
				adsetBudgetSharing: true,
			}),
		).rejects.toThrow();
	});

	it('forwards ad set bid strategy, bid amount and promoted object', async () => {
		mockedRequest.mockResolvedValue({ id: 'adset-1' });

		await AdSets.create(ctx, {
			accountId: '123',
			campaignId: 'campaign-1',
			name: 'Conversions ad set',
			optimizationGoal: 'OFFSITE_CONVERSIONS',
			billingEvent: 'IMPRESSIONS',
			targeting: { geo_locations: { countries: ['US'] } },
			bidStrategy: 'COST_CAP',
			bidAmount: 250,
			promotedObject: { pixel_id: 'pixel-1', custom_event_type: 'PURCHASE' },
			dailyBudget: 1000,
		});

		expect(mockedRequest.mock.calls[0]?.[2]?.body).toMatchObject({
			bid_strategy: 'COST_CAP',
			bid_amount: 250,
			promoted_object: { pixel_id: 'pixel-1', custom_event_type: 'PURCHASE' },
		});
		await expect(
			AdSets.create(ctx, {
				accountId: '123',
				campaignId: 'campaign-1',
				name: 'Missing bid',
				optimizationGoal: 'LINK_CLICKS',
				billingEvent: 'IMPRESSIONS',
				targeting: { geo_locations: { countries: ['US'] } },
				bidStrategy: 'LOWEST_COST_WITH_BID_CAP',
				dailyBudget: 1000,
			}),
		).rejects.toThrow();
	});

	it('accepts fields and codes Meta adds to read responses', async () => {
		mockedRequest.mockResolvedValueOnce({
			data: {
				users_lower_bound: 1000,
				users_upper_bound: 2000,
				estimate_ready: true,
			},
		});
		await expect(
			Accounts.reachEstimate(ctx, {
				accountId: '123',
				targetingSpec: { geo_locations: { countries: ['US'] } },
			}),
		).resolves.toMatchObject({ data: { estimate_ready: true } });

		mockedRequest.mockResolvedValueOnce({
			id: 'pixel-1',
			name: 'Pixel',
			owner_business: { id: 'business-1' },
		});
		await expect(
			Pixels.get(ctx, { pixelId: 'pixel-1' }),
		).resolves.toMatchObject({ id: 'pixel-1' });

		mockedRequest.mockResolvedValueOnce({
			id: 'prediction-1',
			prediction_mode: 2,
			story_event_type: 512,
		});
		await expect(
			ReachFrequencyPredictions.get(ctx, { predictionId: 'prediction-1' }),
		).resolves.toMatchObject({ prediction_mode: 2 });

		mockedRequest.mockResolvedValueOnce({
			data: [{ hash: 'hash-1', status: 'ARCHIVED' }],
		});
		await expect(Images.list(ctx, { accountId: '123' })).resolves.toMatchObject(
			{ data: [{ status: 'ARCHIVED' }] },
		);

		mockedRequest.mockResolvedValueOnce({
			data: [{ feature_name: 'new_breakdown', feature_type: 'metric' }],
		});
		await expect(
			Insights.listFeatures(ctx, { accountId: '123' }),
		).resolves.toMatchObject({ data: [{ feature_name: 'new_breakdown' }] });
	});

	it('marks label deletion destructive', () => {
		expect(metaads().endpointMeta?.['labels.delete']?.riskLevel).toBe(
			'destructive',
		);
	});

	it('accepts { success: true } from async request set writes', async () => {
		mockedRequest.mockResolvedValueOnce({ success: true });
		await expect(
			AsyncRequestSets.cancel(ctx, { requestSetId: 'set-1' }),
		).resolves.toEqual({ success: true });
		mockedRequest.mockResolvedValueOnce(true);
		await expect(
			AsyncRequests.cancel(ctx, { requestId: 'request-1' }),
		).resolves.toBe(true);
	});

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
					'asyncRequestSets.get',
					'accounts.reachEstimate',
					'reachFrequencyPredictions.get',
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
				'accounts.adRulesLibraryCreate',
				'accounts.adRulesLibraryCreate',
				'insights.createAsync',
				'asyncCreatives.create',
				'asyncRequestSets.create',
				'pixels.create',
				'publisherBlockLists.create',
				'accounts.placePageSetsCreate',
				'reachFrequencyPredictions.create',
				'customConversions.create',
			].includes(testCase.name);
			const labelAssociations = [
				'campaigns.labelsAdd',
				'ads.labelsAdd',
				'creatives.labelsAdd',
			].includes(testCase.name);
			// `unknown` is needed because this table covers distinct mocked response envelopes, including literal boolean responses, before endpoint-specific validation.
			let response: unknown;
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
			} else if (testCase.name === 'accounts.assignedUsersList') {
				response = {
					data: [
						{
							id: 'user-1',
							tasks: ['ANALYZE'],
							permitted_tasks: ['ANALYZE', 'ADVERTISE'],
						},
					],
					summary: { total_count: 1 },
				};
			} else if (testCase.name === 'accounts.agenciesList') {
				response = {
					data: [
						{
							id: 'business-1',
							access_status: 'APPROVED',
							permitted_tasks: ['ANALYZE'],
						},
					],
				};
			} else if (testCase.name === 'accounts.controlsCreate') {
				response = { id: 'control-1', success: true };
			} else if (testCase.name === 'pixels.get') {
				response = {
					id: 'pixel-1',
					name: 'Pixel name',
					data_use_setting: 'ANALYTICS_ONLY',
				};
			} else if (testCase.name === 'accounts.reachEstimate') {
				response = {
					data: { users_lower_bound: 1000, users_upper_bound: 2000 },
				};
			} else if (testCase.name === 'reachFrequencyPredictions.get') {
				response = {
					id: 'prediction-1',
					prediction_mode: 1,
					prediction_progress: 50,
				};
			} else if (testCase.name === 'customConversions.create') {
				response = {
					id: 'conversion-1',
					is_custom_event_type_predicted: '0',
				};
			} else if (
				[
					'accounts.assignUser',
					'accounts.removeUser',
					'accounts.agencyRemove',
					'accounts.subscribedAppUpdate',
					'accounts.subscribedAppRemove',
					'accounts.trackingCreate',
					'accounts.trackingCreate',
					'audiences.acceptTerms',
				].includes(testCase.name)
			) {
				response = successResponse;
			} else if (testCase.name === 'asyncRequestSets.get') {
				response = {
					id: 'request-set-1',
					name: 'Ad request job',
					is_completed: false,
					success_count: 0,
				};
			} else if (
				['asyncRequests.listForSet', 'asyncRequests.listForAdSet'].includes(
					testCase.name,
				)
			) {
				response = {
					data: [
						{
							id: 'request-1',
							scope_object_id: 'adset-1',
							status: 'SUCCESS',
						},
					],
				};
			} else if (
				[
					'asyncRequestSets.update',
					'asyncRequestSets.cancel',
					'asyncRequests.cancel',
				].includes(testCase.name)
			) {
				response = true;
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
				...(testCase.redactQueryOnError ? { redactQueryOnError: true } : {}),
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
		const nested = result.campaigns;
		if (!isRecord(nested)) throw new Error('Expected expanded campaign edge');
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

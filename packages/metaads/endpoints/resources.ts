import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeMetaAdsRequest } from '../client';
import type { MetaAdsContext } from '../index';
import {
	InsightsListSchema,
	MetaAdsDeleteSchema,
	MetaAdsEndpointInputSchemas,
	MetaAdsEndpointOutputSchemas,
	MetaAdsListSchema,
	MetaAdsMutationSchema,
	MetaAdsObjectSchema,
} from './types';

type Method = 'GET' | 'POST' | 'DELETE';
// `unknown` form values are endpoint-specific Graph JSON, validated before this transport boundary.
type RequestShape = {
	query?: Record<string, string | number | boolean | undefined>;
	body?: Record<string, unknown>;
	idempotencyKey?: string;
};

function operation<I, O>(config: {
	name: string;
	method: Method;
	path: (input: I) => string;
	input: z.ZodType<I>;
	output: z.ZodType<O>;
	request: (input: I) => RequestShape;
}) {
	return async (ctx: MetaAdsContext, input: I): Promise<O> => {
		const parsedInput = config.input.parse(input);
		const shape = config.request(parsedInput);
		const response = await makeMetaAdsRequest(
			config.path(parsedInput),
			ctx.key,
			{
				method: config.method,
				query: shape.query,
				body: shape.body,
				idempotencyKey: shape.idempotencyKey,
			},
		);
		const parsed = config.output.parse(response);
		await logEventFromContext(
			ctx,
			`metaads.${config.name}`,
			{ status: 'completed' },
			'completed',
		);
		return parsed;
	};
}

const emptyRequest = (): RequestShape => ({});
const accountPath = (accountId: string): string =>
	`/act_${encodeURIComponent(accountId.replace(/^act_/, ''))}`;
const idPath = (id: string): string => `/${encodeURIComponent(id)}`;
const pageParams = (input: {
	fields?: string;
	limit?: number;
	after?: string;
	before?: string;
}) => ({
	fields: input.fields,
	limit: input.limit,
	after: input.after,
	before: input.before,
});
// `unknown` is needed for documented nested JSON such as targeting and creative references.
const form = (value: Record<string, unknown>): RequestShape => ({
	body: value,
});
// `unknown` is needed for documented nested JSON such as targeting and creative references.
const keyedForm = (
	value: Record<string, unknown>,
	idempotencyKey?: string,
): RequestShape => ({
	body: value,
	idempotencyKey,
});

export const accountsList = operation({
	name: 'accounts.list',
	method: 'GET',
	path: () => '/me/adaccounts',
	input: MetaAdsEndpointInputSchemas.accountsList,
	output: MetaAdsEndpointOutputSchemas.accountsList,
	request: (input) => ({ query: pageParams(input) }),
});
export const accountsGet = operation({
	name: 'accounts.get',
	method: 'GET',
	path: (input) => accountPath(input.accountId),
	input: MetaAdsEndpointInputSchemas.accountsGet,
	output: MetaAdsEndpointOutputSchemas.accountsGet,
	request: (input) => ({ query: { fields: input.fields } }),
});

export const campaignsList = operation({
	name: 'campaigns.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/campaigns`,
	input: MetaAdsEndpointInputSchemas.campaignsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const campaignsGet = operation({
	name: 'campaigns.get',
	method: 'GET',
	path: (input) => idPath(input.campaignId),
	input: MetaAdsEndpointInputSchemas.campaignsGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const campaignsCreate = operation({
	name: 'campaigns.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/campaigns`,
	input: MetaAdsEndpointInputSchemas.campaignsCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		keyedForm(
			{
				name: input.name,
				objective: input.objective,
				// Preserve required [] in form encoding instead of dropping an empty array.
				special_ad_categories: JSON.stringify(input.specialAdCategories),
				status: input.status ?? 'PAUSED',
				daily_budget: input.dailyBudget,
				lifetime_budget: input.lifetimeBudget,
			},
			input.idempotencyKey,
		),
});
export const campaignsUpdate = operation({
	name: 'campaigns.update',
	method: 'POST',
	path: (input) => idPath(input.campaignId),
	input: MetaAdsEndpointInputSchemas.campaignsUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) =>
		form({
			name: input.name,
			status: input.status,
			daily_budget: input.dailyBudget,
			lifetime_budget: input.lifetimeBudget,
			spend_cap: input.spendCap,
		}),
});
export const campaignsDelete = operation({
	name: 'campaigns.delete',
	method: 'DELETE',
	path: (input) => idPath(input.campaignId),
	input: MetaAdsEndpointInputSchemas.campaignsDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});

export const adSetsList = operation({
	name: 'adSets.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/adsets`,
	input: MetaAdsEndpointInputSchemas.adSetsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const adSetsGet = operation({
	name: 'adSets.get',
	method: 'GET',
	path: (input) => idPath(input.adSetId),
	input: MetaAdsEndpointInputSchemas.adSetsGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const adSetsCreate = operation({
	name: 'adSets.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/adsets`,
	input: MetaAdsEndpointInputSchemas.adSetsCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		keyedForm(
			{
				campaign_id: input.campaignId,
				name: input.name,
				optimization_goal: input.optimizationGoal,
				billing_event: input.billingEvent,
				targeting: input.targeting,
				status: input.status ?? 'PAUSED',
				daily_budget: input.dailyBudget,
				lifetime_budget: input.lifetimeBudget,
				start_time: input.startTime,
				end_time: input.endTime,
			},
			input.idempotencyKey,
		),
});
export const adSetsUpdate = operation({
	name: 'adSets.update',
	method: 'POST',
	path: (input) => idPath(input.adSetId),
	input: MetaAdsEndpointInputSchemas.adSetsUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) =>
		form({
			name: input.name,
			status: input.status,
			daily_budget: input.dailyBudget,
			lifetime_budget: input.lifetimeBudget,
			end_time: input.endTime,
		}),
});
export const adSetsDelete = operation({
	name: 'adSets.delete',
	method: 'DELETE',
	path: (input) => idPath(input.adSetId),
	input: MetaAdsEndpointInputSchemas.adSetsDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});

export const adsList = operation({
	name: 'ads.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/ads`,
	input: MetaAdsEndpointInputSchemas.adsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const adsGet = operation({
	name: 'ads.get',
	method: 'GET',
	path: (input) => idPath(input.adId),
	input: MetaAdsEndpointInputSchemas.adsGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const adsCreate = operation({
	name: 'ads.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/ads`,
	input: MetaAdsEndpointInputSchemas.adsCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		keyedForm(
			{
				name: input.name,
				adset_id: input.adSetId,
				creative: { creative_id: input.creativeId },
				status: input.status ?? 'PAUSED',
			},
			input.idempotencyKey,
		),
});
export const adsUpdate = operation({
	name: 'ads.update',
	method: 'POST',
	path: (input) => idPath(input.adId),
	input: MetaAdsEndpointInputSchemas.adsUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) => form({ name: input.name, status: input.status }),
});
export const adsDelete = operation({
	name: 'ads.delete',
	method: 'DELETE',
	path: (input) => idPath(input.adId),
	input: MetaAdsEndpointInputSchemas.adsDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});

export const creativesList = operation({
	name: 'creatives.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/adcreatives`,
	input: MetaAdsEndpointInputSchemas.creativesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const creativesGet = operation({
	name: 'creatives.get',
	method: 'GET',
	path: (input) => idPath(input.creativeId),
	input: MetaAdsEndpointInputSchemas.creativesGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const creativesCreate = operation({
	name: 'creatives.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/adcreatives`,
	input: MetaAdsEndpointInputSchemas.creativesCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		keyedForm(
			{ name: input.name, object_story_id: input.objectStoryId },
			input.idempotencyKey,
		),
});
export const creativesUpdate = operation({
	name: 'creatives.update',
	method: 'POST',
	path: (input) => idPath(input.creativeId),
	input: MetaAdsEndpointInputSchemas.creativesUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) => form({ name: input.name }),
});
export const creativesDelete = operation({
	name: 'creatives.delete',
	method: 'DELETE',
	path: (input) => idPath(input.creativeId),
	input: MetaAdsEndpointInputSchemas.creativesDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});

export const audiencesList = operation({
	name: 'audiences.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/customaudiences`,
	input: MetaAdsEndpointInputSchemas.audiencesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const audiencesGet = operation({
	name: 'audiences.get',
	method: 'GET',
	path: (input) => idPath(input.audienceId),
	input: MetaAdsEndpointInputSchemas.audiencesGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const audiencesCreate = operation({
	name: 'audiences.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/customaudiences`,
	input: MetaAdsEndpointInputSchemas.audiencesCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		form({
			name: input.name,
			description: input.description,
			subtype: input.subtype,
		}),
});
export const audiencesUpdate = operation({
	name: 'audiences.update',
	method: 'POST',
	path: (input) => idPath(input.audienceId),
	input: MetaAdsEndpointInputSchemas.audiencesUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) =>
		form({ name: input.name, description: input.description }),
});
export const audiencesDelete = operation({
	name: 'audiences.delete',
	method: 'DELETE',
	path: (input) => idPath(input.audienceId),
	input: MetaAdsEndpointInputSchemas.audiencesDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});

export const insightsList = operation({
	name: 'insights.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/insights`,
	input: MetaAdsEndpointInputSchemas.insightsList,
	output: InsightsListSchema,
	request: (input) => ({
		query: {
			fields: input.fields.join(','),
			date_preset: input.datePreset,
			time_range:
				input.since || input.until
					? JSON.stringify({ since: input.since, until: input.until })
					: undefined,
			level: input.level,
			limit: input.limit,
			after: input.after,
		},
	}),
});

export const Accounts = { list: accountsList, get: accountsGet };
export const Campaigns = {
	list: campaignsList,
	get: campaignsGet,
	create: campaignsCreate,
	update: campaignsUpdate,
	delete: campaignsDelete,
};
export const AdSets = {
	list: adSetsList,
	get: adSetsGet,
	create: adSetsCreate,
	update: adSetsUpdate,
	delete: adSetsDelete,
};
export const Ads = {
	list: adsList,
	get: adsGet,
	create: adsCreate,
	update: adsUpdate,
	delete: adsDelete,
};
export const Creatives = {
	list: creativesList,
	get: creativesGet,
	create: creativesCreate,
	update: creativesUpdate,
	delete: creativesDelete,
};
export const Audiences = {
	list: audiencesList,
	get: audiencesGet,
	create: audiencesCreate,
	update: audiencesUpdate,
	delete: audiencesDelete,
};
export const Insights = { list: insightsList };

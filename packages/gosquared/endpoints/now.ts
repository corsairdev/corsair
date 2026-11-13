import { logEventFromContext } from 'corsair/core';
import type { GosquaredEndpoints } from '..';
import { makeGosquaredRequest } from '../client';
import type { GosquaredEndpointOutputs } from './types';
import {
	GosquaredEndpointInputSchemas,
	GosquaredEndpointOutputSchemas,
} from './types';

export const getOverview: GosquaredEndpoints['now.getOverview'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['now.getOverview'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.minimal !== undefined) query.minimal = parsed.minimal;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getOverview']
	>('/now/v3/overview', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getOverview'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getOverview',
		{ visitors: parsedResponse.visitors },
		'completed',
	);

	return parsedResponse;
};

export const getConcurrents: GosquaredEndpoints['now.getConcurrents'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['now.getConcurrents'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getConcurrents']
	>('/now/v3/concurrents', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getConcurrents'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getConcurrents',
		{ concurrents: parsedResponse.concurrents },
		'completed',
	);

	return parsedResponse;
};

export const getPages: GosquaredEndpoints['now.getPages'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['now.getPages'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.limit !== undefined) query.limit = parsed.limit;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getPages']
	>('/now/v3/pages', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getPages'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getPages',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getSources: GosquaredEndpoints['now.getSources'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['now.getSources'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.limit !== undefined) query.limit = parsed.limit;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getSources']
	>('/now/v3/sources', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getSources'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getSources',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getTimeSeries: GosquaredEndpoints['now.getTimeSeries'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['now.getTimeSeries'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getTimeSeries']
	>('/now/v3/timeSeries', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getTimeSeries'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getTimeSeries',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getBrowsers: GosquaredEndpoints['now.getBrowsers'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['now.getBrowsers'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getBrowsers']
	>('/now/v3/browsers', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getBrowsers'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getBrowsers',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getCountries: GosquaredEndpoints['now.getCountries'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['now.getCountries'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getCountries']
	>('/now/v3/countries', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getCountries'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getCountries',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getPlatforms: GosquaredEndpoints['now.getPlatforms'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['now.getPlatforms'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getPlatforms']
	>('/now/v3/platforms', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getPlatforms'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getPlatforms',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getVisitors: GosquaredEndpoints['now.getVisitors'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['now.getVisitors'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.limit !== undefined) query.limit = parsed.limit;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getVisitors']
	>('/now/v3/visitors', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getVisitors'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getVisitors',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getGeo: GosquaredEndpoints['now.getGeo'] = async (ctx, input) => {
	const parsed = GosquaredEndpointInputSchemas['now.getGeo'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getGeo']
	>('/now/v3/geo', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getGeo'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getGeo',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const getCampaigns: GosquaredEndpoints['now.getCampaigns'] = async (
	ctx,
	input,
) => {
	const parsed = GosquaredEndpointInputSchemas['now.getCampaigns'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['now.getCampaigns']
	>('/now/v3/campaigns', ctx.key, {
		method: 'GET',
		query,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['now.getCampaigns'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.now.getCampaigns',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

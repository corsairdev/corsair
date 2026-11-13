import { logEventFromContext } from 'corsair/core';
import type { GosquaredContext, GosquaredEndpoints } from '..';
import { makeGosquaredRequest } from '../client';
import type { TrendsOutput, TrendsQueryInput } from './types';
import { TrendsOutputSchema, TrendsQueryInputSchema } from './types';

type TrendsKey =
	| 'trends.getAggregate'
	| 'trends.getBrowser'
	| 'trends.getCountry'
	| 'trends.getEvent'
	| 'trends.getLanguage'
	| 'trends.getOrganisation'
	| 'trends.getOs'
	| 'trends.getPage'
	| 'trends.getPath1'
	| 'trends.getScreenDimensions'
	| 'trends.getSources';

async function fetchTrendsDimension(
	dimension: string,
	ctx: GosquaredContext,
	input: TrendsQueryInput,
	opKey: TrendsKey,
): Promise<TrendsOutput> {
	const parsed = TrendsQueryInputSchema.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		from: parsed.from,
		to: parsed.to,
	};
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;
	if (siteToken) query.site_token = siteToken;
	if (parsed.interval) query.interval = parsed.interval;
	if (parsed.limit !== undefined) query.limit = parsed.limit;
	if (parsed.format) query.format = parsed.format;
	if (parsed.dateFormat) query.dateFormat = parsed.dateFormat;

	const response = await makeGosquaredRequest<TrendsOutput>(
		`/trends/v2/${dimension}`,
		ctx.key,
		{
			method: 'GET',
			query,
			siteToken,
		},
	);

	const parsedResponse = TrendsOutputSchema.parse(response);

	await logEventFromContext(
		ctx,
		`gosquared.${opKey}`,
		{ dimension, from: parsed.from, to: parsed.to },
		'completed',
	);

	return parsedResponse;
}

export const getAggregate: GosquaredEndpoints['trends.getAggregate'] = (
	ctx,
	input,
) => fetchTrendsDimension('aggregate', ctx, input, 'trends.getAggregate');

export const getBrowser: GosquaredEndpoints['trends.getBrowser'] = (
	ctx,
	input,
) => fetchTrendsDimension('browser', ctx, input, 'trends.getBrowser');

export const getCountry: GosquaredEndpoints['trends.getCountry'] = (
	ctx,
	input,
) => fetchTrendsDimension('country', ctx, input, 'trends.getCountry');

export const getEvent: GosquaredEndpoints['trends.getEvent'] = (ctx, input) =>
	fetchTrendsDimension('event', ctx, input, 'trends.getEvent');

export const getLanguage: GosquaredEndpoints['trends.getLanguage'] = (
	ctx,
	input,
) => fetchTrendsDimension('language', ctx, input, 'trends.getLanguage');

export const getOrganisation: GosquaredEndpoints['trends.getOrganisation'] = (
	ctx,
	input,
) => fetchTrendsDimension('organisation', ctx, input, 'trends.getOrganisation');

export const getOs: GosquaredEndpoints['trends.getOs'] = (ctx, input) =>
	fetchTrendsDimension('os', ctx, input, 'trends.getOs');

export const getPage: GosquaredEndpoints['trends.getPage'] = (ctx, input) =>
	fetchTrendsDimension('page', ctx, input, 'trends.getPage');

export const getPath1: GosquaredEndpoints['trends.getPath1'] = (ctx, input) =>
	fetchTrendsDimension('path1', ctx, input, 'trends.getPath1');

export const getScreenDimensions: GosquaredEndpoints['trends.getScreenDimensions'] =
	(ctx, input) =>
		fetchTrendsDimension(
			'screenDimensions',
			ctx,
			input,
			'trends.getScreenDimensions',
		);

export const getSources: GosquaredEndpoints['trends.getSources'] = (
	ctx,
	input,
) => fetchTrendsDimension('sources', ctx, input, 'trends.getSources');

import { logEventFromContext } from 'corsair/core';
import {
	compactQuery,
	encodeAmaraPathSegment,
	makeAmaraRequest,
} from '../client';
import type { AmaraEndpoints } from '../index';
import {
	TeamLanguagesSchema,
	TeamListResponseSchema,
	TeamSchema,
} from './types';

export const list: AmaraEndpoints['teamsList'] = async (ctx, input) => {
	const raw = await makeAmaraRequest('teams/', ctx.key, {
		query: compactQuery({
			limit: input.limit,
			offset: input.offset,
		}),
	});
	const response = TeamListResponseSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.teams.list', {}, 'completed');
	return response;
};

export const getDetails: AmaraEndpoints['teamsGetDetails'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.slug)}/`,
		ctx.key,
	);
	const response = TeamSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.getDetails',
		{ slug: input.slug },
		'completed',
	);
	return response;
};

export const getLanguages: AmaraEndpoints['teamsGetLanguages'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`teams/${encodeAmaraPathSegment(input.slug)}/languages/`,
		ctx.key,
	);
	const response = TeamLanguagesSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.teams.getLanguages',
		{ slug: input.slug },
		'completed',
	);
	return response;
};

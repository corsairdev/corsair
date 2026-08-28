import { logEventFromContext } from 'corsair/core';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpoints } from '../index';

export const search: DiffbotEndpoints['search'] = async (ctx, input) => {
	const dqlQuery = input.entityType
		? `type:${input.entityType} ${input.query}`
		: input.query;

	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['search']>>
	>('dql', ctx.key, {
		method: 'GET',
		useKgBase: true,
		query: {
			query: dqlQuery,
			type: input.queryType,
			size: input.size,
			from: input.from,
			col: input.col,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.search.search',
		{ query: input.query, entityType: input.entityType },
		'completed',
	);
	return response;
};

export const searchCrawlData: DiffbotEndpoints['searchCrawlData'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['searchCrawlData']>>
	>('search', ctx.key, {
		method: 'GET',
		query: {
			col: input.col,
			query: input.query,
			num: input.num,
			start: input.start,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.search.searchCrawlData',
		{ col: input.col, query: input.query },
		'completed',
	);
	return response;
};

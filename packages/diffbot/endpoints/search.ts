import { logEventFromContext } from 'corsair/core';
import type { DiffbotEndpoints } from '..';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpointOutputs } from './types';

/**
 * Search the web and return structured results with article metadata.
 * Docs: https://docs.diffbot.com/reference/search-search
 */
export const web: DiffbotEndpoints['searchWeb'] = async (ctx, input) => {
	const { query, col, num, start } = input;

	const response = await makeDiffbotRequest<
		DiffbotEndpointOutputs['searchWeb']
	>('search', ctx.key, {
		method: 'GET',
		query: { query, col, num, start },
	});

	await logEventFromContext(ctx, 'diffbot.search.web', { query }, 'completed');
	return response;
};

/**
 * Query the Diffbot Knowledge Graph using DQL (Diffbot Query Language).
 * Docs: https://docs.diffbot.com/reference/dql-get
 */
export const dql: DiffbotEndpoints['searchDql'] = async (ctx, input) => {
	const { query, type, size, from, col } = input;

	// Build the DQL query string with optional type prefix
	const fullQuery = type ? `type:${type} ${query}` : query;

	const response = await makeDiffbotRequest<
		DiffbotEndpointOutputs['searchDql']
	>('dql', ctx.key, {
		method: 'GET',
		query: { query: fullQuery, size, from, col },
	});

	await logEventFromContext(
		ctx,
		'diffbot.search.dql',
		{ query: fullQuery },
		'completed',
	);
	return response;
};

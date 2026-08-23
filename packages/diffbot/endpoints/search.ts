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
 * Docs: https://docs.diffbot.com/reference/dqlget
 *
 * Uses the Knowledge Graph host: https://kg.diffbot.com/kg/v3/dql
 *
 * - `entityType`: optional DQL entity filter prepended to the query string (e.g. "Organization")
 * - `queryType`: optional HTTP `type` parameter selecting the execution mode
 *   ("query" | "text" | "queryTextFallback" | "crawl"). Defaults to "query".
 */
export const dql: DiffbotEndpoints['searchDql'] = async (ctx, input) => {
	const { query, entityType, queryType, size, from, col } = input;

	// Build the DQL query string with optional entity type prefix
	const fullQuery = entityType ? `type:${entityType} ${query}` : query;

	const response = await makeDiffbotRequest<
		DiffbotEndpointOutputs['searchDql']
	>('dql', ctx.key, {
		method: 'GET',
		// Route to Knowledge Graph host (kg.diffbot.com/kg/v3)
		useKgBase: true,
		query: {
			query: fullQuery,
			// HTTP `type` controls execution mode (query/text/crawl etc.)
			type: queryType,
			size,
			from,
			col,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.search.dql',
		{ query: fullQuery },
		'completed',
	);
	return response;
};

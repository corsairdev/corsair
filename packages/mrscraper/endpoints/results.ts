import { logEventFromContext } from 'corsair/core';
import type { MrscraperEndpoints } from '..';
import { makeMrscraperRequest } from '../client';
import type { MrscraperEndpointOutputs } from './types';
import {
	MrscraperEndpointInputSchemas,
	MrscraperEndpointOutputSchemas,
} from './types';

export const list: MrscraperEndpoints['resultsList'] = async (ctx, input) => {
	const parsed = MrscraperEndpointInputSchemas.resultsList.parse(input);
	const { filters, ...rest } = parsed;

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['resultsList']
	>('/results', ctx.key, {
		method: 'GET',
		// `filters` is serialized by the transport as `filters[scraperId]=…`.
		query: { ...rest, filters },
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.resultsList.parse(response);

	await logEventFromContext(ctx, 'mrscraper.results.list', {}, 'completed');

	return parsedResponse;
};

export const get: MrscraperEndpoints['resultsGet'] = async (ctx, input) => {
	const parsed = MrscraperEndpointInputSchemas.resultsGet.parse(input);

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['resultsGet']
	>(`/results/${encodeURIComponent(parsed.id)}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		MrscraperEndpointOutputSchemas.resultsGet.parse(response);

	await logEventFromContext(
		ctx,
		'mrscraper.results.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

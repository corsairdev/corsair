import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const find: HunterioEndpoints['domainFinderFind'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.domainFinderFind.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['domainFinderFind']
	>('/domain-finder', ctx.key, {
		method: 'GET',
		query: {
			company: parsed.company,
			limit: parsed.limit,
			perfect_match: parsed.perfect_match,
		},
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.domainFinderFind.parse(response);

	await logEventFromContext(ctx, 'hunterio.domainFinder.find', {}, 'completed');

	return parsedResponse;
};

export const findPost: HunterioEndpoints['domainFinderFindPost'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.domainFinderFindPost.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['domainFinderFindPost']
	>('/domain-finder', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.domainFinderFindPost.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.domainFinder.findPost',
		{},
		'completed',
	);

	return parsedResponse;
};

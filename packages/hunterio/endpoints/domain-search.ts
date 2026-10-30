import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const search: HunterioEndpoints['domainSearchSearch'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.domainSearchSearch.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['domainSearchSearch']
	>('/domain-search', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.domainSearchSearch.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.domainSearch.search',
		{},
		'completed',
	);

	return parsedResponse;
};

export const searchPost: HunterioEndpoints['domainSearchSearchPost'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.domainSearchSearchPost.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['domainSearchSearchPost']
	>('/domain-search', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.domainSearchSearchPost.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.domainSearch.searchPost',
		{},
		'completed',
	);

	return parsedResponse;
};

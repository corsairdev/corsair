import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

// Free. Plans without opportunities (Free, Data Platform) get 403
// `no_opportunities_access`.
export const list: HunterioEndpoints['opportunitiesList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.opportunitiesList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['opportunitiesList']
	>('/opportunities', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.opportunitiesList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.opportunities.list',
		{},
		'completed',
	);

	return parsedResponse;
};

export const results: HunterioEndpoints['opportunitiesResults'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.opportunitiesResults.parse(input);
	const { id, ...query } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['opportunitiesResults']
	>(`/opportunities/${id}/results`, ctx.key, { method: 'GET', query });

	const parsedResponse =
		HunterioEndpointOutputSchemas.opportunitiesResults.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.opportunities.results',
		{ id },
		'completed',
	);

	return parsedResponse;
};

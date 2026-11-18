import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const get: HunterioEndpoints['sequenceStatsGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.sequenceStatsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['sequenceStatsGet']
	>(`/sequences/${parsed.id}/stats`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.sequenceStatsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.sequenceStats.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

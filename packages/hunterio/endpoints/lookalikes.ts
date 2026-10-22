import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import { toBracketQuery } from './query';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['lookalikesList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.lookalikesList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['lookalikesList']
	>('/lookalikes', ctx.key, { method: 'GET', query: toBracketQuery(parsed) });

	const parsedResponse =
		HunterioEndpointOutputSchemas.lookalikesList.parse(response);

	await logEventFromContext(ctx, 'hunterio.lookalikes.list', {}, 'completed');

	return parsedResponse;
};

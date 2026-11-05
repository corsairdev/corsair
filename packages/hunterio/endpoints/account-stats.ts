import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const get: HunterioEndpoints['accountStatsGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.accountStatsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['accountStatsGet']
	>('/account-stats', ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.accountStatsGet.parse(response);

	await logEventFromContext(ctx, 'hunterio.accountStats.get', {}, 'completed');

	return parsedResponse;
};

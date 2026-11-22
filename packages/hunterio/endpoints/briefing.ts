import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

// Free. Counts what needs attention (lead and Monitored Signals events,
// this week's opportunities) plus the account's credits; each item names
// the follow-up call in `next_call`. Marks nothing as seen.
export const get: HunterioEndpoints['briefingGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.briefingGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['briefingGet']
	>('/briefing', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.briefingGet.parse(response);

	await logEventFromContext(ctx, 'hunterio.briefing.get', {}, 'completed');

	return parsedResponse;
};

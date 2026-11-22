import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

// Free. Signal events from the last 30 days, newest first, paged by
// cursor. `types` is sent as repeated `types=` keys, which the API accepts.
export const list: HunterioEndpoints['signalsList'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.signalsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['signalsList']
	>('/signals', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.signalsList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.signals.list',
		{ source: parsed.source },
		'completed',
	);

	return parsedResponse;
};

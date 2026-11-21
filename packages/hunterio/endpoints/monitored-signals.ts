import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

// Free. The team's funding signals, job openings signals and company follows.
export const list: HunterioEndpoints['monitoredSignalsList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.monitoredSignalsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['monitoredSignalsList']
	>('/monitored-signals', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.monitoredSignalsList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.monitoredSignals.list',
		{},
		'completed',
	);

	return parsedResponse;
};

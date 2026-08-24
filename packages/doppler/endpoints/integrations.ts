import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/** Lists third-party integrations connected to the workplace. */
export const list: DopplerEndpoints['integrationsList'] = async (ctx) => {
	const result = await dopplerCall<{
		integrations: DopplerEndpointOutputs['integrationsList'];
	}>(ctx, 'integrations');

	await logEventFromContext(
		ctx,
		'doppler.integrations.list',
		{ returned: result.integrations.length },
		'completed',
	);
	return result.integrations;
};

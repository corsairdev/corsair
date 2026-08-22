import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getQueues: BeaconchainEndpoints['getQueues'] = async (
	ctx,
	_input,
) => {
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		'queues',
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'beaconchain.queues.get', {}, 'completed');
	return res;
};

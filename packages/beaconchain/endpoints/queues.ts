import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainV2Request } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getQueues: BeaconchainEndpoints['getQueues'] = async (
	ctx,
	_input,
) => {
	const res = await makeBeaconchainV2Request<BeaconchainBaseResponse>(
		'ethereum/queues',
		ctx.key,
		{
			method: 'POST',
			body: {
				chain: 'mainnet',
			},
		},
	);
	await logEventFromContext(ctx, 'beaconchain.queues.get', {}, 'completed');
	return res;
};
